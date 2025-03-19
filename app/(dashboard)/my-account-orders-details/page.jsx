import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import AccountSideBar from "@/components/othersPages/dashboard/AccountSideBar";
import OrderDetails from "@/components/othersPages/dashboard/OrderDetails";
import Orders from "@/components/othersPages/dashboard/Orders";
import React from "react";

export const metadata = {
  title: "Chi Tiết Đơn Hàng | SPSS - Website Chăm Sóc Da",
  description: "Xem chi tiết đơn hàng của bạn tại SPSS",
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
          >
            Chi Tiết Đơn Hàng
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <OrderDetails />
        </div>
      </section>
    </>
  );
}
