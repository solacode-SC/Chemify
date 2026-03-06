/* ===================================================
   Chemify — Oxidation State Finder (ES Module)
   Given a compound formula and overall charge, determines
   the oxidation state of each element using standard
   rules + algebraic solving.
   =================================================== */

import { parseFormula } from '../utils/parser.js';

// ---------- Element classification sets ----------

const GROUP_1 = new Set(['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr']);
const GROUP_2 = new Set(['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra']);
const HALOGENS = new Set(['F', 'Cl', 'Br', 'I', 'At']);

// Metals that form hydrides (H = -1)
const METAL_HYDRIDE_METALS = new Set([
    ...GROUP_1, ...GROUP_2,
    'Al', 'Zn', 'Ga', 'In', 'Tl', 'Sn', 'Pb', 'Bi'
]);

// Known peroxide formulas (O = -1)
const PEROXIDE_PATTERNS = new Set([
    'H2O2', 'Na2O2', 'K2O2', 'BaO2', 'CaO2', 'Li2O2',
    'Rb2O2', 'Cs2O2', 'SrO2', 'MgO2'
]);

// Superoxide patterns (O = -1/2)
const SUPEROXIDE_PATTERNS = new Set([
    'KO2', 'NaO2', 'RbO2', 'CsO2'
]);

// Element names for tiles
const ELEMENT_NAMES = {
    H: 'Hydrogen', He: 'Helium', Li: 'Lithium', Be: 'Beryllium', B: 'Boron', C: 'Carbon',
    N: 'Nitrogen', O: 'Oxygen', F: 'Fluorine', Ne: 'Neon', Na: 'Sodium', Mg: 'Magnesium',
    Al: 'Aluminium', Si: 'Silicon', P: 'Phosphorus', S: 'Sulfur', Cl: 'Chlorine', Ar: 'Argon',
    K: 'Potassium', Ca: 'Calcium', Sc: 'Scandium', Ti: 'Titanium', V: 'Vanadium', Cr: 'Chromium',
    Mn: 'Manganese', Fe: 'Iron', Co: 'Cobalt', Ni: 'Nickel', Cu: 'Copper', Zn: 'Zinc',
    Ga: 'Gallium', Ge: 'Germanium', As: 'Arsenic', Se: 'Selenium', Br: 'Bromine', Kr: 'Krypton',
    Rb: 'Rubidium', Sr: 'Strontium', Y: 'Yttrium', Zr: 'Zirconium', Nb: 'Niobium', Mo: 'Molybdenum',
    Tc: 'Technetium', Ru: 'Ruthenium', Rh: 'Rhodium', Pd: 'Palladium', Ag: 'Silver', Cd: 'Cadmium',
    In: 'Indium', Sn: 'Tin', Sb: 'Antimony', Te: 'Tellurium', I: 'Iodine', Xe: 'Xenon',
    Cs: 'Caesium', Ba: 'Barium', La: 'Lanthanum', Ce: 'Cerium', Pr: 'Praseodymium', Nd: 'Neodymium',
    Pm: 'Promethium', Sm: 'Samarium', Eu: 'Europium', Gd: 'Gadolinium', Tb: 'Terbium', Dy: 'Dysprosium',
    Ho: 'Holmium', Er: 'Erbium', Tm: 'Thulium', Yb: 'Ytterbium', Lu: 'Lutetium', Hf: 'Hafnium',
    Ta: 'Tantalum', W: 'Tungsten', Re: 'Rhenium', Os: 'Osmium', Ir: 'Iridium', Pt: 'Platinum',
    Au: 'Gold', Hg: 'Mercury', Tl: 'Thallium', Pb: 'Lead', Bi: 'Bismuth', Po: 'Polonium',
    At: 'Astatine', Rn: 'Radon', Fr: 'Francium', Ra: 'Radium', Ac: 'Actinium', Th: 'Thorium',
    Pa: 'Protactinium', U: 'Uranium', Np: 'Neptunium', Pu: 'Plutonium', Am: 'Americium', Cm: 'Curium',
    Bk: 'Berkelium', Cf: 'Californium', Es: 'Einsteinium', Fm: 'Fermium', Md: 'Mendelevium',
    No: 'Nobelium', Lr: 'Lawrencium'
};

// Subscript helper
const SUB = { '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
              '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089' };
function toSubscript(s) { return String(s).replace(/\d/g, d => SUB[d] || d); }

// Superscript helper for charges
const SUP = { '0': '\u2070', '1': '\u00b9', '2': '\u00b2', '3': '\u00b3', '4': '\u2074',
              '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079' };
