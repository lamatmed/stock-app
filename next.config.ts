/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    serverActions: true, // Active les routes API Next.js
  },
};

module.exports = nextConfig;
