"use client"
import React from "react";
import { Box, Pagination } from '@mui/material';
import { useThemeColors } from "@/context/ThemeContext";
import OrderCard from "./OrderCard";

export default function OrderList({ 
  orders, 
  currentPage, 
  totalPages, 
  onPageChange,
  onReviewClick,
  formatCurrency,
  getStatusColor
}) {
  const mainColor = useThemeColors();

  if (orders.length === 0) {
    return (
      <div className="border p-8 rounded-lg text-center py-4">
        <p className="text-gray-500">Không tìm thấy đơn hàng phù hợp với bộ lọc của bạn</p>
      </div>
    );
  }

  return (
    <>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onReviewClick={onReviewClick}
          formatCurrency={formatCurrency}
          getStatusColor={getStatusColor}
        />
      ))}
      
      {totalPages > 1 && (
        <Box className="flex justify-center mt-6">
          <Pagination 
            count={totalPages} 
            page={currentPage} 
            onChange={onPageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: mainColor,
              },
              '& .Mui-selected': {
                backgroundColor: `${mainColor}20`,
              },
              '& .MuiInputLabel-root': {
                fontFamily: '"Roboto", sans-serif'
              },
              '& .MuiInputBase-input': {
                fontFamily: '"Roboto", sans-serif'
              }
            }}
          />
        </Box>
      )}
    </>
  );
} 