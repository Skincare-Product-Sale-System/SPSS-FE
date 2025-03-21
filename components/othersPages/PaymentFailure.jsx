"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Loading component for Order ID
const OrderIdLoading = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto my-2"></div>
);

// Component that safely uses searchParams
const OrderIdComponent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  
  return (
    <>
      <a
        href={`/my-account-orders-details?id=${orderId}`}
        className="btn-fill justify-content-center w-100 animate-hover-btn mt-2 radius-3 tf-btn"
        style={{ fontFamily: '"Roboto", sans-serif' }}
      >
        <span>Theo dõi đơn hàng</span>
      </a>

      <Link
        href={`/products`}
        className="btn-outline justify-content-center rounded-0 w-100 animate-hover-btn mt-2 tf-btn"
        style={{ fontFamily: '"Roboto", sans-serif' }}
      >
        <span>Tiếp tục mua sắm</span>
      </Link>
    </>
  );
};

export default function PaymentFailure() {
  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="flex flex-col justify-center items-center tf-page-cart-checkout">
              <div className="flex bg-red-100 h-20 justify-center rounded-full w-20 items-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40px"
                  height="40px"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-red-600"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M15.32 3H8.68c-.26 0-.52.11-.7.29L3.29 7.98c-.18.18-.29.44-.29.7v6.63c0 .27.11.52.29.71l4.68 4.68c.19.19.45.3.71.3h6.63c.27 0 .52-.11.71-.29l4.68-4.68c.19-.19.29-.44.29-.71V8.68c0-.27-.11-.52-.29-.71l-4.68-4.68c-.18-.18-.44-.29-.7-.29zM12 17.3c-.72 0-1.3-.58-1.3-1.3s.58-1.3 1.3-1.3 1.3.58 1.3 1.3-.58 1.3-1.3 1.3zm0-4.3c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1z" />
                </svg>
              </div>
              <div className="text-xl !text-red-500 font-bold" style={{ fontFamily: '"Roboto", sans-serif' }}>
                Thanh Toán Thất Bại
              </div>
              <div className="text-2xl font-semibold mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                Đã xảy ra lỗi trong quá trình thanh toán
              </div>
              <div className="text-center text-lg mb-4" style={{ fontFamily: '"Roboto", sans-serif' }}>
                Chúng tôi không thể xử lý thanh toán của bạn. Vui lòng thử lại hoặc sử dụng phương thức thanh toán khác.
              </div>

              <Suspense fallback={<OrderIdLoading />}>
                <OrderIdComponent />
              </Suspense>

              <p className="mt-4" style={{ fontFamily: '"Roboto", sans-serif' }}>
                Bạn cần hỗ trợ?{" "}
                <Link href={`/contact-1`} className="text-blue-600 hover:text-blue-800">
                  Liên hệ hỗ trợ
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 