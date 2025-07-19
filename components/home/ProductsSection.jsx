"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useTheme } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";
import request from "@/utils/axios";
import { useContextElement } from "@/context/Context";
import ProductCard from "@/components/ui/shared/cards/ProductCard";
import ProductTitle from "./ProductTitle";

export default function ProductsSection() {
  const theme = useTheme();
  const {
    setQuickViewItem,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  const [products] = useQueries({
    queries: [
      {
        queryKey: ["products", "homepage"],
        queryFn: async () => {
          const { data } = await request.get(
            "/products?pageNumber=1&pageSize=12&sortBy=bestselling"
          );

          return data.data?.items || [];
        },
      },
    ],
  });

  const handleOpen = (product) => {
    setQuickViewItem({
      id: product.id,
      productId: product.id
    });
  };

  return (
    <section className="py-16" style={{ backgroundColor: theme.palette.background.default }}>
      <div className="container mx-auto px-4">
        <ProductTitle />

        <div className="relative">
          {/* Navigation buttons */}
          <div
            className="sw-button-prev snbp265 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow cursor-pointer hover:bg-gray-100 absolute left-0 top-1/2 transform -translate-y-1/2 z-10 md:-left-5"
            style={{ color: theme.palette.text.primary }}
          >
            <i className="icon icon-arrow-left" />
          </div>

          <div
            className="sw-button-next snbn265 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow cursor-pointer hover:bg-gray-100 absolute right-0 top-1/2 transform -translate-y-1/2 z-10 md:-right-5"
            style={{ color: theme.palette.text.primary }}
          >
            <i className="icon icon-arrow-right" />
          </div>

          <Swiper
            dir="ltr"
            spaceBetween={24}
            slidesPerView={4}
            breakpoints={{
              1024: { slidesPerView: 4 },
              768: { slidesPerView: 3 },
              576: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp265",
              nextEl: ".snbn265",
            }}
            pagination={{ clickable: true, el: ".spd265" }}
          >
            {!products.isLoading &&
              products.data.map((product) => (
                <SwiperSlide key={product.id}>
                  <ProductCard
                    product={product}
                    handleOpen={handleOpen}
                    addToCompareItem={addToCompareItem}
                    isAddedtoCompareItem={isAddedtoCompareItem}
                    theme={theme}
                  />
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Pagination dots */}
          <div className="sw-dots style-1 sw-pagination-slider justify-content-center spd265 mt-4" />
        </div>
      </div>
    </section>
  );
} 