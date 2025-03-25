"use client";
import React from "react";

export default function CartHeader() {
  return (
    <div className="tf-cart-countdown">
      <div className="title-left">
        <svg
          className="d-inline-block"
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={24}
          viewBox="0 0 16 24"
          fill="rgb(219 18 21)"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.0899 24C11.3119 22.1928 11.4245 20.2409 10.4277 18.1443C10.1505 19.2691 9.64344 19.9518 8.90645 20.1924C9.59084 18.2379 9.01896 16.1263 7.19079 13.8576C7.15133 16.2007 6.58824 17.9076 5.50148 18.9782C4.00436 20.4517 4.02197 22.1146 5.55428 23.9669C-0.806588 20.5819 -1.70399 16.0418 2.86196 10.347C3.14516 11.7228 3.83141 12.5674 4.92082 12.8809C3.73335 7.84186 4.98274 3.54821 8.66895 0C8.6916 7.87426 11.1062 8.57414 14.1592 12.089C17.4554 16.3071 15.5184 21.1748 10.0899 24Z"
          />
        </svg>
        <p style={{ fontFamily: '"Roboto", sans-serif' }}>Những sản phẩm này có số lượng giới hạn, vui lòng thanh toán trong</p>
      </div>
      <div
        className="js-countdown timer-count"
        data-timer={600}
        data-labels="d:,h:,m:,s"
      />
    </div>
  );
} 