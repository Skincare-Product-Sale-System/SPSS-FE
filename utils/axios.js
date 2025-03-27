import axios from "axios";
import { jwtDecode } from "jwt-decode";

// const baseURL = "https://localhost:44358/api";
const baseURL = "https://spssapi-hxfzbchrcafgd2hg.southeastasia-01.azurewebsites.net/api";

// Create an Axios instance
const request = axios.create({
  baseURL: baseURL,
});

let isRefreshing = false;
let failedQueue = [];

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

    if (!isRefreshing) {
      isRefreshing = true;
      const refreshToken = localStorage.getItem("refreshToken");

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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
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
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);

export default request;
