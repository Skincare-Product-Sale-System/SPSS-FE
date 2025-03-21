"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Navigation, Pagination } from "swiper/modules";
import request from "@/utils/axios";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RelatedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const currentBlogId = usePathname().split("/")[2];

  useEffect(() => {
    request.get("/blogs").then(({ data }) => {
      // Lọc ra bài viết hiện tại
      const filteredBlogs = data.data.items.filter(blog => blog.id !== currentBlogId);
      setBlogs(filteredBlogs);
    });
  }, [currentBlogId]);

  return (
    <section className="mb_30">
      <div className="container">
        <div className="flat-title mb-5">
          <h4 className="text-2xl text-center font-semibold">Bài Viết Liên Quan</h4>
        </div>
        <div className="hover-sw-5 hover-sw-nav view-default">
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
                <div className="rounded-lg shadow-sm blog-article-item hover:shadow-md overflow-hidden transition-shadow">
                  <div className="article-thumb">
                    <Link href={`/blog/${blog?.id}`}>
                      <Image
                        className="h-auto w-full object-cover"
                        src={blog?.thumbnail || "/assets/images/blog-placeholder.jpg"}
                        alt={blog?.title || "Hình ảnh bài viết"}
                        width={550}
                        height={354}
                      />
                    </Link>
                  </div>
                  <div className="p-4 article-content">
                    <div className="article-title mb-3">
                      <Link href={`/blog/${blog?.id}`} className="text-xl font-medium hover:text-primary transition-colors">
                        {blog?.title}
                      </Link>
                    </div>
                    {blog?.blogContent && (
                      <div className="text-gray-600 article-excerpt line-clamp-2 mb-4">
                        {blog?.blogContent}
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500 text-sm article-meta items-center mb-3">
                      <span className="flex items-center">
                        {blog?.authorName || "Quản trị viên"}
                      </span>
                      <span className="flex items-center">
                        {blog?.lastUpdatedTime ? new Date(blog.lastUpdatedTime).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : ""}
                      </span>
                    </div>
                    <div className="article-btn">
                      <Link
                        href={`/blog/${blog?.id}`}
                        className="btn-line fw-6 hover:text-primary tf-btn transition-colors"
                      >
                        Xem thêm
                        <i className="icon icon-arrow1-top-left ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-next-recent nav-next-slider nav-sw box-icon round snbp101 w_46">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-prev-recent nav-prev-slider nav-sw box-icon round snbn101 w_46">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="d-flex justify-content-center spd101 style-2 sw-dots sw-pagination-recent" />
        </div>
      </div>
    </section>
  );
}
