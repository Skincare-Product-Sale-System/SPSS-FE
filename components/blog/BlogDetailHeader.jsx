"use client";
import React from "react";
import Image from "next/image";
import { Box, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function BlogDetailHeader({ blog }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 6, textAlign: 'center' }}>
      <Typography 
        variant="h2" 
        component="h1" 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          color: theme.palette.text.primary,
          fontFamily: 'Playfair Display, serif'
        }}
      >
        {blog.title}
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            fontFamily: 'Roboto, sans-serif' 
          }}
        >
          <span style={{ fontWeight: 500, marginRight: '4px' }}>Tác giả:</span> {blog.author}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontFamily: 'Roboto, sans-serif' }}
        >
          {new Date(blog.lastUpdatedAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative', height: '500px', mb: 6 }}>
        <Image
          src={blog.thumbnail}
          alt={blog.title}
          fill
          style={{ objectFit: 'cover', borderRadius: '12px' }}
          priority
        />
      </Box>
      
      <Typography 
        variant="body1" 
        sx={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.8,
          color: theme.palette.text.secondary,
          maxWidth: '800px',
          margin: '0 auto',
          mb: 6,
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        {blog.blogContent}
      </Typography>
      
      <Divider sx={{ mb: 6 }} />
    </Box>
  );
} 