/**
 * Formats a price in Vietnamese currency format
 * @param {number} price - The price to format
 * @param {boolean} includeSymbol - Whether to include the ₫ symbol
 * @returns {string} - Formatted price string
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return "0₫";
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}₫`;
};

/**
 * Calculates discount percentage between original and sale price
 * @param {number} originalPrice - The original price
 * @param {number} salePrice - The sale price
 * @returns {number} - Discount percentage
 */
export const calculateDiscount = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}; 