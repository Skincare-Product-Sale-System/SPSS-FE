import React from "react";
import AccountSideBar from "@/components/othersPages/dashboard/AccountSideBar";
import Overlay from "@/components/common/Overlay";

export const metadata = {
  title: "Skincede - Tài khoản",
  description: "Skincede - Trang quản lý tài khoản",
};

export default function Layout({ children }) {
  return (
    <>
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
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <AccountSideBar />
            </div>
            <div className="col-lg-9">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}
