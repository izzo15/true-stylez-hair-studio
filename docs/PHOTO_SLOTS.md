# Photo & video slots

Every place on the site currently using a placeholder instead of real photo/video, and exactly what to change when it's ready. None of these require touching component logic — just supply a URL/path.

| # | Section | File | How to fill it | Aspect |
|---|---------|------|-----------------|--------|
| 1 | Hero background wash | `src/components/Hero/HeroContent.tsx` (`bg-[url(...)]` on the background div) | Replace `/textures/barber-bg.jpg` with a real shop/chair photo. It renders at `opacity-30` as a background tint, so a busy photo still works. | Full-bleed, any |
| 2 | The Craft (3 items) | `src/components/sections/TheCraft.tsx`, `CRAFT_ITEMS` array | Set `image` (and optionally `imageAlt`) on each item. Omitting it keeps the current gradient + line-art icon placeholder. | 4:3 |
| 3 | Before/After transformation | `src/app/page.tsx`, the `<BeforeAfterSlider>` call | Replace the `beforeContent`/`afterContent` placeholder-panel props with `beforeImg`/`afterImg` URL strings (and remove `isSample`). | 4:3 |
| 4 | Barber polaroid | `src/components/sections/LivingPolaroid.tsx`, `BarberProfile()` | Pass a `photoUrl` prop. Omitting it keeps the gold "J" monogram placeholder. | Square |
| 5 | Products (6 items) | `src/data/products.ts` | Set each product's `imageUrl`. Empty string keeps the SVG silhouette fallback already built into `Products.tsx`. | Square |
| 6 | Blog cover images (4 posts) | `src/content/blog/*.md` frontmatter, `coverImage` field | All 4 posts already have this field (currently empty) but it isn't rendered in the blog UI yet — wiring up cover art in `src/app/blog/page.tsx` / `blog/[slug]/page.tsx` is worth doing once real images exist, since right now filling the field alone won't change anything. | 16:9 recommended |
| 7 | Open Graph / social share image | `src/app/opengraph-image.tsx` | Currently code-generated (brand wordmark on a clove/gold/obsidian gradient) via Next's `ImageResponse` — no file needed. Swap this file for a real designed image if you want an actual photo in link previews. | 1200×630 |

Everything above degrades gracefully today — no broken images, no layout shift, no misleading "0 reviews" style claims. Filling a slot is a one-line change per row.

## Video slots — shop clips ("Live" grid)

| # | Section | File | How to fill it |
|---|---------|------|-----------------|
| 8 | 3×3 "Live" clip grid | `src/data/videos.ts`, `shopClips` array | Add `{ id: 1-9, src: '/videos/your-clip.mp4', poster?: '/videos/your-clip-poster.jpg', caption?: '...' }` per clip. Any slot (1-9) without a matching entry keeps the placeholder scanning animation, so you can roll clips out a few at a time. |

**Where to put the files:** drop video files in `public/videos/`. **Source:** since these are Jonathan's own TikTok videos, export/download them directly from TikTok (Share → Save video) rather than scraping — that's the only approach that doesn't depend on a third-party site staying up or fighting bot detection. A poster/thumbnail image is optional but avoids a blank first frame before the clip is clicked; if omitted, a plain gradient placeholder is shown instead. Keep files reasonably compressed (TikTok exports are already a manageable size, typically well under 20MB per clip) since all 9 could theoretically be requested on one page load.
