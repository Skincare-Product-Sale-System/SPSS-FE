"use client";
import Overlay from "@/components/ui/common/Overlay";
import CheckoutPage from "@/pages/CheckoutPage";
import React from "react";
import CheckoutContent from "@/components/checkout/CheckoutContent";
import { Suspense } from "react";

export default function CheckoutPageRoute() {
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
              <div className="heading text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                Thanh toán
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutPage />
    </>
  );
}
