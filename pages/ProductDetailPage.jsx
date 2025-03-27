"use client";
import ProductDetail from "@/components/product/detail/ProductDetail";
import { Suspense } from "react";

const ProductLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function ProductDetailPage({ product }) {
  return (
    <section className="flat-spacing-2">
      <div className="container">
        <Suspense fallback={<ProductLoading />}>
          <ProductDetail product={product} />
        </Suspense>
      </div>
    </section>
  );
} 