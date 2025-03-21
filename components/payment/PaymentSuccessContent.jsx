"use client";
import dynamic from 'next/dynamic';

const ClientPaymentSuccess = dynamic(
  () => import('./ClientPaymentSuccess'),
  {
    loading: () => (
      <div className="container text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <div className="mt-4">Đang xử lý...</div>
      </div>
    )
  }
);

export default function PaymentSuccessContent() {
  return (
    <ClientPaymentSuccess />
  );
} 