import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs, getAllPosts, type BlogPost } from '@/lib/blog'
import Link from 'next/link'

// Pre-render all post pages at build time
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

/** Build article-level JSON-LD structured data */
function ArticleJsonLd(post: BlogPost | null) {
  if (!post) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.excerpt,
    url: `https://truestylez.com/blog/${post.slug}`,
    author: {
      '@type': 'Person',
      name: 'Jonathan',
      jobTitle: 'Master Barber',
    },
    publisher: {
      '@type': 'LocalBusiness',
      name: 'True Stylez Hair Studio',
      url: 'https://truestylez.com',
    },
    inLanguage: 'en-US',
  }
}

export async function generateMetadata(
  { params }: BlogPostPageProps,
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.title} — True Stylez Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://truestylez.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  // Related posts (same category via keywords — or just next 2 newest)
  const allPosts = getAllPosts()
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 2)

  const articleLd = ArticleJsonLd(post)

  return (
    <>
      {/* ─── JSON-LD Structured Data ─────────────────────────────────── */}
      {articleLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd, null, 2) }}
        />
      )}

      <main className="relative min-h-screen py-24 md:py-32 px-4">
        <article className="max-w-3xl mx-auto">
          {/* ─── Back link ────────────────────────────────────────────── */}
          <Link
            href="/blog"
            className="
              inline-flex items-center gap-2
              text-mist text-sm mb-10
              hover:text-accent transition-colors
              focus:outline-none focus-visible:underline
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Posts
          </Link>

          {/* ─── Post header ──────────────────────────────────────────── */}
          <header className="mb-10">
            <time
              className="text-xs font-semibold tracking-[0.15em] uppercase text-gold-400"
              dateTime={post.date}
            >
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h1 className="mt-3 text-3xl md:text-5xl font-bold font-heading text-white leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-cloud leading-relaxed">{post.excerpt}</p>
          </header>

          {/* ─── Decorative accent line ────────────────────────────────── */}
          <div className="w-16 h-1 bg-gradient-to-r from-gold-500 to-transparent rounded-full mb-10" aria-hidden="true" />

          {/* ─── Prose ─────────────────────────────────────────────────── */}
          <div
            className="
              prose prose-invert
              max-w-none
              text-cloud leading-relaxed
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
            itemProp="articleBody"
          />

          {/* ─── Related posts ─────────────────────────────────────────── */}
          {related.length > 0 && (
            <aside className="mt-16 pt-10 border-t border-smoke/50">
              <h2 className="text-xl font-bold font-heading text-white mb-6">
                Continue Reading
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {related.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="glass rounded-xl p-5 group hover:border-gold-500/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  >
                    <time className="text-xs text-mist">{rp.date}</time>
                    <h3 className="mt-1 text-base font-semibold font-heading text-white group-hover:text-accent transition-colors">
                      {rp.title}
                    </h3>
                    <p className="mt-1 text-sm text-mist line-clamp-2">{rp.excerpt}</p>
                  </Link>
                ))}
              </div>
            </aside>
          )}
        </article>
      </main>
    </>
  )
}
