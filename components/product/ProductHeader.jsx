"use client";
import React from "react";
import Overlay from "@/components/ui/common/Overlay";

export default function ProductHeader() {
  return (
    <div className="tf-page-title" style={{ position: "relative" }}>
      <Overlay />
      <div className="container-full">
        <div className="row">
          <div className="col-12" style={{ zIndex: 3, color: "white" }}>
            <div className="heading text-center" style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', fontWeight: 600 }}>
              Sản Phẩm Mới
            </div>
            <p className="text-center text-2 mt_5" style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.125rem' }}>
              Khám phá bộ sưu tập mới nhất của chúng tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 