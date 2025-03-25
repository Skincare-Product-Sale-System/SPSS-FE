"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountSideBar from "@/components/account/AccountSideBar";
import Overlay from "@/components/ui/common/Overlay";
import { Suspense } from "react";
import toast from "react-hot-toast";

const AccountLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AccountLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      toast.error("Vui lòng đăng nhập để truy cập trang này");
      router.push("/");
      return;
    }
    
    if (userRole !== "Customer") {
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/");
      return;
    }
  }, [router]);

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