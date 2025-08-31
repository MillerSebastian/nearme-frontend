export class Header {
  constructor(authManager) {
    this.authManager = authManager;
  }

  render() {
    const isAuthenticated = this.authManager?.isAuthenticated() || false;
    const currentUser = this.authManager?.currentUser;

    return `
      <header class="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center">
              <a href="#/" data-route="/" class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="text-xl font-bold text-white">NearMe</span>
              </a>
            </div>

            <!-- Navigation -->
            <nav class="hidden md:flex items-center space-x-8">
              <a href="#/" data-route="/" class="text-slate-300 hover:text-white transition-colors">
                Home
              </a>
              ${
                isAuthenticated
                  ? `
                <a href="#/dashboard" data-route="/dashboard" class="text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </a>
                <a href="#/products/upload" data-route="/products/upload" class="text-slate-300 hover:text-white transition-colors">
                  Upload Products
                </a>
              `
                  : ""
              }
            </nav>

            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              ${
                isAuthenticated
                  ? `
                <div class="flex items-center space-x-3">
                  <div class="text-right">
                    <div class="text-sm font-medium text-white">${
                      currentUser?.store_name || "Store"
                    }</div>
                    <div class="text-xs text-slate-400">${
                      currentUser?.email || ""
                    }</div>
                  </div>
                  <button id="logout-btn" class="btn-outline text-sm">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              `
                  : `
                <a href="#/login" data-route="/login" class="text-slate-300 hover:text-white transition-colors">
                  Sign In
                </a>
                <a href="#/register" data-route="/register" class="btn-primary">
                  Register Store
                </a>
              `
              }
            </div>
          </div>
        </div>
      </header>
    `;
  }

  bindEvents() {
    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn && this.authManager) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.authManager.logout();
      });
    }
  }
}
