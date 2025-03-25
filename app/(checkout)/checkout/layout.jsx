import { Suspense } from "react";

export const metadata = {
  title: "Thanh toán",
  description: "Trang thanh toán tại SPSS",
};

// Loading component for checkout
const CheckoutLoading = () => (
  <div className="flex justify-center items-center min-h-[70vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function CheckoutLayout({ children }) {
  return children;
} 