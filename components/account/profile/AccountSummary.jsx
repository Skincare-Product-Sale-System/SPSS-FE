"use client"
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import request from "@/utils/axios";
import toast from "react-hot-toast";

export default function AccountSummary({ userData }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalReviews: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersResponse, reviewsResponse] = await Promise.all([
        request.get('/orders/total-orders'),
        request.get('/reviews/user/total-reviews')
      ]);

      setStats({
        totalOrders: ordersResponse.data.data,
        totalReviews: reviewsResponse.data.data
      });
      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải thống kê tài khoản");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        Tóm tắt tài khoản
      </h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border p-4 rounded-lg text-center">
          <p className="text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Đơn hàng đã đặt
          </p>
          <p className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {stats.totalOrders}
          </p>
        </div>
        
        <div className="border p-4 rounded-lg text-center">
          <p className="text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Đánh giá đã viết
          </p>
          <p className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {stats.totalReviews}
          </p>
        </div>
        
        <div className="border p-4 rounded-lg text-center">
          <p className="text-gray-500 mb-1" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Loại da
          </p>
          <p className="text-xl font-semibold" style={{ fontFamily: 'Roboto, sans-serif' }}>
            {userData?.skinType || "Chưa xác định"}
          </p>
        </div>
      </div>
    </div>
  );
} 