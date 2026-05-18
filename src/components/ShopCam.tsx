'use client'

import { motion } from 'framer-motion'

export function ShopCam() {
  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-center mb-6">Shop Cam</h3>
      <div className="relative h-64 rounded-2xl overflow-hidden glass">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-2 w-full h-full p-4">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-primary-800 rounded-lg overflow-hidden relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent"></div>
                <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                  Clip #{i + 1}
                </div>
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-accent rounded"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}