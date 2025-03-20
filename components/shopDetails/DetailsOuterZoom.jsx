"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import CountdownComponent from "../common/Countdown";
import {
  colors,
  paymentImages,
  sizeOptions,
} from "@/data/singleProductOptions";
import StickyItem from "./StickyItem";
import Quantity from "./Quantity";

import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
import { allProducts } from "@/data/products";
import { useContextElement } from "@/context/Context";
import { openCartModal } from "@/utils/openCartModal";
import Rating from "../common/Rating";
import { defaultProductImage } from "@/utils/default";
import { usePathname } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import useQueryStore from "@/context/queryStore";
import { useTheme } from "@mui/material/styles";
import { ShoppingCart } from "@mui/icons-material";
import { Typography, Divider, Chip, Link, Box, Rating as MuiRating } from "@mui/material";
import { formatPrice, calculateDiscount } from "@/utils/priceFormatter";

export default function DetailsOuterZoom({ product = allProducts[0] }) {
  const theme = useTheme();
  const router = usePathname();
  const productId = router.split("/")[2];
  const { switcher, revalidate } = useQueryStore();
  const [currentPrice, setCurrentPrice] = useState({
    price: product?.price || 0,
    marketPrice: product?.marketPrice || 0,
  });

  // Group all variations and options
  const [variations, setVariations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentProductItem, setCurrentProductItem] = useState(null);
  
  useEffect(() => {
    if (!product?.productItems) return;
    
    // Extract all unique variations
    const allVariations = {};
    
    product.productItems.forEach(item => {
      if (!item.configurations) return;
      
      item.configurations.forEach(config => {
        if (!allVariations[config.variationName]) {
          allVariations[config.variationName] = [];
        }
        
        // Add option if not already in the list
        const existingOption = allVariations[config.variationName].find(
          opt => opt.optionId === config.optionId
        );
        
        if (!existingOption) {
          allVariations[config.variationName].push({
            variationName: config.variationName,
            optionName: config.optionName,
            optionId: config.optionId
          });
        }
      });
    });
    
    // Convert to array format for rendering
    const variationsArray = Object.keys(allVariations).map(variationName => ({
      name: variationName,
      options: allVariations[variationName]
    }));
    
    setVariations(variationsArray);
    
    // Initialize selected options with first option of each variation
    const initialSelectedOptions = {};
    variationsArray.forEach(variation => {
      if (variation.options.length > 0) {
        initialSelectedOptions[variation.name] = variation.options[0].optionId;
      }
    });
    
    setSelectedOptions(initialSelectedOptions);
    
    // Find matching product item for initial selection
    const matchingItem = findMatchingProductItem(initialSelectedOptions);
    if (matchingItem) {
      setCurrentProductItem(matchingItem);
      setCurrentPrice({
        price: matchingItem.price || 0,
        marketPrice: matchingItem.marketPrice || 0,
      });
    }
  }, [product]);
  
  // Find product item that matches all selected options
  const findMatchingProductItem = (options) => {
    if (!product?.productItems) return null;
    
    const matchingItem = product.productItems.find(item => {
      if (!item.configurations) return false;
      
      // Check if this item matches all selected options
      const allOptionsMatch = Object.keys(options).every(variationName => {
        const selectedOptionId = options[variationName];
        return item.configurations.some(
          config => config.variationName === variationName && config.optionId === selectedOptionId
        );
      });
      
      return allOptionsMatch;
    });
    
    return matchingItem;
  };
  
  // Handle option selection
  const handleOptionSelect = (variationName, optionId) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [variationName]: optionId
    };
    
    setSelectedOptions(newSelectedOptions);
    const matchingItem = findMatchingProductItem(newSelectedOptions);
    
    if (matchingItem) {
      setCurrentProductItem(matchingItem);
      setCurrentPrice({
        price: matchingItem.price || 0,
        marketPrice: matchingItem.marketPrice || 0,
      });
    }
  };

  const [quantity, setQuantity] = useState(1);

  const {
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    isAddedtoCompareItem,
    addToWishlist,
    isAddedtoWishlist,
  } = useContextElement();

  const [productImages, setProductImages] = useState([]);
  
  useEffect(() => {
    if (!productId) return;
    
    (async () => {
      try {
        const { data } = await request.get(`/product-images/${productId}`);
        let images = (data?.data || []).map((item, index) => ({
          id: index + 1,
          src: item.url || defaultProductImage,
          alt: "",
          width: 768,
          height: 1152,
          dataValue: item.id,
        }));
        
        // Track unique image URLs to avoid duplicates
        const uniqueUrls = new Set(images.map(img => img.src));
        
        const length = images.length;
        if (product?.productItems) {
          product.productItems.forEach((item, index) => {
            if (item.imageUrl && !uniqueUrls.has(item.imageUrl)) {
              // Only add if this URL hasn't been seen before
              uniqueUrls.add(item.imageUrl);
              
              // Find the variation option ID to associate with this image
              const optionId = item.configurations?.find(
                config => config.variationName === variations[0]?.name
              )?.optionId;
              
              images.push({
                id: index + length + 1,
                src: item.imageUrl,
                alt: "",
                width: 768,
                height: 1152,
                dataValue: optionId || '',
              });
            }
          });
        }
        setProductImages(images);
      } catch (error) {
        console.error("Error fetching product images:", error);
        setProductImages([]);
      }
    })();
  }, [productId, variations]);

  return (
    <section
      className="bg-neutral-50 flat-spacing-4 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div
        className="section-image-zoom tf-main-product"
        style={{ maxWidth: "100vw", overflow: "clip" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="sticky-top tf-product-media-wrap">
                <div className="thumbs-slider">
                  <Slider1ZoomOuter
                    images={productImages || []}
                    handleColor={(optionId) => {
                      // Find which variation this option belongs to
                      for (const variation of variations) {
                        const option = variation.options.find(opt => opt.optionId === optionId);
                        if (option) {
                          handleOptionSelect(variation.name, optionId);
                          break;
                        }
                      }
                    }}
                    currentColor={selectedOptions[variations[0]?.name]}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="position-relative tf-product-info-wrap">
                <div className="tf-zoom-main" />
                <div className="bg-white p-4 rounded-lg shadow-sm other-image-zoom tf-product-info-list">
                  <div className="mb-2 tf-product-info-title">
                    <h5 className="text-primary-800 font-serif fs-20">{product?.name || 'Product Name'}</h5>
                    <div className="d-flex gap-3 items-center product-rating">
                      <div className="flex items-center rating">
                        <span className="mr-2 rating-value">{product.ratingDisplay}</span>
                        <MuiRating
                          value={product.rating || 0}
                          precision={0.5}
                          readOnly
                          size="small"
                          sx={{
                            color: theme.palette.warning.main,
                            '& .MuiRating-iconEmpty': {
                              color: '#d1d5db'
                            }
                          }}
                        />
                      </div>
                      <Box component="span" sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: '#666',
                        fontSize: '14px',
                        '&::before': {
                          content: '""',
                          display: 'inline-block',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          backgroundColor: '#999',
                          margin: '0 8px'
                        }
                      }}>
                        Đã bán: {product.soldCount?.toLocaleString('vi-VN')}
                      </Box>
                    </div>
                  </div>
                  
                  <div className="bg-rose-50 p-3 rounded mb-3 tf-product-info-price">
                    <div className="d-flex align-items-center">
                      <div className="text-rose-600 font-medium fs-24 mr-2 price-on-sale">
                        {formatPrice(currentPrice?.price)}
                      </div>
                      <div className="text-decoration-line-through text-neutral-500 compare-at-price fs-16">
                        {formatPrice(currentPrice?.marketPrice)}
                      </div>
                      <div className="badges-on-sale bg-rose-100 rounded text-rose-700 ml-2 px-2 py-1">
                        <span>
                          {calculateDiscount(currentPrice?.marketPrice, currentPrice?.price)}
                        </span>
                        % OFF
                      </div>
                    </div>
                  </div>
                  
                  {/* Compact Product Information */}
                  <div className="mb-3 product-info-compact">
                    <div className="d-flex flex-wrap">
                      {/* Brand */}
                      {product?.brand && (
                        <div className="d-flex align-items-center mb-2 mr-4">
                          <Typography variant="subtitle2" className="text-gray-600 fs-14 mr-1">Brand:</Typography>
                          <Link href={`/shop?brand=${product.brand.id}`} className="text-primary fs-14 hover:underline">
                            {product.brand.name}
                          </Link>
                        </div>
                      )}
                      
                      {/* Category */}
                      {product?.category && (
                        <div className="d-flex align-items-center mb-2 mr-4">
                          <Typography variant="subtitle2" className="text-gray-600 fs-14 mr-1">Category:</Typography>
                          <Link href={`/shop?category=${product.category.id}`} className="text-primary fs-14 hover:underline">
                            {product.category.categoryName}
                          </Link>
                        </div>
                      )}
                      
                      {/* Status */}
                      <div className="d-flex align-items-center mb-2">
                        <Typography variant="subtitle2" className="text-gray-600 fs-14 mr-1">Status:</Typography>
                        <Chip 
                          label={product?.status || "Available"} 
                          color={product?.status === "Available" ? "success" : "default"}
                          size="small"
                          sx={{ height: '20px', fontSize: '12px' }}
                        />
                      </div>
                    </div>
                    
                    {/* Skin Types */}
                    {product?.skinTypes && product.skinTypes.length > 0 && (
                      <div className="mb-2">
                        <div className="d-flex flex-wrap align-items-center">
                          <Typography variant="subtitle2" className="text-gray-600 fs-14 mr-2">Skin types:</Typography>
                          {product.skinTypes.map(skinType => (
                            <Link key={skinType.id} href={`/shop?skinType=${skinType.id}`}>
                              <Chip 
                                label={skinType.name} 
                                size="small" 
                                className="cursor-pointer hover:bg-primary-light"
                                style={{ 
                                  backgroundColor: `${theme.palette.primary.main}15`,
                                  borderColor: theme.palette.primary.main,
                                  marginRight: '4px',
                                  marginBottom: '4px',
                                  height: '20px',
                                  fontSize: '12px'
                                }}
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="tf-product-info-variant-picker">
                    {variations.map((variation, index) => (
                      <div className="mb-3 variant-picker-item" key={variation.name}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="text-neutral-700 font-medium fs-14 variant-picker-label">{variation.name}:</div>
                        </div>
                        <div className="mt-1 variant-picker-options">
                          {variation.options.map((option) => {
                            // Tìm product item có option này
                            const productItemWithOption = product.productItems.find(item => 
                              item.configurations?.some(
                                config => config.optionId === option.optionId
                              )
                            );
                            
                            // Kiểm tra số lượng tồn kho
                            const isOutOfStock = productItemWithOption?.quantityInStock === 0;

                            return (
                              <button
                                key={option.optionId}
                                type="button"
                                onClick={() => !isOutOfStock && handleOptionSelect(variation.name, option.optionId)}
                                disabled={isOutOfStock}
                                className="border rounded-md fs-14 mb-2 mr-2 px-3 py-1 transition-all variant-picker-option"
                                style={{ 
                                  borderColor: selectedOptions[variation.name] === option.optionId 
                                    ? theme.palette.primary.main 
                                    : theme.palette.grey[300],
                                  backgroundColor: isOutOfStock 
                                    ? theme.palette.grey[100]
                                    : selectedOptions[variation.name] === option.optionId 
                                      ? theme.palette.primary.main 
                                      : '#fff',
                                  color: isOutOfStock
                                    ? theme.palette.grey[400]
                                    : selectedOptions[variation.name] === option.optionId 
                                      ? '#fff' 
                                      : theme.palette.text.primary,
                                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                  position: 'relative'
                                }}
                              >
                                {option.optionName}
                                {isOutOfStock && (
                                  <div 
                                    className="position-absolute" 
                                    style={{
                                      top: '50%',
                                      left: 0,
                                      right: 0,
                                      height: '1px',
                                      backgroundColor: theme.palette.grey[400],
                                      transform: 'rotate(-10deg)'
                                    }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-3 tf-product-info-quantity">
                    {currentProductItem && (
                      <div className="d-flex align-items-center mb-2">
                        

                    {/* Hiển thị quantityInStock */}
                    {currentProductItem && (
                      <div className="mb-3 variant-picker-item">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="text-neutral-700 font-medium fs-14 variant-picker-label">Stock:</div>
                        </div>
                        <div className="mt-1">
                          <div className="border rounded-md fs-14 px-3 py-1" style={{
                            borderColor: currentProductItem.quantityInStock > 0 
                              ? theme.palette.success.light 
                              : theme.palette.error.light,
                            backgroundColor: currentProductItem.quantityInStock > 0
                              ? `${theme.palette.success.main}15`
                              : `${theme.palette.error.main}15`,
                            color: currentProductItem.quantityInStock > 0
                              ? theme.palette.success.dark
                              : theme.palette.error.dark,
                            display: 'inline-block'
                          }}>
                            {currentProductItem.quantityInStock > 0 ? (
                              <>
                                <span className="font-medium">{currentProductItem.quantityInStock}</span> products available
                              </>
                            ) : (
                              <span className="font-medium">Out of stock</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                        {currentProductItem.quantityInStock < 10 && currentProductItem.quantityInStock > 0 && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: theme.palette.warning.main,
                              ml: 1,
                              fontWeight: 500
                            }}
                          >
                            Only {currentProductItem.quantityInStock} left!
                          </Typography>
                        )}
                        {currentProductItem.quantityInStock <= 0 && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: theme.palette.error.main,
                              ml: 1,
                              fontWeight: 500
                            }}
                          >
                            Out of stock!
                          </Typography>
                        )}
                      </div>
                    )}
                    
                    <div className="d-flex align-items-center">
                      <div className="fs-14 fw-6 mr-3 quantity-title">Quantity</div>
                      <div className="quantity-input-container" style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${theme.palette.grey[300]}`,
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (quantity > 1) {
                              setQuantity(quantity - 1);
                            }
                          }}
                          style={{
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.palette.grey[100],
                            border: 'none',
                            cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                            color: quantity > 1 ? theme.palette.text.primary : theme.palette.grey[400],
                            transition: 'all 0.2s ease'
                          }}
                          disabled={quantity <= 1}
                        >
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>−</span>
                        </button>
                        
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1 && val <= (currentProductItem?.quantityInStock || 999)) {
                              setQuantity(val);
                            }
                          }}
                          style={{
                            width: '60px',
                            height: '36px',
                            textAlign: 'center',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: theme.palette.text.primary
                          }}
                        />
                        
                        <button
                          type="button"
                          onClick={() => {
                            if (quantity < (currentProductItem?.quantityInStock || 999)) {
                              setQuantity(quantity + 1);
                            }
                          }}
                          style={{
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.palette.grey[100],
                            border: 'none',
                            cursor: quantity < (currentProductItem?.quantityInStock || 999) ? 'pointer' : 'not-allowed',
                            color: quantity < (currentProductItem?.quantityInStock || 999) ? theme.palette.text.primary : theme.palette.grey[400],
                            transition: 'all 0.2s ease'
                          }}
                          disabled={quantity >= (currentProductItem?.quantityInStock || 999)}
                        >
                          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3 tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
                      <a
                        onClick={() => {
                          if (!currentProductItem) {
                            toast.error("Please select all options first");
                            return;
                          }
                          if (currentProductItem.quantityInStock <= 0) {
                            toast.error("This product is out of stock");
                            return;
                          }
                          openCartModal();
                          request
                            .post("/cart-items", {
                              productItemId: currentProductItem.id,
                              quantity: quantity,
                            })
                            .then((res) => {
                              if (res.status === 200) {
                                toast.success("Added to cart");
                                addProductToCart(
                                  product?.id,
                                  quantity ? quantity : 1
                                );
                                revalidate();
                              }
                            })
                            .catch((err) => {
                              toast.error("Failed to add to cart");
                            });
                        }}
                        className={`tf-btn ${currentProductItem?.quantityInStock <= 0 ? 'btn-disabled' : 'btn-fill'} justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn`}
                        style={{ 
                          backgroundColor: currentProductItem?.quantityInStock <= 0 ? theme.palette.grey[400] : theme.palette.primary.main,
                          color: '#fff',
                          padding: '10px 15px',
                          cursor: currentProductItem?.quantityInStock <= 0 ? 'not-allowed' : 'pointer'
                        }}
                        onMouseOver={(e) => {
                          if (currentProductItem?.quantityInStock > 0) {
                            e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentProductItem?.quantityInStock > 0) {
                            e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                          }
                        }}
                      >
                        <ShoppingCart className="mr-2" fontSize="small" />
                        <span>{currentProductItem?.quantityInStock <= 0 ? 'Out of Stock' : 'Add to cart'}</span>
                      </a>
                      
                      <a 
                        href={currentProductItem?.quantityInStock > 0 ? "/view-cart" : "#"}
                        className={`btns-full fs-14 ${currentProductItem?.quantityInStock <= 0 ? 'disabled' : ''}`}
                        style={{ 
                          backgroundColor: currentProductItem?.quantityInStock <= 0 ? theme.palette.grey[400] : theme.palette.error.main,
                          color: '#fff',
                          padding: '10px 15px',
                          cursor: currentProductItem?.quantityInStock <= 0 ? 'not-allowed' : 'pointer'
                        }}
                        onClick={(e) => {
                          if (currentProductItem?.quantityInStock <= 0) {
                            e.preventDefault();
                            toast.error("This product is out of stock");
                          }
                        }}
                        onMouseOver={(e) => {
                          if (currentProductItem?.quantityInStock > 0) {
                            e.currentTarget.style.backgroundColor = theme.palette.error.dark;
                          }
                        }}
                        onMouseOut={(e) => {
                          if (currentProductItem?.quantityInStock > 0) {
                            e.currentTarget.style.backgroundColor = theme.palette.error.main;
                          }
                        }}
                      >
                        Buy Now
                      </a>
                    </form>
                  </div>
                  
                  <div className="d-flex gap-3 mb-3 tf-product-info-extra-link">
                    <a
                      href="#ask_question"
                      data-bs-toggle="modal"
                      className="d-flex align-items-center tf-product-extra-icon"
                    >
                      <div className="text-primary-600 fs-14 icon mr-1">
                        <i className="icon-question" />
                      </div>
                      <div className="text-neutral-700 fs-14 fw-6 text">Ask a question</div>
                    </a>
                    <a
                      href="#share_social"
                      data-bs-toggle="modal"
                      className="d-flex align-items-center tf-product-extra-icon"
                    >
                      <div className="text-primary-600 fs-14 icon mr-1">
                        <i className="icon-share" />
                      </div>
                      <div className="text-neutral-700 fs-14 fw-6 text">Share</div>
                    </a>
                  </div>
                  
                  <div className="bg-neutral-50 p-3 rounded-md tf-product-info-delivery-return">
                    <div className="row">
                      <div className="col-12 col-xl-6">
                        <div className="d-flex align-items-center tf-product-delivery">
                          <div className="text-primary-600 icon mr-2">
                            <i className="icon-delivery-time" />
                          </div>
                          <p className="text-neutral-700 fs-14 mb-0">
                            Free shipping for orders over <span className="text-primary-700 fw-7">500.000₫</span>
                          </p>
                        </div>
                      </div>
                      <div className="col-12 col-xl-6">
                        <div className="d-flex align-items-center mb-0 tf-product-delivery">
                          <div className="text-primary-600 icon mr-2">
                            <i className="icon-return-order" />
                          </div>
                          <p className="text-neutral-700 fs-14 mb-0">
                            Return within <span className="text-primary-700 fw-7">30 days</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StickyItem />
    </section>
  );
}
