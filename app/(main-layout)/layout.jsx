import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

export default function MainLayout({ children }) {
  return (
    <>
      <Header2 />
      <div className="min-h-screen">{children}</div>
      <Footer1 />
    </>
  );
}
