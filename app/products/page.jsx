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
        <div
          style={{
            zIndex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></div>
        <div
          style={{
            zIndex: 0,
            backgroundImage:
              "url(https://images.pexels.com/photos/31095139/pexels-photo-31095139/free-photo-of-hydrating-skincare-products-with-floral-decor.jpeg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        ></div>
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
                New Arrival
              </div>
              <p className="text-center text-2 mt_5">
                Shop through our latest selection of Fashion
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
