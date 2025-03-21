"use client";
import Overlay from "@/components/common/Overlay";
import Checkout from "@/components/othersPages/Checkout";
import React, { Suspense } from "react";

const CheckoutLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function CheckoutPage() {
  return (
    <>
      <div
        className="tf-page-title"
        style={{
          position: "relative",
        }}
      >
        <Overlay />
        <div className="container-full">
          <div className="row">
            <div
              className="col-12"
              style={{
                zIndex: 3,
                color: "white",
              }}
            >
              <div className="heading text-center" style={{}}>
                Thanh toán
              </div>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<CheckoutLoading />}>
        <Checkout />
      </Suspense>
    </>
  );
}
