"use client";
import React from 'react';
import FontExample from '@/components/ui/common/FontExample';
import { Container, Box, Typography, Divider, Paper, Grid } from '@mui/material';

export default function FontDemoPage() {
  return (
    <div className="font-demo-page py-5">
      <Container>
        <Box mb={5} textAlign="center">
          <Typography variant="h2" className="font-heading mb-2">
            Font Standardization Demo
          </Typography>
          <Typography variant="body1" className="font-body">
            Standardizing fonts across the SPSS Skincare Store
          </Typography>
        </Box>
        
        <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: 'var(--light-grey)' }}>
          <Typography variant="h4" className="font-heading mb-3">
            Font Selection Rationale
          </Typography>
          
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={4}>
              <Box p={2} bgcolor="white" borderRadius={2} height="100%">
                <Typography variant="h5" className="font-heading mb-2">
                  Playfair Display
                </Typography>
                <Typography variant="body2" className="font-body mb-2">
                  An elegant serif font with excellent Vietnamese language support. Perfect for headings in a premium skincare store, providing a sophisticated and luxurious feeling.
                </Typography>
                <Typography variant="h6" className="font-heading vietnamese">
                  Chăm Sóc Da
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box p={2} bgcolor="white" borderRadius={2} height="100%">
                <Typography variant="h5" className="font-heading mb-2">
                  Be Vietnam Pro
                </Typography>
                <Typography variant="body2" className="font-body mb-2">
                  A modern sans-serif font designed specifically with Vietnamese language support in mind. Clear, readable, and contemporary for body text across all device sizes.
                </Typography>
                <Typography variant="body1" className="font-body vietnamese">
                  Chăm sóc da là điều cần thiết để duy trì làn da khỏe mạnh.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box p={2} bgcolor="white" borderRadius={2} height="100%">
                <Typography variant="h5" className="font-heading mb-2">
                  Roboto Mono
                </Typography>
                <Typography variant="body2" className="font-body mb-2">
                  A monospaced font perfect for prices and numerical data. Improves readability of prices and ensures consistent appearance of numbers across the website.
                </Typography>
                <Typography variant="body1" className="font-mono">
                  499.000 ₫
                </Typography>
                <Typography variant="body1" className="font-mono">
                  1.299.000 ₫
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Divider sx={{ my: 5 }} />
        
        <FontExample />
      </Container>
    </div>
  );
} 