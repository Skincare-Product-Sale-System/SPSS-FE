"use client";
import CompareContent from "@/components/compare/CompareContent";
import { Suspense } from "react";

const CompareLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function ComparePage() {
  return (
    <section>
      <div className="container">
        <div>
          <Suspense fallback={<CompareLoading />}>
            <CompareContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
} 