function toSuperscript(s) { return String(s).replace(/\d/g, d => SUP[d] || d); }

// ---------- Core Algorithm ----------

/**
 * Determine oxidation states for a compound.
 * @param {string} formula - Chemical formula string
 * @param {number} charge - Overall compound charge (default 0)
 * @returns {{ states: Object, atoms: Object, rules: string[], isFractional: boolean } | { error: string }}
 */
function findOxidationStates(formula, charge = 0) {
    const atoms = parseFormula(formula);
    if (!atoms) return { error: 'Could not parse formula. Check for typos.' };

    const elements = Object.keys(atoms);
    const states = {};
    const rules = [];
    let isFractional = false;

    // Rule 1: Pure element (only one element, charge = 0) → oxidation state = 0
    if (elements.length === 1 && charge === 0) {
        states[elements[0]] = 0;
        rules.push(`${elements[0]} is a pure element → oxidation state = 0`);
        return { states, atoms, rules, isFractional };
    }

    // Rule 2: Monoatomic ion (one element, non-zero charge)
    if (elements.length === 1 && charge !== 0) {
        const el = elements[0];
        const count = atoms[el];
        const state = charge / count;
        states[el] = state;
        if (!Number.isInteger(state)) isFractional = true;
        rules.push(`Monoatomic ion: charge ${formatCharge(charge)} / ${count} atom${count > 1 ? 's' : ''} → ${el} = ${formatState(state)}`);
        return { states, atoms, rules, isFractional };
    }

    // Determine known elements using rules

    // Check peroxide/superoxide status
    const isPeroxide = PEROXIDE_PATTERNS.has(formula);
    const isSuperoxide = SUPEROXIDE_PATTERNS.has(formula);

    // Check if this is OF₂ (oxygen difluoride — O = +2)
    const isOF2 = (formula === 'OF2' && elements.includes('O') && elements.includes('F'));

    // Detect metal hydride: H + exactly one metal from METAL_HYDRIDE_METALS, no other elements
    const hasH = elements.includes('H');
    const otherElements = elements.filter(e => e !== 'H');
    const isMetalHydride = hasH && otherElements.length === 1 && METAL_HYDRIDE_METALS.has(otherElements[0]);

    // Apply rules in priority order
    for (const el of elements) {
        if (states[el] !== undefined) continue;

        // Rule 3: F is always -1
        if (el === 'F') {
            states[el] = -1;
            rules.push('F is always −1');
            continue;
        }

        // Rule 4: O
        if (el === 'O') {
            if (isOF2) {
                states[el] = +2;
                rules.push('O in OF₂ = +2 (bonded only to F)');
            } else if (isPeroxide) {
                states[el] = -1;
                rules.push('O in peroxide = −1');
            } else if (isSuperoxide) {
                states[el] = -0.5;
                isFractional = true;
                rules.push('O in superoxide = −½');
            } else {
                states[el] = -2;
                rules.push('O is usually −2');
            }
            continue;
        }

        // Rule 5: H
        if (el === 'H') {
            if (isMetalHydride) {
                states[el] = -1;
                rules.push('H in metal hydride = −1');
            } else {
                states[el] = +1;
                rules.push('H is usually +1');
            }
            continue;
        }

        // Rule 6: Group 1 metals = +1
        if (GROUP_1.has(el)) {
            states[el] = +1;
            rules.push(`${el} (Group 1) = +1`);
            continue;
        }

        // Rule 7: Group 2 metals = +2
        if (GROUP_2.has(el)) {
            states[el] = +2;
            rules.push(`${el} (Group 2) = +2`);
            continue;
        }

        // Rule 8: Common halides (when they are the most electronegative remaining)
        // Cl, Br, I = -1 when not bonded to O or a more electronegative halogen
        if (HALOGENS.has(el) && el !== 'F') {
            // If O is present, the halogen might not be -1 (e.g. ClO3⁻)
            // Only assign -1 if no O or F in the compound
            if (!elements.includes('O') && !elements.includes('F')) {
                states[el] = -1;
                rules.push(`${el} (halide, no O/F present) = −1`);
                continue;
            }
        }
    }

    // Rule 9: Algebraic solve for remaining unknown(s)
    const unknowns = elements.filter(el => states[el] === undefined);

    if (unknowns.length === 0) {
        // All assigned, verify
        return { states, atoms, rules, isFractional };
    }

    if (unknowns.length === 1) {
        const el = unknowns[0];
        let knownSum = 0;
        for (const [e, count] of Object.entries(atoms)) {
            if (e !== el) knownSum += (states[e] || 0) * count;
        }
        const state = (charge - knownSum) / atoms[el];
        states[el] = state;
        if (!Number.isInteger(state) && Math.abs(state - Math.round(state)) > 0.001) {
            isFractional = true;
        }
        rules.push(`Algebra: ${el} × ${atoms[el]} = ${formatCharge(charge)} − (${formatNum(knownSum)}) → ${el} = ${formatState(state)}`);
        return { states, atoms, rules, isFractional };
    }

    // Multiple unknowns — try assigning common states for all but one
    // This is a heuristic for common compounds
    // Sort unknowns: metals first, then by electronegativity heuristic
    const commonStates = {
        'Al': +3, 'Ag': +1, 'Zn': +2, 'Sc': +3, 'Ga': +3,
        'In': +3, 'Cd': +2, 'Bi': +3
    };

    let solved = false;
    for (let i = 0; i < unknowns.length; i++) {
        const el = unknowns[i];
        if (commonStates[el] !== undefined) {
            states[el] = commonStates[el];
            rules.push(`${el} commonly has oxidation state ${formatState(commonStates[el])}`);
            // Now try to solve for the rest
            const remaining = unknowns.filter(u => u !== el);
            if (remaining.length === 1) {
                const r = remaining[0];
                let knownSum = 0;
                for (const [e, count] of Object.entries(atoms)) {
                    if (e !== r) knownSum += (states[e] || 0) * count;
                }
                const state = (charge - knownSum) / atoms[r];
                states[r] = state;
                if (!Number.isInteger(state) && Math.abs(state - Math.round(state)) > 0.001) isFractional = true;
                rules.push(`Algebra: ${r} × ${atoms[r]} = ${formatCharge(charge)} − (${formatNum(knownSum)}) → ${r} = ${formatState(state)}`);
                solved = true;
                break;
            }
        }
    }

    if (!solved) {
        // Last resort: assign all but last unknown a state of 0, solve for last
        // Or just note we can't fully determine
        if (unknowns.length >= 2) {
            // Solve as system: assign all unknowns except last one as "unknown"
            // For now, distribute: solve for the last unknown assuming others are 0
            let knownSum = 0;
            for (const [e, count] of Object.entries(atoms)) {
                if (states[e] !== undefined) knownSum += states[e] * count;
            }
            const remainingCharge = charge - knownSum;
            const totalUnknownAtoms = unknowns.reduce((sum, el) => sum + atoms[el], 0);
            const avgState = remainingCharge / totalUnknownAtoms;
            for (const el of unknowns) {
                states[el] = avgState;
            }
            if (!Number.isInteger(avgState) && Math.abs(avgState - Math.round(avgState)) > 0.001) isFractional = true;
            rules.push(`Multiple unknowns: distributed remaining charge (${formatCharge(remainingCharge)}) across ${totalUnknownAtoms} atoms → ${formatState(avgState)} each`);
        }
    }

    return { states, atoms, rules, isFractional };
}

