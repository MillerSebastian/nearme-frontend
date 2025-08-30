import { Header } from "../components/Header.js";
import ProductsService from "../services/products.services.js";
import StoresService from "../services/stores.services.js";

export default class DashboardPage {
  constructor() {
    this.products = [];
    this.currentView = "overview";

    // Initialize services
    this.productsService = new ProductsService();
    this.storesService = new StoresService();
  }

  render(container) {
    const header = new Header(window.app.authManager);

    container.innerHTML = `
      ${header.render()}
      
      <main class="min-h-screen bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Page Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-white">Dashboard</h1>
            <p class="text-slate-400 mt-2">Manage your store and products</p>
          </div>

          <!-- Navigation Tabs -->
          <div class="mb-8">
            <nav class="flex space-x-8">
              <button class="nav-tab active" data-view="overview">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Overview
              </button>
              <button class="nav-tab" data-view="products">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Products
              </button>
              <button class="nav-tab" data-view="store">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0V9a1 1 0 011-1h4a1 1 0 011 1v12m-6 0h6" />
                </svg>
                My Store
              </button>
            </nav>
          </div>

          <!-- Content Area -->
          <div id="dashboard-content">
            ${this.renderOverview()}
          </div>
        </div>
      </main>
    `;

    this.bindEvents();

    // Load products after rendering
    this.loadProducts();
  }

