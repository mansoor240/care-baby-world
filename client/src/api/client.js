import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  // Attach admin token if present
  const adminToken = localStorage.getItem("tn_admin_token");
  // Attach customer token if present
  const customerToken = localStorage.getItem("tn_customer_token");

  // Prefer customer token on /customers/ and /orders/ routes
  const url = config.url || "";
  if (url.startsWith("/customers/") && customerToken) {
    config.headers.Authorization = `Bearer ${customerToken}`;
  } else if (url.startsWith("/admin/") && adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  } else if (url.startsWith("/orders") && customerToken) {
    // Send customer token on order creation (so order links to customer)
    config.headers.Authorization = `Bearer ${customerToken}`;
  } else if (adminToken) {
    // Default: use admin token
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

export default api;