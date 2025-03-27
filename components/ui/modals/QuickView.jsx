"use client";
import { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { defaultProductImage } from "@/utils/default";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, Button, Divider, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { formatPrice, calculateDiscount } from "@/utils/priceFormatter";
import request from "@/utils/axios";
import toast from "react-hot-toast";
import useQueryStore from "@/context/queryStore";
import CloseIcon from '@mui/icons-material/Close';
import PriceFormatter from '@/components/ui/helpers/PriceFormatter';

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
  const { revalidate } = useQueryStore();

  // State for product details
  const [productDetail, setProductDetail] = useState(null);
  const [variations, setVariations] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentProductItem, setCurrentProductItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!quickViewItem?.id) return;

    const fetchProductDetail = async () => {
      try {
        const productId = quickViewItem.productId || quickViewItem.id;
        const { data } = await request.get(`/products/${productId}`);
        const productData = data.data;

        setProductDetail(productData);

        const allVariations = {};
        if (productData.productItems) {
          productData.productItems.forEach(item => {
            if (!item.configurations) return;

            item.configurations.forEach(config => {
              if (!allVariations[config.variationName]) {
                allVariations[config.variationName] = [];
              }

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
        }

        const variationsArray = Object.keys(allVariations).map(variationName => ({
          name: variationName,
          options: allVariations[variationName]
        }));

        setVariations(variationsArray);

        const initialSelectedOptions = {};
        variationsArray.forEach(variation => {
          if (variation.options.length > 0) {
            initialSelectedOptions[variation.name] = variation.options[0].optionId;
          }
        });

        setSelectedOptions(initialSelectedOptions);

        const matchingItem = findMatchingProductItem(initialSelectedOptions, productData.productItems);
        if (matchingItem) {
          setCurrentProductItem(matchingItem);
        }

        setOpen(true);

      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      }
    };

    fetchProductDetail();
  }, [quickViewItem]);

  const findMatchingProductItem = (options, productItems) => {
    if (!productItems) return null;

    return productItems.find(item => {
      if (!item.configurations) return false;

      return Object.keys(options).every(variationName => {
        const selectedOptionId = options[variationName];
        return item.configurations.some(
          config => config.variationName === variationName && config.optionId === selectedOptionId
        );
      });
    });
  };

  const handleOptionSelect = (variationName, optionId) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [variationName]: optionId
    };

    setSelectedOptions(newSelectedOptions);
    const matchingItem = findMatchingProductItem(newSelectedOptions, productDetail?.productItems);

    if (matchingItem) {
      setCurrentProductItem(matchingItem);
    }
  };

  const handleAddToCart = async () => {
    if (!currentProductItem) {
      toast.error("Please select all options first");
      return;
    }

    if (currentProductItem.quantityInStock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      const response = await request.post("/cart-items", {
        productItemId: currentProductItem.id,
        quantity: quantity
      });

      if (response.status === 200) {
        toast.success("Đã thêm vào giỏ hàng");
        addProductToCart(productDetail.id, quantity);
        revalidate();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Thêm vào giỏ hàng thất bại");
    }
  };

  if (!productDetail) return null;

  // Calculate discount
  const discountPercent = currentProductItem?.marketPrice && currentProductItem?.price 
    ? calculateDiscount(currentProductItem.marketPrice, currentProductItem.price)
    : 0;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle sx={{ position: 'relative', padding: '16px 24px' }}>
        Quick View
        <IconButton
          onClick={() => setOpen(false)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          <Box sx={{ flex: 1, position: 'relative' }}>
            <Image
              src={productDetail?.thumbnail || defaultProductImage}
              alt={productDetail?.name || "Product Image"}
              width={500}
              height={500}
              style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '500px' }}
            />
            {/* {discountPercent > 0 && (
              <Chip
                label={`-${discountPercent}%`}
                color="error"
                sx={{ position: 'absolute', top: 20, right: 20 }}
              />
            )} */}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 1, fontWeight: 500 }}>
              {productDetail.name}
            </Typography>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <PriceFormatter 
                price={currentProductItem?.price} 
                originalPrice={currentProductItem?.marketPrice} 
                variant="h6" 
                sx={{ color: theme.palette.primary.main, fontWeight: 600, mr: 2 }} 
              />
              {discountPercent > 0 && (
                <Chip label={`-${discountPercent}%`} size="small" sx={{ backgroundColor: theme.palette.error.light }} />
              )}
            </Box>
            {productDetail.description && (
              <Typography variant="body2" sx={{ mb: 3 }}>
                {productDetail.description}
              </Typography>
            )}
            {variations.map((variation) => (
              <Box key={variation.name} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {variation.name}:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {variation.options.map((option) => (
                    <Button
                      key={option.optionId}
                      variant={selectedOptions[variation.name] === option.optionId ? "contained" : "outlined"}
                      onClick={() => handleOptionSelect(variation.name, option.optionId)}
                      size="small"
                    >
                      {option.optionName}
                    </Button>
                  ))}
                </Box>
              </Box>
            ))}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Quantity:
              </Typography>
              <div className="d-flex align-items-center">
                <div className="quantity-input-container" style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  border: `1px solid ${theme.palette.grey[200]}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: 'fit-content',
                  padding: '4px'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (quantity > 1) {
                        setQuantity(quantity - 1);
                      }
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette.grey[100],
                      border: 'none',
                      borderRadius: '6px',
                      cursor: quantity > 1 ? 'pointer' : 'not-allowed',
                      color: theme.palette.primary.main,
                      transition: 'all 0.2s ease',
                      fontSize: '20px'
                    }}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1) {
                        setQuantity(val);
                      }
                    }}
                    style={{
                      width: '60px',
                      height: '32px',
                      textAlign: 'center',
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                      fontWeight: '500',
                      color: theme.palette.text.primary,
                      margin: '0 8px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette.grey[100],
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: theme.palette.primary.main,
                      transition: 'all 0.2s ease',
                      fontSize: '20px'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleAddToCart}
                disabled={!currentProductItem || currentProductItem.quantityInStock <= 0}
              >
                {currentProductItem?.quantityInStock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => addToCompareItem(productDetail.id)}
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
                <span className={`icon icon-compare ${isAddedtoCompareItem(productDetail.id) ? "added" : ""}`} />
              </Button>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Link 
                href={`/product-detail?id=${productDetail.id}`}
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                Xem chi tiết
                <span className="icon-arrow-right" style={{ marginLeft: '8px', fontSize: '14px' }}></span>
              </Link>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
