"use client";
import React from "react";
import CartContent from "@/components/cart/CartContent";
import Overlay from "@/components/ui/common/Overlay";

export default function ViewCartPage() {
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
              <div className="text-center heading" style={{ fontFamily: 'Playfair Display, serif' }}>
                Giỏ hàng
              </div>
            </div>
          </div>
        </div>
      </div>

      <CartContent />
    </>
  );
} 
