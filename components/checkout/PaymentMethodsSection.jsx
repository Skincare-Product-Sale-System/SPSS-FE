"use client";
import React from "react";
import Image from "next/image";

export default function PaymentMethodsSection({ 
  paymentMethods, 
  selectedPaymentMethod, 
  onSelectPaymentMethod 
}) {
  return (
    <div className="mb-4">
      <h5 className="fw-5 mb-3" style={{ fontFamily: '"Roboto", sans-serif' }}>
        2. Phương Thức Thanh Toán
      </h5>
      
      <div className="row g-2">
        {paymentMethods.map((method) => (
          <div key={method.id} className="col-md-6">
            <div 
              className={`border rounded p-3 ${selectedPaymentMethod === method.id ? 'border-primary' : ''}`}
              onClick={() => onSelectPaymentMethod(method.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="form-check d-flex align-items-center gap-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment"
                  id={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => onSelectPaymentMethod(method.id)}
                />
                <Image
                  src={method.imageUrl} 
                  alt={method.paymentType} 
                  width={40} 
                  height={25} 
                  className="object-contain"
                />
                <label className="form-check-label ms-1" htmlFor={method.id}>
                  {method.paymentType === "COD" ? "Thanh toán khi nhận hàng (COD)" : `Thanh toán qua ${method.paymentType}`}
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 