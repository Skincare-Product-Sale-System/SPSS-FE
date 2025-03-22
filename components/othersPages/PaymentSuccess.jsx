"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Loading component
const OrderIdLoading = () => (
  <div className="container text-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
  </div>
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

export default function PaymentConfirmation() {
  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="flex flex-col justify-center items-center tf-page-cart-checkout">
              <div className="flex bg-blue-100 h-20 justify-center rounded-full w-20 items-center mb-4 mx-auto">
                <span className="text-3xl text-blue-600 icon-check"></span>
              </div>
              <div className="text-xl !text-blue-500 font-bold" style={{ fontFamily: '"Roboto", sans-serif' }}>
                Đặt hàng thành công
              </div>
              <div className="text-2xl font-semibold mb-2" style={{ fontFamily: '"Roboto", sans-serif' }}>
                Cảm ơn bạn đã mua hàng!
              </div>
              <div className="text-lg" style={{ fontFamily: '"Roboto", sans-serif' }}>
                Đơn hàng của bạn đang được xử lý
              </div>
              {/* <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Date</div>
                <p>01/01/2024</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Payment method</div>
                <p>Visa</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Card number</div>
                <p>**** **** **** 9999</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Cardholder name</div>
                <p>Themesflat</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Email</div>
                <p>info@fashionshop.com</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_15">
                <div className="fs-18">Phone</div>
                <p>(212) 555-1234</p>
              </div>
              <div className="d-flex align-items-center justify-content-between mb_24">
                <div className="fs-22 fw-6">Subtotal</div>
                <span className="total-value">$188.00 USD</span>
              </div> */}

              <Suspense fallback={<OrderIdLoading />}>
                <OrderIdComponent />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
