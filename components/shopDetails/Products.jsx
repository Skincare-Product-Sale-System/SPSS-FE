"use client";

// import { products1 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "../shopCards/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import request from "@/utils/axios";
import { useQueries } from "@tanstack/react-query";

export default function Products() {
  const [products] = useQueries({
    queries: [
      {
        queryKey: ["products"],
        queryFn: async () => {
          const { data } = await request.get(
            "/products?pageNumber=1&pageSize=20"
          );
          return data.data?.items;
        },
      },
    ],
  });

  return (
    <>
      <div className="container">
        <div className="flat-title">
          <span className="title" style={{ fontFamily: 'Playfair Display, serif' }}>Sản Phẩm Khác Mua Cùng</span>
        </div>
        <div className="hover-sw-2 hover-sw-nav">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell wrap-sw-over"
            slidesPerView={4} // Equivalent to data-preview={4}
            spaceBetween={30} // Equivalent to data-space-lg={30}
            breakpoints={{
              1024: {
                slidesPerView: 4, // Equivalent to data-tablet={3}
              },
              640: {
                slidesPerView: 3, // Equivalent to data-tablet={3}
              },
              0: {
                slidesPerView: 2, // Equivalent to data-mobile={2}
                spaceBetween: 15, // Equivalent to data-space-md={15}
              },
            }}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp3070",
              nextEl: ".snbn3070",
            }}
            pagination={{ clickable: true, el: ".spd307" }}
          >
            {products.data?.slice(0, 8).map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-next-product nav-next-slider nav-sw box-icon round snbp3070 w_46">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-prev-product nav-prev-slider nav-sw box-icon round snbn3070 w_46">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="justify-content-center spd307 style-2 sw-dots sw-pagination-product" />
        </div>
      </div>
    </>
  );
}
