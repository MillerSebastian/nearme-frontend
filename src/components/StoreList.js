export class StoreList {
  constructor() {
    this.stores = [];
  }

  render(stores, searchQuery = "") {
    this.stores = stores;

    if (stores.length === 0) {
      return `
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09A8.001 8.001 0 0112 4.001c1.025 0 2.025.195 2.937.558M12 4a8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-slate-300">No stores found</h3>
          <p class="mt-1 text-sm text-slate-400">
            ${
              searchQuery
                ? `No stores selling "${searchQuery}" in your area.`
                : "Try making a search."
            }
          </p>
        </div>
      `;
    }

    return `
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-white">
            Results for "${searchQuery}"
          </h2>
          <span class="text-sm text-slate-400">
            ${stores.length} store(s)
          </span>
        </div>
        <div class="space-y-3">
          ${stores.map((store) => this.renderStoreCard(store)).join("")}
        </div>
      </div>
    `;
  }

  renderStoreCard(store) {
    const distance = store.distance || "0 km";
    const hours =
      store.opening_hours && store.closing_hours
        ? `${store.opening_hours} - ${store.closing_hours}`
        : "Schedule not available";

    return `
      <div class="store-card group ${
        store.featured ? "featured" : ""
      }" data-store-id="${store.nit_store}">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-white group-hover:text-blue-400 transition-colors">
                  ${store.store_name}
                </h3>
                <p class="text-sm text-slate-400">${
                  store.address || "Address not available"
                }</p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <span class="text-lg font-bold text-green-400">Registered store</span>
                <span class="text-xs px-2 py-1 rounded-full bg-blue-900 text-blue-300">
                  View products
                </span>
              </div>
              <div class="text-right">
                <p class="text-sm text-slate-400">${distance}</p>
                <div class="flex items-center mt-1">
                  <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span class="text-xs text-slate-400">${
                    store.rating || "4.5"
                  }</span>
                </div>
              </div>
            </div>
            ${
              store.product_description
                ? `
              <p class="text-sm text-slate-400 mt-2 line-clamp-2">
                ${store.product_description}
              </p>
            `
                : ""
            }
            <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-700">
              <div class="flex items-center space-x-2 text-xs text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                </svg>
                <span>${hours}</span>
              </div>
              <div class="flex items-center space-x-2">
                <button class="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium" onclick="viewStoreDetails('${
                  store.nit_store
                }')">
                  View details
                </button>
                <button class="btn-primary text-xs py-1 px-3" onclick="contactStore('${
                  store.nit_store
                }')">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    document.addEventListener("click", (e) => {
      const storeCard = e.target.closest(".store-card");
      if (storeCard) {
        const storeId = storeCard.getAttribute("data-store-id");
        const event = new CustomEvent("highlightMarker", {
          detail: { storeId },
        });
        document.dispatchEvent(event);
      }
    });
  }
}

// Global functions to handle store actions
window.viewStoreDetails = async (storeNit) => {
  try {
    // Register view
    await fetch(`${window.app.authManager.apiUrl}/stores/${storeNit}/views`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Get store information
    const storeResponse = await fetch(
      `${window.app.authManager.apiUrl}/stores/${storeNit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Get store products
    const productsResponse = await fetch(
      `${window.app.authManager.apiUrl}/stores/${storeNit}/products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "Store URL:",
      `${window.app.authManager.apiUrl}/stores/${storeNit}`
    );
    console.log(
      "Products URL:",
      `${window.app.authManager.apiUrl}/stores/${storeNit}/products`
    );

    let storeData = {};
    let productsData = [];

    if (storeResponse.ok) {
      storeData = await storeResponse.json();
      console.log("Store data:", storeData);
    } else {
      console.error(
        "Store response:",
        storeResponse.status,
        storeResponse.statusText
      );
    }

    if (productsResponse.ok) {
      productsData = await productsResponse.json();
      console.log("Products data:", productsData);
    } else {
      console.error(
        "Products response:",
        productsResponse.status,
        productsResponse.statusText
      );
    }

    // Combine store info with products
    const combinedData = {
      ...storeData,
      products: productsData.products || productsData, // Handle both structures
      total_views: productsData.total_views || storeData.views || 0,
    };

    console.log("Combined data:", combinedData);
    console.log("Products array:", combinedData.products);
    showStoreDetailsModal(combinedData);
  } catch (error) {
    console.error("Error:", error);
    alert("Error loading store details");
  }
};

window.contactStore = async (storeNit) => {
  try {
    // Register view
    await fetch(`${window.app.authManager.apiUrl}/stores/${storeNit}/views`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Get store info
    const response = await fetch(
      `${window.app.authManager.apiUrl}/stores/${storeNit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const store = await response.json();
      showContactModal(store);
    } else {
      alert("Error loading contact information");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error loading contact information");
  }
};

function showStoreDetailsModal(data) {
  console.log("Modal data received:", data);
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-white">Store Details</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-lg font-semibold text-white mb-2">Store Information</h4>
            <div class="space-y-2 text-sm">
              <p><span class="text-slate-400">Name:</span> <span class="text-white">${
                data.store_name || "Not available"
              }</span></p>
              <p><span class="text-slate-400">Address:</span> <span class="text-white">${
                data.address || "Not available"
              }</span></p>
              <p><span class="text-slate-400">Phone:</span> <span class="text-white">${
                data.phone_number || "Not available"
              }</span></p>
              <p><span class="text-slate-400">Email:</span> <span class="text-white">${
                data.email || "Not available"
              }</span></p>
              <p><span class="text-slate-400">Schedule:</span> <span class="text-white">${
                data.opening_hours && data.closing_hours
                  ? `${data.opening_hours} - ${data.closing_hours}`
                  : "Not available"
              }</span></p>
              <p><span class="text-slate-400">Views:</span> <span class="text-white">${
                data.total_views || 0
              }</span></p>
              <p><span class="text-slate-400">Products:</span> <span class="text-white">${
                data.products ? data.products.length : 0
              }</span></p>
            </div>
          </div>
        </div>
        
        ${
          data.products &&
          Array.isArray(data.products) &&
          data.products.length > 0
            ? `
          <div>
            <h4 class="text-lg font-semibold text-white mb-4">Available Products</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${data.products
                .map(
                  (product) => `
                <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                  <div class="flex justify-between items-start mb-2">
                    <h5 class="font-medium text-white">${
                      product.product_name
                    }</h5>
                    <span class="inline-block text-xs px-2 py-1 rounded-full ${
                      product.sold_out
                        ? "bg-red-900 text-red-300"
                        : "bg-green-900 text-green-300"
                    }">
                      ${product.sold_out ? "Sold out" : "In stock"}
                    </span>
                  </div>
                  <p class="text-green-400 font-bold text-lg">$${parseFloat(
                    product.price
                  ).toLocaleString()}</p>
                  <p class="text-sm text-slate-400 mt-1">${product.category}</p>
                  ${
                    product.product_description
                      ? `<p class="text-xs text-slate-500 mt-2">${product.product_description}</p>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : `
          <div class="text-center py-8">
            <p class="text-slate-400">This store doesn't have any registered products yet.</p>
            <p class="text-xs text-slate-500 mt-2">Debug: products = ${JSON.stringify(
              data.products
            )}</p>
          </div>
        `
        }
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

function showContactModal(store) {
  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="card max-w-md w-full">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-white">Contact ${
          store.store_name
        }</h3>
        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Phone</label>
          <p class="text-slate-300">${store.phone_number || "Not available"}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-white mb-2">Email</label>
          <p class="text-slate-300">${store.email || "Not available"}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-white mb-2">Address</label>
          <p class="text-slate-300">${store.address || "Not available"}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-white mb-2">Schedule</label>
          <p class="text-slate-300">${
            store.opening_hours && store.closing_hours
              ? `${store.opening_hours} - ${store.closing_hours}`
              : "Not available"
          }</p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
