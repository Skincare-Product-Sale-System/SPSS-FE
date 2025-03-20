"use client";

// Kiểm tra xem code có đang chạy ở browser không
export const isBrowser = () => typeof window !== 'undefined';

// Lấy dữ liệu từ localStorage
export const getItem = (key, defaultValue = null) => {
  if (!isBrowser()) return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Lưu dữ liệu vào localStorage
export const setItem = (key, value) => {
  if (!isBrowser()) return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} to localStorage:`, error);
    return false;
  }
};

// Xóa dữ liệu từ localStorage
export const removeItem = (key) => {
  if (!isBrowser()) return;
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

// Kiểm tra có item trong localStorage không
export const hasItem = (key) => {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(key) !== null;
};

// Lấy tất cả keys bắt đầu bằng tiền tố
export const getKeysByPrefix = (prefix) => {
  if (!isBrowser()) return [];
  
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      keys.push(key);
    }
  }
  return keys;
};

// Custom hook để sử dụng localStorage trong React components
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    return getItem(key, initialValue);
  });

  const setValue = (value) => {
    // Lưu state mới
    setStoredValue(value);
    // Lưu vào localStorage
    setItem(key, value);
  };

  return [storedValue, setValue];
}; 