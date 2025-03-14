"use client";
import React, { useState, useEffect } from "react";
import request from "@/utlis/axios";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import OrderDetail from "./_partial/OrderDetail";
import useAuthStore from "@/context/authStore";

export default function Orders() {
  const { Id } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Fetch orders
    request
      .get("/orders/user")
      .then((res) => {
        setOrders(res.data.data?.items || []);
      })
      .catch((err) => {
        toast.error("Failed to load orders");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleViewOrder = async (orderId) => {
    try {
      const response = await request.get(`/orders/${orderId}`);
      setSelectedOrder(response.data.data);
    } catch (err) {
      toast.error("Failed to load order details");
    }
  };

  const OrderStatus = ({ status }) => {
    const getStatusColor = () => {
      switch (status?.toLowerCase()) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
      >
        {status}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {dayjs(order.createdTime).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.orderTotal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatus status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-20">
                    {order.status == "Awaiting Payment" && (
                      <button
                        onClick={async () => {
                          const vnpayRes = await request.get(
                            `/VNPAY/get-transaction-status-vnpay?orderId=${order.id}&userId=${Id}&urlReturn=http%3A%2F%2Flocalhost%3A3000%2Fmy-orders`
                          );
                          if (vnpayRes.status === 200) {
                            location.href = vnpayRes.data.data;
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Checkout
                      </button>
                    )}
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
