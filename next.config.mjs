/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Thêm cấu hình cho Vercel
  output: 'standalone',
};

export default nextConfig;
