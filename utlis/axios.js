import axios from "axios";
import { jwtDecode } from "jwt-decode";

// const baseURL = "http://localhost:5041/api";
const baseURL = "https://localhost:44358/api";

// Create an Axios instance
const request =
  process.env.NODE_ENV === "development"
    ? axios.create({
        baseURL: baseURL,
        httpsAgent: new (require("https").Agent)({
          rejectUnauthorized: false,
        }),
      })
    : axios.create({
        baseURL: baseURL,
      });

// Interceptor to add Authorization header if accessToken exists
request.interceptors.request.use((config) => {
  // Check if we're in a browser environment before using localStorage
  if (typeof window !== "undefined") {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    console.log("test authen ne");

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      // check if jwt token is expired
      if (decodedToken.exp < Date.now() / 1000) {
        // fetch new token
        axios
          .post(`${baseURL}/authentications/refresh`, {
            accessToken: accessToken,
            refreshToken: refreshToken,
          })
          .then((res) => {
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("refreshToken", res.data.refreshToken);
            config.headers.Authorization = `${res.data.accessToken}`;
          });
      } else {
        config.headers.Authorization = `${accessToken}`;
      }
    }
  }
  return config;
});

export default request;
