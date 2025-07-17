"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function BlogTextSection({ section }) {
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
          className="text-primary-800 text-xl md:text-2xl lg:text-3xl mb-2"
        >
          {section.subtitle}
        </Typography>
      )}
      <Typography
        variant="body1"
        sx={{
          whiteSpace: 'pre-line',
          lineHeight: 1.8,
          fontSize: '1.05rem',
          fontFamily: 'Roboto, sans-serif'
        }}
      >
        {section.content}
      </Typography>
    </Box>
  );
} 