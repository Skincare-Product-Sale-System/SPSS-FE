"use client";
import React, { Suspense } from "react";
import ClientSideLayout from "@/components/ui/layout/ClientSideLayout";

// Loading component
const PaymentFailureContentLoading = () => (
  <div className="container text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
    <div className="mt-4">Đang xử lý...</div>
  </div>
);

// Lazy load the PaymentFailureContent component
const PaymentFailureContent = React.lazy(() => 
  import("@/components/payment/PaymentFailureContent")
);

export default function PaymentFailurePage() {
  return (
    <ClientSideLayout>
      <Suspense fallback={<PaymentFailureContentLoading />}>
        <PaymentFailureContent />
      </Suspense>
    </ClientSideLayout>
  );
} 