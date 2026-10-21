import { ATOMIC_MASSES, parseFormula } from './formulaParser';

// ==========================================
// 1. pH & pOH Calculator
// ==========================================
export interface PHResult {
  pH: number;
  pOH: number;
  hConcentration: number;
  ohConcentration: number;
  classification: 'Strongly Acidic' | 'Weakly Acidic' | 'Neutral' | 'Weakly Basic' | 'Strongly Basic';
  benchmark: string;
}

export function calculatePHFromAny(
  type: 'pH' | 'pOH' | 'H' | 'OH',
  value: number
): PHResult | null {
  if (value <= 0 && (type === 'H' || type === 'OH')) return null;

  let pH = 7;
  if (type === 'pH') {
    pH = value;
  } else if (type === 'pOH') {
    pH = 14 - value;
  } else if (type === 'H') {
    pH = -Math.log10(value);
  } else if (type === 'OH') {
    const pOH = -Math.log10(value);
    pH = 14 - pOH;
  }

  // Clamp pH within sensible bounds for UI
  const pOH = 14 - pH;
  const hConcentration = Math.pow(10, -pH);
  const ohConcentration = Math.pow(10, -pOH);

  let classification: PHResult['classification'] = 'Neutral';
  let benchmark = 'Pure Water (pH 7.0)';

  if (pH < 3) {
    classification = 'Strongly Acidic';
    benchmark = 'Stomach Acid / Battery Acid (pH ~1.5 - 2.0)';
  } else if (pH < 6.5) {
    classification = 'Weakly Acidic';
    benchmark = 'Coffee / Tomato Juice (pH ~4.5 - 5.0)';
  } else if (pH <= 7.5) {
    classification = 'Neutral';
    benchmark = 'Pure Water / Human Blood (pH ~7.0 - 7.4)';
  } else if (pH <= 11) {
    classification = 'Weakly Basic';
    benchmark = 'Baking Soda / Sea Water (pH ~8.2 - 9.0)';
  } else {
    classification = 'Strongly Basic';
    benchmark = 'Household Bleach / Liquid Drain Cleaner (pH ~12.5 - 13.5)';
  }

  return {
    pH: parseFloat(pH.toFixed(4)),
    pOH: parseFloat(pOH.toFixed(4)),
    hConcentration,
    ohConcentration,
    classification,
    benchmark
  };
}

// ==========================================
// 2. Molarity & Dilution Calculator
// ==========================================
export function calculateMolarity(massGrams: number, molarMass: number, volumeLiters: number): number {
  if (molarMass <= 0 || volumeLiters <= 0) return 0;
  const moles = massGrams / molarMass;
  return moles / volumeLiters;
}

export function calculateDilution(
  m1: number,
  v1: number,
  m2: number,
  v2: number,
  solveFor: 'M1' | 'V1' | 'M2' | 'V2'
): number {
  // M1 * V1 = M2 * V2
  switch (solveFor) {
    case 'M1':
      return v1 > 0 ? (m2 * v2) / v1 : 0;
    case 'V1':
      return m1 > 0 ? (m2 * v2) / m1 : 0;
    case 'M2':
      return v2 > 0 ? (m1 * v1) / v2 : 0;
    case 'V2':
      return m2 > 0 ? (m1 * v1) / m2 : 0;
  }
}

// ==========================================
// 3. Gibbs Free Energy (ΔG = ΔH - TΔS)
// ==========================================
export interface GibbsResult {
  deltaG: number; // in kJ/mol
  isSpontaneous: boolean;
  equilibriumTempKelvin?: number;
  explanation: string;
}

