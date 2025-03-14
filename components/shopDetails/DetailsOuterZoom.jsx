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
import { openCartModal } from "@/utlis/openCartModal";
import Rating from "../common/Rating";
import { defaultProductImage } from "@/utlis/default";
import { usePathname } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import request from "@/utlis/axios";
import toast from "react-hot-toast";
import useQueryStore from "@/context/queryStore";
import { useTheme } from "@mui/material/styles";
import { ShoppingCart } from "@mui/icons-material";

export default function DetailsOuterZoom({ product = allProducts[0] }) {
  const theme = useTheme();
  const router = usePathname();
  const productId = router.split("/")[2];
  const { switcher, revalidate } = useQueryStore();
  const [currentPrice, setCurrentPrice] = useState({
    price: product?.price || 0,
    marketPrice: product?.marketPrice || (product?.price || 0) * 1.2,
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
        marketPrice: matchingItem.marketPrice || matchingItem.price * 1.2,
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
        marketPrice: matchingItem.marketPrice || matchingItem.price * 1.2,
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
        
        const length = images.length;
        if (product?.productItems) {
          product.productItems.forEach((item, index) => {
            if (item.imageUrl) {
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
      className="flat-spacing-4 pt_0 bg-neutral-50"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div
        className="tf-main-product section-image-zoom"
        style={{ maxWidth: "100vw", overflow: "clip" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top">
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
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom p-6 rounded-lg shadow-sm bg-white">
                  <div className="tf-product-info-title">
                    <h5 className="font-serif text-primary-800">{product?.name || 'Product Name'}</h5>
                    {product?.rating > 0 && <Rating number={product.rating} />}
                  </div>
                  {product?.soldCount > 0 && (
                    <div className="tf-product-info-badges">
                      <div className="product-status-content">
                        <i className="icon-lightning text-amber-500" />
                        <p className="fw-6 text-neutral-700">
                          Selling fast! {product.soldCount} people have bought
                          this.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="tf-product-info-price mb-5">
                    <div className="price-on-sale text-primary-700 font-medium">
                      {(currentPrice?.price || 0).toLocaleString()}₫
                    </div>

                    <div className="compare-at-price text-neutral-500">
                      {(currentPrice?.marketPrice || 0).toLocaleString()}₫
                    </div>
                    <div className="badges-on-sale bg-rose-100 text-rose-700">
                      <span>
                        {Math.round(
                          ((currentPrice?.marketPrice || 0) - (currentPrice?.price || 0)) /
                            (currentPrice?.marketPrice || 1) *
                            100
                        ) || 0}
                      </span>
                      % OFF
                    </div>
                  </div>
                  
                  <div className="tf-product-info-variant-picker">
                    {variations.map((variation, index) => (
                      <div className="variant-picker-item mb-4" key={variation.name}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="variant-picker-label text-neutral-700 font-medium">{variation.name}:</div>
                        </div>
                        <div className="variant-picker-options mt-2">
                          {variation.options.map((option) => (
                            <button
                              key={option.optionId}
                              type="button"
                              onClick={() => handleOptionSelect(variation.name, option.optionId)}
                              className="variant-picker-option mr-2 mb-2 px-4 py-2 border rounded-md transition-all"
                              style={{ 
                                borderColor: selectedOptions[variation.name] === option.optionId 
                                  ? theme.palette.primary.main 
                                  : theme.palette.grey[300],
                                backgroundColor: selectedOptions[variation.name] === option.optionId 
                                  ? theme.palette.primary.main 
                                  : '#fff',
                                color: selectedOptions[variation.name] === option.optionId 
                                  ? '#fff' 
                                  : theme.palette.text.primary
                              }}
                            >
                              {option.optionName}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <Quantity setQuantity={setQuantity} />
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()} className="">
                      <a
                        onClick={() => {
                          openCartModal();
                          if (!currentProductItem) {
                            toast.error("Please select all options first");
                            return;
                          }
                          request
                            .post("/cart-items", {
                              productItemId: currentProductItem.id,
                              quantity: quantity,
                            })
                            .then((res) => {
                              if (res.status === 201) {
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
                        className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                        style={{ 
                          backgroundColor: theme.palette.primary.main,
                          color: '#fff'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = theme.palette.primary.dark;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = theme.palette.primary.main;
                        }}
                      >
                        <ShoppingCart className="mr-2" fontSize="small" />
                        <span>
                          Add to cart
                        </span>
                      </a>
                      
                      <div className="w-100">
                        <a 
                          href="/view-cart" 
                          className="btns-full"
                          style={{ 
                            backgroundColor: theme.palette.grey[100],
                            color: theme.palette.text.primary
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = theme.palette.grey[200];
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = theme.palette.grey[100];
                          }}
                        >
                          Buy with Paypal
                        </a>
                      </div>
                    </form>
                  </div>
                  
                  <div className="tf-product-info-extra-link mb-5">
                    <a
                      href="#ask_question"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon text-primary-600">
                        <i className="icon-question" />
                      </div>
                      <div className="text fw-6 text-neutral-700">Ask a question</div>
                    </a>
                    <a
                      href="#delivery_return"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon text-primary-600">
                        <svg
                          className="d-inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          width={22}
                          height={18}
                          viewBox="0 0 22 18"
                          fill="currentColor"
                        >
                          <path d="M21.7872 10.4724C21.7872 9.73685 21.5432 9.00864 21.1002 8.4217L18.7221 5.27043C18.2421 4.63481 17.4804 4.25532 16.684 4.25532H14.9787V2.54885C14.9787 1.14111 13.8334 0 12.4255 0H9.95745V1.69779H12.4255C12.8948 1.69779 13.2766 2.07962 13.2766 2.54885V14.5957H8.15145C7.80021 13.6052 6.85421 12.8936 5.74468 12.8936C4.63515 12.8936 3.68915 13.6052 3.33792 14.5957H2.55319C2.08396 14.5957 1.70213 14.2139 1.70213 13.7447V2.54885C1.70213 2.07962 2.08396 1.69779 2.55319 1.69779H9.95745V0H2.55319C1.14528 0 0 1.14111 0 2.54885V13.7447C0 15.1526 1.14528 16.2979 2.55319 16.2979H3.33792C3.68915 17.2884 4.63515 18 5.74468 18C6.85421 18 7.80021 17.2884 8.15145 16.2979H13.423C13.7742 17.2884 14.7202 18 15.8297 18C16.9393 18 17.8853 17.2884 18.2365 16.2979H21.7872V10.4724ZM16.684 5.95745C16.9494 5.95745 17.2034 6.08396 17.3634 6.29574L19.5166 9.14894H14.9787V5.95745H16.684ZM5.74468 16.2979C5.27545 16.2979 4.89362 15.916 4.89362 15.4468C4.89362 14.9776 5.27545 14.5957 5.74468 14.5957C6.21392 14.5957 6.59575 14.9776 6.59575 15.4468C6.59575 15.916 6.21392 16.2979 5.74468 16.2979ZM15.8298 16.2979C15.3606 16.2979 14.9787 15.916 14.9787 15.4468C14.9787 14.9776 15.3606 14.5957 15.8298 14.5957C16.299 14.5957 16.6809 14.9776 16.6809 15.4468C16.6809 15.916 16.299 16.2979 15.8298 16.2979ZM18.2366 14.5957C17.8853 13.6052 16.9393 12.8936 15.8298 12.8936C15.5398 12.8935 15.252 12.943 14.9787 13.04V10.8511H20.0851V14.5957H18.2366Z" />
                        </svg>
                      </div>
                      <div className="text fw-6 text-neutral-700">Delivery &amp; Return</div>
                    </a>
                    <a
                      href="#share_social"
                      data-bs-toggle="modal"
                      className="tf-product-extra-icon"
                    >
                      <div className="icon text-primary-600">
                        <i className="icon-share" />
                      </div>
                      <div className="text fw-6 text-neutral-700">Share</div>
                    </a>
                  </div>
                  
                  <div className="tf-product-info-delivery-return bg-neutral-50 rounded-md p-4">
                    <div className="row">
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery">
                          <div className="icon text-primary-600">
                            <i className="icon-delivery-time" />
                          </div>
                          <p className="text-neutral-700">
                            Estimate delivery times:
                            <span className="fw-7 text-primary-700">12-26 days</span>
                            (International),
                            <span className="fw-7 text-primary-700">3-6 days</span> (United
                            States).
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery mb-0">
                          <div className="icon text-primary-600">
                            <i className="icon-return-order" />
                          </div>
                          <p className="text-neutral-700">
                            Return within <span className="fw-7 text-primary-700">30 days</span>{" "}
                            of purchase. Duties &amp; taxes are non-refundable.
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
