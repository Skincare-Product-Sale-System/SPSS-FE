"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountSideBar from "@/components/account/AccountSideBar";
import Overlay from "@/components/ui/common/Overlay";
import { Suspense } from "react";
import useAuthStore from "@/context/authStore";
import toast from "react-hot-toast";

const AccountLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AccountLayout({ children }) {
  const { isLoggedIn, Role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check if user is not logged in or not a CUSTOMER
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để truy cập trang này");
      router.push("/");
      return;
    }
    
    // Check if user role is not CUSTOMER
    if (Role && Role !== "CUSTOMER") {
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/");
      return;
    }
  }, [isLoggedIn, Role, router]);

  // If not logged in or not CUSTOMER, render a loading state
  if (!isLoggedIn || (Role && Role !== "CUSTOMER")) {
    return <AccountLoading />;
  }

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