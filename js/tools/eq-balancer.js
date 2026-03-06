// =============================================================================
// Chemical Equation Balancer (ES Module)
// Uses Gaussian elimination on the composition matrix to find
// the smallest integer balancing coefficients.
// =============================================================================

import { parseFormula } from '../utils/parser.js';

// =========================================================================
// Subscript helper
// =========================================================================

const SUB = { '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084', '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089' };

function toSubscript(s) {
    return s.replace(/\d/g, function (d) { return SUB[d] || d; });
}

// =========================================================================
// Math helpers
// =========================================================================

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a;
}

function lcm(a, b) {
    return (a / gcd(a, b)) * b;
}

// =========================================================================
// Input parsing
// =========================================================================

/**
 * Normalise Unicode subscripts back to ASCII digits so that
 * parseFormula (which expects plain "H2O") can handle user input
 * like "H₂O".
 */
function normaliseFormula(s) {
    return s
        .replace(/[\u2080-\u2089]/g, function (ch) {
            return String(ch.charCodeAt(0) - 0x2080);
        })
        .trim();
}

/**
 * Split an equation string into { reactants: string[], products: string[] }.
 * Accepts →, ->, ⟶, =, == as separator.  Each side split on '+'.
 */
function parseEquationInput(input) {
    // Normalise various arrow styles to a single token
    var sep = input
        .replace(/\u2192/g, '->')   // →
        .replace(/\u27F6/g, '->')   // ⟶
        .replace(/==/g, '->')
        .replace(/(?<![->])=(?!=)/g, '->');  // bare "=" but not "->" or "=="

    var parts = sep.split('->');
    if (parts.length !== 2) return null;

    var left  = parts[0].split('+').map(function (s) { return normaliseFormula(s); }).filter(Boolean);
    var right = parts[1].split('+').map(function (s) { return normaliseFormula(s); }).filter(Boolean);

    if (left.length === 0 || right.length === 0) return null;
    return { reactants: left, products: right };
}

// =========================================================================
// Gaussian elimination balancer
// =========================================================================

/**
 * Balance a chemical equation.
 *
 * @param {string[]} reactantFormulas  – e.g. ["H2", "O2"]
 * @param {string[]} productFormulas   – e.g. ["H2O"]
 * @returns {{ coefficients: number[] } | null}
 *
 * The returned coefficients array has length = reactants + products
 * and every entry is a positive integer.
 */
