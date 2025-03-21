"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { ThemeProvider } from '@/context/ThemeContext';
import { MuiThemeProvider } from '@/context/MuiThemeProvider';
import Providers from './providers';
import ChatAssistant from '@/components/othersPages/ChatAssistant';
import RealTimeChat from '@/components/chat/RealTimeChat';
import Context from '@/context/Context';
import NextTopLoader from 'nextjs-toploader';
import ScrollTop from "@/components/common/ScrollTop";
import { Toaster } from "react-hot-toast";
import { ClientProvider } from '@/providers/ClientProvider';
import Compare from "@/components/modals/Compare";
import ShopCart from "@/components/modals/ShopCart";
// Modal imports
import QuickView from "@/components/modals/QuickView";
import MobileMenu from "@/components/modals/MobileMenu";
import LoginModal from "@/components/modals/Login";
import ShoppingCartModal from "@/components/modals/ShopCart";
// Import styles
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";

import { usePathname } from "next/navigation";
import { Inter } from 'next/font/google';
import Header2 from "@/components/headers/Header2";
import Footer1 from "@/components/footers/Footer1";
import '@/styles/globals.css';
import { RouterEventsProvider } from './RouterEventsProvider';
import StaffHeaderWrapper from '@/components/StaffHeaderWrapper';

// Các providers và fonts
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [scrollDirection, setScrollDirection] = useState("down");
  const [loading, setLoading] = useState(true);
  
  // Check if the current user is a staff member (client-side only)
  const [isStaff, setIsStaff] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Bootstrap initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm").then(() => {
        // Bootstrap initialized
      });
    }
  }, []);
  
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
      </>
    );
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <MuiThemeProvider>
          <RouterEventsProvider>
            <ThemeProvider>
              <Providers>
                <Context>
                  <ClientProvider>
                    <NextTopLoader />
                    <div id="wrapper">
                      {/* Header cố định - load immediately */}
                      <StaffHeaderWrapper />
                      
                      {/* Mobile Menu */}
                      <MobileMenu />
                      
                      {/* Phần nội dung thay đổi */}
                      <main>
                        {loading ? (
                          <div className="flex justify-center items-center min-h-screen">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                          </div>
                        ) : (
                          children
                        )}
                      </main>
                      
                      {/* Footer cố định */}
                      <Footer1 />
                    </div>
                    {/* Modals and deferred components */}
                    <Suspense fallback={null}>
                      <Compare />
                      <QuickView />
                      <ShopCart />
                      <LoginModal />
                      <ShoppingCartModal />
                    </Suspense>
                    {/* Chat components - chỉ hiển thị khi không phải staff */}
                    <Suspense fallback={null}>
                      <ChatComponents />
                      <ScrollTop />
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