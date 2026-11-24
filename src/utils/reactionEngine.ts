import {
  ReactantItem,
  ReactionState,
  ReactantStoichDetail,
  ProductYieldDetail
} from '../types/reaction';
import { calculateMolarMass, parseFormula } from './formulaParser';
import { balanceChemicalEquation } from './equationBalancer';
import { getReagentInfo } from '../data/reagentsData';

export interface ReactionPreset {
  id: string;
  name: string;
  reactants: string[];
  equation: string;
  reactionType: string;
  energyType: 'exothermic' | 'endothermic';
  deltaH: string;
  temperature: string;
  pressure: string;
  catalyst: string;
}

// ==========================================
// Stoichiometric Profile Definitions
// ==========================================
export interface StoichSpecies {
  specKey: string;
  coeff: number;
  formula: string;
  name: string;
}

export interface StoichiometricReactionProfile {
  id: string;
  name: string;
  equation: string;
  reactants: StoichSpecies[];
  products: StoichSpecies[];
  energyType: 'exothermic' | 'endothermic';
  tempBase: number;
  tempPeak: number;
  hasSparks: boolean;
  hasBubbles: boolean;
  hasPrecipitate: boolean;
  colorTheme: string;
  batches: number;
}

export function normalizeFormulaSubscripts(formula: string): string {
  if (!formula) return '';
  const map: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
  };
  return formula.replace(/[₀-₉]/g, m => map[m] || m).trim();
}

export function toSubscriptFormula(formula: string): string {
  const subMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return normalizeFormulaSubscripts(formula).replace(/([A-Za-z\)])(\d+)/g, (_, prefix, digits) => {
    return prefix + digits.split('').map((d: string) => subMap[d] || d).join('');
  });
}

// Canonical casing lookup for user-typed chemical formulas
const CANONICAL_FORMULAS: Record<string, string> = {
  h2: 'H2', o2: 'O2', n2: 'N2', cl2: 'Cl2', f2: 'F2', br2: 'Br2', i2: 'I2',
  h2o: 'H2O', h2o2: 'H2O2', co2: 'CO2', co: 'CO', ch4: 'CH4', nh3: 'NH3',
  hcl: 'HCl', naoh: 'NaOH', nacl: 'NaCl', koh: 'KOH', kcl: 'KCl',
  h2so4: 'H2SO4', hno3: 'HNO3', h2co3: 'H2CO3', h3po4: 'H3PO4',
  cuso4: 'CuSO4', feso4: 'FeSO4', znso4: 'ZnSO4', na2so4: 'Na2SO4',
  fe2o3: 'Fe2O3', fe3o4: 'Fe3O4', feo: 'FeO', al2o3: 'Al2O3', cuo: 'CuO',
  mgo: 'MgO', cao: 'CaO', zno: 'ZnO', na2o: 'Na2O',
  caco3: 'CaCO3', na2co3: 'Na2CO3', nahco3: 'NaHCO3',
  cacl2: 'CaCl2', fecl2: 'FeCl2', fecl3: 'FeCl3', alcl3: 'AlCl3',
  mgcl2: 'MgCl2', zncl2: 'ZnCl2', nh4cl: 'NH4Cl', agcl: 'AgCl',
  agno3: 'AgNO3', nano3: 'NaNO3', kno3: 'KNO3',
  'ca(oh)2': 'Ca(OH)2', 'cu(oh)2': 'Cu(OH)2', 'fe(oh)2': 'Fe(OH)2', 'mg(oh)2': 'Mg(OH)2',
  'al2(so4)3': 'Al2(SO4)3',
  fe: 'Fe', cu: 'Cu', al: 'Al', mg: 'Mg', zn: 'Zn', na: 'Na', k: 'K', ca: 'Ca', ag: 'Ag', c: 'C', s: 'S'
};

/**
 * Normalizes a user-typed chemical formula (e.g. "cuso4" -> "CuSO4", "2hcl" -> "HCl").
 */
export function normalizeChemicalFormulaInput(raw: string): string {
  const clean = normalizeFormulaSubscripts(raw).replace(/^\d+\s*/, '').trim();
  if (!clean) return '';
  const lower = clean.toLowerCase();
  if (CANONICAL_FORMULAS[lower]) {
    return CANONICAL_FORMULAS[lower];
  }
  // If already valid in parseFormula, keep it
  if (parseFormula(clean)) {
    return clean;
  }
  // Capitalize first letter fallback if single element like "he", "ne", "au"
  if (clean.length <= 2) {
    const cap = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
    if (parseFormula(cap)) return cap;
  }
  return clean;
}