function balanceEquation(reactantFormulas, productFormulas) {
    var allFormulas = reactantFormulas.concat(productFormulas);
    var n = allFormulas.length;                    // number of compounds
    var nR = reactantFormulas.length;

    // --- 1. Parse every compound ---
    var parsed = allFormulas.map(function (f) { return parseFormula(f); });
    if (parsed.some(function (p) { return p === null; })) return null;

    // --- 2. Collect unique elements (rows) ---
    var elemSet = {};
    parsed.forEach(function (p) {
        Object.keys(p).forEach(function (el) { elemSet[el] = true; });
    });
    var elements = Object.keys(elemSet);
    var m = elements.length;                       // number of elements

    // --- 3. Build composition matrix  (m × n) ---
    //         Reactant columns are positive, product columns are negative.
    var A = [];
    for (var i = 0; i < m; i++) {
        A[i] = [];
        for (var j = 0; j < n; j++) {
            var count = parsed[j][elements[i]] || 0;
            A[i][j] = j < nR ? count : -count;
        }
    }

    // --- 4. Gaussian elimination with partial pivoting ---
    //         We want to find the null-space vector of A.
    var rows = m;
    var cols = n;

    // Work with rational numbers to avoid floating-point drift.
    // We'll keep a single augmented matrix and do exact integer ops,
    // then extract the null vector at the end.

    // Copy matrix to working copy (use fractions as [num, den])
    // For efficiency we stay in plain floating-point but round at the end.
    var M = [];
    for (i = 0; i < rows; i++) {
        M[i] = [];
        for (j = 0; j < cols; j++) {
            M[i][j] = A[i][j];
        }
    }

    var pivotRow = 0;
    var pivotCols = [];   // which column each pivot row corresponds to

    for (var col = 0; col < cols && pivotRow < rows; col++) {
        // Partial pivoting — find the row with largest absolute value in this column
        var maxVal = Math.abs(M[pivotRow][col]);
        var maxIdx = pivotRow;
        for (i = pivotRow + 1; i < rows; i++) {
            if (Math.abs(M[i][col]) > maxVal) {
                maxVal = Math.abs(M[i][col]);
                maxIdx = i;
            }
        }

        if (maxVal < 1e-10) continue;  // skip zero-column (free variable)

        // Swap rows
        if (maxIdx !== pivotRow) {
            var tmp = M[pivotRow];
            M[pivotRow] = M[maxIdx];
            M[maxIdx] = tmp;
        }

        pivotCols.push(col);

        // Eliminate below and above
        var pivotVal = M[pivotRow][col];
        for (i = 0; i < rows; i++) {
            if (i === pivotRow) continue;
            var factor = M[i][col] / pivotVal;
            if (factor === 0) continue;
            for (j = col; j < cols; j++) {
                M[i][j] -= factor * M[pivotRow][j];
            }
            M[i][col] = 0; // ensure exact zero
        }

        pivotRow++;
    }

    // --- 5. Extract null-space vector ---
    // Free variables are those columns NOT in pivotCols.
    var pivotSet = {};
    pivotCols.forEach(function (c) { pivotSet[c] = true; });
    var freeVars = [];
    for (j = 0; j < cols; j++) {
        if (!pivotSet[j]) freeVars.push(j);
    }

    // For a single balanced equation we expect exactly one free variable.
    // If there are zero free vars the equation cannot be balanced.
    // If there are more than one, we take the first and set it to 1.
    if (freeVars.length === 0) return null;

    var freeCol = freeVars[0];

    // Build solution: set x[freeCol] = 1, solve for pivot variables
    var x = [];
    for (j = 0; j < cols; j++) x[j] = 0;
    x[freeCol] = 1;

    for (i = pivotCols.length - 1; i >= 0; i--) {
        var pc = pivotCols[i];
        // M[i][pc] * x[pc] + ... + M[i][freeCol] * 1 = 0
        var sum = 0;
        for (j = 0; j < cols; j++) {
            if (j !== pc) sum += M[i][j] * x[j];
        }
        x[pc] = -sum / M[i][pc];
    }

    // --- 6. Make all coefficients positive ---
    // If any coefficient is negative, flip all signs.
    var anyNeg = x.some(function (v) { return v < -1e-10; });
    if (anyNeg) {
        x = x.map(function (v) { return -v; });
    }

    // Check for zero or negative values (unsolvable)
    if (x.some(function (v) { return v < 1e-10; })) return null;

    // --- 7. Scale to smallest positive integers ---
    // Round to nearest rational with small denominator, then LCM-scale.
    var EPS = 1e-6;

    // Convert each value to a rational (find denominator up to 1000)
    function toRational(val) {
        for (var d = 1; d <= 10000; d++) {
            var num = Math.round(val * d);
            if (Math.abs(val - num / d) < EPS) {
                return { n: num, d: d };
            }
        }
        return { n: Math.round(val), d: 1 };
    }

    var rationals = x.map(toRational);
    var commonDen = rationals.reduce(function (acc, r) { return lcm(acc, r.d); }, 1);
    var intCoeffs = rationals.map(function (r) { return Math.round((r.n * commonDen) / r.d); });

    // Reduce by GCD of all coefficients
    var g = intCoeffs.reduce(function (acc, v) { return gcd(acc, v); }, intCoeffs[0]);
    if (g > 1) {
        intCoeffs = intCoeffs.map(function (v) { return v / g; });
    }

    return { coefficients: intCoeffs };
}

