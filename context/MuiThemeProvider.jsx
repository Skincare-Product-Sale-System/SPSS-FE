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
    fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
    fontSize: 16,
    h1: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontWeight: 500,
    },
    h2: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontWeight: 500,
    },
    h3: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontWeight: 500,
    },
    h4: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
    },
    subtitle1: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
    },
    subtitle2: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
    },
    button: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
      fontSize: '0.75rem',
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
          fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
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
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
        },
        h2: {
          fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
        },
        h3: {
          fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
        },
        h4: {
          fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
        },
        h5: {
          fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
        },
        h6: {
          fontFamily: 'var(--font-primary, "Roboto"), system-ui, sans-serif',
        },
      }
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'price' },
          style: {
            fontFamily: 'var(--font-mono, var(--font-roboto-mono)), monospace',
            fontWeight: 500,
          },
        },
      ],
    },
    MuiTableCell: {
      variants: [
        {
          props: { className: 'price-cell' },
          style: {
            fontFamily: 'var(--font-mono, var(--font-roboto-mono)), monospace',
            textAlign: 'right',
          },
        },
      ],
    },
  },
});

export function MuiThemeProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
} 