"use client";
import BlogContent from "@/components/blog/BlogContent";
import { Suspense } from "react";

const BlogLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function BlogPage() {
  return (
    <section className="flat-spacing-2">
      <div className="container">
        <Suspense fallback={<BlogLoading />}>
          <BlogContent />
        </Suspense>
      </div>
    </section>
  );
} 