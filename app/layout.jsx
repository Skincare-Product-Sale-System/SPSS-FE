"use client";
import { useEffect, useState, useRef } from "react";
import { ThemeProvider } from '@/context/ThemeContext';
import { MuiThemeProvider } from '@/context/MuiThemeProvider';
import Providers from './providers';
import ChatAssistant from '@/components/othersPages/ChatAssistant';
import RealTimeChat from '@/components/chat/RealTimeChat';
import Context from '@/context/Context';
import NextTopLoader from 'nextjs-toploader';
import ScrollTop from "@/components/common/ScrollTop";
import { Toaster } from "react-hot-toast";

// Modal imports
import HomesModal from "@/components/modals/HomesModal";
import QuickView from "@/components/modals/QuickView";
import ProductSidebar from "@/components/modals/ProductSidebar";
import QuickAdd from "@/components/modals/QuickAdd";
import Compare from "@/components/modals/Compare";
import ShopCart from "@/components/modals/ShopCart";
import AskQuestion from "@/components/modals/AskQuestion";
import BlogSidebar from "@/components/modals/BlogSidebar";
import ColorCompare from "@/components/modals/ColorCompare";
import DeliveryReturn from "@/components/modals/DeliveryReturn";
import FindSize from "@/components/modals/FindSize";
import Login from "@/components/modals/Login";
import MobileMenu from "@/components/modals/MobileMenu";
import Register from "@/components/modals/Register";
import ResetPass from "@/components/modals/ResetPass";
import SearchModal from "@/components/modals/SearchModal";
import ToolbarBottom from "@/components/modals/ToolbarBottom";
import ToolbarShop from "@/components/modals/ToolbarShop";
import ShareModal from "@/components/modals/ShareModal";

// Import styles
import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";

import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [scrollDirection, setScrollDirection] = useState("down");
  
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
      const WOW = require("@/utlis/wow");
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

  return (
    <html lang="en">
      <body className="preload-wrapper" suppressHydrationWarning>
        <div className="preload preload-container" id="preloader">
          <div className="preload-logo">
            <div className="spinner"></div>
          </div>
        </div>
        <ThemeProvider>
          <MuiThemeProvider>
            <Providers>
              <Context>
                <NextTopLoader />
                <div id="wrapper">{children}</div>
                
                {/* Modals */}
                <HomesModal />
                <QuickView />
                {/* <QuickAdd /> */}
                <ProductSidebar />
                <Compare />
                <ShopCart />
                <AskQuestion />
                <BlogSidebar />
                <ColorCompare />
                <DeliveryReturn />
                <FindSize />
                <Login />
                <MobileMenu />
                <Register />
                <ResetPass />
                <SearchModal />
                <ToolbarBottom />
                <ToolbarShop />
                <ShareModal />
                
                {/* Chat components */}
                <ChatAssistant />
                <RealTimeChat />
              </Context>
            </Providers>
          </MuiThemeProvider>
        </ThemeProvider>
        <ScrollTop />
        <Toaster />
      </body>
    </html>
  );
} 