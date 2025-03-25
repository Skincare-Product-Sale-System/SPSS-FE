"use client";
import { Suspense } from 'react';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';

// Loading component
const PaymentSuccessLoading = () => (
  <div className="container text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
    <div className="mt-4">Đang xử lý...</div>
  </div>
);

export default function Page() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessPage />
    </Suspense>
  );
} 