// =========================================================================
// Reaction type detection
// =========================================================================

function detectReactionType(reactants, products) {
    if (reactants.length === 1 && products.length > 1) return 'Decomposition';
    if (reactants.length > 1 && products.length === 1) return 'Synthesis';
    if (reactants.some(function (r) { return r === 'O2'; }) &&
        products.some(function (p) { return p.indexOf('CO2') !== -1 || p.indexOf('H2O') !== -1; })) {
        return 'Combustion';
    }
    if (reactants.length === 2 && products.length === 2) return 'Double Displacement';
    return 'Single Displacement';
}

// =========================================================================
// Rendering helpers
// =========================================================================

/**
 * Build the pretty balanced equation string with coefficients and subscripts.
 */
function renderBalancedEquation(reactants, products, coefficients) {
    var nR = reactants.length;

    function renderTerm(formula, coeff) {
        var html = '';
        if (coeff > 1) {
            html += '<span class="eq-coeff">' + coeff + '</span>';
        }
        html += '<span class="eq-formula">' + toSubscript(formula) + '</span>';
        return html;
    }

    var lhs = reactants.map(function (f, i) { return renderTerm(f, coefficients[i]); }).join(' <span class="eq-plus">+</span> ');
    var rhs = products.map(function (f, i) { return renderTerm(f, coefficients[nR + i]); }).join(' <span class="eq-plus">+</span> ');

    return lhs + ' <span class="eq-arrow">\u2192</span> ' + rhs;
}

/**
 * Build the atom verification table.
 */
