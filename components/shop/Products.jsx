"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "@/components/ui/shared/cards/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import request from "@/utils/axios";
import { useContextElement } from "@/context/Context";
import { useTheme } from "@mui/material/styles";

export default function Products() {
  const theme = useTheme();
  const contextData = useContextElement() || {};
  const {
    setQuickViewItem,
    addToCompareItem,
    isAddedtoCompareItem,
  } = contextData;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await request.get("/products?pageNumber=1&pageSize=20");
        setProducts(data.data?.items || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleOpen = (product) => {
    if (setQuickViewItem) {
      setQuickViewItem({
        id: product.id,
        productId: product.id
      });
    }
  };
  
  const handleAddToCompare = (id) => {
    if (addToCompareItem) {
      addToCompareItem(id);
    }
  };
  
  const handleIsAddedToCompare = (id) => {
    return isAddedtoCompareItem ? isAddedtoCompareItem(id) : false;
  };

  return (
    <>
      <div className="container">
        <div className="flat-title">
          <span className="title" style={{ fontFamily: 'Playfair Display, serif' }}>Sản Phẩm Khác Mua Cùng</span>
        </div>
        <div className="hover-sw-2 hover-sw-nav">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell wrap-sw-over"
            slidesPerView={4}
            spaceBetween={30}
            breakpoints={{
              1024: {
                slidesPerView: 4,
              },
              640: {
                slidesPerView: 3,
              },
              0: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
            }}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp3070",
              nextEl: ".snbn3070",
            }}
            pagination={{ clickable: true, el: ".spd307" }}
          >
            {!loading && products.slice(0, 8).map((product, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCard 
                  product={product}
                  handleOpen={handleOpen}
                  addToCompareItem={handleAddToCompare}
                  isAddedtoCompareItem={handleIsAddedToCompare}
                  theme={theme}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-next-product nav-next-slider nav-sw box-icon round snbp3070 w_46">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-prev-product nav-prev-slider nav-sw box-icon round snbn3070 w_46">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="justify-content-center spd307 style-2 sw-dots sw-pagination-product" />
        </div>
      </div>
    </>
  );
}
