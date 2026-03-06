/* ===================================================
   Chemify — Ideal Gas Law Calculator (ES Module)
   PV = nRT. Fill any 3, solve for the 4th.
   Auto-solve with unit awareness.
   Optional density calc & Van der Waals correction.
   =================================================== */

// R in base units: L·atm/(mol·K)
const R_BASE = 0.082057;
// R in J/(mol·K) for Van der Waals in SI
const R_SI = 8.314;

// ---------- Unit conversion to/from base (atm, L, mol, K) ----------

const PRESSURE_UNITS = {
    atm:  { label: 'atm',  toBase: v => v,              fromBase: v => v },
    Pa:   { label: 'Pa',   toBase: v => v / 101325,     fromBase: v => v * 101325 },
    kPa:  { label: 'kPa',  toBase: v => v / 101.325,    fromBase: v => v * 101.325 },
    bar:  { label: 'bar',  toBase: v => v / 1.01325,    fromBase: v => v * 1.01325 },
    mmHg: { label: 'mmHg', toBase: v => v / 760,        fromBase: v => v * 760 },
    psi:  { label: 'psi',  toBase: v => v / 14.696,     fromBase: v => v * 14.696 },
};

const VOLUME_UNITS = {
    L:   { label: 'L',   toBase: v => v,             fromBase: v => v },
    mL:  { label: 'mL',  toBase: v => v / 1000,      fromBase: v => v * 1000 },
    'm3': { label: 'm\u00b3', toBase: v => v * 1000,       fromBase: v => v / 1000 },
    cm3: { label: 'cm\u00b3', toBase: v => v / 1000,       fromBase: v => v * 1000 },
};

const MOLES_UNITS = {
    mol:  { label: 'mol',  toBase: v => v,           fromBase: v => v },
    mmol: { label: 'mmol', toBase: v => v / 1000,    fromBase: v => v * 1000 },
};

const TEMP_UNITS = {
    K: { label: 'K',  toBase: v => v,             fromBase: v => v },
    C: { label: '\u00b0C', toBase: v => v + 273.15,   fromBase: v => v - 273.15 },
};

// Van der Waals constants (a in L²·atm/mol², b in L/mol)
const VDW_GASES = {
    'H\u2082':  { a: 0.2476, b: 0.02661, name: 'Hydrogen' },
    'N\u2082':  { a: 1.390,  b: 0.03913, name: 'Nitrogen' },
    'O\u2082':  { a: 1.360,  b: 0.03183, name: 'Oxygen' },
    'CO\u2082': { a: 3.592,  b: 0.04267, name: 'Carbon Dioxide' },
    'CH\u2084': { a: 2.253,  b: 0.04278, name: 'Methane' },
};

// ---------- Main Init ----------

