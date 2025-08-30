import { AuthManager } from "./auth/AuthManager.js";
import Router from "./router/Router.js";

// Initialize the application
class App {
  constructor() {
    this.authManager = new AuthManager();
    this.router = new Router();

    // Initialize auth manager
    this.authManager.init();

    // Set up global app object
    window.app = {
      authManager: this.authManager,
      router: this.router,
    };
  }

  init() {
    // Initialize router
    this.router.init();

    console.log("NearMe application initialized");
  }
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
