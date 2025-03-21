/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Thêm cấu hình cho Vercel
  output: 'standalone',
};

export default nextConfig;


