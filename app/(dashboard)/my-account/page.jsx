import MyAccount from "@/components/othersPages/dashboard/MyAccount";
import React from "react";

export const metadata = {
  title: "My Account || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      <section>
        <div className="container">
            <div>
              <MyAccount />
            </div>
        </div>
      </section>
    </>
  );
}
