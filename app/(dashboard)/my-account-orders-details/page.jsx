import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import AccountSideBar from "@/components/othersPages/dashboard/AccountSideBar";
import OrderDetails from "@/components/othersPages/dashboard/OrderDetails";
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
          <div className="heading text-center">Order Details</div>
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