export function calculateGibbs(
  deltaH_kJ: number,
  deltaS_J_K: number,
  tempKelvin: number
): GibbsResult {
  // ΔS in J/(mol·K) -> convert to kJ/(mol·K) by dividing by 1000
  const deltaS_kJ = deltaS_J_K / 1000;
  const deltaG = deltaH_kJ - tempKelvin * deltaS_kJ;
  const isSpontaneous = deltaG < 0;

  let explanation = '';
  if (deltaG < 0) {
    explanation = 'Reaction is thermodynamically spontaneous at this temperature (exergonic).';
  } else if (deltaG === 0) {
    explanation = 'Reaction is at dynamic equilibrium (ΔG = 0).';
  } else {
    explanation = 'Reaction is non-spontaneous at this temperature (endergonic). Reverse reaction is spontaneous.';
  }

  let equilibriumTempKelvin: number | undefined;
  if (deltaS_kJ !== 0) {
    const teq = deltaH_kJ / deltaS_kJ;
    if (teq > 0) equilibriumTempKelvin = parseFloat(teq.toFixed(2));
  }

  return {
    deltaG: parseFloat(deltaG.toFixed(3)),
    isSpontaneous,
    equilibriumTempKelvin,
    explanation
  };
}

// ==========================================
// 4. Ideal Gas Law (PV = nRT)
// R = 0.08206 L·atm/(mol·K)
// ==========================================
const R_ATM = 0.082057;

export function solveIdealGas(
  solveFor: 'P' | 'V' | 'n' | 'T',
  P_atm?: number,
  V_L?: number,
  n_mol?: number,
  T_K?: number
): number {
  switch (solveFor) {
    case 'P':
      return V_L && V_L > 0 && n_mol !== undefined && T_K !== undefined
        ? (n_mol * R_ATM * T_K) / V_L
        : 0;
    case 'V':
      return P_atm && P_atm > 0 && n_mol !== undefined && T_K !== undefined
        ? (n_mol * R_ATM * T_K) / P_atm
        : 0;
    case 'n':
      return T_K && T_K > 0 && P_atm !== undefined && V_L !== undefined
        ? (P_atm * V_L) / (R_ATM * T_K)
        : 0;
    case 'T':
      return n_mol && n_mol > 0 && P_atm !== undefined && V_L !== undefined
        ? (P_atm * V_L) / (n_mol * R_ATM)
        : 0;
  }
}

// ==========================================
// 5. Empirical Formula Finder
// ==========================================
export interface ElementInput {
  symbol: string;
  amount: number; // percentage or grams
}

export interface EmpiricalResult {
  formula: string;
  moles: { symbol: string; moles: number; ratio: number }[];
}

export function calculateEmpiricalFormula(elements: ElementInput[]): EmpiricalResult | null {
  if (elements.length === 0) return null;

  const valid = elements.filter(e => e.symbol && e.amount > 0 && ATOMIC_MASSES[e.symbol]);
  if (valid.length === 0) return null;

  // Convert amounts to moles
  const molesData = valid.map(e => {
    const mw = ATOMIC_MASSES[e.symbol] || 1;
    return {
      symbol: e.symbol,
      moles: e.amount / mw
    };
  });

  const minMoles = Math.min(...molesData.map(m => m.moles));
  if (minMoles <= 0) return null;

  // Calculate raw ratio
  const rawRatios = molesData.map(m => ({
    symbol: m.symbol,
    moles: m.moles,
    rawRatio: m.moles / minMoles
  }));

  // Find multiplier to make all integers (test multipliers 1 to 6)
  let bestMultiplier = 1;
  let minError = 999;

  for (let mult = 1; mult <= 6; mult++) {
    let error = 0;
    for (const r of rawRatios) {
      const val = r.rawRatio * mult;
      error += Math.abs(val - Math.round(val));
    }
    if (error < minError) {
      minError = error;
      bestMultiplier = mult;
    }
  }

  const finalRatios = rawRatios.map(r => ({
    symbol: r.symbol,
    moles: parseFloat(r.moles.toFixed(4)),
    ratio: Math.max(1, Math.round(r.rawRatio * bestMultiplier))
  }));

  const formula = finalRatios
    .map(r => (r.ratio > 1 ? `${r.symbol}${r.ratio}` : r.symbol))
    .join('');

  return { formula, moles: finalRatios };
}

