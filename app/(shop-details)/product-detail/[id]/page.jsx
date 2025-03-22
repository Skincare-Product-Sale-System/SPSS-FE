import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import ProductReviews from "@/components/shopDetails/ProductReviews";
import React from "react";
import Link from "next/link";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import request from "@/utils/axios";
import { formatPrice } from "@/utils/priceFormatter";

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
      imgSrc: product.thumbnail,
      images: product.thumbnail,
      imgHoverSrc: product.thumbnail,
      colors: product.productItems?.filter(item => 
        item.configurations?.some(config => config.variationName === "Color")
      ).map(item => {
        const colorConfig = item.configurations.find(config => config.variationName === "Color");
        const imageUrl = (item.imageUrl && item.imageUrl !== "string") 
          ? item.imageUrl 
          : product.thumbnail;
        
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
      soldCount: product.soldCount || 0,
      ratingDisplay: product.rating ? `${product.rating.toFixed(1)}/5` : "0/5",
      rating: product.rating || 0,
      status: product.status,
      description: product.description
    };

    return (
      <>
        <div className="md:pt-8 pt-6">
          <DetailsOuterZoom product={formattedProduct} />
          <ShopDetailsTab product={formattedProduct} />
          <ProductReviews productId={product.id} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    
    // Hiển thị trang lỗi thân thiện
    return (
      <>
        <div className="container text-center my-12 py-8">
          <h2 className="text-2xl font-medium mb-4">Unable to load product information</h2>
          <p className="mb-6">An error occurred while loading product information. Please try again later.</p>
          <p className="text-gray-600 text-sm mb-6">Error details: {error.message}</p>
          <Link href="/shop" className="btn-primary tf-btn">
            Back to shop
          </Link>
        </div>
      </>
    );
  }
}
