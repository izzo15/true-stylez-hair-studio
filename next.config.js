/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Fix for face-api.js missing modules
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'encoding': false,
      'fs': false,
    };
    return config;
  }
};

module.exports = nextConfig;