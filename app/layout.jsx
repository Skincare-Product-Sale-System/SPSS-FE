"use client";
import { useEffect, useState, useRef, Suspense, lazy } from "react";
import { ThemeProvider } from '@/context/ThemeContext';
import { MuiThemeProvider } from '@/context/MuiThemeProvider';
import Providers from './providers';
import Context from '@/context/Context';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "react-hot-toast";
import { ClientProvider } from '@/providers/ClientProvider';
// Import styles
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";

import { usePathname, useRouter } from "next/navigation";
import { Roboto } from 'next/font/google';
import '@/styles/globals.css';
import { RouterEventsProvider } from './RouterEventsProvider';

// Fonts configuration
const roboto = Roboto({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

// Lazy load components
const Header = lazy(() => import('@/components/ui/headers/Header'));
const Footer = lazy(() => import('@/components/ui/footers/Footer'));
const StaffHeaderWrapper = lazy(() => import('@/components/staff/StaffHeaderWrapper'));
const MobileMenu = lazy(() => import('@/components/ui/modals/MobileMenu'));
const Compare = lazy(() => import('@/components/ui/modals/Compare'));
const QuickView = lazy(() => import('@/components/ui/modals/QuickView'));
const ShopCart = lazy(() => import('@/components/ui/modals/ShopCart'));
const LoginModal = lazy(() => import('@/components/ui/modals/Login'));
const RegisterModal = lazy(() => import('@/components/ui/modals/Register'));
const ChatAssistant = lazy(() => import('@/components/chat/ChatAssistant'));
const RealTimeChat = lazy(() => import('@/components/chat/RealTimeChat'));
const ScrollTop = lazy(() => import('@/components/ui/common/ScrollTop'));

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const accountNavigation = [
  { name: "Profile", href: "/my-account" },
  { name: "Orders", href: "/my-account-orders" },
  { name: "Addresses", href: "/my-account-address" },
  { name: "Reviews", href: "/my-account-reviews" },
  { name: "Wishlist", href: "/my-account-wishlist" },
  { name: "Logout", href: "/logout" },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrollDirection, setScrollDirection] = useState("down");
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  
  // Check if the current user is a staff member (client-side only)
  const [isStaff, setIsStaff] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Bootstrap initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Bootstrap initialized
        
        // Prevent scrolling when modals are opened - Enhanced with better handling for both modals and offcanvas
        const preventScrollReset = (event) => {
          // Store current scroll position when opening a modal or offcanvas
          const scrollY = window.scrollY;
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollY}px`;
          document.body.style.width = '100%';
          
          // Function to restore scroll position after modal is fully shown
          const restoreScroll = () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
            event.target.removeEventListener('shown.bs.modal', restoreScroll);
            event.target.removeEventListener('shown.bs.offcanvas', restoreScroll);
          };
          
          // Add appropriate event listeners based on element type
          if (event.target.classList.contains('modal')) {
            event.target.addEventListener('shown.bs.modal', restoreScroll);
          } else if (event.target.classList.contains('offcanvas')) {
            event.target.addEventListener('shown.bs.offcanvas', restoreScroll);
          }
        };
        
        // Add event listeners for both modal and offcanvas
        document.addEventListener('show.bs.modal', preventScrollReset);
        document.addEventListener('show.bs.offcanvas', preventScrollReset);
        
        // Cleanup function
        return () => {
          document.removeEventListener('show.bs.modal', preventScrollReset);
          document.removeEventListener('show.bs.offcanvas', preventScrollReset);
        };
      });
    }
  }, []);
  
  // Track current path for SPA navigation
  useEffect(() => {
    if (currentPath !== pathname && pathname) {
      setCurrentPath(pathname);
      
      // Only scroll to top when coming from a different page, not when opening modals
      const hasOpenModal = document.querySelector('.modal.show, .offcanvas.show') !== null;
      if (!hasOpenModal) {
        // Check if this is an actual navigation, not a modal open
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, currentPath]);
  
  // Header background effect
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (header) {
        if (window.scrollY > 100) {
          header.classList.add("header-bg");
        } else {
          header.classList.remove("header-bg");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll direction detection
  useEffect(() => {
    setScrollDirection("up");
    const lastScrollY = { current: window.scrollY };
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down
          setScrollDirection("down");
        } else {
          // Scrolling up
          setScrollDirection("up");
        }
      } else {
        // Below 250px
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);
  
  // Close modals on navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const bootstrap = require("bootstrap");
        
        const modalElements = document.querySelectorAll(".modal.show");
        modalElements.forEach((modal) => {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
        });

        const offcanvasElements = document.querySelectorAll(".offcanvas.show");
        offcanvasElements.forEach((offcanvas) => {
          const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
          if (offcanvasInstance) {
            offcanvasInstance.hide();
          }
        });
      } catch (error) {
        console.error("Error closing modals/offcanvas:", error);
      }
    }
  }, [pathname]);
  
  // Header scroll behavior
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      if (scrollDirection === "up") {
        header.style.top = "0px";
      } else {
        header.style.top = "-185px";
      }
    }
  }, [scrollDirection]);
  
  // Initialize WOW.js
  useEffect(() => {
    try {
      const WOW = require("@/utils/wow");
      const wow = new WOW.default({
        mobile: false,
        live: false,
      });
      wow.init();
    } catch (error) {
      console.error("Error initializing WOW:", error);
    }
  }, [pathname]);
  
  // RTL direction setup
  useEffect(() => {
    const initializeDirection = () => {
      const direction = localStorage.getItem("direction");

      if (direction) {
        try {
          const parsedDirection = JSON.parse(direction);
          document.documentElement.dir = parsedDirection.dir;
          document.body.classList.add(parsedDirection.dir);
        } catch (error) {
          console.error("Error parsing direction:", error);
          document.documentElement.dir = "ltr";
        }
      } else {
        document.documentElement.dir = "ltr";
      }

      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("disabled");
      }
    };

    initializeDirection();
  }, []);

  useEffect(() => {
    // Đánh dấu đã tải xong khi component được mount
    setLoading(false);
  }, []);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful');
          },
          (error) => {
            console.log('ServiceWorker registration failed:', error);
          }
        );
      });
    }
  }, []);

  // Kiểm tra role và cập nhật state
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const userRole = localStorage.getItem('userRole');
        console.log("Layout - User role from localStorage:", userRole);
        setIsStaff(userRole === 'Staff');
      } catch (error) {
        console.error("Error reading role from localStorage:", error);
      }
    }
  }, []);

  // Tạo component ChatComponents để có thể điều kiện render
  const ChatComponents = () => {
    if (!mounted) return null;
    if (isStaff) return null;
    
    return (
      <>
        <ChatAssistant />
        <RealTimeChat />
        <ScrollTop />
      </>
    );
  };

  return (
    <html lang="en" className={`${roboto.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style jsx global>{`
          :root {
            --font-primary: ${roboto.style.fontFamily};
          }
        `}</style>
      </head>
      <body className={roboto.className}>
        <MuiThemeProvider>
          <RouterEventsProvider>
            <ThemeProvider>
              <Providers>
                <Context>
                  <ClientProvider>
                    <NextTopLoader
                      color="#4ECDC4"
                      initialPosition={0.08}
                      crawlSpeed={200}
                      height={3}
                      crawl={true}
                      showSpinner={false}
                      easing="ease"
                      speed={200}
                      shadow="0 0 10px #4ECDC4,0 0 5px #4ECDC4"
                    />
                    <div id="wrapper">
                      {/* Header - lazy loaded */}
                      <Suspense fallback={
                        <div className="h-24 bg-white shadow-sm">
                          <div className="flex justify-center items-center h-full">
                            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      }>
                        {isStaff ? <StaffHeaderWrapper /> : <Header />}
                      </Suspense>
                      
                      {/* Mobile Menu - lazy loaded */}
                      <Suspense fallback={null}>
                        <MobileMenu />
                      </Suspense>
                      
                      {/* Main content - only this will be rerendered on route change */}
                      <main key={pathname} className="flex-grow">
                        <Suspense fallback={
                          <div className="flex justify-center items-center min-h-screen">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        }>
                          {children}
                        </Suspense>
                      </main>
                      
                      {/* Footer - lazy loaded */}
                      <Suspense fallback={
                        <div className="h-32 bg-gray-100">
                          <div className="flex justify-center items-center h-full">
                            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      }>
                        <Footer />
                      </Suspense>
                    </div>
                    
                    {/* Modals and deferred components - lazy loaded */}
                    <Suspense fallback={null}>
                      <Compare />
                      <QuickView />
                      <ShopCart />
                      <LoginModal />
                      <RegisterModal />
                    </Suspense>
                    
                    {/* Chat components - chỉ hiển thị khi không phải staff */}
                    <Suspense fallback={null}>
                      {mounted && <ChatComponents />}
                    </Suspense>
                  </ClientProvider>
                </Context>
              </Providers>
            </ThemeProvider>
          </RouterEventsProvider>
        </MuiThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}