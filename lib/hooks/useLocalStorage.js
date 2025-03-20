"use client";
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Trạng thái để theo dõi xem chúng ta đang ở trình duyệt chưa
  const [isClient, setIsClient] = useState(false);
  // Trạng thái để lưu giá trị
  const [storedValue, setStoredValue] = useState(initialValue);

  // Khi component được mount, đánh dấu là ở client side và lấy giá trị từ localStorage
  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error("Error reading localStorage:", error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Hàm để cập nhật cả state và localStorage
  const setValue = (value) => {
    try {
      // Cho phép value là một function như useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  };

  // Đọc giá trị từ localStorage (bổ sung để sử dụng ngoài state nếu cần)
  const getFromStorage = () => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage:", error);
      return initialValue;
    }
  };

  // Xóa giá trị khỏi localStorage
  const removeFromStorage = () => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  };

  return { value: storedValue, setValue, getFromStorage, removeFromStorage, isClient };
} 