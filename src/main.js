import "./index.css";
import { AuthManager } from "./auth/AuthManager.js";
import { Router } from "./router/Router.js";

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

    // Register service worker for PWA
    this.registerServiceWorker();

    console.log("NearMe application initialized");
  }

  // Register service worker for PWA functionality
  registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration);

            // Check for updates
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available, show update notification
                  this.showUpdateNotification();
                }
              });
            });
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError);
          });
      });
    }
  }

  // Show update notification
  showUpdateNotification() {
    if (confirm("Nueva versión disponible. ¿Deseas actualizar?")) {
      window.location.reload();
    }
  }
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Starting NearMe App");
  const app = new App();
  app.init();
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === "loading") {
  console.log("Document still loading - waiting for DOMContentLoaded");
} else {
  console.log("Document already loaded - starting app immediately");
  const app = new App();
  app.init();
}
