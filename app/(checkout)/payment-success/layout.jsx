import React from 'react';
import { Suspense } from 'react';

export const metadata = {
  title: "Thanh toán thành công",
  description: "Thanh toán thành công tại SPSS",
};

// Loading component for payment success page
const PaymentLoading = () => (
  <div className="container text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
    <div className="mt-4">Đang xử lý...</div>
  </div>
);

export default function PaymentSuccessLayout({ children }) {
  return (
    <Suspense fallback={<PaymentLoading />}>
      {children}
    </Suspense>
  );
}