export function initIdealGas(container) {
    container.innerHTML = `
    <div class="ig-tool">

      <!-- 2×2 variable grid -->
      <div class="ig-grid">

        <!-- Pressure -->
        <div class="ig-card" data-var="P">
          <div class="ig-card-header">
            <span class="ig-card-symbol">P</span>
            <span class="ig-card-name">Pressure</span>
          </div>
          <div class="ig-card-input-row">
            <input type="number" class="mm-input ig-var-input" id="igP" placeholder="\u2014" step="any" />
            <select class="sto-select ig-unit-select" id="igPUnit">
              <option value="atm">atm</option>
              <option value="Pa">Pa</option>
              <option value="kPa">kPa</option>
              <option value="bar">bar</option>
              <option value="mmHg">mmHg</option>
              <option value="psi">psi</option>
            </select>
          </div>
        </div>

        <!-- Volume -->
        <div class="ig-card" data-var="V">
          <div class="ig-card-header">
            <span class="ig-card-symbol">V</span>
            <span class="ig-card-name">Volume</span>
          </div>
          <div class="ig-card-input-row">
            <input type="number" class="mm-input ig-var-input" id="igV" placeholder="\u2014" step="any" />
            <select class="sto-select ig-unit-select" id="igVUnit">
              <option value="L">L</option>
              <option value="mL">mL</option>
              <option value="m3">m\u00b3</option>
              <option value="cm3">cm\u00b3</option>
            </select>
          </div>
        </div>

        <!-- Moles -->
        <div class="ig-card" data-var="n">
          <div class="ig-card-header">
            <span class="ig-card-symbol">n</span>
            <span class="ig-card-name">Moles</span>
          </div>
          <div class="ig-card-input-row">
            <input type="number" class="mm-input ig-var-input" id="ign" placeholder="\u2014" step="any" />
            <select class="sto-select ig-unit-select" id="ignUnit">
              <option value="mol">mol</option>
              <option value="mmol">mmol</option>
            </select>
          </div>
        </div>

        <!-- Temperature -->
        <div class="ig-card" data-var="T">
          <div class="ig-card-header">
            <span class="ig-card-symbol">T</span>
            <span class="ig-card-name">Temperature</span>
          </div>
          <div class="ig-card-input-row">
            <input type="number" class="mm-input ig-var-input" id="igT" placeholder="\u2014" step="any" />
            <select class="sto-select ig-unit-select" id="igTUnit">
              <option value="K">K</option>
              <option value="C">\u00b0C</option>
            </select>
          </div>
        </div>

      </div>

      <!-- Density section -->
      <div class="ig-extra-section">
        <div class="ig-density-row">
          <label class="mm-label">Molar mass (g/mol) — for density</label>
          <input type="number" class="mm-input" id="igMolarMass" placeholder="e.g. 28.014 (N\u2082)" step="any" min="0" />
        </div>
      </div>

      <!-- Van der Waals toggle -->
      <div class="ig-vdw-section">
        <div class="ig-vdw-toggle-row">
          <label class="mm-label">Real gas correction (Van der Waals)</label>
          <div class="ig-vdw-controls">
            <label class="ig-toggle-label">
              <input type="checkbox" id="igVdwToggle" />
              <span class="ig-toggle-text">Enable</span>
            </label>
            <select class="sto-select ig-vdw-gas-select" id="igVdwGas" disabled>
              ${Object.entries(VDW_GASES).map(([key, g]) =>
                `<option value="${key}">${key} (${g.name})</option>`
              ).join('')}
            </select>
          </div>
        </div>
        <div class="ig-vdw-info" id="igVdwInfo" style="display:none"></div>
      </div>

      <!-- Error -->
      <div class="ig-error" id="igError"></div>

      <!-- Results -->
      <div class="ig-results" id="igResults" style="display:none">
        <div class="ig-result-equation" id="igResultEq"></div>
        <div class="ig-result-extras" id="igResultExtras"></div>
      </div>

    </div>
  `;

    // Grab elements
    const inputs = {
        P: container.querySelector('#igP'),
        V: container.querySelector('#igV'),
        n: container.querySelector('#ign'),
        T: container.querySelector('#igT'),
    };
    const unitSelects = {
        P: container.querySelector('#igPUnit'),
        V: container.querySelector('#igVUnit'),
        n: container.querySelector('#ignUnit'),
        T: container.querySelector('#igTUnit'),
    };
    const cards = {
        P: container.querySelector('.ig-card[data-var="P"]'),
        V: container.querySelector('.ig-card[data-var="V"]'),
        n: container.querySelector('.ig-card[data-var="n"]'),
        T: container.querySelector('.ig-card[data-var="T"]'),
    };
    const molarMassInput = container.querySelector('#igMolarMass');
    const vdwToggle = container.querySelector('#igVdwToggle');
    const vdwGasSelect = container.querySelector('#igVdwGas');
    const vdwInfo = container.querySelector('#igVdwInfo');
    const errorEl = container.querySelector('#igError');
    const resultsEl = container.querySelector('#igResults');
    const resultEq = container.querySelector('#igResultEq');
    const resultExtras = container.querySelector('#igResultExtras');

    const VARS = ['P', 'V', 'n', 'T'];
    const unitMaps = { P: PRESSURE_UNITS, V: VOLUME_UNITS, n: MOLES_UNITS, T: TEMP_UNITS };

    // ---------- VdW toggle ----------

    vdwToggle.addEventListener('change', () => {
        vdwGasSelect.disabled = !vdwToggle.checked;
        if (vdwToggle.checked) {
            showVdwInfo();
        } else {
            vdwInfo.style.display = 'none';
        }
        autoSolve();
    });

    vdwGasSelect.addEventListener('change', () => {
        if (vdwToggle.checked) { showVdwInfo(); autoSolve(); }
    });

    function showVdwInfo() {
        const gas = VDW_GASES[vdwGasSelect.value];
        if (!gas) return;
        vdwInfo.style.display = '';
        vdwInfo.innerHTML = `<span class="ig-vdw-params">a = ${gas.a} L\u00b2\u00b7atm/mol\u00b2, b = ${gas.b} L/mol</span>`;
    }

    // ---------- Error ----------

    function showError(msg) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
    function hideError() { errorEl.style.display = 'none'; errorEl.textContent = ''; }

    // ---------- Highlight unknown ----------

    function highlightUnknown(unknownVar) {
        for (const v of VARS) {
            cards[v].classList.toggle('ig-card--unknown', v === unknownVar);
            cards[v].classList.toggle('ig-card--solved', v === unknownVar && unknownVar !== null);
        }
    }

    // ---------- Auto-solve ----------

    function autoSolve() {
        hideError();
        resultsEl.style.display = 'none';
        highlightUnknown(null);

        // Determine which vars are filled
        const filled = {};
        const empty = [];
        for (const v of VARS) {
            const val = inputs[v].value.trim();
            if (val !== '' && !isNaN(val)) {
                const unitKey = unitSelects[v].value;
                const baseVal = unitMaps[v][unitKey].toBase(parseFloat(val));
                filled[v] = baseVal;
            } else {
                empty.push(v);
            }
        }

        if (empty.length !== 1) {
            // Not exactly 3 filled — clear highlight
            if (empty.length === 0) {
                // All filled — maybe user wants to check, just return
            }
            return;
        }

        const unknown = empty[0];
        highlightUnknown(unknown);

        // Validate filled values
        for (const [v, val] of Object.entries(filled)) {
            if (v === 'T' && val <= 0) { showError('Temperature must be positive in Kelvin.'); return; }
            if (v !== 'T' && val < 0) { showError(`${v} must be non-negative.`); return; }
        }

        let result;

        if (vdwToggle.checked) {
            result = solveVdW(filled, unknown);
        } else {
            result = solveIdeal(filled, unknown);
        }

        if (result.error) { showError(result.error); return; }

        // Convert result back to user's unit
        const resultUnitKey = unitSelects[unknown].value;
        const resultInUserUnit = unitMaps[unknown][resultUnitKey].fromBase(result.value);

        // Display in input with highlight
        inputs[unknown].value = roundSmart(resultInUserUnit);
        inputs[unknown].classList.add('ig-solved-input');

        // Show result
        showResult(filled, unknown, result.value, resultInUserUnit, resultUnitKey);
    }

    // ---------- Ideal gas solve ----------

    function solveIdeal(filled, unknown) {
        // PV = nRT  →  solve for unknown
        const { P, V, n, T } = filled;
        let value;

        switch (unknown) {
            case 'P':
                value = (n * R_BASE * T) / V;
                break;
            case 'V':
                value = (n * R_BASE * T) / P;
                break;
            case 'n':
                value = (P * V) / (R_BASE * T);
                break;
            case 'T':
                value = (P * V) / (n * R_BASE);
                break;
        }

        if (!isFinite(value) || value < 0) return { error: 'Calculation resulted in an invalid value.' };
        return { value };
    }

    // ---------- Van der Waals solve ----------

    function solveVdW(filled, unknown) {
        const gas = VDW_GASES[vdwGasSelect.value];
        if (!gas) return { error: 'Select a gas for Van der Waals correction.' };

        const { a, b } = gas;
        const { P, V, n, T } = filled;

        // (P + a·n²/V²)(V - n·b) = nRT
        let value;

        switch (unknown) {
            case 'P':
                value = (n * R_BASE * T) / (V - n * b) - a * (n * n) / (V * V);
                break;
            case 'V':
                // Iterative: Newton's method starting from ideal V
                value = solveVdW_V(P, n, T, a, b);
                break;
            case 'n':
                // Iterative approach
                value = solveVdW_n(P, V, T, a, b);
                break;
            case 'T':
                value = (P + a * (n * n) / (V * V)) * (V - n * b) / (n * R_BASE);
                break;
        }

        if (value === null || !isFinite(value) || value < 0) return { error: 'Van der Waals calculation failed. Try different values.' };
        return { value };
    }

    function solveVdW_V(P, n, T, a, b) {
        // f(V) = (P + a·n²/V²)(V - n·b) - nRT = 0
        // Start with ideal gas V
        let V = n * R_BASE * T / P;
        for (let i = 0; i < 100; i++) {
            const f = (P + a * n * n / (V * V)) * (V - n * b) - n * R_BASE * T;
            // f'(V) = P + a·n²/V² - 2a·n²(V-n·b)/V³ + ...
            // Numerically:
            const dV = V * 1e-8 || 1e-10;
            const f2 = (P + a * n * n / ((V + dV) * (V + dV))) * ((V + dV) - n * b) - n * R_BASE * T;
            const fp = (f2 - f) / dV;
            if (Math.abs(fp) < 1e-30) break;
            const Vnew = V - f / fp;
            if (Math.abs(Vnew - V) < 1e-10) { V = Vnew; break; }
            V = Vnew;
        }
        return V > 0 ? V : null;
    }

    function solveVdW_n(P, V, T, a, b) {
        // Start with ideal n
        let n = P * V / (R_BASE * T);
        for (let i = 0; i < 100; i++) {
            const f = (P + a * n * n / (V * V)) * (V - n * b) - n * R_BASE * T;
            const dn = n * 1e-8 || 1e-10;
            const f2 = (P + a * (n + dn) * (n + dn) / (V * V)) * (V - (n + dn) * b) - (n + dn) * R_BASE * T;
            const fp = (f2 - f) / dn;
            if (Math.abs(fp) < 1e-30) break;
            const nnew = n - f / fp;
            if (Math.abs(nnew - n) < 1e-10) { n = nnew; break; }
            n = nnew;
        }
        return n > 0 ? n : null;
    }

    // ---------- Show result ----------

    function showResult(filled, unknown, baseValue, userValue, userUnit) {
        resultsEl.style.display = '';

        const unitLabel = unitMaps[unknown][userUnit].label;
        resultEq.innerHTML = `
            <div class="ig-eq-line">
                <span class="ig-eq-label">PV = nRT</span>
            </div>
            <div class="ig-eq-result">
                <span class="ig-eq-var">${unknown}</span>
                <span class="ig-eq-equals">=</span>
                <span class="ig-eq-value">${roundSmart(userValue)}</span>
                <span class="ig-eq-unit">${unitLabel}</span>
            </div>
        `;

        // Extras: density, VdW info
        let extrasHTML = '';

        // Density
        const mmStr = molarMassInput.value.trim();
        if (mmStr && !isNaN(mmStr) && Number(mmStr) > 0) {
            const mm = parseFloat(mmStr);
            // d = (M·P)/(R·T) in g/L  (P in atm, T in K)
            const P_atm = unknown === 'P' ? baseValue : filled.P;
            const T_K = unknown === 'T' ? baseValue : filled.T;
            if (P_atm && T_K && T_K > 0) {
                const density = (mm * P_atm) / (R_BASE * T_K);
                extrasHTML += `
                    <div class="ig-extra-card">
                        <span class="ig-extra-label">Gas Density</span>
                        <span class="ig-extra-value">${density.toFixed(4)} g/L</span>
                    </div>
                `;
            }
        }

        if (vdwToggle.checked) {
            const gas = VDW_GASES[vdwGasSelect.value];
            // Also compute ideal value for comparison
            const idealResult = solveIdeal(
                { ...filled },
                unknown
            );
            if (idealResult.value !== undefined) {
                const idealUserVal = unitMaps[unknown][userUnit].fromBase(idealResult.value);
                const diff = userValue - idealUserVal;
                const pctDiff = idealUserVal !== 0 ? (diff / idealUserVal * 100) : 0;
                extrasHTML += `
                    <div class="ig-extra-card">
                        <span class="ig-extra-label">Ideal Gas Value</span>
                        <span class="ig-extra-value">${roundSmart(idealUserVal)} ${unitLabel}</span>
                    </div>
                    <div class="ig-extra-card">
                        <span class="ig-extra-label">VdW Correction</span>
                        <span class="ig-extra-value">${diff >= 0 ? '+' : ''}${roundSmart(diff)} ${unitLabel} (${pctDiff >= 0 ? '+' : ''}${pctDiff.toFixed(2)}%)</span>
                    </div>
                `;
            }
        }

        resultExtras.innerHTML = extrasHTML;
    }

    // ---------- Helpers ----------

    function roundSmart(val) {
        if (Math.abs(val) >= 1000) return val.toFixed(1);
        if (Math.abs(val) >= 1) return val.toFixed(3);
        if (Math.abs(val) >= 0.001) return val.toFixed(6);
        return val.toExponential(4);
    }

    // ---------- Event listeners ----------

    // Auto-solve on any input change
    for (const v of VARS) {
        inputs[v].addEventListener('input', () => {
            inputs[v].classList.remove('ig-solved-input');
            autoSolve();
        });
        unitSelects[v].addEventListener('change', () => {
            inputs[v].classList.remove('ig-solved-input');
            autoSolve();
        });
    }

    molarMassInput.addEventListener('input', autoSolve);

    // Clear a solved input when user clicks on it
    for (const v of VARS) {
        inputs[v].addEventListener('focus', () => {
            if (inputs[v].classList.contains('ig-solved-input')) {
                inputs[v].value = '';
                inputs[v].classList.remove('ig-solved-input');
                highlightUnknown(null);
                resultsEl.style.display = 'none';
            }
        });
    }

    // Focus first input
    requestAnimationFrame(() => inputs.P.focus());
}
