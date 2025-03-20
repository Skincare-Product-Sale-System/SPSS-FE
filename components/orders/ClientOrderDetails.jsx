"use client";
import dynamic from 'next/dynamic';

const OrderDetails = dynamic(
  () => import('@/components/orders/OrderDetails'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
);

export default function ClientOrderDetails() {
  return <OrderDetails />;
} 