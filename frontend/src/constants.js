export const BASE_URL =
  process.env.REACT_APP_ENVIRONMENT === "development"
    ? "http://localhost:8080"
    : "/";

export const PRODUCTS_URL = "/api/products";
