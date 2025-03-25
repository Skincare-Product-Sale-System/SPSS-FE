import React from 'react';
import { Box, Typography, Divider, Paper, Grid } from '@mui/material';
import { useContextElement } from '@/context/Context';
import usePriceFormatter from '@/hooks/usePriceFormatter';
import PriceFormatter from '@/components/ui/helpers/PriceFormatter';

export default function PriceFormatExample() {
  // Use context for any global state
  const { addProductToCart } = useContextElement();
  
  // Use the custom hook for price formatting
  const { format, getDiscountPercent, getPriceStyle, formatNumberOnly } = usePriceFormatter();
  
  // Example product data
  const product = {
    id: 'example-1',
    name: 'Serum Vitamin C',
    price: 499000,
    originalPrice: 599000
  };
  
  // Calculate discount percentage
  const discountPercent = getDiscountPercent(product.originalPrice, product.price);
  
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" className="mb-3">
        Price Formatting Examples
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Using PriceFormatter Component (Recommended)
            </Typography>
            
            <Box mb={2}>
              <Typography variant="body2" className="mb-1">Basic price:</Typography>
              <PriceFormatter price={product.price} />
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" className="mb-1">With original price:</Typography>
              <PriceFormatter price={product.price} originalPrice={product.originalPrice} />
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" className="mb-1">Custom variant:</Typography>
              <PriceFormatter price={product.price} variant="h6" />
            </Box>
            
            <Box>
              <Typography variant="body2" className="mb-1">Custom styling:</Typography>
              <PriceFormatter price={product.price} sx={{ color: 'green', fontWeight: 'bold' }} />
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Using Context & Hook (For Advanced Cases)
            </Typography>
            
            <Box mb={2}>
              <Typography variant="body2" className="mb-1">Format string:</Typography>
              <Typography>{format(product.price)}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" className="mb-1">Discount calculation:</Typography>
              <Typography>-{discountPercent}% off</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="body2" className="mb-1">With context styles:</Typography>
              <Typography sx={getPriceStyle()}>
                {format(product.price)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" className="mb-1">Custom implementation:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  sx={{
                    textDecoration: 'line-through',
                    opacity: 0.7,
                    marginRight: 1,
                    fontFamily: 'var(--font-primary, "Roboto")',
                  }}
                >
                  {format(product.originalPrice)}
                </Typography>
                <Typography
                  sx={{
                    color: 'error.main',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-primary, "Roboto")',
                  }}
                >
                  {format(product.price)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          When to use which approach:
        </Typography>
        
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <Typography variant="body2">
              Use <code>{'<PriceFormatter>'}</code> component for most cases - consistent, simple, and follows design system
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Use <code>usePriceFormatter()</code> hook when you need more control over the formatting or UI
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              Use <code>formatPrice()</code> utility only when you just need the formatted string value
            </Typography>
          </li>
        </Box>
      </Box>
    </Paper>
  );
} 