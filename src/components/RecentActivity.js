import ActivitiesService from "../services/activities.service.js";

export class RecentActivity {
  constructor(storeId) {
    this.storeId = storeId;
    this.activitiesService = new ActivitiesService();
    this.activities = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.currentFilter = "all";
    this.currentPeriod = "all";
    this.isLoading = false;
  }

  /**
   * Render the recent activity component
   * @param {HTMLElement} container - Container element
   */
  render(container) {
    container.innerHTML = `
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-white">Recent Activity</h3>
          <div class="flex items-center space-x-2">
            <select id="activity-period-filter" class="input-field text-sm py-1 px-2">
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
            <button id="refresh-activities" class="btn-outline text-sm py-1 px-2">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        
        <!-- Activity Filters -->
        <div class="mb-4">
          <div class="flex flex-wrap gap-2">
            <button class="activity-filter-btn active" data-filter="all">
              All
            </button>
            <button class="activity-filter-btn" data-filter="product_added">
              Products
            </button>
            <button class="activity-filter-btn" data-filter="store_contacted">
              Contacts
            </button>
            <button class="activity-filter-btn" data-filter="excel_uploaded">
              Uploads
            </button>
            <button class="activity-filter-btn" data-filter="login">
              Sessions
            </button>
          </div>
        </div>

        <!-- Activity List -->
        <div id="activities-list" class="space-y-3">
          <div class="text-center py-8">
            <div class="spinner mx-auto mb-4"></div>
            <p class="text-slate-400">Loading activities...</p>
          </div>
        </div>

        <!-- Pagination -->
        <div id="activity-pagination" class="mt-6 justify-center items-center space-x-2 hidden">
          <button id="prev-page" class="btn-outline text-sm py-1 px-3" disabled>
            <i class="fas fa-chevron-left"></i>
          </button>
          <span id="page-info" class="text-slate-400 text-sm"></span>
          <button id="next-page" class="btn-outline text-sm py-1 px-3" disabled>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Empty State -->
        <div id="empty-activities" class="text-center py-8 hidden">
          <div class="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
            <i class="fas fa-history text-slate-400 text-xl"></i>
          </div>
          <p class="text-slate-400">No recent activity</p>
          <p class="text-slate-500 text-sm mt-1">Activities will appear here as you use the platform</p>
        </div>
      </div>
    `;

    this.bindEvents();
    this.loadActivities();
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Filter buttons
    document.querySelectorAll(".activity-filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filter = e.target.getAttribute("data-filter");
        this.setFilter(filter);
      });
    });

    // Period filter
    const periodFilter = document.getElementById("activity-period-filter");
    if (periodFilter) {
      periodFilter.addEventListener("change", (e) => {
        this.setPeriod(e.target.value);
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById("refresh-activities");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        this.loadActivities();
      });
    }

    // Pagination
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.loadActivities();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
          this.loadActivities();
        }
      });
    }
  }

  /**
   * Set activity filter
   * @param {string} filter - Filter type
   */
  setFilter(filter) {
    this.currentFilter = filter;
    this.currentPage = 1;

    // Update active button
    document.querySelectorAll(".activity-filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-filter") === filter) {
        btn.classList.add("active");
      }
    });

    this.loadActivities();
  }

  /**
   * Set time period filter
   * @param {string} period - Time period
   */
  setPeriod(period) {
    this.currentPeriod = period;
    this.currentPage = 1;
    this.loadActivities();
  }

  /**
   * Load activities from API
   */
  async loadActivities() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.showLoading();

    try {
      const options = {
        page: this.currentPage,
        limit: 10,
        period: this.currentPeriod,
      };

      if (this.currentFilter !== "all") {
        options.activity_type = this.currentFilter;
      }

      const data = await this.activitiesService.getRecentActivities(
        this.storeId,
        options
      );

      this.activities = data.activities || [];
      this.totalPages = data.pagination?.total_pages || 1;

      this.renderActivities();
      this.updatePagination();
    } catch (error) {
      console.error("Error loading activities:", error);
      this.showError("Failed to load activities");
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Render activities list
   */
  renderActivities() {
    const container = document.getElementById("activities-list");
    const emptyState = document.getElementById("empty-activities");

    if (!container) return;

    if (this.activities.length === 0) {
      container.classList.add("hidden");
      emptyState.classList.remove("hidden");
      return;
    }

    container.classList.remove("hidden");
    emptyState.classList.add("hidden");

    container.innerHTML = this.activities
      .map((activity) => this.renderActivityItem(activity))
      .join("");
  }

  /**
   * Render individual activity item
   * @param {Object} activity - Activity data
   * @returns {string} HTML string
   */
  renderActivityItem(activity) {
    const typeInfo = this.activitiesService.getActivityTypeInfo(
      activity.activity_type
    );
    const timeAgo = this.activitiesService.formatActivityTime(
      activity.created_at
    );
    const metadata = activity.metadata
      ? typeof activity.metadata === "string"
        ? JSON.parse(activity.metadata)
        : activity.metadata
      : {};

    return `
      <div class="flex items-start space-x-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
        <div class="flex-shrink-0">
          <div class="w-8 h-8 rounded-full ${
            typeInfo.bgColor
          } flex items-center justify-center">
            <i class="${typeInfo.icon} ${typeInfo.color} text-sm"></i>
          </div>
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-white truncate">
              ${activity.activity_description}
            </p>
            <span class="text-xs text-slate-400 ml-2 flex-shrink-0">
              ${timeAgo}
            </span>
          </div>
          
          ${this.renderActivityMetadata(metadata, activity.activity_type)}
          
          <div class="flex items-center mt-1">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-700 text-slate-300">
              ${typeInfo.label}
            </span>
            ${
              activity.ip_address
                ? `
              <span class="ml-2 text-xs text-slate-500">
                <i class="fas fa-globe mr-1"></i>
                ${activity.ip_address}
              </span>
            `
                : ""
            }
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render activity metadata
   * @param {Object} metadata - Activity metadata
   * @param {string} activityType - Activity type
   * @returns {string} HTML string
   */
  renderActivityMetadata(metadata, activityType) {
    if (!metadata || Object.keys(metadata).length === 0) {
      return "";
    }

    let metadataHtml = "";

    switch (activityType) {
      case "product_added":
      case "product_updated":
        if (metadata.product_name) {
          metadataHtml += `
            <div class="mt-1 text-xs text-slate-400">
              <i class="fas fa-box mr-1"></i>
              Product: ${metadata.product_name}
              ${
                metadata.price
                  ? ` - $${parseFloat(metadata.price).toLocaleString()}`
                  : ""
              }
            </div>
          `;
        }
        break;

      case "store_contacted":
        if (metadata.customer_name || metadata.product_name) {
          metadataHtml += `
            <div class="mt-1 text-xs text-slate-400">
              <i class="fas fa-user mr-1"></i>
              ${
                metadata.customer_name
                  ? `Customer: ${metadata.customer_name}`
                  : ""
              }
              ${
                metadata.product_name
                  ? ` - Product: ${metadata.product_name}`
                  : ""
              }
            </div>
          `;
        }
        break;

      case "excel_uploaded":
        if (metadata.products_count) {
          metadataHtml += `
            <div class="mt-1 text-xs text-slate-400">
              <i class="fas fa-file-excel mr-1"></i>
              ${metadata.products_count} products uploaded
            </div>
          `;
        }
        break;

      default:
        if (metadata.details) {
          metadataHtml += `
            <div class="mt-1 text-xs text-slate-400">
              ${metadata.details}
            </div>
          `;
        }
    }

    return metadataHtml;
  }

  /**
   * Update pagination controls
   */
  updatePagination() {
    const pagination = document.getElementById("activity-pagination");
    const prevBtn = document.getElementById("prev-page");
    const nextBtn = document.getElementById("next-page");
    const pageInfo = document.getElementById("page-info");

    if (!pagination || !prevBtn || !nextBtn || !pageInfo) return;

    if (this.totalPages <= 1) {
      pagination.classList.add("hidden");
      pagination.classList.remove("flex");
      return;
    }

    pagination.classList.remove("hidden");
    pagination.classList.add("flex");

    prevBtn.disabled = this.currentPage <= 1;
    nextBtn.disabled = this.currentPage >= this.totalPages;

    pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
  }

  /**
   * Show loading state
   */
  showLoading() {
    const container = document.getElementById("activities-list");
    const emptyState = document.getElementById("empty-activities");

    if (container) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="spinner mx-auto mb-4"></div>
          <p class="text-slate-400">Loading activities...</p>
        </div>
      `;
      container.classList.remove("hidden");
    }

    if (emptyState) {
      emptyState.classList.add("hidden");
    }
  }

  /**
   * Show error state
   * @param {string} message - Error message
   */
  showError(message) {
    const container = document.getElementById("activities-list");
    const emptyState = document.getElementById("empty-activities");

    if (container) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-900/20 rounded-full flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
          </div>
          <p class="text-red-400">${message}</p>
          <button onclick="this.closest('.card').querySelector('#refresh-activities').click()" 
                  class="mt-2 text-sm text-blue-400 hover:text-blue-300">
            Try again
          </button>
        </div>
      `;
      container.classList.remove("hidden");
    }

    if (emptyState) {
      emptyState.classList.add("hidden");
    }
  }

  /**
   * Refresh activities
   */
  refresh() {
    this.currentPage = 1;
    this.loadActivities();
  }

  /**
   * Log a new activity (helper method)
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
      // Refresh the list after logging
      this.refresh();
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  }
}
