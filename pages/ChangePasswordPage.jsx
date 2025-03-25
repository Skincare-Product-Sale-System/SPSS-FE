"use client"
import React from "react";
import { useTheme } from "@mui/material/styles";
import dynamic from "next/dynamic";

const ChangePasswordContent = dynamic(() => import("@/components/account/change-password/ChangePasswordContent"), {
  ssr: false,
});

export default function ChangePasswordPage() {
  const theme = useTheme();

  return (
    <section className="flat-spacing-2">
      <div className="container">
        <div>
          <h2 
            className="text-2xl font-semibold mb-6" 
            style={{ 
              color: theme.palette.text.primary,
              fontFamily: '"Playfair Display", serif'
            }}
          >
            Đổi mật khẩu
          </h2>
          <ChangePasswordContent />
        </div>
      </div>
    </section>
  );
} 