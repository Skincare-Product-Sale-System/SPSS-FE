import { Suspense } from "react";

const StaffLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function StaffLayout({ children }) {
  return (
    <Suspense fallback={<StaffLoading />}>
      <div className="staff-container">
        {children}
      </div>
    </Suspense>
  );
} 