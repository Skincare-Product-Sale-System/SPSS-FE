"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function PaymentConfirmation() {
  const orderId = useSearchParams().get("id");
  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="tf-page-cart-checkout flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="icon-check text-3xl text-blue-600"></span>
              </div>
              <div className="font-bold text-xl !text-blue-500">
                Your order was successful
              </div>
              <div className="font-semibold text-2xl mb-2">
                Thanks for your purchase!
              </div>
              <div className="text-lg">
                Your order number is #{" "}
                <span className="font-bold">{orderId}</span>
              </div>
              <div className="mb-4 text-xl">
                You’ll receive an email confirming your order details
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

              <a
                href="/my-orders"
                className="mt-2 tf-btn w-100 btn-fill animate-hover-btn radius-3 justify-content-center"
              >
                <span>Track your order</span>
              </a>
              <Link
                href={`/products`}
                className="mt-2 tf-btn w-100 btn-outline animate-hover-btn rounded-0 justify-content-center"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
