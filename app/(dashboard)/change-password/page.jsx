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
      <section className="flat-spacing-2">
        <div className="container">
            <div>
              <ChangePassword />
            </div>
        </div>
      </section>
      </>
    );
}