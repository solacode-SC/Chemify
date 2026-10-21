import { ELEMENTS } from '../data/elementsData';

// Map symbol to atomic mass
export const ATOMIC_MASSES: Record<string, number> = {};
ELEMENTS.forEach(el => {
  // Clean atomic mass string e.g. "[294]" -> 294
  const cleaned = el.atomicMass.replace(/[\[\]]/g, '');
  ATOMIC_MASSES[el.symbol] = parseFloat(cleaned) || 0;
});

export const VALID_ELEMENTS = new Set(ELEMENTS.map(e => e.symbol));

export interface ParsedFormula {
  [symbol: string]: number;
}

/**
 * Merge atom counts from `source` into `target`, multiplied by `multiplier`.
 */
function mergeInto(target: ParsedFormula, source: ParsedFormula, multiplier = 1) {
  for (const [el, count] of Object.entries(source)) {
    target[el] = (target[el] || 0) + count * multiplier;
  }
}

/**
 * Parse a chemical formula string into an object mapping element symbols
 * to atom counts. Handles hydrates (· or .), nested parentheses, coefficients.
 */
export function parseFormula(formula: string): ParsedFormula | null {
  if (!formula || typeof formula !== 'string') return null;
  const trimmed = formula.trim();
  if (trimmed.length === 0) return null;

  // Split on hydrate dot · or .
  const hydrateParts = trimmed.split(/[·\u00B7\u22C5]/);
  const result: ParsedFormula = {};

  for (let partIdx = 0; partIdx < hydrateParts.length; partIdx++) {
    let part = hydrateParts[partIdx].trim();
    if (part.length === 0) return null;

    let coeff = 1;
    const coeffMatch = part.match(/^(\d+)/);
    if (coeffMatch && partIdx > 0) {
      coeff = parseInt(coeffMatch[1], 10);
      part = part.slice(coeffMatch[0].length);
      if (part.length === 0) return null;
    }

    let pos = 0;

    function parseGroup(): ParsedFormula | null {
      const atoms: ParsedFormula = {};

      while (pos < part.length) {
        if (part[pos] === '(') {
          pos++; // skip '('
          const inner = parseGroup();
          if (inner === null) return null;

          if (pos >= part.length || part[pos] !== ')') return null;
          pos++; // skip ')'

          const mult = readNumber();
          mergeInto(atoms, inner, mult);
        } else if (part[pos] === ')') {
          break;
        } else if (part[pos] >= 'A' && part[pos] <= 'Z') {
          let symbol = part[pos];
          pos++;
          while (pos < part.length && part[pos] >= 'a' && part[pos] <= 'z') {
            symbol += part[pos];
            pos++;
          }

          if (!VALID_ELEMENTS.has(symbol)) return null;
          const count = readNumber();
          atoms[symbol] = (atoms[symbol] || 0) + count;
        } else {
          return null;
        }
      }

      return atoms;
    }

    function readNumber(): number {
      let numStr = '';
      while (pos < part.length && part[pos] >= '0' && part[pos] <= '9') {
        numStr += part[pos];
        pos++;
      }
      return numStr.length > 0 ? parseInt(numStr, 10) : 1;
    }

    const parsed = parseGroup();
    if (parsed === null || pos !== part.length) return null;

    mergeInto(result, parsed, coeff);
  }

  if (Object.keys(result).length === 0) return null;
  return result;
}

/**
 * Validate formula string with descriptive error.
 */
export function validateFormula(formula: string): { valid: boolean; error: string | null } {
  if (!formula || typeof formula !== 'string' || formula.trim().length === 0) {
    return { valid: false, error: 'Empty formula' };
  }

  const parsed = parseFormula(formula);
  if (!parsed) {
    // Try to isolate why
    let depth = 0;
    for (const ch of formula) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (depth < 0) return { valid: false, error: 'Mismatched parentheses' };
    }
    if (depth !== 0) return { valid: false, error: 'Mismatched parentheses' };

    return { valid: false, error: 'Invalid formula syntax or unrecognized element' };
  }

  return { valid: true, error: null };
}

/**
 * Calculate total molar mass in g/mol from a parsed formula or formula string.
 */
export function calculateMolarMass(formulaOrParsed: string | ParsedFormula): number {
  const parsed = typeof formulaOrParsed === 'string' ? parseFormula(formulaOrParsed) : formulaOrParsed;
  if (!parsed) return 0;

  let total = 0;
  for (const [sym, count] of Object.entries(parsed)) {
    const mass = ATOMIC_MASSES[sym] || 0;
    total += mass * count;
  }
  return total;
}

/**
 * Get detailed elemental breakdown: symbol, count, mass, percentage.
 */
export interface ElementBreakdownItem {
  symbol: string;
  name: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  percentage: number;
}

export function getElementBreakdown(formula: string): ElementBreakdownItem[] | null {
  const parsed = parseFormula(formula);
  if (!parsed) return null;

  const totalMass = calculateMolarMass(parsed);
  if (totalMass <= 0) return null;

  const breakdown: ElementBreakdownItem[] = [];

  for (const [sym, count] of Object.entries(parsed)) {
    const el = ELEMENTS.find(e => e.symbol === sym);
    const atomicMass = ATOMIC_MASSES[sym] || 0;
    const itemTotal = atomicMass * count;
    const percentage = (itemTotal / totalMass) * 100;

    breakdown.push({
      symbol: sym,
      name: el ? el.name : sym,
      count,
      atomicMass,
      totalMass: itemTotal,
      percentage
    });
  }

  // Sort descending by mass percentage
  return breakdown.sort((a, b) => b.percentage - a.percentage);
}

/**
 * Format formula string to pretty HTML/JSX with subscripts (e.g. H₂O or <sub>2</sub>).
 */
export function formatChemicalFormula(formula: string): string {
  // Convert digits after letters or parentheses to subscript characters: 0-9 -> ₀-₉
  const subscripts: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };

  return formula.replace(/(?<=[A-Za-z\)])\d+/g, match => {
    return match.split('').map(d => subscripts[d] || d).join('');
  });
}

