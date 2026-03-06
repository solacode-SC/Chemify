// =============================================================================
// pH & pOH Calculator (ES Module)
// Renders inside the shared tool modal body.
// =============================================================================

export function initPHCalculator(container) {
    container.innerHTML = `
    <div class="ph-tool">

      <!-- Mode Toggle -->
      <div class="tool-seg-control">
        <button class="tool-seg-btn active" data-mode="strong">Strong Acid / Base</button>
        <button class="tool-seg-btn" data-mode="weak">Weak Acid / Base</button>
      </div>

      <!-- Strong Mode -->
      <div class="ph-mode" id="phStrongMode">
        <div class="ph-type-toggle">
          <button class="ph-type-btn active" data-type="acid">Acid</button>
          <button class="ph-type-btn" data-type="base">Base</button>
        </div>
        <label class="mm-label">Concentration (mol/L)</label>
        <div class="mm-input-wrap">
          <input type="number" class="mm-input" id="phStrongConc"
                 placeholder="e.g. 0.01" min="0" step="any" />
        </div>
        <div class="ph-formula-hint" id="phStrongHint">
          pH = &minus;log([H&sup1;])
        </div>
        <button class="mm-calculate-btn" id="phStrongCalcBtn">Calculate pH</button>
      </div>

      <!-- Weak Mode -->
      <div class="ph-mode" id="phWeakMode" style="display:none">
        <div class="ph-type-toggle">
          <button class="ph-type-btn active" data-type="acid">Weak Acid</button>
          <button class="ph-type-btn" data-type="base">Weak Base</button>
        </div>
        <div class="ph-weak-inputs">
          <div>
            <label class="mm-label">Concentration C (mol/L)</label>
            <input type="number" class="mm-input" id="phWeakConc"
                   placeholder="e.g. 0.1" min="0" step="any" />
          </div>
          <div class="ph-weak-ka-group">
            <label class="mm-label">
              <span id="phWeakKaLabelText">Ka (acid dissociation constant)</span>
              <span class="ph-tooltip" id="phWeakKaTooltip" title="Ka measures acid strength. e.g. acetic acid Ka = 1.8e-5">?</span>
            </label>
            <input type="number" class="mm-input" id="phWeakKa"
                   placeholder="e.g. 1.8e-5" min="0" step="any" />
          </div>
        </div>
        <button class="mm-calculate-btn ph-weak-calc-btn" id="phWeakCalcBtn">Calculate pH</button>
      </div>

      <!-- Error message -->
      <div class="ph-error" id="phError"></div>

      <!-- Results -->
      <div class="ph-results" id="phResults" style="display:none">

        <!-- pH Scale Visual -->
        <div class="ph-scale-wrap">
          <div class="ph-scale-bar">
            <div class="ph-scale-marker" id="phScaleMarker">
              <span class="ph-scale-marker-value" id="phScaleValue">7.0</span>
            </div>
          </div>
          <div class="ph-scale-labels">
            <span>0</span><span>2</span><span>4</span><span>6</span>
            <span>7</span><span>8</span><span>10</span><span>12</span><span>14</span>
          </div>
        </div>

        <!-- Result values grid -->
        <div class="ph-result-grid">
          <div class="ph-result-card" id="phCard">
            <div class="ph-result-label">pH</div>
            <div class="ph-result-val" id="phVal">&mdash;</div>
          </div>
          <div class="ph-result-card" id="pohCard">
            <div class="ph-result-label">pOH</div>
            <div class="ph-result-val" id="pohVal">&mdash;</div>
          </div>
          <div class="ph-result-card">
            <div class="ph-result-label">[H&#x207A;] mol/L</div>
            <div class="ph-result-val ph-result-val--mono" id="hVal">&mdash;</div>
          </div>
          <div class="ph-result-card">
            <div class="ph-result-label">[OH&#x207B;] mol/L</div>
            <div class="ph-result-val ph-result-val--mono" id="ohVal">&mdash;</div>
          </div>
        </div>

        <!-- Classification badge -->
        <div class="ph-classification-wrap">
          <div class="ph-classification" id="phClassification"></div>
        </div>

        <!-- Weak acid/base extra: dissociation % -->
        <div class="ph-dissociation" id="phDissociation" style="display:none">
          <span class="ph-dissociation-label">Degree of dissociation</span>
          <span class="ph-dissociation-val" id="phDissociationVal"></span>
        </div>

        <!-- Common substances reference -->
        <details class="ph-reference">
          <summary class="ph-reference-summary">Common pH values reference</summary>
          <table class="ph-ref-table">
            <tbody>
              <tr><td>Stomach acid</td><td>1.5 &ndash; 3.5</td></tr>
              <tr><td>Lemon juice</td><td>2.0 &ndash; 3.0</td></tr>
              <tr><td>Vinegar</td><td>2.5 &ndash; 3.5</td></tr>
              <tr><td>Coffee</td><td>5.0</td></tr>
              <tr><td>Pure water</td><td>7.0</td></tr>
              <tr><td>Blood</td><td>7.35 &ndash; 7.45</td></tr>
              <tr><td>Seawater</td><td>8.0 &ndash; 8.3</td></tr>
              <tr><td>Baking soda</td><td>8.3</td></tr>
              <tr><td>Bleach</td><td>12.0 &ndash; 13.0</td></tr>
              <tr><td>NaOH (0.1 M)</td><td>13.0</td></tr>
            </tbody>
          </table>
        </details>

      </div>
    </div>
  `;

    // =========================================================================
    // State
    // =========================================================================
    let currentMode = 'strong'; // 'strong' | 'weak'
    let strongType = 'acid';    // 'acid' | 'base'
    let weakType = 'acid';      // 'acid' | 'base'

    // =========================================================================
    // DOM References
    // =========================================================================
    const modeBtns       = container.querySelectorAll('.tool-seg-btn');
    const strongMode     = container.querySelector('#phStrongMode');
    const weakMode       = container.querySelector('#phWeakMode');

    const strongTypeBtns = strongMode.querySelectorAll('.ph-type-btn');
    const weakTypeBtns   = weakMode.querySelectorAll('.ph-type-btn');

    const strongConc     = container.querySelector('#phStrongConc');
    const strongHint     = container.querySelector('#phStrongHint');
    const strongCalcBtn  = container.querySelector('#phStrongCalcBtn');

    const weakConc       = container.querySelector('#phWeakConc');
    const weakKa         = container.querySelector('#phWeakKa');
    const weakKaLabel    = container.querySelector('#phWeakKaLabelText');
    const weakKaTooltip  = container.querySelector('#phWeakKaTooltip');
    const weakCalcBtn    = container.querySelector('#phWeakCalcBtn');

    const errorDiv       = container.querySelector('#phError');
    const resultsArea    = container.querySelector('#phResults');
    const scaleMarker    = container.querySelector('#phScaleMarker');
    const scaleValue     = container.querySelector('#phScaleValue');
    const phVal          = container.querySelector('#phVal');
    const pohVal         = container.querySelector('#pohVal');
    const hVal           = container.querySelector('#hVal');
    const ohVal          = container.querySelector('#ohVal');
    const classification = container.querySelector('#phClassification');
    const dissociation   = container.querySelector('#phDissociation');
    const dissociationVal = container.querySelector('#phDissociationVal');

    // =========================================================================
    // Helpers
    // =========================================================================

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        setTimeout(function () { errorDiv.style.display = 'none'; }, 3000);
    }

    function formatConc(val) {
        if (val === 0) return '0';
        if (val < 0.001 || val > 1e6) return val.toExponential(3);
        if (val < 0.01) return val.toExponential(2);
        return val.toPrecision(4);
    }

    function classifyPH(pH) {
        if (pH < 3)    return { label: 'Strong Acid',   color: '#dc2626' };
        if (pH < 6)    return { label: 'Weak Acid',     color: '#ea580c' };
        if (pH < 6.5)  return { label: 'Mildly Acidic', color: '#ca8a04' };
        if (pH <= 7.5) return { label: 'Neutral',       color: '#16a34a' };
        if (pH <= 9)   return { label: 'Mildly Basic',  color: '#0891b2' };
        if (pH <= 11)  return { label: 'Weak Base',     color: '#2563eb' };
        return { label: 'Strong Base', color: '#7c3aed' };
    }

    // =========================================================================
    // Mode & Type Toggles
    // =========================================================================

    modeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            modeBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            strongMode.style.display = currentMode === 'strong' ? 'block' : 'none';
            weakMode.style.display   = currentMode === 'weak'   ? 'block' : 'none';
            resultsArea.style.display = 'none';
        });
    });

    strongTypeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            strongTypeBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            strongType = btn.dataset.type;
            strongHint.textContent = strongType === 'acid'
                ? 'pH = \u2212log([H\u207A])'
                : 'pOH = \u2212log([OH\u207B])';
            resultsArea.style.display = 'none';
        });
    });

    weakTypeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            weakTypeBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            weakType = btn.dataset.type;
            if (weakType === 'acid') {
                weakKaLabel.textContent = 'Ka (acid dissociation constant)';
                weakKaTooltip.title = 'Ka measures acid strength. e.g. acetic acid Ka = 1.8\u00D710\u207B\u2075';
            } else {
                weakKaLabel.textContent = 'Kb (base dissociation constant)';
                weakKaTooltip.title = 'Kb measures base strength. e.g. ammonia Kb = 1.8\u00D710\u207B\u2075';
            }
            resultsArea.style.display = 'none';
        });
    });

    // =========================================================================
    // Display Results
    // =========================================================================

    function displayResults(pH, pOH, h, oh, dissoc) {
        var clampedPH = Math.max(0, Math.min(14, pH));

        phVal.textContent  = pH.toFixed(2);
        pohVal.textContent = pOH.toFixed(2);
        hVal.textContent   = formatConc(h);
        ohVal.textContent  = formatConc(oh);

        // Position the marker on the pH scale bar
        scaleMarker.style.left = (clampedPH / 14 * 100) + '%';
        scaleValue.textContent  = pH.toFixed(1);

        // Classification badge
        var classInfo = classifyPH(pH);
        classification.textContent = classInfo.label;
        classification.style.backgroundColor = classInfo.color;

        // Dissociation (weak mode only)
        if (dissoc !== undefined) {
            dissociation.style.display = 'flex';
            dissociationVal.textContent = dissoc.toFixed(2) + '%';
        } else {
            dissociation.style.display = 'none';
        }

        resultsArea.style.display = 'block';
    }

    // =========================================================================
    // Calculate: Strong Acid / Base
    // =========================================================================

    strongCalcBtn.addEventListener('click', function () {
        var C = parseFloat(strongConc.value);
        if (isNaN(C) || C <= 0) {
            showError('Please enter a positive concentration value.');
            return;
        }

        var pH, pOH, h, oh;

        if (strongType === 'acid') {
            h   = C;
            pH  = -Math.log10(h);
            pOH = 14 - pH;
            oh  = Math.pow(10, -pOH);
        } else {
            oh  = C;
            pOH = -Math.log10(oh);
            pH  = 14 - pOH;
            h   = Math.pow(10, -pH);
        }

        displayResults(pH, pOH, h, oh);
    });

    // Enter key shortcut for strong mode
    strongConc.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') strongCalcBtn.click();
    });

    // =========================================================================
    // Calculate: Weak Acid / Base
    // =========================================================================

    weakCalcBtn.addEventListener('click', function () {
        var C = parseFloat(weakConc.value);
        var K = parseFloat(weakKa.value);

        if (isNaN(C) || C <= 0) {
            showError('Please enter a positive concentration value.');
            return;
        }
        if (isNaN(K) || K <= 0) {
            showError(weakType === 'acid'
                ? 'Please enter a valid Ka value.'
                : 'Please enter a valid Kb value.');
            return;
        }

        // Solve: x^2 + K*x - K*C = 0  =>  x = (-K + sqrt(K^2 + 4KC)) / 2
        var discriminant = K * K + 4 * K * C;
        var x     = (-K + Math.sqrt(discriminant)) / 2;
        var dissoc = (x / C) * 100;

        var pH, pOH, h, oh;

        if (weakType === 'acid') {
            h   = x;
            pH  = -Math.log10(h);
            pOH = 14 - pH;
            oh  = Math.pow(10, -pOH);
        } else {
            oh  = x;
            pOH = -Math.log10(oh);
            pH  = 14 - pOH;
            h   = Math.pow(10, -pH);
        }

        displayResults(pH, pOH, h, oh, dissoc);
    });

    // Enter key shortcuts for weak mode
    weakConc.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') weakCalcBtn.click();
    });
    weakKa.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') weakCalcBtn.click();
    });
}
