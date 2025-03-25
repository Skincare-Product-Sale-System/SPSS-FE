"use client";
import { Suspense } from "react";

// Loading component for the account address page
const AddressLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AccountAddressLayout({ children }) {
  return (
    <Suspense fallback={<AddressLoading />}>
      {children}
    </Suspense>
  );
} 