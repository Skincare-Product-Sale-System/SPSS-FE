"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStorage } from '@/hooks/useStorage';

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [orderData, setOrderData] = useStorage('orderDetails', null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // ... rest of the component logic
} 