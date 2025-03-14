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
        <section>
          <Container>
          <div>
            <MyReviews />
          </div>
          </Container>
        </section>
      </>
    );
}
