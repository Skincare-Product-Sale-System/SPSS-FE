"use client"
import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { useThemeColors } from "@/context/ThemeContext";
import PriceFormatter from '@/components/ui/helpers/PriceFormatter';

export default function OrderCard({ 
  order, 
  onReviewClick, 
  formatCurrency, 
  getStatusColor 
}) {
  const mainColor = useThemeColors();

  return (
    <div className="border rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="flex bg-gray-50 border-b justify-between p-4 items-center">
        <div className="flex items-center">
          <span className="font-medium mr-2">Đơn hàng #{order.id.substring(0, 8)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        <span className="text-gray-500">{dayjs(order.createdTime).format("MMM DD, YYYY")}</span>
      </div>
      
      <div className="p-4">
        {order.orderDetails.map((item, index) => (
          <div key={index} className="flex justify-between items-start mb-4 last:mb-0">
            <Link 
              href={`/product-detail/${item.productId}`}
              className="flex flex-1 p-2 rounded-lg hover:bg-gray-50 items-center transition-all"
              style={{ textDecoration: 'none' }}
            >
              <div className="h-16 w-16 mr-4">
                {item.productImage && (
                  <img 
                    src={item.productImage} 
                    alt={item.productName} 
                    className="h-full rounded w-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.productName}</h4>
                {item.variationOptionValues && item.variationOptionValues.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    {item.variationOptionValues.join(', ')}
                  </p>
                )}
                <p className="text-sm">x{item.quantity}</p>
              </div>
            </Link>
            <div className="flex flex-row text-right gap-2 items-end">
              <PriceFormatter price={item.price} className="font-medium" />
              <button
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  order.status?.toLowerCase() === "delivered" && item.isReviewable
                    ? "hover:opacity-90 shadow-sm" 
                    : "cursor-not-allowed opacity-60"
                }`}
                style={{ 
                  backgroundColor: order.status?.toLowerCase() === "delivered" && item.isReviewable 
                    ? mainColor.primary || mainColor 
                    : "#E0E0E0",
                  color: order.status?.toLowerCase() === "delivered" && item.isReviewable 
                    ? "#FFFFFF" 
                    : "#757575",
                  border: "none",
                  fontWeight: "medium",
                  fontFamily: '"Roboto", sans-serif'
                }}
                disabled={order.status?.toLowerCase() !== "delivered" || !item.isReviewable}
                onClick={() => {
                  if (order.status?.toLowerCase() === "delivered" && item.isReviewable) {
                    onReviewClick(item, order.id);
                  }
                }}
              >
                {order.status?.toLowerCase() === "delivered" && !item.isReviewable
                  ? "Đã đánh giá"
                  : "Đánh giá"}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 border-t p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Tổng số tiền ({order.orderDetails.length} sản phẩm):</span>
          <PriceFormatter price={order.orderTotal} variant="h6" sx={{ fontWeight: 'bold' }} />
        </div>
        
        <div className="flex justify-end gap-3">
          <Link
            href={`/order-details?id=${order.id}`}
            className="bg-white border rounded-md hover:opacity-80 px-4 py-2 transition-colors"
            style={{ 
              color: mainColor, 
              borderColor: mainColor,
              backgroundColor: `${mainColor}10`,
              fontFamily: '"Roboto", sans-serif'
            }}
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}