  renderOverview() {
    const user = window.app.authManager.currentUser;

    // For now we use current user data
    // In the future you could have specific endpoints for statistics
    let stats = {
      products: this.products ? this.products.length : 0,
      views: 0,
      queries: 0,
      rating: 4.5, // Default value
    };

    // Load store views
    this.loadStoreViews().then((views) => {
      stats.views = views;
      const viewsElement = document.querySelector('[data-stat="views"]');
      if (viewsElement) {
        viewsElement.textContent = views.toLocaleString();
      }
    });

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Stats Cards -->
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-600/20">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-2xl font-bold text-white" data-stat="products">${
                stats.products
              }</h3>
              <p class="text-slate-400 text-sm">Products</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-600/20">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-2xl font-bold text-white" data-stat="views">${stats.views.toLocaleString()}</h3>
              <p class="text-slate-400 text-sm">Views</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-600/20">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-2xl font-bold text-white">${stats.queries}</h3>
              <p class="text-slate-400 text-sm">Queries</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-600/20">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-2xl font-bold text-white">${stats.rating}</h3>
              <p class="text-slate-400 text-sm">Rating</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Activity -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-medium text-white">Recent Activity</h3>
              <button class="text-blue-400 hover:text-blue-300 text-sm">View all</button>
            </div>
            
            <div id="recent-activity" class="space-y-4">
              <div class="text-center py-8">
                <p class="text-slate-400">No recent activity</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="space-y-6">
          <div class="card">
            <h3 class="text-lg font-medium text-white mb-4">Quick Actions</h3>
            
            <div class="space-y-3">
              <a href="#/products/upload" data-route="/products/upload" class="w-full btn-primary text-center block">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Products
              </a>
              
              <button class="w-full btn-secondary" onclick="document.querySelector('[data-view=\\'products\\']').click()">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
              
              <button class="w-full btn-outline">
                <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Statistics
              </button>
            </div>
          </div>

          <div class="card">
            <h3 class="text-lg font-medium text-white mb-4">Tips</h3>
            <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p class="text-blue-300 text-sm font-medium">Optimize your inventory</p>
                  <p class="text-blue-200 text-xs mt-1">
                    Regularly update your product stock to appear in more searches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async loadRecentActivity() {
    // For now we show a simple message
    // In the future you could have a specific endpoint for activity
    const activityContainer = document.getElementById("recent-activity");
    if (activityContainer) {
      activityContainer.innerHTML = `
        <div class="text-center py-8">
          <p class="text-slate-400">No recent activity</p>
        </div>
      `;
    }
  }

  renderProducts() {
    return `
      <div class="space-y-6">
        <!-- Products Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 class="text-2xl font-bold text-white">Products</h2>
            <p class="text-slate-400">Manage your product inventory</p>
          </div>
          
          <div class="flex space-x-3">
            <a href="#/products/upload" data-route="/products/upload" class="btn-secondary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Excel
            </a>
            <button class="btn-primary" id="add-product-btn">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        <!-- Search and Filters -->
        <div class="card">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                class="input-field w-full"
                id="product-search"
              />
            </div>
            <div class="flex gap-2">
              <select class="input-field" id="category-filter">
                <option value="">All categories</option>
                <option value="Ferretería">Hardware</option>
                <option value="Pintura">Paint</option>
                <option value="Electricidad">Electrical</option>
                <option value="Plomería">Plumbing</option>
                <option value="Construcción">Construction</option>
                <option value="Jardinería">Gardening</option>
                <option value="verduras">Vegetables</option>
                <option value="Electrónica">Electronics</option>
              </select>
              <button class="btn-outline">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Products Table -->
        <div class="card">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700" id="products-table-body">
                <tr>
                  <td colspan="5" class="px-6 py-8 text-center text-slate-400">
                    <div class="spinner mx-auto mb-4"></div>
                    Loading products...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Product Modal -->
        <div id="add-product-modal" class="hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-white">Add Product</h3>
              <button id="close-modal" class="text-slate-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form id="add-product-form" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-white mb-2">
                    Product Name <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    required
                    class="input-field w-full"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-white mb-2">
                    Price <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    class="input-field w-full"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-white mb-2">
                    Category <span class="text-red-400">*</span>
                  </label>
                  <select name="category" required class="input-field w-full">
                    <option value="">Select category</option>
                    <option value="Ferretería">Hardware</option>
                    <option value="Pintura">Paint</option>
                    <option value="Electricidad">Electrical</option>
                    <option value="Plomería">Plumbing</option>
                    <option value="Construcción">Construction</option>
                    <option value="Jardinería">Gardening</option>
                    <option value="verduras">Vegetables</option>
                    <option value="Electrónica">Electronics</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-white mb-2">
                    Status
                  </label>
                  <select name="sold_out" class="input-field w-full">
                    <option value="false">In Stock</option>
                    <option value="true">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-white mb-2">
                  Description
                </label>
                <textarea
                  name="product_description"
                  rows="3"
                  class="input-field w-full"
                  placeholder="Product description..."
                ></textarea>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" id="cancel-add-product" class="btn-secondary">
                  Cancel
                </button>
                <button type="submit" class="btn-primary">
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  renderProductRows() {
    if (this.products.length === 0) {
      return `
        <tr>
          <td colspan="6" class="px-6 py-8 text-center text-slate-400">
            No products registered
          </td>
        </tr>
      `;
    }

    return this.products
      .map(
        (product) => `
      <tr class="hover:bg-slate-750">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-white">${
            product.product_name
          }</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
            ${product.category}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-400">
          $${parseFloat(product.price).toLocaleString()}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
          ${product.stock}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stock > 0
              ? "bg-green-900 text-green-300"
              : "bg-red-900 text-red-300"
          }">
            ${product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex space-x-2">
            <button class="text-blue-400 hover:text-blue-300 transition-colors" onclick="editProduct(${
              product.id_product
            })">
              Edit
            </button>
            <button class="text-red-400 hover:text-red-300 transition-colors" onclick="deleteProduct(${
              product.id_product
            })">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  renderStore() {
    const user = window.app.authManager.currentUser;

    return `
      <div class="space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-white">Store Information</h2>
          <p class="text-slate-400">Manage your store data</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Store Info Form -->
          <div class="lg:col-span-2">
            <div class="card">
              <h3 class="text-lg font-medium text-white mb-6">Store Data</h3>
              
              <form id="store-form" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-white mb-2">NIT</label>
                    <input
                      type="text"
                      value="${user?.nit_store || ""}"
                      class="input-field w-full"
                      disabled
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-white mb-2">Store Name</label>
                    <input
                      type="text"
                      name="store_name"
                      value="${user?.store_name || ""}"
                      class="input-field w-full"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-white mb-2">Address</label>
                  <textarea
                    name="address"
                    rows="2"
                    class="input-field w-full"
                  >${user?.address || ""}</textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-white mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value="${user?.phone_number || ""}"
                      class="input-field w-full"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-white mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value="${user?.email || ""}"
                      class="input-field w-full"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-white mb-2">Opening Hours</label>
                    <input
                      type="time"
                      name="opening_hours"
                      value="${user?.opening_hours || ""}"
                      class="input-field w-full"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-white mb-2">Closing Hours</label>
                    <input
                      type="time"
                      name="closing_hours"
                      value="${user?.closing_hours || ""}"
                      class="input-field w-full"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-white mb-2">Notes</label>
                  <textarea
                    name="note"
                    rows="3"
                    class="input-field w-full"
                    placeholder="Additional information about your store..."
                  ></textarea>
                </div>

                <div class="flex justify-end pt-4">
                  <button type="submit" class="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Store Stats -->
          <div class="space-y-6">
            <div class="card">
              <h3 class="text-lg font-medium text-white mb-4">Statistics</h3>
              
                              <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-slate-400">Products</span>
                    <span class="text-white font-medium" data-store-stat="products">${
                      user?.total_products || 0
                    }</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-400">Views</span>
                    <span class="text-white font-medium" data-store-stat="views">${(
                      user?.total_views || 0
                    ).toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-400">Queries</span>
                    <span class="text-white font-medium" data-store-stat="queries">${
                      user?.total_queries || 0
                    }</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-slate-400">Rating</span>
                    <div class="flex items-center">
                      <span class="text-yellow-400 mr-1">★</span>
                      <span class="text-white font-medium" data-store-stat="rating">${
                        user?.rating || 0
                      }</span>
                    </div>
                  </div>
                </div>
            </div>

            <div class="card">
              <h3 class="text-lg font-medium text-white mb-4">Actions</h3>
              
              <div class="space-y-3">
                <button class="w-full btn-outline text-left" id="preview-store-btn">
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Public Preview
                </button>
                
                <button class="w-full btn-outline text-left" id="export-store-btn">
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6-4h6m-6 8h6m-9-8v8a2 2 0 002 2h6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                  </svg>
                  Export Data
                </button>
                
                <button class="w-full btn-outline text-left text-red-400 hover:text-red-300" id="delete-store-btn">
                  <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const header = new Header(window.app.authManager);
    header.bindEvents();

    // Navigation tabs
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const view = tab.getAttribute("data-view");
        this.switchView(view);
      });
    });

    // Bind view-specific events based on current view
    if (this.currentView === "products") {
      this.bindProductEvents();
    } else if (this.currentView === "store") {
      this.bindStoreEvents();
    }

    // Cargar estadísticas cuando se carga la página
    this.loadStoreStats();
  }

  bindProductEvents() {
    const addProductBtn = document.getElementById("add-product-btn");
    const addProductModal = document.getElementById("add-product-modal");
    const closeModal = document.getElementById("close-modal");
    const cancelBtn = document.getElementById("cancel-add-product");
    const addProductForm = document.getElementById("add-product-form");

    if (addProductBtn && addProductModal) {
      addProductBtn.addEventListener("click", () => {
        addProductModal.classList.remove("hidden");
      });

      [closeModal, cancelBtn].forEach((btn) => {
        if (btn) {
          btn.addEventListener("click", () => {
            addProductModal.classList.add("hidden");
          });
        }
      });

      // Close modal when clicking outside
      addProductModal.addEventListener("click", (e) => {
        if (e.target === addProductModal) {
          addProductModal.classList.add("hidden");
        }
      });

      if (addProductForm) {
        addProductForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const formData = new FormData(addProductForm);
          const productData = Object.fromEntries(formData.entries());

          try {
            // Prepare data for products endpoint
            const productPayload = {
              product_name: productData.product_name,
              price: parseFloat(productData.price),
              category: productData.category,
              id_store: window.app.authManager.currentUser.nit_store, // Use nit_store as reference
              sold_out: productData.sold_out === "true", // Convert string to boolean
            };

            await this.productsService.addProduct(productPayload);
            this.showNotification("Product added successfully", "success");
            addProductModal.classList.add("hidden");
            addProductForm.reset();

            // Reload products list
            await this.loadProducts();
          } catch (error) {
            this.showNotification(error.message || "Connection error", "error");
          }
        });
      }
    }

    // Agregar funciones globales para editar y eliminar productos
    window.editProductPrice = async (productId, productName, currentPrice) => {
      const newPrice = prompt(
        `Editar precio de "${productName}"\nPrecio actual: $${currentPrice}\nNuevo precio:`,
        currentPrice
      );

      if (newPrice !== null && newPrice !== "") {
        const price = parseFloat(newPrice);
        if (isNaN(price) || price < 0) {
          this.showNotification("Invalid price", "error");
          return;
        }

        try {
          // Get current product data
          const product = await this.productsService.getProductById(productId);

          // Update only the price
          await this.productsService.updateProduct(productId, {
            product_name: product.product_name,
            price: price,
            category: product.category,
            id_store: product.id_store,
            sold_out: product.sold_out,
          });

          this.showNotification("Price updated successfully", "success");
          await this.loadProducts();
        } catch (error) {
          this.showNotification(error.message || "Connection error", "error");
        }
      }
    };

    window.toggleProductStatus = async (productId, soldOut) => {
      try {
        // Get current product data
        const product = await this.productsService.getProductById(productId);

        // Update sold_out status
        await this.productsService.updateProduct(productId, {
          product_name: product.product_name,
          price: product.price,
          category: product.category,
          id_store: product.id_store,
          sold_out: soldOut,
        });

        this.showNotification(
          `Product ${
            soldOut ? "marked as out of stock" : "marked as in stock"
          }`,
          "success"
        );
        await this.loadProducts();
      } catch (error) {
        this.showNotification(error.message || "Connection error", "error");
        await this.loadProducts();
      }
    };

    window.deleteProduct = async (productId) => {
      if (confirm("Are you sure you want to delete this product?")) {
        try {
          await this.productsService.deleteProduct(productId);
          this.showNotification("Product deleted successfully", "success");
          // Reload products list
          await this.loadProducts();
        } catch (error) {
          this.showNotification(error.message || "Connection error", "error");
        }
      }
    };
  }

  switchView(view) {
    this.currentView = view;

    // Update active tab
    document.querySelectorAll(".nav-tab").forEach((tab) => {
      if (tab.getAttribute("data-view") === view) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Update content
    const content = document.getElementById("dashboard-content");
    switch (view) {
      case "overview":
        content.innerHTML = this.renderOverview();
        // Load products to update statistics
        this.loadProducts();
        break;
      case "products":
        content.innerHTML = this.renderProducts();
        this.loadProducts(); // Load products asynchronously
        this.bindProductEvents();
        break;
      case "store":
        content.innerHTML = this.renderStore();
        this.bindStoreEvents();
        this.loadStoreStats(); // Load store statistics
        break;
    }
  }

  async loadProducts() {
    try {
      console.log("Loading products...");
      const data = await this.productsService.getAllProducts();
      console.log("Products received:", data);

      // Filter products from current store using nit_store
      this.products =
        data.filter(
          (product) =>
            product.id_store === window.app.authManager.currentUser.nit_store
        ) || [];

      console.log("Products filtered for store:", this.products);
      console.log(
        "Current store NIT:",
        window.app.authManager.currentUser.nit_store
      );

      // Update dashboard statistics
      this.updateDashboardStats();
    } catch (error) {
      console.error("Error loading products:", error);
      this.products = [];
    }

    // Update table with loaded products
    const tableBody = document.getElementById("products-table-body");
    if (tableBody) {
      tableBody.innerHTML = this.renderProductRows();
    }
  }

  updateDashboardStats() {
    // Update products counter in dashboard
    const productsCountElement = document.querySelector(
      '[data-stat="products"]'
    );
    if (productsCountElement) {
      productsCountElement.textContent = this.products.length;
    }
  }

  renderProductRows() {
    if (this.products.length === 0) {
      return `
        <tr>
          <td colspan="5" class="px-6 py-8 text-center text-slate-400">
            No hay productos registrados
          </td>
        </tr>
      `;
    }

    return this.products
      .map(
        (product) => `
      <tr class="hover:bg-slate-750">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-medium text-white">${
            product.product_name
          }</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
            ${product.category}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-400">
          $${parseFloat(product.price).toLocaleString()}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center space-x-3">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.sold_out
                ? "bg-red-900 text-red-300"
                : "bg-green-900 text-green-300"
            }">
              ${product.sold_out ? "Out of Stock" : "In Stock"}
            </span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" 
                     class="sr-only peer" 
                     ${product.sold_out ? "checked" : ""}
                     onchange="toggleProductStatus(${
                       product.id_product
                     }, this.checked)">
              <div class="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div class="flex space-x-2">
            <button class="text-blue-400 hover:text-blue-300 transition-colors" onclick="editProductPrice(${
              product.id_product
            }, '${product.product_name}', ${product.price})">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button class="text-red-400 hover:text-red-300 transition-colors" onclick="deleteProduct(${
              product.id_product
            })">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  bindStoreEvents() {
    const storeForm = document.getElementById("store-form");

    if (storeForm) {
      storeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(storeForm);
        const storeData = Object.fromEntries(formData.entries());

        try {
          // Preparar los datos para el endpoint de stores
          const storePayload = {
            nit_store:
              storeData.nit_store ||
              window.app.authManager.currentUser.nit_store,
            store_name: storeData.store_name,
            address: storeData.address,
            phone_number: storeData.phone_number,
            email: storeData.email,
            id_store_type: window.app.authManager.getStoreTypeId(
              storeData.store_type
            ),
            opening_hours: storeData.opening_hours,
            closing_hours: storeData.closing_hours,
            note: storeData.note || "",
          };

          await this.storesService.updateStore(
            window.app.authManager.currentUser.nit_store,
            storePayload
          );

          // Update user data in memory
          if (window.app.authManager.currentUser) {
            Object.assign(window.app.authManager.currentUser, storePayload);
          }
          this.showNotification(
            "Store information updated successfully",
            "success"
          );
        } catch (error) {
          this.showNotification(error.message || "Connection error", "error");
        }
      });
    }

    // Action buttons
    const previewBtn = document.getElementById("preview-store-btn");
    const exportBtn = document.getElementById("export-store-btn");
    const deleteBtn = document.getElementById("delete-store-btn");

    if (previewBtn) {
      previewBtn.addEventListener("click", () => {
        this.showStorePreview();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        this.exportStoreData();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        this.confirmDeleteStore();
      });
    }
  }

  showStorePreview() {
    const user = window.app.authManager.currentUser;
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";
    modal.innerHTML = `
      <div class="card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">Public Preview</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-6">
          <div class="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h4 class="text-lg font-semibold text-white mb-4">${
              user.store_name
            }</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span class="text-slate-400">Address:</span> <span class="text-white">${
                  user.address || "Not available"
                }</span></p>
                <p><span class="text-slate-400">Phone:</span> <span class="text-white">${
                  user.phone_number || "Not available"
                }</span></p>
                <p><span class="text-slate-400">Email:</span> <span class="text-white">${
                  user.email || "Not available"
                }</span></p>
              </div>
              <div>
                <p><span class="text-slate-400">Hours:</span> <span class="text-white">${
                  user.opening_hours && user.closing_hours
                    ? `${user.opening_hours} - ${user.closing_hours}`
                    : "Not available"
                }</span></p>
                <p><span class="text-slate-400">NIT:</span> <span class="text-white">${
                  user.nit_store
                }</span></p>
              </div>
            </div>
          </div>
          
          <div class="text-center">
            <p class="text-slate-400">This is how users will see your store in search</p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Cerrar modal al hacer clic fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  async exportStoreData() {
    try {
      const user = window.app.authManager.currentUser;

      // Get store products
      const productsData = await this.storesService.getStoreProducts(
        user.nit_store
      );
      const products = productsData.products || [];

      // Crear objeto con datos de la tienda
      const storeData = {
        store: {
          nit_store: user.nit_store,
          store_name: user.store_name,
          address: user.address,
          phone_number: user.phone_number,
          email: user.email,
          opening_hours: user.opening_hours,
          closing_hours: user.closing_hours,
        },
        products: products,
        exportDate: new Date().toISOString(),
      };

      // Crear archivo JSON para descargar
      const dataStr = JSON.stringify(storeData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${user.store_name}_data_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.showNotification("Data exported successfully", "success");
    } catch (error) {
      console.error("Error exporting data:", error);
      this.showNotification("Error exporting data", "error");
    }
  }

  confirmDeleteStore() {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";
    modal.innerHTML = `
      <div class="card max-w-md w-full">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">Delete Store</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p class="text-red-300 text-sm font-medium">Irreversible action</p>
                <p class="text-red-200 text-xs mt-1">
                  This action will permanently delete your store and all its products. 
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          
          <p class="text-slate-300 text-sm">
            Are you sure you want to delete your store? 
            Type <strong>DELETE</strong> to confirm.
          </p>
          
          <input 
            type="text" 
            id="delete-confirmation" 
            class="input-field w-full" 
            placeholder="Type DELETE to confirm"
          />
          
          <div class="flex space-x-3">
            <button onclick="this.closest('.fixed').remove()" class="flex-1 btn-outline">
              Cancel
            </button>
            <button id="confirm-delete-btn" class="flex-1 btn-primary bg-red-600 hover:bg-red-700" disabled>
              Delete Store
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Validate confirmation
    const confirmationInput = modal.querySelector("#delete-confirmation");
    const confirmBtn = modal.querySelector("#confirm-delete-btn");

    confirmationInput.addEventListener("input", (e) => {
      confirmBtn.disabled = e.target.value !== "DELETE";
    });

    // Execute deletion
    confirmBtn.addEventListener("click", () => {
      this.deleteStore();
      modal.remove();
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  async deleteStore() {
    try {
      const user = window.app.authManager.currentUser;

      await this.storesService.deleteStore(user.nit_store);
      this.showNotification("Store deleted successfully", "success");

      // Logout and redirect to login
      setTimeout(() => {
        window.app.authManager.logout();
        window.location.hash = "#/login";
      }, 2000);
    } catch (error) {
      console.error("Error deleting store:", error);
      this.showNotification(error.message || "Connection error", "error");
    }
  }

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

  async loadStoreViews() {
    try {
      const user = window.app.authManager.currentUser;
      if (!user || !user.nit_store) {
        return 0;
      }

      const data = await this.storesService.getStoreViews(user.nit_store);
      return data.total_views || 0;
    } catch (error) {
      console.error("Error loading views:", error);
      return 0;
    }
  }

  async loadStoreStats() {
    try {
      const user = window.app.authManager.currentUser;
      if (!user || !user.nit_store) {
        return;
      }

      // Load store products
      const productsData = await this.storesService.getStoreProducts(
        user.nit_store
      );
      const totalProducts = productsData.products
        ? productsData.products.length
        : 0;

      // Load views
      const viewsData = await this.storesService.getStoreViews(user.nit_store);
      const totalViews = viewsData.total_views || 0;

      // Update statistics in UI
      this.updateStoreStats({
        products: totalProducts,
        views: totalViews,
        queries: 0, // Por ahora en 0
        rating: 4.5, // Por defecto
      });
    } catch (error) {
      console.error("Error loading store stats:", error);
    }
  }

  updateStoreStats(stats) {
    // Update in overview
    const productsElement = document.querySelector('[data-stat="products"]');
    const viewsElement = document.querySelector('[data-stat="views"]');

    if (productsElement) productsElement.textContent = stats.products;
    if (viewsElement) viewsElement.textContent = stats.views.toLocaleString();

    // Update in store section
    const storeStatsElements = document.querySelectorAll("[data-store-stat]");
    storeStatsElements.forEach((element) => {
      const statType = element.getAttribute("data-store-stat");
      if (statType === "products") element.textContent = stats.products;
      if (statType === "views")
        element.textContent = stats.views.toLocaleString();
      if (statType === "queries") element.textContent = stats.queries;
      if (statType === "rating") element.textContent = stats.rating;
    });
  }
}
