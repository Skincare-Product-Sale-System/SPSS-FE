"use client";
import React from "react";
import AccountSideBar from "@/components/account/AccountSideBar";
import Overlay from "@/components/ui/common/Overlay";
import { Suspense } from "react";

const AccountLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AccountLayout({ children }) {
  return (
    <>
      <div
        className="tf-page-title"
        style={{
          backgroundImage: "url('/images/page-title/bg-acc.jpg')",
          position: "relative",
        }}
      >
        <Overlay />
        <div className="container">
          <div className="row">
            <div
              className="col-12"
              style={{
                zIndex: 3,
                position: "relative",
              }}
            >
            </div>
          </div>
        </div>
      </div>

      <div className="tf-dashboard">
        <div className="container">
          <div className="row mt-3">
            <div className="col-lg-3 col-md-12">
              <AccountSideBar />
            </div>
            <div className="col-lg-9 col-md-12">
              <Suspense fallback={<AccountLoading />}>
                {children}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 