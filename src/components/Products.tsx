'use client'

import { motion } from 'framer-motion'
import { products, type Product } from '@/data/products'

/**
 * ProductCard
 *
 * Single product card rendered inside the Products grid.
 * Uses the glass-morphism + scan-overlay + btn-futuristic design language.
 */
function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      className="glass relative rounded-2xl overflow-hidden group"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Scan overlay on hover */}
      <div className="scan-overlay" aria-hidden="true" />

      {/* ─── Product image ─────────────────────────────────────────────── */}
      <div className="aspect-square overflow-hidden bg-obsidian-900">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={`${product.name} by ${product.brand}`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-smoke-light bg-gradient-to-br from-obsidian-800 to-obsidian-900">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-mist"
              aria-hidden="true"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.29 7 12 12 20.71 7" />
              <line x1="12" y1="22" x2="12" y2="12" />
            </svg>
          </div>
        )}
      </div>

      {/* ─── Card body ────────────────────────────────────────────────── */}
      <div className="p-5 space-y-2">
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-gold-400">
          {product.brand}
        </span>
        <h3 className="text-lg font-bold font-heading text-white leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-cloud leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-accent font-bold text-lg">{product.price}</span>
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              bg-clove/10 border border-clove/40
              text-clove-light text-sm font-semibold
              px-4 py-2 rounded-lg
              hover:bg-clove/20 transition-colors
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-clove focus-visible:ring-offset-1
              focus-visible:ring-offset-obsidian-800
            "
          >
            Shop Now &rarr;
          </a>
        </div>
      </div>
    </motion.article>
  )
}

/**
 * Products
 *
 * Responsive grid of grooming product recommendations.
 * Renders 2 columns on mobile, 3 on desktop, matching the existing layout system.
 */
export function Products() {
  return (
    <section className="py-24 md:py-32 px-4 bg-primary-800/30" aria-labelledby="products-heading">
      <div className="max-w-6xl mx-auto">
        {/* ─── Section heading ─────────────────────────────────────────── */}
        <div className="mb-14 text-center">
          <p className="text-accent text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            Gear We Use
          </p>
          <h2 id="products-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading">
            Grooming Essentials
          </h2>
          <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Jonathan&apos;s go-to products for the perfect cut and daily maintenance.
          </p>
        </div>

        {/* ─── Product grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
