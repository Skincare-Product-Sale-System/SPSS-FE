"use client";

import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function ProductTitle() {
  const theme = useTheme();
  
  return (
    <>
      <Typography 
        variant="h4" 
        component="h2" 
        align="center" 
        sx={{ 
          fontFamily: theme.typography.h4.fontFamily,
          color: theme.palette.text.primary,
          mb: 2,
          fontSize: { xs: '1.75rem', md: '2.25rem' }
        }}
      >
        Sản Phẩm Bán Chạy
      </Typography>
      
      <Typography
        variant="body1"
        align="center"
        sx={{
          color: theme.palette.text.secondary,
          maxWidth: '700px',
          mx: 'auto',
          mb: 5
        }}
      >
        Khám phá các sản phẩm chăm sóc da phổ biến nhất được yêu thích bởi khách hàng
      </Typography>
    </>
  );
} 