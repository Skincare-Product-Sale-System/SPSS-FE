'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientSideLayout({ children }) {
  const pathname = usePathname();
  
  // Reset scroll position on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <div>{children}</div>
    </>
  );
} 