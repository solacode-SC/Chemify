/* ===================================================
   Chemify — Molar Mass Calculator (ES Module)
   Renders inside the tool modal body. Imports parser
   for formula parsing and validation.
   =================================================== */

import { parseFormula, validateFormula } from '../utils/parser.js';

// ---------- Precise IUPAC Atomic Masses ----------
// Self-contained lookup — avoids needing to modify global elements.js
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

// Element names for the breakdown table
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
    No: 'Nobelium', Lr: 'Lawrencium', Rf: 'Rutherfordium', Db: 'Dubnium', Sg: 'Seaborgium',
    Bh: 'Bohrium', Hs: 'Hassium', Mt: 'Meitnerium', Ds: 'Darmstadtium', Rg: 'Roentgenium',
    Cn: 'Copernicium', Nh: 'Nihonium', Fl: 'Flerovium', Mc: 'Moscovium', Lv: 'Livermorium',
    Ts: 'Tennessine', Og: 'Oganesson'
};

// ---------- Helpers ----------

const SUBSCRIPT_MAP = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };

/**
 * Convert digit characters in a string to Unicode subscripts.
 * "H2O" → "H₂O", "Ca(OH)2" → "Ca(OH)₂"
 */
function toSubscript(str) {
    return str.replace(/\d/g, d => SUBSCRIPT_MAP[d] || d);
}

/**
 * Debounce utility.
 */
function debounce(fn, ms) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

// ---------- Main Init ----------

/**
 * Initialize the Molar Mass Calculator inside the given container element.
 * @param {HTMLElement} container - The modal body element
 */
