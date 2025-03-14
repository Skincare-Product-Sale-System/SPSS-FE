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