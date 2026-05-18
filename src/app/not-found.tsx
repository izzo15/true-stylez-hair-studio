import Link from 'next/link'
import { motion } from 'framer-motion'

export const metadata = {
  title: "Page Not Found | True Stylez Hair Studio",
  description: "The page you're looking for doesn't exist. Return to the homepage or contact us.",
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <motion.span 
          className="text-9xl font-bold text-accent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          4
        </motion.span>
        
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl scissor-spin"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          ✂️
        </motion.div>
        
        <motion.span 
          className="text-9xl font-bold text-accent"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          4
        </motion.span>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="text-2xl font-bold mt-8 mb-4">Snip! Page Not Found</h2>
        <p className="text-gray-400 mb-6">This page got cut. Let's get you back.</p>
        <Link href="/" className="px-6 py-2 bg-accent text-white rounded-full">
          Back to Stylez
        </Link>
      </motion.div>
    </div>
  )
}