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

  const latestBlog = blogs[0];
  const otherBlogs = blogs.slice(1);

  return (
    <div className="blog-grid-main py-10">
      <div className="container mx-auto px-4">
        {/* Featured Banner Blog */}
        {latestBlog && (
          <div className="mb-20 relative">
            <div className="relative w-full h-[500px]">
              <Image
                className="w-full h-full object-cover rounded-lg"
                src={latestBlog?.thumbnail}
                alt={latestBlog?.title}
                width={1200}
                height={500}
                priority
              />
              
              {/* White box on the left side */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8">
                  <Link href={`/blog/${latestBlog?.id}`}>
                    <h2 className="text-3xl font-bold mb-5 text-gray-900 hover:text-primary transition-colors">
                      {latestBlog?.title}
                    </h2>
                  </Link>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <Image 
                        src={latestBlog?.authorAvatar || "/assets/images/default-avatar.png"} 
                        alt={latestBlog?.author || "Admin"}
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium">{latestBlog?.author || "Admin"}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span>
                        {latestBlog?.lastUpdatedTime ? new Date(latestBlog.lastUpdatedTime).toLocaleDateString('en-US', {
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
        <h2 className="text-2xl font-bold mb-8 border-b border-gray-200 pb-3">Latest Post</h2>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {otherBlogs?.map((blog, index) => (
            <div key={blog.id || index} className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <Link href={`/blog/${blog?.id}`} className="block">
                <div className="relative h-56">
                  <Image
                    className="w-full h-full object-cover"
                    src={blog?.thumbnail}
                    alt={blog?.title}
                    width={400}
                    height={240}
                    priority={index < 3}
                  />
                  {/* Optional category badge */}
                  {blog?.category && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-xs rounded px-2 py-1">
                      {blog.category}
                    </span>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/blog/${blog?.id}`} className="block">
                  <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors line-clamp-2">
                    {blog?.title}
                  </h3>
                </Link>
                <div className="flex items-center mb-3 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                      <Image 
                        src={blog?.authorAvatar || "/assets/images/default-avatar.png"} 
                        alt={blog?.author || "Admin"}
                        width={24}
                        height={24}
                      />
                    </div>
                    <span>{blog?.author || "Admin"}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <span>
                    {blog?.lastUpdatedTime ? new Date(blog.lastUpdatedTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : ""}
                  </span>
                </div>
                {blog?.blogContent && (
                  <p className="text-gray-600 mb-3 line-clamp-2">
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
