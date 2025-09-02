import { Header } from "../components/Header.js";
import { Statistics } from "../components/Statistics.js";

export default class StatisticsPage {
  constructor() {
    this.statistics = null;
  }

  render(container) {
    const header = new Header(window.app.authManager);

    container.innerHTML = `
      ${header.render()}
      
      <main class="min-h-screen bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Page Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white">Statistics</h1>
            <p class="text-slate-400 mt-2">Analyze your store's performance and growth</p>
          </div>

          <!-- Statistics Content -->
          <div id="statistics-container"></div>
        </div>
      </main>
    `;

    this.bindEvents();
    this.initializeStatistics();
  }

  /**
   * Initialize the statistics component
   */
  initializeStatistics() {
    const user = window.app.authManager.currentUser;
    if (!user || !user.nit_store) {
      console.warn("No user or store ID available for statistics");
      this.showError("No store information available");
      return;
    }

    const container = document.getElementById("statistics-container");
    if (container) {
      this.statistics = new Statistics(user.nit_store);
      this.statistics.render(container);
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    const header = new Header(window.app.authManager);
    header.bindEvents();
  }

  /**
   * Show error state
   * @param {string} message - Error message
   */
  showError(message) {
    const container = document.getElementById("statistics-container");
    if (container) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="w-24 h-24 mx-auto mb-6 bg-red-900/20 rounded-full flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-red-400 text-3xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Error Loading Statistics</h3>
          <p class="text-slate-400 mb-6">${message}</p>
          <button class="btn-primary" onclick="window.location.hash = '#/dashboard'">
            Go to Dashboard
          </button>
        </div>
      `;
    }
  }
}
