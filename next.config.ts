import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour la production
  serverExternalPackages: ['mongoose'],
  // Optimisation des images
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Variables d'environnement (optionnel, Vercel les gère automatiquement)
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  }
};

export default nextConfig;
