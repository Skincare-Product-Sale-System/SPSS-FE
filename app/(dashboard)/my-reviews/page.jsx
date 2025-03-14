import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";

import DashboardNav from "@/components/othersPages/dashboard/AccountSideBar";
import MyReviews from "@/components/myreviews/MyReviews";

export const metadata = {
    title: "My Reviews",
    description: "My Reviews",
};

export default function page() {
    return (
      <>
        <Header2 />
        <div className="tf-page-title">
          <div className="container-full">
            <div className="heading text-center">My Reviews</div>
          </div>
        </div>
        <section className="flat-spacing-11">
          <div className="container">
            <div className="row">
              <div className="col-lg-3">
                <DashboardNav />
              </div>
              <div className="col-lg-9">
                <MyReviews />
              </div>
            </div>
          </div>
        </section>
        <Footer1 />
      </>
    );
  }