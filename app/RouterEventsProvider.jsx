"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const RouterEventsContext = createContext({
  isPageLoading: false,
  routeChanging: false,
  pathname: null,
  previousPath: null,
  isModalOpen: false,
});

export function RouterEventsProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [routeChanging, setRouteChanging] = useState(false);
  const [previousPath, setPreviousPath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Track actual route changes only (not modal opens)
  useEffect(() => {
    if (pathname) {
      let timer;
      setRouteChanging(true);
      setIsPageLoading(true);
      
      // Store previous path
      if (previousPath !== pathname) {
        setPreviousPath(previousPath);
      }
      
      timer = setTimeout(() => {
        setIsPageLoading(false);
        setRouteChanging(false);
        
        // Set focus for accessibility
        if (document.body) {
          document.body.focus();
          
          // Only scroll to top if we're not opening a modal
          // Check for open modals
          const hasOpenModal = document.querySelector('.modal.show') !== null;
          if (!hasOpenModal) {
            window.scrollTo(0, 0);
          }
        }
      }, 200);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname]);

  // Handle link clicks for SPA navigation
  useEffect(() => {
    const handleLinkClick = (e) => {
      const link = e.target.closest('a');
      // Skip modal trigger links
      if (link && link.getAttribute('data-bs-toggle') === 'modal') {
        return;
      }
      
      if (link && link.href && link.href.startsWith(window.location.origin) && !link.target && !link.download) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href !== pathname) {
          router.push(href);
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, [router, pathname]);

  // Detect modal opens to prevent scroll resets
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleModalOpen = () => {
        setIsModalOpen(true);
      };
      
      const handleModalClose = () => {
        setIsModalOpen(false);
      };
      
      document.addEventListener('shown.bs.modal', handleModalOpen);
      document.addEventListener('hidden.bs.modal', handleModalClose);
      
      return () => {
        document.removeEventListener('shown.bs.modal', handleModalOpen);
        document.removeEventListener('hidden.bs.modal', handleModalClose);
      };
    }
  }, []);

  return (
    <RouterEventsContext.Provider value={{ 
      isPageLoading, 
      routeChanging, 
      pathname, 
      previousPath,
      isModalOpen
    }}>
      {children}
    </RouterEventsContext.Provider>
  );
}

export function useRouterEvents() {
  return useContext(RouterEventsContext);
}