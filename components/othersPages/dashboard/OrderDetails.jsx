"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import request from "@/utils/axios";
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
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from '@mui/icons-material/Edit';
import PaymentIcon from '@mui/icons-material/Payment';
import useAuthStore from "@/context/authStore";
import ProductReviewModal from "../ProductReviewModal";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PaymentsIcon from '@mui/icons-material/Payments';
import toast from "react-hot-toast";

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
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const [updatingPayment, setUpdatingPayment] = useState(false);

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

  useEffect(() => {
    if (openPaymentDialog) {
      fetchPaymentMethods();
    }
  }, [openPaymentDialog]);

  const fetchPaymentMethods = async () => {
    try {
      const response = await request.get("/payment-methods");
      if (response.data && response.data.data) {
        setPaymentMethods(response.data.data.items || []);
        if (order && order.paymentMethodId) {
          setSelectedPaymentMethod(order.paymentMethodId);
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Không thể lấy danh sách phương thức thanh toán");
    }
  };

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await request.get(`/orders/${orderId}`);
      setOrder(response.data.data);
      if (response.data.data.paymentMethodId) {
        setSelectedPaymentMethod(response.data.data.paymentMethodId);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    if (!selectedPaymentMethod) {
      setPaymentMethodError("Vui lòng chọn phương thức thanh toán");
      return;
    }

    try {
      setUpdatingPayment(true);
      const response = await request.patch(
        `/orders/${order.id}/payment-method?paymentMethodId=${selectedPaymentMethod}`
      );
      
      if (response.status === 200) {
        toast.success("Cập nhật phương thức thanh toán thành công");
        setOpenPaymentDialog(false);
        fetchOrderDetails();
      }
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Không thể cập nhật phương thức thanh toán");
    } finally {
      setUpdatingPayment(false);
    }
  };

  const getPaymentMethodName = (paymentMethodId) => {
    const method = paymentMethods.find(m => m.id === paymentMethodId);
    return method ? method.name : (
      order.paymentMethodId === "354EDA95-5BE5-41BE-ACC3-CFD70188118A".toLowerCase()
        ? "VNPay"
        : "Thanh toán khi nhận hàng"
    );
  };

  const handlePayNow = async () => {
    try {
      const vnpayRes = await request.get(
        `/VNPAY/get-transaction-status-vnpay?orderId=${order.id}&userId=${Id}&urlReturn=https%3A%2F%2Fspssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net`
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
      fetchOrderDetails();
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
      <div className="flex justify-center items-center py-8">
        <CircularProgress sx={{ color: mainColor }} />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  const { currentStep, lastValidStep } = getStatusInfo(order.status);

  return (
    <div className="account-order-details my-account-content">
      <div className="flex justify-end py-2">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          href="/my-account-orders"
          size="small"
          sx={{
            borderColor: mainColor,
            color: mainColor,
            fontFamily: '"Roboto", sans-serif',
            "&:hover": {
              borderColor: mainColor,
              backgroundColor: `${mainColor}10`,
            },
          }}
        >
          Quay Lại Danh Sách
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-base font-medium mb-1">
              Đơn Hàng #{order.id.substring(0, 8)}
            </h3>
            <p className="text-gray-500 text-sm">
              {dayjs(order.createdTime).format("DD/MM/YYYY")} •{" "}
              {order.orderDetails.length} Sản phẩm
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

        <div className="mb-4">
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <div 
                className="h-1 rounded-full -z-5 absolute left-12 right-12 top-4"
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

              <div className="flex justify-between w-full items-center relative z-10">
                {currentStep === -1 ? (
                  ['Đặt hàng', 'Xử lý', 'Đã hủy'].map((label, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                          index === 2 
                            ? "bg-red-500 text-white shadow-lg shadow-red-200"
                            : index + 1 <= lastValidStep
                              ? "bg-teal-500 text-white shadow-lg shadow-teal-200"
                              : "bg-gray-200"
                        }`}
                      >
                        <span className="text-xs">{(index + 1).toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs mt-1">{label}</span>
                    </div>
                  ))
                ) : (
                  ['Đặt hàng', 'Xử lý', 'Đang giao', 'Đã giao'].map((label, index) => (
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
                        onClick={() => setOpenPaymentDialog(true)}
                        sx={{ ml: 0.5, p: 0.5 }}
                      >
                        <EditIcon fontSize="small" sx={{ width: 14, height: 14, color: mainColor.primary }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </p>
                <p className="font-medium">
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
                          href={`/product-detail/${item.productId}`}
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
                            href={`/product-detail/${item.productId}`}
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
                            setSelectedProduct(item);
                            setReviewModalOpen(true);
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

        {order.statusChanges && order.statusChanges.length > 0 && (
          <div className="border-t mt-4 pt-3">
            <h4 className="text-gray-700 text-xs font-semibold mb-2 uppercase">
              LỊCH SỬ ĐƠN HÀNG
            </h4>
            <div className="flow-root">
              <ul role="list" className="-mb-4">
                {order.statusChanges.map((statusChange, idx) => (
                  <li key={idx}>
                    <div className="pb-4 relative">
                      {idx !== order.statusChanges.length - 1 ? (
                        <span
                          className="bg-gray-200 h-full w-0.5 -ml-px absolute left-3 top-3"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="flex relative space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white
                              ${
                                ["Delivered", "Completed", "Cancelled"].includes(statusChange.status) || 
                                isStatusBefore(statusChange.status, order.status)
                                  ? `${getStatusCircleColor(statusChange.status)} text-white`
                                  
                                  : statusChange.status === order.status
                                    ? `bg-white border-2 border-dashed ${getStatusBorderColor(statusChange.status)}`
                                    
                                    : "bg-gray-200"
                              }
                            `}
                          >
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
                        <div className="flex flex-1 justify-between items-center min-w-0 space-x-2">
                          <div>
                            <p className="text-gray-600 text-sm">
                              Trạng thái:{" "}
                              <span className="text-gray-900 font-medium">
                                {translateStatus(statusChange.status)}
                              </span>
                              {statusChange.status === "Cancelled" && <div>(Lý do: {reason})</div>}
                            </p>
                          </div>
                          <div className="text-gray-500 text-right text-xs whitespace-nowrap">
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

        {(order.status === "Processing" ||
          order.status === "Awaiting Payment") && (
          <div className="flex justify-end gap-3 mt-4">
            {order.status === "Awaiting Payment" && (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PaymentIcon />}
                  onClick={() => setOpenPaymentDialog(true)}
                  sx={{
                    borderColor: mainColor,
                    color: mainColor,
                    "&:hover": {
                      borderColor: mainColor,
                      backgroundColor: `${mainColor}15`,
                    },
                  }}
                >
                  Đổi phương thức
                </Button>
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
                  Thanh Toán Ngay
                </Button>
              </>
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
              Hủy Đơn Hàng
            </Button>
          </div>
        )}
      </div>

      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ fontSize: "1.1rem", pb: 1 }}>
          {"Hủy Đơn Hàng"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ fontSize: "0.9rem" }}
          >
            Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <Select
          className="mx-8"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={(e) => setCancelReason(e.target.value)}
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
            Không, Giữ Đơn Hàng
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
            Có, Hủy Đơn Hàng
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedProduct(null);
        }}
        aria-labelledby="review-modal-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="review-modal-title" sx={{ fontSize: "1.1rem", pb: 1 }}>
          Đánh giá sản phẩm
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.9rem", mb: 2 }}>
            Hãy đánh giá sản phẩm này để giúp chúng tôi cải thiện chất lượng dịch vụ.
          </DialogContentText>
          <ProductReviewModal
            productInfo={selectedProduct}
            orderId={order.id}
            onSubmitSuccess={() => {
              fetchOrderDetails();
            }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "8px 16px" }}>
          <Button
            onClick={() => setReviewModalOpen(false)}
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#9e9e9e",
              color: "#757575",
              "&:hover": {
                borderColor: "#757575",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              setReviewModalOpen(false);
              setSelectedProduct(null);
            }}
            variant="contained"
            size="small"
            sx={{
              backgroundColor: mainColor,
              color: "white",
              "&:hover": {
                backgroundColor: `${mainColor}dd`,
              },
            }}
          >
            Đánh giá
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPaymentDialog}
        onClose={() => !updatingPayment && setOpenPaymentDialog(false)}
        aria-labelledby="payment-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="payment-dialog-title" sx={{ fontSize: "1.1rem", pb: 1 }}>
          Thay đổi phương thức thanh toán
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.9rem", mb: 2 }}>
            Chọn phương thức thanh toán bạn muốn sử dụng cho đơn hàng này.
          </DialogContentText>
          
          <FormControl 
            fullWidth 
            error={!!paymentMethodError}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          >
            <InputLabel id="payment-method-label">Phương thức thanh toán</InputLabel>
            <Select
              labelId="payment-method-label"
              id="payment-method-select"
              value={selectedPaymentMethod}
              onChange={(e) => {
                setSelectedPaymentMethod(e.target.value);
                setPaymentMethodError("");
              }}
              label="Phương thức thanh toán"
              disabled={updatingPayment}
            >
              {paymentMethods.map((method) => (
                <MenuItem key={method.id} value={method.id}>
                  {method.name}
                </MenuItem>
              ))}
            </Select>
            {paymentMethodError && <FormHelperText>{paymentMethodError}</FormHelperText>}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: "8px 16px" }}>
          <Button
            onClick={() => setOpenPaymentDialog(false)}
            variant="outlined"
            size="small"
            disabled={updatingPayment}
            sx={{
              borderColor: "#9e9e9e",
              color: "#757575",
              "&:hover": {
                borderColor: "#757575",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdatePaymentMethod}
            variant="contained"
            size="small"
            disabled={updatingPayment}
            sx={{
              backgroundColor: mainColor,
              color: "white",
              "&:hover": {
                backgroundColor: `${mainColor}dd`,
              },
            }}
          >
            {updatingPayment ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Cập nhật"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function translateStatus(status) {
  const statusMap = {
    "Pending": "Chờ xử lý",
    "Processing": "Đang xử lý",
    "Delivering": "Đang giao hàng",
    "Delivered": "Đã giao hàng",
    "Completed": "Hoàn thành",
    "Cancelled": "Đã hủy",
    "Awaiting Payment": "Chờ thanh toán"
  };
  return statusMap[status] || status;
}