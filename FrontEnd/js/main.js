/**
 * NEARME LANDING PAGE - MAIN JAVASCRIPT
 * ======================================
 * Core functionality and initialization with advanced animations
 */

// Main App Class
class NearMeApp {
    constructor() {
        this.isInitialized = false;
        this.currentSection = '';
        this.sections = [];
        this.animationObserver = null;
        this.parallaxElements = [];
        this.counterElements = [];
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) return;
        
        try {
            this.setupEventListeners();
            this.initializeComponents();
            this.setupScrollAnimations();
            this.setupParallaxEffects();
            this.setupCounterAnimations();
            this.setupPerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('🚀 NearMe Landing Page Initialized Successfully');
            
        } catch (error) {
            console.error('❌ Error initializing NearMe app:', error);
        }
    }



    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMReady();
        });

        // Window Load
        window.addEventListener('load', () => {
            this.onWindowLoad();
        });

        // Scroll events
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Resize events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Navigation events
        this.setupNavigationEvents();
        
        // Form events
        this.setupFormEvents();
        
        // Accessibility events
        this.setupAccessibilityEvents();
        
        // Back to top button
        this.setupBackToTop();
    }

    /**
     * Setup back to top functionality
     */
    setupBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    /**
     * Setup scroll indicator functionality
     */
    setupScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            // Add click functionality
            scrollIndicator.addEventListener('click', () => {
                const featuresSection = document.getElementById('caracteristicas');
                if (featuresSection) {
                    featuresSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
            
            // Hide scroll indicator immediately if page is scrolled
            if (window.pageYOffset > 100) {
                this.forceHideScrollIndicator();
            }
        }
    }

    /**
     * Setup navigation event listeners
     */
    setupNavigationEvents() {
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                    
                    // Close mobile menu if open
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            });
        });

        // Mobile menu toggle
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }

    /**
     * Setup form event listeners
     */
    setupFormEvents() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmit(e.target);
            });
        }

        // Form validation on input
        const formInputs = document.querySelectorAll('.form-control');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateFormField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    /**
     * Setup accessibility event listeners
     */
    setupAccessibilityEvents() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
            
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });

        // Focus management
        document.addEventListener('focusin', (e) => {
            this.handleFocusIn(e);
        });

        // Skip to content
        const skipLinks = document.querySelectorAll('[data-skip-to]');
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-skip-to');
                this.skipToContent(targetId);
            });
        });
    }

    /**
     * Initialize all components
     */
    initializeComponents() {
        this.initializeTooltips();
        this.initializeModals();
        this.initializeFloatingElements();
        this.initializeGeometricShapes();
        this.initializeScrollAnimations();
        this.initializeHoverAnimations();
        this.initializeNavbarAnimations();
        this.setupStoreRegistrationModal();
        this.initializeMapDemo();
    }

    /**
     * Initialize Bootstrap tooltips
     */
    initializeTooltips() {
        if (typeof bootstrap !== 'undefined') {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }

    /**
     * Initialize Bootstrap modals
     */
    initializeModals() {
        if (typeof bootstrap !== 'undefined') {
            const modalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="modal"]'));
            modalTriggerList.map(function (modalTriggerEl) {
                return new bootstrap.Modal(modalTriggerEl);
            });
        }
    }

    /**
     * Initialize floating elements
     */
    initializeFloatingElements() {
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach(card => {
            const floatType = card.dataset.float || 'medium';
            card.style.animation = `floatingCard${floatType.charAt(0).toUpperCase() + floatType.slice(1)} 6s ease-in-out infinite`;
        });
    }

    /**
     * Initialize geometric shapes
     */
    initializeGeometricShapes() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        this.parallaxElements.forEach(element => {
            this.animationObserver?.observe(element);
        });
    }

    /**
     * Setup scroll animations
     */
    setupScrollAnimations() {
        this.sections = document.querySelectorAll('section[id]');
        this.setupAnimationObserver();
    }

    /**
     * Setup animation observer
     */
    setupAnimationObserver() {
        if ('IntersectionObserver' in window) {
            this.animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerElementAnimation(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            const animatedElements = document.querySelectorAll('[data-animate]');
            animatedElements.forEach(el => {
                this.animationObserver.observe(el);
            });
        }
    }

    /**
     * Setup parallax effects
     */
    setupParallaxEffects() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
    }

    /**
     * Setup counter animations
     */
    setupCounterAnimations() {
        this.counterElements = document.querySelectorAll('[data-counter]');
        this.counterElements.forEach(element => {
            this.animationObserver?.observe(element);
        });
    }

    /**
     * Initialize hover animations
     */
    initializeHoverAnimations() {
        console.log('Initializing hover animations...');
        const hoverElements = document.querySelectorAll('[data-hover-animate]');
        console.log('Found hover elements:', hoverElements.length);
        
        hoverElements.forEach((element, index) => {
            console.log(`Setting up hover for element ${index}:`, element, 'with animation:', element.dataset.hoverAnimate);
            this.setupHoverAnimation(element);
        });
    }

    /**
     * Initialize navbar animations
     */
    initializeNavbarAnimations() {
        const navbar = document.getElementById('mainNavbar');
        if (navbar) {
            // Add initial animation
            navbar.style.animation = 'navbarFadeIn 0.6s ease-out forwards';
            
            // Setup mobile menu animations
            this.setupMobileMenuAnimations();
        }
    }

    /**
     * Setup mobile menu animations
     */
    setupMobileMenuAnimations() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', () => {
                // Add animation class when menu opens
                setTimeout(() => {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarCollapse.style.animation = 'slideDown 0.3s ease-out forwards';
                    }
                }, 10);
            });
        }
    }

    /**
     * Setup store registration modal
     */
    setupStoreRegistrationModal() {
        const form = document.getElementById('storeRegistrationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStoreRegistration(form);
            });
        }
    }

    /**
     * Handle store registration form submission
     */
    handleStoreRegistration(form) {
        const formData = new FormData(form);
        const storeData = Object.fromEntries(formData.entries());
        
        // Aquí puedes agregar la lógica para enviar los datos
        console.log('Datos de la tienda:', storeData);
        
        // Mostrar mensaje de éxito
        alert('¡Gracias! Tu tienda ha sido registrada exitosamente. Nos pondremos en contacto contigo pronto.');
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('storeRegistrationModal'));
        if (modal) {
            modal.hide();
        }
        
        // Limpiar el formulario
        form.reset();
    }

    /**
     * Setup hover animation for element
     */
    setupHoverAnimation(element) {
        const animationType = element.dataset.hoverAnimate;
        
        element.addEventListener('mouseenter', () => {
            this.triggerHoverAnimation(element, animationType, 'in');
        });
        
        element.addEventListener('mouseleave', () => {
            this.triggerHoverAnimation(element, animationType, 'out');
        });
    }

    /**
     * Trigger element animation
     */
    triggerElementAnimation(element) {
        const animationType = element.dataset.animate;
        const delay = parseFloat(element.dataset.delay) || 0;
        
        setTimeout(() => {
            element.classList.add('animate');
            this.playSpecificAnimation(element, animationType);
            
            // Trigger counter animation if element has counter
            if (element.dataset.counter) {
                this.animateCounter(element);
            }
        }, delay * 1000);
    }

    /**
     * Play specific animation type
     */
    playSpecificAnimation(element, animationType) {
        const animations = {
            'fadeIn': 'fadeIn 0.8s ease forwards',
            'fadeInUp': 'fadeInUp 0.8s ease forwards',
            'fadeInDown': 'fadeInDown 0.8s ease forwards',
            'fadeInLeft': 'fadeInLeft 0.8s ease forwards',
            'fadeInRight': 'fadeInRight 0.8s ease forwards',
            'fadeInScale': 'fadeInScale 0.8s ease forwards',
            'slideInFromTop': 'slideInFromTop 0.8s ease forwards',
            'slideInFromBottom': 'slideInFromBottom 0.8s ease forwards',
            'bounceIn': 'bounceIn 0.8s ease forwards',
            'rotateIn': 'rotateIn 0.8s ease forwards'
        };

        const animation = animations[animationType] || 'fadeIn 0.8s ease forwards';
        element.style.animation = animation;
    }

    /**
     * Trigger hover animation
     */
    triggerHoverAnimation(element, animationType, direction) {
        if (direction === 'in') {
            this.playHoverAnimation(element, animationType, 'in');
        } else {
            this.playHoverAnimation(element, animationType, 'out');
        }
    }

    /**
     * Play hover animation
     */
    playHoverAnimation(element, animationType, direction) {
        const animations = {
            'pulse': direction === 'in' ? 'pulse 0.6s ease-in-out' : 'none',
            'shake': direction === 'in' ? 'shake 0.6s ease-in-out' : 'none',
            'bounce': direction === 'in' ? 'bounce 0.6s ease-in-out' : 'none',
            'rotate': direction === 'in' ? 'rotate 0.6s ease-in-out' : 'none',
            'scale': direction === 'in' ? 'scaleHover 0.3s ease-in-out forwards' : 'scaleHoverOut 0.3s ease-in-out forwards',
            'glow': direction === 'in' ? 'glowHover 1s ease-in-out infinite' : 'none',
            'lift': direction === 'in' ? 'lift 0.3s ease-in-out forwards' : 'liftOut 0.3s ease-in-out forwards'
        };

        const animation = animations[animationType] || 'none';
        element.style.animation = animation;
        
        // Reset animation when it completes
        if (direction === 'out') {
            element.addEventListener('animationend', () => {
                element.style.animation = 'none';
            }, { once: true });
        }
    }

    /**
     * Animate counter
     */
    animateCounter(element) {
        const counterElement = element.querySelector('.stat-number');
        if (!counterElement) return;

        const target = parseInt(element.dataset.counter);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        // Get the unit from the current text content
        const currentText = counterElement.textContent;
        const unit = currentText.replace(/[0-9]/g, '');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format the number with the appropriate unit
            let displayText = Math.floor(current).toString();
            if (unit) {
                displayText += unit;
            }
            
            counterElement.textContent = displayText;
            
            // Add counter animation effect
            counterElement.style.animation = 'counterIncrement 0.3s ease-in-out';
            setTimeout(() => {
                counterElement.style.animation = 'none';
            }, 300);
        }, 16);
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        this.updateActiveNavigation();
        this.updateParallaxEffects();
        this.updateBackToTopButton();
        this.updateNavbarScroll();
        this.updateScrollIndicator();
    }

    /**
     * Update active navigation based on scroll position
     */
    updateActiveNavigation() {
        const scrollPosition = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.setActiveNavigation(sectionId);
            }
        });
    }

    /**
     * Set active navigation item
     */
    setActiveNavigation(sectionId) {
        if (this.currentSection === sectionId) return;
        
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.currentSection = sectionId;
    }

    /**
     * Update parallax effects on scroll
     */
    updateParallaxEffects() {
        const scrolled = window.pageYOffset;
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed * 0.5);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    /**
     * Update back to top button
     */
    updateBackToTopButton() {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }

    /**
     * Update navbar scroll effect
     */
    updateNavbarScroll() {
        const navbar = document.getElementById('mainNavbar');
        if (navbar) {
            if (window.pageYOffset > 50) {
                if (!navbar.classList.contains('scrolled')) {
                    navbar.classList.add('scrolled');
                }
            } else {
                if (navbar.classList.contains('scrolled')) {
                    navbar.classList.remove('scrolled');
                }
            }
        }
    }

    /**
     * Update scroll indicator visibility
     */
    updateScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            if (window.pageYOffset > 100) {
                scrollIndicator.classList.remove('show');
            } else {
                scrollIndicator.classList.add('show');
            }
        }
    }

    /**
     * Force hide scroll indicator
     */
    forceHideScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.classList.remove('show');
        }
    }

    /**
     * Handle resize events
     */
    handleResize() {
        this.updateLayout();
        this.debounceScrollAnimations();
    }

    /**
     * Update layout based on screen size
     */
    updateLayout() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 991;
        
        document.body.classList.toggle('mobile', isMobile);
        document.body.classList.toggle('tablet', isTablet && !isMobile);
        
        // Adjust floating elements for mobile
        const floatingElements = document.querySelectorAll('.floating-elements');
        floatingElements.forEach(container => {
            if (isMobile) {
                container.style.display = 'none';
            } else {
                container.style.display = 'block';
            }
        });
    }

    /**
     * DOM Ready handler
     */
    onDOMReady() {
        this.setupInitialState();
        this.initializeLazyLoading();
        this.setupServiceWorker();

        this.setupScrollIndicator();
    }

    /**
     * Window Load handler
     */
    onWindowLoad() {
        this.triggerInitialAnimations();
        this.setupPerformanceMonitoring();
        
        // Check scroll indicator on load
        this.updateScrollIndicator();
        
        // Initialize map demo
        this.initializeMapDemo();
    }

    /**
     * Setup initial application state
     */
    setupInitialState() {
        // Add scroll-animate class to elements
        const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .stat-item-large');
        animateElements.forEach(el => {
            el.classList.add('scroll-animate');
        });
        
        // Set initial active navigation
        this.updateActiveNavigation();
        
        // Check initial scroll position for scroll indicator
        this.updateScrollIndicator();
    }



    /**
     * Initialize lazy loading for images
     */
    initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    /**
     * Setup service worker for offline functionality
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    /**
     * Trigger initial animations
     */
    triggerInitialAnimations() {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-stats, .hero-actions');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate');
            }, index * 200);
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('📊 Page Load Performance:', {
                        'DOM Content Loaded': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
                        'Load Complete': `${perfData.loadEventEnd - perfData.loadEventStart}ms`,
                        'Total Load Time': `${perfData.loadEventEnd - perfData.fetchStart}ms`
                    });
                }, 0);
            });
        }
    }

    /**
     * Utility Methods
     */
    
    /**
     * Smooth scroll to element
     */
    smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    /**
     * Check if element is in viewport
     */
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse) {
            navbarCollapse.classList.toggle('show');
        }
    }

    /**
     * Handle contact form submission
     */
    handleContactFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        
        // Simulate form submission
        setTimeout(() => {
            this.showFormSuccess(form);
            submitBtn.classList.remove('loading');
        }, 2000);
    }

    /**
     * Validate form data
     */
    validateForm(data) {
        let isValid = true;
        
        if (!data.name || data.name.trim().length < 2) {
            this.showFieldError('name', 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Ingresa un email válido');
            isValid = false;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            this.showFieldError('message', 'El mensaje debe tener al menos 10 caracteres');
            isValid = false;
        }
        
        return isValid;
    }

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Show field error
     */
    showFieldError(fieldName, message) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('is-invalid');
            
            // Remove existing error message
            const existingError = field.parentNode.querySelector('.invalid-feedback');
            if (existingError) {
                existingError.remove();
            }
            
            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    /**
     * Clear field error
     */
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    /**
     * Show form success message
     */
    showFormSuccess(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.textContent = '¡Mensaje enviado exitosamente! Te responderemos pronto.';
        
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    /**
     * Handle tab navigation for accessibility
     */
    handleTabNavigation(e) {
        // Add focus styles for keyboard navigation
        document.body.classList.add('keyboard-navigation');
    }

    /**
     * Handle escape key
     */
    handleEscapeKey(e) {
        // Close modals or dropdowns
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const closeBtn = modal.querySelector('.btn-close');
            if (closeBtn) closeBtn.click();
        });
    }

    /**
     * Handle focus in for accessibility
     */
    handleFocusIn(e) {
        // Add focus ring styles
        e.target.classList.add('focus-visible');
    }

    /**
     * Skip to content for accessibility
     */
    skipToContent(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView();
        }
    }

    /**
     * Debounce scroll animations
     */
    debounceScrollAnimations() {
        // Reset scroll animations on resize
        const animatedElements = document.querySelectorAll('.scroll-animate.animate');
        animatedElements.forEach(el => {
            el.classList.remove('animate');
        });
        
        // Re-observe elements
        setTimeout(() => {
            this.setupAnimationObserver();
        }, 100);
    }

    /**
     * Cleanup
     */
    cleanup() {
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        this.parallaxElements = [];
        this.counterElements = [];
        this.isInitialized = false;
    }

    // Initialize search demo animation
    initializeMapDemo() {
        // Setup Leaflet map and demo search if elements exist
        const mapContainer = document.getElementById('demoLeafletMap');
        const input = document.getElementById('nearmeSearchInput');
        const btn = document.getElementById('nearmeSearchBtn');
        const resultsGrid = document.getElementById('resultsGrid');
        const resultsCount = document.querySelector('#searchResults .results-count');
        const resultsHeader = document.querySelector('#searchResults .results-header h3');

        if (!mapContainer || !resultsGrid || !resultsCount || !resultsHeader) return;

        // Initialize map
        const defaultCoords = { lat: 10.0, lng: -10.0 }; // Ubicación arbitraria fija para la demo
        const map = L.map('demoLeafletMap', { zoomControl: true });
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        });
        tileLayer.addTo(map);

        // Track user and radius elements
        let userCoords = { ...defaultCoords };
        let radiusMeters = 600; // Wider radius to show nearby options
        let userCircle = null;
        let userMarker = null;

        // Simulate geolocation
        const setViewToUser = (coords) => {
            userCoords = { ...coords };
            map.setView([coords.lat, coords.lng], 14);
            if (userCircle) map.removeLayer(userCircle);
            if (userMarker) map.removeLayer(userMarker);
            userCircle = L.circle([coords.lat, coords.lng], { radius: radiusMeters, color: '#0d6efd', fillColor: '#0d6efd', fillOpacity: 0.15 }).addTo(map);
            userMarker = L.marker([coords.lat, coords.lng], { title: 'Tú' }).addTo(map).bindPopup('Tu ubicación');
        };
        // Force fixed arbitrary location (no real geolocation)
        setViewToUser(defaultCoords);

        // Helpers
        const haversineMeters = (a, b) => {
            const toRad = d => d * Math.PI / 180;
            const R = 6371000;
            const dLat = toRad(b.lat - a.lat);
            const dLng = toRad(b.lng - a.lng);
            const lat1 = toRad(a.lat);
            const lat2 = toRad(b.lat);
            const sinDLat = Math.sin(dLat / 2);
            const sinDLng = Math.sin(dLng / 2);
            const c = 2 * Math.asin(Math.sqrt(
                sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
            ));
            return R * c;
        };

        const randomNearbyCoord = (center, maxMeters = radiusMeters * 1.1) => {
            // random bearing and distance within maxMeters
            const distance = Math.random() * maxMeters;
            const bearing = Math.random() * 2 * Math.PI;
            const R = 6371000;
            const lat1 = center.lat * Math.PI / 180;
            const lng1 = center.lng * Math.PI / 180;
            const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / R) + Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearing));
            const lng2 = lng1 + Math.atan2(
                Math.sin(bearing) * Math.sin(distance / R) * Math.cos(lat1),
                Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
            );
            return { lat: lat2 * 180 / Math.PI, lng: lng2 * 180 / Math.PI };
        };

        const generateStoresAroundUser = () => {
            const names = ['Ferretería Centro', 'Ferretería Roma', 'Ferretería Condesa', 'Ferretería Polanco', 'Ferretería Del Valle', 'Ferretería Nápoles'];
            const stores = names.map((name, idx) => {
                const coords = randomNearbyCoord(userCoords);
                const distanceM = haversineMeters(userCoords, coords);
                const distanceKm = Math.round((distanceM / 1000) * 10) / 10;
                const price = [15, 18, 12, 22, 16, 14][idx % 6];
                return {
                    id: name.toLowerCase().replace(/\s+/g, '-'),
                    name,
                    coords,
                    address: 'Calle simulada s/n',
                    price,
                    distanceKm,
                    distanceM
                };
            });
            return stores;
        };

        let allStores = generateStoresAroundUser();

        const markers = [];
        const markerById = {};
        const renderMarkers = (list) => {
            // Clear previous
            markers.forEach(m => map.removeLayer(m));
            markers.length = 0;
            Object.keys(markerById).forEach(k => delete markerById[k]);
            // Add new
            list.forEach(s => {
                const m = L.marker([s.coords.lat, s.coords.lng]).addTo(map)
                    .bindPopup(`<strong>${s.name}</strong><br>${s.address}<br>Precio: $${s.price.toFixed(2)}`);
                markers.push(m);
                markerById[s.id] = m;
            });
        };

        const renderResults = (list, queryText) => {
            resultsGrid.innerHTML = '';
            resultsHeader.textContent = queryText ? `Resultados para "${queryText}"` : 'Resultados';
            resultsCount.textContent = `${list.length} ${list.length === 1 ? 'tienda' : 'tiendas'}`;
            list.forEach(s => {
                const card = document.createElement('div');
                card.className = 'result-card';
                card.setAttribute('data-store', s.id);
                card.innerHTML = `
                    <div class="store-info">
                        <i class="fas fa-tools store-icon"></i>
                        <div>
                            <h4>${s.name}</h4>
                            <p>${s.address}</p>
                            <span class="distance">${s.distanceKm} km</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <span class="price">$${s.price.toFixed(2)}</span>
                        <span class="stock">En stock</span>
                    </div>
                `;
                resultsGrid.appendChild(card);
            });
            // Click to focus marker
            resultsGrid.addEventListener('click', (e) => {
                const card = e.target.closest('.result-card');
                if (!card) return;
                const id = card.getAttribute('data-store');
                const marker = markerById[id];
                if (!marker) return;
                const latlng = marker.getLatLng();
                map.setView(latlng, Math.max(map.getZoom(), 16), { animate: true });
                marker.openPopup();
                // brief highlight pulse circle
                const pulse = L.circle(latlng, { radius: 50, color: '#fbbf24', weight: 4, fillColor: '#fbbf24', fillOpacity: 0.25 }).addTo(map);
                setTimeout(() => { map.removeLayer(pulse); }, 1200);
                // visual selection in list
                resultsGrid.querySelectorAll('.result-card').forEach(el => el.classList.remove('selected'));
                card.classList.add('selected');
            }, { once: false });
        };

        const runSearch = (queryText) => {
            // Very simple mock filter: only show results if includes 'tornillo' and '3mm'
            const q = (queryText || '').toLowerCase();
            const ok = q.includes('tornillo') && (q.includes('3mm') || q.includes('3 mm'));
            // Filter stores to only those within circle radius
            const filtered = ok ? allStores.filter(s => s.distanceM <= radiusMeters) : [];
            const list = filtered.sort((a, b) => a.distanceM - b.distanceM);
            renderMarkers(list);
            renderResults(list, queryText);
        };

        // Typing animation for suggested query
        const suggested = 'tornillo de 3mm';
        const typeSuggestion = () => {
            if (!input) return;
            input.value = '';
            let i = 0;
            const type = () => {
                if (i <= suggested.length) {
                    input.setAttribute('placeholder', suggested.substring(0, i) + (i % 2 === 0 ? '|' : ''));
                    i++;
                    setTimeout(type, 80);
                } else {
                    input.value = suggested;
                    input.setAttribute('placeholder', 'Busca un producto (p. ej. tornillo de 3mm)');
                    runSearch(suggested);
                }
            };
            type();
        };

        // Wire events
        if (btn) btn.addEventListener('click', () => runSearch(input?.value || ''));
        if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); runSearch(input.value); } });

        // Regenerate stores after the fixed location is set
        setTimeout(() => { allStores = generateStoresAroundUser(); }, 200);

        // Kick off demo typing once visible
        setTimeout(typeSuggestion, 800);
    }
}

