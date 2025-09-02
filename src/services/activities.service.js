class ActivitiesService {
  constructor() {
    this.apiUrl =
      window.app?.authManager?.apiUrl || "http://localhost:3000/api";
  }

  /**
   * Log a new activity
   * @param {Object} activityData - Activity data to log
   * @returns {Promise<Object>} Response from the API
   */
  async logActivity(activityData) {
    try {
      const response = await fetch(`${this.apiUrl}/recent-activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.app.authManager.getToken()}`,
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log activity");
      }

      return await response.json();
    } catch (error) {
      console.error("Error logging activity:", error);
      throw error;
    }
  }

  /**
   * Get recent activities for a store
   * @param {string} storeId - Store NIT
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Activities data
   */
  async getRecentActivities(storeId, options = {}) {
    try {
      const { page = 1, limit = 20, activity_type, period = "all" } = options;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        period,
      });

      if (activity_type) {
        params.append("activity_type", activity_type);
      }

      const response = await fetch(
        `${this.apiUrl}/recent-activities/store/${storeId}?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.app.authManager.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch activities");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  }

  /**
   * Get activity statistics for a store
   * @param {string} storeId - Store NIT
   * @param {string} period - Time period (today, week, month, all)
   * @returns {Promise<Object>} Statistics data
   */
  async getActivityStats(storeId, period = "all") {
    try {
      const response = await fetch(
        `${this.apiUrl}/recent-activities/stats/${storeId}?period=${period}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.app.authManager.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch statistics");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  }

  /**
   * Get session-based activities
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session activities data
   */
  async getSessionActivities(sessionId) {
    try {
      const response = await fetch(
        `${this.apiUrl}/recent-activities/session/${sessionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.app.authManager.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch session activities"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching session activities:", error);
      throw error;
    }
  }

  /**
   * Get global activity statistics
   * @param {string} period - Time period (today, week, month, all)
   * @returns {Promise<Object>} Global statistics data
   */
  async getGlobalStats(period = "all") {
    try {
      const response = await fetch(
        `${this.apiUrl}/recent-activities/global-stats?period=${period}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${window.app.authManager.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch global statistics"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching global statistics:", error);
      throw error;
    }
  }

  /**
   * Clean up old activities (admin only)
   * @param {number} days - Number of days to keep
   * @returns {Promise<Object>} Cleanup result
   */
  async cleanupOldActivities(days = 90) {
    try {
      const response = await fetch(
        `${this.apiUrl}/recent-activities/cleanup?days=${days}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${window.app.authManager.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cleanup activities");
      }

      return await response.json();
    } catch (error) {
      console.error("Error cleaning up activities:", error);
      throw error;
    }
  }

  /**
   * Helper method to log common activities
   */
  async logCommonActivity(activityType, description, metadata = {}) {
    const user = window.app.authManager.currentUser;
    if (!user) {
      console.warn("No user logged in, cannot log activity");
      return;
    }

    const activityData = {
      user_id: user.nit_store,
      activity_type: activityType,
      activity_description: description,
      metadata: metadata,
      session_id: this.getSessionId(),
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent,
    };

    try {
      await this.logActivity(activityData);
    } catch (error) {
      console.error("Failed to log common activity:", error);
    }
  }

  /**
   * Get or generate session ID
   * @returns {string} Session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem("session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      sessionStorage.setItem("session_id", sessionId);
    }
    return sessionId;
  }

  /**
   * Get client IP (simplified version)
   * @returns {Promise<string>} Client IP
   */
  async getClientIP() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return "unknown";
    }
  }

  /**
   * Activity type mappings for display
   */
  getActivityTypeInfo(activityType) {
    const typeMap = {
      product_added: {
        icon: "fas fa-plus-circle",
        color: "text-green-400",
        bgColor: "bg-green-900/20",
        label: "Product Added",
      },
      product_updated: {
        icon: "fas fa-edit",
        color: "text-blue-400",
        bgColor: "bg-blue-900/20",
        label: "Product Updated",
      },
      product_deleted: {
        icon: "fas fa-trash",
        color: "text-red-400",
        bgColor: "bg-red-900/20",
        label: "Product Deleted",
      },
      store_contacted: {
        icon: "fas fa-phone",
        color: "text-yellow-400",
        bgColor: "bg-yellow-900/20",
        label: "Store Contacted",
      },
      excel_uploaded: {
        icon: "fas fa-file-excel",
        color: "text-green-400",
        bgColor: "bg-green-900/20",
        label: "Excel Uploaded",
      },
      login: {
        icon: "fas fa-sign-in-alt",
        color: "text-blue-400",
        bgColor: "bg-blue-900/20",
        label: "Login",
      },
      logout: {
        icon: "fas fa-sign-out-alt",
        color: "text-gray-400",
        bgColor: "bg-gray-900/20",
        label: "Logout",
      },
      profile_updated: {
        icon: "fas fa-user-edit",
        color: "text-purple-400",
        bgColor: "bg-purple-900/20",
        label: "Profile Updated",
      },
      password_changed: {
        icon: "fas fa-key",
        color: "text-orange-400",
        bgColor: "bg-orange-900/20",
        label: "Password Changed",
      },
      store_info_updated: {
        icon: "fas fa-store",
        color: "text-indigo-400",
        bgColor: "bg-indigo-900/20",
        label: "Store Info Updated",
      },
    };

    return (
      typeMap[activityType] || {
        icon: "fas fa-info-circle",
        color: "text-gray-400",
        bgColor: "bg-gray-900/20",
        label: "Activity",
      }
    );
  }

  /**
   * Format activity timestamp for display
   * @param {string} timestamp - ISO timestamp
   * @returns {string} Formatted time
   */
  formatActivityTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export default ActivitiesService;
