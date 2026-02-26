/* ===================================================
   Chemify — Formula Parser (ES Module)
   Recursive descent parser for chemical formulas.
   Handles elements, parentheses, hydrates (·), and
   nested groups.
   =================================================== */

// All 118 valid element symbols
const VALID_ELEMENTS = new Set([
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
    'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
    'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd',
    'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
    'Cs', 'Ba',
    'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',
    'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
    'Fr', 'Ra',
    'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
    'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'
]);

/**
 * Returns a Set of all 118 valid element symbols.
 * @returns {Set<string>}
 */
export function getElementSymbols() {
    return new Set(VALID_ELEMENTS);
}

/**
 * Merge atom counts from `source` into `target`, multiplied by `multiplier`.
 */
function mergeInto(target, source, multiplier = 1) {
    for (const [el, count] of Object.entries(source)) {
        target[el] = (target[el] || 0) + count * multiplier;
    }
}

/**
 * Parse a chemical formula string into an object mapping element symbols
 * to atom counts. Returns null if the formula is invalid.
 *
 * Handles:
 *   - Simple formulas: "H2O", "NaCl"
 *   - Parenthetical groups: "Ca(OH)2", "Fe2(SO4)3"
 *   - Hydrate notation: "CuSO4·5H2O" (splits on · or .)
 *   - Nested parentheses
 *
 * @param {string} formula
 * @returns {Object<string, number> | null}
 */
export function parseFormula(formula) {
    if (!formula || typeof formula !== 'string') return null;

    // Trim whitespace
    formula = formula.trim();
    if (formula.length === 0) return null;

    // Step 1: Handle hydrates — split on · (middle dot) or centered dot
    // The · character can be U+00B7 (middle dot) or U+22C5 (dot operator)
    const hydrateParts = formula.split(/[·\u00B7\u22C5]/);

    const result = {};

    for (let partIdx = 0; partIdx < hydrateParts.length; partIdx++) {
        let part = hydrateParts[partIdx].trim();
        if (part.length === 0) return null;

        // Check for leading coefficient (e.g., "5H2O" in hydrate)
        let coeff = 1;
        let coeffMatch = part.match(/^(\d+)/);
        if (coeffMatch && partIdx > 0) {
            // Only strip leading coefficient for hydrate parts (not the first part)
            coeff = parseInt(coeffMatch[1], 10);
            part = part.slice(coeffMatch[0].length);
            if (part.length === 0) return null;
        }

        // Step 2: Recursive descent parse
        let pos = 0;

        function parseGroup() {
            const atoms = {};

            while (pos < part.length) {
                if (part[pos] === '(') {
                    // Open parenthesis → recurse
                    pos++; // skip '('
                    const inner = parseGroup();
                    if (inner === null) return null;

                    // Expect closing ')'
                    if (pos >= part.length || part[pos] !== ')') return null;
                    pos++; // skip ')'

                    // Read optional multiplier after ')'
                    let mult = readNumber();

                    mergeInto(atoms, inner, mult);
                } else if (part[pos] === ')') {
                    // Closing paren — return to caller
                    break;
                } else if (part[pos] >= 'A' && part[pos] <= 'Z') {
                    // Read element symbol: uppercase + optional lowercase
                    let symbol = part[pos];
                    pos++;
                    while (pos < part.length && part[pos] >= 'a' && part[pos] <= 'z') {
                        symbol += part[pos];
                        pos++;
                    }

                    // Validate element
                    if (!VALID_ELEMENTS.has(symbol)) return null;

                    // Read optional count
                    let count = readNumber();

                    atoms[symbol] = (atoms[symbol] || 0) + count;
                } else {
                    // Invalid character
                    return null;
                }
            }

            return atoms;
        }

        function readNumber() {
            let numStr = '';
            while (pos < part.length && part[pos] >= '0' && part[pos] <= '9') {
                numStr += part[pos];
                pos++;
            }
            return numStr.length > 0 ? parseInt(numStr, 10) : 1;
        }

        const parsed = parseGroup();
        if (parsed === null) return null;

        // Ensure we consumed the entire part
        if (pos !== part.length) return null;

        mergeInto(result, parsed, coeff);
    }

    // Return null if empty result
    if (Object.keys(result).length === 0) return null;

    return result;
}

