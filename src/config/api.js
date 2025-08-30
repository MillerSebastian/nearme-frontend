// API Configuration
export const API_CONFIG = {
  // Base URL for the API
  baseUrl: process.env.VITE_API_URL || "http://localhost:3000/api",

  // API endpoints
  endpoints: {
    // Authentication
    login: "/stores/login",
    register: "/stores/register",
    logout: "/stores/logout",

    // Stores
    stores: "/stores",
    storeProducts: (nitStore) => `/stores/${nitStore}/products`,
    storeViews: (nitStore) => `/stores/${nitStore}/views`,

    // Products
    products: "/products",
    product: (id) => `/products/${id}`,
  },

  // Request headers
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    ...API_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
