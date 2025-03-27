"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

const BlogDetailContent = dynamic(
  () => import("@/components/blog/BlogDetailContent"),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-60">
        <CircularProgress />
      </div>
    )
  }
);

export default function BlogDetailPage({ blog }) {
  const mainColor = useThemeColors();

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-60">
          <CircularProgress sx={{ color: mainColor }} />
        </div>
      }
    >
      <BlogDetailContent blog={blog} />
    </Suspense>
  );
} 