/**
 * Validate a chemical formula string.
 * Returns { valid: boolean, error: string | null }.
 *
 * Specific error messages:
 *   - "Empty formula"
 *   - "Unknown element: Xx"
 *   - "Mismatched parentheses"
 *   - "Invalid character: @"
 *
 * @param {string} formula
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateFormula(formula) {
    if (!formula || typeof formula !== 'string' || formula.trim().length === 0) {
        return { valid: false, error: 'Empty formula' };
    }

    formula = formula.trim();

    // Split on hydrate dot
    const hydrateParts = formula.split(/[·\u00B7\u22C5]/);

    for (let partIdx = 0; partIdx < hydrateParts.length; partIdx++) {
        let part = hydrateParts[partIdx].trim();
        if (part.length === 0) {
            return { valid: false, error: 'Empty formula' };
        }

        // Strip leading coefficient for hydrate parts
        if (partIdx > 0) {
            part = part.replace(/^\d+/, '');
            if (part.length === 0) {
                return { valid: false, error: 'Empty formula' };
            }
        }

        // Check for invalid characters
        for (let i = 0; i < part.length; i++) {
            const ch = part[i];
            if (
                !(ch >= 'A' && ch <= 'Z') &&
                !(ch >= 'a' && ch <= 'z') &&
                !(ch >= '0' && ch <= '9') &&
                ch !== '(' && ch !== ')'
            ) {
                return { valid: false, error: `Invalid character: ${ch}` };
            }
        }

        // Check parentheses balance
        let depth = 0;
        for (let i = 0; i < part.length; i++) {
            if (part[i] === '(') depth++;
            if (part[i] === ')') depth--;
            if (depth < 0) {
                return { valid: false, error: 'Mismatched parentheses' };
            }
        }
        if (depth !== 0) {
            return { valid: false, error: 'Mismatched parentheses' };
        }

        // Check element symbols
        let pos = 0;
        while (pos < part.length) {
            if (part[pos] >= 'A' && part[pos] <= 'Z') {
                let symbol = part[pos];
                pos++;
                while (pos < part.length && part[pos] >= 'a' && part[pos] <= 'z') {
                    symbol += part[pos];
                    pos++;
                }
                if (!VALID_ELEMENTS.has(symbol)) {
                    return { valid: false, error: `Unknown element: ${symbol}` };
                }
                // Skip digits after element
                while (pos < part.length && part[pos] >= '0' && part[pos] <= '9') {
                    pos++;
                }
            } else if (part[pos] === '(' || part[pos] === ')') {
                pos++;
                // Skip digits after ')'
                if (part[pos - 1] === ')') {
                    while (pos < part.length && part[pos] >= '0' && part[pos] <= '9') {
                        pos++;
                    }
                }
            } else if (part[pos] >= '0' && part[pos] <= '9') {
                pos++;
            } else {
                return { valid: false, error: `Invalid character: ${part[pos]}` };
            }
        }
    }

    return { valid: true, error: null };
}


/* ===================================================
   Test Cases (15)
   =================================================== */

// 1.  parseFormula("H2O")           → { H: 2, O: 1 }
// 2.  parseFormula("NaCl")          → { Na: 1, Cl: 1 }
// 3.  parseFormula("Ca(OH)2")       → { Ca: 1, O: 2, H: 2 }
// 4.  parseFormula("Fe2(SO4)3")     → { Fe: 2, S: 3, O: 12 }
// 5.  parseFormula("Al2(SO4)3")     → { Al: 2, S: 3, O: 12 }
// 6.  parseFormula("Mg(NO3)2")      → { Mg: 1, N: 2, O: 6 }
// 7.  parseFormula("CuSO4·5H2O")   → { Cu: 1, S: 1, O: 9, H: 10 }
// 8.  parseFormula("C6H12O6")       → { C: 6, H: 12, O: 6 }
// 9.  parseFormula("K2Cr2O7")       → { K: 2, Cr: 2, O: 7 }
// 10. parseFormula("NH4NO3")        → { N: 2, H: 4, O: 3 }
// 11. parseFormula("")              → null
// 12. parseFormula("Xx")            → null  (unknown element)
// 13. parseFormula("Ca(OH")         → null  (mismatched parentheses)
// 14. parseFormula("H@O")           → null  (invalid character)
// 15. validateFormula("Fe2(SO4)3")  → { valid: true, error: null }
//     validateFormula("")            → { valid: false, error: "Empty formula" }
//     validateFormula("Xx")          → { valid: false, error: "Unknown element: Xx" }
//     validateFormula("Ca(OH")       → { valid: false, error: "Mismatched parentheses" }
//     validateFormula("H@O")         → { valid: false, error: "Invalid character: @" }
