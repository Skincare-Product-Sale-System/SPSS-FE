"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";
import request from "@/utils/axios";
import { useSearchParams } from "next/navigation";

const BlogDetailContent = dynamic(
  () => import("@/components/blog/BlogDetailContent"),
  { ssr: false }
);

export default function BlogDetailPage() {
  const mainColor = useThemeColors();
  const searchParams = useSearchParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const id = searchParams.get("id");
        if (!id) {
          throw new Error('Invalid blog ID');
        }

        const response = await request.get(`/blogs/${id}`);
        const blogData = response.data.data;
        setBlog(blogData);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const id = searchParams.get("id");
    if (id) {
      fetchBlog();
    }
  }, [searchParams]);

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

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Blog Details</div>
        </div>
      </div>

      <div className="container-full lg:w-11/12 mx-auto px-4 py-6">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-60">
              <CircularProgress sx={{ color: mainColor }} />
            </div>
          }
        >
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <CircularProgress sx={{ color: mainColor }} />
            </div>
          ) : (
            <BlogDetailContent blog={blog} />
          )}
        </Suspense>
      </div>
    </>
  );
} 