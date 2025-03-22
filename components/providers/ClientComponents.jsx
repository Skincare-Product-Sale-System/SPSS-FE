"use client";
import { Suspense } from 'react';

const DefaultLoading = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export function ClientComponent({ children, LoadingComponent = DefaultLoading }) {
  return (
    <Suspense fallback={<LoadingComponent />}>
      {children}
    </Suspense>
  );
}

// Specific component for wrapping useSearchParams consumers
export function SearchParamsComponent({ children, LoadingComponent = DefaultLoading }) {
  return (
    <Suspense fallback={<LoadingComponent />}>
      {children}
    </Suspense>
  );
} 