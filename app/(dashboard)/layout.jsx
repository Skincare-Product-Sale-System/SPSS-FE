import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
import DashboardNav from "@/components/othersPages/dashboard/AccountSideBar";
import Overlay from "@/components/common/Overlay";

export const metadata = {
  title: "SPSS",
  description: "SPSS",
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
              <div className="heading text-center" style={{}}></div>
            </div>
          </div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">{children}</div>
          </div>
        </div>
      </section>
      <Footer1 />
    </>
  );
}
