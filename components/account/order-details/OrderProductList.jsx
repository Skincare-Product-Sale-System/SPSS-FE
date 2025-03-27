import React from 'react';
import Image from "next/image";
import Link from "next/link";

export default function OrderProductList({ 
  order, 
  formatCurrency, 
  mainColor, 
  handleOpenReviewModal 
}) {
  return (
    <div className="mt-4">
      <h4 className="border-b text-gray-700 text-xs font-semibold mb-2 pb-1 uppercase">
        SẢN PHẨM
      </h4>
      <div className="overflow-x-auto">
        <table className="text-sm w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-gray-500 text-left text-xs font-medium px-3 py-2 uppercase">
                SẢN PHẨM
              </th>
              <th className="text-gray-500 text-right text-xs font-medium px-3 py-2 uppercase">
                GIÁ
              </th>
              <th className="text-center text-gray-500 text-xs font-medium px-3 py-2 uppercase">
                SỐ LƯỢNG
              </th>
              <th className="text-gray-500 text-right text-xs font-medium px-3 py-2 uppercase">
                TỔNG TIỀN
              </th>
              <th className="text-center text-gray-500 text-xs font-medium px-3 py-2 uppercase">
                THAO TÁC
              </th>
            </tr>
          </thead>
          <tbody className="divide-gray-200 divide-y">
            {order.orderDetails.map((item, index) => (
              <tr key={index}>
                <td className="px-3 py-2">
                  <div className="flex items-center">
                    <Link
                      href={`/product-detail?id=${item.productId}`}
                      className="flex-shrink-0 h-12 w-12 hover:opacity-80 mr-3 transition-opacity"
                    >
                      <Image
                        src={
                          item.productImage ||
                          "/images/products/placeholder.jpg"
                        }
                        alt={item.productName}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </Link>
                    <div>
                      <Link
                        href={`/product-detail?id=${item.productId}`}
                        className="text-gray-900 text-sm font-medium hover:text-[color:var(--mainColor)] transition-colors"
                      >
                        {item.productName}
                      </Link>
                      {item.variationOptionValues &&
                        item.variationOptionValues.length > 0 && (
                          <div className="text-gray-500 text-xs">
                            {item.variationOptionValues.join(", ")}
                          </div>
                        )}
                    </div>
                  </div>
                </td>
                <td className="text-right px-3 py-2">
                  {formatCurrency(item.price)}
                </td>
                <td className="text-center px-3 py-2">x{item.quantity}</td>
                <td className="text-right font-medium px-3 py-2">
                  {formatCurrency(item.price * item.quantity)}
                </td>
                <td className="text-center px-3 py-2">
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
                      fontWeight: "medium"
                    }}
                    disabled={order.status?.toLowerCase() !== "delivered" || !item.isReviewable}
                    onClick={() => {
                      if (order.status?.toLowerCase() === "delivered" && item.isReviewable) {
                        handleOpenReviewModal(item);
                      }
                    }}
                  >
                    {order.status?.toLowerCase() === "delivered" && !item.isReviewable
                      ? "Đã đánh giá"
                      : "Đánh giá"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 