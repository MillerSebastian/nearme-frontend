import { Header } from "../components/Header.js";
import AuthService from "../services/auth.services.js";

export default class RegisterPage {
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
              <h2 class="text-2xl font-bold text-white">Register Store</h2>
              <p class="text-slate-400 mt-2">Create your store account in NearMe</p>
            </div>

            <form id="register-form" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="nit_store" class="block text-sm font-medium text-white mb-2">
                    Tax ID <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="nit_store"
                    name="nit_store"
                    required
                    class="input-field w-full"
                    placeholder="123456789-0"
                  />
                </div>

                <div>
                  <label for="store_name" class="block text-sm font-medium text-white mb-2">
                    Store Name <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="store_name"
                    name="store_name"
                    required
                    class="input-field w-full"
                    placeholder="My Hardware Store"
                  />
                </div>
              </div>

              <div>
                                  <label for="email" class="block text-sm font-medium text-white mb-2">
                    Email <span class="text-red-400">*</span>
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
                    Password <span class="text-red-400">*</span>
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

              <div>
                                  <label for="confirm_password" class="block text-sm font-medium text-white mb-2">
                    Confirm Password <span class="text-red-400">*</span>
                  </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  required
                  class="input-field w-full"
                  placeholder="••••••••"
                />
              </div>

              <div>
                                  <label for="address" class="block text-sm font-medium text-white mb-2">
                    Address <span class="text-red-400">*</span>
                  </label>
                <textarea
                  id="address"
                  name="address"
                  required
                  rows="2"
                  class="input-field w-full"
                  placeholder="123 Main St, Downtown, City"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="phone_number" class="block text-sm font-medium text-white mb-2">
                    Phone <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    required
                    class="input-field w-full"
                    placeholder="3001234567"
                  />
                </div>

                <div>
                  <label for="store_type" class="block text-sm font-medium text-white mb-2">
                    Store Type <span class="text-red-400">*</span>
                  </label>
                  <select
                    id="store_type"
                    name="store_type"
                    required
                    class="input-field w-full"
                  >
                    <option value="">Select type</option>
                    <option value="Hardware Store">Hardware Store</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="opening_hours" class="block text-sm font-medium text-white mb-2">
                    Opening Hours
                  </label>
                  <input
                    type="time"
                    id="opening_hours"
                    name="opening_hours"
                    class="input-field w-full"
                    value="08:00"
                  />
                </div>

                <div>
                  <label for="closing_hours" class="block text-sm font-medium text-white mb-2">
                    Closing Hours
                  </label>
                  <input
                    type="time"
                    id="closing_hours"
                    name="closing_hours"
                    class="input-field w-full"
                    value="18:00"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="w-full btn-primary flex justify-center py-3"
                id="register-btn"
              >
                <span class="flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register Store
                </span>
              </button>
            </form>

            <div class="mt-6 text-center">
              <p class="text-slate-400">
                Already have an account?
                <a href="#/login" data-route="/login" class="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Sign in here
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

    const form = document.getElementById("register-form");
    const registerBtn = document.getElementById("register-btn");
    const errorMessage = document.getElementById("error-message");
    const errorText = document.getElementById("error-text");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const password = formData.get("password");
      const confirmPassword = formData.get("confirm_password");

      // Validate password confirmation
      if (password !== confirmPassword) {
        this.showError("Passwords do not match");
        return;
      }

      // Remove confirm_password from form data
      const storeData = Object.fromEntries(formData.entries());
      delete storeData.confirm_password;

      // Show loading state
      registerBtn.innerHTML = `
        <div class="spinner mr-2"></div>
        Registering store...
      `;
      registerBtn.disabled = true;
      errorMessage.classList.add("hidden");

      try {
        let result;

        // Use AuthManager if available, otherwise use AuthService
        if (window.app && window.app.authManager) {
          result = await window.app.authManager.register(storeData);
        } else {
          result = await this.authService.registerStore(storeData);

          // Store user data and token for AuthService
          if (result.success && result.user) {
            localStorage.setItem("currentUser", JSON.stringify(result.user));
          }
          if (result.success && result.token) {
            localStorage.setItem("authToken", result.token);
          }
        }

        if (result.success) {
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
        registerBtn.innerHTML = `
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Register Store
          </span>
        `;
        registerBtn.disabled = false;
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
