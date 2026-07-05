import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://truestylez.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url      : baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url      : `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Dynamically add each blog post as its own entry
  const blogRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url         : `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority    : 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
