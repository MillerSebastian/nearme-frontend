class StatisticsService {
  constructor() {
    this.apiUrl =
      window.app?.authManager?.apiUrl || "http://localhost:3000/api";
  }

  /**
   * Create or update daily statistics for a store
   * @param {Object} statsData - Statistics data
   * @returns {Promise<Object>} Response from the API
   */
  async createOrUpdateStats(statsData) {
    try {
      const response = await fetch(`${this.apiUrl}/store-statistics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.app.authManager.getToken()}`,
        },
        body: JSON.stringify(statsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create/update statistics"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating/updating statistics:", error);
      throw error;
    }
  }

  /**
   * Get statistics for a specific store
   * @param {string} storeId - Store NIT
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Statistics data
   */
  async getStoreStatistics(storeId, options = {}) {
    try {
      const {
        start_date,
        end_date,
        period = "all",
        page = 1,
        limit = 30,
      } = options;

      const params = new URLSearchParams({
        period,
        page: page.toString(),
        limit: limit.toString(),
      });

      if (start_date) {
        params.append("start_date", start_date);
      }
      if (end_date) {
        params.append("end_date", end_date);
      }

      const response = await fetch(
        `${this.apiUrl}/store-statistics/store/${storeId}?${params}`,
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
      console.error("Error fetching store statistics:", error);
      throw error;
    }
  }

  /**
   * Get aggregated statistics summary for a store
   * @param {string} storeId - Store NIT
   * @param {string} period - Time period (today, week, month, year, all)
   * @returns {Promise<Object>} Summary statistics data
   */
  async getStoreSummary(storeId, period = "month") {
    try {
      const response = await fetch(
        `${this.apiUrl}/store-statistics/store/${storeId}/summary?period=${period}`,
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
          errorData.message || "Failed to fetch summary statistics"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching summary statistics:", error);
      throw error;
    }
  }

  /**
   * Get global statistics across all stores
   * @param {string} period - Time period (today, week, month, year, all)
   * @returns {Promise<Object>} Global statistics data
   */
  async getGlobalStatistics(period = "month") {
    try {
      const response = await fetch(
        `${this.apiUrl}/store-statistics/global?period=${period}`,
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
   * Update specific statistics for a store and date
   * @param {string} storeId - Store NIT
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {Object} statsData - Statistics data to update
   * @returns {Promise<Object>} Response from the API
   */
  async updateSpecificStats(storeId, date, statsData) {
    try {
      const response = await fetch(
        `${this.apiUrl}/store-statistics/store/${storeId}/date/${date}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.app.authManager.getToken()}`,
          },
          body: JSON.stringify(statsData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update statistics");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating specific statistics:", error);
      throw error;
    }
  }

  /**
   * Delete statistics for a specific store and date
   * @param {string} storeId - Store NIT
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise<Object>} Response from the API
   */
  async deleteStats(storeId, date) {
    try {
      const response = await fetch(
        `${this.apiUrl}/store-statistics/store/${storeId}/date/${date}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${window.app.authManager.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete statistics");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting statistics:", error);
      throw error;
    }
  }

  /**
   * Helper method to record daily statistics
   * @param {string} storeId - Store NIT
   * @param {Object} dailyStats - Daily statistics data
   */
  async recordDailyStats(storeId, dailyStats) {
    const today = new Date().toISOString().split("T")[0];

    const statsData = {
      store_id: storeId,
      date: today,
      ...dailyStats,
    };

    try {
      await this.createOrUpdateStats(statsData);
    } catch (error) {
      console.error("Failed to record daily stats:", error);
    }
  }

  /**
   * Format number for display
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  }

  /**
   * Format percentage for display
   * @param {number} num - Number to format as percentage
   * @returns {string} Formatted percentage
   */
  formatPercentage(num) {
    return (num * 100).toFixed(1) + "%";
  }

  /**
   * Format duration for display
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  formatDuration(seconds) {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else {
      return `${Math.round(seconds / 3600)}h`;
    }
  }

  /**
   * Get period label for display
   * @param {string} period - Period identifier
   * @returns {string} Human-readable period label
   */
  getPeriodLabel(period) {
    const labels = {
      today: "Today",
      week: "This Week",
      month: "This Month",
      year: "This Year",
      all: "All Time",
    };
    return labels[period] || period;
  }

  /**
   * Calculate growth percentage
   * @param {number} current - Current value
   * @param {number} previous - Previous value
   * @returns {number} Growth percentage
   */
  calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
}

export default StatisticsService;
