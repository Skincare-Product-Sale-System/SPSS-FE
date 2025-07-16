import Login from "@/components/ui/modals/Login";
import React from "react";

export const metadata = {
  title: "Đăng nhập || Skincede - Chăm sóc da mặt",
  description: "Đăng nhập vào tài khoản Skincede của bạn",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2" style={{ backgroundColor: '#f8f9fa', paddingTop: '40px', paddingBottom: '20px' }}>
        <div className="container">
          <div className="heading text-center">
            <h2 style={{ fontWeight: 'bold', color: '#0B2B3C' }}>Đăng nhập</h2>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', paddingBottom: '60px' }}>
        <Login isStandalone={true} />
      </div>
    </>
  );
}
