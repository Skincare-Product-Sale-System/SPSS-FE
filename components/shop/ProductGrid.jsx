import React from "react";
import { ProductCard } from "../shopCards/ProductCard";
import { useThemeColors } from "@/context/ThemeContext";

export default function ProductGrid({
  gridItems = 6,
  allproducts = products1,
}) {
  const mainColor = useThemeColors();

  return (
    <>
      <div
        style={{
          width: "fit-content",
          margin: "0 auto",
          fontSize: "17px",
          marginBottom: "24px",
          color: mainColor.text,
          fontWeight: 500
        }}
      >
        {allproducts.length} sản phẩm được tìm thấy
      </div>

      {gridItems == 1 ? (
        <div 
          className="grid-layout" 
          data-grid="grid-list"
          style={{
            transition: "all 0.3s ease-in-out"
          }}
        >
          {allproducts.map((elm, i) => (
            <div 
              key={elm?.id}
              style={{
                transition: "all 0.3s ease",
                transform: "translateY(0)",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                }
              }}
            >
            </div>
          ))}
        </div>
      ) : (
        <div
          className="grid-layout wrapper-shop gap-2"
          data-grid={`grid-${gridItems}`}
          style={{
            transition: "all 0.3s ease-in-out"
          }}
        >
          {allproducts.map((elm, i) => (
            <ProductCard product={elm} key={elm?.id}/>
          ))}
        </div>
      )}
    </>
  );
}
