import { Suspense } from "react";

// Loading component for change password page
const PasswordLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function ChangePasswordLayout({ children }) {
  return (
    <Suspense fallback={<PasswordLoading />}>
      {children}
    </Suspense>
  );
} 