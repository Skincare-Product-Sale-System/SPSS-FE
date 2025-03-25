"use client";
import React from "react";
import BlogItem from "./BlogItem";

export default function BlogList({ blogs }) {
  return (
    <>
      {/* Latest Posts Heading */}
      <h2 className="border-b border-gray-200 text-2xl font-bold mb-8 pb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Bài Viết Mới Nhất</h2>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {blogs?.map((blog, index) => (
          <BlogItem key={blog.id || index} blog={blog} index={index} />
        ))}
      </div>
    </>
  );
} 