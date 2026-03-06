/* ===================================================
   Chemify — Percent Composition Calculator (ES Module)
   Two modes:
     1. By Formula — enter compound formula, get element
        mass percentages with a visual composition bar.
     2. By Mass — enter element masses, compute percentages.
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

// Element names
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

// Valid element symbols set
const VALID_ELEMENTS = new Set(Object.keys(ATOMIC_MASS));

// Composition bar color palette — muted, distinguishable tones
const BAR_COLORS = ['#2c3e50', '#7f8c8d', '#95a5a6', '#bdc3c7', '#d5dbdb', '#85929e'];

// ---------- Helpers ----------

const SUBSCRIPT_MAP = {
    '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
    '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
};

const UNICODE_SUB_TO_ASCII = {
    '\u2080': '0', '\u2081': '1', '\u2082': '2', '\u2083': '3', '\u2084': '4',
    '\u2085': '5', '\u2086': '6', '\u2087': '7', '\u2088': '8', '\u2089': '9'
};

function toSubscript(str) {
    return str.replace(/\d/g, d => SUBSCRIPT_MAP[d] || d);
}

function normaliseFormula(str) {
    return str.replace(/[\u2080-\u2089]/g, ch => UNICODE_SUB_TO_ASCII[ch] || ch);
}

// ---------- Main Init ----------

/**
 * Initialize the Percent Composition Calculator inside the given container.
 * @param {HTMLElement} container - The modal body element
 */
