/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Optional: Add images domain if you're using external images
  images: {
    domains: ['images.unsplash.com'], // Add your image domains here
  },
  // Optional: Enable experimental features if needed
  experimental: {
    appDir: true,
    serverActions: true,
  }
};

module.exports = nextConfig;