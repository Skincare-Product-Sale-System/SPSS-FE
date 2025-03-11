import axios from "axios";

const baseURL = "https://localhost:44358/api";

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

export default request;
