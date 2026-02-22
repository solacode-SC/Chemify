// =============================================================================
// REACTANTS.JS — Add/Remove Reactant UI (ES Module)
// Handles the modal for adding reactants and renders chips in the control bar.
// =============================================================================

import { addReactant, removeReactant, getState } from './store.js';


// --- Modal HTML Template --------------------------------------------------- 

const MODAL_HTML = `
<div class="reactant-modal-overlay" id="reactant-modal-overlay">
    <div class="reactant-modal" id="reactant-modal">
        <h2 class="reactant-modal__title">Add Reactant</h2>
        <p class="reactant-modal__subtitle">Enter a chemical formula</p>

        <input
            type="text"
            class="reactant-modal__input"
            id="reactant-input"
            placeholder="e.g. H₂, O₂, NaCl, CH₄"
            autocomplete="off"
            spellcheck="false"
        />

        <div class="reactant-modal__error" id="reactant-error"></div>

        <div class="reactant-modal__actions">
            <button class="btn btn--ghost btn--modal" id="reactant-cancel-btn" type="button">Cancel</button>
            <button class="btn btn--primary btn--modal" id="reactant-add-btn" type="button">Add</button>
        </div>
    </div>
</div>
`;


// --- DOM References (set in init) -------------------------------------------

let overlay = null;
let modal = null;
let input = null;
let errorDiv = null;
let addBtn = null;
let cancelBtn = null;


// --- Modal Logic ----------------------------------------------------------- 

function injectModal() {
    const container = document.createElement('div');
    container.innerHTML = MODAL_HTML.trim();
    document.body.appendChild(container.firstElementChild);

    overlay = document.getElementById('reactant-modal-overlay');
    modal = document.getElementById('reactant-modal');
    input = document.getElementById('reactant-input');
    errorDiv = document.getElementById('reactant-error');
    addBtn = document.getElementById('reactant-add-btn');
    cancelBtn = document.getElementById('reactant-cancel-btn');
}

function openModal() {
    if (!overlay) return;
    input.value = '';
    errorDiv.textContent = '';
    errorDiv.classList.remove('is-visible');
    overlay.classList.add('is-open');
    // Focus input after transition
    setTimeout(() => input.focus(), 100);
}

function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    input.value = '';
    errorDiv.textContent = '';
    errorDiv.classList.remove('is-visible');
}

function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.classList.add('is-visible');
}

function handleAdd() {
    const formula = (input.value || '').trim();

    // Empty check
    if (!formula) {
        showError('Please enter a chemical formula');
        input.focus();
        return;
    }

    // Duplicate check (case-insensitive)
    const current = getState().reactants;
    const isDuplicate = current.some(
        r => r.formula.toLowerCase() === formula.toLowerCase()
    );
    if (isDuplicate) {
        showError('This reactant is already added');
        input.focus();
        return;
    }

    // Valid — add and close
    addReactant(formula);
    closeModal();
}


// --- Render Reactant Tags -------------------------------------------------- 

/**
 * Render reactant chips into #reactants-area.
 * @param {Array<{id: string, formula: string}>} reactants
 */
export function renderReactantTags(reactants) {
    const area = document.getElementById('reactants-area');
    if (!area) return;

    area.innerHTML = '';

    if (reactants.length === 0) return;

    reactants.forEach((reactant, i) => {
        const chip = document.createElement('span');
        chip.className = 'reactant-chip chip-enter';
        // Stagger the animation slightly per chip
        chip.style.animationDelay = `${i * 0.05}s`;

        const formulaSpan = document.createElement('span');
        formulaSpan.className = 'reactant-chip__formula';
        formulaSpan.textContent = reactant.formula;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'reactant-chip__remove';
        removeBtn.type = 'button';
        removeBtn.textContent = '×';
        removeBtn.setAttribute('aria-label', `Remove ${reactant.formula}`);
        removeBtn.addEventListener('click', () => removeReactant(reactant.id));

        chip.appendChild(formulaSpan);
        chip.appendChild(removeBtn);
        area.appendChild(chip);
    });
}


// --- Initialization -------------------------------------------------------- 

/**
 * Initialize the reactants module:
 * - Inject modal into DOM
 * - Bind open/close/add events
 */
export function initReactants() {
    // Inject modal HTML
    injectModal();

    // Open modal on "Add Reactant" button click
    const openBtn = document.getElementById('add-reactant-btn');
    if (openBtn) {
        openBtn.addEventListener('click', openModal);
    }

    // Close on Cancel
    cancelBtn.addEventListener('click', closeModal);

    // Close on overlay click (but not modal panel click)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    // Add on button click
    addBtn.addEventListener('click', handleAdd);

    // Add on Enter key in input
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
        // Clear error on typing
        if (errorDiv.classList.contains('is-visible')) {
            errorDiv.classList.remove('is-visible');
            errorDiv.textContent = '';
        }
    });
}
