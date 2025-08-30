import { Header } from "../components/Header.js";
import AuthService from "../services/auth.services.js";

export default class LoginPage {
  constructor() {
    // Initialize auth service
    this.authService = new AuthService();
  }

  render(container) {
    const header = new Header(window.app.authManager);

    container.innerHTML = `
      ${header.render()}
      
      <main class="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full">
          <div class="card">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-white">Sign In</h2>
              <p class="text-slate-400 mt-2">Access your store account</p>
            </div>

            <form id="login-form" class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  class="input-field w-full"
                  placeholder="store@example.com"
                />
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  class="input-field w-full"
                  placeholder="••••••••"
                />
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-800"
                  />
                  <label for="remember" class="ml-2 block text-sm text-slate-300">
                    Remember session
                  </label>
                </div>

                <div class="text-sm">
                  <a href="#" class="text-blue-400 hover:text-blue-300 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                class="w-full btn-primary flex justify-center py-3"
                id="login-btn"
              >
                <span class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </span>
              </button>
            </form>

            <div class="mt-6 text-center">
              <p class="text-slate-400">
                Don't have an account?
                <a href="#/register" data-route="/register" class="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Sign up here
                </a>
              </p>
            </div>

            <!-- Error Message -->
            <div id="error-message" class="hidden mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-red-300 text-sm" id="error-text"></span>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const header = new Header(window.app.authManager);
    header.bindEvents();

    const form = document.getElementById("login-form");
    const loginBtn = document.getElementById("login-btn");
    const errorMessage = document.getElementById("error-message");
    const errorText = document.getElementById("error-text");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const email = formData.get("email");
      const password = formData.get("password");

      // Show loading state
      loginBtn.innerHTML = `
        <div class="spinner mr-2"></div>
        Signing in...
      `;
      loginBtn.disabled = true;
      errorMessage.classList.add("hidden");

      try {
        const result = await this.authService.loginStore(email, password);

        if (result.success) {
          // Store user data and token
          if (result.user) {
            localStorage.setItem("currentUser", JSON.stringify(result.user));
          }
          if (result.token) {
            localStorage.setItem("authToken", result.token);
          }

          // Redirect to dashboard
          if (window.app && window.app.router) {
            window.app.router.navigate("/dashboard");
          } else {
            window.location.hash = "#/dashboard";
          }
        } else {
          this.showError(result.message);
        }
      } catch (error) {
        this.showError("Connection error. Please try again.");
      } finally {
        // Reset button
        loginBtn.innerHTML = `
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </span>
        `;
        loginBtn.disabled = false;
      }
    });
  }

  showError(message) {
    const errorMessage = document.getElementById("error-message");
    const errorText = document.getElementById("error-text");

    errorText.textContent = message;
    errorMessage.classList.remove("hidden");
  }
}
