// =============================================================================
// CALCULATIONS.JS — Right Panel Logic (ES Module)
// Manages reaction type badge, conditions card, and calculations accordion.
// =============================================================================

import { subscribe } from './store.js';


// --- DOM References ----------------------------------------------------------

let typeBadge = null;
let tempVal = null;
let pressureVal = null;
let catalystVal = null;
let limitingVal = null;
let theoreticalVal = null;
let percentVal = null;


// --- Badge Type → CSS Class Mapping ------------------------------------------

const TYPE_CLASS_MAP = {
    'synthesis': 'badge--synthesis',
    'decomposition': 'badge--decomposition',
    'combustion': 'badge--combustion',
    'single displacement': 'badge--displacement',
    'double displacement': 'badge--displacement',
    'acid-base': 'badge--synthesis',
    'redox': 'badge--combustion'
};

const ALL_BADGE_CLASSES = [
    'badge--muted',
    'badge--synthesis',
    'badge--decomposition',
    'badge--combustion',
    'badge--displacement'
];


// --- Number Tween ------------------------------------------------------------

/**
 * Animate a numeric value counting up inside an element.
 * Extracts the number from a string like "450°C" and tweens it.
 */
function tweenValue(el, targetStr, duration = 600) {
    // Extract leading number
    const match = targetStr.match(/^([\d.]+)(.*)/);
    if (!match) {
        el.textContent = targetStr;
        return;
    }

    const targetNum = parseFloat(match[1]);
    const suffix = match[2]; // e.g. "°C", " atm", " g", "%"
    const startNum = 0;
    const startTime = performance.now();

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startNum + (targetNum - startNum) * eased;

        // Format: use decimals if target has them
        const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
        el.textContent = current.toFixed(decimals) + suffix;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}


// --- Render Logic ------------------------------------------------------------ 

function render(state) {
    switch (state.status) {
        case 'idle':
        case 'ready':
            renderReset();
            break;

        case 'running':
            renderRunning();
            break;

        case 'complete':
            renderComplete(state);
            break;
    }
}

function renderReset() {
    // Badge
    if (typeBadge) {
        typeBadge.className = 'badge badge--muted';
        typeBadge.textContent = '—';
    }

    // Conditions
    setTextIfExists(tempVal, '—');
    setTextIfExists(pressureVal, '—');
    setTextIfExists(catalystVal, '—');

    // Calculations
    setTextIfExists(limitingVal, '—');
    setTextIfExists(theoreticalVal, '—');
    setTextIfExists(percentVal, '—');
}

function renderRunning() {
    if (typeBadge) {
        typeBadge.className = 'badge badge--muted';
        typeBadge.textContent = 'Analyzing…';
    }
    setTextIfExists(tempVal, '…');
    setTextIfExists(pressureVal, '…');
    setTextIfExists(catalystVal, '…');
}

function renderComplete(state) {
    // --- Reaction Type Badge ---
    if (typeBadge && state.reactionType) {
        const typeKey = state.reactionType.toLowerCase();
        const badgeClass = TYPE_CLASS_MAP[typeKey] || 'badge--muted';

        typeBadge.className = 'badge';
        ALL_BADGE_CLASSES.forEach(c => typeBadge.classList.remove(c));
        typeBadge.classList.add(badgeClass);
        typeBadge.textContent = capitalize(state.reactionType);
    }

    // --- Conditions ---
    const cond = state.conditions;
    if (cond.temperature) tweenValue(tempVal, cond.temperature);
    if (cond.pressure) tweenValue(pressureVal, cond.pressure);
    if (cond.catalyst) {
        catalystVal.textContent = cond.catalyst;
    }

    // --- Calculations ---
    const calc = state.calculations;
    if (calc.limitingReagent) {
        limitingVal.textContent = calc.limitingReagent;
    }
    if (calc.theoreticalYield) tweenValue(theoreticalVal, calc.theoreticalYield);
    if (calc.percentYield) tweenValue(percentVal, calc.percentYield);
}


// --- Accordion Toggle --------------------------------------------------------

function initAccordions() {
    const accordions = document.querySelectorAll('#calculations-card .accordion');

    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion__header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isOpen = acc.classList.contains('is-open');
            acc.classList.toggle('is-open');
            header.setAttribute('aria-expanded', !isOpen);
        });

        // Keyboard support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}


// --- Helpers -----------------------------------------------------------------

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function setTextIfExists(el, text) {
    if (el) el.textContent = text;
}


// --- Init -------------------------------------------------------------------- 

/**
 * Initialize the calculations panel.
 * Grabs all DOM refs, sets up accordion toggles, subscribes to store.
 */
export function initCalculations() {
    typeBadge = document.getElementById('reaction-type-badge');
    tempVal = document.getElementById('temp-value');
    pressureVal = document.getElementById('pressure-value');
    catalystVal = document.getElementById('catalyst-value');
    limitingVal = document.getElementById('limiting-reagent-value');
    theoreticalVal = document.getElementById('theoretical-yield-value');
    percentVal = document.getElementById('percent-yield-value');

    // Set up accordion click toggles
    initAccordions();

    // Subscribe to store
    subscribe(render);
}
