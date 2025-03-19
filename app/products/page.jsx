import Overlay from "@/components/common/Overlay";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar1 from "@/components/headers/Topbar1";
import ShopSidebarleft from "@/components/shop/ShopSidebarleft";
import React from "react";

export const metadata = {
  title: "Skincare Shop",
  description: "Skincare Shop",
};

export default function ProductList() {
  return (
    <>
      <Header2 />
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
              <div 
                className="heading text-center" 
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '2.5rem',
                  fontWeight: 600
                }}
              >
                Sản Phẩm Mới
              </div>
              <p 
                className="text-center text-2 mt_5"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '1.125rem'
                }}
              >
                Khám phá bộ sưu tập mới nhất của chúng tôi
              </p>
            </div>
          </div>
        </div>
      </div>
      <ShopSidebarleft />
      <Footer1 />
    </>
  );
}
