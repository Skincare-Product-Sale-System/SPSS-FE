"use client";
import CheckoutContent from "@/components/checkout/CheckoutContent";
import { Suspense } from "react";

const CheckoutLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function CheckoutPage() {
  return (
    <section>
      <div className="container">
        <div>
          <Suspense fallback={<CheckoutLoading />}>
            <CheckoutContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
} 