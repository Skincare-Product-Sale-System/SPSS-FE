import React from 'react';
import PendingIcon from '@mui/icons-material/Pending';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentsIcon from '@mui/icons-material/Payments';

export function getStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "awaiting payment":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusInfo(status, order) {
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
}

export function getStatusIcon(status) {
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
}

export function getStatusCircleColor(status) {
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
}

export function getStatusBorderColor(status) {
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
}

export function isStatusBefore(checkStatus, currentStatus) {
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

export function translateStatus(status) {
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