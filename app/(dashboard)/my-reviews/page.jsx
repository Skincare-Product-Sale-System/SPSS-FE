import React from "react";
import DashboardNav from "@/components/othersPages/dashboard/AccountSideBar";
import MyReviews from "@/components/myreviews/MyReviews";
import ReviewHeader from "@/components/myreviews/ReviewHeader";
import { Container } from '@mui/material';

export const metadata = {
  title: "My Reviews",
  description: "My Reviews",
};

export default function Page() {
    return (
      <>
        <Header2 />
        <ReviewHeader />
        <section className="flat-spacing-11">
          <Container>
            <div className="row">
              <div className="col-lg-3">
                <DashboardNav />
              </div>
              <div className="col-lg-9">
                <MyReviews />
              </div>
            </div>
          </Container>
        </section>
        <Footer1 />
      </>
    );
}
