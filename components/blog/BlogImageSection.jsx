"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";

export default function BlogImageSection({ section }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 5 }}>
      <Box 
        sx={{ 
          position: 'relative', 
          height: '400px',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <Image
          src={section.content}
          alt="Hình ảnh bài viết"
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>
      {section.subtitle && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1.5,
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
            textAlign: 'center',
            fontFamily: 'Roboto, sans-serif'
          }}
        >
          {section.subtitle}
        </Typography>
      )}
    </Box>
  );
} 