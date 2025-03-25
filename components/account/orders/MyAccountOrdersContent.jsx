"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import request from "@/utils/axios";
import dayjs from "dayjs";
import { useThemeColors } from "@/context/ThemeContext";
import useAuthStore from "@/context/authStore";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  CircularProgress,
  Pagination
} from '@mui/material';
import ProductReviewModal from "@/components/ui/shared/ProductReviewModal";
import OrderFilters from "./OrderFilters";
import OrderList from "./OrderList";

export default function MyAccountOrdersContent() {
  const { Id } = useAuthStore();
  const mainColor = useThemeColors();
  const [allOrders, setAllOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 5;
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  useEffect(() => {
    if (allOrders.length > 0) {
      applySorting();
    }
  }, [sortOrder, allOrders]);

  const fetchOrders = async () => {
    try {
      if (isFirstLoad) {
        setInitialLoading(true);
      }
      
      let url = `/orders/user?pageNumber=${currentPage}&pageSize=${pageSize}`;
      
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }
      
      const response = await request.get(url);
      
      const newOrders = response.data.data.items;
      setAllOrders(newOrders);
      setTotalPages(response.data.data.totalPages);
      setDisplayedOrders(newOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setInitialLoading(false);
      setLoading(false);
      setIsFirstLoad(false);
    }
  };

  const applySorting = () => {
    let sortedOrders = [...allOrders];
    
    sortedOrders.sort((a, b) => {
      const dateA = new Date(a.createdTime).getTime();
      const dateB = new Date(b.createdTime).getTime();
      
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    setDisplayedOrders(sortedOrders);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    const statusLower = status.toLowerCase();
    
    switch (statusLower) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "awaiting payment":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleReviewSuccess = () => {
    fetchOrders();
  };

  const handleReviewClick = (product, orderId) => {
    setSelectedProduct(product);
    setSelectedOrderId(orderId);
    setReviewModalOpen(true);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress sx={{ color: mainColor }} />
      </div>
    );
  }

  return (
    <div className="account-order my-account-content">
      <div className="relative wrap-account-order">
        <OrderFilters
          sortOrder={sortOrder}
          statusFilter={statusFilter}
          loading={false}
          onSortChange={handleSortChange}
          onStatusChange={handleStatusChange}
        />

        <OrderList
          orders={displayedOrders}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onReviewClick={handleReviewClick}
          formatCurrency={formatCurrency}
          getStatusColor={getStatusColor}
        />
      </div>
      
      {selectedProduct && (
        <ProductReviewModal
          open={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          productInfo={selectedProduct}
          orderId={selectedOrderId}
          onSubmitSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
} 