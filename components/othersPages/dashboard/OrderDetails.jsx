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
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useAuthStore from "@/context/authStore";
import ProductReviewModal from "../ProductReviewModal";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PaymentsIcon from '@mui/icons-material/Payments';

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const mainColor = useThemeColors();
  const [reasons, setReasons] = useState([]);
  const [reason, setReason] = useState();
  const [selectedReason, setCancelReason] = useState("");
  const router = useRouter();
  const { Id } = useAuthStore();
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  useEffect(() => {
    request.get(`/cancel-reasons/${order?.cancelReasonId}`).then(({ data }) => {
      setReason(data.data.description);
    });
  }, [order]);

  useEffect(() => {
    request.get("/cancel-reasons").then(({ data }) => {
      setReasons(data.data.items);
    });
  }, []);

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
        `/VNPAY/get-transaction-status-vnpay?orderId=${order.id}&userId=${Id}&urlReturn=https%3A%2F%2Flocalhost%3A44358`
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
      await request.patch(`/orders/${order.id}/status?newStatus=Cancelled&cancelReasonId=${selectedReason}`);
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

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
      case "awaiting payment":
        return { currentStep: 1, lastValidStep: 1 };
      case "processing":
        return { currentStep: 2, lastValidStep: 2 };
      case "delivering":
        return { currentStep: 3, lastValidStep: 3 };
      case "delivered":
      case "completed":
        return { currentStep: 4, lastValidStep: 4 };
      case "cancelled":
        // Xác định bước cuối cùng trước khi hủy
        const lastStatus = order.statusChanges?.[order.statusChanges.length - 2]?.status.toLowerCase();
        let lastValidStep = 1;
        if (lastStatus === "processing") lastValidStep = 2;
        else if (lastStatus === "delivered") lastValidStep = 4;
        else if (lastStatus === "delivering") lastValidStep = 3;
        return { currentStep: -1, lastValidStep };
      default:
        return { currentStep: 1, lastValidStep: 1 };
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <PendingIcon sx={{ fontSize: 20 }} />;
      case "processing":
        return <InventoryIcon sx={{ fontSize: 20 }} />;
      case "delivering":
        return <LocalShippingIcon sx={{ fontSize: 20 }} />;
      case "delivered":
        return <CheckCircleIcon sx={{ fontSize: 20 }} />;
      case "cancelled":
        return <CancelIcon sx={{ fontSize: 20 }} />;
      case "awaiting payment":
        return <PaymentsIcon sx={{ fontSize: 20 }} />;
      default:
        return <PendingIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getStatusCircleColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "delivering":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      case "awaiting payment":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
        return "border-green-500";
      case "pending":
        return "border-yellow-500";
      case "processing":
        return "border-blue-500";
      case "delivering":
        return "border-blue-500";
      case "cancelled":
        return "border-red-500";
      case "awaiting payment":
        return "border-blue-500";
      default:
        return "border-gray-500";
    }
  };

  function isStatusBefore(checkStatus, currentStatus) {
    const orderFlow = [
      "pending",
      "awaiting payment",
      "processing",
      "delivering",
      "delivered",
      "completed",
      "cancelled"
    ];
    
    const checkIndex = orderFlow.findIndex(s => s === checkStatus.toLowerCase());
    const currentIndex = orderFlow.findIndex(s => s === currentStatus.toLowerCase());
    
    return checkIndex < currentIndex && checkIndex !== -1 && currentIndex !== -1;
  }

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

  const { currentStep, lastValidStep } = getStatusInfo(order.status);

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
            "&:hover": {
              borderColor: mainColor,
              backgroundColor: `${mainColor}10`,
            },
          }}
        >
          Back to List
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-base font-medium mb-1">
              Order #{order.id.substring(0, 8)}
            </h3>
            <p className="text-gray-500 text-sm">
              {dayjs(order.createdTime).format("MMMM DD, YYYY")} •{" "}
              {order.orderDetails.length} Products
            </p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        {/* Order Progress Tracker */}
        <div className="mb-4">
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              {/* Progress Line Background */}
              <div 
                className="absolute top-4 left-12 right-12 h-1 rounded-full -z-5"
                style={{
                  background: currentStep === -1 
                    ? `linear-gradient(to right, 
                        #14b8a6 ${((lastValidStep - 1) / 2) * 100}%, 
                        #ef4444 ${((lastValidStep - 1) / 2) * 100}%, 
                        #ef4444 100%
                      )`
                    : `linear-gradient(to right, 
                        #14b8a6 ${((currentStep - 1) / 3) * 100}%, 
                        #e5e7eb ${((currentStep - 1) / 3) * 100}%
                      )`
                }}
              />

              {/* Step Circles */}
              <div className="flex items-center justify-between w-full relative z-10">
                {currentStep === -1 ? (
                  // Hiển thị 3 bước khi cancelled
                  ['Order', 'Processing', 'Cancelled'].map((label, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                          index === 2 
                            ? "bg-red-500 text-white shadow-lg shadow-red-200" // Circle Cancelled luôn đỏ
                            : index + 1 <= lastValidStep
                              ? "bg-teal-500 text-white shadow-lg shadow-teal-200" // Circle hoàn thành
                              : "bg-gray-200" // Circle chưa hoàn thành
                        }`}
                      >
                        <span className="text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs mt-1">{label}</span>
                    </div>
                  ))
                ) : (
                  // Hiển thị 4 bước bình thường
                  // Hiển thị 4 bước bình thường: Order > Processing > Delivering > Delivered
                  ['Order', 'Processing', 'Delivering', 'Delivered'].map((label, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                          index + 1 <= currentStep
                            ? "bg-teal-500 text-white shadow-lg shadow-teal-200"
                            : "bg-gray-200"
                        }`}
                      >
                        <span className="text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs mt-1">{label}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2 border-b pb-1">
              SHIPPING ADDRESS
            </h4>
            <p className="font-medium">{order.address.customerName}</p>
            <p>{order.address.addressLine1}</p>
            {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
            <p>
              {order.address.city}, {order.address.province}{" "}
              {order.address.postcode}
            </p>
            <p>{order.address.countryName}</p>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-1">PHONE</p>
              <p>{order.address.phoneNumber}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2 border-b pb-1">
              ORDER SUMMARY
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  ORDER ID:
                </p>
                <p className="font-medium">#{order.id.substring(0, 8)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">
                  PAYMENT:
                </p>
                <p className="font-medium">
                  {order.paymentMethodId ===
                  "354EDA95-5BE5-41BE-ACC3-CFD70188118A".toLowerCase()
                    ? "VNPay"
                    : "Cash on delivery"}
                </p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  {formatCurrency(order.orderTotal)}
                </span>
              </div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-gray-200">
                <span>Total</span>
                <span style={{ color: mainColor }}>
                  {formatCurrency(order.orderTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items - More compact */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2 border-b pb-1">
            PRODUCTS
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase">
                    PRODUCT
                  </th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase">
                    PRICE
                  </th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase">
                    QTY
                  </th>
                  <th className="py-2 px-3 text-right text-xs font-medium text-gray-500 uppercase">
                    TOTAL
                  </th>
                  <th className="py-2 px-3 text-center text-xs font-medium text-gray-500 uppercase">
                    ACTION
                  </th>
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
                            href={`/product-detail/${item.productId}`}
                            className="font-medium text-gray-900 text-sm hover:text-[color:var(--mainColor)] transition-colors"
                          >
                            {item.productName}
                          </Link>
                          {item.variationOptionValues &&
                            item.variationOptionValues.length > 0 && (
                              <div className="text-xs text-gray-500">
                                {item.variationOptionValues.join(", ")}
                              </div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="py-2 px-3 text-center">x{item.quantity}</td>
                    <td className="py-2 px-3 text-right font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </td>
                    <td className="py-2 px-3 text-center">
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
                            // Open review modal instead of navigation
                            setSelectedProduct(item);
                            setReviewModalOpen(true);
                          }
                        }}
                      >
                        {order.status?.toLowerCase() === "delivered" && !item.isReviewable
                          ? "Reviewed"
                          : "Review"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Timeline */}
        {order.statusChanges && order.statusChanges.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">
              ORDER HISTORY
            </h4>
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
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white
                              ${
                                // Kiểm tra nếu là status cuối
                                ["Delivered", "Completed", "Cancelled"].includes(statusChange.status) || 
                                // HOẶC nếu là status đã qua
                                isStatusBefore(statusChange.status, order.status)
                                  ? `${getStatusCircleColor(statusChange.status)} text-white`
                                  
                                  // Nếu là status hiện tại nhưng không phải cuối
                                  : statusChange.status === order.status
                                    ? `bg-white border-2 border-dashed ${getStatusBorderColor(statusChange.status)}`
                                    
                                    // Còn lại là các status sắp tới
                                    : "bg-gray-200"
                              }
                            `}
                          >
                            {/* Đảm bảo icon trắng khi status là cuối cùng hoặc đã qua */}
                            <div className={
                              ["Delivered", "Completed", "Cancelled"].includes(statusChange.status) || 
                              isStatusBefore(statusChange.status, order.status)
                                ? "text-white" 
                                : statusChange.status === order.status
                                  ? getStatusBorderColor(statusChange.status).replace("border-", "text-")
                                  : "text-gray-500"
                            }>
                              {getStatusIcon(statusChange.status)}
                            </div>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between items-center space-x-2">
                          <div>
                            <p className="text-sm text-gray-600">
                              Status:{" "}
                              <span className="font-medium text-gray-900">
                                {statusChange.status}
                              </span> {statusChange.status === "Cancelled" && <div>({reason})</div>}
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
        {(order.status === "Processing" ||
          order.status === "Awaiting Payment") && (
          <div className="mt-4 flex justify-end gap-3">
            {order.status === "Awaiting Payment" && (
              <Button
                variant="contained"
                size="small"
                onClick={handlePayNow}
                sx={{
                  backgroundColor: mainColor,
                  "&:hover": {
                    backgroundColor: `${mainColor}dd`,
                  },
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
                backgroundColor: "#d32f2f",
                color: "white",
                "&:hover": {
                  backgroundColor: "#c62828",
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
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.1rem", pb: 1 }}>
          {"Cancel Order"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontSize: "0.9rem" }}
          >
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <Select
          className="mx-8"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          // fullWidth
          size="small"
          sx={{ mb: 2 }}
        >
          {reasons.map((reason) => (
            <MenuItem key={reason.id} value={reason.id}>
              {reason.description}
            </MenuItem>
          ))}
        </Select>
        <DialogActions sx={{ padding: "8px 16px" }}>
          <Button
            onClick={() => setOpenCancelDialog(false)}
            variant="outlined"
            size="small"
            sx={{
              borderColor: mainColor,
              color: mainColor,
              "&:hover": {
                borderColor: mainColor,
                backgroundColor: `${mainColor}10`,
              },
            }}
          >
            No, Keep Order
          </Button>
          <Button
            onClick={handleCancelOrder}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#d32f2f",
              color: "white",
              "&:hover": {
                backgroundColor: "#c62828",
              },
            }}
          >
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add review modal */}
      {selectedProduct && (
        <ProductReviewModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          productInfo={selectedProduct}
          orderId={order.id}
          onSubmitSuccess={() => {
            // Refetch order details after successful review submission
            fetchOrderDetails();
          }}
        />
      )}
    </div>
  );
}
