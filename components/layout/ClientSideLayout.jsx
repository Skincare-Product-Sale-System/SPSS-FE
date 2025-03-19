'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";

export default function ClientSideLayout({ children }) {
  const pathname = usePathname();
  
  // Reset scroll position on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header2 />
      <div className="min-h-screen">{children}</div>
      <Footer1 />
    </>
  );
} 