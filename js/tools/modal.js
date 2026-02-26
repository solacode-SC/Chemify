/* ===================================================
   Chemify — Tool Modal System (ES Module)
   Shared modal shell for all tools. Each tool gets
   injected into the modal body via its init() function.
   =================================================== */

let cleanupFn = null;
let overlay, modal, closeBtn;
let isInitialized = false;

function initModal() {
    if (isInitialized) return;
    isInitialized = true;

    const html = `
    <div class="tool-modal-overlay" id="toolModalOverlay">
      <div class="tool-modal" id="toolModal">
        <div class="tool-modal__header">
          <div class="tool-modal__meta">
            <span class="tool-modal__category" id="toolModalCategory"></span>
            <span class="tool-modal__badge" id="toolModalBadge"></span>
          </div>
          <h2 class="tool-modal__title" id="toolModalTitle"></h2>
          <p class="tool-modal__subtitle" id="toolModalSubtitle"></p>
          <button class="tool-modal__close" id="toolModalClose">&times;</button>
        </div>
        <div class="tool-modal__body" id="toolModalBody"></div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', html);

    overlay = document.getElementById('toolModalOverlay');
    modal = document.getElementById('toolModal');
    closeBtn = document.getElementById('toolModalClose');

    // Close triggers
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-active')) {
            closeModal();
        }
    });
}

/**
 * Open the tool modal with the given configuration.
 * @param {Object} config
 * @param {string} config.title      – Modal title
 * @param {string} config.subtitle   – Modal subtitle
 * @param {string} config.category   – Category label (uppercase)
 * @param {string} config.badge      – Badge text (e.g. "Basic")
 * @param {Function} config.init     – Called with body element: init(bodyEl)
 */
export function openModal({ title, subtitle, category, badge, init }) {
    initModal();

    // Set header text
    document.getElementById('toolModalCategory').textContent = category || '';
    document.getElementById('toolModalBadge').textContent = badge || '';
    document.getElementById('toolModalTitle').textContent = title || '';
    document.getElementById('toolModalSubtitle').textContent = subtitle || '';

    // Clear body
    const body = document.getElementById('toolModalBody');
    body.innerHTML = '';

    // Reset cleanup
    cleanupFn = null;

    // Call tool's init function
    if (typeof init === 'function') {
        init(body);
    }

    // Show with animation
    overlay.style.display = 'flex';
    // Force reflow for animation
    overlay.offsetHeight;
    overlay.classList.add('is-active');

    // Lock body scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Close the tool modal with reverse animation.
 */
export function closeModal() {
    if (!overlay) return;

    overlay.classList.remove('is-active');

    // Wait for animation to finish before hiding
    const onEnd = () => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';

        // Run registered cleanup
        if (typeof cleanupFn === 'function') {
            cleanupFn();
            cleanupFn = null;
        }

        overlay.removeEventListener('transitionend', onEnd);
    };

    overlay.addEventListener('transitionend', onEnd);

    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
        if (overlay.style.display !== 'none') {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
            if (typeof cleanupFn === 'function') {
                cleanupFn();
                cleanupFn = null;
            }
        }
    }, 400);
}

/**
 * Register a cleanup function called when the modal closes.
 * Used by tools to cancel timers, abort requests, etc.
 * @param {Function} fn
 */
export function registerCleanup(fn) {
    cleanupFn = fn;
}
