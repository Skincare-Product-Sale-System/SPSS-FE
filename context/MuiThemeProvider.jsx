"use client";
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { skincareColors } from './ThemeContext';

const theme = createTheme({
  palette: {
    primary: {
      main: skincareColors.primary,
      light: skincareColors.light,
      dark: skincareColors.dark,
    },
    secondary: {
      main: '#85715e', // Nếu bạn muốn giữ màu nâu làm màu phụ
    },
    error: {
      main: skincareColors.error,
    },
    background: {
      default: skincareColors.lightGrey,
      paper: skincareColors.white,
    },
    text: {
      primary: skincareColors.text,
      secondary: skincareColors.darkGrey,
    },
  },
  typography: {
    fontFamily: '"Poppins", "Playfair Display", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
    },
    h5: {
      fontFamily: '"Playfair Display", serif',
    },
    h6: {
      fontFamily: '"Playfair Display", serif',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export function MuiThemeProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 