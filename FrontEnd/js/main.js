/**
 * NEARME LANDING PAGE - MAIN JAVASCRIPT
 * =====================================
 * Main functionality for the NearMe landing page with custom modals
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeModals();
    initializeAnimations();
    console.log('🚀 NearMe App Initialized with custom modals');
}

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('mainNavbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Modal functionality
function initializeModals() {
    // Global modal functions
    window.openLoginModal = function() {
        showModal('loginModal');
    };

    window.openRegisterModal = function() {
        showModal('registerModal');
    };

    window.openStoreRegistrationModal = function() {
        showModal('storeRegistrationModal');
    };

    window.openDemoModal = function() {
        showModal('demoModal');
    };

    window.closeModal = function(modalId) {
        hideModal(modalId);
    };

    // Show modal function
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            // Trigger reflow
            modal.offsetHeight;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide modal function
    function hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Auth type selector functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.auth-type-btn')) {
            const container = e.target.closest('.auth-type-selector');
            const buttons = container.querySelectorAll('.auth-type-btn');
            
            buttons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            const clickedBtn = e.target.closest('.auth-type-btn');
            clickedBtn.classList.add('active');
            
            // Show/hide forms based on type
            const type = clickedBtn.dataset.type;
            const userForm = document.getElementById('registerUserForm');
            const storeForm = document.getElementById('registerStoreForm');
            
            if (userForm && storeForm) {
                if (type === 'user') {
                    userForm.style.display = 'block';
                    storeForm.style.display = 'none';
                } else if (type === 'store') {
                    userForm.style.display = 'none';
                    storeForm.style.display = 'block';
                }
            }
        }
    });

    // Form submission handling
    document.addEventListener('submit', function(e) {
        if (e.target.closest('.modal')) {
            e.preventDefault();
            handleFormSubmission(e.target);
        }
    });

    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target.id);
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                hideModal(openModal.id);
            }
        }
    });
}

// Animation functionality
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-animate attribute
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    // Counter animation for stats
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-counter'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter when element is visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counterObserver.observe(counter);
    });
}

// Form submission handling
function handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showSuccessMessage(form);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Close modal after delay
        setTimeout(() => {
            const modal = form.closest('.modal');
            if (modal) {
                window.closeModal(modal.id);
            }
        }, 2000);
    }, 2000);
}

// Success message display
function showSuccessMessage(form) {
    // Remove existing success message
    const existingMessage = form.querySelector('.alert-success');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success mt-3';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        <strong>¡Enviado exitosamente!</strong> Te responderemos pronto.
    `;
    
    form.appendChild(successDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Mobile menu toggle
window.toggleMobileMenu = function() {
    const navbarNav = document.getElementById('navbarNav');
    navbarNav.classList.toggle('show');
};

// Global functions
window.scrollToFeatures = function() {
    scrollToSection('caracteristicas');
};

window.openRegisterAsStore = function() {
    window.openRegisterModal();
    
    // Activate store tab
    const storeBtn = document.querySelector('.auth-type-btn[data-type="store"]');
    if (storeBtn) {
        storeBtn.click();
    }
}; 