export function initPercentComposition(container) {
    let currentMode = 'formula'; // 'formula' | 'mass'
    let massRowCounter = 0;

    container.innerHTML = `
    <div class="pc-tool">

      <!-- Mode toggle -->
      <div class="tool-seg-control">
        <button class="tool-seg-btn active" data-mode="formula">By Formula</button>
        <button class="tool-seg-btn" data-mode="mass">By Mass</button>
      </div>

      <!-- Mode: By Formula -->
      <div class="pc-mode pc-mode-formula" id="pcFormulaMode">
        <label class="mm-label">Chemical Formula</label>
        <input type="text" class="mm-input" id="pcFormulaInput"
               placeholder="e.g. H2O, NaCl, C6H12O6" autocomplete="off" spellcheck="false" />
        <div class="pc-quick-chips">
          <span class="mm-chip" data-formula="H2O">H\u2082O</span>
          <span class="mm-chip" data-formula="CO2">CO\u2082</span>
          <span class="mm-chip" data-formula="NaCl">NaCl</span>
          <span class="mm-chip" data-formula="C6H12O6">C\u2086H\u2081\u2082O\u2086</span>
          <span class="mm-chip" data-formula="H2SO4">H\u2082SO\u2084</span>
        </div>
        <button class="mm-calculate-btn" id="pcFormulaCalcBtn">Calculate Composition</button>
      </div>

      <!-- Mode: By Mass -->
      <div class="pc-mode pc-mode-mass" id="pcMassMode" style="display:none">
        <label class="mm-label">Element Masses</label>
        <div class="pc-mass-rows" id="pcMassRows"></div>
        <button class="pc-add-row-btn" id="pcAddRowBtn">+ Add Element</button>
        <button class="mm-calculate-btn" id="pcMassCalcBtn">Calculate Composition</button>
      </div>

      <!-- Error -->
      <div class="pc-error" id="pcError"></div>

      <!-- Results -->
      <div class="pc-results" id="pcResults" style="display:none">
        <h4 class="mm-breakdown-title">Composition</h4>

        <!-- Visual composition bar -->
        <div class="pc-bar-wrap" id="pcBarWrap"></div>

        <!-- Legend below bar -->
        <div class="pc-bar-legend" id="pcBarLegend"></div>

        <!-- Breakdown table -->
        <div class="pc-table-wrap">
          <div class="pc-table-header">
            <span>Element</span>
            <span>Atoms</span>
            <span>Atomic Mass</span>
            <span>Mass (g/mol)</span>
            <span>Percentage</span>
          </div>
          <div class="pc-table-body" id="pcTableBody"></div>
        </div>
      </div>

    </div>
  `;

    // Grab elements
    const formulaMode = container.querySelector('#pcFormulaMode');
    const massMode = container.querySelector('#pcMassMode');
    const formulaInput = container.querySelector('#pcFormulaInput');
    const formulaCalcBtn = container.querySelector('#pcFormulaCalcBtn');
    const massRows = container.querySelector('#pcMassRows');
    const addRowBtn = container.querySelector('#pcAddRowBtn');
    const massCalcBtn = container.querySelector('#pcMassCalcBtn');
    const errorEl = container.querySelector('#pcError');
    const resultsEl = container.querySelector('#pcResults');
    const barWrap = container.querySelector('#pcBarWrap');
    const barLegend = container.querySelector('#pcBarLegend');
    const tableBody = container.querySelector('#pcTableBody');

    // ---------- Mode toggle ----------

    container.querySelectorAll('.tool-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tool-seg-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;

            if (currentMode === 'formula') {
                formulaMode.style.display = '';
                massMode.style.display = 'none';
            } else {
                formulaMode.style.display = 'none';
                massMode.style.display = '';
                // Add initial rows if empty
                if (massRows.children.length === 0) {
                    addMassRow();
                    addMassRow();
                }
            }
            hideError();
            resultsEl.style.display = 'none';
        });
    });

    // ---------- Error display ----------

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }

    function hideError() {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }

    // ---------- Mode 1: By Formula ----------

    function calcByFormula() {
        hideError();

        const raw = formulaInput.value.trim();
        if (!raw) {
            showError('Enter a chemical formula.');
            return;
        }

        const normalised = normaliseFormula(raw);
        const atoms = parseFormula(normalised);
        if (!atoms) {
            showError('Invalid chemical formula.');
            return;
        }

        // Build breakdown
        const breakdown = [];
        let totalMass = 0;

        for (const [symbol, count] of Object.entries(atoms)) {
            const am = ATOMIC_MASS[symbol];
            if (am === undefined) {
                showError(`Unknown element: ${symbol}`);
                return;
            }
            const mass = count * am;
            totalMass += mass;
            breakdown.push({
                symbol,
                name: ELEMENT_NAMES[symbol] || symbol,
                count,
                atomicMass: am,
                mass
            });
        }

        // Compute percentages
        for (const row of breakdown) {
            row.percentage = totalMass > 0 ? (row.mass / totalMass) * 100 : 0;
        }

        renderResults(breakdown, true);
    }

    // ---------- Mode 2: By Mass ----------

    function addMassRow() {
        massRowCounter++;
        const row = document.createElement('div');
        row.className = 'pc-mass-row';
        row.dataset.rowId = massRowCounter;
        row.innerHTML = `
            <input type="text" class="mm-input pc-mass-el-input" placeholder="e.g. C"
                   autocomplete="off" spellcheck="false" />
            <input type="number" class="mm-input pc-mass-val-input" placeholder="Mass (g)"
                   step="any" min="0" />
            <button class="pc-mass-remove-btn" title="Remove">\u00d7</button>
        `;
        massRows.appendChild(row);

        row.querySelector('.pc-mass-remove-btn').addEventListener('click', () => {
            row.remove();
        });
    }

    function calcByMass() {
        hideError();

        const rows = massRows.querySelectorAll('.pc-mass-row');
        if (rows.length === 0) {
            showError('Add at least one element.');
            return;
        }

        const breakdown = [];
        let totalMass = 0;

        for (const row of rows) {
            const symbolInput = row.querySelector('.pc-mass-el-input');
            const massInput = row.querySelector('.pc-mass-val-input');

            const symbol = symbolInput.value.trim();
            const massStr = massInput.value.trim();

            if (!symbol && !massStr) continue; // Skip empty rows

            if (!symbol) {
                showError('Enter an element symbol for each row.');
                return;
            }

            // Capitalise: first letter upper, rest lower
            const normSymbol = symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase();

            if (!VALID_ELEMENTS.has(normSymbol)) {
                showError(`Unknown element: "${symbol}"`);
                return;
            }

            if (!massStr || isNaN(massStr) || Number(massStr) <= 0) {
                showError(`Enter a positive mass for ${normSymbol}.`);
                return;
            }

            const mass = parseFloat(massStr);
            totalMass += mass;
            breakdown.push({
                symbol: normSymbol,
                name: ELEMENT_NAMES[normSymbol] || normSymbol,
                count: null, // not applicable in mass mode
                atomicMass: ATOMIC_MASS[normSymbol],
                mass
            });
        }

        if (breakdown.length === 0) {
            showError('Add at least one element with a mass.');
            return;
        }

        // Compute percentages
        for (const row of breakdown) {
            row.percentage = totalMass > 0 ? (row.mass / totalMass) * 100 : 0;
        }

        renderResults(breakdown, false);
    }

    // ---------- Render results ----------

    function renderResults(breakdown, showAtoms) {
        resultsEl.style.display = '';

        // --- Composition bar ---
        barWrap.innerHTML = '';
        const bar = document.createElement('div');
        bar.className = 'pc-composition-bar';

        breakdown.forEach((row, i) => {
            const seg = document.createElement('div');
            seg.className = 'pc-bar-segment';
            seg.style.width = `${row.percentage}%`;
            seg.style.backgroundColor = BAR_COLORS[i % BAR_COLORS.length];
            // Label inside segment if wide enough
            if (row.percentage >= 8) {
                seg.innerHTML = `<span class="pc-bar-seg-label">${row.symbol} ${row.percentage.toFixed(1)}%</span>`;
            }
            bar.appendChild(seg);
        });
        barWrap.appendChild(bar);

        // --- Legend ---
        barLegend.innerHTML = '';
        breakdown.forEach((row, i) => {
            const item = document.createElement('span');
            item.className = 'pc-legend-item';
            item.innerHTML = `
                <span class="pc-legend-swatch" style="background:${BAR_COLORS[i % BAR_COLORS.length]}"></span>
                ${row.symbol}: ${row.percentage.toFixed(2)}%
            `;
            barLegend.appendChild(item);
        });

        // --- Table ---
        tableBody.innerHTML = '';

        // Update header for atoms column
        const header = container.querySelector('.pc-table-header');
        if (showAtoms) {
            header.className = 'pc-table-header';
            header.innerHTML = '<span>Element</span><span>Atoms</span><span>Atomic Mass</span><span>Mass (g/mol)</span><span>Percentage</span>';
        } else {
            header.className = 'pc-table-header pc-table-header--mass';
            header.innerHTML = '<span>Element</span><span>Atomic Mass</span><span>Mass (g)</span><span>Percentage</span>';
        }

        breakdown.forEach((row, i) => {
            const tr = document.createElement('div');
            tr.className = showAtoms ? 'pc-table-row' : 'pc-table-row pc-table-row--mass';
            tr.style.animationDelay = `${i * 50}ms`;

            if (showAtoms) {
                tr.innerHTML = `
                    <span class="pc-table-cell pc-table-cell--element">
                        <strong>${row.symbol}</strong>
                        <small>${row.name}</small>
                    </span>
                    <span class="pc-table-cell">${row.count}</span>
                    <span class="pc-table-cell">${row.atomicMass.toFixed(3)}</span>
                    <span class="pc-table-cell">${row.mass.toFixed(3)}</span>
                    <span class="pc-table-cell pc-table-cell--percent">
                        <div class="mm-bar"><div class="mm-bar-fill" style="width:0%"></div></div>
                        <span class="mm-percent-text">${row.percentage.toFixed(2)}%</span>
                    </span>
                `;
            } else {
                tr.innerHTML = `
                    <span class="pc-table-cell pc-table-cell--element">
                        <strong>${row.symbol}</strong>
                        <small>${row.name}</small>
                    </span>
                    <span class="pc-table-cell">${row.atomicMass.toFixed(3)}</span>
                    <span class="pc-table-cell">${row.mass.toFixed(3)}</span>
                    <span class="pc-table-cell pc-table-cell--percent">
                        <div class="mm-bar"><div class="mm-bar-fill" style="width:0%"></div></div>
                        <span class="mm-percent-text">${row.percentage.toFixed(2)}%</span>
                    </span>
                `;
            }

            tableBody.appendChild(tr);

            // Animate bar fill
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const fill = tr.querySelector('.mm-bar-fill');
                    if (fill) fill.style.width = `${row.percentage}%`;
                });
            });
        });

        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ---------- Event Listeners ----------

    // Formula mode
    formulaCalcBtn.addEventListener('click', calcByFormula);
    formulaInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calcByFormula();
        }
    });

    // Quick chips
    container.querySelectorAll('.mm-chip[data-formula]').forEach(chip => {
        chip.addEventListener('click', () => {
            formulaInput.value = chip.dataset.formula;
            calcByFormula();
        });
    });

    // Mass mode
    addRowBtn.addEventListener('click', addMassRow);
    massCalcBtn.addEventListener('click', calcByMass);

    // Focus input
    requestAnimationFrame(() => formulaInput.focus());
}
