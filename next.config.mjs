/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Các tùy chọn build
  distDir: '.next',
  // Di chuyển các thuộc tính từ experimental lên cấp cao hơn
  skipTrailingSlashRedirect: true,
  serverExternalPackages: [],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Bỏ qua lỗi khi sao chép file
  onDemandEntries: {
    // Tăng thời gian giữ các trang đã tạo trong bộ nhớ đệm
    maxInactiveAge: 60 * 60 * 1000,
    // Số trang giữ trong bộ nhớ
    pagesBufferLength: 5,
  },
  // Bỏ qua lỗi không sao chép được file
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
