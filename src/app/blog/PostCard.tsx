'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/lib/blog'

/** Animated blog post card — client-only (Framer Motion scroll-triggered reveal). */
export function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      className="glass rounded-2xl p-6 md:p-8 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
    >
      {/* Date */}
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

      {/* Title */}
      <h2 className="mt-2 text-2xl md:text-3xl font-bold font-heading text-white group-hover:text-accent transition-colors">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>

      {/* Excerpt */}
      <p className="mt-3 text-cloud leading-relaxed">{post.excerpt}</p>

      {/* Read more */}
      <Link
        href={`/blog/${post.slug}`}
        className="
          mt-4 inline-flex items-center gap-2
          text-accent text-sm font-semibold
          hover:gap-3 transition-all
          focus:outline-none focus-visible:underline
        "
      >
        Read More
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </motion.article>
  )
}
