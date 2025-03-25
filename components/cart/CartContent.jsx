"use client";
import React, { useEffect, useState } from "react";
import CartHeader from "./CartHeader";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";
import Products from "@/components/shop/Products";
import useQueryStore from "@/context/queryStore";
import request from "@/utils/axios";
import Link from "next/link";

export default function CartContent() {
  const [cartProducts, setCartProducts] = useState([]);
  const { switcher, revalidate } = useQueryStore();

  useEffect(() => {
    //> fetch data from server
    request
      .get("/cart-items/user/cart")
      .then((res) => {
        setCartProducts(res?.data?.data?.items);
      })
      .catch((e) => setCartProducts([]));
  }, [switcher]);

  const totalPrice = cartProducts.reduce((a, b) => {
    return a + b.quantity * b.price;
  }, 0);

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <CartHeader />
        <div className="tf-page-cart-wrap">
          <div className="tf-page-cart-item">
            <form onSubmit={(e) => e.preventDefault()}>
              <CartItems cartProducts={cartProducts} revalidate={revalidate} />
              {!cartProducts.length && (
                <>
                  <div className="row align-items-center mb-5">
                    <div className="col-6 fs-18" style={{ fontFamily: '"Roboto", sans-serif' }}>
                      Giỏ hàng của bạn đang trống
                    </div>
                    <div className="col-6">
                      <Link
                        href={`/products`}
                        className="btn-fill justify-content-center w-100 animate-hover-btn radius-3 tf-btn"
                        style={{ width: "fit-content" }}
                      >
                        Khám phá sản phẩm!
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
          <CartSummary totalPrice={totalPrice} cartProducts={cartProducts} />
        </div>
      </div>
      <Products />
    </section>
  );
} 