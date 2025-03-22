"use client";
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const OrderDetailsLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="border-b-2 border-primary border-t-2 h-12 rounded-full w-12 animate-spin"></div>
  </div>
);

const OrderDetails = dynamic(
  () => import('@/components/othersPages/dashboard/OrderDetails'),
  {
    ssr: false,
    loading: OrderDetailsLoading
  }
);

export default function ClientOrderDetails() {
  return (
    <Suspense fallback={<OrderDetailsLoading />}>
      <OrderDetails />
    </Suspense>
  );
} 