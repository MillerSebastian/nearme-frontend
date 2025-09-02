import { getApiUrl, getAuthHeaders } from "../config/api.js";

class AuthService {
  constructor() {
    // API URL will be loaded from config
  }

  // Login store
  async loginStore(email, password) {
    try {
      const response = await fetch(getApiUrl("/stores/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          user: data.store || data,
          token: data.token,
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "Invalid email or password",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Connection error. Please try again.",
      };
    }
  }

  // Register store
  async registerStore(storeData) {
    try {
      const response = await fetch(getApiUrl("/stores"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          user: data.store || data,
          message: "Store registered successfully",
        };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "Error registering store",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Connection error. Please try again.",
      };
    }
  }

  // Logout
  async logout() {
    try {
      // Clear local storage or session
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("currentUser");

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false };
    }
  }
}

export default AuthService;
