"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/priceFormatter";
import { defaultProductImage } from "@/utils/default";

export default function OrderSummarySection({ cartProducts }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <h5 className="fw-5 mb-3" style={{ fontFamily: '"Roboto", sans-serif' }}>
        3. Thông Tin Đơn Hàng
      </h5>
      
      <div className="table-responsive mb-3">
        <table className="table table-borderless">
          <thead className="border-bottom">
            <tr className="text-muted fs-14">
              <th scope="col" style={{ width: '40%' }}>Sản phẩm</th>
              <th scope="col" className="text-center">Số lượng</th>
              <th scope="col" className="text-end">Giá</th>
              <th scope="col" className="text-end">Tổng giá</th>
            </tr>
          </thead>
          <tbody>
            {cartProducts.map((item, i) => (
              <tr key={i} className="border-bottom">
                <td>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Link href={`/product-detail/${item.productId}`}>
                        <Image
                          src={item.productImageUrl || defaultProductImage}
                          alt={item.productName}
                          width={60}
                          height={60}
                          className="rounded object-cover"
                        />
                      </Link>
                    </div>
                    <div>
                      <Link 
                        href={`/product-detail/${item.productId}`}
                        className="text-decoration-none fw-medium text-dark mb-1 d-block fs-14 hover-primary"
                      >
                        {item.productName}
                      </Link>
                      <span className="text-muted fs-12 d-block">
                        {item.variationOptionValues && item.variationOptionValues.length > 0 && item.variationOptionValues[0]}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="text-center align-middle">
                  <span className="d-inline-block bg-light px-2 py-1 rounded fs-14">
                    {item.quantity}
                  </span>
                </td>
                <td className="text-end align-middle">
                  <span className="fs-14">{formatPrice(item.price)}</span>
                </td>
                <td className="text-end align-middle fw-medium">
                  <span className="fs-14">{formatPrice(item.price * item.quantity)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {cartProducts.length === 0 && (
        <div className="alert alert-warning">
          Giỏ hàng của bạn đang trống. Vui lòng quay lại <Link href="/products" className="alert-link">cửa hàng</Link> để mua sắm.
        </div>
      )}
    </div>
  );
} 