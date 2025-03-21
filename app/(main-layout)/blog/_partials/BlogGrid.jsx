"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blogs";
import request from "@/utils/axios";
export default function BlogGrid() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    request.get("/blogs").then(({ data }) => {
      setBlogs(data.data.items);
    });
  }, []);

  const latestBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  return (
    <div className="blog-grid-main py-10">
      <div className="container mx-auto px-4">
        {/* Featured Banner Blog */}
        {latestBlog && (
          <div className="mb-20 relative">
            <div className="h-[500px] w-full relative">
              <Image
                className="h-full rounded-lg w-full object-cover"
                src={latestBlog?.thumbnail}
                alt={latestBlog?.title}
                width={1200}
                height={500}
                priority
              />
              
              {/* White box on the left side */}
              <div className="-translate-y-1/2 absolute left-16 max-w-md top-1/2">
                <div className="bg-white p-8 rounded-lg shadow-xl">
                  <Link href={`/blog/${latestBlog?.id}`}>
                    <h2 className="text-3xl text-gray-900 font-bold hover:text-primary mb-5 transition-colors">
                      {latestBlog?.title}
                    </h2>
                  </Link>
                  <div className="flex items-center">
                    {/* <div className="h-10 rounded-full w-10 mr-3 overflow-hidden">
                      <Image 
                        src={latestBlog?.authorAvatar || "/assets/images/default-avatar.png"} 
                        alt={latestBlog?.authorName || "Quản trị viên"}
                        width={40}
                        height={40}
                      />
                    </div> */}
                    <div className="flex text-gray-600 items-center">
                      <span className="font-medium">{latestBlog?.authorName || "Quản trị viên"}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span>
                        {latestBlog?.lastUpdatedTime ? new Date(latestBlog.lastUpdatedTime).toLocaleDateString('vi-VN', {
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
        )}

        {/* Latest Posts Heading */}
        <h2 className="border-b border-gray-200 text-2xl font-bold mb-8 pb-3">Bài Viết Mới Nhất</h2>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {otherBlogs?.map((blog, index) => (
            <div key={blog.id || index} className="rounded-lg shadow-sm duration-300 hover:shadow-md overflow-hidden transition-all">
              <Link href={`/blog/${blog?.id}`} className="block">
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
                <Link href={`/blog/${blog?.id}`} className="block">
                  <h3 className="text-lg font-bold hover:text-primary line-clamp-2 mb-2 transition-colors">
                    {blog?.title}
                  </h3>
                </Link>
                <div className="flex text-gray-500 text-sm items-center mb-3">
                  <div className="flex items-center">
                    {/* <div className="h-6 rounded-full w-6 mr-2 overflow-hidden">
                      <Image 
                        src={blog?.authorAvatar || "/assets/images/default-avatar.png"} 
                        alt={blog?.authorName || "Quản trị viên"}
                        width={24}
                        height={24}
                      />
                    </div> */}
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
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {blog?.blogContent}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
