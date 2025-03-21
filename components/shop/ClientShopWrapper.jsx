"use client";
import ShopSidebarleft from './ShopSidebarleft';
import { Suspense } from 'react';

const ShopLoading = () => (
  <div className="container py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-lg bg-gray-100 p-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-md mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function ClientShopWrapper() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopSidebarleft />
    </Suspense>
  );
} 