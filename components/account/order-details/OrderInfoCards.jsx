import React from 'react';
import Image from "next/image";
import { Tooltip, IconButton, Skeleton, Chip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function OrderInfoCards({ 
  order, 
  formatCurrency, 
  mainColor,
  getPaymentMethodName,
  getPaymentMethodImage,
  handleOpenPaymentDialog
}) {
  const paymentMethodName = order.paymentMethodId 
    ? getPaymentMethodName(order.paymentMethodId)
    : "Chưa xác định";
    
  const paymentMethodImage = order.paymentMethodId 
    ? getPaymentMethodImage(order.paymentMethodId)
    : "";

  // Calculate discount percentage if both originalOrderTotal and discountAmount exist
  const discountPercentage = order.originalOrderTotal && order.discountAmount
    ? Math.round((order.discountAmount / order.originalOrderTotal) * 100)
    : null;

  return (
    <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
      <div className="bg-gray-50 p-3 rounded-lg text-sm">
        <h4 className="border-b text-gray-700 text-xs font-semibold mb-2 pb-1 uppercase">
          ĐỊA CHỈ GIAO HÀNG
        </h4>
        <p className="font-medium">{order.address.customerName}</p>
        <p>{order.address.addressLine1}</p>
        {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
        <p>
          {order.address.city}, {order.address.province}{" "}
          {order.address.postcode}
        </p>
        <p>{order.address.countryName}</p>
        <div className="border-gray-200 border-t mt-2 pt-2">
          <p className="text-gray-700 text-xs font-semibold mb-1">ĐIỆN THOẠI</p>
          <p>{order.address.phoneNumber}</p>
        </div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg text-sm">
        <h4 className="border-b text-gray-700 text-xs font-semibold mb-2 pb-1 uppercase">
          THÔNG TIN ĐƠN HÀNG
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-gray-700 text-xs font-semibold mb-1">
              MÃ ĐƠN HÀNG:
            </p>
            <p className="font-medium">#{order.id.substring(0, 8)}</p>
          </div>
          <div>
            <p className="text-gray-700 text-xs font-semibold mb-1 flex items-center">
              THANH TOÁN:
              {order.status === "Awaiting Payment" && (
                <Tooltip title="Thay đổi phương thức thanh toán">
                  <IconButton 
                    size="small" 
                    onClick={handleOpenPaymentDialog}
                    sx={{ ml: 0.5, p: 0.5 }}
                  >
                    <EditIcon fontSize="small" sx={{ width: 14, height: 14, color: mainColor.primary }} />
                  </IconButton>
                </Tooltip>
              )}
            </p>
            <p className="font-medium flex items-center gap-1">
              {paymentMethodImage ? (
                <Image
                  src={paymentMethodImage}
                  alt={paymentMethodName}
                  width={20}
                  height={20}
                  className="object-contain rounded"
                />
              ) : null}
              {paymentMethodName}
            </p>
          </div>
        </div>
        
        {/* Voucher section if voucher code exists */}
        {order.voucherCode && (
          <div className="border-gray-200 border-t mt-2 pt-2 mb-2">
            <div className="flex items-center mb-1">
              <LocalOfferIcon sx={{ fontSize: 16, color: mainColor.primary, mr: 0.5 }} />
              <span className="text-gray-700 text-xs font-semibold">VOUCHER ĐÃ ÁP DỤNG:</span>
            </div>
            <div className="flex items-center">
              <Chip 
                label={order.voucherCode}
                size="small"
                sx={{ 
                  bgcolor: `${mainColor.primary}15`, 
                  color: mainColor.primary,
                  fontWeight: 'medium',
                  fontSize: '0.75rem',
                  height: '22px'
                }}
              />
              {discountPercentage && (
                <span className="ml-2 bg-red-100 text-red-700 rounded px-1 py-0.5 text-xs font-medium">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="border-gray-200 border-t mt-2 pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-medium">
              {formatCurrency(order.originalOrderTotal || order.orderTotal)}
            </span>
          </div>
          
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Giảm giá:</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(order.discountAmount)}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="font-medium">{formatCurrency(0)}</span>
          </div>
          
          <div className="flex border-gray-200 border-t justify-between font-bold pt-1">
            <span>Tổng cộng</span>
            <span style={{ color: mainColor }}>
              {formatCurrency(order.discountedOrderTotal || order.orderTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 