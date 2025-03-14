import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";

import Products from "@/components/shopDetails/Products";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import Link from "next/link";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";
import request from "@/utlis/axios";

export const metadata = {
  title: "Chi tiết sản phẩm | Skincare Store",
  description: "Khám phá các sản phẩm chăm sóc da chất lượng cao",
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
      price: product.price,
      oldPrice: product.marketPrice !== product.price ? product.marketPrice : null,
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
          <h2 className="text-2xl font-medium mb-4">Không thể tải thông tin sản phẩm</h2>
          <p className="mb-6">Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau.</p>
          <p className="text-sm text-gray-600 mb-6">Chi tiết lỗi: {error.message}</p>
          <Link href="/shop" className="tf-btn btn-primary">
            Quay lại cửa hàng
          </Link>
        </div>
        <Footer1 />
      </>
    );
  }
}
