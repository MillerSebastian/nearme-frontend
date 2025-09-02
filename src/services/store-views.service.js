class StoreViewsService {
  constructor() {
    this.apiUrl = "http://localhost:3000/api/store-views";
  }

  /**
   * Get authentication headers
   * @returns {Object} Headers with authorization
   */
  getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Register a new contact/interaction with a store
   * @param {Object} contactData - Contact data
   * @returns {Promise<Object>} Response data
   */
  async registerContact(contactData) {
    try {
      const response = await fetch(`${this.apiUrl}`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error registering contact:", error);
      throw error;
    }
  }

  /**
   * Get statistics of store contacts by store ID
   * @param {string} storeId - Store NIT
   * @param {string} period - Time period (today, week, month, all)
   * @returns {Promise<Object>} Statistics data
   */
  async getStoreStats(storeId, period = "all") {
    try {
      const response = await fetch(
        `${this.apiUrl}/stats/${storeId}?period=${period}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting store stats:", error);
      throw error;
    }
  }

  /**
   * Get all contacts of a specific store with pagination
   * @param {string} storeId - Store NIT
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Contacts data
   */
  async getStoreContacts(storeId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const response = await fetch(
        `${this.apiUrl}/store/${storeId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting store contacts:", error);
      throw error;
    }
  }

  /**
   * Get global statistics across all stores
   * @param {string} period - Time period (today, week, month, all)
   * @returns {Promise<Object>} Global statistics
   */
  async getGlobalStats(period = "all") {
    try {
      const response = await fetch(
        `${this.apiUrl}/global-stats?period=${period}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting global stats:", error);
      throw error;
    }
  }

  /**
   * Get unique visitors for a store
   * @param {string} storeId - Store NIT
   * @param {string} period - Time period (today, week, month, all)
   * @returns {Promise<Object>} Unique visitors data
   */
  async getUniqueVisitors(storeId, period = "all") {
    try {
      const response = await fetch(
        `${this.apiUrl}/unique-visitors/${storeId}?period=${period}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting unique visitors:", error);
      throw error;
    }
  }

  /**
   * Get session analytics for a store
   * @param {string} storeId - Store NIT
   * @param {string} period - Time period (today, week, month, all)
   * @returns {Promise<Object>} Session analytics data
   */
  async getSessionAnalytics(storeId, period = "all") {
    try {
      const response = await fetch(
        `${this.apiUrl}/session-analytics/${storeId}?period=${period}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting session analytics:", error);
      throw error;
    }
  }

  /**
   * Register a visit when user views a store
   * @param {string} storeId - Store NIT
   * @param {string} contactType - Type of contact (visit, whatsapp, etc.)
   * @param {Object} additionalData - Additional metadata
   */
  async registerVisit(storeId, contactType = "visit", additionalData = {}) {
    try {
      const sessionId = this.generateSessionId();

      const contactData = {
        id_store: storeId,
        contact_type: contactType,
        contact_method: "web",
        session_id: sessionId,
        user_ip: additionalData.user_ip,
        user_agent: additionalData.user_agent,
        additional_data: additionalData,
      };

      await this.registerContact(contactData);
      console.log(`Visit registered for store ${storeId}`);
    } catch (error) {
      console.error("Error registering visit:", error);
      // Don't throw error to avoid breaking the user experience
    }
  }

  /**
   * Register a contact when user contacts a store
   * @param {string} storeId - Store NIT
   * @param {string} contactType - Type of contact (whatsapp, phone_call, email)
   * @param {Object} additionalData - Additional metadata
   */
  async registerContact(storeId, contactType, additionalData = {}) {
    try {
      const sessionId = this.generateSessionId();

      const contactData = {
        id_store: storeId,
        contact_type: contactType,
        contact_method: "web",
        session_id: sessionId,
        user_ip: additionalData.user_ip,
        user_agent: additionalData.user_agent,
        additional_data: additionalData,
      };

      await this.registerContact(contactData);
      console.log(`Contact registered for store ${storeId}: ${contactType}`);
    } catch (error) {
      console.error("Error registering contact:", error);
      // Don't throw error to avoid breaking the user experience
    }
  }

  /**
   * Generate a unique session ID
   * @returns {string} Session ID
   */
  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${random}`;
  }

  /**
   * Format contact type for display
   * @param {string} contactType - Contact type
   * @returns {string} Formatted contact type
   */
  formatContactType(contactType) {
    const types = {
      visit: "Visit",
      phone_call: "Phone Call",
      whatsapp: "WhatsApp",
      email: "Email",
      social_media: "Social Media",
      in_person: "In Person",
    };
    return types[contactType] || contactType;
  }

  /**
   * Format contact method for display
   * @param {string} contactMethod - Contact method
   * @returns {string} Formatted contact method
   */
  formatContactMethod(contactMethod) {
    const methods = {
      web: "Web",
      mobile_app: "Mobile App",
      api: "API",
      admin_panel: "Admin Panel",
    };
    return methods[contactMethod] || contactMethod;
  }
}

export default StoreViewsService;
