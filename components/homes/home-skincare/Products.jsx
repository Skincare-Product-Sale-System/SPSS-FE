"use client";

import { products5 } from "@/data/products";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { defaultProductImage } from "@/utlis/default";
import request from "@/utlis/axios";
import { useQueries } from "@tanstack/react-query";
import { useTheme } from "@mui/material/styles";
import { Box, Tab, Tabs, Typography, Button } from "@mui/material";

export default function Products() {
  const theme = useTheme();
  const {
    setQuickViewItem,
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();
  
  const [products] = useQueries({
    queries: [
      {
        queryKey: ["products", "bestsellers"],
        queryFn: async () => {
          const { data } = await request.get(
            "/products/best-sellers?pageNumber=1&pageSize=100"
          );

          return data.data?.items || [];
        },
      },
    ],
  });

  return (
    <section className="py-16" style={{ backgroundColor: theme.palette.background.default }}>
      <div className="container mx-auto px-4">
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          sx={{ 
            fontFamily: theme.typography.h4.fontFamily,
            color: theme.palette.text.primary,
            mb: 2,
            fontSize: { xs: '1.75rem', md: '2.25rem' }
          }}
        >
          Bestsellers
        </Typography>
        
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: '700px',
            mx: 'auto',
            mb: 5
          }}
        >
          Discover our most popular skincare products loved by customers
        </Typography>
        
        <div className="relative">
          <Swiper
            dir="ltr"
            spaceBetween={24}
            slidesPerView={4}
            breakpoints={{
              1024: { slidesPerView: 4 },
              768: { slidesPerView: 3 },
              576: { slidesPerView: 2 },
              0: { slidesPerView: 1 },
            }}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp265",
              nextEl: ".snbn265",
            }}
            pagination={{ clickable: true, el: ".spd265" }}
          >
            {!products.isLoading &&
              products.data.map((product) => (
                <SwiperSlide key={product.id}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'box-shadow 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                      },
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Link
                        href={`/product-detail/${product.id}`}
                        style={{ display: 'block', aspectRatio: '1/1' }}
                      >
                        <Image
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          src={product.thumbnail || defaultProductImage}
                          alt={product.name}
                          width={360}
                          height={360}
                          style={{ height: "100%", width: "100%" }}
                        />
                      </Link>
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1
                        }}
                      >
                        <Box
                          component="a"
                          href="#compare"
                          onClick={() => addToCompareItem(product.id)}
                          data-bs-toggle="offcanvas"
                          aria-controls="offcanvasLeft"
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isAddedtoCompareItem(product.id) 
                              ? theme.palette.primary.main 
                              : '#fff',
                            color: isAddedtoCompareItem(product.id) 
                              ? '#fff' 
                              : theme.palette.text.secondary,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            '&:hover': {
                              backgroundColor: isAddedtoCompareItem(product.id)
                                ? theme.palette.primary.dark
                                : theme.palette.grey[100]
                            },
                            '&:hover .tooltip': {
                              opacity: 1,
                              visibility: 'visible'
                            }
                          }}
                        >
                          {isAddedtoCompareItem(product.id) ? (
                            <span className="icon icon-check" />
                          ) : (
                            <span className="icon icon-compare" />
                          )}
                          
                          <Box
                            className="tooltip"
                            sx={{
                              position: 'absolute',
                              top: '-30px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              opacity: 0,
                              visibility: 'hidden',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {isAddedtoCompareItem(product.id) ? "Remove from Compare" : "Add to Compare"}
                          </Box>
                        </Box>
                        
                        <Box
                          component="a"
                          href="#quick_view"
                          onClick={() => setQuickViewItem(product)}
                          data-bs-toggle="modal"
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            color: theme.palette.text.secondary,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            '&:hover': {
                              backgroundColor: theme.palette.grey[100]
                            },
                            '&:hover .tooltip': {
                              opacity: 1,
                              visibility: 'visible'
                            }
                          }}
                        >
                          <span className="icon icon-view" />
                          <Box
                            className="tooltip"
                            sx={{
                              position: 'absolute',
                              top: '-30px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              opacity: 0,
                              visibility: 'hidden',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Quick View
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <Link
                        href={`/product-detail/${product.id}`}
                        style={{
                          fontSize: '1.125rem',
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                          marginBottom: 8,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textDecoration: 'none',
                          transition: 'color 0.3s ease',
                          height: '3rem',
                          lineHeight: '1.5rem'
                        }}
                      >
                        {product.name}
                      </Link>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {product.marketPrice && (
                          <Typography
                            component="span"
                            sx={{
                              color: theme.palette.text.secondary,
                              textDecoration: 'line-through',
                              mr: 1,
                              fontSize: '0.875rem'
                            }}
                          >
                            {product.marketPrice.toLocaleString()}₫
                          </Typography>
                        )}
                        <Typography
                          component="span"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            fontSize: '1.125rem'
                          }}
                        >
                          {product.price.toLocaleString()}₫
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </SwiperSlide>
              ))}
          </Swiper>
          <button 
            className="snbp265" 
            style={{
              position: 'absolute',
              top: '50%',
              left: -10,
              zIndex: 10,
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.text.secondary,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span className="icon icon-arrow-left" />
          </button>
          <button 
            className="snbn265" 
            style={{
              position: 'absolute',
              top: '50%',
              right: -10,
              zIndex: 10,
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.text.secondary,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span className="icon icon-arrow-right" />
          </button>
          <div 
            className="spd265" 
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 24,
              gap: 4
            }}
          />
        </div>
      </div>
    </section>
  );
}
