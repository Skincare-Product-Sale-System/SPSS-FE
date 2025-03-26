"use client";
import { Suspense } from 'react';
import StaffPage from '@/pages/StaffPage';

// Thêm cấu hình để tránh lỗi client reference manifest
export const dynamic = 'force-static';
export const dynamicParams = false;

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    }>
      <StaffPage />
    </Suspense>
  );
} 