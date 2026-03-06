/* ===================================================
   Chemify — Molarity & Dilution Calculator (ES Module)
   Two modes:
     1. Molarity: mass + molar mass + volume → M
     2. Dilution: C₁V₁ = C₂V₂ (fill 3, solve 4th)
   Pure math, no parser needed.
   =================================================== */

// ---------- Unit conversions ----------

function massToGrams(val, unit) {
    if (unit === 'mg') return val / 1000;
    if (unit === 'kg') return val * 1000;
    return val; // g
}

function volumeToLitres(val, unit) {
    if (unit === 'mL') return val / 1000;
    if (unit === 'dL') return val / 10;
    return val; // L
}

function concToMolPerL(val, unit) {
    if (unit === 'mmol/L') return val / 1000;
    return val; // mol/L
}

function concFromMolPerL(val, unit) {
    if (unit === 'mmol/L') return val * 1000;
    return val; // mol/L
}

function dilVolToL(val, unit) {
    if (unit === 'L') return val;
    return val / 1000; // mL → L
}

function dilVolFromL(val, unit) {
    if (unit === 'L') return val;
    return val * 1000; // L → mL
}

// ---------- Smart rounding ----------

function fmt(val) {
    if (Math.abs(val) >= 1000) return val.toFixed(1);
    if (Math.abs(val) >= 1) return val.toFixed(4);
    if (Math.abs(val) >= 0.001) return val.toFixed(6);
    return val.toExponential(4);
}

// ---------- Main Init ----------

