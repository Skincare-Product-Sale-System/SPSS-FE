"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BlogDetailContent from "@/components/blog/BlogDetailContent";
import request from "@/utils/axios";
import { Container, Typography } from "@mui/material";
import Link from "next/link";

export default function BlogDetailPage() {
  const id = usePathname().split("/")[2];
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    request.get(`/blogs/${id}`).then(({ data }) => {
      setBlog(data.data);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching blog:", error);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontFamily: 'Playfair Display, serif' }}>Đang tải nội dung bài viết...</Typography>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontFamily: 'Playfair Display, serif' }}>Không tìm thấy bài viết</Typography>
        <Link href="/blog" className="btn-fill mt-4 tf-btn">
          Quay lại Trang Bài Viết
        </Link>
      </Container>
    );
  }

  return <BlogDetailContent blog={blog} />;
} 