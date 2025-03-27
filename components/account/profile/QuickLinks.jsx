"use client"
import React from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function QuickLinks() {
  const theme = useTheme();

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
        Quản lý tài khoản
      </h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <Link href="/orders" className="flex items-center p-3 border rounded-lg gap-3 hover:border-primary transition-colors">
          <ShoppingBagOutlinedIcon sx={{ color: theme.palette.primary.main }} />
          <span style={{ fontFamily: 'Roboto, sans-serif' }}>Đơn hàng của tôi</span>
        </Link>
        
        <Link href="/address" className="flex items-center p-3 border rounded-lg gap-3 hover:border-primary transition-colors">
          <HomeOutlinedIcon sx={{ color: theme.palette.primary.main }} />
          <span style={{ fontFamily: 'Roboto, sans-serif' }}>Địa chỉ của tôi</span>
        </Link>
        
        <Link href="/my-reviews" className="flex items-center p-3 border rounded-lg gap-3 hover:border-primary transition-colors">
          <StarOutlinedIcon sx={{ color: theme.palette.primary.main }} />
          <span style={{ fontFamily: 'Roboto, sans-serif' }}>Đánh giá của tôi</span>
        </Link>
        
        <Link href="/change-password" className="flex items-center p-3 border rounded-lg gap-3 hover:border-primary transition-colors">
          <LockOutlinedIcon sx={{ color: theme.palette.primary.main }} />
          <span style={{ fontFamily: 'Roboto, sans-serif' }}>Đổi mật khẩu</span>
        </Link>
      </div>
    </div>
  );
} 