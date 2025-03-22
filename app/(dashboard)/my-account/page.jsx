import MyAccount from "@/components/othersPages/dashboard/MyAccount";
import React, { Suspense } from "react";

export const metadata = {
  title: "My Account || Ecomus - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus - Ultimate Nextjs Ecommerce Template",
};

const AccountLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AccountPage() {
  return (
    <>
      <section>
        <div className="container">
          <div>
            <Suspense fallback={<AccountLoading />}>
              <MyAccount />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
