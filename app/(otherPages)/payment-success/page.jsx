import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import PaymentSuccess from "@/components/othersPages/PaymentSuccess";
import React from "react";

export const metadata = {
  title: "Payment Success",
  description: "Payment Success",
};
export default function page() {
  return (
    <>
      <Header2 />
      <PaymentSuccess />
      <Footer1 />
    </>
  );
}
