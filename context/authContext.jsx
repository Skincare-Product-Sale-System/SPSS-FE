"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import useAuthStore from './authStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const authStore = useAuthStore();
  
  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 