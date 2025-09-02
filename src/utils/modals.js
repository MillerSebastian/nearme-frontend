/**
 * NEARME LANDING PAGE - MODALS JAVASCRIPT
 * =======================================
 * Modal management and interactive components
 */

class ModalManager {
    constructor() {
        this.activeModal = null;
        this.modalStack = [];
        this.modalHistory = [];
        this.isInitialized = false;
        this.init();
    }

    /**
     * Initialize modal manager
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupModalSystem();
        this.setupEventListeners();
        this.setupAccessibility();
        this.setupAnimations();
        
        this.isInitialized = true;
        console.log('🎭 Modal Manager Initialized');
    }

    /**
     * Setup modal system
     */
    setupModalSystem() {
        this.modals = new Map();
        this.initializeModals();
        this.setupModalTemplates();
    }

    /**
     * Initialize all modals
     */
    initializeModals() {
        const modalElements = document.querySelectorAll('[data-modal], .modal');
        
        modalElements.forEach(modalElement => {
            const modalId = modalElement.id || modalElement.dataset.modal;
            this.registerModal(modalId, modalElement);
        });
    }

    /**
     * Register modal with manager
     */
    registerModal(modalId, modalElement) {
        const modal = {
            id: modalId,
            element: modalElement,
            isOpen: false,
            backdrop: null,
            focusableElements: [],
            firstFocusableElement: null,
            lastFocusableElement: null,
            previousActiveElement: null,
            closeButton: modalElement.querySelector('.btn-close, [data-dismiss="modal"]'),
            triggerButtons: document.querySelectorAll(`[data-bs-toggle="modal"][data-bs-target="#${modalId}"], [data-toggle="modal"][data-target="#${modalId}"]`)
        };

        this.modals.set(modalId, modal);
        this.setupModalAccessibility(modal);
        this.setupModalTriggers(modal);
    }

    /**
     * Setup modal accessibility
     */
    setupModalAccessibility(modal) {
        const { element, closeButton } = modal;
        
        // Set ARIA attributes
        element.setAttribute('role', 'dialog');
        element.setAttribute('aria-modal', 'true');
        element.setAttribute('aria-hidden', 'true');
        
        if (closeButton) {
            closeButton.setAttribute('aria-label', 'Cerrar modal');
        }
        
        // Find focusable elements
        this.updateFocusableElements(modal);
    }

    /**
     * Update focusable elements for modal
     */
    updateFocusableElements(modal) {
        const { element } = modal;
        
        // Get all focusable elements
        const focusableSelectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            'area[href]',
            'iframe',
            'object',
            'embed',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ];
        
        modal.focusableElements = Array.from(element.querySelectorAll(focusableSelectors.join(', ')));
        
