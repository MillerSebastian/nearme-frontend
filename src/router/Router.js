export class Router {
  constructor() {
    this.routes = {
      "/": "landing",
      "/home": "home",
      "/landing": "landing",
      "/login": "login",
      "/register": "register",
      "/dashboard": "dashboard",
      "/statistics": "statistics",
      "/products/upload": "upload-products",
    };

    this.currentRoute = "/";
    this.isAuthenticated = false;
    this.sessionKey = "router_auth_session";
    this.authCheckInterval = null;

    this.routeGuards = {
      "/": {
        requiresAuth: false,
        onFailRedirect: "/login",
      },
      "/home": {
        requiresAuth: false,
        onFailRedirect: "/login",
      },
      "/dashboard": {
        requiresAuth: true,
        onFailRedirect: "/login",
        canActivate: () => {
          if (!this.isAuthenticated) {
            console.warn("Guardian: Acceso denegado - No autenticado");
            return false;
          }
          return true;
        },
      },
      "/statistics": {
        requiresAuth: true,
        onFailRedirect: "/login",
        canActivate: () => {
          if (!this.isAuthenticated) {
            console.warn("Guardian: Acceso denegado - No autenticado");
            return false;
          }
          return true;
        },
      },
      "/products/upload": {
        requiresAuth: true,
        onFailRedirect: "/dashboard",
        canActivate: () => {
          if (!this.isAuthenticated) {
            console.warn("Guardian: Acceso denegado - No autenticado");
            return false;
          }
          return true;
        },
      },
      "/login": {
        requiresAuth: false,
        canActivate: () => {
          if (this.isAuthenticated) {
            console.log("Guardian: Ya autenticado, redirigiendo a dashboard");
            this.navigate("/dashboard");
            return false;
          }
          return true;
        },
      },
      "/register": {
        requiresAuth: false,
        canActivate: () => {
          if (this.isAuthenticated) {
            console.log("Guardian: Ya autenticado, redirigiendo a dashboard");
            this.navigate("/dashboard");
            return false;
          }
          return true;
        },
      },
    };

    this.init();
  }

  init() {
    this.restoreSession();

    this.setupAuthCheck();

    this.handleInitialRoute();
    this.bindEvents();
  }

  restoreSession() {
    try {
      const savedSession = localStorage.getItem(this.sessionKey);
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);

        const isExpired = this.isSessionExpired(sessionData.timestamp);

        if (!isExpired) {
          this.isAuthenticated = sessionData.isAuthenticated;
          console.log("Sesión restaurada exitosamente");
        } else {
          console.log("Sesión expirada, cerrando...");
          this.clearSession();
        }
      }
    } catch (error) {
      console.error("Error al restaurar la sesión:", error);
      this.clearSession();
    }
  }

  saveSession() {
    try {
      const sessionData = {
        isAuthenticated: this.isAuthenticated,
        timestamp: new Date().getTime(),
        currentRoute: this.currentRoute,
      };

      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    } catch (error) {
      console.error("Error al guardar la sesión:", error);
    }
  }

  clearSession() {
    this.isAuthenticated = false;
    localStorage.removeItem(this.sessionKey);
    console.log("Sesión limpiada");
  }

  isSessionExpired(timestamp) {
    if (!timestamp) return true;

    const sessionDuration = 24 * 60 * 60 * 1000;
    const currentTime = new Date().getTime();
    return currentTime - timestamp > sessionDuration;
  }

  setupAuthCheck() {
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval);
    }

    this.authCheckInterval = setInterval(() => {
      if (this.requiresAuth(this.currentRoute) && !this.isAuthenticated) {
        console.log(
          "Verificación: Redirigiendo a login desde",
          this.currentRoute
        );
        this.navigate("/login");
      }
    }, 2000);
  }

  handleInitialRoute() {
    const path = window.location.pathname;
    const hash = window.location.hash.substring(1);
    let targetRoute = "/";

    // Prioritize hash routing for SPA
    if (hash) {
      targetRoute = hash;
    } else if (path !== "/") {
      targetRoute = path;
    }

    console.log("Router: Initial route handling", { path, hash, targetRoute });

    if (
      this.isAuthenticated &&
      (targetRoute === "/login" || targetRoute === "/register")
    ) {
      this.navigate("/dashboard");
      return;
    }

    if (!this.isAuthenticated && this.requiresAuth(targetRoute)) {
      this.navigate("/login");
      return;
    }

    this.navigate(targetRoute);
  }

  bindEvents() {
    window.addEventListener("popstate", (e) => {
      const route = e.state?.route || "/";
      this.loadRoute(route);
    });

    // Agregar listener para hashchange
    window.addEventListener("hashchange", (e) => {
      const hash = window.location.hash.replace("#", "");
      const route = hash || "/";
      console.log(`Hash changed to: ${route}`);
      this.loadRoute(route);
    });

    document.addEventListener("click", (e) => {
      const link = e.target.closest("[data-route]");
      if (link) {
        e.preventDefault();
        const route = link.getAttribute("data-route");
        this.navigate(route);
      }
    });

    window.addEventListener("beforeunload", () => {
      this.saveSession();
    });

    window.addEventListener("load", () => {
      this.restoreSession();
    });
  }

  navigate(route) {
    console.log(`Router.navigate() llamado con ruta: ${route}`);

    if (!this.canActivate(route)) {
      const guardConfig = this.routeGuards[route] || {};
      const redirectTo = guardConfig.onFailRedirect || "/login";
      console.warn(
        `Guardian: Acceso denegado a ${route}. Redirigiendo a ${redirectTo}`
      );
      this.navigate(redirectTo);
      return;
    }

    this.currentRoute = route;
    window.history.pushState({ route }, "", `#${route}`);
    this.loadRoute(route);
  }

  canActivate(route) {
    const guardConfig = this.routeGuards[route] || {};

    if (guardConfig.requiresAuth && !this.isAuthenticated) {
      return false;
    }

    if (guardConfig.canActivate && !guardConfig.canActivate()) {
      return false;
    }

    return true;
  }

  requiresAuth(route) {
    const guardConfig = this.routeGuards[route] || {};
    return guardConfig.requiresAuth || false;
  }

  async loadRoute(route) {
    console.log(`Router.loadRoute() llamado con ruta: ${route}`);
    const routeName = this.routes[route] || "landing";
    console.log(`Nombre de la ruta: ${routeName}`);

    try {
      console.log(`Importando módulo: ../pages/${routeName}.js`);
      const module = await import(`../pages/${routeName}.js`);
      const PageClass = module.default || module[Object.keys(module)[0]];
      console.log(`Clase de página cargada:`, PageClass);

      const page = new PageClass();
      console.log(`Instancia de página creada:`, page);

      const app = document.getElementById("root");
      if (app) {
        console.log(`Contenedor root encontrado, limpiando contenido`);
        app.innerHTML = "";
        if (routeName === "landing") {
          // La página de landing se renderiza directamente en el DOM
          console.log(`Renderizando landing page`);
          page.render();
        } else {
          // Otras páginas usan el método render con el contenedor
          console.log(`Renderizando página ${routeName} en contenedor`);
          page.render(app);
        }
      } else {
        console.error(`Contenedor root no encontrado - creando fallback`);
        // Fallback: crear el contenedor si no existe
        const fallbackApp = document.createElement("div");
        fallbackApp.id = "root";
        document.body.appendChild(fallbackApp);
        page.render(fallbackApp);
      }
    } catch (error) {
      console.error(`Error loading route ${route}:`, error);
      this.navigate("/home");
    }
  }

  setAuthenticated(status) {
    this.isAuthenticated = status;

    if (status) {
      this.saveSession();
      if (this.currentRoute === "/login" || this.currentRoute === "/register") {
        this.navigate("/dashboard");
      }
    } else {
      this.clearSession();
      if (this.requiresAuth(this.currentRoute)) {
        this.navigate("/login");
      }
    }
  }

  getAuthStatus() {
    return {
      isAuthenticated: this.isAuthenticated,
      currentRoute: this.currentRoute,
    };
  }
}
