"use client";
import { Suspense } from 'react';
import PaymentConfirmation from '@/components/othersPages/PaymentSuccess';

// Loading component
const PaymentSuccessLoading = () => (
  <div className="container text-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
    <div className="mt-4">Đang xử lý...</div>
  </div>
);

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentConfirmation />
    </Suspense>
  );
} 