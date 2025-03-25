"use client"
import React from "react";
import dynamic from "next/dynamic";

const MyAccountAddressPage = dynamic(
  () => import("@/pages/MyAccountAddressPage"),
  { ssr: false }
);

export default function Page() {
  return <MyAccountAddressPage />;
}
