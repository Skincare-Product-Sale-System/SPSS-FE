import React from "react";
import { Suspense } from "react";

const FeaturesLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function FeaturesLayout({ children }) {
  return (
    <Suspense fallback={<FeaturesLoading />}>
      <div className="features-container min-h-screen">
        {children}
      </div>
    </Suspense>
  );
} 