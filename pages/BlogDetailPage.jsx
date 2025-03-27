"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BlogDetailContent from "@/components/blog/BlogDetailContent";
import request from "@/utils/axios";
import { Container, Typography } from "@mui/material";
import Link from "next/link";
import { Suspense } from "react";

const BlogLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function BlogDetailPage({ blog }) {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogDetailContent blog={blog} />
    </Suspense>
  );
} 