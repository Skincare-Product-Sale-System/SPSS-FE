import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";

import Products from "@/components/shopDetails/Products";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import Link from "next/link";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";
import request from "@/utlis/axios";
import { formatPrice } from "@/utlis/priceFormatter";

export const metadata = {
  title: "Product Details | Skincare Store",
  description: "Discover high-quality skincare products",
};

export default async function page({ params }) {
  const { id } = await params;
  
  try {
    // Thêm log để kiểm tra ID
    console.log("Fetching product with ID:", id);
    
    let response = await request.get(`/products/${id}`);
    let { data } = response;
    const product = data.data;
    
    // Log dữ liệu nhận được
    console.log("API response successful, product name:", product.name);

    // Định dạng lại dữ liệu sản phẩm để phù hợp với components
    const formattedProduct = {
      ...product,
      title: product.name,
      price: formatPrice(product.price),
      oldPrice: product.marketPrice !== product.price ? formatPrice(product.marketPrice) : null,
      imgSrc: product.productImageUrls[0],
      images: product.productImageUrls.map(url => ({
        src: url,
        alt: product.name
      })),
      // Đảm bảo không có request hình ảnh không cần thiết
      imgHoverSrc: product.productImageUrls[1] || product.productImageUrls[0],
      colors: product.productItems?.filter(item => 
        item.configurations?.some(config => config.variationName === "Color")
      ).map(item => {
        const colorConfig = item.configurations.find(config => config.variationName === "Color");
        // Kiểm tra nếu imageUrl là "string" hoặc không hợp lệ, sử dụng ảnh mặc định
        const imageUrl = (item.imageUrl && item.imageUrl !== "string") 
          ? item.imageUrl 
          : product.productImageUrls[0];
        
        return {
          name: colorConfig?.optionName || "",
          colorClass: `bg_${colorConfig?.optionName?.toLowerCase() || ""}`,
          imgSrc: imageUrl
        };
      }) || [],
      sizes: [...new Set(product.productItems?.filter(item => 
        item.configurations?.some(config => config.variationName === "Size")
      ).map(item => {
        const sizeConfig = item.configurations.find(config => config.variationName === "Size");
        return sizeConfig?.optionName || "";
      }).filter(Boolean))] || []
    };

    return (
      <>
        <Header2 />
        <DetailsOuterZoom product={formattedProduct} />
        <ShopDetailsTab product={formattedProduct} />
        {/* Tạm thời comment Products để kiểm tra xem có phải nó gây ra lỗi không */}
        {/* <Products /> */}
        <Footer1 />
      </>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    
    // Hiển thị trang lỗi thân thiện
    return (
      <>
        <Header2 />
        <div className="container my-12 py-8 text-center">
          <h2 className="text-2xl font-medium mb-4">Unable to load product information</h2>
          <p className="mb-6">An error occurred while loading product information. Please try again later.</p>
          <p className="text-sm text-gray-600 mb-6">Error details: {error.message}</p>
          <Link href="/shop" className="tf-btn btn-primary">
            Back to shop
          </Link>
        </div>
        <Footer1 />
      </>
    );
  }
}
