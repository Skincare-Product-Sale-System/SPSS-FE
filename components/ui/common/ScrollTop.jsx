"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

export default function ScrollTop() {
  const [scrolled, setScrolled] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(500);
  const theme = useTheme();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const currentScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    setScrolled(currentScroll);
    const totalScrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    setScrollHeight(totalScrollHeight);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Add class for additional styling
  const scrollTopClass = `progress-wrap ${scrolled > 100 ? "active-progress" : ""} scroll-top-position`;

  // Add a style block to the document head for the new class
  useEffect(() => {
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .scroll-top-position {
        bottom: 180px !important; /* Increased distance from chat widget */
        right: 25px !important;
        z-index: 100 !important;
        background-color: ${theme?.palette?.primary?.main || "#25b5c1"} !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
        width: 45px !important;
        height: 45px !important;
      }
      .scroll-top-position::after {
        color: white !important;
        line-height: 45px !important;
        width: 45px !important;
        height: 45px !important;
      }
      .scroll-top-position svg.progress-circle path {
        stroke: white !important;
        stroke-width: 2 !important;
      }
      
      /* Add media query for mobile devices */
      @media (max-width: 768px) {
        .scroll-top-position {
          bottom: 210px !important;
          right: 20px !important;
        }
      }
    `;
    
    // Append to head
    document.head.appendChild(styleElement);
    
    // Cleanup
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [theme?.palette?.primary?.main]);

  return (
    <div
      className={scrollTopClass}
      onClick={scrollToTop}
    >
      <svg
        className="progress-circle svg-content"
        width="100%"
        height="100%"
        viewBox="-1 -1 102 102"
      >
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          style={{
            strokeDasharray: "307.919, 307.919",
            strokeDashoffset: 307.919 - (scrolled / scrollHeight) * 307.919,
          }}
        />
      </svg>
    </div>
  );
}
