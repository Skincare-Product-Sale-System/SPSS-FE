"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import request from "@/utlis/axios";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RelatedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const currentBlogId = usePathname().split("/")[2];

  useEffect(() => {
    request.get("/blogs").then(({ data }) => {
      // Filter out the current blog post
      const filteredBlogs = data.data.items.filter(blog => blog.id !== currentBlogId);
      setBlogs(filteredBlogs);
    });
  }, [currentBlogId]);

  return (
    <section className="mb_30">
      <div className="container">
        <div className="flat-title mb-5">
          <h4 className="text-2xl font-semibold text-center">Related Articles</h4>
        </div>
        <div className="hover-sw-nav view-default hover-sw-5">
          <Swiper
            dir="ltr"
            spaceBetween={30}
            slidesPerView={3}
            breakpoints={{
              768: { slidesPerView: 3 },
              640: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
            className="swiper tf-sw-recent"
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp101",
              nextEl: ".snbn101",
            }}
            pagination={{ clickable: true, el: ".spd101" }}
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={blog.id || index}>
                <div className="blog-article-item shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden">
                  <div className="article-thumb">
                    <Link href={`/blog/${blog?.id}`}>
                      <Image
                        className="w-full h-auto object-cover"
                        src={blog?.thumbnail}
                        alt={blog?.title}
                        width={550}
                        height={354}
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
                      <div className="article-excerpt text-gray-600 mb-4 line-clamp-2">
                        {blog?.blogContent}
                      </div>
                    )}
                    <div className="article-meta flex items-center justify-between text-sm text-gray-500 mb-3">
                      <span className="flex items-center">
                        <span className="material-icons text-primary mr-1" style={{ fontSize: '16px' }}>person</span>
                        {blog?.author || "Admin"}
                      </span>
                      <span className="flex items-center">
                        <span className="material-icons text-primary mr-1" style={{ fontSize: '16px' }}>calendar_today</span>
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
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-recent box-icon w_46 round snbp101">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-recent box-icon w_46 round snbn101">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots d-flex style-2 sw-pagination-recent justify-content-center spd101" />
        </div>
      </div>
    </section>
  );
}