// ==========================================
// 6. Oxidation State Calculator
// ==========================================
export interface OxidationResult {
  symbol: string;
  oxidationState: number;
  reason: string;
}

export function determineOxidationStates(formula: string): OxidationResult[] | null {
  const parsed = parseFormula(formula);
  if (!parsed) return null;

  const symbols = Object.keys(parsed);
  const results: OxidationResult[] = [];

  // Elemental form (only one element, charge 0)
  if (symbols.length === 1) {
    return [
      {
        symbol: symbols[0],
        oxidationState: 0,
        reason: 'Free element in natural/uncombined state always has an oxidation number of 0.'
      }
    ];
  }

  // Common heuristics:
  // F is always -1
  // Group 1 (Li, Na, K, Rb, Cs) is +1
  // Group 2 (Be, Mg, Ca, Sr, Ba) is +2
  // H is usually +1 (except in metal hydrides)
  // O is usually -2 (except in peroxides or with F)
  // Total sum = 0 (neutral molecule)

  const fixedStates: Record<string, number> = {
    F: -1,
    Na: 1,
    K: 1,
    Li: 1,
    Rb: 1,
    Cs: 1,
    Mg: 2,
    Ca: 2,
    Sr: 2,
    Ba: 2,
    Al: 3,
    Zn: 2,
    Ag: 1
  };

  let unknownSymbol: string | null = null;
  let knownSum = 0;

  for (const sym of symbols) {
    if (fixedStates[sym] !== undefined) {
      const st = fixedStates[sym];
      results.push({
        symbol: sym,
        oxidationState: st,
        reason: `Group rule: ${sym} is strictly ${st > 0 ? '+' : ''}${st} in compounds.`
      });
      knownSum += st * parsed[sym];
    } else if (sym === 'H') {
      const st = 1;
      results.push({
        symbol: sym,
        oxidationState: st,
        reason: 'Hydrogen bonded to nonmetals is assigned +1.'
      });
      knownSum += st * parsed[sym];
    } else if (sym === 'O' && symbols.length > 2) {
      // Oxygen in ternary compound
      const st = -2;
      results.push({
        symbol: sym,
        oxidationState: st,
        reason: 'Oxygen in typical oxides is assigned -2.'
      });
      knownSum += st * parsed[sym];
    } else {
      if (!unknownSymbol) {
        unknownSymbol = sym;
      } else {
        // multiple unknowns: fallback
      }
    }
  }

  if (unknownSymbol && parsed[unknownSymbol]) {
    const targetState = -knownSum / parsed[unknownSymbol];
    const rounded = Math.round(targetState);
    results.push({
      symbol: unknownSymbol,
      oxidationState: rounded,
      reason: `Calculated by setting compound charge sum to 0: (${knownSum} + ${parsed[unknownSymbol]}x = 0).`
    });
  } else if (results.length < symbols.length) {
    // Binary compound fallback (e.g. H2O, CO2, NaCl)
    if (symbols.includes('O')) {
      const other = symbols.find(s => s !== 'O')!;
      const oState = -2;
      const otherState = Math.round((2 * parsed['O']) / parsed[other]);
      return [
        { symbol: 'O', oxidationState: -2, reason: 'Oxygen takes -2.' },
        { symbol: other, oxidationState: otherState, reason: `Balances oxygen to net neutral 0.` }
      ];
    }
    if (symbols.includes('H')) {
      const other = symbols.find(s => s !== 'H')!;
      const otherState = Math.round((-1 * parsed['H']) / parsed[other]);
      return [
        { symbol: 'H', oxidationState: 1, reason: 'Hydrogen takes +1.' },
        { symbol: other, oxidationState: otherState, reason: `Balances hydrogen to net neutral 0.` }
      ];
    }
  }

  return results;
}

