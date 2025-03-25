"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import request from "@/utils/axios";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BlogItem from "@/components/blog/BlogItem";

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
    <section className="mb-16">
      <div className="container mx-auto px-4">
        <h4 className="text-2xl text-center font-semibold mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          Bài Viết Liên Quan
        </h4>
        
        <div className="relative">
          {/* Navigation buttons - positioned absolutely */}
          <div className="absolute top-1/2 -left-5 z-10 transform -translate-y-1/2 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer snbp101">
            <span className="icon icon-arrow-left" />
          </div>
          
          <div className="absolute top-1/2 -right-5 z-10 transform -translate-y-1/2 bg-white rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer snbn101">
            <span className="icon icon-arrow-right" />
          </div>
          
          <Swiper
            dir="ltr"
            spaceBetween={30}
            slidesPerView={3}
            breakpoints={{
              768: { slidesPerView: 3 },
              640: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
            className="swiper tf-sw-recent mx-6" // Added margin to make room for navigation buttons
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp101",
              nextEl: ".snbn101",
            }}
            pagination={{ clickable: true, el: ".spd101" }}
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={blog.id || index}>
                <BlogItem blog={blog} index={index} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-6 spd101" />
        </div>
      </div>
    </section>
  );
} 