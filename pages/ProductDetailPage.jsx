"use client";

import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { useThemeColors } from "@/context/ThemeContext";
import request from "@/utils/axios";
import { formatPrice } from "@/utils/priceFormatter";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ProductDetail = dynamic(
  () => import("@/components/product/detail/ProductDetail"),
  { ssr: false }
);

export default function ProductDetailPage() {
  const mainColor = useThemeColors();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        router.push("/products");
        return;
      }

      try {
        const response = await request.get(`/products/${productId}`);
        const productData = response.data.data;
        
        // Format product data
        const formattedProduct = {
          ...productData,
          title: productData.name,
          price: formatPrice(productData.price),
          oldPrice: productData.marketPrice !== productData.price ? formatPrice(productData.marketPrice) : null,
          imgSrc: productData.thumbnail,
          images: productData.thumbnail,
          imgHoverSrc: productData.thumbnail,
          colors: productData.productItems?.filter(item => 
            item.configurations?.some(config => config.variationName === "Color")
          ).map(item => {
            const colorConfig = item.configurations.find(config => config.variationName === "Color");
            const imageUrl = (item.imageUrl && item.imageUrl !== "string") 
              ? item.imageUrl 
              : productData.thumbnail;
            
            return {
              name: colorConfig?.optionName || "",
              colorClass: `bg_${colorConfig?.optionName?.toLowerCase() || ""}`,
              imgSrc: imageUrl
            };
          }) || [],
          sizes: [...new Set(productData.productItems?.filter(item => 
            item.configurations?.some(config => config.variationName === "Size")
          ).map(item => {
            const sizeConfig = item.configurations.find(config => config.variationName === "Size");
            return sizeConfig?.optionName || "";
          }).filter(Boolean))] || [],
          brand: productData.brand,
          category: productData.category,
          skinTypes: productData.skinTypes || [],
          specifications: productData.specifications || {},
          soldCount: productData.soldCount || 0,
          ratingDisplay: productData.rating ? `${productData.rating.toFixed(1)}/5` : "0/5",
          rating: productData.rating || 0,
          status: productData.status,
          description: productData.description
        };

        setProduct(formattedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router]);

  if (error) {
    return (
      <div className="container text-center my-12 py-8">
        <h2 className="text-2xl font-medium mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Không thể tải thông tin sản phẩm
        </h2>
        <p className="mb-6" style={{ fontFamily: 'Roboto, sans-serif' }}>
          Đã xảy ra lỗi khi tải thông tin sản phẩm. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="container-full lg:w-11/12 mx-auto px-4 py-6">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-60">
              <CircularProgress sx={{ color: mainColor }} />
            </div>
          }
        >
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <CircularProgress sx={{ color: mainColor }} />
            </div>
          ) : (
            <ProductDetail product={product} />
          )}
        </Suspense>
      </div>
    </>
  );
} 