"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Quantity from "../shopDetails/Quantity";
import { colors, sizeOptions } from "@/data/singleProductOptions";
import React, { useState } from "react";
import { defaultProductImage } from "@/utlis/default";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Button, Divider, Chip } from "@mui/material";
import { formatPrice, calculateDiscount } from "@/utils/priceFormatter";

export default function QuickView() {
  const theme = useTheme();
  const {
    quickViewItem,
    addProductToCart,
    isAddedToCartProducts,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [currentSize, setCurrentSize] = useState(sizeOptions[0]);
  const [quantity, setQuantity] = useState(1);

  const openModalSizeChoice = () => {
    const bootstrap = require("bootstrap");
    var myModal = new bootstrap.Modal(document.getElementById("find_size"), {
      keyboard: false,
    });

    myModal.show();
    document
      .getElementById("find_size")
      .addEventListener("hidden.bs.modal", () => {
        myModal.hide();
      });
    const backdrops = document.querySelectorAll(".modal-backdrop");
    if (backdrops.length > 1) {
      const lastBackdrop = backdrops[backdrops.length - 1];
      lastBackdrop.style.zIndex = "1057";
    }
  };

  if (!quickViewItem) return null;

  // Calculate discount if both prices exist
  const discountPercent = quickViewItem.marketPrice && quickViewItem.price 
    ? calculateDiscount(quickViewItem.marketPrice, quickViewItem.price)
    : 0;

  return (
    <div
      className="modal fade"
      id="quick_view"
      tabIndex="-1"
      aria-labelledby="quick_view"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div 
          className="modal-content"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: 'none'
          }}
        >
          <div 
            className="modal-header"
            style={{
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: '16px 24px',
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Typography 
              variant="h6" 
              component="h2"
              sx={{
                fontFamily: theme.typography.h6.fontFamily,
                color: theme.palette.text.primary,
                fontWeight: 500
              }}
            >
              Quick View
            </Typography>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: theme.palette.text.secondary
              }}
            >
              <span className="icon-close"></span>
            </button>
          </div>
          <div 
            className="modal-body p-0"
            style={{
              backgroundColor: theme.palette.background.default
            }}
          >
            <div className="row g-0">
              <div className="col-md-6">
                <Box
                  sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4
                  }}
                >
                  {quickViewItem.thumbnail && (
                    <Image
                      src={quickViewItem.thumbnail || defaultProductImage}
                      alt={quickViewItem.title || quickViewItem.name || "Product Image"}
                      width={500}
                      height={500}
                      style={{ 
                        objectFit: 'contain',
                        maxWidth: '100%',
                        maxHeight: '500px'
                      }}
                    />
                  )}
                  
                  {discountPercent > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        backgroundColor: theme.palette.error.main,
                        color: '#fff',
                        borderRadius: '50%',
                        width: 50,
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600
                      }}
                    >
                      -{discountPercent}%
                    </Box>
                  )}
                </Box>
              </div>
              <div className="col-md-6">
                <Box
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      fontFamily: theme.typography.h5.fontFamily,
                      color: theme.palette.text.primary,
                      mb: 1,
                      fontWeight: 500
                    }}
                  >
                    {quickViewItem.title || quickViewItem.name}
                  </Typography>
                  
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Typography
                      variant="h6"
                      component="span"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        mr: 2
                      }}
                    >
                      {formatPrice(quickViewItem.price)}
                    </Typography>
                    
                    {quickViewItem.marketPrice && (
                      <Typography
                        variant="body1"
                        component="span"
                        sx={{
                          color: theme.palette.text.secondary,
                          textDecoration: 'line-through',
                          mr: 2
                        }}
                      >
                        {formatPrice(quickViewItem.marketPrice)}
                      </Typography>
                    )}
                    
                    {discountPercent > 0 && (
                      <Chip
                        label={`-${discountPercent}%`}
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.error.light,
                          color: theme.palette.error.contrastText,
                          fontWeight: 500
                        }}
                      />
                    )}
                  </Box>
                  
                  {quickViewItem.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 3
                      }}
                    >
                      {quickViewItem.description}
                    </Typography>
                  )}
                  
                  {quickViewItem.colors && quickViewItem.colors.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: theme.palette.text.primary
                        }}
                      >
                        Color:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {quickViewItem.colors.map((color, index) => (
                          <Box
                            key={index}
                            onClick={() => setCurrentColor(color)}
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: color.colorCode || color.colorClass,
                              border: currentColor === color ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {quickViewItem.sizes && quickViewItem.sizes.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: theme.palette.text.primary
                        }}
                      >
                        Size:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {quickViewItem.sizes.map((size, index) => (
                          <Box
                            key={index}
                            onClick={() => setCurrentSize(size)}
                            sx={{
                              padding: '6px 12px',
                              borderRadius: '4px',
                              border: `1px solid ${currentSize === size ? theme.palette.primary.main : theme.palette.divider}`,
                              backgroundColor: currentSize === size ? `${theme.palette.primary.main}10` : 'transparent',
                              color: currentSize === size ? theme.palette.primary.main : theme.palette.text.primary,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: theme.palette.primary.main
                              }
                            }}
                          >
                            {size}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: theme.palette.text.primary
                      }}
                    >
                      Quantity:
                    </Typography>
                    <Quantity 
                      quantity={quantity} 
                      setQuantity={setQuantity} 
                      customStyle={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                    <Button
                      variant="contained"
                      onClick={() => addProductToCart(quickViewItem.id)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                        borderRadius: '24px',
                        padding: '10px 24px',
                        flex: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark
                        }
                      }}
                    >
                      {isAddedToCartProducts(quickViewItem.id) ? "Added to Cart" : "Add to Cart"}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => addToWishlist(quickViewItem.id)}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        borderRadius: '24px',
                        padding: '10px 0',
                        minWidth: '44px',
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <span className={`icon icon-heart ${isAddedtoWishlist(quickViewItem.id) ? "added" : ""}`} />
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => addToCompareItem(quickViewItem.id)}
                      href="#compare"
                      data-bs-toggle="offcanvas"
                      aria-controls="offcanvasLeft"
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        borderRadius: '24px',
                        padding: '10px 0',
                        minWidth: '44px',
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <span className={`icon icon-compare ${isAddedtoCompareItem(quickViewItem.id) ? "added" : ""}`} />
                    </Button>
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Link 
                      href={`/product-detail/${quickViewItem.id}`}
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      View Full Details
                      <span className="icon-arrow-right" style={{ marginLeft: '8px', fontSize: '14px' }}></span>
                    </Link>
                  </Box>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
