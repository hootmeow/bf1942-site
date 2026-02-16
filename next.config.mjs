/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['recharts', 'lucide-react'],
  },
  // Add this 'async rewrites' function
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*', // This one rule handles everything under /api/v1/
        destination: `${process.env.API_URL}:path*`, // The real API server
      },
    ];
  },
};

export default nextConfig;