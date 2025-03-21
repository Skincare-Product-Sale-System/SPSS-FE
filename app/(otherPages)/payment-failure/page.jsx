"use client";
import PaymentFailure from "@/components/othersPages/PaymentFailure";
import React, { Suspense } from "react";

export default function PaymentFailurePage() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Thanh toán thất bại</div>
        </div>
      </div>

      <Suspense fallback={
        <div className="container text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <div className="mt-4">Đang tải...</div>
        </div>
      }>
        <PaymentFailure />
      </Suspense>
    </>
  );
}