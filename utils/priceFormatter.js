/**
 * Formats a price in Vietnamese currency format
 * @param {number} price - The price to format
 * @param {boolean} includeSymbol - Whether to include the ₫ symbol
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price, includeSymbol = true) => {
  if (!price && price !== 0) return '';
  
  // Format with thousand separators
  const formattedPrice = price.toLocaleString('vi-VN');
  
  // Return with or without currency symbol
  return includeSymbol ? `${formattedPrice}₫` : formattedPrice;
};

/**
 * Calculates discount percentage between original and sale price
 * @param {number} originalPrice - The original price
 * @param {number} salePrice - The sale price
 * @returns {number} - Discount percentage
 */
export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}; 