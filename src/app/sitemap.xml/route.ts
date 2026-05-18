import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jthebarber.com'
  const currentDate = new Date().toISOString()

  const pages = [
    {
      url: '/',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 1.0,
    },
    {
      url: '/#services',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      url: '/#barbers',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8,
    },
    {
      url: '/#book',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      url: '/#reviews',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6,
    },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}