"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

const MyAccountOrderDetailsContent = dynamic(
  () => import("@/components/account/order-details/MyAccountOrderDetailsContent"),
  { ssr: false }
);

export default function MyAccountOrderDetailsPage() {
  const mainColor = useThemeColors();

  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Chi tiết đơn hàng</div>
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
          <MyAccountOrderDetailsContent />
        </Suspense>
      </div>
    </>
  );
} 