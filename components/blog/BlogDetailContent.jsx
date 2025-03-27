"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import request from "@/utils/axios";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useThemeColors } from "@/context/ThemeContext";
import { Container, Typography } from "@mui/material";
import BlogDetailHeader from "./BlogDetailHeader";
import BlogSection from "./BlogSection";
import BlogFooter from "./BlogFooter";

export default function BlogDetailContent() {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const blogId = searchParams.get("id");
  const mainColor = useThemeColors();

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) {
        router.push("/blog");
        return;
      }
      
      try {
        const response = await request.get(`/blogs/${blogId}`);
        setBlog(response.data.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, router]);

  if (error) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <CircularProgress sx={{ color: mainColor }} />
      </div>
    );
  }

  // Sort sections by order
  const sortedSections = blog.sections?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="relative">
      <Link 
        href="/blog"
        className="absolute left-4 top-0 text-gray-600 hover:text-primary"
      >
        <ArrowBackIcon />
      </Link>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <BlogDetailHeader blog={blog} />
        
        {sortedSections.map((section, index) => (
          <BlogSection key={index} section={section} />
        ))}
        
        <BlogFooter />
      </Container>
    </div>
  );
} 