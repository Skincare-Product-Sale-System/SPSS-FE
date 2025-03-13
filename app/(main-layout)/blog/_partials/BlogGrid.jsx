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
            <div className="col-xl-4 col-md-6 col-12" key={index}>
              <div className="blog-article-item">
                <div className="article-thumb">
                  <Link href={`/blog/${blog?.id}`}>
                    <Image
                      className="lazyload"
                      data-src={blog?.image}
                      alt={blog?.alt}
                      src={blog?.image}
                      width={550}
                      height={354}
                    />
                  </Link>
                  <div className="article-label">
                    <Link
                      href={`/blog-detail/${blog?.id}`}
                      className="tf-btn btn-sm radius-3 btn-fill animate-hover-btn"
                    >
                      {blog?.category}
                    </Link>
                  </div>
                </div>
                <div className="article-content">
                  <div className="article-title">
                    <Link href={`/blog/${blog?.id}`}>{blog?.title}</Link>
                  </div>
                  <div className="article-btn">
                    <Link
                      href={`/blog/${blog?.id}`}
                      className="tf-btn btn-line fw-6"
                    >
                      Read more
                      <i className="icon icon-arrow1-top-left" />
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
