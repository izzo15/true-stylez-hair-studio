import { getAllPosts } from '@/lib/blog'
import { PostCard } from './PostCard'

/**
 * Blog List Page — server component. `getAllPosts()` reads the filesystem
 * (Node `fs`), so this must stay server-only; the animated cards are a
 * separate client component (PostCard).
 */
export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto">
      {/* ─── Page heading ─────────────────────────────────────────────────── */}
      <header className="mb-14 text-center">
        <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">
          From the Chair
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading">
          Tips &amp; Insights
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Expert barbering advice, grooming hacks, and behind-the-scenes stories from Jonathan at True Stylez.
        </p>
      </header>

      {/* ─── Post list ─────────────────────────────────────────────────────── */}
      {posts.length === 0 ? (
        <p className="text-center text-mist">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-8">
          {posts.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
