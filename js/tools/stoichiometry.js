/* ===================================================
   Chemify — Stoichiometry Calculator (ES Module)
   Renders inside the tool modal body. User enters a
   balanced equation, selects a known compound + amount,
   tool calculates amounts of all other compounds via
   molar ratios.
   =================================================== */

import { parseFormula } from '../utils/parser.js';

// ---------- Precise IUPAC Atomic Masses ----------
const ATOMIC_MASS = {
    H: 1.008, He: 4.0026,
    Li: 6.941, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
    F: 18.998, Ne: 20.180,
    Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.06,
    Cl: 35.45, Ar: 39.948,
    K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
    Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
    Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
    Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95,
    Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41,
    In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29,
    Cs: 132.91, Ba: 137.33,
    La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24, Pm: 145, Sm: 150.36,
    Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50, Ho: 164.93, Er: 167.26,
    Tm: 168.93, Yb: 173.05, Lu: 174.97,
    Hf: 178.49, Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22,
    Pt: 195.08, Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98,
    Po: 209, At: 210, Rn: 222,
    Fr: 223, Ra: 226,
    Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03, Np: 237, Pu: 244,
    Am: 243, Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257,
    Md: 258, No: 259, Lr: 266,
    Rf: 267, Db: 268, Sg: 269, Bh: 270, Hs: 277, Mt: 278,
    Ds: 281, Rg: 282, Cn: 285, Nh: 286, Fl: 289, Mc: 290,
    Lv: 293, Ts: 294, Og: 294
};

// ---------- Helpers ----------

const SUBSCRIPT_MAP = {
    '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
    '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
};

const UNICODE_SUB_TO_ASCII = {
    '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3', '\u2084': '4',
    '\u2085': '5', '\u2086': '6', '\u2087': '7', '\u2088': '8', '\u2089': '9'
};

/** Convert digit characters to Unicode subscripts. */
function toSubscript(str) {
    return str.replace(/\d/g, d => SUBSCRIPT_MAP[d] || d);
}

/** Normalise formula: convert Unicode subscripts back to ASCII digits. */
function normaliseFormula(str) {
    return str.replace(/[\u2080-\u2089]/g, ch => UNICODE_SUB_TO_ASCII[ch] || ch);
}

/** Compute molar mass from a parsed atom-count object. */
function computeMolarMass(atoms) {
    let mass = 0;
    for (const [el, count] of Object.entries(atoms)) {
        const am = ATOMIC_MASS[el];
        if (am === undefined) return null;
        mass += count * am;
    }
    return mass;
}

// ---------- Equation Parsing ----------

/**
 * Parse a balanced equation string into an array of compound objects.
 * Returns { compounds, error }.
 */
function parseEquation(eqStr) {
    if (!eqStr || !eqStr.trim()) {
        return { compounds: null, error: 'Please enter a chemical equation.' };
    }

    // Normalise Unicode subscripts and arrows
    let eq = normaliseFormula(eqStr.trim());
    eq = eq.replace(/\u2192/g, '->'); // →
    eq = eq.replace(/<=/g, '->');
    eq = eq.replace(/={1,2}/g, '->');

    const sides = eq.split('->');
    if (sides.length !== 2) {
        return { compounds: null, error: 'Use \u2192 or -> to separate reactants and products.' };
    }

    const [reactantStr, productStr] = sides;
    if (!reactantStr.trim() || !productStr.trim()) {
        return { compounds: null, error: 'Both sides of the equation must have compounds.' };
    }

    const compounds = [];

    function parseSide(sideStr, side) {
        const terms = sideStr.split('+').map(t => t.trim()).filter(Boolean);
        for (const term of terms) {
            // Extract leading coefficient
            const match = term.match(/^(\d+)?\s*(.+)$/);
            if (!match) {
                return `Could not parse term: "${term}"`;
            }
            const coefficient = match[1] ? parseInt(match[1], 10) : 1;
            const formula = match[2].trim();

            const atoms = parseFormula(formula);
            if (!atoms) {
                return `Invalid formula: "${formula}"`;
            }

            const molarMass = computeMolarMass(atoms);
            if (molarMass === null) {
                return `Unknown element in: "${formula}"`;
            }

            compounds.push({ formula, coefficient, molarMass, atoms, side });
        }
        return null;
    }

    const reactantErr = parseSide(reactantStr, 'reactant');
    if (reactantErr) return { compounds: null, error: reactantErr };

    const productErr = parseSide(productStr, 'product');
    if (productErr) return { compounds: null, error: productErr };

    if (compounds.length < 2) {
        return { compounds: null, error: 'Equation must have at least two compounds.' };
    }

    return { compounds, error: null };
}

