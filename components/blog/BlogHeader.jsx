"use client";
import React from "react";
import Overlay from "@/components/ui/common/Overlay";

export default function BlogHeader() {
  return (
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
              Blog
            </div>
            <p className="text-center text-2 mt_5" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Nhận các mẹo và thủ thuật cho thói quen chăm sóc da của bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 