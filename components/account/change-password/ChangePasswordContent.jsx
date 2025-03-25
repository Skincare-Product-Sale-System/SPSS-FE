"use client"
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import useAuthStore from "@/context/authStore";

export default function ChangePasswordContent() {
  const theme = useTheme();
  const { Id } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (!formData.newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (!formData.confirmPassword) {
      toast.error("Vui lòng xác nhận mật khẩu mới");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
    
    setLoading(true);
    try {
      await request.patch(`/users/${Id}/change-password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success("Đổi mật khẩu thành công");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border p-6 rounded-lg shadow-md" style={{ borderColor: theme.palette.divider }}>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Mật khẩu mới
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" style={{ color: theme.palette.text.secondary }}>
            Xác nhận mật khẩu mới
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{ 
              borderColor: theme.palette.divider,
              focusRing: theme.palette.primary.light
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-md text-white transition-all"
          style={{ 
            backgroundColor: theme.palette.primary.main,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
} 