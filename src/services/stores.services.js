import { getApiUrl, getAuthHeaders } from "../config/api.js";

class StoresService {
  constructor() {
    // API URL will be loaded from config
  }

  // Get all stores
  async getAllStores() {
    try {
      const response = await fetch(getApiUrl("/stores"), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error loading stores: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading stores:", error);
      throw error;
    }
  }

  // Get store by NIT
  async getStoreByNit(nitStore) {
    try {
      const response = await fetch(getApiUrl(`/stores/${nitStore}`), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error loading store: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading store:", error);
      throw error;
    }
  }

  // Update store information
  async updateStore(nitStore, storeData) {
    try {
      const response = await fetch(getApiUrl(`/stores/${nitStore}`), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(storeData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Error updating store information");
      }
    } catch (error) {
      console.error("Error updating store:", error);
      throw error;
    }
  }

  // Get store products
  async getStoreProducts(nitStore) {
    try {
      const response = await fetch(getApiUrl(`/stores/${nitStore}/products`), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error loading store products: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading store products:", error);
      throw error;
    }
  }

  // Get store views
  async getStoreViews(nitStore) {
    try {
      const response = await fetch(getApiUrl(`/stores/${nitStore}/views`), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error loading store views: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading store views:", error);
      throw error;
    }
  }

  // Delete store
  async deleteStore(nitStore) {
    try {
      const response = await fetch(getApiUrl(`/stores/${nitStore}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || "Error deleting store");
      }
    } catch (error) {
      console.error("Error deleting store:", error);
      throw error;
    }
  }
}

export default StoresService;
