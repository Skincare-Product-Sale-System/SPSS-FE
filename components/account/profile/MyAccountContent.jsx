"use client"
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import ProfileSection from "./ProfileSection";
import QuickLinks from "./QuickLinks";
import AccountSummary from "./AccountSummary";

export default function MyAccountContent() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await request.get(`/accounts`);
      setUserData(data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Không thể tải thông tin tài khoản");
      setLoading(false);
    }
  };

  const handleUpdateUserData = async (formData) => {
    try {
      await request.patch(`/accounts`, formData);
      setUserData({
        ...userData,
        ...formData
      });
    } catch (error) {
      throw error;
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
    <div className="bg-white border p-3 rounded-lg shadow-sm account-dashboard my-account-content sm:p-6" 
         style={{ borderColor: theme.palette.divider }}>
      <ProfileSection userData={userData} onUpdateUserData={handleUpdateUserData} />
      <QuickLinks />
      <AccountSummary userData={userData} />
    </div>
  );
} 