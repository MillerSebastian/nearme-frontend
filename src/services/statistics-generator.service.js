import ActivitiesService from "./activities.service.js";
import StatisticsService from "./statistics.service.js";
import StoreViewsService from "./store-views.service.js";

class StatisticsGeneratorService {
  constructor() {
    this.activitiesService = new ActivitiesService();
    this.statisticsService = new StatisticsService();
    this.storeViewsService = new StoreViewsService();
  }

  /**
   * Generate statistics from activities and views for a specific store
   * @param {string} storeId - Store NIT
   * @param {string} period - Time period (today, week, month, year, all)
   * @returns {Promise<Object>} Generated statistics
   */
  async generateStatisticsFromActivities(storeId, period = "month") {
    try {
      console.log(
        `Generating statistics for store ${storeId}, period: ${period}`
      );

      // Get both activities and views data
      const [activitiesData, viewsData] = await Promise.all([
        this.activitiesService.getRecentActivities(storeId, {
          period: period,
          limit: 1000,
        }),
        this.storeViewsService.getStoreStats(storeId, period).catch(() => null),
      ]);

      const activities = activitiesData.activities || [];
      console.log(`Found ${activities.length} activities`);

      // Group activities by date
      const activitiesByDate = this.groupActivitiesByDate(activities);

      // Generate statistics for each date
      const statistics = [];
      for (const [date, dateActivities] of Object.entries(activitiesByDate)) {
        const dailyStats = this.calculateDailyStatistics(
          dateActivities,
          viewsData
        );
        statistics.push({
          store_id: storeId,
          date: date,
          ...dailyStats,
        });
      }

      // Save statistics to backend
      await this.saveStatistics(statistics);

      return {
        success: true,
        statistics_generated: statistics.length,
        period: period,
        store_id: storeId,
      };
    } catch (error) {
      console.error("Error generating statistics from activities:", error);
      throw error;
    }
  }

