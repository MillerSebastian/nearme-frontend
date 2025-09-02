import StatisticsService from "../services/statistics.service.js";
import StatisticsGeneratorService from "../services/statistics-generator.service.js";

export class Statistics {
  constructor(storeId) {
    this.storeId = storeId;
    this.statisticsService = new StatisticsService();
    this.statisticsGenerator = new StatisticsGeneratorService();
    this.currentPeriod = "month";
    this.summaryData = null;
    this.dailyData = [];
    this.isLoading = false;
  }

  /**
   * Render the statistics component
   * @param {HTMLElement} container - Container element
   */
  render(container) {
    container.innerHTML = `
      <div class="space-y-6">
        <!-- Statistics Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 class="text-2xl font-bold text-white">Store Statistics</h2>
            <p class="text-slate-400">Track your store's performance and growth</p>
          </div>
          
          <div class="flex items-center space-x-3">
            <select id="statistics-period-filter" class="input-field text-sm py-2 px-3">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month" selected>This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button id="generate-statistics" class="btn-primary text-sm py-2 px-3">
              <i class="fas fa-chart-line mr-1"></i>
              Generate Stats
            </button>
            <button id="refresh-contacts" class="btn-outline text-sm py-2 px-3">
              <i class="fas fa-phone mr-1"></i>
              Refresh Contacts
            </button>
            <button id="refresh-statistics" class="btn-outline text-sm py-2 px-3">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div id="summary-cards" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="text-center py-8">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-slate-400">Loading statistics...</p>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Views Chart -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-white">Views & Visitors</h3>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span class="text-sm text-slate-400">Views</span>
                <div class="w-3 h-3 bg-green-500 rounded-full ml-4"></div>
                <span class="text-sm text-slate-400">Visitors</span>
              </div>
            </div>
            <div id="views-chart" class="h-64 flex items-center justify-center">
              <div class="text-center">
                <div class="spinner mx-auto mb-4"></div>
                <p class="text-slate-400">Loading chart...</p>
              </div>
            </div>
          </div>

          <!-- Activity Chart -->
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-white">Product Activity</h3>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-sm text-slate-400">Added</span>
                <div class="w-3 h-3 bg-blue-500 rounded-full ml-4"></div>
                <span class="text-sm text-slate-400">Updated</span>
                <div class="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
                <span class="text-sm text-slate-400">Deleted</span>
              </div>
            </div>
            <div id="activity-chart" class="h-64 flex items-center justify-center">
              <div class="text-center">
                <div class="spinner mx-auto mb-4"></div>
                <p class="text-slate-400">Loading chart...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Engagement Metrics -->
          <div class="card">
            <h3 class="text-lg font-medium text-white mb-4">Engagement</h3>
            <div id="engagement-metrics" class="space-y-4">
              <div class="text-center py-8">
                <div class="spinner mx-auto mb-4"></div>
                <p class="text-slate-400">Loading metrics...</p>
              </div>
            </div>
          </div>

          <!-- Contact Metrics -->
          <div class="card">
            <h3 class="text-lg font-medium text-white mb-4">Customer Contacts</h3>
            <div id="contact-metrics" class="space-y-4">
              <div class="text-center py-8">
                <div class="spinner mx-auto mb-4"></div>
                <p class="text-slate-400">Loading metrics...</p>
              </div>
            </div>
          </div>

          <!-- Session Metrics -->
          <div class="card">
            <h3 class="text-lg font-medium text-white mb-4">Sessions</h3>
            <div id="session-metrics" class="space-y-4">
              <div class="text-center py-8">
                <div class="spinner mx-auto mb-4"></div>
                <p class="text-slate-400">Loading metrics...</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily Breakdown Table -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-medium text-white">Daily Breakdown</h3>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-slate-400">Period:</span>
              <span id="current-period-label" class="text-sm font-medium text-blue-400">This Month</span>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Views</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Visitors</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contacts</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Products</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Bounce Rate</th>
                </tr>
              </thead>
              <tbody id="daily-breakdown-body" class="divide-y divide-slate-700">
                <tr>
                  <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                    <div class="spinner mx-auto mb-4"></div>
                    Loading daily data...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div id="empty-statistics" class="text-center py-12 hidden">
          <div class="w-24 h-24 mx-auto mb-6 bg-slate-700 rounded-full flex items-center justify-center">
            <i class="fas fa-chart-line text-slate-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">No Statistics Available</h3>
          <p class="text-slate-400 mb-6">Start using your store to see detailed statistics and insights.</p>
          <button class="btn-primary" onclick="window.location.hash = '#/dashboard'">
            Go to Dashboard
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
    this.loadStatistics();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Period filter
    const periodFilter = document.getElementById("statistics-period-filter");
    if (periodFilter) {
      periodFilter.addEventListener("change", (e) => {
        this.setPeriod(e.target.value);
      });
    }

    // Generate statistics button
    const generateBtn = document.getElementById("generate-statistics");
    if (generateBtn) {
      generateBtn.addEventListener("click", () => {
        this.generateStatistics();
      });
    }

    // Refresh contacts button
    const refreshContactsBtn = document.getElementById("refresh-contacts");
    if (refreshContactsBtn) {
      refreshContactsBtn.addEventListener("click", () => {
        this.refreshContacts();
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById("refresh-statistics");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.loadStatistics();
      });
    }
  }

  /**
   * Set time period filter
   * @param {string} period - Time period
   */
  setPeriod(period) {
    this.currentPeriod = period;
    this.loadStatistics();
  }

  /**
   * Load statistics from API
   */
  async loadStatistics() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      const [summaryData, realContactStats] = await Promise.all([
        this.statisticsService.getStoreSummary(
          this.storeId,
          this.currentPeriod
        ),
        this.statisticsGenerator.getRealContactStats(
          this.storeId,
          this.currentPeriod
        ),
      ]);

      this.summaryData = summaryData.summary;
      this.dailyData = summaryData.daily_breakdown || [];

      // Override contact data with real data
      if (realContactStats && realContactStats.total_contacts > 0) {
        this.summaryData.total_contacts = realContactStats.total_contacts;
        console.log("Real contact stats loaded:", realContactStats);
      }

      this.renderSummaryCards();
      this.renderCharts();
      this.renderMetrics();
      this.renderDailyBreakdown();
      this.updatePeriodLabel();

      // Hide empty state if we have data
      if (this.summaryData && Object.keys(this.summaryData).length > 0) {
        document.getElementById("empty-statistics").classList.add("hidden");
      } else {
        this.showEmptyState();
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
      this.showError("Failed to load statistics");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Render summary cards
   */
  renderSummaryCards() {
    const container = document.getElementById("summary-cards");
    if (!container || !this.summaryData) return;

    const cards = [
      {
        title: "Total Views",
        value: this.statisticsService.formatNumber(
          this.summaryData.total_views || 0
        ),
        icon: "fas fa-eye",
        color: "blue",
        bgColor: "bg-blue-600/20",
        textColor: "text-blue-400",
      },
      {
        title: "Unique Visitors",
        value: this.statisticsService.formatNumber(
          this.summaryData.total_unique_visitors || 0
        ),
        icon: "fas fa-users",
        color: "green",
        bgColor: "bg-green-600/20",
        textColor: "text-green-400",
      },
      {
        title: "Customer Contacts",
        value: this.statisticsService.formatNumber(
          this.summaryData.total_contacts || 0
        ),
        icon: "fas fa-phone",
        color: "yellow",
        bgColor: "bg-yellow-600/20",
        textColor: "text-yellow-400",
      },
      {
        title: "Products Added",
        value: this.statisticsService.formatNumber(
          this.summaryData.total_products_added || 0
        ),
        icon: "fas fa-plus-circle",
        color: "purple",
        bgColor: "bg-purple-600/20",
        textColor: "text-purple-400",
      },
    ];

    container.innerHTML = cards
      .map(
        (card) => `
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 rounded-full ${card.bgColor}">
            <i class="${card.icon} ${card.textColor} text-xl"></i>
          </div>
          <div class="ml-4">
            <h3 class="text-2xl font-bold text-white">${card.value}</h3>
            <p class="text-slate-400 text-sm">${card.title}</p>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  /**
   * Render charts (simplified version without Chart.js for now)
   */
  renderCharts() {
    this.renderViewsChart();
    this.renderActivityChart();
  }

  /**
   * Render views chart
   */
  renderViewsChart() {
    const container = document.getElementById("views-chart");
    if (!container || !this.dailyData.length) {
      container.innerHTML = `
        <div class="text-center">
          <i class="fas fa-chart-line text-slate-400 text-4xl mb-4"></i>
          <p class="text-slate-400">No data available for the selected period</p>
        </div>
      `;
      return;
    }

    // Get last 7 days of data
    const last7Days = this.dailyData.slice(-7);

    // Calculate max values with proper scaling
    const maxViews = Math.max(...last7Days.map((d) => d.total_views || 0), 1);
    const maxVisitors = Math.max(
      ...last7Days.map((d) => d.unique_visitors || 0),
      1
    );
    const maxValue = Math.max(maxViews, maxVisitors, 1);

    // Debug log
    console.log("Views Chart Data:", {
      last7Days: last7Days.map((d) => ({
        date: d.date,
        views: d.total_views,
        visitors: d.unique_visitors,
      })),
      maxViews,
      maxVisitors,
      maxValue,
    });

    // Use a fixed chart height and ensure bars never exceed it
    const chartHeight = 160; // Fixed height in pixels
    const maxBarHeight = chartHeight - 20; // Leave 20px padding at top

    container.innerHTML = `
      <div class="w-full h-full">
        <!-- Chart Area with fixed height -->
        <div class="flex items-end justify-between space-x-2 mb-4" style="height: ${chartHeight}px;">
          ${last7Days
            .map((day) => {
              // Calculate heights ensuring they never exceed maxBarHeight
              const viewsHeight = Math.min(
                Math.max(((day.total_views || 0) / maxValue) * maxBarHeight, 6),
                maxBarHeight
              );
              const visitorsHeight = Math.min(
                Math.max(
                  ((day.unique_visitors || 0) / maxValue) * maxBarHeight,
                  6
                ),
                maxBarHeight
              );

              return `
                <div class="flex flex-col items-center space-y-2 flex-1">
                  <div class="w-full flex flex-col space-y-1 items-center">
                    <!-- Views Bar -->
                    <div 
                      class="bg-blue-500 rounded-t w-8 transition-all duration-300 hover:bg-blue-400" 
                      style="height: ${viewsHeight}px; max-height: ${maxBarHeight}px;"
                      title="Views: ${day.total_views || 0}"
                    ></div>
                    <!-- Visitors Bar -->
                    <div 
                      class="bg-green-500 rounded-b w-8 transition-all duration-300 hover:bg-green-400" 
                      style="height: ${visitorsHeight}px; max-height: ${maxBarHeight}px;"
                      title="Visitors: ${day.unique_visitors || 0}"
                    ></div>
                  </div>
                  <!-- Date Label -->
                  <span class="text-xs text-slate-400 text-center leading-tight">
                    ${new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              `;
            })
            .join("")}
        </div>
        
        <!-- Legend -->
        <div class="flex justify-center space-x-6 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded"></div>
            <span class="text-slate-300">Views</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded"></div>
            <span class="text-slate-300">Visitors</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render activity chart
   */
  renderActivityChart() {
    const container = document.getElementById("activity-chart");
    if (!container || !this.summaryData) {
      container.innerHTML = `
        <div class="text-center">
          <i class="fas fa-chart-bar text-slate-400 text-4xl mb-4"></i>
          <p class="text-slate-400">No activity data available</p>
        </div>
      `;
      return;
    }

    const added = this.summaryData.total_products_added || 0;
    const updated = this.summaryData.total_products_updated || 0;
    const deleted = this.summaryData.total_products_deleted || 0;
    const totalActivity = added + updated + deleted;

    // Debug log
    console.log("Product Activity Data:", {
      added,
      updated,
      deleted,
      totalActivity,
    });

    if (totalActivity === 0) {
      container.innerHTML = `
        <div class="text-center">
          <i class="fas fa-chart-bar text-slate-400 text-4xl mb-4"></i>
          <p class="text-slate-400">No product activity for this period</p>
        </div>
      `;
      return;
    }

    // Calculate percentages with better logic
    let addedPercent = (added / totalActivity) * 100;
    let updatedPercent = (updated / totalActivity) * 100;
    let deletedPercent = (deleted / totalActivity) * 100;

    // Ensure minimum visibility for non-zero values
    if (added > 0 && addedPercent < 8) addedPercent = 8;
    if (updated > 0 && updatedPercent < 8) updatedPercent = 8;
    if (deleted > 0 && deletedPercent < 8) deletedPercent = 8;

    // Recalculate total to ensure it adds up to 100%
    const totalPercent = addedPercent + updatedPercent + deletedPercent;
    if (totalPercent > 100) {
      const scale = 100 / totalPercent;
      addedPercent *= scale;
      updatedPercent *= scale;
      deletedPercent *= scale;
    }

    // Calculate stroke dash arrays (circumference = 2 * π * r = 2 * π * 40 = 251.2)
    const circumference = 251.2;
    const addedDash = (addedPercent / 100) * circumference;
    const updatedDash = (updatedPercent / 100) * circumference;
    const deletedDash = (deletedPercent / 100) * circumference;

    container.innerHTML = `
      <div class="w-full h-full flex items-center justify-center">
        <div class="w-48 h-48 relative">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <!-- Background circle -->
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#374151"
              stroke-width="12"
            />
            <!-- Added products (green) -->
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10b981"
              stroke-width="12"
              stroke-dasharray="${addedDash} ${circumference}"
              stroke-dashoffset="0"
              stroke-linecap="round"
            />
            <!-- Updated products (blue) -->
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#3b82f6"
              stroke-width="12"
              stroke-dasharray="${updatedDash} ${circumference}"
              stroke-dashoffset="${-addedDash}"
              stroke-linecap="round"
            />
            <!-- Deleted products (red) -->
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#ef4444"
              stroke-width="12"
              stroke-dasharray="${deletedDash} ${circumference}"
              stroke-dashoffset="${-(addedDash + updatedDash)}"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-2xl font-bold text-white">${totalActivity}</div>
              <div class="text-xs text-slate-400">Total</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render performance metrics
   */
  renderMetrics() {
    this.renderEngagementMetrics();
    this.renderContactMetrics();
    this.renderSessionMetrics();
  }

  /**
   * Render engagement metrics
   */
  renderEngagementMetrics() {
    const container = document.getElementById("engagement-metrics");
    if (!container || !this.summaryData) return;

    const bounceRate = this.summaryData.avg_bounce_rate || 0;
    const avgDuration = this.summaryData.avg_session_duration || 0;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-slate-400">Bounce Rate</span>
          <span class="text-white font-medium">${this.statisticsService.formatPercentage(
            bounceRate
          )}</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-2">
          <div 
            class="bg-red-500 h-2 rounded-full transition-all duration-300" 
            style="width: ${bounceRate * 100}%"
          ></div>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-slate-400">Avg. Session</span>
          <span class="text-white font-medium">${this.statisticsService.formatDuration(
            avgDuration
          )}</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-2">
          <div 
            class="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style="width: ${Math.min((avgDuration / 300) * 100, 100)}%"
          ></div>
        </div>
      </div>
    `;
  }

  /**
   * Render contact metrics
   */
  renderContactMetrics() {
    const container = document.getElementById("contact-metrics");
    if (!container || !this.summaryData) return;

    const totalContacts = this.summaryData.total_contacts || 0;
    const totalVisitors = this.summaryData.total_unique_visitors || 0;
    const contactRate = totalVisitors > 0 ? totalContacts / totalVisitors : 0;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-slate-400">Total Contacts</span>
          <span class="text-white font-medium">${this.statisticsService.formatNumber(
            totalContacts
          )}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-slate-400">Contact Rate</span>
          <span class="text-white font-medium">${this.statisticsService.formatPercentage(
            contactRate
          )}</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-2">
          <div 
            class="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
            style="width: ${contactRate * 100}%"
          ></div>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-slate-400">Excel Uploads</span>
          <span class="text-white font-medium">${
            this.summaryData.total_excel_uploads || 0
          }</span>
        </div>
      </div>
    `;
  }

  /**
   * Render session metrics
   */
  renderSessionMetrics() {
    const container = document.getElementById("session-metrics");
    if (!container || !this.summaryData) return;

    const totalSessions = this.summaryData.total_login_sessions || 0;
    const daysWithData = this.summaryData.days_with_data || 1;
    const avgSessionsPerDay = totalSessions / daysWithData;

    container.innerHTML = `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-slate-400">Total Sessions</span>
          <span class="text-white font-medium">${this.statisticsService.formatNumber(
            totalSessions
          )}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-slate-400">Avg. per Day</span>
          <span class="text-white font-medium">${avgSessionsPerDay.toFixed(
            1
          )}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-slate-400">Active Days</span>
          <span class="text-white font-medium">${daysWithData}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render daily breakdown table
   */
  renderDailyBreakdown() {
    const container = document.getElementById("daily-breakdown-body");
    if (!container) return;

    if (!this.dailyData.length) {
      container.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-slate-400">
            No data available for the selected period
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = this.dailyData
      .map(
        (day) => `
      <tr class="hover:bg-slate-750">
        <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
          ${new Date(day.date).toLocaleDateString()}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
          ${this.statisticsService.formatNumber(day.total_views || 0)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-400">
          ${this.statisticsService.formatNumber(day.unique_visitors || 0)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">
          ${this.statisticsService.formatNumber(day.total_contacts || 0)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-purple-400">
          ${
            (day.products_added || 0) +
            (day.products_updated || 0) +
            (day.products_deleted || 0)
          }
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-red-400">
          ${this.statisticsService.formatPercentage(day.bounce_rate || 0)}
        </td>
      </tr>
    `
      )
      .join("");
  }

  /**
   * Update period label
   */
  updatePeriodLabel() {
    const label = document.getElementById("current-period-label");
    if (label) {
      label.textContent = this.statisticsService.getPeriodLabel(
        this.currentPeriod
      );
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    // Loading states are handled in individual components
  }

  /**
   * Show error state
   * @param {string} message - Error message
   */
  showError(message) {
    const containers = [
      "summary-cards",
      "views-chart",
      "activity-chart",
      "engagement-metrics",
      "contact-metrics",
      "session-metrics",
      "daily-breakdown-body",
    ];

    containers.forEach((id) => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = `
          <div class="text-center py-8">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
              <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
            </div>
            <p class="text-red-400">${message}</p>
            <button onclick="this.closest('.space-y-6').querySelector('#refresh-statistics').click()" 
                    class="mt-2 text-sm text-blue-400 hover:text-blue-300">
              Try again
            </button>
          </div>
        `;
      }
    });
  }

  /**
   * Show empty state
   */
  showEmptyState() {
    document.getElementById("empty-statistics").classList.remove("hidden");
  }

  /**
   * Refresh contact statistics only
   */
  async refreshContacts() {
    const refreshBtn = document.getElementById("refresh-contacts");
    if (refreshBtn) {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-1"></i>Refreshing...';
    }

    try {
      // Get real contact stats
      const realContactStats =
        await this.statisticsGenerator.getRealContactStats(
          this.storeId,
          this.currentPeriod
        );

      // Update summary data with real contact data
      if (realContactStats && realContactStats.total_contacts >= 0) {
        this.summaryData.total_contacts = realContactStats.total_contacts;
        console.log("Contact stats refreshed:", realContactStats);

        // Re-render only the summary cards to show updated contact count
        this.renderSummaryCards();

        this.showNotification(
          `Contacts refreshed! Total: ${realContactStats.total_contacts}`,
          "success"
        );
      } else {
        this.showNotification("No contact data found", "info");
      }
    } catch (error) {
      console.error("Error refreshing contacts:", error);
      this.showNotification("Error refreshing contacts", "error");
    } finally {
      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML =
          '<i class="fas fa-phone mr-1"></i>Refresh Contacts';
      }
    }
  }

  /**
   * Generate statistics from activities
   */
  async generateStatistics() {
    const generateBtn = document.getElementById("generate-statistics");
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-1"></i>Generating...';
    }

    try {
      // First try to generate from activities
      await this.statisticsGenerator.generateStatisticsFromActivities(
        this.storeId,
        this.currentPeriod
      );

      // If no activities found, generate sample data
      const result = await this.statisticsGenerator.generateSampleStatistics(
        this.storeId
      );

      this.showNotification("Statistics generated successfully!", "success");

      // Reload statistics to show new data (including real contacts)
      await this.loadStatistics();
    } catch (error) {
      console.error("Error generating statistics:", error);
      this.showNotification("Error generating statistics", "error");
    } finally {
      if (generateBtn) {
        generateBtn.disabled = false;
        generateBtn.innerHTML =
          '<i class="fas fa-chart-line mr-1"></i>Generate Stats';
      }
    }
  }

  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, info)
   */
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === "success"
        ? "bg-green-600"
        : type === "error"
        ? "bg-red-600"
        : "bg-blue-600"
    } text-white`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Refresh statistics
   */
  refresh() {
    this.loadStatistics();
  }
}
