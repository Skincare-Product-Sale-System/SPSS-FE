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

export default function Orders() {
  const { Id } = useAuthStore();
  const mainColor = useThemeColors();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 5;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]); // Removed sortOrder dependency

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Removed sortBy and sortOrder parameters
      const response = await request.get(`/orders/user?pageNumber=${currentPage}&pageSize=${pageSize}`);
      
      let filteredOrders = response.data.data.items;
      
      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        // Recalculate total pages based on filtered results
        const filteredTotalPages = Math.ceil(filteredOrders.length / pageSize);
        setTotalPages(filteredTotalPages > 0 ? filteredTotalPages : 1);
      } else {
        setTotalPages(response.data.data.totalPages);
      }
      
      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
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
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "awaiting payment":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // const handleSortChange = (e) => {
  //   setSortOrder(e.target.value);
  //   setCurrentPage(1); // Reset to first page when sort order changes
  // };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <CircularProgress sx={{ color: mainColor }} />
      </div>
    );
  }

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        <Box className="flex flex-col md:flex-row justify-end items-center mb-8 gap-6">
          {/* Commented out the sort dropdown
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              label="Sort By"
              onChange={handleSortChange}
              sx={{ '& .MuiSelect-select': { py: 1.5 } }}
            >
              <MenuItem value="desc">Newest First</MenuItem>
              <MenuItem value="asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
          */}
          
          <FormControl size="small" sx={{ minWidth: 220, marginRight: 2 }}>
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
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Awaiting Payment">Awaiting Payment</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <table className="w-full">
          <thead>
            <tr>
              <th className="fw-6">Order</th>
              <th className="fw-6">Date</th>
              <th className="fw-6">Status</th>
              <th className="fw-6">Total</th>
              <th className="fw-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="tf-order-item">
                  <td>#{order.id.substring(0, 8)}</td>
                  <td>{dayjs(order.createdTime).format("MMM DD, YYYY")}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {formatCurrency(order.orderTotal)} for {order.orderDetails.length} items
                  </td>
                  <td className="flex gap-2">
                    {order.status === "Awaiting Payment" && (
                      <button
                        onClick={async () => {
                          try {
                            const vnpayRes = await request.get(
                              `/VNPAY/get-transaction-status-vnpay?orderId=${order.id}&userId=${Id}&urlReturn=http%3A%2F%2Flocalhost%3A3000%2Fmy-orders`
                            );
                            if (vnpayRes.status === 200) {
                              location.href = vnpayRes.data.data;
                            }
                          } catch (error) {
                            console.error("Payment error:", error);
                          }
                        }}
                        className="tf-btn btn-outline animate-hover-btn rounded-0 justify-content-center"
                      >
                        <span>Pay Now</span>
                      </button>
                    )}
                    <Link
                      href={`/my-account-orders-details?id=${order.id}`}
                      className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
                    >
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
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
    </div>
  );
}
