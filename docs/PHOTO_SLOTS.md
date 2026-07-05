# Photo slots

Every place on the site currently using a placeholder instead of a real photo, and exactly what to change when real photography is ready. None of these require touching component logic — just supply a URL/path.

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
