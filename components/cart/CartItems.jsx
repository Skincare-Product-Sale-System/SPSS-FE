"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/priceFormatter";
import request from "@/utils/axios";
import { defaultProductImage } from "@/utils/default";
import { toast } from "react-hot-toast";
import PriceFormatter from "@/components/ui/helpers/PriceFormatter";

export default function CartItems({ cartProducts, revalidate }) {
  const [quantityErrors, setQuantityErrors] = useState({});

  const setQuantity = (id, quantity) => {
    // Validate the quantity
    if (isNaN(quantity) || quantity < 1) {
      setQuantityErrors(prev => ({
        ...prev,
        [id]: "Số lượng không hợp lệ"
      }));
      return;
    }

    // Find the current item to check stock quantity
    const item = cartProducts.find(item => item.id === id);
    if (item && quantity > item.stockQuantity) {
      setQuantityErrors(prev => ({
        ...prev,
        [id]: `Chỉ còn ${item.stockQuantity} sản phẩm trong kho`
      }));
      return;
    }

    // Clear error if valid
    setQuantityErrors(prev => ({
      ...prev,
      [id]: null
    }));

    // Update quantity via API
    request
      .patch(`/cart-items/${id}`, { quantity })
      .then((res) => {
        revalidate();
      })
      .catch((err) => {
        console.log("err", err);
        toast.error("Đã xảy ra lỗi");
      });
  };

  const handleQuantityChange = (e, id, stockQuantity) => {
    const value = parseInt(e.target.value, 10);
    
    if (isNaN(value)) {
      setQuantityErrors(prev => ({
        ...prev,
        [id]: "Số lượng phải là số"
      }));
      return;
    }
    
    if (value < 1) {
      setQuantityErrors(prev => ({
        ...prev,
        [id]: "Số lượng tối thiểu là 1"
      }));
      return;
    }
    
    if (value > stockQuantity) {
      setQuantityErrors(prev => ({
        ...prev,
        [id]: `Chỉ còn ${stockQuantity} sản phẩm trong kho`
      }));
      return;
    }
    
    // Clear error if valid
    setQuantityErrors(prev => ({
      ...prev,
      [id]: null
    }));
    
    setQuantity(id, value);
  };

  return (
    <table className="tf-table-page-cart">
      <thead>
        <tr>
          <th style={{ fontFamily: 'var(--font-primary, "Roboto"), sans-serif' }}>Sản phẩm</th>
          <th style={{ 
            fontFamily: 'var(--font-primary, "Roboto"), sans-serif',
            textAlign: 'center'
          }}>Giá</th>
          <th style={{ 
            fontFamily: 'var(--font-primary, "Roboto"), sans-serif',
            textAlign: 'center'
          }}>Số lượng</th>
          <th style={{ 
            fontFamily: 'var(--font-primary, "Roboto"), sans-serif',
            textAlign: 'center'
          }}>Tổng cộng</th>
          <th style={{ 
            fontFamily: 'var(--font-primary, "Roboto"), sans-serif', 
            width: '60px',
            textAlign: 'center'
          }}></th>
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
              </div>
            </td>
            <td
              className="tf-cart-item_price"
              cart-data-title="Price"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
            >
              <div className="cart-price">
                <PriceFormatter price={elm.price} />
              </div>
            </td>
            <td
              className="tf-cart-item_quantity"
              cart-data-title="Quantity"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
            >
              <div className="cart-quantity">
                <div className="wg-quantity">
                  <span
                    className="btn-quantity minus-btn"
                    onClick={() => {
                      if (elm.quantity > 1) {
                        setQuantity(elm.id, elm.quantity - 1);
                      }
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
                    max={elm.stockQuantity}
                    onChange={(e) => handleQuantityChange(e, elm.id, elm.stockQuantity)}
                    className={quantityErrors[elm.id] ? "border-danger" : ""}
                  />
                  {quantityErrors[elm.id] && (
                    <div className="text-danger position-absolute" style={{ fontSize: '10px', whiteSpace: 'nowrap', bottom: '-15px', left: '0' }}>
                      {quantityErrors[elm.id]}
                    </div>
                  )}
                  <span
                    className="btn-quantity plus-btn"
                    onClick={() => {
                      if (elm.quantity < elm.stockQuantity) {
                        setQuantity(elm.id, elm.quantity + 1);
                      } else {
                        setQuantityErrors(prev => ({
                          ...prev,
                          [elm.id]: `Chỉ còn ${elm.stockQuantity} sản phẩm trong kho`
                        }));
                      }
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
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
            >
              <div className="cart-total">
                <PriceFormatter price={elm.price * elm.quantity} />
              </div>
            </td>
            <td 
              className="tf-cart-item_remove"
              style={{ textAlign: 'center', verticalAlign: 'middle' }}
            >
              <button
                className="btn-remove"
                style={{ 
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--danger, #dc3545)',
                  padding: '6px',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  width: '100%',
                  transition: 'all 0.2s'
                }}
                onClick={() =>
                  request
                    .delete(`/cart-items/${elm.id}`)
                    .then((res) => revalidate())
                    .catch((err) => toast.error("Lỗi khi xóa sản phẩm"))
                }
                title="Xóa sản phẩm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                  <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 