/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["utfs.io", "via.placeholder.com"], // Ajoute les domaines pour les images distantes si nécessaire
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
