import { Header } from "../components/Header.js";
import { SearchBar } from "../components/SearchBar.js";
import { Map } from "../components/Map.js";
import { StoreList } from "../components/StoreList.js";

export default class HomePage {
  constructor() {
    this.map = null;
    this.storeList = new StoreList();
    this.currentQuery = "";
  }

  render(container) {
    const header = new Header(window.app.authManager);
    container.innerHTML = `
      ${header.render()}
      <section class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
        ${new SearchBar(this.handleSearch.bind(this)).render()}
      </section>
      <main class="min-h-screen bg-slate-900 py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="order-2 lg:order-1">
              <div class="sticky top-24">
                <div class="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
                  <div id="map" class="h-96 lg:h-[500px]"></div>
                </div>
              </div>
            </div>
            <div class="order-1 lg:order-2">
              <div id="store-results">${this.renderInitialState()}</div>
            </div>
          </div>
        </div>
      </main>
    `;
    header.bindEvents();
    this.bindEvents();
    this.initializeMap();
  }

  renderInitialState() {
    return `
      <div class="text-center py-16">
        <div class="max-w-md mx-auto">
          <svg class="mx-auto h-16 w-16 text-slate-400 mb-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <h3 class="text-xl font-medium text-white mb-3">What are you looking for?</h3>
          <p class="text-slate-400 mb-6">Search for a product and we will show you nearby stores that have it available.</p>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <button class="search-suggestion bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-left transition-colors">
              <span class="text-white font-medium">Screws</span>
              <span class="block text-slate-400 text-xs mt-1">Hardware</span>
            </button>
            <button class="search-suggestion bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-left transition-colors">
              <span class="text-white font-medium">Paint</span>
              <span class="block text-slate-400 text-xs mt-1">Construction</span>
            </button>
            <button class="search-suggestion bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-left transition-colors">
              <span class="text-white font-medium">Tools</span>
              <span class="block text-slate-400 text-xs mt-1">Hardware</span>
            </button>
            <button class="search-suggestion bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-left transition-colors">
              <span class="text-white font-medium">Cables</span>
              <span class="block text-slate-400 text-xs mt-1">Electrical</span>
            </button>
          </div>
          <div class="mt-4">
            <button id="request-location-btn" class="btn-secondary text-sm">
              <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get my location
            </button>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const searchBar = new SearchBar(this.handleSearch.bind(this));
    searchBar.bindEvents();

    document.addEventListener("click", (e) => {
      const sug = e.target.closest(".search-suggestion");
      if (sug) {
        const query = sug.querySelector("span").textContent;
        document.getElementById("search-input").value = query;
        this.handleSearch(query);
      }
    });

    // Button to request user location
    document.addEventListener("click", (e) => {
      if (e.target.closest("#request-location-btn")) {
        if (this.map) {
          this.map.getUserLocation();
        }
      }
    });

    document.addEventListener("highlightMarker", (e) => {
      if (this.map) this.map.highlightMarker(e.detail.storeId);
    });
  }

  initializeMap() {
    this.map = new Map("map");
    this.map.init();
  }

  async handleSearch(query) {
    this.currentQuery = query;
    document.getElementById("store-results").innerHTML = `
      <div class="text-center py-16">
        <div class="spinner mx-auto mb-4"></div>
        <p class="text-slate-400">Searching "${query}"...</p>
      </div>
    `;

    try {
      const { stores, matchingProducts } = await this.searchStores(query);

      // Render results
      document.getElementById("store-results").innerHTML =
        this.storeList.render(stores, query, matchingProducts);
      this.storeList.bindEvents();

      if (this.map) {
        this.map.addStoreMarkers(stores);
      }
    } catch (error) {
      console.error("Search error:", error);
      this.showSearchError();
    }
  }

  async searchStores(query) {
    try {
      // Check if API is available
      if (!window.app?.authManager?.apiUrl) {
        console.warn("API URL not available, using sample data");
        return this.getSampleStores(query);
      }

      // Get all stores
      const storesResponse = await fetch(
        `${window.app.authManager.apiUrl}/stores`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!storesResponse.ok) {
        console.warn("API not available, using sample data");
        return this.getSampleStores(query);
      }

      const stores = await storesResponse.json();

      // Get all products to search by product name
      const productsResponse = await fetch(
        `${window.app.authManager.apiUrl}/products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let products = [];
      if (productsResponse.ok) {
        products = await productsResponse.json();
        console.log("Products retrieved:", products.length);
      } else {
        console.error("Error fetching products:", productsResponse.status);
      }

      // Filter stores that contain the query in their name or have products that match
      const queryLower = query.toLowerCase();
      const matchingStoreNits = new Set();
      const matchingProducts = {};

      // Search stores by name
      stores.forEach((store) => {
        const storeName = store.store_name
          ? store.store_name.toLowerCase()
          : "";
        if (storeName.includes(queryLower)) {
          matchingStoreNits.add(store.nit_store);
        }
      });

      // Search products that match and add their stores
      products.forEach((product) => {
        const productName = product.product_name
          ? product.product_name.toLowerCase()
          : "";
        const productCategory = product.category
          ? product.category.toLowerCase()
          : "";

        if (
          productName.includes(queryLower) ||
          productCategory.includes(queryLower)
        ) {
          matchingStoreNits.add(product.id_store);

          // Group products by store
          if (!matchingProducts[product.id_store]) {
            matchingProducts[product.id_store] = [];
          }
          matchingProducts[product.id_store].push(product);

          console.log(
            `Product found: ${product.product_name} in store ${product.id_store}`
          );
        }
      });

      console.log("Stores found:", Array.from(matchingStoreNits));
      console.log("Matching products by store:", matchingProducts);

      // Filter stores that match
      const filteredStores = stores.filter((store) =>
        matchingStoreNits.has(store.nit_store)
      );

      // Convert to frontend expected format
      const formattedStores = filteredStores.map((store) => {
        // Calculate distance if we have map and user location
        let distance = "0 km";
        if (this.map && this.map.userLocation) {
          // Use default coordinates for stores (since they don't have real coordinates)
          const storeLat = 4.6097 + (Math.random() - 0.5) * 0.01;
          const storeLng = -74.0817 + (Math.random() - 0.5) * 0.01;
          distance = this.map.calculateDistance(
            this.map.userLocation[0],
            this.map.userLocation[1],
            storeLat,
            storeLng
          );
        }

        return {
          nit_store: store.nit_store,
          store_name: store.store_name,
          address: store.address,
          phone_number: store.phone_number,
          email: store.email,
          opening_hours: store.opening_hours,
          closing_hours: store.closing_hours,
          product_description: `Registered store`,
          distance: distance,
          rating: 4.5,
          featured: false,
          latitude: 4.6097 + (Math.random() - 0.5) * 0.01, // Default coordinates with variation
          longitude: -74.0817 + (Math.random() - 0.5) * 0.01,
        };
      });

      return { stores: formattedStores, matchingProducts };
    } catch (error) {
      console.error("Search API error:", error);
      throw error;
    }
  }

  showSearchError() {
    const storeResults = document.getElementById("store-results");
    storeResults.innerHTML = `
      <div class="text-center py-16">
        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-lg font-medium text-white mb-2">
          Search error
        </h3>
        <p class="text-slate-400 mb-6">
          We couldn't perform the search. Please try again.
        </p>
        <button class="btn-primary" onclick="location.reload()">
          Retry
        </button>
      </div>
    `;
  }

  destroy() {
    if (this.map) {
      this.map.destroy();
    }
  }

  getSampleStores(query) {
    const sampleStores = [
      {
        nit_store: "123456789-0",
        store_name: "Hardware Store Center",
        address: "Calle 123 # 45-67, Bogotá",
        phone_number: "3001234567",
        email: "info@hardwarecenter.com",
        store_type: "Hardware Store",
        opening_hours: "08:00",
        closing_hours: "18:00",
        latitude: 4.6097,
        longitude: -74.0817,
      },
      {
        nit_store: "987654321-0",
        store_name: "Super Tools",
        address: "Carrera 78 # 90-12, Bogotá",
        phone_number: "3009876543",
        email: "contact@supertools.com",
        store_type: "Hardware Store",
        opening_hours: "07:00",
        closing_hours: "19:00",
        latitude: 4.6197,
        longitude: -74.0717,
      },
      {
        nit_store: "456789123-0",
        store_name: "Home Depot Express",
        address: "Avenida 68 # 23-45, Bogotá",
        phone_number: "3004567891",
        email: "sales@homedepot.com",
        store_type: "Hardware Store",
        opening_hours: "09:00",
        closing_hours: "17:00",
        latitude: 4.5997,
        longitude: -74.0917,
      },
    ];

    // Sample products for demonstration
    const sampleProducts = {
      "123456789-0": [
        {
          id_product: 1,
          product_name: "Professional Hammer",
          price: 25000,
          category: "Hardware",
          product_description: "Steel hammer with ergonomic handle",
          sold_out: false,
          id_store: "123456789-0",
        },
        {
          id_product: 2,
          product_name: "Screwdriver Set",
          price: 15000,
          category: "Tools",
          product_description: "Complete set of screwdrivers",
          sold_out: false,
          id_store: "123456789-0",
        },
      ],
      "987654321-0": [
        {
          id_product: 3,
          product_name: "Paint Brush Set",
          price: 8000,
          category: "Paint",
          product_description: "Professional paint brushes",
          sold_out: false,
          id_store: "987654321-0",
        },
      ],
    };

    // Filter stores based on query
    const queryLower = query.toLowerCase();
    const filteredStores = sampleStores
      .filter(
        (store) =>
          store.store_name.toLowerCase().includes(queryLower) ||
          store.store_type.toLowerCase().includes(queryLower)
      )
      .map((store) => ({
        ...store,
        product_description: `Registered store`,
        distance: "0 km",
        rating: 4.5,
        featured: false,
      }));

    // Filter products based on query
    const matchingProducts = {};
    Object.keys(sampleProducts).forEach((storeNit) => {
      const storeProducts = sampleProducts[storeNit].filter(
        (product) =>
          product.product_name.toLowerCase().includes(queryLower) ||
          product.category.toLowerCase().includes(queryLower)
      );
      if (storeProducts.length > 0) {
        matchingProducts[storeNit] = storeProducts;
      }
    });

    return { stores: filteredStores, matchingProducts };
  }
}
