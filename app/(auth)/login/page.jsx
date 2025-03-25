import Login from "@/components/ui/modals/Login";
import React from "react";

export const metadata = {
  title: "Login || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Đăng nhập</div>
        </div>
      </div>

      <Login />
    </>
  );
}
