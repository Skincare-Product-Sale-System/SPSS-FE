import React from 'react';
import Image from "next/image";
import { Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export default function OrderInfoCards({ 
  order, 
  formatCurrency, 
  mainColor,
  getPaymentMethodName,
  getPaymentMethodImage,
  handleOpenPaymentDialog
}) {
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
              {order.paymentMethodId && getPaymentMethodImage(order.paymentMethodId) && (
                <Image
                  src={getPaymentMethodImage(order.paymentMethodId)}
                  alt={getPaymentMethodName(order.paymentMethodId)}
                  width={20}
                  height={20}
                  className="object-contain rounded"
                />
              )}
              {order.paymentMethodId 
                ? getPaymentMethodName(order.paymentMethodId)
                : "Chưa xác định"}
            </p>
          </div>
        </div>
        <div className="border-gray-200 border-t mt-2 pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="font-medium">
              {formatCurrency(order.orderTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="font-medium">{formatCurrency(0)}</span>
          </div>
          <div className="flex border-gray-200 border-t justify-between font-bold pt-1">
            <span>Tổng cộng</span>
            <span style={{ color: mainColor }}>
              {formatCurrency(order.orderTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 