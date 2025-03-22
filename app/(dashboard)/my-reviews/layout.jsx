"use client";
import { Suspense } from "react";

// Loading component for reviews page
const ReviewsLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function MyReviewsLayout({ children }) {
  return (
    <Suspense fallback={<ReviewsLoading />}>
      {children}
    </Suspense>
  );
} 