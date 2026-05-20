const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'instagram.falb.fna.fbcdn.net' },
    ],
  },
  webpack: (config) => {
    return config;
  },
  // Experimental config to avoid Node 24 compatibility issues
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'true-stylez-hair-studio.vercel.app']
    }
  },
  // Skip prerendering for API routes
  trailingSlash: false,
};

module.exports = nextConfig;
