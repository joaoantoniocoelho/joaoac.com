/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['medium.com', 'cdn-images-1.medium.com', 'miro.medium.com'],
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  // Enable compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Transpile certain modules for better performance
  transpilePackages: ['three'],
  // Experimental features for performance optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'react-icons',
      '@radix-ui/react-icons',
      'framer-motion',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
};

module.exports = nextConfig;
