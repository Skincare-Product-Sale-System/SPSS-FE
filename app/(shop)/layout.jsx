import { Suspense } from "react";

// Loading component
const ShopLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function ShopLayout({ children }) {
  return (
    <Suspense fallback={<ShopLoading />}>
      <div className="shop-container">
        {children}
      </div>
    </Suspense>
  );
} 