import Overlay from "@/components/common/Overlay";
import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";

import Compare from "@/components/othersPages/Compare";
import React from "react";

export const metadata = {
  title: "Compare || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      {/* <Topbar1 /> */}
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
              <div className="text-center heading" style={{}}>
                So sánh sản phẩm
              </div>
            </div>
          </div>
        </div>
      </div>

      <Compare />
      <Footer1 />
    </>
  );
}
