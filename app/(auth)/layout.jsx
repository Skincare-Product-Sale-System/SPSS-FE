import { Suspense } from "react";

// Loading component
const AuthLoading = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function AuthLayout({ children }) {
  return (
    <Suspense fallback={<AuthLoading />}>
      <div className="auth-container">
        {children}
      </div>
    </Suspense>
  );
} 