export const PRESET_REACTIONS: ReactionPreset[] = [
  {
    id: 'water-synthesis',
    name: 'Formation of Water',
    reactants: ['H2', 'O2'],
    equation: '2H₂ + O₂ → 2H₂O',
    reactionType: 'Synthesis',
    energyType: 'exothermic',
    deltaH: '-483.6 kJ/mol',
    temperature: 'Room Temp / Spark',
    pressure: '1 atm',
    catalyst: 'Pt or Electric Spark'
  },
  {
    id: 'methane-combustion',
    name: 'Combustion of Methane',
    reactants: ['CH4', 'O2'],
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    reactionType: 'Combustion',
    energyType: 'exothermic',
    deltaH: '-890.3 kJ/mol',
    temperature: 'Ignition temp (> 600 °C)',
    pressure: '1 atm',
    catalyst: 'None required'
  },
  {
    id: 'haber-process',
    name: 'Haber-Bosch Ammonia Synthesis',
    reactants: ['N2', 'H2'],
    equation: 'N₂ + 3H₂ → 2NH₃',
    reactionType: 'Synthesis / Industrial',
    energyType: 'exothermic',
    deltaH: '-92.4 kJ/mol',
    temperature: '400 – 450 °C',
    pressure: '150 – 200 atm',
    catalyst: 'Fe (Enriched Iron)'
  },
  {
    id: 'neutralization',
    name: 'Acid-Base Neutralization',
    reactants: ['HCl', 'NaOH'],
    equation: 'HCl + NaOH → NaCl + H₂O',
    reactionType: 'Acid-Base Neutralization',
    energyType: 'exothermic',
    deltaH: '-57.3 kJ/mol',
    temperature: '25 °C (ambient)',
    pressure: '1 atm',
    catalyst: 'None required'
  },
  {
    id: 'copper-displacement',
    name: 'Single Displacement of Copper',
    reactants: ['Fe', 'CuSO4'],
    equation: 'Fe + CuSO₄ → FeSO₄ + Cu',
    reactionType: 'Single Displacement / Redox',
    energyType: 'exothermic',
    deltaH: '-152.0 kJ/mol',
    temperature: '20 – 25 °C',
    pressure: '1 atm',
    catalyst: 'Aqueous solution'
  },
  {
    id: 'hydrogen-peroxide',
    name: 'Catalytic Peroxide Decomposition',
    reactants: ['H2O2'],
    equation: '2H₂O₂ → 2H₂O + O₂',
    reactionType: 'Decomposition',
    energyType: 'exothermic',
    deltaH: '-196.1 kJ/mol',
    temperature: 'Room Temperature',
    pressure: '1 atm',
    catalyst: 'MnO₂ or Potassium Iodide'
  },
  {
    id: 'thermite',
    name: 'Thermite Reaction',
    reactants: ['Al', 'Fe2O3'],
    equation: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe',
    reactionType: 'Redox / High Exothermic',
    energyType: 'exothermic',
    deltaH: '-851.5 kJ/mol',
    temperature: '> 1500 °C (ignition)',
    pressure: '1 atm',
    catalyst: 'Magnesium fuse ribbon'
  },
  {
    id: 'calcium-carbonate',
    name: 'Limestone Calcination',
    reactants: ['CaCO3'],
    equation: 'CaCO₃ → CaO + CO₂',
    reactionType: 'Thermal Decomposition',
    energyType: 'endothermic',
    deltaH: '+178.0 kJ/mol',
    temperature: '840 – 900 °C',
    pressure: '1 atm',
    catalyst: 'Direct flame heat'
  }
];

// Extended database of known laboratory reactions for stockroom & custom combinations
interface ExtendedReactionRule {
  id: string;
  name: string;
  reactants: StoichSpecies[];
  products: StoichSpecies[];
  equation: string;
  reactionType: string;
  energyType: 'exothermic' | 'endothermic';
  deltaH: string;
  temperature: string;
  pressure: string;
  catalyst: string;
  tempBase: number;
  tempPeak: number;
  hasSparks: boolean;
  hasBubbles: boolean;
  hasPrecipitate: boolean;
  colorTheme: string;
  batches: number;
}

