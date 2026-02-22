// =============================================================================
// MAIN.JS — Lab Page Entry Point (ES Module)
// Wires all Reaction Studio modules together.
// =============================================================================

import { initReactants, renderReactantTags } from './reactants.js';
import { initRunButton } from './reaction.js';
import { initEquationDisplay } from './equation.js';
import { initDiagram } from './diagram.js';
import { initCalculations } from './calculations.js';
import { subscribe, getState } from './store.js';


// --- Status Indicator --------------------------------------------------------

const STATUS_CONFIG = {
    idle: { color: '#6b7280', text: 'Ready to simulate', pulse: false },
    ready: { color: '#f59e0b', text: 'Reactants added', pulse: false },
    running: { color: '#00d4ff', text: 'Running reaction…', pulse: true },
    complete: { color: '#10b981', text: 'Reaction complete', pulse: false },
    error: { color: '#ef4444', text: 'Error occurred', pulse: false }
};

function injectStatusIndicator() {
    const hero = document.querySelector('.lab-hero');
    if (!hero) return null;

    const indicator = document.createElement('div');
    indicator.className = 'status-indicator';
    indicator.id = 'status-indicator';
    indicator.innerHTML = `
        <span class="status-indicator__dot"></span>
        <span class="status-indicator__text">Ready to simulate</span>
    `;
    hero.appendChild(indicator);
    return indicator;
}

function updateStatusIndicator(indicator, status) {
    if (!indicator) return;

    const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
    const dot = indicator.querySelector('.status-indicator__dot');
    const text = indicator.querySelector('.status-indicator__text');

    if (dot) {
        dot.style.background = config.color;
        dot.style.boxShadow = `0 0 6px ${config.color}`;
        dot.classList.toggle('status-indicator__dot--pulse', config.pulse);
    }

    if (text) {
        text.textContent = config.text;
        text.style.color = config.color;
    }
}


// --- Boot -------------------------------------------------------------------- 

document.addEventListener('DOMContentLoaded', () => {

    // Initialize all modules
    initReactants();
    initRunButton();
    initEquationDisplay();
    initDiagram();
    initCalculations();

    // Inject status indicator into hero
    const statusIndicator = injectStatusIndicator();

    // Global render subscriber — cross-cutting concerns
    subscribe((state) => {

        // Re-render reactant chips on every state change
        renderReactantTags(state.reactants);

        // Update status indicator
        updateStatusIndicator(statusIndicator, state.status);

        // Dev logging
        console.log('[Chemify Store]', state.status, state);
    });

    // Render initial state
    const initial = getState();
    renderReactantTags(initial.reactants);
    updateStatusIndicator(statusIndicator, initial.status);
    console.log('[Chemify Lab] initialized', initial);
});