function renderVerificationTable(reactants, products, coefficients) {
    var nR = reactants.length;

    var parsedR = reactants.map(function (f) { return parseFormula(f); });
    var parsedP = products.map(function (f) { return parseFormula(f); });

    // Collect elements
    var elemSet = {};
    parsedR.concat(parsedP).forEach(function (p) {
        Object.keys(p).forEach(function (el) { elemSet[el] = true; });
    });
    var elements = Object.keys(elemSet);

    var html = '<table class="eq-verify-table">';
    html += '<thead><tr><th>Element</th><th>Reactants</th><th>Products</th><th></th></tr></thead>';
    html += '<tbody>';

    elements.forEach(function (el) {
        var rCount = 0;
        parsedR.forEach(function (p, i) { rCount += (p[el] || 0) * coefficients[i]; });
        var pCount = 0;
        parsedP.forEach(function (p, i) { pCount += (p[el] || 0) * coefficients[nR + i]; });

        var match = rCount === pCount;
        html += '<tr>';
        html += '<td class="eq-verify-el">' + el + '</td>';
        html += '<td class="eq-verify-count">' + rCount + '</td>';
        html += '<td class="eq-verify-count">' + pCount + '</td>';
        html += '<td class="eq-verify-status">' + (match ? '<span class="eq-check">\u2713</span>' : '<span class="eq-cross">\u2717</span>') + '</td>';
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

// =========================================================================
// Main init
// =========================================================================

export function initEqBalancer(container) {

    // --- Render HTML ---------------------------------------------------------
    container.innerHTML = '\
    <div class="eq-tool">\
\
      <label class="mm-label">Unbalanced Chemical Equation</label>\
      <div class="eq-input-wrap">\
        <input type="text" class="mm-input eq-input" id="eqInput"\
               placeholder="e.g. H2 + O2 \u2192 H2O" autocomplete="off" spellcheck="false" />\
        <span class="eq-arrow-hint">Use \u2192 or = or -&gt; between reactants and products</span>\
      </div>\
\
      <div class="eq-quick-chips">\
        <span class="mm-chip" data-eq="H2 + O2 -> H2O">H\u2082 + O\u2082 \u2192 H\u2082O</span>\
        <span class="mm-chip" data-eq="Fe + O2 -> Fe2O3">Fe + O\u2082 \u2192 Fe\u2082O\u2083</span>\
        <span class="mm-chip" data-eq="CH4 + O2 -> CO2 + H2O">CH\u2084 + O\u2082 \u2192 CO\u2082 + H\u2082O</span>\
        <span class="mm-chip" data-eq="Al + HCl -> AlCl3 + H2">Al + HCl \u2192 AlCl\u2083 + H\u2082</span>\
        <span class="mm-chip" data-eq="C3H8 + O2 -> CO2 + H2O">C\u2083H\u2088 + O\u2082 \u2192 CO\u2082 + H\u2082O</span>\
        <span class="mm-chip" data-eq="KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2">KMnO\u2084 redox</span>\
      </div>\
\
      <button class="mm-calculate-btn" id="eqBalanceBtn">Balance Equation</button>\
\
      <div class="eq-error" id="eqError"></div>\
\
      <div class="eq-results" id="eqResults" style="display:none">\
        <div class="eq-balanced-display" id="eqBalancedDisplay"></div>\
        <div class="eq-breakdown" id="eqBreakdown"></div>\
        <div class="eq-type-badge-wrap" id="eqTypeBadgeWrap"></div>\
      </div>\
\
    </div>';

    // --- DOM refs -------------------------------------------------------------
    var input       = container.querySelector('#eqInput');
    var balanceBtn  = container.querySelector('#eqBalanceBtn');
    var errorDiv    = container.querySelector('#eqError');
    var resultsArea = container.querySelector('#eqResults');
    var balancedDiv = container.querySelector('#eqBalancedDisplay');
    var breakdownDiv = container.querySelector('#eqBreakdown');
    var typeBadgeWrap = container.querySelector('#eqTypeBadgeWrap');

    // --- Quick chips ----------------------------------------------------------
    container.querySelectorAll('.mm-chip[data-eq]').forEach(function (chip) {
        chip.addEventListener('click', function () {
            input.value = chip.dataset.eq;
            input.focus();
            doBalance();
        });
    });

    // --- Error display --------------------------------------------------------
    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        resultsArea.style.display = 'none';
    }

    function hideError() {
        errorDiv.style.display = 'none';
    }

    // --- Main balance logic ---------------------------------------------------
    function doBalance() {
        hideError();
        resultsArea.style.display = 'none';

        var raw = input.value.trim();
        if (!raw) {
            showError('Please enter a chemical equation.');
            return;
        }

        var eq = parseEquationInput(raw);
        if (!eq) {
            showError('Could not parse equation. Use \u2192, ->, or = to separate reactants and products.');
            return;
        }

        // Validate each formula
        for (var i = 0; i < eq.reactants.length; i++) {
            if (parseFormula(eq.reactants[i]) === null) {
                showError('Invalid reactant formula: ' + eq.reactants[i]);
                return;
            }
        }
        for (var i = 0; i < eq.products.length; i++) {
            if (parseFormula(eq.products[i]) === null) {
                showError('Invalid product formula: ' + eq.products[i]);
                return;
            }
        }

        var result = balanceEquation(eq.reactants, eq.products);
        if (!result) {
            showError('Unable to balance this equation. Check that reactants and products are correct.');
            return;
        }

        // Render balanced equation
        balancedDiv.innerHTML = renderBalancedEquation(eq.reactants, eq.products, result.coefficients);

        // Render verification table
        breakdownDiv.innerHTML = renderVerificationTable(eq.reactants, eq.products, result.coefficients);

        // Reaction type badge
        var rType = detectReactionType(eq.reactants, eq.products);
        typeBadgeWrap.innerHTML = '<span class="eq-type-badge">' + rType + '</span>';

        resultsArea.style.display = 'block';
    }

    // --- Event listeners ------------------------------------------------------
    balanceBtn.addEventListener('click', doBalance);

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doBalance();
    });
}
