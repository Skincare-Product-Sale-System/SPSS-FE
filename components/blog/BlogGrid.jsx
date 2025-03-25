"use client";
import React, { useEffect, useState } from "react";
import request from "@/utils/axios";
import FeaturedBlog from "./FeaturedBlog";
import BlogList from "./BlogList";

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
        <FeaturedBlog blog={latestBlog} />

        {/* List of other blogs */}
        <BlogList blogs={otherBlogs} />
      </div>
    </div>
  );
} 