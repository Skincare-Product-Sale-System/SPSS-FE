"use client";
import React, { createContext, useContext } from 'react';

// Define our skincare theme colors
export const skincareColors = {
  primary: '#4ECDC4', // Cyan primary
  light: 'rgba(78, 205, 196, 0.1)', // Light cyan for backgrounds
  medium: 'rgba(78, 205, 196, 0.3)', // Medium cyan for hover states
  dark: '#3DAFA7', // Darker cyan for text and borders
  text: '#2A7A73', // Deep cyan for text
  gradient: 'linear-gradient(to bottom, #f8f9fa, #edf7f6)', // Subtle gradient background
  white: '#FFFFFF',
  lightGrey: '#F8F9FA',
  grey: '#E9ECEF',
  darkGrey: '#6C757D',
  black: '#212529',
  error: '#FF6B6B',
  success: '#6BCB77',
  warning: '#FFD93D',
  info: '#4D96FF'
};

const ThemeContext = createContext(skincareColors);

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={skincareColors}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeColors = () => useContext(ThemeContext); 