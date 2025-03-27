"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogItem({ blog, index }) {
  return (
    <div className="rounded-lg shadow-sm duration-300 hover:shadow-md overflow-hidden transition-all">
      <Link href={`/blog/detail?id=${blog?.id}`} className="block">
        <div className="h-56 relative">
          <Image
            className="h-full w-full object-cover"
            src={blog?.thumbnail}
            alt={blog?.title}
            width={400}
            height={240}
            priority={index < 3}
          />
          {/* Optional category badge */}
          {blog?.category && (
            <span className="bg-primary rounded text-white text-xs absolute left-3 px-2 py-1 top-3">
              {blog.category}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/blog/detail?id=${blog?.id}`} className="block">
          <h3 className="text-lg font-bold hover:text-primary line-clamp-2 mb-2 transition-colors" style={{ fontFamily: 'Playfair Display, serif' }}>
            {blog?.title}
          </h3>
        </Link>
        <div className="flex text-gray-500 text-sm items-center mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
          <div className="flex items-center">
            <span>{blog?.authorName || "Quản trị viên"}</span>
          </div>
          <span className="mx-2">•</span>
          <span>
            {blog?.lastUpdatedTime ? new Date(blog.lastUpdatedTime).toLocaleDateString('vi-VN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : ""}
          </span>
        </div>
        {blog?.blogContent && (
          <p className="text-gray-600 line-clamp-2 mb-3" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {blog?.blogContent}
          </p>
        )}
      </div>
    </div>
  );
} 