import { getApiUrl, getAuthHeaders } from "../config/api.js";

class ProductsService {
  constructor() {
    // API URL will be loaded from config
  }

  // Get all products
  async getAllProducts() {
    try {
      const response = await fetch(getApiUrl("/products"), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error loading products: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      throw error;
    }
  }

  // Add new product
  async addProduct(productData) {
    try {
      const response = await fetch(getApiUrl("/products"), {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Error adding product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(productId) {
    try {
      const response = await fetch(getApiUrl(`/products/${productId}`), {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Error loading product: ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      throw error;
    }
  }

  // Update product
  async updateProduct(productId, productData) {
    try {
      const response = await fetch(getApiUrl(`/products/${productId}`), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Error updating product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      const response = await fetch(getApiUrl(`/products/${productId}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || "Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

export default ProductsService;
