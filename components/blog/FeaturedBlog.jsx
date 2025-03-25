"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedBlog({ blog }) {
  if (!blog) return null;
  
  return (
    <div className="mb-20 relative">
      <div className="h-[500px] w-full relative">
        <Image
          className="h-full rounded-lg w-full object-cover"
          src={blog?.thumbnail}
          alt={blog?.title}
          width={1200}
          height={500}
          priority
        />
        
        {/* White box on the left side */}
        <div className="-translate-y-1/2 absolute left-16 max-w-md top-1/2">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <Link href={`/blog/${blog?.id}`}>
              <h2 className="text-3xl text-gray-900 font-bold hover:text-primary mb-5 transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
                {blog?.title}
              </h2>
            </Link>
            <div className="flex items-center">
              <div className="flex text-gray-600 items-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <span className="font-medium">{blog?.authorName || "Quản trị viên"}</span>
                <span className="text-gray-400 mx-2">•</span>
                <span>
                  {blog?.lastUpdatedTime ? new Date(blog.lastUpdatedTime).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 