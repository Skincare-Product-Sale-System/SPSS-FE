"use client"
import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, Suspense } from 'react';

export const RouterContext = createContext({
  isNavigating: false
});

// Loading component
const RouterProviderLoading = () => null;

// Inner component that uses useSearchParams
function RouterEventsProviderInner({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // Khi path hoặc params thay đổi, theo dõi trạng thái navigation
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Đặt isNavigating = true khi người dùng click vào link
  useEffect(() => {
    const handleLinkClick = () => {
      setIsNavigating(true);
    };

    // Thêm event listener cho tất cả các link
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    return () => {
      document.querySelectorAll('a[href^="/"]').forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, [pathname]); // Re-add listeners when path changes

  return (
    <RouterContext.Provider value={{ isNavigating }}>
      {children}
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
          <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }}></div>
        </div>
      )}
    </RouterContext.Provider>
  );
}

// Exported component wrapped in Suspense
export function RouterEventsProvider({ children }) {
  return (
    <Suspense fallback={<RouterProviderLoading />}>
      <RouterEventsProviderInner children={children} />
    </Suspense>
  );
} 