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
    const reactPath = path.resolve(__dirname, 'node_modules/react');
    const reactDomPath = path.resolve(__dirname, 'node_modules/react-dom');
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': reactPath,
      'react-dom': reactDomPath,
      'react/jsx-runtime': path.join(reactPath, 'jsx-runtime.js'),
      'react-dom/client': path.join(reactDomPath, 'client.js'),
    };
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
