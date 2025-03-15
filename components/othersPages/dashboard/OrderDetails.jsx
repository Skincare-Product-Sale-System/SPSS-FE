"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import request from "@/utlis/axios";
import dayjs from "dayjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useThemeColors } from "@/context/ThemeContext";
import { 
  CircularProgress, 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useAuthStore from "@/context/authStore";

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const mainColor = useThemeColors();
  const router = useRouter();
  const { Id } = useAuthStore();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await request.get(`/orders/${orderId}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    try {
      const vnpayRes = await request.get(
        `/VNPAY/get-transaction-status-vnpay?orderId=${order.id}&userId=${Id}&urlReturn=http%3A%2F%2Flocalhost%3A3000%2Fmy-account-orders-details?id=${order.id}`
      );
      if (vnpayRes.status === 200) {
        location.href = vnpayRes.data.data;
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await request.patch(`/orders/${order.id}/status?newStatus=Cancelled`);
      setOpenCancelDialog(false);
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error("Error cancelling order:", error);
      setOpenCancelDialog(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "awaiting payment":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "on the way":
        return 3;
      case "delivered":
        return 4;
      case "completed":
        return 4;
      default:
        return 1;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <CircularProgress sx={{ color: mainColor }} />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div className="my-account-content account-order-details">
      <div className="flex justify-end py-2">
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          href="/my-account-orders"
          size="small"
          sx={{ 
            borderColor: mainColor,
            color: mainColor,
            '&:hover': {
              borderColor: mainColor,
              backgroundColor: `${mainColor}10`,
            }
          }}
        >
          Back to List
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-base font-medium mb-1">Order #{order.id.substring(0, 8)}</h3>
            <p className="text-gray-500 text-sm">
              {dayjs(order.createdTime).format("MMMM DD, YYYY")} • {order.orderDetails.length} Products
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        {/* Order Progress Tracker - More compact */}
        <div className="mb-4">
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
                  <span className="text-xs">01</span>
                </div>
                <span className="text-xs mt-1">Order</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
                  <span className="text-xs">02</span>
                </div>
                <span className="text-xs mt-1">Process</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
                  <span className="text-xs">03</span>
                </div>
                <span className="text-xs mt-1">Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full ${currentStep >= 4 ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}>
                  <span className="text-xs">04</span>
                </div>
                <span className="text-xs mt-1">Delivered</span>
              </div>
            </div>
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
              <div 
                className="h-full bg-teal-500" 
                style={{ width: `${(currentStep - 1) * 33.33}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2 border-b pb-1">SHIPPING ADDRESS</h4>
            <p className="font-medium">{order.address.customerName}</p>
            <p>{order.address.addressLine1}</p>
            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
            <p>{order.address.city}, {order.address.province} {order.address.postcode}</p>
            <p>{order.address.countryName}</p>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-1">PHONE</p>
              <p>{order.address.phoneNumber}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2 border-b pb-1">ORDER SUMMARY</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">ORDER ID:</p>
                <p className="font-medium">#{order.id.substring(0, 8)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">PAYMENT:</p>
                <p className="font-medium">
                  {order.paymentMethodId === "2bbc0050-bfae-4764-8bd7-8c73579ee3e1".toLowerCase() 
                    ? "VNPay" 
                    : "Cash on delivery"}
                </p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(order.orderTotal)}</span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-gray-200">
                <span>Total</span>
                <span style={{ color: mainColor }}>{formatCurrency(order.orderTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items - More compact */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2 border-b pb-1">PRODUCTS</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">PRODUCT</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase">PRICE</th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase">QTY</th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.orderDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 px-3">
                      <div className="flex items-center">
                        <Link 
                          href={`/product-detail/${item.productId}`}
                          className="flex-shrink-0 h-12 w-12 mr-3 hover:opacity-80 transition-opacity"
                        >
                          <Image
                            src={item.productImage || "/images/products/placeholder.jpg"}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </Link>
                        <div>
                          <Link 
                            href={`/product-detail/${item.productId}`}
                            className="font-medium text-gray-900 text-sm hover:text-[color:var(--mainColor)] transition-colors"
                          >
                            {item.productName}
                          </Link>
                          {item.variationOptionValues && item.variationOptionValues.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {item.variationOptionValues.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-2 px-3 text-center">x{item.quantity}</td>
                    <td className="py-2 px-3 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Timeline - More compact */}
        {order.statusChanges && order.statusChanges.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">ORDER HISTORY</h4>
            <div className="flow-root">
              <ul role="list" className="-mb-4">
                {order.statusChanges.map((statusChange, idx) => (
                  <li key={idx}>
                    <div className="relative pb-4">
                      {idx !== order.statusChanges.length - 1 ? (
                        <span
                          className="absolute left-3 top-3 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-6 w-6 rounded-full ${getStatusColor(statusChange.status).replace('text-', 'bg-').replace('100', '500')} flex items-center justify-center ring-4 ring-white`}>
                            <svg
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11.414l4.707-4.707-1.414-1.414L11 10.586V5H9v5.586L5.707 7.293 4.293 8.707 9 13.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between items-center space-x-2">
                          <div>
                            <p className="text-xs text-gray-500">
                              Status: <span className="font-medium text-gray-900">{statusChange.status}</span>
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-xs text-gray-500">
                            {dayjs(statusChange.date).format("MMM DD, HH:mm")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons - Only show for appropriate statuses */}
        {(order.status === "Pending" || order.status === "Awaiting Payment") && (
          <div className="mt-4 flex justify-end gap-3">
            {order.status === "Awaiting Payment" && (
              <Button
                variant="contained"
                size="small"
                onClick={handlePayNow}
                sx={{
                  backgroundColor: mainColor,
                  '&:hover': {
                    backgroundColor: `${mainColor}dd`,
                  }
                }}
              >
                Pay Now
              </Button>
            )}
            <Button 
              onClick={() => setOpenCancelDialog(true)}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#d32f2f',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#c62828',
                },
              }}
            >
              Cancel Order
            </Button>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: '1.1rem', pb: 1 }}>
          {"Cancel Order"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ fontSize: '0.9rem' }}>
            Are you sure you want to cancel this order? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '8px 16px' }}>
          <Button 
            onClick={() => setOpenCancelDialog(false)}
            variant="outlined"
            size="small"
            sx={{ 
              borderColor: mainColor,
              color: mainColor,
              '&:hover': {
                borderColor: mainColor,
                backgroundColor: `${mainColor}10`,
              }
            }}
          >
            No, Keep Order
          </Button>
          <Button 
            onClick={handleCancelOrder} 
            variant="contained"
            size="small"
            sx={{
              backgroundColor: '#d32f2f',
              color: 'white', 
              '&:hover': {
                backgroundColor: '#c62828',
              }
            }}
          >
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
