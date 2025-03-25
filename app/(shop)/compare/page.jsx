"use client";
import Overlay from "@/components/ui/common/Overlay";
import ComparePage from "@/pages/ComparePage";
import React from "react";

export default function ComparePageRoute() {
  return (
    <>
      {/* <Topbar1 /> */}
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
                So sánh sản phẩm
              </div>
            </div>
          </div>
        </div>
      </div>

      <ComparePage />
    </>
  );
}
