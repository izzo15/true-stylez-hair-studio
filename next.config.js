/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'instagram.falb.fna.fbcdn.net',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
}