import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import ProductReviews from "@/components/shopDetails/ProductReviews";
import React from "react";
import Link from "next/link";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";
import request from "@/utlis/axios";
import { formatPrice } from "@/utlis/priceFormatter";
import { Box, Chip, Typography, Grid, Paper, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
      imgHoverSrc: product.productImageUrls[1] || product.productImageUrls[0],
      colors: product.productItems?.filter(item => 
        item.configurations?.some(config => config.variationName === "Color")
      ).map(item => {
        const colorConfig = item.configurations.find(config => config.variationName === "Color");
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
      }).filter(Boolean))] || [],
      // Add additional formatted data
      brand: product.brand,
      category: product.category,
      skinTypes: product.skinTypes || [],
      specifications: product.specifications || {},
      soldCount: product.soldCount,
      rating: product.rating,
      status: product.status,
      description: product.description
    };

    return (
      <>
        <Header2 />
        <div className="pt-6 md:pt-8">
          <DetailsOuterZoom product={formattedProduct} />
          <ShopDetailsTab product={formattedProduct} />
          <ProductReviews productId={product.id} />
        </div>
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
