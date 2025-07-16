import Register from "@/components/ui/modals/Register";
import React from "react";

export const metadata = {
  title: "Đăng ký || Skincede - Chăm sóc da mặt",
  description: "Đăng ký tài khoản Skincede mới",
};

export default function page() {
  return (
    <>
      <div className="tf-page-title style-2" style={{ backgroundColor: '#f8f9fa', paddingTop: '40px', paddingBottom: '20px' }}>
        <div className="container">
          <div className="heading text-center">
            <h2 style={{ fontWeight: 'bold', color: '#0B2B3C' }}>Đăng ký</h2>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#f8f9fa', paddingBottom: '60px' }}>
        <Register isStandalone={true} />
      </div>
    </>
  );
}
