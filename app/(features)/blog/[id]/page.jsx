import BlogDetailPage from "@/pages/BlogDetailPage";
import request from "@/utils/axios";
import { Suspense } from "react";

export const metadata = {
  title: "Blog Details | Skincare Store",
  description: "Read our latest skincare tips and news",
};

const BlogLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default async function BlogPage({ params }) {
  const { id } = params;
  
  try {
    const response = await request.get(`/blogs/${id}`);
    const blog = response.data.data;
    
    return (
      <Suspense fallback={<BlogLoading />}>
        <BlogDetailPage blog={blog} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return (
      <div className="container text-center my-12 py-8">
        <h2 className="text-2xl font-medium mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Không thể tải bài viết
        </h2>
        <p className="mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Đã xảy ra lỗi khi tải bài viết. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }
}
