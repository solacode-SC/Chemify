// =============================================================================
// EQUATION.JS — Equation Display Logic (ES Module)
// Renders the balanced equation and energy badge based on store state.
// =============================================================================

import { subscribe } from './store.js';


// --- DOM References ----------------------------------------------------------

let equationEl = null;
let badgeEl = null;
let textContainer = null;   // Dedicated container for equation text (preserves badge)


// --- Render Logic ----------------------------------------------------------- 

function render(state) {
    if (!equationEl || !badgeEl) return;

    switch (state.status) {

        case 'idle':
        case 'ready':
            renderPlaceholder('Add at least 2 reactants to begin');
            hideBadge();
            break;

        case 'running':
            renderAnalyzing();
            hideBadge();
            break;

        case 'complete':
            renderEquation(state.equation);
            showBadge(state.energyType);
            break;

        case 'error':
            renderPlaceholder('Something went wrong. Try again.');
            hideBadge();
            break;
    }
}


// --- Placeholder ------------------------------------------------------------- 

function renderPlaceholder(text) {
    textContainer.innerHTML = `<p class="equation-text equation-text--placeholder">${text}</p>`;
}


// --- Analyzing (with blinking cursor) ---------------------------------------- 

function renderAnalyzing() {
    textContainer.innerHTML =
        `<p class="equation-text equation-text--placeholder equation-text--analyzing">` +
        `Analyzing reaction<span class="blink-cursor">|</span>` +
        `</p>`;
}


// --- Equation Rendering ------------------------------------------------------ 

function renderEquation(equationStr) {
    if (!equationStr) {
        renderPlaceholder('No equation available');
        return;
    }

    // Split on the arrow → to separate reactants and products
    const parts = equationStr.split('→');
    if (parts.length < 2) {
        textContainer.innerHTML =
            `<p class="equation-text equation-reveal">${equationStr}</p>`;
        return;
    }

    const reactantStr = parts[0].trim();
    const productStr = parts[1].trim();

    textContainer.innerHTML =
        `<p class="equation-text equation-reveal">` +
        `<span class="eq-reactant">${reactantStr}</span> ` +
        `<span class="eq-arrow">→</span> ` +
        `<span class="eq-product">${productStr}</span>` +
        `</p>`;
}


// --- Energy Badge ------------------------------------------------------------ 

function showBadge(energyType) {
    if (!energyType) {
        hideBadge();
        return;
    }

    badgeEl.className = 'energy-badge';

    if (energyType === 'exothermic') {
        badgeEl.classList.add('energy-badge--exothermic', 'badge-enter');
        badgeEl.textContent = '🔥 Exothermic';
    } else if (energyType === 'endothermic') {
        badgeEl.classList.add('energy-badge--endothermic', 'badge-enter');
        badgeEl.textContent = '❄️ Endothermic';
    }
}

function hideBadge() {
    badgeEl.className = 'energy-badge energy-badge--hidden';
    badgeEl.textContent = '';
}


// --- Init -------------------------------------------------------------------- 

/**
 * Initialize the equation display.
 * Creates a text container inside the equation card so that innerHTML updates
 * don't destroy the energy badge element.
 */
export function initEquationDisplay() {
    equationEl = document.getElementById('equation-display');
    badgeEl = document.getElementById('energy-badge');

    if (!equationEl || !badgeEl) return;

    // Create a dedicated text container to avoid destroying the badge on innerHTML writes
    textContainer = document.createElement('div');
    textContainer.className = 'equation-text-container';

    // Move existing text content into the container
    const existingText = equationEl.querySelector('.equation-text');
    if (existingText) {
        textContainer.appendChild(existingText);
    }
    equationEl.appendChild(textContainer);

    // Subscribe to store
    subscribe(render);
}
