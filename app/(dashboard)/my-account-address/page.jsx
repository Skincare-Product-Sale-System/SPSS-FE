import AccountAddress from "@/components/othersPages/dashboard/AccountAddress";
import React from "react";

export const metadata = {
  title: "My Accout Address || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Address</div>
        </div>
      </div>
      <section className="flat-spacing-2">
        <div className="container">
            <div>
              <AccountAddress />
            </div>
        </div>
      </section>
    </>
  );
}
