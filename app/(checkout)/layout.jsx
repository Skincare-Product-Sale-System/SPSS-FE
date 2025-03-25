import { Suspense } from "react";

// Loading component
const CheckoutLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function CheckoutLayout({ children }) {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <div className="checkout-container">
        {children}
      </div>
    </Suspense>
  );
} 