const path = require('path');

const reactPath = require.resolve('react');
const reactDOMPath = require.resolve('react-dom');
const jsxRuntimePath = require.resolve('react/jsx-runtime');
const clientPath = require.resolve('react-dom/client');
const serverPath = require.resolve('react-dom/server');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'instagram.falb.fna.fbcdn.net' },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': reactPath,
      'react-dom': reactDOMPath,
      'react/jsx-runtime': jsxRuntimePath,
      'react-dom/client': clientPath,
      'react-dom/server': serverPath,
    };
    
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^react-dom\/client$/,
        clientPath
      ),
      new webpack.NormalModuleReplacementPlugin(
        /^react\/jsx-runtime$/,
        jsxRuntimePath
      )
    );
    
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'true-stylez-hair-studio.vercel.app']
    }
  },
  trailingSlash: false,
  transpilePackages: ['@react-three/drei', '@react-three/fiber', 'next-auth'],
};

module.exports = nextConfig;