        if (modal.focusableElements.length > 0) {
            modal.firstFocusableElement = modal.focusableElements[0];
            modal.lastFocusableElement = modal.focusableElements[modal.focusableElements.length - 1];
        }
    }

    /**
     * Setup modal triggers
     */
    setupModalTriggers(modal) {
        const { triggerButtons, id } = modal;
        
        triggerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(id);
            });
        });
    }

    /**
     * Setup modal templates
     */
    setupModalTemplates() {
        // Demo Modal Template
        this.modalTemplates = {
            demo: {
                title: 'Solicitar Demo',
                content: `
                    <div class="demo-content">
                        <div class="demo-features">
                            <h4>Características del Demo:</h4>
                            <ul>
                                <li>✅ Acceso completo a la plataforma</li>
                                <li>✅ Datos de ejemplo reales</li>
                                <li>✅ Soporte técnico incluido</li>
                                <li>✅ Sin compromiso de compra</li>
                            </ul>
                        </div>
                        <form class="demo-form">
                            <div class="form-group">
                                <label for="demoName">Nombre completo</label>
                                <input type="text" id="demoName" name="name" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="demoEmail">Email corporativo</label>
                                <input type="email" id="demoEmail" name="email" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="demoCompany">Empresa</label>
                                <input type="text" id="demoCompany" name="company" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="demoPhone">Teléfono</label>
                                <input type="tel" id="demoPhone" name="phone" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="demoMessage">Mensaje (opcional)</label>
                                <textarea id="demoMessage" name="message" class="form-control" rows="3"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-lg w-100">
                                <span class="btn-text">Solicitar Demo</span>
                                <span class="btn-loading" style="display: none;">
                                    <i class="fas fa-spinner fa-spin"></i> Enviando...
                                </span>
                            </button>
                        </form>
                    </div>
                `,
                size: 'lg',
                footer: false
            },
            contact: {
                title: 'Contacto Directo',
                content: `
                    <div class="contact-modal-content">
                        <div class="contact-info-modal">
                            <div class="contact-item-modal">
                                <i class="fas fa-phone"></i>
                                <div>
                                    <h5>Teléfono</h5>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div class="contact-item-modal">
                                <i class="fas fa-envelope"></i>
                                <div>
                                    <h5>Email</h5>
                                    <p>info@nearme.com</p>
                                </div>
                            </div>
                            <div class="contact-item-modal">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <h5>Oficina</h5>
                                    <p>123 Business Ave, Suite 100<br>New York, NY 10001</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                size: 'md',
                footer: false
            }
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Global modal events
        document.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });
        
        // Click outside modal to close
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
        
        // Modal form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.closest('.modal')) {
                this.handleModalFormSubmit(e);
            }
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Focus trap for modals
        this.setupFocusTrap();
        
        // Screen reader announcements
        this.setupScreenReaderSupport();
    }

    /**
     * Setup focus trap
     */
    setupFocusTrap() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.activeModal) {
                this.handleTabKey(e);
            }
        });
    }

    /**
     * Setup screen reader support
     */
    setupScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        this.liveRegion = liveRegion;
    }

    /**
     * Setup modal animations
     */
    setupAnimations() {
        // Add animation classes to modals
        this.modals.forEach(modal => {
            modal.element.classList.add('modal-animated');
        });
    }

    /**
     * Open modal
     */
    openModal(modalId, options = {}) {
        const modal = this.modals.get(modalId);
        if (!modal || modal.isOpen) return;
        
        // Store previous active element
        modal.previousActiveElement = document.activeElement;
        
        // Create backdrop
        this.createBackdrop(modal);
        
        // Show modal
        this.showModal(modal);
        
        // Update state
        modal.isOpen = true;
        this.activeModal = modal;
        this.modalStack.push(modal);
        this.modalHistory.push(modalId);
        
        // Announce to screen readers
        this.announceToScreenReader(`Modal ${modal.element.querySelector('.modal-title')?.textContent || modalId} abierto`);
        
        // Trigger custom event
        this.triggerModalEvent('modalOpened', modal);
        
        // Focus management
        this.manageModalFocus(modal);
        
        // Add body classes
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        
        // Animation
        this.animateModalOpen(modal);
    }

    /**
     * Create modal backdrop
     */
    createBackdrop(modal) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        
        // Add backdrop styles
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 1040;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.backdrop = backdrop;
        document.body.appendChild(backdrop);
        
        // Animate backdrop in
        setTimeout(() => {
            backdrop.style.opacity = '1';
        }, 10);
    }

    /**
     * Show modal
     */
    showModal(modal) {
        const { element } = modal;
        
        // Remove hidden class
        element.classList.remove('d-none');
        element.style.display = 'block';
        
        // Set ARIA attributes
        element.setAttribute('aria-hidden', 'false');
        
        // Add show class
        element.classList.add('show');
        
        // Trigger Bootstrap modal event if available
        if (typeof bootstrap !== 'undefined') {
            const bootstrapModal = bootstrap.Modal.getInstance(element);
            if (bootstrapModal) {
                bootstrapModal.show();
            }
        }
    }

    /**
     * Close modal
     */
    closeModal(modalId, options = {}) {
        const modal = this.modals.get(modalId);
        if (!modal || !modal.isOpen) return;
        
        // Animation
        this.animateModalClose(modal).then(() => {
            // Hide modal
            this.hideModal(modal);
            
            // Remove backdrop
            this.removeBackdrop(modal);
            
            // Update state
            modal.isOpen = false;
            this.activeModal = null;
            
            // Remove from stack
            const index = this.modalStack.indexOf(modal);
            if (index > -1) {
                this.modalStack.splice(index, 1);
            }
            
            // Restore focus
            this.restoreFocus(modal);
            
            // Remove body classes
            if (this.modalStack.length === 0) {
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
            }
            
            // Announce to screen readers
            this.announceToScreenReader('Modal cerrado');
            
            // Trigger custom event
            this.triggerModalEvent('modalClosed', modal);
        });
    }

    /**
     * Hide modal
     */
    hideModal(modal) {
        const { element } = modal;
        
        // Remove show class
        element.classList.remove('show');
        
        // Set ARIA attributes
        element.setAttribute('aria-hidden', 'true');
        
        // Hide element
        element.style.display = 'none';
        
        // Trigger Bootstrap modal event if available
        if (typeof bootstrap !== 'undefined') {
            const bootstrapModal = bootstrap.Modal.getInstance(element);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    }

    /**
     * Remove backdrop
     */
    removeBackdrop(modal) {
        if (modal.backdrop) {
            modal.backdrop.style.opacity = '0';
            setTimeout(() => {
                if (modal.backdrop && modal.backdrop.parentNode) {
                    modal.backdrop.parentNode.removeChild(modal.backdrop);
                }
                modal.backdrop = null;
            }, 300);
        }
    }

    /**
     * Animate modal open
     */
    animateModalOpen(modal) {
        const { element } = modal;
        
        // Add entrance animation
        element.style.animation = 'modalBackdrop 0.3s ease forwards';
        
        // Animate modal content
        const modalContent = element.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.animation = 'modalContent 0.4s ease forwards';
        }
    }

    /**
     * Animate modal close
     */
    animateModalClose(modal) {
        return new Promise((resolve) => {
            const { element } = modal;
            
            // Add exit animation
            element.style.animation = 'modalBackdrop 0.3s ease reverse forwards';
            
            // Animate modal content
            const modalContent = element.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.animation = 'modalContent 0.4s ease reverse forwards';
            }
            
            // Resolve after animation
            setTimeout(resolve, 300);
        });
    }

    /**
     * Manage modal focus
     */
    manageModalFocus(modal) {
        const { element, firstFocusableElement } = modal;
        
        // Focus first focusable element or modal itself
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        } else {
            element.focus();
        }
        
        // Update focusable elements
        this.updateFocusableElements(modal);
    }

    /**
     * Restore focus
     */
    restoreFocus(modal) {
        if (modal.previousActiveElement && modal.previousActiveElement.focus) {
            modal.previousActiveElement.focus();
        }
    }

    /**
     * Handle tab key navigation
     */
    handleTabKey(e) {
        const { activeModal } = this;
        if (!activeModal) return;
        
        const { firstFocusableElement, lastFocusableElement, focusableElements } = activeModal;
        
        if (focusableElements.length === 0) return;
        
        if (e.shiftKey) {
            // Shift + Tab: move backwards
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            // Tab: move forwards
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }

    /**
     * Handle keydown events
     */
    handleKeydown(e) {
        if (e.key === 'Escape' && this.activeModal) {
            this.closeModal(this.activeModal.id);
        }
    }

    /**
     * Handle outside click
     */
    handleOutsideClick(e) {
        if (this.activeModal && !this.activeModal.element.contains(e.target) && !e.target.closest('.modal-backdrop')) {
            this.closeModal(this.activeModal.id);
        }
    }

    /**
     * Handle modal form submission
     */
    handleModalFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const modal = this.findModalByElement(form);
        
        if (!modal) return;
        
        // Show loading state
        this.showFormLoading(form);
        
        // Simulate form submission
        setTimeout(() => {
            this.handleFormSuccess(form, modal);
        }, 2000);
    }

    /**
     * Find modal by element
     */
    findModalByElement(element) {
        const modalElement = element.closest('.modal');
        if (!modalElement) return null;
        
        return Array.from(this.modals.values()).find(modal => modal.element === modalElement);
    }

    /**
     * Show form loading state
     */
    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-block';
            
            submitBtn.disabled = true;
        }
    }

    /**
     * Handle form success
     */
    handleFormSuccess(form, modal) {
        // Show success message
        this.showFormSuccess(form);
        
        // Reset form
        form.reset();
        
        // Close modal after delay
        setTimeout(() => {
            this.closeModal(modal.id);
        }, 2000);
    }

    /**
     * Show form success message
     */
    showFormSuccess(form) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success mt-3';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
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

    /**
     * Announce to screen reader
     */
    announceToScreenReader(message) {
        if (this.liveRegion) {
            this.liveRegion.textContent = message;
        }
    }

    /**
     * Trigger modal event
     */
    triggerModalEvent(eventName, modal) {
        const event = new CustomEvent(eventName, {
            detail: { modal },
            bubbles: true
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Create dynamic modal
     */
    createDynamicModal(templateId, options = {}) {
        const template = this.modalTemplates[templateId];
        if (!template) {
            console.error(`Modal template "${templateId}" not found`);
            return;
        }
        
        const modalId = `dynamic-${templateId}-${Date.now()}`;
        const modalElement = this.createModalElement(modalId, template, options);
        
        // Register modal
        this.registerModal(modalId, modalElement);
        
        // Add to DOM
        document.body.appendChild(modalElement);
        
        // Open modal
        this.openModal(modalId);
        
        return modalId;
    }

    /**
     * Create modal element
     */
    createModalElement(modalId, template, options) {
        const modalElement = document.createElement('div');
        modalElement.className = `modal modal-${template.size || 'md'}`;
        modalElement.id = modalId;
        modalElement.setAttribute('tabindex', '-1');
        
        modalElement.innerHTML = `
            <div class="modal-dialog modal-${template.size || 'md'}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${template.title}</h5>
                        <button type="button" class="btn-close" data-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        ${template.content}
                    </div>
                    ${template.footer ? '<div class="modal-footer"></div>' : ''}
                </div>
            </div>
        `;
        
        return modalElement;
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        this.modalStack.forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    /**
     * Get modal info
     */
    getModalInfo(modalId) {
        return this.modals.get(modalId);
    }

    /**
     * Check if modal is open
     */
    isModalOpen(modalId) {
        const modal = this.modals.get(modalId);
        return modal ? modal.isOpen : false;
    }

    /**
     * Get active modal
     */
    getActiveModal() {
        return this.activeModal;
    }

    /**
     * Get modal count
     */
    getModalCount() {
        return this.modalStack.length;
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        // Close all modals
        this.closeAllModals();
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeydown);
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('submit', this.handleModalFormSubmit);
        
        // Clear modals
        this.modals.clear();
        this.modalStack = [];
        this.modalHistory = [];
        
        // Remove live region
        if (this.liveRegion && this.liveRegion.parentNode) {
            this.liveRegion.parentNode.removeChild(this.liveRegion);
        }
        
        this.isInitialized = false;
    }
}

// Initialize modal manager
const modalManager = new ModalManager();

// Global functions for onclick handlers
window.openDemoModal = () => {
    modalManager.createDynamicModal('demo');
};

window.openContactModal = () => {
    modalManager.createDynamicModal('contact');
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
} 