const EXTENDED_REACTIONS: ExtendedReactionRule[] = [
  {
    id: 'water-synthesis',
    name: 'Formation of Water (Covalent Synthesis)',
    reactants: [
      { specKey: 'H2', coeff: 2, formula: 'H₂', name: 'Hydrogen' },
      { specKey: 'O2', coeff: 1, formula: 'O₂', name: 'Oxygen' }
    ],
    products: [
      { specKey: 'H2O', coeff: 2, formula: 'H₂O', name: 'Water' }
    ],
    equation: '2H₂ + O₂ → 2H₂O',
    reactionType: 'Synthesis',
    energyType: 'exothermic',
    deltaH: '-483.6 kJ/mol',
    temperature: 'Room Temp / Spark',
    pressure: '1 atm',
    catalyst: 'Pt or Electric Spark',
    tempBase: 25,
    tempPeak: 280,
    hasSparks: true,
    hasBubbles: false,
    hasPrecipitate: false,
    colorTheme: '#DC2626',
    batches: 4
  },
  {
    id: 'methane-combustion',
    name: 'Hydrocarbon Combustion (High Exothermic)',
    reactants: [
      { specKey: 'CH4', coeff: 1, formula: 'CH₄', name: 'Methane' },
      { specKey: 'O2', coeff: 2, formula: 'O₂', name: 'Oxygen' }
    ],
    products: [
      { specKey: 'CO2', coeff: 1, formula: 'CO₂', name: 'Carbon Dioxide' },
      { specKey: 'H2O', coeff: 2, formula: 'H₂O', name: 'Water' }
    ],
    equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
    reactionType: 'Combustion',
    energyType: 'exothermic',
    deltaH: '-890.3 kJ/mol',
    temperature: 'Ignition temp (> 600 °C)',
    pressure: '1 atm',
    catalyst: 'None required',
    tempBase: 25,
    tempPeak: 620,
    hasSparks: true,
    hasBubbles: true,
    hasPrecipitate: false,
    colorTheme: '#EA580C',
    batches: 3
  },
  {
    id: 'haber-process',
    name: 'Haber-Bosch Ammonia Synthesis (Catalyzed)',
    reactants: [
      { specKey: 'N2', coeff: 1, formula: 'N₂', name: 'Nitrogen' },
      { specKey: 'H2', coeff: 3, formula: 'H₂', name: 'Hydrogen' }
    ],
    products: [
      { specKey: 'NH3', coeff: 2, formula: 'NH₃', name: 'Ammonia' }
    ],
    equation: 'N₂ + 3H₂ → 2NH₃',
    reactionType: 'Synthesis / Industrial',
    energyType: 'exothermic',
    deltaH: '-92.4 kJ/mol',
    temperature: '400 – 450 °C',
    pressure: '150 – 200 atm',
    catalyst: 'Fe (Enriched Iron)',
    tempBase: 25,
    tempPeak: 450,
    hasSparks: false,
    hasBubbles: true,
    hasPrecipitate: false,
    colorTheme: '#2563EB',
    batches: 3
  },
  {
    id: 'neutralization',
    name: 'Acid-Base Aqueous Neutralization',
    reactants: [
      { specKey: 'HCl', coeff: 1, formula: 'HCl', name: 'Hydrochloric Acid' },
      { specKey: 'NaOH', coeff: 1, formula: 'NaOH', name: 'Sodium Hydroxide' }
    ],
    products: [
      { specKey: 'NaCl', coeff: 1, formula: 'NaCl', name: 'Sodium Chloride' },
      { specKey: 'H2O', coeff: 1, formula: 'H₂O', name: 'Water' }
    ],
    equation: 'HCl + NaOH → NaCl + H₂O',
    reactionType: 'Acid-Base Neutralization',
    energyType: 'exothermic',
    deltaH: '-57.3 kJ/mol',
    temperature: '25 °C (ambient)',
    pressure: '1 atm',
    catalyst: 'None required',
    tempBase: 25,
    tempPeak: 58,
    hasSparks: false,
    hasBubbles: false,
    hasPrecipitate: false,
    colorTheme: '#16A34A',
    batches: 5
  },
  {
    id: 'copper-displacement',
    name: 'Single Displacement & Redox Precipitation',
    reactants: [
      { specKey: 'Fe', coeff: 1, formula: 'Fe', name: 'Iron' },
      { specKey: 'CuSO4', coeff: 1, formula: 'CuSO₄', name: 'Copper Sulfate' }
    ],
    products: [
      { specKey: 'FeSO4', coeff: 1, formula: 'FeSO₄', name: 'Iron(II) Sulfate' },
      { specKey: 'Cu', coeff: 1, formula: 'Cu', name: 'Copper Precipitate' }
    ],
    equation: 'Fe + CuSO₄ → FeSO₄ + Cu',
    reactionType: 'Single Displacement / Redox',
    energyType: 'exothermic',
    deltaH: '-152.0 kJ/mol',
    temperature: '20 – 25 °C',
    pressure: '1 atm',
    catalyst: 'Aqueous solution',
    tempBase: 25,
    tempPeak: 48,
    hasSparks: false,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#C2410C',
    batches: 5
  },
  {
    id: 'peroxide-decomposition',
    name: 'Catalytic Effervescent Decomposition',
    reactants: [
      { specKey: 'H2O2', coeff: 2, formula: 'H₂O₂', name: 'Hydrogen Peroxide' }
    ],
    products: [
      { specKey: 'H2O', coeff: 2, formula: 'H₂O', name: 'Water' },
      { specKey: 'O2', coeff: 1, formula: 'O₂', name: 'Oxygen Gas' }
    ],
    equation: '2H₂O₂ → 2H₂O + O₂',
    reactionType: 'Decomposition',
    energyType: 'exothermic',
    deltaH: '-196.1 kJ/mol',
    temperature: 'Room Temperature',
    pressure: '1 atm',
    catalyst: 'MnO₂ or Potassium Iodide',
    tempBase: 25,
    tempPeak: 85,
    hasSparks: false,
    hasBubbles: true,
    hasPrecipitate: false,
    colorTheme: '#0284C7',
    batches: 4
  },
  {
    id: 'thermite',
    name: 'Thermite Incandescent Redox',
    reactants: [
      { specKey: 'Al', coeff: 2, formula: 'Al', name: 'Aluminum' },
      { specKey: 'Fe2O3', coeff: 1, formula: 'Fe₂O₃', name: 'Iron(III) Oxide' }
    ],
    products: [
      { specKey: 'Al2O3', coeff: 1, formula: 'Al₂O₃', name: 'Aluminum Oxide' },
      { specKey: 'Fe', coeff: 2, formula: 'Fe', name: 'Molten Iron' }
    ],
    equation: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe',
    reactionType: 'Redox / High Exothermic',
    energyType: 'exothermic',
    deltaH: '-851.5 kJ/mol',
    temperature: '> 1500 °C (ignition)',
    pressure: '1 atm',
    catalyst: 'Magnesium fuse ribbon',
    tempBase: 25,
    tempPeak: 1450,
    hasSparks: true,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#F59E0B',
    batches: 3
  },
  {
    id: 'calcination',
    name: 'Limestone Endothermic Calcination',
    reactants: [
      { specKey: 'CaCO3', coeff: 1, formula: 'CaCO₃', name: 'Calcium Carbonate' }
    ],
    products: [
      { specKey: 'CaO', coeff: 1, formula: 'CaO', name: 'Calcium Oxide' },
      { specKey: 'CO2', coeff: 1, formula: 'CO₂', name: 'Carbon Dioxide Gas' }
    ],
    equation: 'CaCO₃ → CaO + CO₂',
    reactionType: 'Thermal Decomposition',
    energyType: 'endothermic',
    deltaH: '+178.0 kJ/mol',
    temperature: '840 – 900 °C',
    pressure: '1 atm',
    catalyst: 'Direct flame heat',
    tempBase: 25,
    tempPeak: 880,
    hasSparks: false,
    hasBubbles: true,
    hasPrecipitate: true,
    colorTheme: '#4F46E5',
    batches: 5
  },
  // Additional Stockroom & Common Lab Reactions
  {
    id: 'carbonate-acid',
    name: 'Carbonate-Acid Gas Evolution',
    reactants: [
      { specKey: 'CaCO3', coeff: 1, formula: 'CaCO₃', name: 'Calcium Carbonate' },
      { specKey: 'HCl', coeff: 2, formula: 'HCl', name: 'Hydrochloric Acid' }
    ],
    products: [
      { specKey: 'CaCl2', coeff: 1, formula: 'CaCl₂', name: 'Calcium Chloride' },
      { specKey: 'H2O', coeff: 1, formula: 'H₂O', name: 'Water' },
      { specKey: 'CO2', coeff: 1, formula: 'CO₂', name: 'Carbon Dioxide Gas' }
    ],
    equation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂',
    reactionType: 'Acid-Carbonate Gas Evolution',
    energyType: 'exothermic',
    deltaH: '-15.2 kJ/mol',
    temperature: '25 °C (ambient)',
    pressure: '1 atm',
    catalyst: 'Aqueous medium',
    tempBase: 25,
    tempPeak: 42,
    hasSparks: false,
    hasBubbles: true,
    hasPrecipitate: false,
    colorTheme: '#0284C7',
    batches: 4
  },
  {
    id: 'iron-acid',
    name: 'Iron Acid Dissolution & Hydrogen Evolution',
    reactants: [
      { specKey: 'Fe', coeff: 1, formula: 'Fe', name: 'Iron' },
      { specKey: 'HCl', coeff: 2, formula: 'HCl', name: 'Hydrochloric Acid' }
    ],
    products: [
      { specKey: 'FeCl2', coeff: 1, formula: 'FeCl₂', name: 'Iron(II) Chloride' },
      { specKey: 'H2', coeff: 1, formula: 'H₂', name: 'Hydrogen Gas' }
    ],
    equation: 'Fe + 2HCl → FeCl₂ + H₂',
    reactionType: 'Single Displacement / Gas Evolution',
    energyType: 'exothermic',
    deltaH: '-89.1 kJ/mol',
    temperature: '25 – 45 °C',
    pressure: '1 atm',
    catalyst: 'None required',
    tempBase: 25,
    tempPeak: 55,
    hasSparks: false,
    hasBubbles: true,
    hasPrecipitate: false,
    colorTheme: '#10B981',
    batches: 4
  },
  {
    id: 'aluminum-acid',
    name: 'Aluminum Acid Redox Dissolution',
    reactants: [
      { specKey: 'Al', coeff: 2, formula: 'Al', name: 'Aluminum' },
      { specKey: 'HCl', coeff: 6, formula: 'HCl', name: 'Hydrochloric Acid' }
    ],
    products: [
      { specKey: 'AlCl3', coeff: 2, formula: 'AlCl₃', name: 'Aluminum Chloride' },
      { specKey: 'H2', coeff: 3, formula: 'H₂', name: 'Hydrogen Gas' }
    ],
    equation: '2Al + 6HCl → 2AlCl₃ + 3H₂',
    reactionType: 'Single Displacement / Redox',
    energyType: 'exothermic',
    deltaH: '-531.0 kJ/mol',
    temperature: '25 – 85 °C',
    pressure: '1 atm',
    catalyst: 'Aqueous solution',
    tempBase: 25,
    tempPeak: 85,
    hasSparks: false,
    hasBubbles: true,
    hasPrecipitate: false,
    colorTheme: '#0D9488',
    batches: 3
  },
  {
    id: 'iron-oxidation',
    name: 'Iron Thermal Oxidation',
    reactants: [
      { specKey: 'Fe', coeff: 4, formula: 'Fe', name: 'Iron' },
      { specKey: 'O2', coeff: 3, formula: 'O₂', name: 'Oxygen' }
    ],
    products: [
      { specKey: 'Fe2O3', coeff: 2, formula: 'Fe₂O₃', name: 'Iron(III) Oxide' }
    ],
    equation: '4Fe + 3O₂ → 2Fe₂O₃',
    reactionType: 'Synthesis / Oxidation',
    energyType: 'exothermic',
    deltaH: '-824.2 kJ/mol',
    temperature: '500 °C (or moisture)',
    pressure: '1 atm',
    catalyst: 'Thermal ignition',
    tempBase: 25,
    tempPeak: 520,
    hasSparks: true,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#C2410C',
    batches: 3
  },
  {
    id: 'aluminum-oxidation',
    name: 'Aluminum Oxide Synthesis',
    reactants: [
      { specKey: 'Al', coeff: 4, formula: 'Al', name: 'Aluminum' },
      { specKey: 'O2', coeff: 3, formula: 'O₂', name: 'Oxygen' }
    ],
    products: [
      { specKey: 'Al2O3', coeff: 2, formula: 'Al₂O₃', name: 'Aluminum Oxide' }
    ],
    equation: '4Al + 3O₂ → 2Al₂O₃',
    reactionType: 'Synthesis / Oxidation',
    energyType: 'exothermic',
    deltaH: '-1675.7 kJ/mol',
    temperature: '> 600 °C',
    pressure: '1 atm',
    catalyst: 'Thermal energy',
    tempBase: 25,
    tempPeak: 680,
    hasSparks: true,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#D97706',
    batches: 3
  },
  {
    id: 'ammonia-hcl',
    name: 'Ammonium Chloride Synthesis',
    reactants: [
      { specKey: 'NH3', coeff: 1, formula: 'NH₃', name: 'Ammonia' },
      { specKey: 'HCl', coeff: 1, formula: 'HCl', name: 'Hydrochloric Acid' }
    ],
    products: [
      { specKey: 'NH4Cl', coeff: 1, formula: 'NH₄Cl', name: 'Ammonium Chloride' }
    ],
    equation: 'NH₃ + HCl → NH₄Cl',
    reactionType: 'Acid-Base Synthesis',
    energyType: 'exothermic',
    deltaH: '-176.0 kJ/mol',
    temperature: '25 °C (ambient)',
    pressure: '1 atm',
    catalyst: 'None required',
    tempBase: 25,
    tempPeak: 68,
    hasSparks: false,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#4F46E5',
    batches: 4
  },
  {
    id: 'quicklime-slaking',
    name: 'Quicklime Hydration (Slaking)',
    reactants: [
      { specKey: 'CaO', coeff: 1, formula: 'CaO', name: 'Calcium Oxide' },
      { specKey: 'H2O', coeff: 1, formula: 'H₂O', name: 'Water' }
    ],
    products: [
      { specKey: 'Ca(OH)2', coeff: 1, formula: 'Ca(OH)₂', name: 'Calcium Hydroxide' }
    ],
    equation: 'CaO + H₂O → Ca(OH)₂',
    reactionType: 'Synthesis / Hydration',
    energyType: 'exothermic',
    deltaH: '-65.2 kJ/mol',
    temperature: '25 – 100 °C',
    pressure: '1 atm',
    catalyst: 'None required',
    tempBase: 25,
    tempPeak: 95,
    hasSparks: false,
    hasBubbles: true,
    hasPrecipitate: true,
    colorTheme: '#16A34A',
    batches: 4
  },
  {
    id: 'silver-chloride-precipitation',
    name: 'Silver Chloride Double Displacement',
    reactants: [
      { specKey: 'AgNO3', coeff: 1, formula: 'AgNO₃', name: 'Silver Nitrate' },
      { specKey: 'NaCl', coeff: 1, formula: 'NaCl', name: 'Sodium Chloride' }
    ],
    products: [
      { specKey: 'AgCl', coeff: 1, formula: 'AgCl', name: 'Silver Chloride Precipitate' },
      { specKey: 'NaNO3', coeff: 1, formula: 'NaNO₃', name: 'Sodium Nitrate' }
    ],
    equation: 'AgNO₃ + NaCl → AgCl + NaNO₃',
    reactionType: 'Double Displacement / Precipitation',
    energyType: 'exothermic',
    deltaH: '-65.5 kJ/mol',
    temperature: '25 °C (ambient)',
    pressure: '1 atm',
    catalyst: 'Aqueous solution',
    tempBase: 25,
    tempPeak: 32,
    hasSparks: false,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#64748B',
    batches: 4
  },
  {
    id: 'sulfuric-neutralization',
    name: 'Sulfuric Acid-Base Neutralization',
    reactants: [
      { specKey: 'H2SO4', coeff: 1, formula: 'H₂SO₄', name: 'Sulfuric Acid' },
      { specKey: 'NaOH', coeff: 2, formula: 'NaOH', name: 'Sodium Hydroxide' }
    ],
    products: [
      { specKey: 'Na2SO4', coeff: 1, formula: 'Na₂SO₄', name: 'Sodium Sulfate' },
      { specKey: 'H2O', coeff: 2, formula: 'H₂O', name: 'Water' }
    ],
    equation: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
    reactionType: 'Acid-Base Neutralization',
    energyType: 'exothermic',
    deltaH: '-114.6 kJ/mol',
    temperature: '25 – 70 °C',
    pressure: '1 atm',
    catalyst: 'Aqueous medium',
    tempBase: 25,
    tempPeak: 68,
    hasSparks: false,
    hasBubbles: false,
    hasPrecipitate: false,
    colorTheme: '#16A34A',
    batches: 4
  },
  {
    id: 'copper-hydroxide-precipitation',
    name: 'Copper(II) Hydroxide Precipitation',
    reactants: [
      { specKey: 'CuSO4', coeff: 1, formula: 'CuSO₄', name: 'Copper Sulfate' },
      { specKey: 'NaOH', coeff: 2, formula: 'NaOH', name: 'Sodium Hydroxide' }
    ],
    products: [
      { specKey: 'Cu(OH)2', coeff: 1, formula: 'Cu(OH)₂', name: 'Copper(II) Hydroxide' },
      { specKey: 'Na2SO4', coeff: 1, formula: 'Na₂SO₄', name: 'Sodium Sulfate' }
    ],
    equation: 'CuSO₄ + 2NaOH → Cu(OH)₂ + Na₂SO₄',
    reactionType: 'Double Displacement / Precipitation',
    energyType: 'exothermic',
    deltaH: '-42.8 kJ/mol',
    temperature: '25 °C (ambient)',
    pressure: '1 atm',
    catalyst: 'Aqueous medium',
    tempBase: 25,
    tempPeak: 38,
    hasSparks: false,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#0284C7',
    batches: 4
  },
  {
    id: 'magnesium-combustion',
    name: 'Magnesium Ribbon Oxidation',
    reactants: [
      { specKey: 'Mg', coeff: 2, formula: 'Mg', name: 'Magnesium' },
      { specKey: 'O2', coeff: 1, formula: 'O₂', name: 'Oxygen' }
    ],
    products: [
      { specKey: 'MgO', coeff: 2, formula: 'MgO', name: 'Magnesium Oxide' }
    ],
    equation: '2Mg + O₂ → 2MgO',
    reactionType: 'Combustion / Oxidation',
    energyType: 'exothermic',
    deltaH: '-1203.6 kJ/mol',
    temperature: '> 650 °C (ignition)',
    pressure: '1 atm',
    catalyst: 'Spark / Flame',
    tempBase: 25,
    tempPeak: 1100,
    hasSparks: true,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#F59E0B',
    batches: 4
  },
  {
    id: 'magnesium-acid',
    name: 'Magnesium Acid Hydrogen Evolution',
    reactants: [
      { specKey: 'Mg', coeff: 1, formula: 'Mg', name: 'Magnesium' },
      { specKey: 'HCl', coeff: 2, formula: 'HCl', name: 'Hydrochloric Acid' }
    ],
    products: [
      { specKey: 'MgCl2', coeff: 1, formula: 'MgCl₂', name: 'Magnesium Chloride' },
      { specKey: 'H2', coeff: 1, formula: 'H₂', name: 'Hydrogen Gas' }
    ],
    equation: 'Mg + 2HCl → MgCl₂ + H₂',
    reactionType: 'Single Displacement / Gas Evolution',
    energyType: 'exothermic',
    deltaH: '-462.0 kJ/mol',
    temperature: '25 – 75 °C',
    pressure: '1 atm',
    catalyst: 'Aqueous medium',
    tempBase: 25,
    tempPeak: 75,
    hasSparks: false,
    hasBubbles: true,
    hasPrecipitate: false,
    colorTheme: '#10B981',
    batches: 4
  },
  {
    id: 'zinc-copper-displacement',
    name: 'Zinc-Copper Redox Displacement',
    reactants: [
      { specKey: 'Zn', coeff: 1, formula: 'Zn', name: 'Zinc' },
      { specKey: 'CuSO4', coeff: 1, formula: 'CuSO₄', name: 'Copper Sulfate' }
    ],
    products: [
      { specKey: 'ZnSO4', coeff: 1, formula: 'ZnSO₄', name: 'Zinc Sulfate' },
      { specKey: 'Cu', coeff: 1, formula: 'Cu', name: 'Copper Precipitate' }
    ],
    equation: 'Zn + CuSO₄ → ZnSO₄ + Cu',
    reactionType: 'Single Displacement / Redox',
    energyType: 'exothermic',
    deltaH: '-218.7 kJ/mol',
    temperature: '25 °C (ambient)',
    pressure: '1 atm',
    catalyst: 'Aqueous medium',
    tempBase: 25,
    tempPeak: 54,
    hasSparks: false,
    hasBubbles: false,
    hasPrecipitate: true,
    colorTheme: '#C2410C',
    batches: 4
  }
];

