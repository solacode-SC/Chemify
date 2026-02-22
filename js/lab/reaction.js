// =============================================================================
// REACTION.JS — Run Reaction Button Logic (ES Module)
// Controls the Run Reaction button state based on store status changes.
// =============================================================================

import { runReaction, resetReaction, subscribe, getState } from './store.js';


// --- State -------------------------------------------------------------------

let btn = null;
let isCompleteState = false;  // Track if we're in "complete" to handle re-run


// --- Button Updater --------------------------------------------------------- 

function updateButton(state) {
    if (!btn) return;

    switch (state.status) {

        case 'idle':
            btn.disabled = true;
            btn.classList.remove('running');
            btn.innerHTML = '<span class="btn__icon">⚗</span> Run Reaction';
            isCompleteState = false;
            break;

        case 'ready':
            btn.disabled = false;
            btn.classList.remove('running');
            btn.innerHTML = '<span class="btn__icon">⚗</span> Run Reaction';
            isCompleteState = false;
            break;

        case 'running':
            btn.disabled = true;
            btn.classList.add('running');
            btn.innerHTML = '<span class="spinner"></span> Running…';
            isCompleteState = false;
            break;

        case 'complete':
            btn.disabled = false;
            btn.classList.remove('running');
            btn.innerHTML = '<span class="btn__icon">↺</span> Run Again';
            isCompleteState = true;
            break;

        case 'error':
            btn.disabled = false;
            btn.classList.remove('running');
            btn.innerHTML = '<span class="btn__icon">⚠</span> Error — Try Again';
            isCompleteState = false;
            break;
    }
}


// --- Click Handler ---------------------------------------------------------- 

function handleClick() {
    const state = getState();

    // If in complete state: reset first, then re-run after a short delay
    if (isCompleteState || state.status === 'complete') {
        resetReaction();
        setTimeout(() => runReaction(), 100);
        return;
    }

    // Normal run
    if (state.status === 'ready') {
        runReaction();
    }
}


// --- Init ------------------------------------------------------------------- 

/**
 * Initialize the Run Reaction button.
 * Binds click handler and subscribes to store for state-driven UI updates.
 */
export function initRunButton() {
    btn = document.getElementById('run-reaction-btn');
    if (!btn) return;

    // Set initial state
    const initial = getState();
    updateButton(initial);

    // Click handler
    btn.addEventListener('click', handleClick);

    // Subscribe to store changes
    subscribe(updateButton);
}
