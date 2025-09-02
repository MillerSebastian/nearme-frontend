export class LandingPage {
  constructor() {
    console.log("LandingPage constructor started");
    this.init();
    // Check router availability
    setTimeout(() => {
      this.checkRouterAvailability();
    }, 200);
  }

  init() {
    console.log("LandingPage init started");
    this.render();
    this.bindEvents();
    this.loadExternalResources();
    console.log("LandingPage init completed");
  }

  loadExternalResources() {
    // Load Bootstrap CSS
    if (!document.querySelector('link[href*="bootstrap"]')) {
      const bootstrapCSS = document.createElement("link");
      bootstrapCSS.rel = "stylesheet";
      bootstrapCSS.href =
        "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css";
      document.head.appendChild(bootstrapCSS);
    }

    // Load FontAwesome CSS
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesomeCSS = document.createElement("link");
      fontAwesomeCSS.rel = "stylesheet";
      fontAwesomeCSS.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      document.head.appendChild(fontAwesomeCSS);
    }

    // Load Google Fonts
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
      const googleFonts = document.createElement("link");
      googleFonts.rel = "stylesheet";
      googleFonts.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap";
      document.head.appendChild(googleFonts);
    }

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      leafletCSS.integrity =
        "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      leafletCSS.crossOrigin = "";
      document.head.appendChild(leafletCSS);
    }

    // Load custom CSS files
    const cssFiles = [
      "cssLanding/main.css",
      "cssLanding/components.css",
      "cssLanding/responsive.css",
      "cssLanding/animations.css",
      "cssLanding/accessibility.css",
      "cssLanding/enhancements.css",
      "cssLanding/feature-cards-fix.css",
      "cssLanding/final-fixes.css",
      "cssLanding/emergency-fix.css",
    ];

    cssFiles.forEach((cssFile) => {
      if (!document.querySelector(`link[href*="${cssFile}"]`)) {
        const customCSS = document.createElement("link");
        customCSS.rel = "stylesheet";
        customCSS.href = cssFile;
        document.head.appendChild(customCSS);
      }
    });
  }

  render() {
    const mainContent = document.getElementById("root");
    mainContent.innerHTML = `
      <!-- Skip Link for Accessibility -->
      <a href="#main-content" class="skip-link sr-only sr-only-focusable">Skip to main content</a>

      <!-- Navigation -->
      <nav class="navbar navbar-expand-lg fixed-top" id="mainNavbar">
        <div class="container">
          <a class="navbar-brand" href="#" id="navbarBrand">
            <i class="fas fa-map-marker-alt"></i>
            <span>NearMe</span>
          </a>
          
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <a class="nav-link" href="#home">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#features">Features</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#benefits">Benefits</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#testimonials">Testimonials</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#register-store">Register Store</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section id="home" class="hero" id="main-content">
        <div class="hero-background">
          <div class="geometric-shapes">
            <div class="shape shape-1" data-parallax="0.5"></div>
            <div class="shape shape-2" data-parallax="0.3"></div>
            <div class="shape shape-3" data-parallax="0.7"></div>
            <div class="shape shape-4" data-parallax="0.2"></div>
          </div>
          
          <!-- Animated background icons -->
          <div class="floating-icons">
            <div class="floating-icon icon-1" data-float="slow">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="floating-icon icon-2" data-float="fast">
              <i class="fas fa-tags"></i>
            </div>
            <div class="floating-icon icon-3" data-float="medium">
              <i class="fas fa-gift"></i>
            </div>
            <div class="floating-icon icon-4" data-float="slow">
              <i class="fas fa-heart"></i>
            </div>
            <div class="floating-icon icon-5" data-float="fast">
              <i class="fas fa-bolt"></i>
            </div>
            <div class="floating-icon icon-6" data-float="medium">
              <i class="fas fa-shield-alt"></i>
            </div>
          </div>
        </div>
        
        <div class="container">
          <div class="row align-items-center min-vh-100">
            <div class="col-lg-6">
              <div class="hero-content" data-animate="fadeInLeft">
                <div class="hero-badge">
                  <i class="fas fa-star"></i>
                  <span>#1 in local search</span>
                </div>
                <h1 class="hero-title">
                  Find products in nearby stores
                </h1>
                <p class="hero-description">
                  NearMe revolutionizes the way to discover local businesses. We connect smart consumers 
                  with the best stores in their neighborhood through advanced geolocation technology.
                </p>
                <div class="hero-actions">
                  <button class="btn btn-primary btn-lg hero-btn" id="startBtn" data-hover-animate="pulse">
                    <i class="fas fa-rocket"></i>
                    <span>Get Started</span>
                    <div class="btn-ripple"></div>
                  </button>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="hero-visual" data-animate="fadeInRight">
                <div class="hero-image-container">
                  <div class="hero-visual-design">
                    <!-- Main store icon -->
                    <div class="main-store-icon">
                      <i class="fas fa-store"></i>
                    </div>
                    
                    <!-- Location elements -->
                    <div class="location-elements">
                      <div class="location-pin">
                        <i class="fas fa-map-marker-alt"></i>
                      </div>
                      <div class="location-dots">
                        <span class="dot dot-1"></span>
                        <span class="dot dot-2"></span>
                        <span class="dot dot-3"></span>
                      </div>
                    </div>
                    
                    <!-- Connection elements -->
                    <div class="connection-lines">
                      <div class="line line-1"></div>
                      <div class="line line-2"></div>
                      <div class="line line-3"></div>
                    </div>
                    
                    <!-- Product icons -->
                    <div class="product-icons">
                      <div class="product-icon product-1">
                        <i class="fas fa-shopping-bag"></i>
                      </div>
                      <div class="product-icon product-2">
                        <i class="fas fa-tags"></i>
                      </div>
                      <div class="product-icon product-3">
                        <i class="fas fa-gift"></i>
                      </div>
                    </div>
                  </div>
                  <div class="floating-elements">
                    <div class="floating-card floating-card-1" data-float="slow">
                      <i class="fas fa-shopping-bag"></i>
                      <span>Products</span>
                    </div>
                    <div class="floating-card floating-card-2" data-float="fast">
                      <i class="fas fa-store"></i>
                      <span>Stores</span>
                    </div>
                    <div class="floating-card floating-card-3" data-float="medium">
                      <i class="fas fa-map-pin"></i>
                      <span>Location</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="scroll-indicator show" role="button" tabindex="0" aria-label="Scroll down to see more content">
          <i class="fas fa-chevron-down"></i>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features">
        <div class="container">
          <div class="section-header text-center" data-animate="fadeInUp">
            <div class="section-badge">Features</div>
            <h2 class="section-title">Why choose NearMe?</h2>
            <p class="section-description">
              Our platform offers a unique experience to connect consumers with local businesses
            </p>
          </div>
          
          <div class="features-grid">
            <div class="feature-card" data-animate="fadeInUp" data-delay="0.1" data-hover-animate="scale">
              <div class="feature-icon-container">
                <div class="feature-icon">
                  <i class="fas fa-search-location"></i>
                </div>
                <div class="icon-background"></div>
              </div>
              <h4>Smart Search</h4>
              <p>Find specific products in nearby stores with our advanced geolocation technology.</p>
              <div class="feature-link">
                <a href="#" class="learn-more">Learn more <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            
            <div class="feature-card" data-animate="fadeInUp" data-delay="0.2" data-hover-animate="scale">
              <div class="feature-icon-container">
                <div class="feature-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="icon-background"></div>
              </div>
              <h4>Real-time Hours</h4>
              <p>Know the updated store hours and avoid unnecessary visits.</p>
              <div class="feature-link">
                <a href="#" class="learn-more">Learn more <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            
            <div class="feature-card" data-animate="fadeInUp" data-delay="0.3" data-hover-animate="scale">
              <div class="feature-icon-container">
                <div class="feature-icon">
                  <i class="fas fa-star"></i>
                </div>
                <div class="icon-background"></div>
              </div>
              <h4>Verified Reviews</h4>
              <p>Read authentic opinions from other users to make informed decisions.</p>
              <div class="feature-link">
                <a href="#" class="learn-more">Learn more <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            
            <div class="feature-card" data-animate="fadeInUp" data-delay="0.4" data-hover-animate="scale">
              <div class="feature-icon-container">
                <div class="feature-icon">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                <div class="icon-background"></div>
              </div>
              <h4>Mobile App</h4>
              <p>Access NearMe from any device with our optimized application.</p>
              <div class="feature-link">
                <a href="#" class="learn-more">Learn more <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            
            <div class="feature-card" data-animate="fadeInUp" data-delay="0.5" data-hover-animate="scale">
              <div class="feature-icon-container">
                <div class="feature-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="icon-background"></div>
              </div>
              <h4>Guaranteed Security</h4>
              <p>Your data is protected with the highest security standards.</p>
              <div class="feature-link">
                <a href="#" class="learn-more">Learn more <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
            
            <div class="feature-card" data-animate="fadeInUp" data-delay="0.6" data-hover-animate="scale">
              <div class="feature-icon-container">
                <div class="feature-icon">
                  <i class="fas fa-headset"></i>
                </div>
                <div class="icon-background"></div>
              </div>
              <h4>24/7 Support</h4>
              <p>Our team is available to help you at any time of the day.</p>
              <div class="feature-link">
                <a href="#" class="learn-more">Learn more <i class="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Business Benefits Section -->
      <section id="benefits" class="statistics">
        <div class="container">
          <div class="section-header text-center mb-5" data-animate="fadeInUp">
            <div class="section-badge">Proven Benefits</div>
            <h2 class="section-title">Why do stores choose NearMe?</h2>
            <p class="section-description">
              Real data that demonstrates the value of our platform for your business
            </p>
          </div>
          <div class="stats-container">
            <div class="stat-item-large" data-animate="fadeInUp" data-delay="0.1">
              <div class="stat-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number" data-counter="40">0%</div>
                <div class="stat-label">Sales Increase</div>
              </div>
            </div>
            
            <div class="stat-item-large" data-animate="fadeInUp" data-delay="0.2">
              <div class="stat-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number" data-counter="2">0min</div>
                <div class="stat-label">Minutes to Register</div>
              </div>
            </div>
            
            <div class="stat-item-large" data-animate="fadeInUp" data-delay="0.3">
              <div class="stat-icon">
                <i class="fas fa-dollar-sign"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number" data-counter="100">0%</div>
                <div class="stat-label">Free for Stores</div>
              </div>
            </div>
            
            <div class="stat-item-large" data-animate="fadeInUp" data-delay="0.4">
              <div class="stat-icon">
                <i class="fas fa-mobile-alt"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number" data-counter="24">0h</div>
                <div class="stat-label">Hours of Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section id="testimonials" class="testimonials">
        <div class="container">
          <div class="section-header text-center" data-animate="fadeInUp">
            <div class="section-badge">Testimonials</div>
            <h2 class="section-title">What our users say</h2>
            <p class="section-description">
              Discover why thousands of people trust NearMe
            </p>
          </div>
          
          <div class="testimonials-grid">
            <div class="testimonial-card" data-animate="fadeInUp" data-delay="0.1" data-hover-animate="lift">
              <div class="testimonial-content">
                <div class="quote-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <p>"NearMe has helped me discover amazing stores in my neighborhood that I didn't know about. The search accuracy is amazing and the app is super intuitive."</p>
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">
                  <img src="https://img.freepik.com/foto-gratis/estilo-vida-emociones-gente-concepto-casual-confiado-agradable-sonriente-mujer-asiatica-brazos-cruzados-pecho-seguro-listo-ayudar-escuchando-companeros-trabajo-participando-conversacion_1258-59335.jpg?t=st=1756325889~exp=1756329489~hmac=b05f1c94f5d922a2871b25bfb70dd7211a5f1a59e60f3b1e71a2906cfb925b6a&w=1480" alt="Maria C.">
                </div>
                <div class="author-info">
                  <h6 class="author-name">Maria C.</h6>
                  <span class="author-role">Frequent customer</span>
                  <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="testimonial-card" data-animate="fadeInUp" data-delay="0.2" data-hover-animate="lift">
              <div class="testimonial-content">
                <div class="quote-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <p>"As a store owner, NearMe has brought me many new customers. The platform is fantastic and the support for local businesses is exceptional."</p>
              </div>
              <div class="testimonial-author" id="testimonial-author-2">
                <div class="author-avatar">
                  <img src="https://img.freepik.com/foto-gratis/apuesto-joven-brazos-cruzados-sobre-fondo-blanco_23-2148222620.jpg?t=st=1756326044~exp=1756329644~hmac=4ae9a52623a7f8f9d4f83220f7082681d164cceda3f9b4595a8ff418cc314728&w=1060" alt="John L.">
                </div>
                <div class="author-info">
                  <h6 class="author-name">John L.</h6>
                  <span class="author-role">Store owner</span>
                  <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="testimonial-card" data-animate="fadeInUp" data-delay="0.3" data-hover-animate="lift">
              <div class="testimonial-content">
                <div class="quote-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <p>"The location-based search is super accurate. I found exactly what I was looking for just 2 blocks from home. NearMe has changed my way of local shopping."</p>
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">
                  <img src="https://img.freepik.com/foto-gratis/disparo-vertical-feliz-mujer-piel-oscura-pelo-rizado_273609-15519.jpg?t=st=1756325960~exp=1756329560~hmac=797629bd6167cae53cdf2595dd8c762d15de7f92f038425b29a81fb30f8be91f&w=1060" alt="Anna S.">
                </div>
                <div class="author-info">
                  <h6 class="author-name">Anna S.</h6>
                  <span class="author-role">Active user</span>
                  <div class="rating">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Store Registration CTA Section -->
      <section id="register-store" class="store-register-cta">
        <div class="container">
          <div class="section-header text-center" data-animate="fadeInUp">
            <div class="section-badge">Start Now!</div>
            <h2 class="section-title text-white">Ready to discover NearMe?</h2>
            <p class="section-description text-white-50 mb-4">
              Join thousands of users who are already finding amazing products near home
            </p>
          </div>
          <div class="row align-items-center g-4">
            <div class="col-lg-5">
              <ul class="benefits-checklist">
                <li><i class="fas fa-users"></i><span>Immediate reach to nearby customers</span></li>
                <li><i class="fas fa-chart-line"></i><span>Proven sales increase</span></li>
                <li><i class="fas fa-clock"></i><span>Registration and management in minutes</span></li>
                <li><i class="fas fa-shield-alt"></i><span>100% free, no hidden costs</span></li>
              </ul>
            </div>
            <div class="col-lg-7 text-center">
              <div class="cta-panel">
                <div class="cta-main-action mb-4">
                  <h3 class="text-white mb-3">Start your NearMe experience now!</h3>
                  <p class="text-white-50 mb-4">Discover amazing stores near you and find exactly what you're looking for</p>
                  <button class="btn btn-warning btn-lg py-4 px-5" id="registerStoreBtn" style="font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 30px rgba(255, 193, 7, 0.4); border: none; border-radius: 50px;">
                    <i class="fas fa-rocket me-3"></i>
                    START NOW!
                    <i class="fas fa-arrow-right ms-3"></i>
                  </button>
                </div>
                <div class="cta-extra mt-4 text-start">
                  <div class="d-flex align-items-center mb-2"><i class="fas fa-box-open text-success me-2"></i><span>Publish your products easily</span></div>
                  <div class="d-flex align-items-center mb-2"><i class="fas fa-map-marker-alt text-info me-2"></i><span>Appear in local searches</span></div>
                  <div class="d-flex align-items-center"><i class="fas fa-headset text-warning me-2"></i><span>24/7 business support</span></div>
                </div>
                <small class="text-white-50 d-block mt-3">No commitments • Active in 2 minutes</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="row g-4">
              <div class="col-lg-4">
                <div class="footer-brand">
                  <div class="footer-logo">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>NearMe</span>
                  </div>
                  <p class="footer-description">
                    We connect smart consumers with the best local stores through advanced geolocation technology.
                  </p>
                  <div class="social-links">
                    <a href="#" class="social-link" data-hover-animate="bounce">
                      <i class="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" class="social-link" data-hover-animate="bounce">
                      <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="social-link" data-hover-animate="bounce">
                      <i class="fab fa-instagram"></i>
                    </a>
                    <a href="#" class="social-link" data-hover-animate="bounce">
                      <i class="fab fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="col-lg-2">
                <div class="footer-links">
                  <h6>Product</h6>
                  <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#stores">For Stores</a></li>
                    <li><a href="#api">API</a></li>
                  </ul>
                </div>
              </div>
              
              <div class="col-lg-2">
                <div class="footer-links">
                  <h6>Company</h6>
                  <ul>
                    <li><a href="#about">About</a></li>
                    <li><a href="#careers">Careers</a></li>
                    <li><a href="#press">Press</a></li>
                    <li><a href="#partners">Partners</a></li>
                  </ul>
                </div>
              </div>
              
              <div class="col-lg-2">
                <div class="footer-links">
                  <h6>Support</h6>
                  <ul>
                    <li><a href="#help">Help Center</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="#status">System Status</a></li>
                    <li><a href="#docs">Documentation</a></li>
                  </ul>
                </div>
              </div>
              
              <div class="col-lg-2">
                <div class="footer-links">
                  <h6>Legal</h6>
                  <ul>
                    <li><a href="#privacy">Privacy</a></li>
                    <li><a href="#terms">Terms</a></li>
                    <li><a href="#cookies">Cookies</a></li>
                    <li><a href="#security">Security</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="footer-bottom">
            <div class="row align-items-center">
              <div class="col-md-6">
                <p class="copyright">&copy; 2024 NearMe. All rights reserved.</p>
              </div>
              <div class="col-md-6 text-md-end">
                <div class="footer-bottom-links">
                  <a href="#privacy">Privacy</a>
                  <a href="#terms">Terms</a>
                  <a href="#sitemap">Sitemap</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <!-- Back to Top Button -->
      <button class="back-to-top" id="backToTop" data-hover-animate="pulse">
        <i class="fas fa-chevron-up"></i>
      </button>
    `;
  }

  bindEvents() {
    // Small delay to ensure DOM is completely rendered
    setTimeout(() => {
      // NearMe logo in header - navigate to /home
      const navbarBrand = document.getElementById("navbarBrand");
      if (navbarBrand) {
        console.log("NearMe logo found, adding event listener");
        navbarBrand.addEventListener("click", (e) => {
          e.preventDefault();
          console.log("NearMe logo clicked - navigating to /home");
          this.navigateToRoute("/home");
        });
      } else {
        console.warn("NearMe logo not found");
      }

      // Start button - navigate to /home
      const startBtn = document.getElementById("startBtn");
      if (startBtn) {
        console.log("Start button found, adding event listener");
        startBtn.addEventListener("click", () => {
          console.log("Start button clicked");
          this.navigateToRoute("/home");
        });
      } else {
        console.warn("Start button not found");
      }

      // Register Store button - navigate to /register
      const registerStoreBtn = document.getElementById("registerStoreBtn");
      if (registerStoreBtn) {
        console.log(
          "Register Store button found, adding event listener"
        );
        registerStoreBtn.addEventListener("click", () => {
          console.log("Register Store button clicked");
          this.navigateToRoute("/register");
        });
      } else {
        console.warn("Register Store button not found");
      }
    }, 100);

    // Smooth scroll for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href.startsWith("#") && href !== "#") {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      });
    });

    // Back to top button
    const backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.style.display = "block";
        } else {
          backToTopBtn.style.display = "none";
        }
      });

      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    // Load external JavaScript files with a small delay to ensure router is ready
    setTimeout(() => {
      this.loadExternalScripts();
    }, 100);
  }

  loadExternalScripts() {
    // Load Bootstrap JS
    if (!document.querySelector('script[src*="bootstrap"]')) {
      const bootstrapJS = document.createElement("script");
      bootstrapJS.src =
        "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js";
      document.body.appendChild(bootstrapJS);
    }

    // Load FontAwesome JS
    if (!document.querySelector('script[src*="font-awesome"]')) {
      const fontAwesomeJS = document.createElement("script");
      fontAwesomeJS.src =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js";
      document.body.appendChild(fontAwesomeJS);
    }

    // Load Leaflet JS
    if (!document.querySelector('script[src*="leaflet"]')) {
      const leafletJS = document.createElement("script");
      leafletJS.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletJS.integrity =
        "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      leafletJS.crossOrigin = "";
      document.body.appendChild(leafletJS);
    }

    // Load custom JS files - Temporarily commented to avoid 404 errors
    // const jsFiles = ["/src/utils/animations.js", "/src/utils/main.js"];

    // jsFiles.forEach((jsFile) => {
    //   if (!document.querySelector(`script[src*="${jsFile}"]`)) {
    //     const customJS = document.createElement("script");
    //     customJS.src = jsFile;
    //     customJS.type = "module";
    //     document.body.appendChild(customJS);
    //   }
    // });

    // For now, load only basic functionalities
    console.log("Landing page scripts loaded");
  }

  destroy() {
    // Cleanup if needed
    const app = document.getElementById("root");
    if (app) {
      app.innerHTML = "";
    }
  }

  // Method to check if router is available
  checkRouterAvailability() {
    if (window.app && window.app.router) {
      console.log("Router available");
      return true;
    } else {
      console.log("Router not available, retrying in 500ms");
      setTimeout(() => {
        this.checkRouterAvailability();
      }, 500);
      return false;
    }
  }

  // Method to navigate to a specific route
  navigateToRoute(route) {
    console.log(`LandingPage.navigateToRoute() called with route: ${route}`);

    // Try to use the SPA router if available
    if (window.app && window.app.router) {
      console.log("SPA router available, navigating...");
      try {
        window.app.router.navigate(route);
      } catch (error) {
        console.error("Error navigating with router:", error);
        // Fallback to hash navigation
        console.log("Using hash navigation fallback");
        window.location.hash = `#${route}`;
      }
    } else {
      console.log("SPA router not available, using hash navigation");
      // Use hash navigation directly as fallback
      window.location.hash = `#${route}`;
    }
  }
}