function findMatchedRule(formulas: string[]): ExtendedReactionRule | undefined {
  const lowerSorted = formulas.map(f => normalizeFormulaSubscripts(f).toLowerCase()).sort();
  return EXTENDED_REACTIONS.find(rule => {
    const rSorted = rule.reactants.map(r => normalizeFormulaSubscripts(r.specKey).toLowerCase()).sort();
    return (
      rSorted.length === lowerSorted.length &&
      rSorted.every((val, idx) => val === lowerSorted[idx])
    );
  });
}

/**
 * Computes exact stoichiometric breakdown (limiting reagent, excess remaining,
 * product theoretical yields, and total mass conservation) for any set of reactants and products.
 */
function calculateStoichiometryBreakdown(
  reactantsInput: ReactantItem[],
  stoichReactants: StoichSpecies[],
  stoichProducts: StoichSpecies[],
  efficiency = 0.964
) {
  const rDetails: ReactantStoichDetail[] = stoichReactants.map(spec => {
    const normKey = normalizeFormulaSubscripts(spec.specKey).toLowerCase();
    const userItem = reactantsInput.find(
      r => normalizeFormulaSubscripts(r.formula).toLowerCase() === normKey
    );
    const meta = getReagentInfo(spec.specKey);
    const mw = meta.molarMass > 0 ? meta.molarMass : (calculateMolarMass(spec.specKey) || 1);
    const initialGrams = userItem?.massGrams ?? parseFloat((spec.coeff * mw).toFixed(1));
    const initialMoles = initialGrams / mw;
    return {
      formula: spec.formula,
      name: meta.name.en || spec.name,
      coeff: spec.coeff,
      molarMass: mw,
      initialGrams,
      initialMoles,
      consumedGrams: 0,
      consumedMoles: 0,
      remainingGrams: 0,
      remainingMoles: 0,
      isLimiting: false
    };
  });

  const ratios = rDetails.map(r => r.initialMoles / Math.max(1, r.coeff));
  const limitingBatches = ratios.length > 0 ? Math.min(...ratios) : 0;
  const maxBatches = ratios.length > 0 ? Math.max(...ratios) : 0;
  const isStoichiometricBalance =
    rDetails.length > 1 && maxBatches > 0 && Math.abs(maxBatches - limitingBatches) / maxBatches < 0.015;

  // Finalize consumed & remaining for each reactant
  let minIdx = 0;
  ratios.forEach((ratio, idx) => {
    if (ratio < ratios[minIdx]) minIdx = idx;
  });

  rDetails.forEach((r, idx) => {
    const consumedMoles = Math.min(r.initialMoles, limitingBatches * r.coeff);
    const consumedGrams = consumedMoles * r.molarMass;
    const remainingGrams = Math.max(0, r.initialGrams - consumedGrams);
    const remainingMoles = remainingGrams / r.molarMass;
    r.consumedMoles = consumedMoles;
    r.consumedGrams = consumedGrams;
    r.remainingGrams = remainingGrams;
    r.remainingMoles = remainingMoles;
    r.isLimiting = isStoichiometricBalance || idx === minIdx;
  });

  // Compute products theoretical yield
  const pDetails: ProductYieldDetail[] = stoichProducts.map(spec => {
    const meta = getReagentInfo(spec.specKey);
    const mw = meta.molarMass > 0 ? meta.molarMass : (calculateMolarMass(spec.specKey) || 1);
    const theoreticalMoles = limitingBatches * spec.coeff;
    const theoreticalGrams = theoreticalMoles * mw;
    return {
      formula: spec.formula,
      name: meta.name.en || spec.name,
      coeff: spec.coeff,
      molarMass: mw,
      theoreticalMoles,
      theoreticalGrams,
      stateLabel: meta.stateLabel
    };
  });

  const totalInputMass = rDetails.reduce((s, r) => s + r.initialGrams, 0);
  const totalConsumedMass = rDetails.reduce((s, r) => s + r.consumedGrams, 0);
  const totalRemainingMass = rDetails.reduce((s, r) => s + r.remainingGrams, 0);
  // Conservation of mass: total product mass equals total consumed reactant mass
  const rawProductSum = pDetails.reduce((s, p) => s + p.theoreticalGrams, 0);
  const totalProductMass = rawProductSum > 0 ? rawProductSum : totalConsumedMass;

  const limitingItem = rDetails[minIdx] || rDetails[0];
  const excessItems = rDetails.filter(r => !r.isLimiting && r.remainingGrams > 0.02);

  const limitingReagentStr = isStoichiometricBalance
    ? `Exact Stoichiometric Ratio (${limitingBatches.toFixed(3)} eq mol)`
    : limitingItem
    ? `${limitingItem.formula} (${limitingItem.initialMoles.toFixed(3)} mol / coeff ${limitingItem.coeff} = ${limitingBatches.toFixed(3)} eq)`
    : null;

  const excessReagentStr = isStoichiometricBalance
    ? '0.00 g excess (100% reactant utilization)'
    : excessItems.length > 0
    ? excessItems.map(e => `${e.formula}: ${e.remainingGrams.toFixed(2)} g (${e.remainingMoles.toFixed(3)} mol) remaining`).join(' • ')
    : 'None (Single reactant decomposition)';

  const productSummaryStr = pDetails
    .map(p => `${p.theoreticalGrams.toFixed(2)} g ${p.formula} (${p.theoreticalMoles.toFixed(3)} mol)`)
    .join(' + ');

  return {
    limitingReagent: limitingReagentStr,
    excessReagent: excessReagentStr,
    theoreticalYield: `${totalProductMass.toFixed(2)} g total (${productSummaryStr})`,
    percentYield: `${(efficiency * 100).toFixed(1)}% (Est. lab actual: ${(totalProductMass * efficiency).toFixed(2)} g)`,
    isStoichiometricBalance,
    totalInputMass,
    totalProductMass,
    totalRemainingMass,
    reactantDetails: rDetails,
    productDetails: pDetails
  };
}

