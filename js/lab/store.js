// =============================================================================
// STORE.JS — Reaction Studio State Management (ES Module)
// Single source of truth for the entire lab page.
// Simple pub/sub pattern — no external dependencies.
// =============================================================================

// --- State -------------------------------------------------------------------

const state = {
    reactants: [],          // Array of { id: string, formula: string }
    equation: "",
    reactionType: "",
    energyType: null,       // "exothermic" | "endothermic" | null
    conditions: {
        temperature: null,
        pressure: null,
        catalyst: null
    },
    calculations: {
        limitingReagent: null,
        theoreticalYield: null,
        percentYield: null
    },
    status: "idle"          // "idle" | "ready" | "running" | "complete" | "error"
};


// --- Pub/Sub -----------------------------------------------------------------

const listeners = [];

function notify() {
    const snapshot = { ...state };
    for (const fn of listeners) {
        try {
            fn(snapshot);
        } catch (err) {
            console.error("[store] Listener error:", err);
        }
    }
}

/**
 * Subscribe to state changes.
 * @param {Function} fn — called with a shallow copy of state on every change
 * @returns {Function} unsubscribe function
 */
export function subscribe(fn) {
    listeners.push(fn);
    return () => {
        const idx = listeners.indexOf(fn);
        if (idx !== -1) listeners.splice(idx, 1);
    };
}


// --- Getters -----------------------------------------------------------------

/** Return a shallow copy of the current state. */
export function getState() {
    return { ...state };
}


// --- Mock Data ---------------------------------------------------------------

const REACTION_TYPES = [
    "Synthesis",
    "Decomposition",
    "Single Displacement",
    "Double Displacement",
    "Combustion",
    "Acid-Base",
    "Redox"
];

const ENERGY_TYPES = ["exothermic", "endothermic"];

const CATALYSTS = [
    "Pt (Platinum)",
    "Pd (Palladium)",
    "Fe₂O₃",
    "V₂O₅",
    "MnO₂",
    "Ni (Nickel)",
    "None required"
];


// --- Helpers -----------------------------------------------------------------

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Build a mock balanced equation and products from reactant formulas.
 */
function buildMockReaction(formulas) {
    const lower = formulas.map(f => f.toLowerCase());
    let equation = "";
    let products = "";

    // Special case: H₂ + O₂
    if (lower.includes("h₂") && lower.includes("o₂") ||
        lower.includes("h2") && lower.includes("o2")) {
        equation = "2H₂ + O₂ → 2H₂O";
        products = "2H₂O";
    }
    // Carbon compound → CO₂ + H₂O (combustion-like)
    else if (lower.some(f => f.includes("c") && !f.includes("cl") && !f.includes("ca") && !f.includes("cu") && !f.includes("cr"))) {
        const reactantStr = formulas.join(" + ");
        equation = `${reactantStr} → CO₂ + H₂O`;
        products = "CO₂ + H₂O";
    }
    // Generic fallback: combine into a fused product
    else {
        const reactantStr = formulas.join(" + ");
        const productFormula = formulas.join("") + "₂";
        equation = `${reactantStr} → ${productFormula}`;
        products = productFormula;
    }

    return { equation, products };
}


// --- Actions -----------------------------------------------------------------

/**
 * Add a reactant by formula string.
 * Trims, validates, checks for duplicates (case-insensitive).
 */
export function addReactant(formula) {
    const trimmed = (formula || "").trim();
    if (!trimmed) return;

    // Check for duplicate (case-insensitive)
    const exists = state.reactants.some(
        r => r.formula.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return;

    state.reactants.push({
        id: crypto.randomUUID(),
        formula: trimmed
    });

    state.status = state.reactants.length >= 2 ? "ready" : "idle";
    notify();
}

/**
 * Remove a reactant by its unique id.
 */
export function removeReactant(id) {
    state.reactants = state.reactants.filter(r => r.id !== id);
    state.status = state.reactants.length >= 2 ? "ready" : "idle";
    notify();
}

/**
 * Reset reaction results but keep reactants.
 */
export function resetReaction() {
    state.equation = "";
    state.reactionType = "";
    state.energyType = null;
    state.conditions = { temperature: null, pressure: null, catalyst: null };
    state.calculations = { limitingReagent: null, theoreticalYield: null, percentYield: null };
    state.status = state.reactants.length >= 2 ? "ready" : "idle";
    notify();
}

/**
 * Run the mock reaction.
 * Sets status to "running", then after 1400ms resolves with mock results.
 */
export function runReaction() {
    if (state.reactants.length < 2) return;

    // Transition to running
    state.status = "running";
    notify();

    setTimeout(() => {
        const formulas = state.reactants.map(r => r.formula);

        // Build equation
        const { equation } = buildMockReaction(formulas);
        state.equation = equation;

        // Reaction type
        state.reactionType = randomItem(REACTION_TYPES);

        // Energy type
        state.energyType = randomItem(ENERGY_TYPES);

        // Conditions
        state.conditions = {
            temperature: `${randomInt(200, 800)}°C`,
            pressure: `${randomFloat(1, 5)} atm`,
            catalyst: randomItem(CATALYSTS)
        };

        // Calculations
        const limitingIdx = randomInt(0, formulas.length - 1);
        state.calculations = {
            limitingReagent: formulas[limitingIdx],
            theoreticalYield: `${randomFloat(10, 250, 2)} g`,
            percentYield: `${randomFloat(60, 99, 1)}%`
        };

        // Done
        state.status = "complete";
        notify();
    }, 1400);
}
