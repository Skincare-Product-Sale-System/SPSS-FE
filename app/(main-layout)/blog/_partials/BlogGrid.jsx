"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blogs";
import request from "@/utlis/axios";
export default function BlogGrid() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    request.get("/blogs").then(({ data }) => {
      setBlogs(data.data.items);
    });
  }, []);

  return (
    <div className="blog-grid-main">
      <div className="container">
        <div className="row">
          {blogs?.map((blog, index) => (
            <div className="col-xl-4 col-md-6 col-12" key={blog.id || index}>
              <div className="blog-article-item shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                <div className="article-thumb">
                  <Link href={`/blog/${blog?.id}`}>
                    <Image
                      className="w-full h-auto object-cover"
                      src={blog?.thumbnail}
                      alt={blog?.title}
                      width={550}
                      height={354}
                      priority={index < 3}
                    />
                  </Link>
                </div>
                <div className="article-content p-4">
                  <div className="article-title mb-3">
                    <Link href={`/blog/${blog?.id}`} className="text-xl font-medium hover:text-primary transition-colors">
                      {blog?.title}
                    </Link>
                  </div>
                  {blog?.blogContent && (
                    <div className="article-excerpt text-gray-600 mb-4 line-clamp-3">
                      {blog?.blogContent}
                    </div>
                  )}
                  <div className="article-meta flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <span className="material-icons text-primary mr-1" style={{ fontSize: '16px' }}>By</span>
                      {blog?.author || "Admin"}
                    </span>
                    <span className="flex items-center">
                      <span className="material-icons text-primary mr-1" style={{ fontSize: '16px' }}>Last Updated</span>
                      {blog?.lastUpdatedTime ? new Date(blog.lastUpdatedTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : ""}
                    </span>
                  </div>
                  <div className="article-btn">
                    <Link
                      href={`/blog/${blog?.id}`}
                      className="tf-btn btn-line fw-6 hover:text-primary transition-colors"
                    >
                      Read more
                      <i className="icon icon-arrow1-top-left ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