// ---------- Main Init ----------

/**
 * Initialize the Stoichiometry Calculator inside the given container.
 * @param {HTMLElement} container - The modal body element
 */
export function initStoichiometry(container) {
    // Build HTML
    container.innerHTML = `
    <div class="sto-tool">

      <label class="mm-label">Balanced Chemical Equation</label>
      <input type="text" class="mm-input" id="stoEqInput"
             placeholder="e.g. 2H2 + O2 \u2192 2H2O" autocomplete="off" spellcheck="false" />

      <div class="sto-quick-chips">
        <span class="mm-chip" data-eq="2H2 + O2 -> 2H2O">2H\u2082 + O\u2082 \u2192 2H\u2082O</span>
        <span class="mm-chip" data-eq="CH4 + 2O2 -> CO2 + 2H2O">CH\u2084 combustion</span>
        <span class="mm-chip" data-eq="2Al + 6HCl -> 2AlCl3 + 3H2">Al + HCl</span>
      </div>

      <button class="mm-calculate-btn" id="stoParseBtn">Load Equation</button>

      <!-- Error -->
      <div class="sto-error" id="stoError"></div>

      <!-- Appears after parsing -->
      <div class="sto-setup" id="stoSetup" style="display:none">
        <div class="sto-compounds" id="stoCompounds"></div>

        <label class="mm-label" style="margin-top:1.5rem">
          Known substance &amp; amount
        </label>
        <div class="sto-known-row">
          <select class="sto-select" id="stoKnownCompound"></select>
          <input type="number" class="mm-input sto-amount-input" id="stoKnownAmount"
                 placeholder="Amount" step="any" min="0" />
          <select class="sto-select sto-unit-select" id="stoKnownUnit">
            <option value="mol">mol</option>
            <option value="g">g</option>
            <option value="mmol">mmol</option>
          </select>
        </div>
        <button class="mm-calculate-btn" id="stoCalcBtn">Calculate All Amounts</button>
      </div>

      <!-- Results -->
      <div class="sto-results" id="stoResults" style="display:none">
        <h4 class="mm-breakdown-title">Stoichiometric Amounts</h4>
        <div class="sto-results-grid" id="stoResultsGrid"></div>
      </div>

    </div>
  `;

    // Grab elements
    const eqInput = container.querySelector('#stoEqInput');
    const parseBtn = container.querySelector('#stoParseBtn');
    const errorEl = container.querySelector('#stoError');
    const setupEl = container.querySelector('#stoSetup');
    const compoundsEl = container.querySelector('#stoCompounds');
    const knownSelect = container.querySelector('#stoKnownCompound');
    const amountInput = container.querySelector('#stoKnownAmount');
    const unitSelect = container.querySelector('#stoKnownUnit');
    const calcBtn = container.querySelector('#stoCalcBtn');
    const resultsEl = container.querySelector('#stoResults');
    const resultsGrid = container.querySelector('#stoResultsGrid');

    let parsedCompounds = null;

    // ---------- Error display ----------

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }

    function hideError() {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }

    // ---------- Load Equation ----------

    function loadEquation() {
        hideError();
        resultsEl.style.display = 'none';

        const { compounds, error } = parseEquation(eqInput.value);
        if (error) {
            showError(error);
            setupEl.style.display = 'none';
            parsedCompounds = null;
            return;
        }

        parsedCompounds = compounds;
        renderCompoundSummary();
        populateKnownSelect();
        setupEl.style.display = '';
    }

    // ---------- Compound summary cards ----------

    function renderCompoundSummary() {
        compoundsEl.innerHTML = '';
        parsedCompounds.forEach((c, i) => {
            const card = document.createElement('div');
            card.className = 'sto-compound-card';
            card.style.animationDelay = `${i * 60}ms`;
            const sideBadgeClass = c.side === 'reactant'
                ? 'sto-side-badge--reactant' : 'sto-side-badge--product';
            card.innerHTML = `
                <div class="sto-compound-header">
                    <span class="sto-compound-formula">${c.coefficient > 1 ? c.coefficient : ''}${toSubscript(c.formula)}</span>
                    <span class="sto-side-badge ${sideBadgeClass}">${c.side === 'reactant' ? 'Reactant' : 'Product'}</span>
                </div>
                <span class="sto-compound-mass">${c.molarMass.toFixed(3)} g/mol</span>
            `;
            compoundsEl.appendChild(card);
        });
    }

    // ---------- Populate known selector ----------

    function populateKnownSelect() {
        knownSelect.innerHTML = '';
        parsedCompounds.forEach((c, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.textContent = `${c.coefficient > 1 ? c.coefficient : ''}${toSubscript(c.formula)} (${c.side})`;
            knownSelect.appendChild(opt);
        });
        amountInput.value = '';
    }

    // ---------- Calculate ----------

    function calculate() {
        hideError();

        if (!parsedCompounds) {
            showError('Load an equation first.');
            return;
        }

        const amountStr = amountInput.value.trim();
        if (!amountStr || isNaN(amountStr) || Number(amountStr) <= 0) {
            showError('Enter a positive amount for the known substance.');
            return;
        }

        const amount = parseFloat(amountStr);
        const unit = unitSelect.value;
        const knownIdx = parseInt(knownSelect.value, 10);
        const knownCompound = parsedCompounds[knownIdx];

        // Convert known amount to moles
        let knownMoles;
        if (unit === 'g') {
            knownMoles = amount / knownCompound.molarMass;
        } else if (unit === 'mmol') {
            knownMoles = amount / 1000;
        } else {
            knownMoles = amount;
        }

        // Build results for each compound
        const results = parsedCompounds.map(c => {
            const moles = knownMoles * (c.coefficient / knownCompound.coefficient);
            const grams = moles * c.molarMass;
            const mmol = moles * 1000;
            return { ...c, moles, grams, mmol };
        });

        renderResults(results, knownIdx);
    }

    // ---------- Render results ----------

    function renderResults(results, knownIdx) {
        resultsGrid.innerHTML = '';
        resultsEl.style.display = '';

        results.forEach((r, i) => {
            const card = document.createElement('div');
            const isProduct = r.side === 'product';
            card.className = `sto-result-card ${isProduct ? 'sto-result-card--product' : 'sto-result-card--reactant'}`;
            card.style.animationDelay = `${i * 80}ms`;

            const isKnown = i === knownIdx;
            const knownTag = isKnown ? '<span class="sto-known-tag">Known</span>' : '';

            card.innerHTML = `
                <div class="sto-result-card-header">
                    <span class="sto-result-formula">${r.coefficient > 1 ? `<span class="sto-result-coeff">${r.coefficient}</span>` : ''}${toSubscript(r.formula)}</span>
                    <span class="sto-side-badge ${isProduct ? 'sto-side-badge--product' : 'sto-side-badge--reactant'}">${isProduct ? 'Product' : 'Reactant'}</span>
                    ${knownTag}
                </div>
                <div class="sto-result-values">
                    <div class="sto-result-value-row">
                        <span class="sto-result-label">Moles</span>
                        <span class="sto-result-val">${formatValue(r.moles)} mol</span>
                    </div>
                    <div class="sto-result-value-row">
                        <span class="sto-result-label">Mass</span>
                        <span class="sto-result-val">${formatValue(r.grams)} g</span>
                    </div>
                    <div class="sto-result-value-row">
                        <span class="sto-result-label">Millimoles</span>
                        <span class="sto-result-val">${formatValue(r.mmol)} mmol</span>
                    </div>
                </div>
            `;

            resultsGrid.appendChild(card);
        });

        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /** Format a numeric value: use 3 decimals, strip trailing zeros. */
    function formatValue(n) {
        if (n === 0) return '0';
        // Use enough precision to match expected test output (3 decimal places)
        const s = n.toFixed(3);
        // Strip trailing zeros after decimal, but keep at least one if there's a dot
        return s.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
    }

    // ---------- Event Listeners ----------

    parseBtn.addEventListener('click', loadEquation);

    eqInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loadEquation();
        }
    });

    calcBtn.addEventListener('click', calculate);

    amountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculate();
        }
    });

    // Quick chips
    container.querySelectorAll('.mm-chip[data-eq]').forEach(chip => {
        chip.addEventListener('click', () => {
            eqInput.value = chip.dataset.eq;
            loadEquation();
        });
    });

    // Focus input on load
    requestAnimationFrame(() => eqInput.focus());
}