// ---------- Formatting helpers ----------

function formatState(val) {
    if (val === 0) return '0';
    // Check for clean fractions
    const frac = toFraction(val);
    if (frac) {
        const sign = val > 0 ? '+' : '−';
        return `${sign}${frac}`;
    }
    const sign = val > 0 ? '+' : '−';
    const abs = Math.abs(val);
    if (Number.isInteger(val)) return `${sign}${abs}`;
    return `${sign}${abs.toFixed(2).replace(/\.?0+$/, '')}`;
}

function formatStateHTML(val) {
    if (val === 0) return '0';
    const frac = toFraction(val);
    if (frac) {
        const sign = val > 0 ? '+' : '−';
        return `${sign}${frac}`;
    }
    const sign = val > 0 ? '+' : '−';
    const abs = Math.abs(val);
    if (Number.isInteger(val)) return `${sign}${abs}`;
    return `${sign}${abs.toFixed(2).replace(/\.?0+$/, '')}`;
}

function formatCharge(c) {
    if (c === 0) return '0';
    const sign = c > 0 ? '+' : '−';
    return `${sign}${Math.abs(c)}`;
}

function formatNum(n) {
    if (Number.isInteger(n)) return String(n);
    const frac = toFraction(n);
    if (frac) return (n < 0 ? '−' : '') + frac;
    return n.toFixed(2).replace(/\.?0+$/, '');
}

/**
 * Try to express a number as a simple fraction string.
 * Returns null if not a clean fraction.
 */
