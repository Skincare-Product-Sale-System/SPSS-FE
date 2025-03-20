import React from "react";
import ChangePassword from "@/components/changePassword/ChangePassword";

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