  /**
   * Group activities by date
   * @param {Array} activities - Array of activities
   * @returns {Object} Activities grouped by date
   */
  groupActivitiesByDate(activities) {
    const grouped = {};

    activities.forEach((activity) => {
      const date = new Date(activity.created_at).toISOString().split("T")[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(activity);
    });

    return grouped;
  }

  /**
   * Calculate daily statistics from activities and views data
   * @param {Array} activities - Activities for a specific date
   * @param {Object} viewsData - Views data from store-views API
   * @returns {Object} Daily statistics
   */
  calculateDailyStatistics(activities, viewsData = null) {
    const stats = {
      total_views: 0,
      unique_visitors: 0,
      total_contacts: 0,
      products_added: 0,
      products_updated: 0,
      products_deleted: 0,
      excel_uploads: 0,
      login_sessions: 0,
      bounce_rate: 0.0,
      avg_session_duration: 0,
    };

    // Count different activity types
    const uniqueSessions = new Set();
    const uniqueIPs = new Set();
    let totalSessionDuration = 0;
    let sessionCount = 0;

    activities.forEach((activity) => {
      // Count unique sessions and IPs
      if (activity.session_id) {
        uniqueSessions.add(activity.session_id);
      }
      if (activity.ip_address) {
        uniqueIPs.add(activity.ip_address);
      }

      // Count activity types
      switch (activity.activity_type) {
        case "product_added":
          stats.products_added++;
          break;
        case "product_updated":
          stats.products_updated++;
          break;
        case "product_deleted":
          stats.products_deleted++;
          break;
        case "excel_uploaded":
          stats.excel_uploads++;
          break;
        case "login":
          stats.login_sessions++;
          break;
        case "store_contacted":
          stats.total_contacts++;
          break;
      }
    });

    // Use real views data if available, otherwise estimate from activities
    if (viewsData && viewsData.total_contacts) {
      stats.total_views = viewsData.total_contacts;

      // Count real contacts (WhatsApp + Email + Phone calls)
      let realContacts = 0;
      if (viewsData.contacts_by_type) {
        viewsData.contacts_by_type.forEach((contact) => {
          if (
            ["whatsapp", "email", "phone_call"].includes(contact.contact_type)
          ) {
            realContacts += contact.count_by_type;
          }
        });
      }
      stats.total_contacts = realContacts;

      // Try to get unique visitors from views data
      const visitContacts = viewsData.contacts_by_type?.find(
        (contact) => contact.contact_type === "visit"
      );
      if (visitContacts) {
        stats.unique_visitors = Math.floor(visitContacts.count_by_type * 0.8);
      }
    } else {
      // Fallback: estimate from activities
      stats.total_views = Math.max(uniqueIPs.size, stats.login_sessions);
      stats.unique_visitors = uniqueIPs.size;
      // Keep the contacts count from activities (store_contacted)
    }

    // Calculate session duration (simplified estimation)
    if (uniqueSessions.size > 0) {
      // Estimate 5-15 minutes per session
      const avgSessionMinutes = 10;
      stats.avg_session_duration = avgSessionMinutes * 60; // Convert to seconds
    }

    // Calculate bounce rate (simplified: 30-70% based on activity)
    const totalActivities = activities.length;
    if (totalActivities > 0) {
      // More activities = lower bounce rate
      stats.bounce_rate = Math.max(
        0.3,
        Math.min(0.7, 0.7 - totalActivities * 0.01)
      );
    }

    return stats;
  }

  /**
   * Save statistics to backend
   * @param {Array} statistics - Array of statistics to save
   */
  async saveStatistics(statistics) {
    for (const stat of statistics) {
      try {
        await this.statisticsService.createOrUpdateStats(stat);
        console.log(`Saved statistics for ${stat.date}`);
      } catch (error) {
        console.error(`Error saving statistics for ${stat.date}:`, error);
      }
    }
  }

  /**
   * Generate and update statistics for a store
   * @param {string} storeId - Store NIT
   * @param {Array} periods - Array of periods to generate
   */
  async updateStoreStatistics(storeId, periods = ["today", "week", "month"]) {
    try {
      console.log(`Updating statistics for store ${storeId}`);

      for (const period of periods) {
        await this.generateStatisticsFromActivities(storeId, period);
      }

      return {
        success: true,
        message: `Statistics updated for store ${storeId}`,
        periods: periods,
      };
    } catch (error) {
      console.error("Error updating store statistics:", error);
      throw error;
    }
  }

  /**
   * Get real-time contact statistics for a store
   * @param {string} storeId - Store NIT
   * @param {string} period - Time period (today, week, month, all)
   * @returns {Promise<Object>} Real contact statistics
   */
  async getRealContactStats(storeId, period = "month") {
    try {
      console.log(
        `Getting real contact stats for store ${storeId}, period: ${period}`
      );

      // Get views data from store-views API
      const viewsData = await this.storeViewsService.getStoreStats(
        storeId,
        period
      );

      if (!viewsData || !viewsData.contacts_by_type) {
        return {
          total_contacts: 0,
          whatsapp_contacts: 0,
          email_contacts: 0,
          phone_contacts: 0,
          visit_contacts: 0,
        };
      }

      // Count contacts by type
      let totalContacts = 0;
      let whatsappContacts = 0;
      let emailContacts = 0;
      let phoneContacts = 0;
      let visitContacts = 0;

      viewsData.contacts_by_type.forEach((contact) => {
        const count = contact.count_by_type || 0;
        totalContacts += count;

        switch (contact.contact_type) {
          case "whatsapp":
            whatsappContacts = count;
            break;
          case "email":
            emailContacts = count;
            break;
          case "phone_call":
            phoneContacts = count;
            break;
          case "visit":
            visitContacts = count;
            break;
        }
      });

      return {
        total_contacts: totalContacts,
        whatsapp_contacts: whatsappContacts,
        email_contacts: emailContacts,
        phone_contacts: phoneContacts,
        visit_contacts: visitContacts,
        raw_data: viewsData,
      };
    } catch (error) {
      console.error("Error getting real contact stats:", error);
      return {
        total_contacts: 0,
        whatsapp_contacts: 0,
        email_contacts: 0,
        phone_contacts: 0,
        visit_contacts: 0,
        error: error.message,
      };
    }
  }

  /**
   * Generate sample statistics for demonstration
   * @param {string} storeId - Store NIT
   */
  async generateSampleStatistics(storeId) {
    try {
      // Generate data for the last 7 days
      const sampleStats = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];

        // Generate realistic data with some variation
        const baseViews = 15 + Math.floor(Math.random() * 25);
        const baseVisitors = Math.floor(
          baseViews * (0.7 + Math.random() * 0.2)
        );
        const baseContacts = Math.floor(
          baseVisitors * (0.15 + Math.random() * 0.15)
        );

        // Weekend effect (lower activity)
        const isWeekend =
          new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
        const weekendMultiplier = isWeekend ? 0.6 : 1.0;

        sampleStats.push({
          store_id: storeId,
          date: date,
          total_views: Math.floor(baseViews * weekendMultiplier),
          unique_visitors: Math.floor(baseVisitors * weekendMultiplier),
          total_contacts: Math.floor(baseContacts * weekendMultiplier),
          products_added: Math.floor(
            (2 + Math.random() * 4) * weekendMultiplier
          ),
          products_updated: Math.floor(
            (1 + Math.random() * 3) * weekendMultiplier
          ),
          products_deleted: Math.floor(
            (0 + Math.random() * 2) * weekendMultiplier
          ),
          excel_uploads: Math.random() > 0.7 ? 1 : 0,
          login_sessions: Math.floor(
            (2 + Math.random() * 4) * weekendMultiplier
          ),
          bounce_rate: 0.3 + Math.random() * 0.4, // 30-70%
          avg_session_duration: 300 + Math.floor(Math.random() * 600), // 5-15 minutes
        });
      }

      await this.saveStatistics(sampleStats);

      return {
        success: true,
        message: `Sample statistics generated for store ${storeId}`,
        statistics_created: sampleStats.length,
      };
    } catch (error) {
      console.error("Error generating sample statistics:", error);
      throw error;
    }
  }
}

export default StatisticsGeneratorService;