function toFraction(val) {
    const abs = Math.abs(val);
    // Try denominators 1-12
    for (let d = 1; d <= 12; d++) {
        const n = abs * d;
        if (Math.abs(n - Math.round(n)) < 0.001) {
            const num = Math.round(n);
            if (d === 1) return null; // It's an integer, not a fraction
            return `${num}/${d}`;
        }
    }
    return null;
}

// ---------- Quick examples ----------

const QUICK_EXAMPLES = [
    { formula: 'NaCl', charge: 0, label: 'NaCl' },
    { formula: 'H2SO4', charge: 0, label: 'H₂SO₄' },
    { formula: 'KMnO4', charge: 0, label: 'KMnO₄' },
    { formula: 'Cr2O7', charge: -2, label: 'Cr₂O₇²⁻' },
    { formula: 'Fe3O4', charge: 0, label: 'Fe₃O₄' },
    { formula: 'Na2O2', charge: 0, label: 'Na₂O₂' },
    { formula: 'NaH', charge: 0, label: 'NaH' },
    { formula: 'OF2', charge: 0, label: 'OF₂' },
];

// ---------- Main Init ----------

export function initOxidationStates(container) {
    container.innerHTML = `
    <div class="ox-tool">

      <!-- Formula input -->
      <div class="ox-input-section">
        <div class="ox-input-row">
          <div class="ox-input-group ox-input-group--formula">
            <label class="mm-label">Chemical Formula</label>
            <input type="text" class="mm-input" id="oxFormulaInput"
                   placeholder="e.g. KMnO4" autocomplete="off" spellcheck="false" />
          </div>
          <div class="ox-input-group ox-input-group--charge">
            <label class="mm-label">Overall Charge</label>
            <input type="number" class="mm-input" id="oxChargeInput"
                   placeholder="0" step="1" value="0" />
          </div>
        </div>
        <button class="mm-calculate-btn" id="oxCalcBtn">Find Oxidation States</button>
      </div>

      <!-- Quick examples -->
      <div class="ox-examples">
        <span class="ox-examples-label">Try:</span>
        <div class="ox-examples-list" id="oxExamples"></div>
      </div>

      <!-- Error -->
      <div class="ox-error" id="oxError"></div>

      <!-- Results -->
      <div class="ox-results" id="oxResults" style="display:none">

        <!-- Element tiles -->
        <div class="ox-tiles" id="oxTiles"></div>

        <!-- Compound diagram with states above -->
        <div class="ox-diagram" id="oxDiagram"></div>

        <!-- Verification table -->
        <div class="ox-verification" id="oxVerification">
          <h4 class="mm-breakdown-title">Algebraic Verification</h4>
          <div class="ox-verify-body" id="oxVerifyBody"></div>
        </div>

        <!-- Rules applied -->
        <div class="ox-rules" id="oxRules">
          <h4 class="mm-breakdown-title">Rules Applied</h4>
          <ol class="ox-rules-list" id="oxRulesList"></ol>
        </div>

      </div>

    </div>
  `;

    // Grab elements
    const formulaInput = container.querySelector('#oxFormulaInput');
    const chargeInput = container.querySelector('#oxChargeInput');
    const calcBtn = container.querySelector('#oxCalcBtn');
    const examplesContainer = container.querySelector('#oxExamples');
    const errorEl = container.querySelector('#oxError');
    const resultsEl = container.querySelector('#oxResults');
    const tilesEl = container.querySelector('#oxTiles');
    const diagramEl = container.querySelector('#oxDiagram');
    const verifyBody = container.querySelector('#oxVerifyBody');
    const rulesList = container.querySelector('#oxRulesList');

    // ---------- Quick examples ----------

    for (const ex of QUICK_EXAMPLES) {
        const btn = document.createElement('button');
        btn.className = 'ox-example-btn';
        btn.textContent = ex.label;
        btn.addEventListener('click', () => {
            formulaInput.value = ex.formula;
            chargeInput.value = ex.charge;
            calculate();
        });
        examplesContainer.appendChild(btn);
    }

    // ---------- Error ----------

    function showError(msg) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
    function hideError() { errorEl.style.display = 'none'; errorEl.textContent = ''; }

    // ---------- Calculate ----------

    function calculate() {
        hideError();
        resultsEl.style.display = 'none';

        const formula = formulaInput.value.trim();
        if (!formula) { showError('Enter a chemical formula.'); return; }

        const chargeStr = chargeInput.value.trim();
        const charge = chargeStr === '' ? 0 : parseInt(chargeStr, 10);
        if (isNaN(charge)) { showError('Enter a valid integer charge.'); return; }

        const result = findOxidationStates(formula, charge);
        if (result.error) { showError(result.error); return; }

        renderResults(result, formula, charge);
    }

    // ---------- Render results ----------

    function renderResults(result, formula, charge) {
        resultsEl.style.display = '';

        const { states, atoms, rules, isFractional } = result;

        // --- Element tiles ---
        // Sort: known chemistry order (C, H first, then alphabetical)
        const sortedEls = Object.keys(atoms).sort((a, b) => {
            if (a === 'C') return -1; if (b === 'C') return 1;
            if (a === 'H') return -1; if (b === 'H') return 1;
            return a.localeCompare(b);
        });

        tilesEl.innerHTML = '';
        sortedEls.forEach((el, i) => {
            const state = states[el];
            const stateStr = formatStateHTML(state);
            const colorClass = state > 0 ? 'ox-tile--positive'
                             : state < 0 ? 'ox-tile--negative'
                             : 'ox-tile--zero';
            const tile = document.createElement('div');
            tile.className = `ox-tile ${colorClass}`;
            tile.style.animationDelay = `${i * 80}ms`;
            tile.innerHTML = `
                <span class="ox-tile-state">${stateStr}</span>
                <span class="ox-tile-symbol">${el}</span>
                <span class="ox-tile-name">${ELEMENT_NAMES[el] || el}</span>
            `;
            tilesEl.appendChild(tile);
        });

        // --- Compound diagram (formula with oxidation states above) ---
        let diagramHTML = '<div class="ox-diagram-formula">';
        for (const el of sortedEls) {
            const count = atoms[el];
            const state = states[el];
            const stateStr = formatStateHTML(state);
            const colorClass = state > 0 ? 'ox-state--positive'
                             : state < 0 ? 'ox-state--negative'
                             : 'ox-state--zero';
            diagramHTML += `
                <div class="ox-diagram-atom">
                    <span class="ox-diagram-state ${colorClass}">${stateStr}</span>
                    <span class="ox-diagram-el">${el}</span><span class="ox-diagram-count">${count > 1 ? toSubscript(count) : ''}</span>
                </div>
            `;
        }
        diagramHTML += '</div>';
        if (charge !== 0) {
            const chargeLabel = charge > 0
                ? `${Math.abs(charge) > 1 ? Math.abs(charge) : ''}+`
                : `${Math.abs(charge) > 1 ? Math.abs(charge) : ''}−`;
            diagramHTML += `<span class="ox-diagram-charge">${chargeLabel}</span>`;
        }
        diagramEl.innerHTML = diagramHTML;

        // --- Verification table ---
        let verifyParts = [];
        let totalSum = 0;
        for (const el of sortedEls) {
            const count = atoms[el];
            const state = states[el];
            const product = state * count;
            totalSum += product;
            const stateStr = formatState(state);
            verifyParts.push(`${el}(${stateStr}) × ${count} = ${formatNum(product)}`);
        }
        const sumStr = formatNum(totalSum);
        const chargeStr2 = formatCharge(charge);
        const verified = Math.abs(totalSum - charge) < 0.001;
        const verifyIcon = verified ? ' ✓' : ' ✗';
        const verifyClass = verified ? 'ox-verify--pass' : 'ox-verify--fail';

        verifyBody.innerHTML = `
            <div class="ox-verify-equation">
                ${verifyParts.join(' + ')}
            </div>
            <div class="ox-verify-sum ${verifyClass}">
                <span>Sum = ${sumStr} = ${chargeStr2}</span>
                <span class="ox-verify-icon">${verifyIcon}</span>
            </div>
        `;

        // Fractional warning
        if (isFractional) {
            verifyBody.innerHTML += `
                <div class="ox-fractional-note">
                    ⚠ Fractional oxidation state — this indicates mixed oxidation states in the compound
                    (e.g. Fe₃O₄ has Fe²⁺ and Fe³⁺ ions).
                </div>
            `;
        }

        // --- Rules ---
        rulesList.innerHTML = '';
        for (const rule of rules) {
            const li = document.createElement('li');
            li.className = 'ox-rule-item';
            li.textContent = rule;
            rulesList.appendChild(li);
        }

        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ---------- Events ----------

    calcBtn.addEventListener('click', calculate);

    formulaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); calculate(); }
    });
    chargeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); calculate(); }
    });

    // Focus
    requestAnimationFrame(() => formulaInput.focus());
}
