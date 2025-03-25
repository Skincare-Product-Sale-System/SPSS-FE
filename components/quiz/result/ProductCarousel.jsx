"use client";
import { Box, Card, CardMedia, CardContent, Typography, Chip } from "@mui/material";
import Link from "next/link";
import { formatPrice } from "@/utils/priceFormatter";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductCarousel({ products, index, mainColor }) {
  return (
    <Box className="hover-sw-2 hover-sw-nav" sx={{ mt: 3, position: 'relative' }}>
      <Swiper
        dir="ltr"
        modules={[Navigation]}
        navigation={{
          prevEl: `.snmpn-${index}`,
          nextEl: `.snmnn-${index}`,
        }}
        slidesPerView={3}
        spaceBetween={20}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 20,
          }
        }}
        className="swiper tf-product-header wrap-sw-over"
      >
        {products.map((product, idx) => (
          <SwiperSlide key={idx} className="swiper-slide">
            <Link 
              href={`/product-detail/${product.id}`}
              style={{ textDecoration: 'none' }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 3px 15px rgba(0,0,0,0.05)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: `1px solid ${mainColor.lightGrey}`,
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={product.thumbnail || "/images/products/placeholder.jpg"}
                  alt={product.name}
                  sx={{ 
                    objectFit: 'contain', 
                    p: 2,
                    backgroundColor: 'white'
                  }}
                />
                <CardContent sx={{ 
                  flexGrow: 1, 
                  p: 2.5,
                  backgroundColor: 'white'
                }}>
                  <Typography 
                    variant="subtitle1" 
                    component="div"
                    sx={{ 
                      fontWeight: 600,
                      mb: 1,
                      height: 48,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      height: 60,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography 
                      variant="h6" 
                      component="div"
                      sx={{ 
                        fontWeight: 700,
                        color: mainColor.primary,
                        fontSize: '1.1rem'
                      }}
                    >
                      {formatPrice(product.price)}
                    </Typography>
                    <Chip 
                      label="Xem chi tiết" 
                      size="small"
                      sx={{ 
                        backgroundColor: 'white',
                        border: `1px solid ${mainColor.primary}`,
                        color: mainColor.primary,
                        '&:hover': {
                          backgroundColor: mainColor.primary,
                          color: 'white'
                        }
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <div 
        className={`nav-next-slider nav-sw box-icon round snmpn-${index} w_46`}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          left: '-15px',
          width: '46px',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: `1px solid ${mainColor.lightGrey}`,
          color: mainColor.darkGrey,
          cursor: 'pointer',
          zIndex: 9,
          transition: 'all 0.3s ease'
        }}
      >
        <span 
          className="icon icon-arrow-left" 
          style={{ 
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center' 
          }} 
        />
      </div>
      
      <div 
        className={`nav-prev-slider nav-sw box-icon round snmnn-${index} w_46`}
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          right: '-15px',
          width: '46px',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: `1px solid ${mainColor.lightGrey}`,
          color: mainColor.darkGrey,
          cursor: 'pointer',
          zIndex: 9,
          transition: 'all 0.3s ease'
        }}
      >
        <span 
          className="icon icon-arrow-right" 
          style={{ 
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} 
        />
      </div>
      
      <style jsx global>{`
        .snmpn-${index}:hover, .snmnn-${index}:hover {
          background-color: ${mainColor.primary} !important;
          color: white !important;
          border-color: ${mainColor.primary} !important;
        }
      `}</style>
    </Box>
  );
} 