"use client";
import { useEffect, useState, useRef, Suspense, lazy } from "react";
import { ThemeProvider } from '@/context/ThemeContext';
import { MuiThemeProvider } from '@/context/MuiThemeProvider';
import Providers from './providers';
import Context from '@/context/Context';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "react-hot-toast";
import { ClientProvider } from '@/providers/ClientProvider';
import { usePathname, useRouter } from "next/navigation";
import { Roboto } from 'next/font/google';
import '@/styles/globals.css';
import { RouterEventsProvider } from './RouterEventsProvider';
import Loading from './loading';
import Head from 'next/head';

// Import styles
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";

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
  { name: "Orders", href: "/orders" },
  { name: "Addresses", href: "/address" },
  { name: "Reviews", href: "reviews" },
  { name: "Wishlist", href: "/my-account-wishlist" },
  { name: "Logout", href: "/logout" },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrollDirection, setScrollDirection] = useState("down");
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);

  // Check if the current user is a staff member
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const userRole = localStorage.getItem("userRole");
        setIsStaff(userRole === 'Staff');
      } catch (error) {
        console.error("Error reading role from localStorage:", error);
      }
    }
  }, []);

  // Handle scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle path changes
  useEffect(() => {
    setCurrentPath(pathname);
    setLoading(true);
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

  return (
    <html lang="en" className={`${roboto.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo/logo-icon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/logo/logo-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4ECDC4" />
        <style jsx global>{`
          :root {
            --font-primary: ${roboto.style.fontFamily};
            --font-heading: ${roboto.style.fontFamily};
          }
          
          /* Ensure chat components are always visible with highest z-index */
          button[aria-label="Chat with assistant"],
          button[aria-label="Chat with support"] {
            z-index: 9999 !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          
          /* Position chat buttons above the navigation bar */
          button[aria-label="Chat with assistant"] {
            bottom: 90px !important;
            right: 10px !important;
            transform: scale(0.85);
          }
          
          button[aria-label="Chat with support"] {
            bottom: 90px !important;
            right: 70px !important;
            transform: scale(0.85);
          }
          
          /* Chat windows should also have highest z-index */
          .fixed .z-\\[999\\] {
            z-index: 9999 !important;
            right: 10px !important;
            bottom: 150px !important;
          }
          
          /* Media query for mobile */
          @media (max-width: 768px) {
            button[aria-label="Chat with assistant"],
            button[aria-label="Chat with support"] {
              bottom: 70px !important;
            }
            
            button[aria-label="Chat with assistant"] {
              right: 5px !important;
            }
            
            button[aria-label="Chat with support"] {
              right: 60px !important;
            }
            
            .fixed .z-\\[999\\] {
              bottom: 130px !important;
            }
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
                      <Suspense fallback={<Loading />}>
                        {isStaff ? <StaffHeaderWrapper /> : <Header />}
                      </Suspense>

                      {/* Mobile Menu - lazy loaded */}
                      <Suspense fallback={null}>
                        <MobileMenu />
                      </Suspense>

                      {/* Main content - only this will be rerendered on route change */}
                      <main key={pathname} className="flex-grow">
                        <Suspense fallback={<Loading />}>
                          {children}
                        </Suspense>
                      </main>

                      {/* Footer - lazy loaded */}
                      <Suspense fallback={<Loading />}>
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
                      <ChatAssistant />
                      <RealTimeChat />
                      <ScrollTop />
                    </Suspense>

                    <Toaster position="top-right" />
                  </ClientProvider>
                </Context>
              </Providers>
            </ThemeProvider>
          </RouterEventsProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}