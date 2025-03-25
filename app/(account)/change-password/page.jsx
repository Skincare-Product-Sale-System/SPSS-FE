"use client"
import React from "react";
import dynamic from "next/dynamic";

const ChangePasswordPage = dynamic(() => import("@/pages/ChangePasswordPage"), {
  ssr: false,
});

export default function ChangePassword() {
  return <ChangePasswordPage />;
}