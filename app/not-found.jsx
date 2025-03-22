"use client";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

const NotFoundContent = () => {
  return (
    <section className="page-404-wrap">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="image">
              <Image
                alt="image"
                src="/images/item/404.svg"
                width="394"
                height="319"
              />
            </div>
            <div className="title" style={{ fontFamily: '"Roboto", sans-serif' }}>
              Rất tiếc... Đường dẫn này không tồn tại.
            </div>
            <p style={{ fontFamily: '"Roboto", sans-serif' }}>
              Xin lỗi vì sự bất tiện này. Vui lòng quay lại trang chủ để xem các bộ sưu tập mới nhất của chúng tôi.
            </p>
            <Link
              href="/"
              className="btn-fill btn-icon btn-sm animate-hover-btn radius-3 tf-btn"
              style={{ fontFamily: '"Roboto", sans-serif' }}
            >
              Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
}
