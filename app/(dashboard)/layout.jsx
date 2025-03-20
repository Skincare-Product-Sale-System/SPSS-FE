import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
import Overlay from "@/components/common/Overlay";
import ResponsiveLayoutWrapper from "./ResponsiveLayoutWrapper";

export const metadata = {
  title: "Skincede",
  description: "Skincede",
};

export default function Layout({ children }) {
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
            <div className="col-12">
              <div className="text-center heading"></div>
            </div>
          </div>
        </div>
      </div>
      <ResponsiveLayoutWrapper>
        {children}
      </ResponsiveLayoutWrapper>
      <Footer1 />
    </>
  );
}