// Initialize the application when the script loads
const nearMeApp = new NearMeApp();

// Global functions for onclick handlers
window.scrollToFeatures = () => {
    nearMeApp.smoothScrollTo('#caracteristicas');
};

window.scrollToContact = () => {
    nearMeApp.smoothScrollTo('#contacto');
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NearMeApp;
}

    // Función global para abrir el modal de registro de tiendas
    window.openStoreRegistrationModal = function() {
        const modal = new bootstrap.Modal(document.getElementById('storeRegistrationModal'));
        modal.show();
    };

    // Función global para abrir el modal de login
    window.openLoginModal = function() {
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();
    };

    // Función global para abrir el modal de registro
    window.openRegisterModal = function() {
        const modal = new bootstrap.Modal(document.getElementById('registerModal'));
        modal.show();
    };

    // Open register modal directly on store tab
    window.openRegisterAsStore = function() {
        const modalEl = document.getElementById('registerModal');
        if (!modalEl) return;
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
        // ensure store tab is active and form visible
        const typeButtons = modalEl.querySelectorAll('.auth-type-btn');
        typeButtons.forEach(b => b.classList.remove('active'));
        const storeBtn = modalEl.querySelector('.auth-type-btn[data-type="store"]');
        if (storeBtn) storeBtn.classList.add('active');
        const userForm = document.getElementById('registerUserForm');
        const storeForm = document.getElementById('registerStoreForm');
        if (userForm) userForm.style.display = 'none';
        if (storeForm) storeForm.style.display = 'block';
    };

    // Configurar los modales cuando se carga la página
    document.addEventListener('DOMContentLoaded', function() {
        setupLoginModal();
        setupRegisterModal();
    });

    // Función para configurar el modal de login
    function setupLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (!loginModal) return;

        // Elementos del modal
        const typeButtons = loginModal.querySelectorAll('.auth-type-btn');

        // Configurar botones de tipo de usuario
        typeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover clase active de todos los botones
                typeButtons.forEach(b => b.classList.remove('active'));
                // Añadir clase active al botón clickeado
                this.classList.add('active');
            });
        });

        // Configurar formulario de login
        const loginForm = loginModal.querySelector('#loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }

    // Función para configurar el modal de registro
    function setupRegisterModal() {
        const registerModal = document.getElementById('registerModal');
        if (!registerModal) return;

        // Elementos del modal
        const typeButtons = registerModal.querySelectorAll('.auth-type-btn');

        // Configurar botones de tipo de usuario
        typeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover clase active de todos los botones
                typeButtons.forEach(b => b.classList.remove('active'));
                // Añadir clase active al botón clickeado
                this.classList.add('active');
                
                // Mostrar formulario correspondiente
                showFormByType(this.dataset.type);
            });
        });

        // Configurar formularios de registro
        setupRegisterForms();
    }

    // Función para mostrar formulario según el tipo de usuario
    function showFormByType(type) {
        const forms = document.querySelectorAll('#registerModal .auth-form');
        
        // Ocultar todos los formularios
        forms.forEach(form => form.style.display = 'none');
        
        // Mostrar formulario correspondiente
        if (type === 'user') {
            document.getElementById('registerUserForm').style.display = 'block';
        } else if (type === 'store') {
            document.getElementById('registerStoreForm').style.display = 'block';
        }
    }



    // Función para configurar los formularios de registro
    function setupRegisterForms() {
        // Formulario de registro de usuario
        const registerUserForm = document.getElementById('registerUserForm');
        if (registerUserForm) {
            registerUserForm.addEventListener('submit', handleUserRegistration);
        }

        // Formulario de registro de tienda
        const registerStoreForm = document.getElementById('registerStoreForm');
        if (registerStoreForm) {
            registerStoreForm.addEventListener('submit', handleStoreRegistration);
        }
    }

    // Función para manejar el login
    function handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('loginEmail');
        const password = formData.get('loginPassword');
        const rememberMe = formData.get('rememberMe');
        const typeBtn = document.querySelector('#loginModal .auth-type-btn.active');
        const userType = typeBtn ? typeBtn.dataset.type : 'user';
        
        // Aquí iría la lógica de autenticación
        console.log('Login attempt:', { email, password, rememberMe, userType });
        
        // Simular éxito de login
        showAlert('¡Inicio de sesión exitoso!', 'success');
        
        // Cerrar modal después de un delay
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (modal) modal.hide();
        }, 2000);
    }

    // Función para manejar el registro de usuario
    function handleUserRegistration(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            firstName: formData.get('userFirstName'),
            lastName: formData.get('userLastName'),
            email: formData.get('userEmail'),
            password: formData.get('userPassword'),
            confirmPassword: formData.get('userConfirmPassword'),
            phone: formData.get('userPhone'),
            terms: formData.get('userTerms')
        };
        
        // Validar contraseñas
        if (userData.password !== userData.confirmPassword) {
            showAlert('Las contraseñas no coinciden', 'error');
            return;
        }
        
        // Aquí iría la lógica de registro
        console.log('User registration:', userData);
        
        // Simular éxito de registro
        showAlert('¡Usuario registrado exitosamente!', 'success');
        // Cerrar modal después de un delay
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (modal) modal.hide();
        }, 2000);
    }

    // Función para manejar el registro de tienda
    function handleStoreRegistration(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const storeData = {
            storeName: formData.get('storeName'),
            ownerName: formData.get('storeOwnerName'),
            ownerEmail: formData.get('storeOwnerEmail'),
            password: formData.get('storePassword'),
            confirmPassword: formData.get('storeConfirmPassword'),
            category: formData.get('storeCategory'),
            phone: formData.get('storePhone'),
            address: formData.get('storeAddress'),
            city: formData.get('storeCity'),
            description: formData.get('storeDescription'),
            terms: formData.get('storeTerms')
        };
        
        // Validar contraseñas
        if (storeData.password !== storeData.confirmPassword) {
            showAlert('Las contraseñas no coinciden', 'error');
            return;
        }
        
        // Aquí iría la lógica de registro
        console.log('Store registration:', storeData);
        
        // Simular éxito de registro
        showAlert('¡Tienda registrada exitosamente!', 'success');
        
        // Cerrar modal después de un delay
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (modal) modal.hide();
        }, 2000);
    }

    // Función para mostrar alertas
    function showAlert(message, type = 'info') {
        // Crear elemento de alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Añadir al body
        document.body.appendChild(alertDiv);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    } 