/**
 * Helper to compute exact stoichiometric gram masses for a set of reactants
 * so the user can auto-balance reactant masses with 1 click.
 */
export function getStoichiometricMassesForReactants(reactants: ReactantItem[], equation: string): ReactantItem[] {
  const profile = resolveStoichiometricProfile(equation, reactants);
  return reactants.map(r => {
    const normFormula = normalizeFormulaSubscripts(r.formula).toLowerCase();
    const spec = profile.reactants.find(
      s => normalizeFormulaSubscripts(s.specKey).toLowerCase() === normFormula
    );
    const coeff = spec?.coeff ?? 1;
    const meta = getReagentInfo(r.formula);
    const mw = meta.molarMass > 0 ? meta.molarMass : (calculateMolarMass(r.formula) || 10);
    // Use 1.0 batch (or 0.5 batch if molar mass is very large > 100 g/mol) for clean lab scale
    const scale = mw * coeff > 120 ? 0.25 : mw * coeff < 10 ? 2.0 : 1.0;
    const targetMass = parseFloat((coeff * mw * scale).toFixed(1));
    return {
      ...r,
      massGrams: Math.max(0.5, targetMass)
    };
  });
}

export function computeReaction(reactants: ReactantItem[]): Partial<ReactionState> {
  const formulas = reactants.map(r => normalizeChemicalFormulaInput(r.formula)).filter(Boolean);
  if (formulas.length < 1) {
    return {
      status: 'idle',
      equation: '',
      reactionType: '',
      energyType: null,
      conditions: { temperature: null, pressure: null, catalyst: null },
      calculations: {
        limitingReagent: null,
        excessReagent: null,
        theoreticalYield: null,
        percentYield: null
      }
    };
  }

  // 1. Check extended known reaction rules (includes all 8 presets + 11 extra lab reactions)
  const matchedRule = findMatchedRule(formulas);
  if (matchedRule) {
    const calculations = calculateStoichiometryBreakdown(
      reactants,
      matchedRule.reactants,
      matchedRule.products,
      0.958
    );

    return {
      equation: matchedRule.equation,
      reactionType: matchedRule.reactionType,
      energyType: matchedRule.energyType,
      deltaH: matchedRule.deltaH,
      conditions: {
        temperature: matchedRule.temperature,
        pressure: matchedRule.pressure,
        catalyst: matchedRule.catalyst
      },
      calculations,
      status: 'complete'
    };
  }

  // 2. Dynamic multi-reactant synthesis / reaction builder using real reactant formulas
  if (formulas.length >= 2) {
    const profile = buildDynamicProfileFromReactants(formulas);
    const calculations = calculateStoichiometryBreakdown(
      reactants,
      profile.reactants,
      profile.products,
      0.915
    );

    const isAcid = formulas.some(f => f.startsWith('H') && f !== 'H2' && f !== 'H2O' && f !== 'H2O2');
    const isBase = formulas.some(f => f.endsWith('OH'));
    const hasO2 = formulas.some(f => f.toUpperCase() === 'O2');

    const dynamicType = isAcid && isBase
      ? 'Acid-Base Neutralization'
      : hasO2
      ? 'Oxidation / Combustion'
      : 'Chemical Synthesis';

    return {
      equation: profile.equation,
      reactionType: dynamicType,
      energyType: profile.energyType,
      deltaH: '-145.2 kJ/mol (estimated)',
      conditions: {
        temperature: hasO2 ? '350 – 600 °C' : '25 – 85 °C',
        pressure: '1 atm',
        catalyst: 'Standard Laboratory Conditions'
      },
      calculations,
      status: 'complete'
    };
  }

  // Single reactant that is not a known decomposition preset
  const singleFormula = toSubscriptFormula(formulas[0]);
  return {
    status: 'ready',
    equation: `${singleFormula} + ? → Products`,
    reactionType: 'Awaiting second reactant (or select decomposition preset)',
    energyType: null,
    conditions: { temperature: '25 °C', pressure: '1 atm', catalyst: 'None' },
    calculations: {
      limitingReagent: null,
      excessReagent: null,
      theoreticalYield: null,
      percentYield: null
    }
  };
}

