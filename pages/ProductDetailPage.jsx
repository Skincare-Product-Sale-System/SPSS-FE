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

  return (
    <section className="flat-spacing-2">
      <div className="container">
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
    </section>
  );
} 