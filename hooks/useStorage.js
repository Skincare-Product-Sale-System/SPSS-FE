"use client";
import { useState, useEffect } from 'react';

export function useStorage(key, initialValue, storage = 'local') {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storageType = storage === 'local' ? localStorage : sessionStorage;
      const item = storageType.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading from storage:`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue, storage]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        const storageType = storage === 'local' ? localStorage : sessionStorage;
        storageType.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting to storage:`, error);
    }
  };

  return [storedValue, setValue];
} 