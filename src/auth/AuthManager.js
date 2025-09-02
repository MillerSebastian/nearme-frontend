import { buildApiUrl, getHeaders, API_CONFIG } from "../config/api.js";
import ActivitiesService from "../services/activities.service.js";

export class AuthManager {
  constructor() {
    this.currentUser = null;
    this.token = localStorage.getItem("nearme_token");
    this.activitiesService = new ActivitiesService();
  }

  init() {
    if (this.token) {
      this.validateToken();
    }
  }

  async validateToken() {
    try {
      // Por ahora, validamos el token verificando si el usuario existe
      const userEmail = localStorage.getItem("user_email");
      if (userEmail && this.token) {
        const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.STORES), {
          method: "GET",
          headers: getHeaders(),
        });

        if (response.ok) {
          const stores = await response.json();
          const user = stores.find((store) => store.email === userEmail);
          if (user) {
            this.currentUser = user;
            this.updateAuthState(true);
          } else {
            this.logout();
          }
        } else {
          this.logout();
        }
      } else {
        this.logout();
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      this.logout();
    }
  }

  async login(email, password) {
    try {
      // Primero obtenemos todas las tiendas para buscar el usuario
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.STORES), {
        method: "GET",
        headers: getHeaders(),
      });

      if (response.ok) {
        const stores = await response.json();
        const user = stores.find((store) => store.email === email);

        if (user) {
          // En un entorno real, aquí verificarías el password_hash
          // Por ahora, simulamos la verificación
          this.token = "jwt_token_" + Date.now();
          this.currentUser = user;

          localStorage.setItem("nearme_token", this.token);
          localStorage.setItem("user_email", user.email);
          this.updateAuthState(true);

          // Log login activity
          this.logActivity("login", `User logged in successfully`, {
            user_email: user.email,
            store_name: user.store_name,
          });

          return { success: true, user: user };
        } else {
          return { success: false, message: "Invalid credentials" };
        }
      } else {
        return { success: false, message: "Connection error" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Connection error" };
    }
  }

  async register(storeData) {
    try {
      // Preparar los datos para el endpoint de stores
      const storePayload = {
        nit_store: storeData.nit_store,
        store_name: storeData.store_name,
        address: storeData.address,
        phone_number: storeData.phone_number,
        email: storeData.email,
        password_hash: storeData.password, // En producción esto debería estar hasheado
        id_store_type: this.getStoreTypeId(storeData.store_type),
        opening_hours: storeData.opening_hours || "08:00",
        closing_hours: storeData.closing_hours || "18:00",
        note: storeData.note || "",
      };

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.STORES), {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(storePayload),
      });

      const data = await response.json();

      if (response.ok) {
        // Después del registro exitoso, hacer login automático
        return await this.login(storeData.email, storeData.password);
      } else {
        return {
          success: false,
          message: data.message || "Error registering store",
        };
      }
    } catch (error) {
      return { success: false, message: "Connection error" };
    }
  }

  getStoreTypeId(storeType) {
    // Mapeo de tipos de tienda a IDs (ajustar según tu base de datos)
    const typeMap = {
      "Hardware Store": 1,
      Supermarket: 2,
      Pharmacy: 3,
      Stationery: 4,
      Other: 5,
      // Mantener compatibilidad con nombres en español
      Ferretería: 1,
      Supermercado: 2,
      Farmacia: 3,
      Papelería: 4,
      Otro: 5,
    };
    return typeMap[storeType] || 5;
  }

  logout() {
    // Log logout activity before clearing user data
    if (this.currentUser) {
      this.logActivity("logout", `User logged out`, {
        user_email: this.currentUser.email,
        store_name: this.currentUser.store_name,
      });
    }

    this.token = null;
    this.currentUser = null;
    localStorage.removeItem("nearme_token");
    localStorage.removeItem("user_email");
    this.updateAuthState(false);

    // Redirect to home
    if (window.app && window.app.router) {
      window.app.router.navigate("/home");
    }
  }

  updateAuthState(isAuthenticated) {
    if (window.app && window.app.router) {
      window.app.router.setAuthenticated(isAuthenticated);
    }

    // Update UI elements
    this.updateNavigation(isAuthenticated);
  }

  updateNavigation(isAuthenticated) {
    const loginBtn = document.querySelector('[data-route="/login"]');
    const registerBtn = document.querySelector('[data-route="/register"]');
    const dashboardBtn = document.querySelector('[data-route="/dashboard"]');
    const logoutBtn = document.querySelector("#logout-btn");

    if (loginBtn) loginBtn.style.display = isAuthenticated ? "none" : "block";
    if (registerBtn)
      registerBtn.style.display = isAuthenticated ? "none" : "block";
    if (dashboardBtn)
      dashboardBtn.style.display = isAuthenticated ? "block" : "none";
    if (logoutBtn) logoutBtn.style.display = isAuthenticated ? "block" : "none";
  }

  getAuthHeaders() {
    return getHeaders(true);
  }

  // Get API URL for services
  get apiUrl() {
    return API_CONFIG.BASE_URL;
  }

  isAuthenticated() {
    return !!this.token && !!this.currentUser;
  }

  /**
   * Log activity (helper method)
   * @param {string} activityType - Type of activity
   * @param {string} description - Activity description
   * @param {Object} metadata - Additional metadata
   */
  async logActivity(activityType, description, metadata = {}) {
    try {
      await this.activitiesService.logCommonActivity(
        activityType,
        description,
        metadata
      );
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  }

  /**
   * Get token for API calls
   * @returns {string} JWT token
   */
  getToken() {
    return this.token;
  }
}
