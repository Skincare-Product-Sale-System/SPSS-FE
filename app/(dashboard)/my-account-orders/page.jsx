import Orders from "@/components/othersPages/dashboard/Orders";
import React from "react";

export const metadata = {
  title: "My Account Orders || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
        <div 
            className="heading text-center"
            style={{
              fontFamily: '"Roboto", sans-serif'
            }}
          >Lịch sử đơn hàng</div>
        </div>
      </div>
      <section className="flat-spacing-2">
        <div className="container">
            <div>
              <Orders />
            </div>
        </div>
      </section>
    </>
  );
}
