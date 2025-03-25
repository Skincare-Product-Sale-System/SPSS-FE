"use client";
import MyAccountOrdersContent from "@/components/account/orders/MyAccountOrdersContent";
import { Suspense } from "react";

const OrdersLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function MyAccountOrdersPage() {
  return (
    <>
      <div className="tf-page-title">
        <div className="container-full">
          <div 
            className="heading text-center"
            style={{
              fontFamily: '"Roboto", sans-serif'
            }}
          >Lịch sử đơn hàng</div>
        </div>
      </div>
      <section className="flat-spacing-2">
        <div className="container">
          <div>
            <Suspense fallback={<OrdersLoading />}>
              <MyAccountOrdersContent />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
} 