/**
 * Dynamically constructs a chemically coherent StoichiometricReactionProfile
 * for any arbitrary combination of reactants so the bench & molecular view always
 * respect the actual user-selected reactants!
 */
function buildDynamicProfileFromReactants(rawFormulas: string[]): StoichiometricReactionProfile {
  const cleanFormulas = rawFormulas.map(f => normalizeChemicalFormulaInput(f));
  const stoichReactants: StoichSpecies[] = cleanFormulas.map(f => {
    const meta = getReagentInfo(f);
    return {
      specKey: f,
      coeff: 1,
      formula: toSubscriptFormula(f),
      name: meta.name.en
    };
  });

  // Combine constituent elements into realistic products
  const combinedAtoms: Record<string, number> = {};
  cleanFormulas.forEach(f => {
    const parsed = parseFormula(f);
    if (parsed) {
      Object.entries(parsed).forEach(([sym, count]) => {
        combinedAtoms[sym] = (combinedAtoms[sym] || 0) + count;
      });
    }
  });

  const stoichProducts: StoichSpecies[] = [];

  // Check if water (H and O present) can be formed alongside a salt/oxide
  const isAcid = cleanFormulas.some(f => f.startsWith('H') && f !== 'H2' && f !== 'H2O');
  const isBase = cleanFormulas.some(f => f.endsWith('OH'));

  if (isAcid && isBase && combinedAtoms['H'] >= 2 && combinedAtoms['O'] >= 1) {
    // Remaining atoms form salt
    const saltAtoms = { ...combinedAtoms };
    saltAtoms['H'] = Math.max(0, (saltAtoms['H'] || 0) - 2);
    saltAtoms['O'] = Math.max(0, (saltAtoms['O'] || 0) - 1);
    const saltFormula = Object.entries(saltAtoms)
      .filter(([, c]) => c > 0)
      .map(([el, c]) => (c > 1 ? `${el}${c}` : el))
      .join('');
    if (saltFormula) {
      stoichProducts.push({
        specKey: saltFormula,
        coeff: 1,
        formula: toSubscriptFormula(saltFormula),
        name: `${toSubscriptFormula(saltFormula)} Salt`
      });
    }
    stoichProducts.push({
      specKey: 'H2O',
      coeff: 1,
      formula: 'H₂O',
      name: 'Water'
    });
  } else {
    // Combine elements into an adduct / synthesis product conserving all atoms
    const synthRaw = Object.entries(combinedAtoms)
      .filter(([, c]) => c > 0)
      .map(([el, c]) => (c > 1 ? `${el}${c}` : el))
      .join('') || cleanFormulas.join('');
    stoichProducts.push({
      specKey: synthRaw,
      coeff: 1,
      formula: toSubscriptFormula(synthRaw),
      name: `${toSubscriptFormula(synthRaw)} Product`
    });
  }

  // Attempt matrix balancing if possible
  const balanced = balanceChemicalEquation(
    stoichReactants.map(r => r.specKey),
    stoichProducts.map(p => p.specKey)
  );
  if (balanced && balanced.reactantsCoeffs && balanced.productsCoeffs) {
    balanced.reactantsCoeffs.forEach((c, idx) => {
      if (stoichReactants[idx]) stoichReactants[idx].coeff = c;
    });
    balanced.productsCoeffs.forEach((c, idx) => {
      if (stoichProducts[idx]) stoichProducts[idx].coeff = c;
    });
  }

  const formattedLeft = stoichReactants
    .map(r => `${r.coeff > 1 ? r.coeff : ''}${r.formula}`)
    .join(' + ');
  const formattedRight = stoichProducts
    .map(p => `${p.coeff > 1 ? p.coeff : ''}${p.formula}`)
    .join(' + ');
  const finalEq = `${formattedLeft} → ${formattedRight}`;

  return {
    id: 'custom-reaction',
    name: 'Custom Stoichiometric Reaction',
    equation: finalEq,
    reactants: stoichReactants,
    products: stoichProducts,
    energyType: 'exothermic',
    tempBase: 25,
    tempPeak: 78,
    hasSparks: cleanFormulas.some(f => f === 'O2'),
    hasBubbles: stoichProducts.some(p => ['CO2', 'O2', 'H2', 'N2', 'NH3'].includes(p.specKey)),
    hasPrecipitate: stoichProducts.some(p => ['Cu', 'Fe', 'AgCl', 'CaO', 'Al2O3'].includes(p.specKey)),
    colorTheme: '#4E5B47',
    batches: 4
  };
}

