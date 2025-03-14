import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import React from "react";
import DashboardNav from "@/components/othersPages/dashboard/AccountSideBar";
import ChangePassword from "@/components/changePassword/ChangePassword";
import { Container } from '@mui/material';

export const metadata = {
    title: "Change Password",
    description: "Change Password",
};

export default function Page() {
    return (
      <>
        <Header2 />
        <section className="flat-spacing-11">
          <Container>
            <div className="row">
              <div className="col-lg-3">
                <DashboardNav />
              </div>
              <div className="col-lg-9">
                <ChangePassword />
              </div>
            </div>
          </Container>
        </section>
        <Footer1 />
      </>
    );
}