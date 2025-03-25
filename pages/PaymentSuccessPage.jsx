"use client";
import React, { Suspense } from "react";
import ClientSideLayout from "@/components/ui/layout/ClientSideLayout";

// Loading component
const PaymentSuccessContentLoading = () => (
  <div className="container text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
    <div className="mt-4">Đang xử lý...</div>
  </div>
);

// Lazy load the PaymentSuccessContent component
const PaymentSuccessContent = React.lazy(() => 
  import("@/components/payment/PaymentSuccessContent")
);

export default function PaymentSuccessPage() {
  return (
    <ClientSideLayout>
      <Suspense fallback={<PaymentSuccessContentLoading />}>
        <PaymentSuccessContent />
      </Suspense>
    </ClientSideLayout>
  );
} 