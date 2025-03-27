"use client";
import ProductsContent from "@/components/product/ProductsContent";
import { Suspense } from "react";

const ProductsLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function ProductsPage() {
  return (
    <section className="flat-spacing-2">
      <div className="container">
        <Suspense fallback={<ProductsLoading />}>
          <ProductsContent />
        </Suspense>
      </div>
    </section>
  );
} 