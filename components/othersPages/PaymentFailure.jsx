"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentFailure() {
  const orderId = useSearchParams().get("id");
  
  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="tf-page-cart-checkout flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <div className="font-bold text-xl !text-red-500">
                Payment Failed
              </div>
              <div className="font-semibold text-2xl mb-2">
                Something went wrong with your payment
              </div>
              <div className="text-lg text-center mb-4">
                We were unable to process your payment. Please try again or use a different payment method.
              </div>

              <a
                href={`/my-account-orders-details?id=${orderId}`}
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

              <p className="mt-4">
                Have a question?{" "}
                <Link href={`/contact-1`} className="text-blue-600 hover:text-blue-800">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
