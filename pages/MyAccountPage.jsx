"use client";
import MyAccountContent from "@/components/account/profile/MyAccountContent";
import { Suspense } from "react";

const AccountLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function MyAccountPage() {
  return (
    <section>
      <div className="container">
        <div>
          <Suspense fallback={<AccountLoading />}>
            <MyAccountContent />
          </Suspense>
        </div>
      </div>
    </section>
  );
} 