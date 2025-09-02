// API Configuration
export const API_CONFIG = {
  // Base URL for the API
  BASE_URL: import.meta.env.VITE_API_URL || "https://nearme-backend-production-b6d5.up.railway.app/api",
  baseUrl: import.meta.env.VITE_API_URL || "https://nearme-backend-production-b6d5.up.railway.app/api", // For backward compatibility

  // API endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: "/stores/login",
    REGISTER: "/stores/register",
    LOGOUT: "/stores/logout",

    // Stores
    STORES: "/stores",
    STORE_PRODUCTS: (nitStore) => `/stores/${nitStore}/products`,
    STORE_VIEWS: (nitStore) => `/stores/${nitStore}/views`,

    // Products
    PRODUCTS: "/products",
    PRODUCT: (id) => `/products/${id}`,

    // Store management
    STORE_BY_NIT: (nit) => `/stores/${nit}`,
    STORE_VIEWS_COUNT: (nit) => `/stores/${nit}/views`,
  },

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

// Helper function to build API URL (for AuthManager compatibility)
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    ...API_CONFIG.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to get headers (for AuthManager compatibility)
export const getHeaders = (includeAuth = false) => {
  const headers = { ...API_CONFIG.headers };

  if (includeAuth) {
    const token = localStorage.getItem("nearme_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};
