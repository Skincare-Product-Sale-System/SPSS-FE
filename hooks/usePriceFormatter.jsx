import { useContext } from 'react';
import { formatPrice, calculateDiscount } from '@/utils/priceFormatter';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * Custom hook for price formatting that integrates with ThemeContext
 * @returns {Object} Price formatting functions and utilities
 */
export default function usePriceFormatter() {
  const { colors } = useContext(ThemeContext);

  /**
   * Format price as a string with currency symbol
   * @param {number} price - The price to format
   * @returns {string} Formatted price string
   */
  const format = (price) => {
    return formatPrice(price);
  };

  /**
   * Calculate discount percentage between prices
   * @param {number} originalPrice - Original price
   * @param {number} salePrice - Discounted price
   * @returns {number} Discount percentage
   */
  const getDiscountPercent = (originalPrice, salePrice) => {
    return calculateDiscount(originalPrice, salePrice);
  };

  /**
   * Get appropriate style for price display
   * @param {boolean} isDiscounted - Whether the price is discounted
   * @returns {Object} Style object for price display
   */
  const getPriceStyle = (isDiscounted = false) => {
    return {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontWeight: 500,
      color: isDiscounted ? colors?.error || '#F03E3E' : colors?.primary || '#4ECDC4',
    };
  };

  /**
   * Format price with separators only (no currency symbol)
   * @param {number} price - The price to format
   * @returns {string} Formatted price without currency
   */
  const formatNumberOnly = (price) => {
    if (!price && price !== 0) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return {
    format,
    getDiscountPercent,
    getPriceStyle,
    formatNumberOnly
  };
} 