export function initMolarity(container) {
    let currentMode = 'molarity';

    container.innerHTML = `
    <div class="mol-tool">

      <!-- Mode toggle -->
      <div class="tool-seg-control">
        <button class="tool-seg-btn active" data-mode="molarity">Molarity</button>
        <button class="tool-seg-btn" data-mode="dilution">Dilution</button>
      </div>

      <!-- Mode 1: Molarity -->
      <div class="mol-mode" id="molMolarityMode">
        <div class="mol-input-grid">
          <div class="mol-field">
            <label class="mm-label">Mass of solute</label>
            <div class="mol-input-unit-wrap">
              <input type="number" class="mm-input" id="molMass" placeholder="e.g. 5.85" step="any" min="0" />
              <select class="mol-unit-select" id="molMassUnit">
                <option value="g">g</option>
                <option value="mg">mg</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>
          <div class="mol-field">
            <label class="mm-label">
              Molar mass of solute
              <span class="mol-tooltip" title="Don't know it? Use the Molar Mass Calculator tool">?</span>
            </label>
            <div class="mol-input-unit-wrap">
              <input type="number" class="mm-input" id="molMolarMass" placeholder="e.g. 58.44" step="any" min="0" />
              <span class="mol-unit-label">g/mol</span>
            </div>
          </div>
          <div class="mol-field">
            <label class="mm-label">Volume of solution</label>
            <div class="mol-input-unit-wrap">
              <input type="number" class="mm-input" id="molVolume" placeholder="e.g. 500" step="any" min="0" />
              <select class="mol-unit-select" id="molVolumeUnit">
                <option value="L">L</option>
                <option value="mL">mL</option>
                <option value="dL">dL</option>
              </select>
            </div>
          </div>
        </div>
        <button class="mm-calculate-btn" id="molCalcBtn">Calculate Molarity</button>

        <!-- Error -->
        <div class="mol-error" id="molError"></div>

        <!-- Results -->
        <div class="mol-results" id="molResults" style="display:none">
          <div class="mol-result-hero">
            <div class="mol-result-item">
              <span class="mol-result-label">Molarity</span>
              <span class="mol-result-value" id="molMolarityVal">\u2014</span>
              <span class="mol-result-unit">mol/L</span>
            </div>
            <div class="mol-result-item">
              <span class="mol-result-label">Moles of solute</span>
              <span class="mol-result-value" id="molMolesVal">\u2014</span>
              <span class="mol-result-unit">mol</span>
            </div>
          </div>
          <!-- Step-by-step -->
          <div class="mol-steps" id="molSteps"></div>
        </div>
      </div>

      <!-- Mode 2: Dilution -->
      <div class="mol-mode" id="molDilutionMode" style="display:none">

        <!-- Visual equation: C1V1 = C2V2 -->
        <div class="dil-equation">
          <div class="dil-eq-group">
            <div class="dil-field">
              <label class="mm-label">C\u2081</label>
              <div class="mol-input-unit-wrap">
                <input type="number" class="mm-input dil-input" id="dilC1" placeholder="\u2014" step="any" min="0" />
                <select class="mol-unit-select" id="dilC1Unit">
                  <option value="mol/L">mol/L</option>
                  <option value="mmol/L">mmol/L</option>
                </select>
              </div>
            </div>
            <span class="dil-op">\u00d7</span>
            <div class="dil-field">
              <label class="mm-label">V\u2081</label>
              <div class="mol-input-unit-wrap">
                <input type="number" class="mm-input dil-input" id="dilV1" placeholder="\u2014" step="any" min="0" />
                <select class="mol-unit-select" id="dilV1Unit">
                  <option value="mL">mL</option>
                  <option value="L">L</option>
                </select>
              </div>
            </div>
          </div>
          <span class="dil-equals">=</span>
          <div class="dil-eq-group">
            <div class="dil-field">
              <label class="mm-label">C\u2082</label>
              <div class="mol-input-unit-wrap">
                <input type="number" class="mm-input dil-input" id="dilC2" placeholder="\u2014" step="any" min="0" />
                <select class="mol-unit-select" id="dilC2Unit">
                  <option value="mol/L">mol/L</option>
                  <option value="mmol/L">mmol/L</option>
                </select>
              </div>
            </div>
            <span class="dil-op">\u00d7</span>
            <div class="dil-field">
              <label class="mm-label">V\u2082</label>
              <div class="mol-input-unit-wrap">
                <input type="number" class="mm-input dil-input" id="dilV2" placeholder="\u2014" step="any" min="0" />
                <select class="mol-unit-select" id="dilV2Unit">
                  <option value="mL">mL</option>
                  <option value="L">L</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <p class="dil-hint">Fill any 3 values \u2014 the 4th calculates automatically</p>

        <!-- Error -->
        <div class="mol-error" id="dilError"></div>

        <!-- Beaker visual -->
        <div class="dil-beakers" id="dilBeakers" style="display:none">
          <div class="dil-beaker">
            <svg class="dil-beaker-svg" id="dilBeaker1" viewBox="0 0 80 100"></svg>
            <span class="dil-beaker-label">Initial solution</span>
          </div>
          <div class="dil-arrow">\u2192</div>
          <div class="dil-beaker">
            <svg class="dil-beaker-svg" id="dilBeaker2" viewBox="0 0 80 100"></svg>
            <span class="dil-beaker-label">Diluted solution</span>
          </div>
        </div>

        <!-- Result -->
        <div class="dil-result" id="dilResult" style="display:none">
          <span class="dil-result-text" id="dilResultText"></span>
        </div>

      </div>

    </div>
  `;

    // ==================== Grab elements ====================

    // Mode 1
    const molarityMode = container.querySelector('#molMolarityMode');
    const dilutionMode = container.querySelector('#molDilutionMode');
    const massInput = container.querySelector('#molMass');
    const massUnitSel = container.querySelector('#molMassUnit');
    const molarMassInput = container.querySelector('#molMolarMass');
    const volumeInput = container.querySelector('#molVolume');
    const volumeUnitSel = container.querySelector('#molVolumeUnit');
    const calcBtn = container.querySelector('#molCalcBtn');
    const molError = container.querySelector('#molError');
    const molResults = container.querySelector('#molResults');
    const molMolarityVal = container.querySelector('#molMolarityVal');
    const molMolesVal = container.querySelector('#molMolesVal');
    const molSteps = container.querySelector('#molSteps');

    // Mode 2
    const dilInputs = {
        C1: container.querySelector('#dilC1'),
        V1: container.querySelector('#dilV1'),
        C2: container.querySelector('#dilC2'),
        V2: container.querySelector('#dilV2'),
    };
    const dilUnits = {
        C1: container.querySelector('#dilC1Unit'),
        V1: container.querySelector('#dilV1Unit'),
        C2: container.querySelector('#dilC2Unit'),
        V2: container.querySelector('#dilV2Unit'),
    };
    const dilError = container.querySelector('#dilError');
    const dilBeakers = container.querySelector('#dilBeakers');
    const dilBeaker1 = container.querySelector('#dilBeaker1');
    const dilBeaker2 = container.querySelector('#dilBeaker2');
    const dilResult = container.querySelector('#dilResult');
    const dilResultText = container.querySelector('#dilResultText');

    const DIL_VARS = ['C1', 'V1', 'C2', 'V2'];

    // ==================== Mode toggle ====================

    container.querySelectorAll('.tool-seg-control .tool-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tool-seg-control .tool-seg-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            molarityMode.style.display = currentMode === 'molarity' ? '' : 'none';
            dilutionMode.style.display = currentMode === 'dilution' ? '' : 'none';
        });
    });

    // ==================== Error helpers ====================

    function showError(el, msg) { el.textContent = msg; el.style.display = 'block'; }
    function hideError(el) { el.style.display = 'none'; el.textContent = ''; }

    // ==================== MODE 1: MOLARITY ====================

    function calcMolarity() {
        hideError(molError);
        molResults.style.display = 'none';

        const massStr = massInput.value.trim();
        const mmStr = molarMassInput.value.trim();
        const volStr = volumeInput.value.trim();

        if (!massStr || isNaN(massStr) || Number(massStr) <= 0) {
            showError(molError, 'Enter a positive mass of solute.');
            return;
        }
        if (!mmStr || isNaN(mmStr) || Number(mmStr) <= 0) {
            showError(molError, 'Enter a positive molar mass.');
            return;
        }
        if (!volStr || isNaN(volStr) || Number(volStr) <= 0) {
            showError(molError, 'Enter a positive volume.');
            return;
        }

        const mass = parseFloat(massStr);
        const mm = parseFloat(mmStr);
        const vol = parseFloat(volStr);

        const massG = massToGrams(mass, massUnitSel.value);
        const volL = volumeToLitres(vol, volumeUnitSel.value);

        const moles = massG / mm;
        const molarity = moles / volL;

        molMolarityVal.textContent = fmt(molarity);
        molMolesVal.textContent = fmt(moles);

        // Step-by-step
        molSteps.innerHTML = `
            <h4 class="mm-breakdown-title">Step-by-step</h4>
            <div class="mol-steps-list">
                <div class="mol-step">
                    <span class="mol-step-num">1</span>
                    <div class="mol-step-body">
                        <strong class="mol-step-title">Convert mass to grams</strong>
                        <span class="mol-step-detail">${mass} ${massUnitSel.value} = ${fmt(massG)} g</span>
                    </div>
                </div>
                <div class="mol-step">
                    <span class="mol-step-num">2</span>
                    <div class="mol-step-body">
                        <strong class="mol-step-title">Calculate moles</strong>
                        <span class="mol-step-detail">n = ${fmt(massG)} g \u00f7 ${fmt(mm)} g/mol = ${fmt(moles)} mol</span>
                    </div>
                </div>
                <div class="mol-step">
                    <span class="mol-step-num">3</span>
                    <div class="mol-step-body">
                        <strong class="mol-step-title">Convert volume to litres</strong>
                        <span class="mol-step-detail">${vol} ${volumeUnitSel.value} = ${fmt(volL)} L</span>
                    </div>
                </div>
                <div class="mol-step">
                    <span class="mol-step-num">4</span>
                    <div class="mol-step-body">
                        <strong class="mol-step-title">Calculate molarity</strong>
                        <span class="mol-step-detail">M = ${fmt(moles)} mol \u00f7 ${fmt(volL)} L = <strong>${fmt(molarity)} mol/L</strong></span>
                    </div>
                </div>
            </div>
        `;

        molResults.style.display = '';
        molResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    calcBtn.addEventListener('click', calcMolarity);
    [massInput, molarMassInput, volumeInput].forEach(inp => {
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); calcMolarity(); }
        });
    });

    // ==================== MODE 2: DILUTION ====================

    // --- Beaker drawing ---

    function drawBeaker(svg, fillFraction, concentration) {
        // fillFraction: 0..1 (volume relative to max)
        // concentration: 0..1 (colour intensity)
        const fill = Math.max(0.05, Math.min(1, fillFraction));
        const alpha = Math.max(0.08, Math.min(0.85, concentration));

        const beakerPath = `
            M 10 15 L 10 85 Q 10 92 18 92 L 62 92 Q 70 92 70 85 L 70 15
            M 5 15 L 75 15
        `;

        const fillH = fill * 72; // max fill height 72 (from y=20 to y=92)
        const fillY = 92 - fillH;

        svg.innerHTML = `
            <rect x="12" y="${fillY}" width="56" height="${fillH}"
                  rx="2" fill="rgba(26, 26, 26, ${alpha})"
                  style="transition: height 0.5s ease, y 0.5s ease" />
            <path d="${beakerPath}" stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round" />
            <line x1="7" y1="15" x2="73" y2="15" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" />
        `;
    }

    // --- Auto-solve ---

    function dilAutoSolve() {
        hideError(dilError);
        dilResult.style.display = 'none';
        dilBeakers.style.display = 'none';

        // Remove previous calculated highlights
        for (const v of DIL_VARS) {
            dilInputs[v].classList.remove('dil-input--calculated');
        }

        // Gather filled values
        const filled = {};
        const empty = [];
        for (const v of DIL_VARS) {
            const str = dilInputs[v].value.trim();
            if (str !== '' && !isNaN(str) && Number(str) > 0) {
                filled[v] = parseFloat(str);
            } else if (str !== '' && str !== '') {
                // Invalid value present
                if (str !== '' && isNaN(str)) {
                    showError(dilError, `Invalid value for ${v.replace('1', '\u2081').replace('2', '\u2082')}.`);
                    return;
                }
                empty.push(v);
            } else {
                empty.push(v);
            }
        }

        if (empty.length !== 1) return; // need exactly 3 filled

        const unknown = empty[0];

        // Convert to base units (mol/L and L)
        const C1_base = filled.C1 !== undefined ? concToMolPerL(filled.C1, dilUnits.C1.value) : null;
        const V1_base = filled.V1 !== undefined ? dilVolToL(filled.V1, dilUnits.V1.value) : null;
        const C2_base = filled.C2 !== undefined ? concToMolPerL(filled.C2, dilUnits.C2.value) : null;
        const V2_base = filled.V2 !== undefined ? dilVolToL(filled.V2, dilUnits.V2.value) : null;

        let resultBase;

        // C1*V1 = C2*V2 → solve for unknown
        switch (unknown) {
            case 'C1':
                resultBase = (C2_base * V2_base) / V1_base;
                break;
            case 'V1':
                resultBase = (C2_base * V2_base) / C1_base;
                break;
            case 'C2':
                resultBase = (C1_base * V1_base) / V2_base;
                break;
            case 'V2':
                resultBase = (C1_base * V1_base) / C2_base;
                break;
        }

        if (!isFinite(resultBase) || resultBase < 0) {
            showError(dilError, 'Calculation resulted in an invalid value. Check inputs.');
            return;
        }

        // Convert back to user units
        let resultUser;
        if (unknown === 'C1' || unknown === 'C2') {
            resultUser = concFromMolPerL(resultBase, dilUnits[unknown].value);
        } else {
            resultUser = dilVolFromL(resultBase, dilUnits[unknown].value);
        }

        // Set calculated value
        dilInputs[unknown].value = fmt(resultUser);
        dilInputs[unknown].classList.add('dil-input--calculated');

        // Get final base values for display
        const finalC1 = unknown === 'C1' ? resultBase : C1_base;
        const finalV1 = unknown === 'V1' ? resultBase : V1_base;
        const finalC2 = unknown === 'C2' ? resultBase : C2_base;
        const finalV2 = unknown === 'V2' ? resultBase : V2_base;

        // Show result text
        const varLabel = unknown.replace('C', 'C\u0327').replace('1', '\u2081').replace('2', '\u2082')
            .replace('V', 'V').replace('C\u0327', 'C');
        const prettyUnknown = unknown[0] + (unknown[1] === '1' ? '\u2081' : '\u2082');
        const unitLabel = (unknown === 'C1' || unknown === 'C2')
            ? dilUnits[unknown].value
            : dilUnits[unknown].value;

        dilResultText.innerHTML = `<strong>${prettyUnknown} = ${fmt(resultUser)} ${unitLabel}</strong>`;
        dilResult.style.display = '';

        // Draw beakers
        dilBeakers.style.display = '';
        const maxConc = Math.max(finalC1, finalC2) || 1;
        const maxVol = Math.max(finalV1, finalV2) || 1;
        drawBeaker(dilBeaker1, finalV1 / maxVol, finalC1 / maxConc);
        drawBeaker(dilBeaker2, finalV2 / maxVol, finalC2 / maxConc);
    }

    // Attach real-time listeners
    for (const v of DIL_VARS) {
        dilInputs[v].addEventListener('input', () => {
            dilInputs[v].classList.remove('dil-input--calculated');
            dilAutoSolve();
        });
        dilUnits[v].addEventListener('change', () => {
            dilInputs[v].classList.remove('dil-input--calculated');
            dilAutoSolve();
        });

        // Click on calculated input to clear it
        dilInputs[v].addEventListener('focus', () => {
            if (dilInputs[v].classList.contains('dil-input--calculated')) {
                dilInputs[v].value = '';
                dilInputs[v].classList.remove('dil-input--calculated');
                dilResult.style.display = 'none';
                dilBeakers.style.display = 'none';
            }
        });
    }

    // Focus first input
    requestAnimationFrame(() => massInput.focus());
}
