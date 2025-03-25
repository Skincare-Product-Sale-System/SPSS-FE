"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/priceFormatter";
import { defaultProductImage } from "@/utils/default";
import { openCompareModal } from "@/utils/openCompareModal";

export default function ProductCard({ 
  product, 
  handleOpen, 
  addToCompareItem, 
  isAddedtoCompareItem, 
  theme 
}) {
  return (
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
            className="duration-500 hover:scale-105 object-cover transition-transform"
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
            onClick={(e) => {
              e.preventDefault();
              addToCompareItem(product.id);
              openCompareModal();
            }}
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
              {isAddedtoCompareItem(product.id) ? "Xóa khỏi So Sánh" : "Thêm vào So Sánh"}
            </Box>
          </Box>
          
          <Box
            component="a"
            onClick={() => handleOpen(product)}
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
              Xem Nhanh
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Link href={`/product-detail/${product.id}`}>
          <Box 
            component="h3" 
            sx={{ 
              fontSize: '1rem', 
              fontWeight: 500, 
              mb: 1,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              height: '2.6rem',
              color: theme.palette.text.primary,
              fontFamily: '"Roboto", sans-serif'
            }}
          >
            {product.name}
          </Box>
        </Link>
        
        <Box sx={{ fontSize: '0.875rem', color: theme.palette.text.secondary, mb: 0.5 }}>
          {product.categoryName || "Chăm sóc da"}
        </Box>
        
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            mt: 'auto',
            pt: 2
          }}
        >
          <Box>
            <Typography
              component="div"
              sx={{ 
                fontWeight: 600, 
                fontSize: '1.125rem', 
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {formatPrice(product.salePrice || product.price)}
              {product.salePrice && (
                <Typography 
                  component="span" 
                  sx={{ 
                    textDecoration: 'line-through', 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem'
                  }}
                >
                  {formatPrice(product.price)}
                </Typography>
              )}
            </Typography>
          </Box>
          <Typography
            component="span"
            sx={{
              fontSize: '0.75rem',
              color: theme.palette.text.secondary,
              fontFamily: '"Roboto", sans-serif'
            }}
          >
            Đã bán: {product.soldCount?.toLocaleString('vi-VN') || 0}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
} 