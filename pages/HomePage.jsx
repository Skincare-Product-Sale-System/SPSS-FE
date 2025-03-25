"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";

const HomeContent = dynamic(
  () => import("@/components/home/HomeContent"),
  { ssr: false }
);

export default function HomePage() {
  const mainColor = useThemeColors();
  
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <CircularProgress sx={{ color: mainColor }} />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
} 