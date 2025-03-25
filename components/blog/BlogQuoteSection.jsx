"use client";
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function BlogQuoteSection({ section }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 6 }}>
      {section.subtitle && (
        <Typography 
          variant="h4" 
          component="h2" 
          sx={{ 
            mb: 3, 
            color: theme.palette.primary.main,
            fontWeight: 600,
            fontFamily: 'Playfair Display, serif'
          }}
        >
          {section.subtitle}
        </Typography>
      )}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          my: 4, 
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.background.default,
          borderRadius: '4px'
        }}
      >
        <Typography 
          variant="h6" 
          component="blockquote" 
          sx={{ 
            fontStyle: 'italic',
            fontWeight: 500,
            color: theme.palette.text.primary,
            fontFamily: 'Playfair Display, serif'
          }}
        >
          {section.content}
        </Typography>
      </Paper>
    </Box>
  );
} 