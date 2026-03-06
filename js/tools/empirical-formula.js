/* ===================================================
   Chemify — Empirical Formula Finder (ES Module)
   Two modes:
     1. From percent composition
     2. From mass data
   Shows step-by-step work and optional molecular formula.
   =================================================== */

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

const VALID_ELEMENTS = new Set(Object.keys(ATOMIC_MASS));

// Subscript helper
const SUBSCRIPT_MAP = {
    '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
    '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
};

function toSubscript(str) {
    return str.replace(/\d/g, d => SUBSCRIPT_MAP[d] || d);
}

// ---------- Core Algorithm ----------

/**
 * Find the empirical formula from element symbols and their masses (grams).
 * Returns { formula, steps, empiricalMass } or { error }.
 */
function findEmpiricalFormula(symbols, masses) {
    const steps = [];
    const n = symbols.length;

    // Step 1: masses (already in grams)
    const massesDisplay = symbols.map((s, i) => `${s}: ${masses[i].toFixed(3)} g`);
    steps.push({ title: 'Masses', detail: massesDisplay.join(', ') });

    // Step 2: convert to moles
    const moles = [];
    const molesDisplay = [];
    for (let i = 0; i < n; i++) {
        const am = ATOMIC_MASS[symbols[i]];
        const mol = masses[i] / am;
        moles.push(mol);
        molesDisplay.push(`${symbols[i]}: ${masses[i].toFixed(3)} \u00f7 ${am.toFixed(3)} = ${mol.toFixed(4)} mol`);
    }
    steps.push({ title: 'Convert to moles', detail: molesDisplay.join('\n') });

    // Step 3: divide by smallest
    const minMol = Math.min(...moles);
    if (minMol === 0) return { error: 'All masses must be positive.' };

    const rawRatios = moles.map(m => m / minMol);
    const ratioDisplay = symbols.map((s, i) => `${s}: ${moles[i].toFixed(4)} \u00f7 ${minMol.toFixed(4)} = ${rawRatios[i].toFixed(3)}`);
    steps.push({ title: 'Divide by smallest mole value', detail: ratioDisplay.join('\n') });

    // Step 4: scale to integers
    // Try multipliers 1..12 to find one that makes all ratios close to integers
    let bestMultiplier = 1;
    for (let mult = 1; mult <= 12; mult++) {
        const scaled = rawRatios.map(r => r * mult);
        const allInt = scaled.every(v => Math.abs(v - Math.round(v)) < 0.08);
        if (allInt) {
            bestMultiplier = mult;
            break;
        }
    }

    const finalRatios = rawRatios.map(r => Math.round(r * bestMultiplier));

    let scaleDetail;
    if (bestMultiplier === 1) {
        scaleDetail = 'Ratios are already close to whole numbers.';
    } else {
        scaleDetail = `Multiplied all ratios by ${bestMultiplier} to get whole numbers.`;
    }
    const intDisplay = symbols.map((s, i) => `${s}: ${(rawRatios[i] * bestMultiplier).toFixed(3)} \u2192 ${finalRatios[i]}`);
    steps.push({ title: 'Scale to integers', detail: `${scaleDetail}\n${intDisplay.join('\n')}` });

    // Build formula string (order: C first, then H, then alphabetical)
    const pairs = symbols.map((s, i) => ({ symbol: s, count: finalRatios[i] }));
    pairs.sort((a, b) => {
        // C first, H second, then alphabetical
        if (a.symbol === 'C') return -1;
        if (b.symbol === 'C') return 1;
        if (a.symbol === 'H') return -1;
        if (b.symbol === 'H') return 1;
        return a.symbol.localeCompare(b.symbol);
    });

    let formula = '';
    let empiricalMass = 0;
    for (const p of pairs) {
        formula += p.symbol + (p.count > 1 ? String(p.count) : '');
        empiricalMass += p.count * ATOMIC_MASS[p.symbol];
    }

    steps.push({ title: 'Empirical formula', detail: `${toSubscript(formula)}  (${empiricalMass.toFixed(3)} g/mol)` });

    return { formula, empiricalMass, steps, pairs };
}

// ---------- Main Init ----------

