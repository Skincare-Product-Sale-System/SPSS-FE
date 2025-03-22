import React from "react";
import AccountSideBar from "@/components/othersPages/dashboard/AccountSideBar";
import Overlay from "@/components/common/Overlay";
import { Suspense } from "react";

export const metadata = {
  title: "Skincede - Tài khoản",
  description: "Skincede - Trang quản lý tài khoản",
};

const DashboardLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

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
            <div className="col-lg-9">
              <Suspense fallback={<DashboardLoading />}>
                {children}
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
