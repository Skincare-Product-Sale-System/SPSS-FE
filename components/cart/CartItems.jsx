"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/priceFormatter";
import request from "@/utils/axios";
import { defaultProductImage } from "@/utils/default";
import { toast } from "react-hot-toast";

export default function CartItems({ cartProducts, revalidate }) {
  const setQuantity = (id, quantity) => {
    // Hàm này để giữ nguyên với Cart.jsx
    console.log(id, quantity);
  };

  return (
    <table className="tf-table-page-cart">
      <thead>
        <tr>
          <th style={{ fontFamily: '"Roboto", sans-serif' }}>Sản phẩm</th>
          <th style={{ fontFamily: '"Roboto", sans-serif' }}>Giá</th>
          <th style={{ fontFamily: '"Roboto", sans-serif' }}>Số lượng</th>
          <th style={{ fontFamily: '"Roboto", sans-serif' }}>Tổng cộng</th>
        </tr>
      </thead>
      <tbody>
        {cartProducts?.map((elm, i) => (
          <tr key={i} className="file-delete tf-cart-item">
            <td className="tf-cart-item_product">
              <Link
                href={`/product-detail/${elm.productId}`}
                className="img-box"
              >
                <Image
                  alt="img-product"
                  src={elm.productImageUrl || defaultProductImage}
                  width={668}
                  height={932}
                />
              </Link>
              <div className="cart-info">
                <Link
                  href={`/product-detail/${elm.productId}`}
                  className="cart-title link"
                >
                  {elm.productName}
                </Link>
                <div className="cart-meta-variant">
                  {elm.variationOptionValues[0]}
                </div>
                <span
                  className="link remove remove-cart"
                  style={{ fontFamily: '"Roboto", sans-serif' }}
                  onClick={() =>
                    request
                      .delete(`/cart-items/${elm.id}`)
                      .then((res) => revalidate())
                  }
                >
                  Xóa
                </span>
              </div>
            </td>
            <td
              className="tf-cart-item_price"
              cart-data-title="Price"
            >
              <div className="cart-price">
                {formatPrice(elm.price)}
              </div>
            </td>
            <td
              className="tf-cart-item_quantity"
              cart-data-title="Quantity"
            >
              <div className="cart-quantity">
                <div className="wg-quantity">
                  <span
                    className="btn-quantity minus-btn"
                    onClick={() => {
                      request
                        .patch(`/cart-items/${elm.id}`, {
                          quantity:
                            elm.quantity >= 2 ? elm.quantity - 1 : 1,
                        })
                        .then((res) => {
                          revalidate();
                        })
                        .catch((err) => {
                          console.log("err", err);
                          toast.error("Something went wrong");
                        });
                    }}
                  >
                    <svg
                      className="d-inline-block"
                      width={9}
                      height={1}
                      viewBox="0 0 9 1"
                      fill="currentColor"
                    >
                      <path d="M9 1H5.14286H3.85714H0V1.50201e-05H3.85714L5.14286 0L9 1.50201e-05V1Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="number"
                    value={elm.quantity}
                    min={1}
                    onChange={(e) =>
                      setQuantity(elm.id, e.target.value / 1)
                    }
                  />
                  <span
                    className="btn-quantity plus-btn"
                    onClick={() => {
                      request
                        .patch(`/cart-items/${elm.id}`, {
                          quantity:
                            elm.quantity < elm.stockQuantity
                              ? elm.quantity + 1
                              : elm.quantity,
                        })
                        .then((res) => {
                          revalidate();
                        })
                        .catch((err) => {
                          console.log("err", err);
                          toast.error("Something went wrong");
                        });
                    }}
                  >
                    <svg
                      className="d-inline-block"
                      width={9}
                      height={9}
                      viewBox="0 0 9 9"
                      fill="currentColor"
                    >
                      <path d="M9 5.14286H5.14286V9H3.85714V5.14286H0V3.85714H3.85714V0H5.14286V3.85714H9V5.14286Z" />
                    </svg>
                  </span>
                </div>
              </div>
            </td>
            <td
              className="tf-cart-item_total"
              cart-data-title="Total"
            >
              <div
                className="cart-total"
                style={{ minWidth: "60px" }}
              >
                {formatPrice(elm.price * elm.quantity)}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 