import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <>
      <Header2 />
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
      <Footer1 />
    </>
  );
}
