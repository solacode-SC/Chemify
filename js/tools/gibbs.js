/* ===================================================
   Chemify — Gibbs Free Energy Calculator (ES Module)
   Three modes:
     1. Standard: \u0394G\u00b0 = \u0394H\u00b0 - T\u00b7\u0394S\u00b0
     2. From K:   \u0394G\u00b0 = -RT\u00b7ln(K)
     3. Non-std:  \u0394G = \u0394G\u00b0 + RT\u00b7ln(Q)
   Interactive temperature slider for Mode 1.
   =================================================== */

const R = 8.314; // J/(mol\u00b7K)

// ---------- Main Init ----------

export function initGibbs(container) {
    let currentMode = 'standard';

    container.innerHTML = `
    <div class="gb-tool">

      <!-- Mode toggle -->
      <div class="tool-seg-control">
        <button class="tool-seg-btn active" data-mode="standard">\u0394G\u00b0 = \u0394H\u00b0 \u2212 T\u0394S\u00b0</button>
        <button class="tool-seg-btn" data-mode="equilibrium">\u0394G\u00b0 = \u2212RT ln(K)</button>
        <button class="tool-seg-btn" data-mode="nonstandard">\u0394G = \u0394G\u00b0 + RT ln(Q)</button>
      </div>

      <!-- Mode 1: Standard -->
      <div class="gb-mode" id="gbStandardMode">
        <div class="gb-input-group">
          <label class="mm-label">\u0394H\u00b0 (kJ/mol)</label>
          <input type="number" class="mm-input" id="gbDeltaH" placeholder="e.g. -286" step="any" />
        </div>
        <div class="gb-input-group">
          <label class="mm-label">\u0394S\u00b0 (J/mol\u00b7K)</label>
          <input type="number" class="mm-input" id="gbDeltaS" placeholder="e.g. 130" step="any" />
        </div>
        <div class="gb-input-group">
          <div class="gb-temp-row">
            <label class="mm-label">Temperature</label>
            <div class="gb-temp-unit-toggle">
              <button class="gb-unit-btn active" data-unit="K">K</button>
              <button class="gb-unit-btn" data-unit="C">\u00b0C</button>
            </div>
          </div>
          <input type="number" class="mm-input" id="gbTemp1" placeholder="e.g. 298" step="any" />
        </div>
        <button class="mm-calculate-btn" id="gbCalcStd">Calculate \u0394G\u00b0</button>

        <!-- Temperature slider -->
        <div class="gb-slider-section" id="gbSliderSection" style="display:none">
          <label class="mm-label">Temperature slider (K)</label>
          <div class="gb-slider-wrap">
            <input type="range" class="gb-slider" id="gbTempSlider" min="0" max="2000" step="1" value="298" />
            <span class="gb-slider-val" id="gbSliderVal">298 K</span>
          </div>
          <div class="gb-slider-dg" id="gbSliderDG"></div>
        </div>
      </div>

      <!-- Mode 2: From K -->
      <div class="gb-mode" id="gbEquilibriumMode" style="display:none">
        <div class="gb-input-group">
          <label class="mm-label">Equilibrium Constant (K)</label>
          <input type="number" class="mm-input" id="gbKeq" placeholder="e.g. 1.5e5" step="any" min="0" />
        </div>
        <div class="gb-input-group">
          <div class="gb-temp-row">
            <label class="mm-label">Temperature</label>
            <div class="gb-temp-unit-toggle">
              <button class="gb-unit-btn active" data-unit="K" data-group="keq">K</button>
              <button class="gb-unit-btn" data-unit="C" data-group="keq">\u00b0C</button>
            </div>
          </div>
          <input type="number" class="mm-input" id="gbTemp2" placeholder="e.g. 298" step="any" />
        </div>
        <button class="mm-calculate-btn" id="gbCalcKeq">Calculate \u0394G\u00b0</button>
      </div>

      <!-- Mode 3: Non-standard -->
      <div class="gb-mode" id="gbNonstandardMode" style="display:none">
        <div class="gb-input-group">
          <label class="mm-label">\u0394G\u00b0 (kJ/mol)</label>
          <input type="number" class="mm-input" id="gbDG0" placeholder="e.g. -30" step="any" />
        </div>
        <div class="gb-input-group">
          <div class="gb-temp-row">
            <label class="mm-label">Temperature</label>
            <div class="gb-temp-unit-toggle">
              <button class="gb-unit-btn active" data-unit="K" data-group="ns">K</button>
              <button class="gb-unit-btn" data-unit="C" data-group="ns">\u00b0C</button>
            </div>
          </div>
          <input type="number" class="mm-input" id="gbTemp3" placeholder="e.g. 298" step="any" />
        </div>
        <div class="gb-input-group">
          <label class="mm-label">Reaction Quotient (Q)</label>
          <input type="number" class="mm-input" id="gbQ" placeholder="e.g. 10" step="any" min="0" />
        </div>
        <button class="mm-calculate-btn" id="gbCalcNS">Calculate \u0394G</button>
      </div>

      <!-- Error -->
      <div class="gb-error" id="gbError"></div>

      <!-- Results -->
      <div class="gb-results" id="gbResults" style="display:none">

        <!-- Big DG display -->
        <div class="gb-dg-hero" id="gbDGHero"></div>

        <!-- Spontaneity badge -->
        <div class="gb-spontaneity" id="gbSpontaneity"></div>

        <!-- Temperature effect grid (Mode 1 only) -->
        <div class="gb-temp-grid-wrap" id="gbTempGridWrap" style="display:none">
          <h4 class="mm-breakdown-title">\u0394H / \u0394S Sign Analysis</h4>
          <div class="gb-temp-grid" id="gbTempGrid"></div>
        </div>

      </div>

    </div>
  `;

    // Grab elements
    const standardMode = container.querySelector('#gbStandardMode');
    const equilibriumMode = container.querySelector('#gbEquilibriumMode');
    const nonstandardMode = container.querySelector('#gbNonstandardMode');
    const errorEl = container.querySelector('#gbError');
    const resultsEl = container.querySelector('#gbResults');
    const dgHero = container.querySelector('#gbDGHero');
    const spontaneityEl = container.querySelector('#gbSpontaneity');
    const tempGridWrap = container.querySelector('#gbTempGridWrap');
    const tempGrid = container.querySelector('#gbTempGrid');
    const sliderSection = container.querySelector('#gbSliderSection');
    const tempSlider = container.querySelector('#gbTempSlider');
    const sliderVal = container.querySelector('#gbSliderVal');
    const sliderDG = container.querySelector('#gbSliderDG');

    // Inputs
    const deltaHInput = container.querySelector('#gbDeltaH');
    const deltaSInput = container.querySelector('#gbDeltaS');
    const temp1Input = container.querySelector('#gbTemp1');
    const keqInput = container.querySelector('#gbKeq');
    const temp2Input = container.querySelector('#gbTemp2');
    const dg0Input = container.querySelector('#gbDG0');
    const temp3Input = container.querySelector('#gbTemp3');
    const qInput = container.querySelector('#gbQ');

    // Temperature unit tracking per group
    const tempUnits = { standard: 'K', keq: 'K', ns: 'K' };

    // ---------- Mode toggle ----------

    container.querySelectorAll('.tool-seg-control .tool-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tool-seg-control .tool-seg-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            standardMode.style.display = currentMode === 'standard' ? '' : 'none';
            equilibriumMode.style.display = currentMode === 'equilibrium' ? '' : 'none';
            nonstandardMode.style.display = currentMode === 'nonstandard' ? '' : 'none';
            hideError();
            resultsEl.style.display = 'none';
            sliderSection.style.display = 'none';
        });
    });

    // ---------- Temperature unit toggles ----------

    container.querySelectorAll('.gb-temp-unit-toggle').forEach(toggle => {
        toggle.querySelectorAll('.gb-unit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toggle.querySelectorAll('.gb-unit-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Determine which group
                const group = btn.dataset.group || 'standard';
                tempUnits[group] = btn.dataset.unit;
            });
        });
    });

    // ---------- Error ----------

    function showError(msg) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
    function hideError() { errorEl.style.display = 'none'; errorEl.textContent = ''; }

    // ---------- Helpers ----------

    function toKelvin(temp, unit) {
        return unit === 'C' ? temp + 273.15 : temp;
    }

    function classifySpontaneity(dg) {
        if (Math.abs(dg) < 0.001) return { label: 'At equilibrium \u25ce', cls: 'gb-badge--equilibrium', explanation: 'The system is at thermodynamic equilibrium. No net reaction occurs.' };
        if (dg < 0) return { label: 'Spontaneous \u2713', cls: 'gb-badge--spontaneous', explanation: `With \u0394G = ${dg.toFixed(2)} kJ/mol < 0, the reaction proceeds spontaneously in the forward direction.` };
        return { label: 'Non-spontaneous \u2717', cls: 'gb-badge--nonspontaneous', explanation: `With \u0394G = ${dg.toFixed(2)} kJ/mol > 0, the reaction is non-spontaneous. External energy is required.` };
    }

    // ---------- Render results ----------

    function renderResults(dgKJ, showTempGrid, deltaH, deltaS) {
        resultsEl.style.display = '';

        // Big DG hero
        dgHero.innerHTML = `
            <span class="gb-dg-label">\u0394G</span>
            <span class="gb-dg-value">${dgKJ.toFixed(2)}</span>
            <span class="gb-dg-unit">kJ/mol</span>
        `;

        // Spontaneity badge
        const spont = classifySpontaneity(dgKJ);
        spontaneityEl.innerHTML = `
            <span class="gb-badge ${spont.cls}">${spont.label}</span>
            <p class="gb-explanation">${spont.explanation}</p>
        `;

        // Temperature effect grid (Mode 1)
        if (showTempGrid && deltaH !== undefined && deltaS !== undefined) {
            tempGridWrap.style.display = '';
            renderTempGrid(deltaH, deltaS);
        } else {
            tempGridWrap.style.display = 'none';
        }

        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ---------- Temperature effect grid ----------

    function renderTempGrid(dH, dS) {
        const cases = [
            { hSign: '< 0', sSign: '> 0', verdict: 'Always spontaneous', hNeg: true, sPos: true },
            { hSign: '< 0', sSign: '< 0', verdict: 'Spontaneous at low T', hNeg: true, sPos: false },
            { hSign: '> 0', sSign: '> 0', verdict: 'Spontaneous at high T', hNeg: false, sPos: true },
            { hSign: '> 0', sSign: '< 0', verdict: 'Never spontaneous', hNeg: false, sPos: false },
        ];

        const currentHNeg = dH < 0;
        const currentSPos = dS > 0;

        tempGrid.innerHTML = '';
        for (const c of cases) {
            const isActive = (c.hNeg === currentHNeg) && (c.sPos === currentSPos);
            const cell = document.createElement('div');
            cell.className = `gb-grid-cell ${isActive ? 'gb-grid-cell--active' : ''}`;
            cell.innerHTML = `
                <div class="gb-grid-signs">
                    <span>\u0394H ${c.hSign}</span>
                    <span>\u0394S ${c.sSign}</span>
                </div>
                <span class="gb-grid-verdict">${c.verdict}</span>
            `;
            tempGrid.appendChild(cell);
        }
    }

    // ---------- Mode 1: Standard ----------

    function calcStandard() {
        hideError();

        const dHStr = deltaHInput.value.trim();
        const dSStr = deltaSInput.value.trim();
        const tStr = temp1Input.value.trim();

        if (!dHStr || isNaN(dHStr)) { showError('Enter a valid \u0394H\u00b0 value.'); return; }
        if (!dSStr || isNaN(dSStr)) { showError('Enter a valid \u0394S\u00b0 value.'); return; }
        if (!tStr || isNaN(tStr)) { showError('Enter a valid temperature.'); return; }

        const dH = parseFloat(dHStr); // kJ/mol
        const dS = parseFloat(dSStr); // J/(mol\u00b7K)
        const T = toKelvin(parseFloat(tStr), tempUnits.standard);

        if (T <= 0) { showError('Temperature must be positive (in Kelvin).'); return; }

        // \u0394G\u00b0 = \u0394H\u00b0 - T\u00b7\u0394S\u00b0  (convert \u0394S from J to kJ)
        const dgKJ = dH - T * (dS / 1000);

        renderResults(dgKJ, true, dH, dS);

        // Show slider
        sliderSection.style.display = '';
        tempSlider.value = Math.round(T);
        updateSlider(dH, dS);
    }

    // ---------- Slider ----------

    function updateSlider(dH, dS) {
        const T = parseInt(tempSlider.value, 10);
        sliderVal.textContent = `${T} K`;
        const dg = dH - T * (dS / 1000);
        const spont = classifySpontaneity(dg);
        sliderDG.innerHTML = `<span class="gb-slider-dg-val">\u0394G = ${dg.toFixed(2)} kJ/mol</span> <span class="gb-badge ${spont.cls}" style="font-size:0.75rem;padding:0.2rem 0.6rem">${spont.label}</span>`;
    }

    tempSlider.addEventListener('input', () => {
        const dHStr = deltaHInput.value.trim();
        const dSStr = deltaSInput.value.trim();
        if (dHStr && dSStr && !isNaN(dHStr) && !isNaN(dSStr)) {
            updateSlider(parseFloat(dHStr), parseFloat(dSStr));
        }
    });

    container.querySelector('#gbCalcStd').addEventListener('click', calcStandard);

    // Enter key for mode 1
    [deltaHInput, deltaSInput, temp1Input].forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); calcStandard(); }
        });
    });

    // ---------- Mode 2: From K ----------

    function calcFromK() {
        hideError();

        const kStr = keqInput.value.trim();
        const tStr = temp2Input.value.trim();

        if (!kStr || isNaN(kStr) || Number(kStr) <= 0) { showError('Enter a positive equilibrium constant K.'); return; }
        if (!tStr || isNaN(tStr)) { showError('Enter a valid temperature.'); return; }

        const K = parseFloat(kStr);
        const T = toKelvin(parseFloat(tStr), tempUnits.keq);
        if (T <= 0) { showError('Temperature must be positive (in Kelvin).'); return; }

        // \u0394G\u00b0 = -RT\u00b7ln(K) in J, convert to kJ
        const dgKJ = (-R * T * Math.log(K)) / 1000;

        renderResults(dgKJ, false);
    }

    container.querySelector('#gbCalcKeq').addEventListener('click', calcFromK);
    [keqInput, temp2Input].forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); calcFromK(); }
        });
    });

    // ---------- Mode 3: Non-standard ----------

    function calcNonStandard() {
        hideError();

        const dg0Str = dg0Input.value.trim();
        const tStr = temp3Input.value.trim();
        const qStr = qInput.value.trim();

        if (!dg0Str || isNaN(dg0Str)) { showError('Enter a valid \u0394G\u00b0 value.'); return; }
        if (!tStr || isNaN(tStr)) { showError('Enter a valid temperature.'); return; }
        if (!qStr || isNaN(qStr) || Number(qStr) <= 0) { showError('Enter a positive reaction quotient Q.'); return; }

        const dg0 = parseFloat(dg0Str); // kJ/mol
        const T = toKelvin(parseFloat(tStr), tempUnits.ns);
        const Q = parseFloat(qStr);
        if (T <= 0) { showError('Temperature must be positive (in Kelvin).'); return; }

        // \u0394G = \u0394G\u00b0 + RT\u00b7ln(Q), R in J so convert to kJ
        const dgKJ = dg0 + (R * T * Math.log(Q)) / 1000;

        renderResults(dgKJ, false);
    }

    container.querySelector('#gbCalcNS').addEventListener('click', calcNonStandard);
    [dg0Input, temp3Input, qInput].forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); calcNonStandard(); }
        });
    });

    // Focus first input
    requestAnimationFrame(() => deltaHInput.focus());
}