export function initEmpiricalFormula(container) {
    let currentMode = 'percent';
    let rowCounter = 0;

    container.innerHTML = `
    <div class="ef-tool">

      <!-- Mode toggle -->
      <div class="tool-seg-control">
        <button class="tool-seg-btn active" data-mode="percent">From % Composition</button>
        <button class="tool-seg-btn" data-mode="mass">From Mass Data</button>
      </div>

      <!-- Mode: Percent -->
      <div class="ef-mode" id="efPercentMode">
        <label class="mm-label">Element Percentages (must sum to ~100%)</label>
        <div class="ef-rows" id="efPercentRows"></div>
        <button class="pc-add-row-btn" id="efPercentAddBtn">+ Add Element</button>
        <button class="mm-calculate-btn" id="efPercentCalcBtn">Find Empirical Formula</button>
      </div>

      <!-- Mode: Mass -->
      <div class="ef-mode" id="efMassMode" style="display:none">
        <label class="mm-label">Element Masses</label>
        <div class="ef-rows" id="efMassRows"></div>
        <button class="pc-add-row-btn" id="efMassAddBtn">+ Add Element</button>
        <button class="mm-calculate-btn" id="efMassCalcBtn">Find Empirical Formula</button>
      </div>

      <!-- Molecular formula optional input -->
      <div class="ef-mm-section">
        <label class="mm-label">Molar mass of compound (optional, for molecular formula)</label>
        <input type="number" class="mm-input" id="efMolarMassInput"
               placeholder="e.g. 180 g/mol" step="any" min="0" />
      </div>

      <!-- Error -->
      <div class="ef-error" id="efError"></div>

      <!-- Results -->
      <div class="ef-results" id="efResults" style="display:none">

        <!-- Formula hero -->
        <div class="ef-formula-hero" id="efFormulaHero"></div>

        <!-- Show work steps -->
        <div class="ef-steps" id="efSteps">
          <h4 class="mm-breakdown-title">Step-by-step work</h4>
          <div class="ef-steps-list" id="efStepsList"></div>
        </div>

        <!-- Molecular formula (if applicable) -->
        <div class="ef-molecular" id="efMolecular" style="display:none"></div>
      </div>

    </div>
  `;

    // Grab elements
    const percentMode = container.querySelector('#efPercentMode');
    const massMode = container.querySelector('#efMassMode');
    const percentRows = container.querySelector('#efPercentRows');
    const massRows = container.querySelector('#efMassRows');
    const percentAddBtn = container.querySelector('#efPercentAddBtn');
    const massAddBtn = container.querySelector('#efMassAddBtn');
    const percentCalcBtn = container.querySelector('#efPercentCalcBtn');
    const massCalcBtn = container.querySelector('#efMassCalcBtn');
    const molarMassInput = container.querySelector('#efMolarMassInput');
    const errorEl = container.querySelector('#efError');
    const resultsEl = container.querySelector('#efResults');
    const formulaHero = container.querySelector('#efFormulaHero');
    const stepsList = container.querySelector('#efStepsList');
    const molecularEl = container.querySelector('#efMolecular');

    // ---------- Mode toggle ----------

    container.querySelectorAll('.tool-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tool-seg-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            if (currentMode === 'percent') {
                percentMode.style.display = '';
                massMode.style.display = 'none';
            } else {
                percentMode.style.display = 'none';
                massMode.style.display = '';
                if (massRows.children.length === 0) { addRow(massRows); addRow(massRows); }
            }
            hideError();
            resultsEl.style.display = 'none';
        });
    });

    // ---------- Error ----------

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }
    function hideError() {
        errorEl.style.display = 'none';
        errorEl.textContent = '';
    }

    // ---------- Dynamic rows ----------

    function addRow(rowsContainer, placeholder) {
        rowCounter++;
        const isPercent = rowsContainer === percentRows;
        const row = document.createElement('div');
        row.className = 'pc-mass-row';
        row.innerHTML = `
            <input type="text" class="mm-input pc-mass-el-input" placeholder="e.g. C"
                   autocomplete="off" spellcheck="false" />
            <input type="number" class="mm-input pc-mass-val-input"
                   placeholder="${isPercent ? '% (e.g. 40)' : 'Mass (g)'}"
                   step="any" min="0" />
            <button class="pc-mass-remove-btn" title="Remove">\u00d7</button>
        `;
        rowsContainer.appendChild(row);
        row.querySelector('.pc-mass-remove-btn').addEventListener('click', () => row.remove());
    }

    // Initialize default rows
    addRow(percentRows); addRow(percentRows);

    percentAddBtn.addEventListener('click', () => addRow(percentRows));
    massAddBtn.addEventListener('click', () => addRow(massRows));

    // ---------- Normalise element symbol ----------

    function normSymbol(raw) {
        const s = raw.trim();
        if (!s) return null;
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    }

    // ---------- Gather rows ----------

    function gatherRows(rowsContainer) {
        const rows = rowsContainer.querySelectorAll('.pc-mass-row');
        const symbols = [];
        const values = [];
        for (const row of rows) {
            const symInput = row.querySelector('.pc-mass-el-input');
            const valInput = row.querySelector('.pc-mass-val-input');
            const sym = symInput.value.trim();
            const val = valInput.value.trim();
            if (!sym && !val) continue;
            if (!sym) return { error: 'Enter an element symbol for each row.' };
            const ns = normSymbol(sym);
            if (!VALID_ELEMENTS.has(ns)) return { error: `Unknown element: "${sym}"` };
            if (!val || isNaN(val) || Number(val) <= 0) return { error: `Enter a positive value for ${ns}.` };
            symbols.push(ns);
            values.push(parseFloat(val));
        }
        if (symbols.length < 2) return { error: 'Enter at least two elements.' };
        return { symbols, values };
    }

    // ---------- Calculate ----------

    function calculate() {
        hideError();
        resultsEl.style.display = 'none';

        const isPercent = currentMode === 'percent';
        const rowsContainer = isPercent ? percentRows : massRows;
        const gathered = gatherRows(rowsContainer);
        if (gathered.error) { showError(gathered.error); return; }

        const { symbols, values } = gathered;

        // Percent mode: check sum ~100%
        let masses;
        if (isPercent) {
            const sum = values.reduce((a, b) => a + b, 0);
            if (Math.abs(sum - 100) > 2) {
                showError(`Percentages sum to ${sum.toFixed(1)}%, should be ~100%.`);
                return;
            }
            // Assume 100g sample → percentages become grams
            masses = values.slice();
        } else {
            masses = values.slice();
        }

        const result = findEmpiricalFormula(symbols, masses);
        if (result.error) { showError(result.error); return; }

        renderResults(result);
    }

    // ---------- Render results ----------

    function renderResults(result) {
        resultsEl.style.display = '';

        // Formula hero
        formulaHero.innerHTML = `
            <span class="ef-hero-label">Empirical Formula</span>
            <span class="ef-hero-formula">${toSubscript(result.formula)}</span>
            <span class="ef-hero-mass">${result.empiricalMass.toFixed(3)} g/mol</span>
        `;

        // Steps
        stepsList.innerHTML = '';
        result.steps.forEach((step, i) => {
            const stepEl = document.createElement('div');
            stepEl.className = 'ef-step';
            stepEl.style.animationDelay = `${i * 80}ms`;
            stepEl.innerHTML = `
                <div class="ef-step-number">${i + 1}</div>
                <div class="ef-step-body">
                    <strong class="ef-step-title">${step.title}</strong>
                    <pre class="ef-step-detail">${step.detail}</pre>
                </div>
            `;
            stepsList.appendChild(stepEl);
        });

        // Molecular formula
        const mmStr = molarMassInput.value.trim();
        if (mmStr && !isNaN(mmStr) && Number(mmStr) > 0) {
            const molarMass = parseFloat(mmStr);
            const n = Math.round(molarMass / result.empiricalMass);
            if (n >= 1) {
                let molFormula = '';
                for (const p of result.pairs) {
                    const count = p.count * n;
                    molFormula += p.symbol + (count > 1 ? String(count) : '');
                }
                const molMass = result.empiricalMass * n;
                molecularEl.style.display = '';
                molecularEl.innerHTML = `
                    <div class="ef-molecular-inner">
                        <span class="ef-hero-label">Molecular Formula</span>
                        <span class="ef-mol-calc">n = ${molarMass.toFixed(1)} \u00f7 ${result.empiricalMass.toFixed(3)} \u2248 ${n}</span>
                        <span class="ef-hero-formula">${toSubscript(molFormula)}</span>
                        <span class="ef-hero-mass">${molMass.toFixed(3)} g/mol</span>
                    </div>
                `;
            } else {
                molecularEl.style.display = 'none';
            }
        } else {
            molecularEl.style.display = 'none';
        }

        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ---------- Events ----------

    percentCalcBtn.addEventListener('click', calculate);
    massCalcBtn.addEventListener('click', calculate);

    molarMassInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); calculate(); }
    });
}
