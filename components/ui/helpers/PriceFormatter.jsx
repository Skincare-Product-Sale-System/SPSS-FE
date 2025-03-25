import React from 'react';
import { Typography } from '@mui/material';

/**
 * Price formatter component for consistent price display
 * 
 * @param {Object} props Component props
 * @param {number} props.price The price value to format
 * @param {number} props.originalPrice Optional original price for displaying discounts
 * @param {string} props.currencySymbol Currency symbol, defaults to VND
 * @param {string} props.variant Typography variant
 * @param {string} props.className Additional CSS classes
 * @param {Object} props.sx Additional MUI sx props
 * @returns {JSX.Element} Formatted price component
 */
const PriceFormatter = ({ 
  price, 
  originalPrice, 
  currencySymbol = '₫', 
  variant = 'body1',
  className = '',
  sx = {},
  ...props 
}) => {
  // Format number with thousand separators
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formattedPrice = formatNumber(price);
  
  if (originalPrice && originalPrice > price) {
    const formattedOriginalPrice = formatNumber(originalPrice);
    
    return (
      <Typography 
        variant={variant} 
        className={`price ${className}`}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
          ...sx 
        }}
        {...props}
      >
        <span 
          style={{ 
            textDecoration: 'line-through', 
            marginRight: '8px', 
            opacity: 0.7,
          }}
        >
          {formattedOriginalPrice} {currencySymbol}
        </span>
        <span style={{ fontWeight: 500, color: 'var(--error)' }}>
          {formattedPrice} {currencySymbol}
        </span>
      </Typography>
    );
  }
  
  return (
    <Typography 
      variant={variant} 
      className={`price ${className}`}
      sx={{ 
        fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
        ...sx
      }}
      {...props}
    >
      {formattedPrice} {currencySymbol}
    </Typography>
  );
};

export default PriceFormatter; 