export function resolveStoichiometricProfile(
  eq: string,
  currentReactants?: ReactantItem[]
): StoichiometricReactionProfile {
  const cleanEq = normalizeFormulaSubscripts(eq).trim();

  // 1. Match by active reactants if provided
  if (currentReactants && currentReactants.length > 0) {
    const matchedByReactants = findMatchedRule(currentReactants.map(r => r.formula));
    if (matchedByReactants) {
      return matchedByReactants;
    }
  }

  // 2. Match by equation string against extended rules
  const matchedByEq = EXTENDED_REACTIONS.find(
    r => normalizeFormulaSubscripts(r.equation).toLowerCase() === cleanEq.toLowerCase()
  );
  if (matchedByEq) {
    return matchedByEq;
  }

  // 3. Parse any equation of form "A + B -> C + D"
  if (eq.includes('→') || eq.includes('->') || eq.includes('=')) {
    const parts = eq.split(/[→\->=]/);
    if (parts.length >= 2) {
      const leftStr = parts[0].trim();
      const rightStr = parts[1].trim();
      if (leftStr && rightStr) {
        const parseSide = (side: string): StoichSpecies[] => {
          return side
            .split('+')
            .map(item => {
              const trimmed = item.trim();
              const match = trimmed.match(/^(\d*)\s*(.+)$/);
              const coeff = match && match[1] ? parseInt(match[1], 10) : 1;
              const rawFormula = match && match[2] ? match[2].trim() : trimmed;
              const specKey = normalizeChemicalFormulaInput(rawFormula);
              const meta = getReagentInfo(specKey);
              return {
                specKey,
                coeff,
                formula: toSubscriptFormula(specKey),
                name: meta.name.en || `${rawFormula} Compound`
              };
            })
            .filter(s => s.specKey.length > 0 && s.specKey !== '?' && s.specKey.toLowerCase() !== 'products');
        };

        const parsedReactants = parseSide(leftStr);
        const parsedProducts = parseSide(rightStr);

        if (parsedReactants.length > 0 && parsedProducts.length > 0) {
          // Check if parsed reactants match a known rule
          const ruleMatch = findMatchedRule(parsedReactants.map(r => r.specKey));
          if (ruleMatch) return ruleMatch;

          return {
            id: 'custom-reaction',
            name: 'Stoichiometric Chemical Transformation',
            equation: eq,
            reactants: parsedReactants,
            products: parsedProducts,
            energyType: 'exothermic',
            tempBase: 25,
            tempPeak: 75,
            hasSparks: parsedReactants.some(r => r.specKey === 'O2'),
            hasBubbles: parsedProducts.some(p => ['CO2', 'O2', 'H2', 'N2', 'NH3', 'Cl2'].includes(p.specKey)),
            hasPrecipitate: parsedProducts.some(p =>
              ['Cu', 'Fe', 'Al2O3', 'CaO', 'AgCl', 'BaSO4', 'PbI2', 'Cu(OH)2', 'Fe(OH)2'].includes(p.specKey)
            ),
            colorTheme: '#4E5B47',
            batches: 4
          };
        }
      }
    }
  }

  // 4. If currentReactants has items, build profile from those actual reactants
  if (currentReactants && currentReactants.length > 0) {
    return buildDynamicProfileFromReactants(currentReactants.map(r => r.formula));
  }

  // 5. Default Fallback: Water Synthesis
  return EXTENDED_REACTIONS[0];
}
