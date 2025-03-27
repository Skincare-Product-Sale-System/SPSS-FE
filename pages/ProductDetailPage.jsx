"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

const ProductDetail = dynamic(
  () => import("@/components/product/detail/ProductDetail"),
  { ssr: false }
);

export default function ProductDetailPage({ product }) {
  const mainColor = useThemeColors();

  return ( product &&
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Product Details</div>
        </div>
      </div>
      
      <div className="container-full lg:w-11/12 mx-auto px-4 py-6">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-60">
              <CircularProgress sx={{ color: mainColor }} />
            </div>
          }
        >
          <ProductDetail product={product} />
        </Suspense>
      </div>
    </>
  );
} 