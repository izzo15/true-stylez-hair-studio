// Visual + functional QA script — run against a local `next dev` server.
// Usage: node scripts/visual-qa.mjs
// Requires: npm install -D playwright && npx playwright install chromium
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
import path from 'path'

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000'
const OUT_DIR = path.join(process.cwd(), '.qa-screenshots')
mkdirSync(OUT_DIR, { recursive: true })

const DESKTOP = { width: 1440, height: 900 }
const MOBILE = { width: 390, height: 844 }

const results = []
function record(name, ok, detail) {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`)
}

async function main() {
  const browser = await chromium.launch()

  // ── 1. Full-page screenshots across key routes, desktop + mobile ─────────
  const routes = ['/', '/blog', '/blog/meet-jonathan-the-hands-behind-j-the-barber', '/not-found-qa-check', '/admin']
  for (const viewportName of ['desktop', 'mobile']) {
    const viewport = viewportName === 'desktop' ? DESKTOP : MOBILE
    const context = await browser.newContext({ viewport })
    for (const route of routes) {
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      try {
        await page.goto(`${BASE_URL}${route}`, { waitUntil: 'load', timeout: 45000 })
        await page.locator('nav, footer').first().waitFor({ state: 'attached', timeout: 15000 }).catch(() => {})
        await page.waitForTimeout(500)
        const fileSafe = route === '/' ? 'home' : route.replace(/\//g, '_')
        await page.screenshot({ path: path.join(OUT_DIR, `${viewportName}${fileSafe}.png`), fullPage: true })

        // Confirm nav + footer are present on every route (root layout fix)
        const navCount = await page.locator('nav[aria-label="Site navigation"], nav[aria-label="Primary navigation"]').count()
        const footerCount = await page.locator('footer').count()
        record(`${viewportName} ${route} — nav present`, navCount > 0)
        record(`${viewportName} ${route} — footer present`, footerCount > 0)
        record(`${viewportName} ${route} — no runtime errors`, errors.length === 0, errors.join('; '))
      } catch (e) {
        record(`${viewportName} ${route} — load`, false, e.message)
      } finally {
        await page.close()
      }
    }
    await context.close()
  }

  // ── 1b. Homepage scroll-through (GSAP ScrollTrigger only fires on real
  //       scroll, so a single full-page screenshot leaves those sections
  //       stuck at their pre-animation state — scroll in steps instead) ────
  {
    const context = await browser.newContext({ viewport: DESKTOP })
    const page = await context.newPage()
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 45000 })
    await page.waitForTimeout(1000)
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight)
    const steps = Math.ceil(scrollHeight / DESKTOP.height)
    for (let i = 0; i <= steps; i++) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), i * DESKTOP.height * 0.9)
      await page.waitForTimeout(400)
      await page.screenshot({ path: path.join(OUT_DIR, `home-scroll-${String(i).padStart(2, '0')}.png`) })
    }
    await context.close()
  }

  // ── 2. Mobile: ChatToggle vs MobileBookCTA collision check ───────────────
  {
    const context = await browser.newContext({ viewport: MOBILE })
    const page = await context.newPage()
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 45000 })
    const toggle = page.locator('button[aria-label*="chat" i]').first()
    const bookCta = page.locator('button[aria-label="Book your appointment now"]')
    await toggle.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    await bookCta.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    if (await toggle.count() && await bookCta.count()) {
      const toggleBox = await toggle.boundingBox()
      const bookBox = await bookCta.boundingBox()
      const overlap = toggleBox && bookBox &&
        toggleBox.y < bookBox.y + bookBox.height &&
        toggleBox.y + toggleBox.height > bookBox.y
      record('mobile ChatToggle does not overlap MobileBookCTA', !overlap,
        `toggle y:${toggleBox?.y}-${toggleBox?.y + toggleBox?.height}, bookCta y:${bookBox?.y}-${bookBox?.y + bookBox?.height}`)
      await page.screenshot({ path: path.join(OUT_DIR, 'mobile_chat-vs-bookcta.png') })
    } else {
      record('mobile ChatToggle does not overlap MobileBookCTA', false, 'one or both elements not found')
    }
    await context.close()
  }

  // ── 3. Before/After slider — drag and confirm visible difference ─────────
  {
    const context = await browser.newContext({ viewport: DESKTOP })
    const page = await context.newPage()
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 45000 })
    const handle = page.locator('[role="slider"][aria-label*="Drag left or right"]')
    const sliderContainer = page.locator('[aria-label="Before and after image comparison slider"]')
    if (await handle.count()) {
      await sliderContainer.screenshot({ path: path.join(OUT_DIR, 'slider_before-drag.png') })
      await handle.focus()
      for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowLeft')
      await sliderContainer.screenshot({ path: path.join(OUT_DIR, 'slider_after-drag-left.png') })
      const valueNow = await handle.getAttribute('aria-valuenow')
      record('before/after slider responds to keyboard drag', Number(valueNow) < 50, `aria-valuenow=${valueNow}`)
    } else {
      record('before/after slider responds to keyboard drag', false, 'slider handle not found')
    }
    await context.close()
  }

  // ── 4. Services card click -> BookingWidget prefill ───────────────────────
  {
    const context = await browser.newContext({ viewport: DESKTOP })
    const page = await context.newPage()
    await page.goto(`${BASE_URL}/`, { waitUntil: 'load', timeout: 45000 })
    await page.waitForSelector('#services [role="radiogroup"], #services .grid', { timeout: 10000 }).catch(() => {})
    await page.waitForTimeout(1500) // services fetch
    const firstService = page.locator('#services > div > div.grid > div, #services div[class*="cursor-pointer"]').first()
    const serviceCount = await firstService.count()
    if (serviceCount) {
      const serviceName = (await firstService.locator('h4').textContent().catch(() => null)) || ''
      await firstService.click()
      await page.waitForTimeout(800)
      const selectedRadio = page.locator('#book [role="radio"][aria-checked="true"]')
      const selectedCount = await selectedRadio.count()
      const selectedText = selectedCount ? await selectedRadio.first().textContent() : null
      record('clicking a Services card preselects it in BookingWidget', selectedCount > 0,
        `clicked "${serviceName.trim()}", booking widget shows: "${selectedText?.trim()}"`)
      await page.screenshot({ path: path.join(OUT_DIR, 'services-click-prefill.png') })
    } else {
      record('clicking a Services card preselects it in BookingWidget', false, 'no service cards rendered (DB may not be seeded)')
    }
    await context.close()
  }

  // ── 5. sitemap.xml — single clean response with dynamic blog slugs ───────
  {
    const context = await browser.newContext()
    const page = await context.newPage()
    const res = await page.goto(`${BASE_URL}/sitemap.xml`)
    const body = await res.text()
    const slugs = ['5-fade-styles-for-summer-2026', 'how-to-maintain-your-beard-between-cuts', 'meet-jonathan-the-hands-behind-j-the-barber', 'the-difference-between-taper-fade-and-skin-fade']
    const allPresent = slugs.every((s) => body.includes(s))
    record('sitemap.xml returns 200 with all blog slugs', res.status() === 200 && allPresent, `status=${res.status()}`)
    await context.close()
  }

  await browser.close()

  console.log('\n--- Summary ---')
  const failed = results.filter((r) => !r.ok)
  console.log(`${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) {
    console.log('Failures:')
    failed.forEach((f) => console.log(`  - ${f.name}${f.detail ? `: ${f.detail}` : ''}`))
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
