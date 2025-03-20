"use client";
import dynamic from 'next/dynamic';

const OrderDetails = dynamic(
  () => import('@/components/othersPages/dashboard/OrderDetails'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-8">
        <div className="border-b-2 border-primary border-t-2 h-12 rounded-full w-12 animate-spin"></div>
      </div>
    )
  }
);

export default function ClientOrderDetails() {
  return <OrderDetails />;
} 