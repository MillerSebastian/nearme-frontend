/**
 * NEARME LANDING PAGE - ANIMATIONS JAVASCRIPT
 * ===========================================
 * Advanced animation controllers and effects
 */

class AnimationController {
    constructor() {
        this.animations = new Map();
        this.parallaxInstances = new Map();
        this.scrollTriggers = new Map();
        this.typingInstances = new Map();
        this.particleSystems = new Map();
        this.init();
    }

    /**
     * Initialize animation controller
     */
    init() {
        this.setupAnimationSystem();
        this.setupParallaxSystem();
        this.setupScrollTriggers();
        this.setupTypingEffects();
        this.setupParticleSystems();
        this.setupPerformanceOptimization();
    }

    /**
     * Setup core animation system
     */
    setupAnimationSystem() {
        // Register animation types
        this.registerAnimationTypes();
        
        // Setup intersection observer for animations
        this.setupAnimationObserver();
        
        // Setup animation queues
        this.setupAnimationQueues();
    }

    /**
     * Register all animation types
     */
    registerAnimationTypes() {
        this.animations.set('fadeIn', {
            duration: 800,
            easing: 'ease-out',
            properties: ['opacity', 'transform'],
            keyframes: [
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ]
        });

        this.animations.set('slideInLeft', {
            duration: 800,
            easing: 'ease-out',
            properties: ['opacity', 'transform'],
            keyframes: [
                { opacity: 0, transform: 'translateX(-50px)' },
                { opacity: 1, transform: 'translateX(0)' }
            ]
        });

        this.animations.set('slideInRight', {
            duration: 800,
            easing: 'ease-out',
            properties: ['opacity', 'transform'],
            keyframes: [
                { opacity: 0, transform: 'translateX(50px)' },
                { opacity: 1, transform: 'translateX(0)' }
            ]
        });

        this.animations.set('scaleIn', {
            duration: 600,
            easing: 'ease-out',
            properties: ['opacity', 'transform'],
            keyframes: [
                { opacity: 0, transform: 'scale(0.8)' },
                { opacity: 1, transform: 'scale(1)' }
            ]
        });

        this.animations.set('rotateIn', {
            duration: 800,
            easing: 'ease-out',
            properties: ['opacity', 'transform'],
            keyframes: [
                { opacity: 0, transform: 'perspective(400px) rotateX(90deg)' },
                { opacity: 1, transform: 'perspective(400px) rotateX(0deg)' }
            ]
        });

        this.animations.set('bounceIn', {
            duration: 1000,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            properties: ['opacity', 'transform'],
            keyframes: [
                { opacity: 0, transform: 'scale(0.3)' },
                { opacity: 1, transform: 'scale(1.1)' },
                { opacity: 1, transform: 'scale(0.9)' },
                { opacity: 1, transform: 'scale(1)' }
            ]
        });

        this.animations.set('flipInX', {
            duration: 800,
            easing: 'ease-out',
            properties: ['opacity', 'transform'],
            keyframes: [
                { opacity: 0, transform: 'perspective(400px) rotateX(90deg)' },
                { opacity: 1, transform: 'perspective(400px) rotateX(0deg)' }
            ]
        });

        this.animations.set('zoomIn', {
            duration: 600,
            easing: 'ease-out',
            properties: ['opacity', 'transform'],
            keyframes: [
                { opacity: 0, transform: 'scale(0.3)' },
                { opacity: 1, transform: 'scale(1)' }
            ]
        });
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

            // Observe all elements with animation attributes
            const animatedElements = document.querySelectorAll('[data-animate], [data-scroll-animate]');
            animatedElements.forEach(el => {
                this.animationObserver.observe(el);
            });
        }
    }

    /**
     * Setup animation queues
     */
    setupAnimationQueues() {
        this.animationQueue = [];
        this.isProcessingQueue = false;
    }

    /**
     * Setup parallax system
     */
    setupParallaxSystem() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        this.parallaxElements.forEach(element => {
            this.createParallaxInstance(element);
        });
    }

    /**
     * Create parallax instance for element
     */
    createParallaxInstance(element) {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const direction = element.dataset.parallaxDirection || 'vertical';
        
        const instance = {
            element,
            speed,
            direction,
            initialY: 0,
            initialX: 0
        };

        this.parallaxInstances.set(element, instance);
    }

    /**
     * Update parallax effects
     */
    updateParallax() {
        const scrolled = window.pageYOffset;
        
        this.parallaxInstances.forEach(instance => {
            const { element, speed, direction } = instance;
            
            if (direction === 'vertical') {
                const yPos = -(scrolled * speed * 0.5);
                element.style.transform = `translateY(${yPos}px)`;
            } else if (direction === 'horizontal') {
                const xPos = -(scrolled * speed * 0.3);
                element.style.transform = `translateX(${xPos}px)`;
            } else if (direction === 'scale') {
                const scale = 1 + (scrolled * speed * 0.0001);
                element.style.transform = `scale(${scale})`;
            }
        });
    }

    /**
     * Setup scroll triggers
     */
    setupScrollTriggers() {
        this.scrollTriggers = new Map();
        
        // Register scroll-triggered animations
        this.registerScrollTriggers();
        
        // Setup scroll event listener
        window.addEventListener('scroll', this.debounce(() => {
            this.updateScrollTriggers();
        }, 16));
    }

    /**
     * Register scroll-triggered animations
     */
    registerScrollTriggers() {
        const scrollElements = document.querySelectorAll('[data-scroll-trigger]');
        
        scrollElements.forEach(element => {
            const trigger = {
                element,
                type: element.dataset.scrollTrigger || 'fadeIn',
                threshold: parseFloat(element.dataset.scrollThreshold) || 0.5,
                delay: parseFloat(element.dataset.scrollDelay) || 0,
                triggered: false
            };
            
            this.scrollTriggers.set(element, trigger);
        });
    }

    /**
     * Update scroll triggers
     */
    updateScrollTriggers() {
        const scrollPosition = window.pageYOffset + window.innerHeight;
        
        this.scrollTriggers.forEach(trigger => {
            if (trigger.triggered) return;
            
            const elementTop = trigger.element.offsetTop;
            const elementHeight = trigger.element.offsetHeight;
            const triggerPoint = elementTop + (elementHeight * trigger.threshold);
            
            if (scrollPosition > triggerPoint) {
                this.triggerScrollAnimation(trigger);
            }
        });
    }

    /**
     * Trigger scroll animation
     */
    triggerScrollAnimation(trigger) {
        trigger.triggered = true;
        
        setTimeout(() => {
            this.playAnimation(trigger.element, trigger.type);
        }, trigger.delay * 1000);
    }

    /**
     * Setup typing effects
     */
    setupTypingEffects() {
        const typingElements = document.querySelectorAll('[data-typing]');
        typingElements.forEach(element => {
            this.createTypingInstance(element);
        });
    }

    /**
     * Create typing instance
     */
    createTypingInstance(element) {
        const text = element.textContent;
        const speed = parseInt(element.dataset.typingSpeed) || 100;
        const loop = element.dataset.typingLoop === 'true';
        const cursor = element.dataset.typingCursor !== 'false';
        
        const instance = {
            element,
            originalText: text,
            speed,
            loop,
            cursor,
            currentIndex: 0,
            isTyping: false,
            cursorElement: null
        };
        
        this.typingInstances.set(element, instance);
        this.initializeTypingEffect(instance);
    }

    /**
     * Initialize typing effect
     */
    initializeTypingEffect(instance) {
        const { element, cursor } = instance;
        
        // Clear text and add cursor
        element.textContent = '';
        
        if (cursor) {
            const cursorElement = document.createElement('span');
            cursorElement.className = 'typing-cursor';
            cursorElement.textContent = '|';
            cursorElement.style.animation = 'blink 1s infinite';
            element.appendChild(cursorElement);
            instance.cursorElement = cursorElement;
        }
        
        // Start typing when element comes into view
        this.animationObserver?.observe(element);
        element.addEventListener('animationstart', () => {
            this.startTyping(instance);
        });
    }

    /**
     * Start typing effect
     */
    startTyping(instance) {
        if (instance.isTyping) return;
        
        instance.isTyping = true;
        this.typeNextCharacter(instance);
    }

    /**
     * Type next character
     */
    typeNextCharacter(instance) {
        const { element, originalText, currentIndex, speed, loop, cursorElement } = instance;
        
        if (currentIndex < originalText.length) {
            element.insertBefore(
                document.createTextNode(originalText[currentIndex]),
                cursorElement
            );
            instance.currentIndex++;
            
            setTimeout(() => {
                this.typeNextCharacter(instance);
            }, speed);
        } else {
            instance.isTyping = false;
            
            if (loop) {
                setTimeout(() => {
                    this.resetTyping(instance);
                }, 2000);
            } else if (cursorElement) {
                cursorElement.style.display = 'none';
            }
        }
    }

    /**
     * Reset typing effect
     */
    resetTyping(instance) {
        const { element, cursorElement } = instance;
        
        // Remove all text nodes
        while (element.firstChild && element.firstChild !== cursorElement) {
            element.removeChild(element.firstChild);
        }
        
        instance.currentIndex = 0;
        instance.isTyping = false;
        
        if (cursorElement) {
            cursorElement.style.display = 'inline';
        }
        
        this.startTyping(instance);
    }

    /**
     * Setup particle systems
     */
    setupParticleSystems() {
        const particleContainers = document.querySelectorAll('[data-particles]');
        particleContainers.forEach(container => {
            this.createParticleSystem(container);
        });
    }

    /**
     * Create particle system
     */
    createParticleSystem(container) {
        const particleCount = parseInt(container.dataset.particles) || 50;
        const particleType = container.dataset.particleType || 'circle';
        const particleColor = container.dataset.particleColor || '#ffffff';
        const particleSize = parseInt(container.dataset.particleSize) || 2;
        
        const system = {
            container,
            particles: [],
            particleCount,
            particleType,
            particleColor,
            particleSize,
            isActive: true
        };
        
        this.particleSystems.set(container, system);
        this.generateParticles(system);
        this.animateParticles(system);
    }

    /**
     * Generate particles
     */
    generateParticles(system) {
        const { container, particleCount, particleType, particleColor, particleSize } = system;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Set particle properties
            particle.style.position = 'absolute';
            particle.style.width = `${particleSize}px`;
            particle.style.height = `${particleSize}px`;
            particle.style.backgroundColor = particleColor;
            particle.style.borderRadius = particleType === 'circle' ? '50%' : '0';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation properties
            particle.style.animationDuration = `${2 + Math.random() * 3}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            particle.style.animationIterationCount = 'infinite';
            particle.style.animationTimingFunction = 'ease-in-out';
            
            // Add floating animation
            particle.style.animation = `floatParticle 3s ease-in-out infinite`;
            
            container.appendChild(particle);
            system.particles.push(particle);
        }
    }

    /**
     * Animate particles
     */
    animateParticles(system) {
        if (!system.isActive) return;
        
        system.particles.forEach(particle => {
            // Add random movement
            const randomX = (Math.random() - 0.5) * 2;
            const randomY = (Math.random() - 0.5) * 2;
            
            const currentX = parseFloat(particle.style.left) || 0;
            const currentY = parseFloat(particle.style.top) || 0;
            
            let newX = currentX + randomX;
            let newY = currentY + randomY;
            
            // Keep particles within bounds
            newX = Math.max(0, Math.min(100, newX));
            newY = Math.max(0, Math.min(100, newY));
            
            particle.style.left = `${newX}%`;
            particle.style.top = `${newY}%`;
        });
        
        requestAnimationFrame(() => {
            this.animateParticles(system);
        });
    }

    /**
     * Setup performance optimization
     */
    setupPerformanceOptimization() {
        // Use requestAnimationFrame for smooth animations
        this.lastTime = 0;
        
        // Optimize for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
        }
        
        // Monitor performance
        this.setupPerformanceMonitoring();
    }

    /**
     * Disable animations for reduced motion preference
     */
    disableAnimations() {
        document.body.classList.add('reduced-motion');
        
        // Disable all CSS animations
        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion * {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measurePerformance = (currentTime) => {
            frameCount++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    this.optimizePerformance();
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measurePerformance);
        };
        
        requestAnimationFrame(measurePerformance);
    }

    /**
     * Optimize performance when FPS drops
     */
    optimizePerformance() {
        // Reduce particle count
        this.particleSystems.forEach(system => {
            if (system.particles.length > 20) {
                const excessParticles = system.particles.splice(20);
                excessParticles.forEach(particle => {
                    particle.remove();
                });
            }
        });
        
        // Reduce parallax complexity
        this.parallaxInstances.forEach(instance => {
            instance.speed *= 0.8;
        });
    }

    /**
     * Trigger element animation
     */
    triggerElementAnimation(element) {
        const animationType = element.dataset.animate || 'fadeIn';
        const delay = parseFloat(element.dataset.delay) || 0;
        
        setTimeout(() => {
            this.playAnimation(element, animationType);
        }, delay * 1000);
    }

    /**
     * Play animation on element
     */
    playAnimation(element, animationType) {
        const animation = this.animations.get(animationType);
        
        if (!animation) {
            console.warn(`Animation type "${animationType}" not found`);
            return;
        }
        
        // Add animation class
        element.classList.add('animate');
        
        // Apply keyframe animation
        element.style.animation = `${animationType} ${animation.duration}ms ${animation.easing} forwards`;
        
        // Clean up after animation
        setTimeout(() => {
            element.style.animation = '';
        }, animation.duration);
    }

    /**
     * Add animation to queue
     */
    addToQueue(animation) {
        this.animationQueue.push(animation);
        
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }

    /**
     * Process animation queue
     */
    processQueue() {
        if (this.animationQueue.length === 0) {
            this.isProcessingQueue = false;
            return;
        }
        
        this.isProcessingQueue = true;
        const animation = this.animationQueue.shift();
        
        this.playAnimation(animation.element, animation.type);
        
        setTimeout(() => {
            this.processQueue();
        }, animation.delay || 100);
    }

    /**
     * Utility Methods
     */
    
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
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
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
     * Get element position relative to viewport
     */
    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset,
            bottom: rect.bottom + window.pageYOffset,
            right: rect.right + window.pageXOffset
        };
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Disconnect observers
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Clear particle systems
        this.particleSystems.forEach(system => {
            system.isActive = false;
            system.particles.forEach(particle => {
                particle.remove();
            });
        });
        
        // Clear maps
        this.animations.clear();
        this.parallaxInstances.clear();
        this.scrollTriggers.clear();
        this.typingInstances.clear();
        this.particleSystems.clear();
        
        // Remove event listeners
        window.removeEventListener('scroll', this.updateScrollTriggers);
    }
}

// Initialize animation controller
const animationController = new AnimationController();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
} 