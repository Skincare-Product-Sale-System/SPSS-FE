"use client";

import { useSearchParams as useNextSearchParams } from 'next/navigation';

// Safe wrapper for useSearchParams that can be used in client components
// This function is meant to be used by components that need useSearchParams
export function useSearchParams() {
  return useNextSearchParams();
}

// Helper function to extract params from useSearchParams 
export function getParamValue(searchParams, key, defaultValue = null) {
  if (!searchParams) return defaultValue;
  const value = searchParams.get(key);
  return value || defaultValue;
}

// Helper to update search params in the URL
export function updateSearchParams(router, searchParams, updates) {
  const params = new URLSearchParams(searchParams.toString());
  
  // Apply updates
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value.toString());
    }
  });
  
  // Push the new URL
  router.push(`?${params.toString()}`);
  
  return params;
} 