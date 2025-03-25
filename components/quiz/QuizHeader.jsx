"use client";
import { Box, Typography } from "@mui/material";
import Overlay from "@/components/ui/common/Overlay";

export default function QuizHeader() {
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
            <div className="text-center heading" style={{ fontFamily: 'Playfair Display, serif' }}>
              Trắc nghiệm loại da
            </div>
            <p className="text-2 text-center mt_5" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Làm các bài trắc nghiệm để khám phá sản phẩm làm đẹp phù hợp với bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 