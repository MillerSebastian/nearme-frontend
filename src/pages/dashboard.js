export class Header {
  constructor(authManager) {
    this.authManager = authManager;
  }

  render() {
    const isAuthenticated = this.authManager.isAuthenticated();
    const isDashboard = window.location.hash === "#/dashboard";

    return `
      <header class="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-4">
            <div class="flex items-center space-x-8">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <span class="text-xl font-bold text-white">NearMe</span>
              </div>
              
              <div class="hidden md:flex items-center space-x-6">
                <a href="#/" data-route="/" class="text-slate-300 hover:text-white transition-colors">Inicio</a>
                ${
                  !isDashboard
                    ? `
                  <a href="#" class="text-slate-300 hover:text-white transition-colors">Características</a>
                  <a href="#" class="text-slate-300 hover:text-white transition-colors">Beneficios</a>
                  <a href="#" class="text-slate-300 hover:text-white transition-colors">Testimonios</a>
                  <a href="#" class="text-slate-300 hover:text-white transition-colors">Para Tiendas</a>
                  <a href="#/register" data-route="/register" class="text-slate-300 hover:text-white transition-colors">Registrar Tienda</a>
                `
                    : ""
                }
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              ${
                isAuthenticated
                  ? `
                <a href="#/dashboard" data-route="/dashboard" class="text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </a>
                <button id="logout-btn" class="text-slate-300 hover:text-white transition-colors">
                  Cerrar Sesión
                </button>
              `
                  : `
                <a href="#/login" data-route="/login" class="text-blue-400 hover:text-blue-300 transition-colors" id="login-link">
                  Iniciar Sesión
                </a>
                ${
                  !isDashboard
                    ? `
                  <a href="#/register" data-route="/register" class="btn-primary text-sm" id="register-link">
                    Registrarse
                  </a>
                `
                    : ""
                }
              `
              }
              
              <button class="md:hidden text-slate-300 hover:text-white" id="mobile-menu-btn">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Mobile menu -->
          <div class="md:hidden hidden" id="mobile-menu">
            <div class="px-2 pt-2 pb-3 space-y-1 border-t border-slate-700">
              <a href="#/" data-route="/" class="block text-slate-300 hover:text-white px-3 py-2 transition-colors">Inicio</a>
              ${
                !isDashboard
                  ? `
                <a href="#" class="block text-slate-300 hover:text-white px-3 py-2 transition-colors">Características</a>
                <a href="#" class="block text-slate-300 hover:text-white px-3 py-2 transition-colors">Beneficios</a>
                <a href="#" class="block text-slate-300 hover:text-white px-3 py-2 transition-colors">Testimonios</a>
                <a href="#" class="block text-slate-300 hover:text-white px-3 py-2 transition-colors">Para Tiendas</a>
                <a href="#/register" data-route="/register" class="block text-slate-300 hover:text-white px-3 py-2 transition-colors">Registrar Tienda</a>
              `
                  : ""
              }
            </div>
          </div>
        </nav>
      </header>
    `;
  }

  bindEvents() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const logoutBtn = document.getElementById("logout-btn");

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.authManager.logout();
      });
    }

    this.updateAuthState(this.authManager.isAuthenticated());
  }

  updateAuthState(isAuthenticated) {
    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const dashboardLink = document.getElementById("dashboard-link");
    const logoutBtn = document.getElementById("logout-btn");

    if (isAuthenticated) {
      if (loginLink) loginLink.classList.add("hidden");
      if (registerLink) registerLink.classList.add("hidden");
      if (dashboardLink) dashboardLink.classList.remove("hidden");
      if (logoutBtn) logoutBtn.classList.remove("hidden");
    } else {
      if (loginLink) loginLink.classList.remove("hidden");
      if (registerLink) registerLink.classList.remove("hidden");
      if (dashboardLink) dashboardLink.classList.add("hidden");
      if (logoutBtn) logoutBtn.classList.add("hidden");
    }
  }
}
