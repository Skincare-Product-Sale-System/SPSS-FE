/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Thêm cấu hình cho Vercel
  output: 'standalone',
};

export default nextConfig;
