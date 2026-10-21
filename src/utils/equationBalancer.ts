import { parseFormula } from './formulaParser';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return (Math.abs(a) / gcd(a, b)) * Math.abs(b);
}

function normaliseFormula(s: string): string {
  return s
    .replace(/[\u2080-\u2089]/g, ch => String(ch.charCodeAt(0) - 0x2080))
    .trim();
}

export interface ParsedEquation {
  reactants: string[];
  products: string[];
}

export function parseEquationInput(input: string): ParsedEquation | null {
  if (!input) return null;
  const sep = input
    .replace(/\u2192/g, '->')
    .replace(/\u27F6/g, '->')
    .replace(/==/g, '->')
    .replace(/(?<![->])=(?!=)/g, '->');

  const parts = sep.split('->');
  if (parts.length !== 2) return null;

  const left = parts[0].split('+').map(normaliseFormula).filter(Boolean);
  const right = parts[1].split('+').map(normaliseFormula).filter(Boolean);

  if (left.length === 0 || right.length === 0) return null;
  return { reactants: left, products: right };
}

export interface BalanceResult {
  reactants: string[];
  products: string[];
  coefficients: number[];
  reactantsCoeffs: number[];
  productsCoeffs: number[];
  reactionType: string;
  formattedEquation: string;
  atomBalance: { element: string; reactantCount: number; productCount: number }[];
}

export function balanceChemicalEquation(
  reactantFormulas: string[],
  productFormulas: string[]
): BalanceResult | null {
  const allFormulas = reactantFormulas.concat(productFormulas);
  const n = allFormulas.length;
  const nR = reactantFormulas.length;

  const parsed = allFormulas.map(f => parseFormula(f));
  if (parsed.some(p => p === null)) return null;

  const elemSet = new Set<string>();
  parsed.forEach(p => {
    if (p) {
      Object.keys(p).forEach(el => elemSet.add(el));
    }
  });

  const elements = Array.from(elemSet);
  const m = elements.length;

  const A: number[][] = [];
  for (let i = 0; i < m; i++) {
    A[i] = [];
    for (let j = 0; j < n; j++) {
      const count = parsed[j]?.[elements[i]] || 0;
      A[i][j] = j < nR ? count : -count;
    }
  }

  const rows = m;
  const cols = n;
  const M: number[][] = [];
  for (let i = 0; i < rows; i++) {
    M[i] = [];
    for (let j = 0; j < cols; j++) {
      M[i][j] = A[i][j];
    }
  }

  let pivotRow = 0;
  const pivotCols: number[] = [];

  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let maxVal = Math.abs(M[pivotRow][col]);
    let maxIdx = pivotRow;
    for (let i = pivotRow + 1; i < rows; i++) {
      if (Math.abs(M[i][col]) > maxVal) {
        maxVal = Math.abs(M[i][col]);
        maxIdx = i;
      }
    }

    if (maxVal < 1e-10) continue;

    if (maxIdx !== pivotRow) {
      const tmp = M[pivotRow];
      M[pivotRow] = M[maxIdx];
      M[maxIdx] = tmp;
    }

    pivotCols.push(col);

    const pivotVal = M[pivotRow][col];
    for (let i = 0; i < rows; i++) {
      if (i === pivotRow) continue;
      const factor = M[i][col] / pivotVal;
      if (Math.abs(factor) < 1e-12) continue;
      for (let j = col; j < cols; j++) {
        M[i][j] -= factor * M[pivotRow][j];
      }
      M[i][col] = 0;
    }

    pivotRow++;
  }

  const pivotSet = new Set(pivotCols);
  const freeVars: number[] = [];
  for (let j = 0; j < cols; j++) {
    if (!pivotSet.has(j)) freeVars.push(j);
  }

  if (freeVars.length === 0) return null;
  const freeCol = freeVars[0];

  const x: number[] = new Array(cols).fill(0);
  x[freeCol] = 1;

  for (let i = pivotCols.length - 1; i >= 0; i--) {
    const pc = pivotCols[i];
    let sum = 0;
    for (let j = 0; j < cols; j++) {
      if (j !== pc) sum += M[i][j] * x[j];
    }
    x[pc] = -sum / M[i][pc];
  }

  if (x.some(v => v < -1e-10)) {
    for (let i = 0; i < cols; i++) x[i] = -x[i];
  }

  if (x.some(v => v < 1e-10)) return null;

  const EPS = 1e-6;
  function toRational(val: number): { n: number; d: number } {
    for (let d = 1; d <= 10000; d++) {
      const num = Math.round(val * d);
      if (Math.abs(val - num / d) < EPS) {
        return { n: num, d };
      }
    }
    return { n: Math.round(val), d: 1 };
  }

  const rationals = x.map(toRational);
  const commonDen = rationals.reduce((acc, r) => lcm(acc, r.d), 1);
  let intCoeffs = rationals.map(r => Math.round((r.n * commonDen) / r.d));

  const g = intCoeffs.reduce((acc, v) => gcd(acc, v), intCoeffs[0]);
  if (g > 1) {
    intCoeffs = intCoeffs.map(v => v / g);
  }

  const reactantsCoeffs = intCoeffs.slice(0, nR);
  const productsCoeffs = intCoeffs.slice(nR);

  // Reaction type
  let reactionType = 'Single Displacement';
  if (reactantFormulas.length === 1 && productFormulas.length > 1) {
    reactionType = 'Decomposition';
  } else if (reactantFormulas.length > 1 && productFormulas.length === 1) {
    reactionType = 'Synthesis';
  } else if (
    reactantFormulas.some(r => r === 'O2') &&
    productFormulas.some(p => p.includes('CO2') || p.includes('H2O'))
  ) {
    reactionType = 'Combustion';
  } else if (reactantFormulas.length === 2 && productFormulas.length === 2) {
    reactionType = 'Double Displacement';
  }

  // Format equation
  const formatSide = (formulas: string[], coeffs: number[]) => {
    return formulas
      .map((f, i) => {
        const c = coeffs[i] > 1 ? coeffs[i] : '';
        return `${c}${f}`;
      })
      .join(' + ');
  };

  const formattedEquation = `${formatSide(reactantFormulas, reactantsCoeffs)} → ${formatSide(productFormulas, productsCoeffs)}`;

  // Atom balance check
  const atomBalance = elements.map(el => {
    let reactantCount = 0;
    reactantFormulas.forEach((f, idx) => {
      reactantCount += (parsed[idx]?.[el] || 0) * reactantsCoeffs[idx];
    });

    let productCount = 0;
    productFormulas.forEach((f, idx) => {
      productCount += (parsed[nR + idx]?.[el] || 0) * productsCoeffs[idx];
    });

    return { element: el, reactantCount, productCount };
  });

  return {
    reactants: reactantFormulas,
    products: productFormulas,
    coefficients: intCoeffs,
    reactantsCoeffs,
    productsCoeffs,
    reactionType,
    formattedEquation,
    atomBalance
  };
}

