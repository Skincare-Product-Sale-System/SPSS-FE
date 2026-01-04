import axios from "axios";
import { jwtDecode } from "jwt-decode";

// API Base URL - sử dụng environment variable hoặc fallback về production URL
const baseURL = process.env.NEXT_PUBLIC_API_URL || "https://spssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net/api";

// Create an Axios instance
const request = axios.create({
  baseURL: baseURL,
});

let isRefreshing = false;
let failedQueue = [];
let isRedirecting = false;

// Helper để kiểm tra có đang ở trang guest (không cần auth) không
const isGuestPage = () => {
  if (typeof window === "undefined") return false;
  const guestPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  return guestPaths.some((path) => window.location.pathname.startsWith(path));
};

// Helper để redirect an toàn về login (tránh infinite loop)
const safeRedirectToLogin = () => {
  if (typeof window === "undefined") return;
  if (isRedirecting) return;
  if (isGuestPage()) return; // Không redirect nếu đang ở trang login/register
  
  isRedirecting = true;
  // Xóa tất cả auth data
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("auth"); // Zustand persist key
  
  window.location.href = "/login";
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor to add Authorization header if accessToken exists
request.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") return config;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return config;

    const decodedToken = jwtDecode(accessToken);
    const isExpired = decodedToken.exp < Date.now() / 1000;

    if (!isExpired) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }

    // Token expired, kiểm tra refreshToken trước khi cố gắng refresh
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      // Không có refresh token, xóa access token và tiếp tục (không redirect)
      localStorage.removeItem("accessToken");
      return config;
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const response = await axios.post(`${baseURL}/authentications/refresh`, {
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        
        return config;
      } catch (error) {
        processQueue(error, null);
        // Sử dụng safeRedirectToLogin thay vì redirect trực tiếp
        safeRedirectToLogin();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then(token => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If token refresh is already in progress, wait for it
    if (isRefreshing) {
      try {
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return request(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    // Mark request as retried
    originalRequest._retry = true;

    // Try to refresh token
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      // Nếu không có token, không cố gắng refresh - chỉ reject error (không redirect)
      if (!accessToken || !refreshToken) {
        return Promise.reject(error);
      }

      const response = await axios.post(`${baseURL}/authentications/refresh`, {
        accessToken,
        refreshToken,
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      request.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      processQueue(null, newAccessToken);
      return request(originalRequest);
    } catch (err) {
      processQueue(err, null);
      // Sử dụng safeRedirectToLogin thay vì redirect trực tiếp
      safeRedirectToLogin();
      return Promise.reject(err);
    }
  }
);

export default request;
