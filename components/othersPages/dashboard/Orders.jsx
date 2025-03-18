"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import request from "@/utlis/axios";
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
import ProductReviewModal from "../ProductReviewModal";

export default function Orders() {
  const { Id } = useAuthStore();
  const mainColor = useThemeColors();
  const [allOrders, setAllOrders] = useState([]); // Store all fetched orders
  const [displayedOrders, setDisplayedOrders] = useState([]); // Orders after filtering/sorting
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true); // Separate loading state for initial fetch
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 5;
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch orders only when component mounts or page changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  // Apply filters and sorting whenever filter/sort settings or allOrders change
  useEffect(() => {
    if (allOrders.length > 0) {
      applyFiltersAndSort();
    }
  }, [statusFilter, sortOrder, allOrders, currentPage]);

  const fetchOrders = async () => {
    try {
      setInitialLoading(true);
      const response = await request.get(`/orders/user?pageNumber=${currentPage}&pageSize=${pageSize}`);
      
      const newOrders = response.data.data.items;
      setAllOrders(newOrders);
      setTotalPages(response.data.data.totalPages);
      
      // Initial display will be done by the other useEffect
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  // Apply filters and sorting without re-fetching data
  const applyFiltersAndSort = () => {
    // Create a shallow copy to avoid mutating the original data
    let filteredOrders = [...allOrders];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filteredOrders = filteredOrders.filter(order => 
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply sorting
    filteredOrders.sort((a, b) => {
      const dateA = new Date(a.createdTime).getTime();
      const dateB = new Date(b.createdTime).getTime();
      
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    // Update displayed orders
    setDisplayedOrders(filteredOrders);
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
    switch (status?.toLowerCase()) {
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

  // Handle successful review submission
  const handleReviewSuccess = () => {
    // Only refetch the current page to update review status
    fetchOrders();
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <CircularProgress sx={{ color: mainColor }} />
      </div>
    );
  }

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order relative">
        <Box className="flex flex-col md:flex-row justify-end items-center mb-8 gap-4">
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort By Date</InputLabel>
            <Select
              value={sortOrder}
              label="Sort By Date"
              onChange={handleSortChange}
              sx={{ 
                '& .MuiSelect-select': { py: 1.8, px: 2, mt: 1 },
                '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 }
              }}
            >
              <MenuItem value="desc">Newest First</MenuItem>
              <MenuItem value="asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}  
              label="Status"
              onChange={handleStatusChange}
              sx={{ 
                '& .MuiSelect-select': { py: 1.8, px: 2, mt: 1 },
                '& .MuiOutlinedInput-notchedOutline': { borderRadius: 1 }
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Awaiting Payment">Awaiting Payment</MenuItem>
            </Select>
          </FormControl>
          
          {loading && !initialLoading && (
            <CircularProgress 
              size={24} 
              sx={{ 
                color: mainColor,
                ml: 2
              }} 
            />
          )}
        </Box>

        {displayedOrders.length === 0 ? (
          <div className="text-center py-4 border rounded-lg p-8">
            <p className="text-gray-500">No orders found matching your filters</p>
          </div>
        ) : (
          displayedOrders.map((order) => (
            <div key={order.id} className="mb-6 border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 p-4 flex justify-between items-center border-b">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Order #{order.id.substring(0, 8)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <span className="text-gray-500">{dayjs(order.createdTime).format("MMM DD, YYYY")}</span>
              </div>
              
              <div className="p-4">
                {order.orderDetails.map((item, index) => (
                  <div key={index} className="flex items-center py-3 border-b last:border-b-0">
                    <Link 
                      href={`/product-detail/${item.productId}`}
                      className="flex flex-1 items-center hover:bg-gray-50 p-2 rounded-lg transition-all"
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="w-16 h-16 mr-4">
                        {item.productImage && (
                          <img 
                            src={item.productImage} 
                            alt={item.productName} 
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.productName}</h4>
                        {item.variationOptionValues && item.variationOptionValues.length > 0 && (
                          <p className="text-sm text-gray-500">
                            {item.variationOptionValues.join(', ')}
                          </p>
                        )}
                        <p className="text-sm">x{item.quantity}</p>
                      </div>
                    </Link>
                    <div className="text-right flex flex-row items-end gap-2">
                      <p className="font-medium">{formatCurrency(item.price)}</p>
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
                            setSelectedOrderId(order.id);
                            setReviewModalOpen(true);
                          }
                        }}
                      >
                        {order.status?.toLowerCase() === "delivered" && !item.isReviewable
                          ? "Reviewed"
                          : "Review"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Tổng số tiền ({order.orderDetails.length} sản phẩm):</span>
                  <span className="font-bold text-lg">{formatCurrency(order.orderTotal)}</span>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/my-account-orders-details?id=${order.id}`}
                    className="px-4 py-2 bg-white border rounded-md hover:opacity-80 transition-colors"
                    style={{ 
                      color: mainColor, 
                      borderColor: mainColor,
                      backgroundColor: `${mainColor}10`
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
        
        {totalPages > 1 && (
          <Box className="flex justify-center mt-6">
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={handlePageChange}
              color="primary"
              sx={{
                '& .MuiPaginationItem-root': {
                  color: mainColor,
                },
                '& .Mui-selected': {
                  backgroundColor: `${mainColor}20`,
                },
              }}
            />
          </Box>
        )}
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