export function initMolarMass(container) {
    let debounceTimer = null;

    // Build HTML
    container.innerHTML = `
    <div class="mm-tool">

      <!-- Input Section -->
      <div class="mm-input-section">
        <label class="mm-label">Chemical Formula</label>
        <div class="mm-input-wrap">
          <input type="text" class="mm-input" id="mmInput"
                 placeholder="e.g. Ca(OH)₂" autocomplete="off" spellcheck="false" />
          <div class="mm-input-status" id="mmStatus"></div>
        </div>
        <div class="mm-quick-chips">
          <span class="mm-chip" data-formula="H2O">H₂O</span>
          <span class="mm-chip" data-formula="NaCl">NaCl</span>
          <span class="mm-chip" data-formula="C6H12O6">C₆H₁₂O₆</span>
          <span class="mm-chip" data-formula="Ca(OH)2">Ca(OH)₂</span>
          <span class="mm-chip" data-formula="Fe2(SO4)3">Fe₂(SO₄)₃</span>
          <span class="mm-chip" data-formula="CuSO4·5H2O">CuSO₄·5H₂O</span>
        </div>
        <button class="mm-calculate-btn" id="mmCalcBtn">Calculate Molar Mass</button>
      </div>

      <!-- Results Section -->
      <div class="mm-results" id="mmResults" style="display:none">

        <div class="mm-result-hero">
          <span class="mm-result-formula" id="mmResultFormula"></span>
          <div class="mm-result-mass">
            <span class="mm-result-value" id="mmResultValue"></span>
            <span class="mm-result-unit">g/mol</span>
          </div>
        </div>

        <div class="mm-breakdown">
          <h4 class="mm-breakdown-title">Element Breakdown</h4>
          <div class="mm-breakdown-header">
            <span>Element</span><span>Atoms</span>
            <span>Atomic Mass</span><span>Contribution</span><span>%</span>
          </div>
          <div class="mm-breakdown-rows" id="mmBreakdownRows"></div>
        </div>

      </div>
    </div>
  `;

    // Grab elements
    const input = container.querySelector('#mmInput');
    const status = container.querySelector('#mmStatus');
    const calcBtn = container.querySelector('#mmCalcBtn');
    const results = container.querySelector('#mmResults');
    const resultFormula = container.querySelector('#mmResultFormula');
    const resultValue = container.querySelector('#mmResultValue');
    const breakdownRows = container.querySelector('#mmBreakdownRows');

    // ---------- Validation ----------

    function updateStatus(formulaStr) {
        if (!formulaStr || formulaStr.trim().length === 0) {
            status.textContent = '';
            status.className = 'mm-input-status';
            return;
        }
        const result = validateFormula(formulaStr);
        if (result.valid) {
            status.textContent = '✓';
            status.className = 'mm-input-status mm-input-status--valid';
        } else {
            status.textContent = '×';
            status.className = 'mm-input-status mm-input-status--invalid';
            status.title = result.error;
        }
    }

    // Live validation debounced 300ms
    const debouncedValidate = debounce((val) => updateStatus(val), 300);

    input.addEventListener('input', () => {
        debouncedValidate(input.value);
    });

    // ---------- Calculate ----------

    function calculate(formulaStr) {
        if (!formulaStr || formulaStr.trim().length === 0) {
            status.textContent = '×';
            status.className = 'mm-input-status mm-input-status--invalid';
            status.title = 'Empty formula';
            return;
        }

        const validation = validateFormula(formulaStr);
        if (!validation.valid) {
            status.textContent = '×';
            status.className = 'mm-input-status mm-input-status--invalid';
            status.title = validation.error;
            return;
        }

        status.textContent = '✓';
        status.className = 'mm-input-status mm-input-status--valid';
        status.title = '';

        const atoms = parseFormula(formulaStr);
        if (!atoms) return;

        // Calculate breakdown
        const breakdown = [];
        let totalMass = 0;

        for (const [symbol, count] of Object.entries(atoms)) {
            const atomicMass = ATOMIC_MASS[symbol];
            if (atomicMass === undefined) continue;
            const contribution = count * atomicMass;
            totalMass += contribution;
            breakdown.push({ symbol, name: ELEMENT_NAMES[symbol] || symbol, count, atomicMass, contribution });
        }

        // Calculate percentages
        for (const row of breakdown) {
            row.percentage = totalMass > 0 ? (row.contribution / totalMass) * 100 : 0;
        }

        renderResults(formulaStr, totalMass, breakdown);
    }

    function renderResults(formula, totalMass, breakdown) {
        results.style.display = '';

        // Set formula display with subscripts
        resultFormula.textContent = toSubscript(formula);

        // Set mass value to 4 decimal places
        resultValue.textContent = totalMass.toFixed(4);

        // Build breakdown rows
        breakdownRows.innerHTML = '';

        breakdown.forEach((row, index) => {
            const rowEl = document.createElement('div');
            rowEl.className = 'mm-breakdown-row';
            rowEl.style.animationDelay = `${index * 60}ms`;

            rowEl.innerHTML = `
        <span class="mm-breakdown-cell mm-breakdown-cell--element">
          <strong>${row.symbol}</strong>
          <small>${row.name}</small>
        </span>
        <span class="mm-breakdown-cell">${row.count}</span>
        <span class="mm-breakdown-cell">${row.atomicMass.toFixed(3)}</span>
        <span class="mm-breakdown-cell">${row.contribution.toFixed(4)}</span>
        <span class="mm-breakdown-cell mm-breakdown-cell--percent">
          <div class="mm-bar">
            <div class="mm-bar-fill" style="width: 0%"></div>
          </div>
          <span class="mm-percent-text">${row.percentage.toFixed(1)}%</span>
        </span>
      `;

            breakdownRows.appendChild(rowEl);

            // Animate bar fill after a brief delay
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const fill = rowEl.querySelector('.mm-bar-fill');
                    if (fill) fill.style.width = `${row.percentage}%`;
                });
            });
        });

        // Scroll results into view within the modal
        results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ---------- Event Listeners ----------

    // Enter key triggers calculate
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculate(input.value);
        }
    });

    // Calculate button
    calcBtn.addEventListener('click', () => {
        calculate(input.value);
    });

    // Quick chips
    container.querySelectorAll('.mm-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const formula = chip.dataset.formula;
            input.value = formula;
            updateStatus(formula);
            calculate(formula);
        });
    });

    // Focus input on load
    requestAnimationFrame(() => input.focus());
}
