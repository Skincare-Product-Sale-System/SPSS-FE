"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

const BlogDetailContent = dynamic(
  () => import("@/components/blog/BlogDetailContent"),
  { ssr: false }
);

export default function BlogDetailPage() {
  const mainColor = useThemeColors();

  return (
    <>
      <div className="container-full lg:w-11/12 mx-auto px-4 py-6">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-60">
              <CircularProgress sx={{ color: mainColor }} />
            </div>
          }
        >
          <BlogDetailContent />
        </Suspense>
      </div>
    </>
  );
} 