import { ReactantItem, ReactionState } from '../types/reaction';
import { calculateMolarMass, parseFormula } from './formulaParser';
import { balanceChemicalEquation } from './equationBalancer';

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

export function computeReaction(reactants: ReactantItem[]): Partial<ReactionState> {
  const formulas = reactants.map(r => r.formula.trim());
  if (formulas.length < 1) {
    return {
      status: 'idle',
      equation: '',
      reactionType: '',
      energyType: null,
      conditions: { temperature: null, pressure: null, catalyst: null },
      calculations: { limitingReagent: null, theoreticalYield: null, percentYield: null }
    };
  }

  // Check if matches preset
  const lowerSorted = [...formulas].map(f => f.toLowerCase()).sort();
  const matchedPreset = PRESET_REACTIONS.find(p => {
    const pSorted = [...p.reactants].map(f => f.toLowerCase()).sort();
    return (
      pSorted.length === lowerSorted.length &&
      pSorted.every((f, i) => f === lowerSorted[i])
    );
  });

  if (matchedPreset) {
    // Calculate stoichiometry based on reactant masses/moles
    const r1 = reactants[0];
    const r2 = reactants[1];
    const mass1 = r1?.massGrams ?? 10;
    const mw1 = calculateMolarMass(r1.formula) || 1;
    const moles1 = mass1 / mw1;

    let limiting = r1.formula;
    let minMoles = moles1;

    if (r2) {
      const mass2 = r2.massGrams ?? 10;
      const mw2 = calculateMolarMass(r2.formula) || 1;
      const moles2 = mass2 / mw2;
      if (moles2 < moles1) {
        limiting = r2.formula;
        minMoles = moles2;
      }
    }

    const theoreticalYieldGrams = (minMoles * mw1 * 0.95).toFixed(2);

    return {
      equation: matchedPreset.equation,
      reactionType: matchedPreset.reactionType,
      energyType: matchedPreset.energyType,
      deltaH: matchedPreset.deltaH,
      conditions: {
        temperature: matchedPreset.temperature,
        pressure: matchedPreset.pressure,
        catalyst: matchedPreset.catalyst
      },
      calculations: {
        limitingReagent: `${limiting} (${minMoles.toFixed(3)} mol)`,
        theoreticalYield: `${theoreticalYieldGrams} g`,
        percentYield: '92.4%'
      },
      status: 'complete'
    };
  }

  // Dynamic reaction logic
  if (formulas.length >= 2) {
    const f1 = formulas[0];
    const f2 = formulas[1];

    // Acid + Base -> Salt + Water
    const isAcid = f1.startsWith('H') || f2.startsWith('H');
    const isBase = f1.endsWith('OH') || f2.endsWith('OH');

    let dynamicType = 'Synthesis';
    let energy: 'exothermic' | 'endothermic' = 'exothermic';
    let eq = `${formulas.join(' + ')} → Products`;
    let temp = '25 – 100 °C';
    let press = '1 atm';
    let cat = 'None or Standard Catalyst';

    if (isAcid && isBase) {
      dynamicType = 'Acid-Base Neutralization';
      eq = `${formulas.join(' + ')} → Salt + H₂O`;
      temp = 'Room Temperature (25 °C)';
    } else if (formulas.some(f => f.toLowerCase() === 'o2')) {
      dynamicType = 'Oxidation / Combustion';
      eq = `${formulas.join(' + ')} → Oxides`;
      temp = 'Ignition Temperature';
    } else {
      dynamicType = 'Chemical Combination';
    }

    const r1 = reactants[0];
    const mass1 = r1?.massGrams ?? 10;
    const mw1 = calculateMolarMass(r1.formula) || 1;
    const moles1 = mass1 / mw1;

    return {
      equation: eq,
      reactionType: dynamicType,
      energyType: energy,
      deltaH: '-145.2 kJ/mol (estimated)',
      conditions: {
        temperature: temp,
        pressure: press,
        catalyst: cat
      },
      calculations: {
        limitingReagent: `${r1.formula} (${moles1.toFixed(3)} mol)`,
        theoreticalYield: `${(mass1 * 0.92).toFixed(2)} g`,
        percentYield: '88.5%'
      },
      status: 'complete'
    };
  }

  return {
    status: 'ready',
    equation: `${formulas.join(' + ')} → ?`,
    reactionType: 'Pending second reactant',
    energyType: null,
    conditions: { temperature: null, pressure: null, catalyst: null },
    calculations: { limitingReagent: null, theoreticalYield: null, percentYield: null }
  };
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
  batches: number; // default number of batches for full visual beaker representation
}

export function normalizeFormulaSubscripts(formula: string): string {
  if (!formula) return '';
  const map: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
  };
  return formula.replace(/[₀-₉]/g, m => map[m] || m).trim();
}

export function resolveStoichiometricProfile(eq: string): StoichiometricReactionProfile {
  const clean = normalizeFormulaSubscripts(eq).toLowerCase();

  // Water Synthesis 2H2 + O2 -> 2H2O
  if (clean.includes('h2o') && clean.includes('o2') && clean.includes('h2')) {
    return {
      id: 'water-synthesis',
      name: 'Formation of Water (Covalent Synthesis)',
      equation: '2H₂ + O₂ → 2H₂O',
      reactants: [
        { specKey: 'H2', coeff: 2, formula: 'H₂', name: 'Hydrogen' },
        { specKey: 'O2', coeff: 1, formula: 'O₂', name: 'Oxygen' }
      ],
      products: [
        { specKey: 'H2O', coeff: 2, formula: 'H₂O', name: 'Water' }
      ],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 280,
      hasSparks: true,
      hasBubbles: false,
      hasPrecipitate: false,
      colorTheme: '#DC2626',
      batches: 4
    };
  }

  // Methane Combustion CH4 + 2O2 -> CO2 + 2H2O
  if (clean.includes('ch4')) {
    return {
      id: 'methane-combustion',
      name: 'Hydrocarbon Combustion (High Exothermic)',
      equation: 'CH₄ + 2O₂ → CO₂ + 2H₂O',
      reactants: [
        { specKey: 'CH4', coeff: 1, formula: 'CH₄', name: 'Methane' },
        { specKey: 'O2', coeff: 2, formula: 'O₂', name: 'Oxygen' }
      ],
      products: [
        { specKey: 'CO2', coeff: 1, formula: 'CO₂', name: 'Carbon Dioxide' },
        { specKey: 'H2O', coeff: 2, formula: 'H₂O', name: 'Water' }
      ],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 620,
      hasSparks: true,
      hasBubbles: true,
      hasPrecipitate: false,
      colorTheme: '#EA580C',
      batches: 3
    };
  }

  // Haber-Bosch N2 + 3H2 -> 2NH3
  if (clean.includes('nh3') || (clean.includes('n2') && clean.includes('h2'))) {
    return {
      id: 'haber-process',
      name: 'Haber-Bosch Ammonia Synthesis (Catalyzed)',
      equation: 'N₂ + 3H₂ → 2NH₃',
      reactants: [
        { specKey: 'N2', coeff: 1, formula: 'N₂', name: 'Nitrogen' },
        { specKey: 'H2', coeff: 3, formula: 'H₂', name: 'Hydrogen' }
      ],
      products: [
        { specKey: 'NH3', coeff: 2, formula: 'NH₃', name: 'Ammonia' }
      ],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 450,
      hasSparks: false,
      hasBubbles: true,
      hasPrecipitate: false,
      colorTheme: '#2563EB',
      batches: 3
    };
  }

  // Acid-Base Neutralization HCl + NaOH -> NaCl + H2O
  if (clean.includes('hcl') || clean.includes('naoh') || clean.includes('neutralization')) {
    return {
      id: 'neutralization',
      name: 'Acid-Base Aqueous Neutralization',
      equation: 'HCl + NaOH → NaCl + H₂O',
      reactants: [
        { specKey: 'HCl', coeff: 1, formula: 'HCl', name: 'Hydrochloric Acid' },
        { specKey: 'NaOH', coeff: 1, formula: 'NaOH', name: 'Sodium Hydroxide' }
      ],
      products: [
        { specKey: 'NaCl', coeff: 1, formula: 'NaCl', name: 'Sodium Chloride' },
        { specKey: 'H2O', coeff: 1, formula: 'H₂O', name: 'Water' }
      ],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 58,
      hasSparks: false,
      hasBubbles: false,
      hasPrecipitate: false,
      colorTheme: '#16A34A',
      batches: 5
    };
  }

  // Single Displacement Fe + CuSO4 -> FeSO4 + Cu
  if (clean.includes('cuso4') || clean.includes('cuso') || (clean.includes('cu') && clean.includes('fe'))) {
    return {
      id: 'copper-displacement',
      name: 'Single Displacement & Redox Precipitation',
      equation: 'Fe + CuSO₄ → FeSO₄ + Cu',
      reactants: [
        { specKey: 'Fe', coeff: 1, formula: 'Fe', name: 'Iron' },
        { specKey: 'CuSO4', coeff: 1, formula: 'CuSO₄', name: 'Copper Sulfate' }
      ],
      products: [
        { specKey: 'FeSO4', coeff: 1, formula: 'FeSO₄', name: 'Iron(II) Sulfate' },
        { specKey: 'Cu', coeff: 1, formula: 'Cu', name: 'Copper Precipitate' }
      ],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 48,
      hasSparks: false,
      hasBubbles: false,
      hasPrecipitate: true,
      colorTheme: '#C2410C',
      batches: 5
    };
  }

  // Catalytic Peroxide Decomposition 2H2O2 -> 2H2O + O2
  if (clean.includes('h2o2')) {
    return {
      id: 'peroxide-decomposition',
      name: 'Catalytic Effervescent Decomposition',
      equation: '2H₂O₂ → 2H₂O + O₂',
      reactants: [
        { specKey: 'H2O2', coeff: 2, formula: 'H₂O₂', name: 'Hydrogen Peroxide' }
      ],
      products: [
        { specKey: 'H2O', coeff: 2, formula: 'H₂O', name: 'Water' },
        { specKey: 'O2', coeff: 1, formula: 'O₂', name: 'Oxygen Gas' }
      ],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 85,
      hasSparks: false,
      hasBubbles: true,
      hasPrecipitate: false,
      colorTheme: '#0284C7',
      batches: 4
    };
  }

  // Thermite Reaction 2Al + Fe2O3 -> Al2O3 + 2Fe
  if (clean.includes('al') && (clean.includes('fe2o3') || clean.includes('fe₂o₃'))) {
    return {
      id: 'thermite',
      name: 'Thermite Incandescent Redox',
      equation: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe',
      reactants: [
        { specKey: 'Al', coeff: 2, formula: 'Al', name: 'Aluminum' },
        { specKey: 'Fe2O3', coeff: 1, formula: 'Fe₂O₃', name: 'Iron(III) Oxide' }
      ],
      products: [
        { specKey: 'Al2O3', coeff: 1, formula: 'Al₂O₃', name: 'Aluminum Oxide' },
        { specKey: 'Fe', coeff: 2, formula: 'Fe', name: 'Molten Iron' }
      ],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 1450,
      hasSparks: true,
      hasBubbles: false,
      hasPrecipitate: true,
      colorTheme: '#F59E0B',
      batches: 3
    };
  }

  // Limestone Calcination CaCO3 -> CaO + CO2
  if (clean.includes('caco3')) {
    return {
      id: 'calcination',
      name: 'Limestone Endothermic Calcination',
      equation: 'CaCO₃ → CaO + CO₂',
      reactants: [
        { specKey: 'CaCO3', coeff: 1, formula: 'CaCO₃', name: 'Calcium Carbonate' }
      ],
      products: [
        { specKey: 'CaO', coeff: 1, formula: 'CaO', name: 'Calcium Oxide' },
        { specKey: 'CO2', coeff: 1, formula: 'CO₂', name: 'Carbon Dioxide Gas' }
      ],
      energyType: 'endothermic',
      tempBase: 25,
      tempPeak: 880,
      hasSparks: false,
      hasBubbles: true,
      hasPrecipitate: true,
      colorTheme: '#4F46E5',
      batches: 5
    };
  }

  // Dynamic parser for any arbitrary equation: "A + B -> C + D"
  if (eq.includes('→') || eq.includes('->') || eq.includes('=')) {
    const parts = eq.split(/[→\->=]/);
    if (parts.length >= 2) {
      const leftStr = parts[0].trim();
      const rightStr = parts[1].trim();
      if (leftStr && rightStr) {
        const parseSide = (side: string): StoichSpecies[] => {
          return side.split('+').map(item => {
            const trimmed = item.trim();
            const match = trimmed.match(/^(\d*)\s*(.+)$/);
            const coeff = match && match[1] ? parseInt(match[1], 10) : 1;
            const formula = match && match[2] ? match[2].trim() : trimmed;
            const specKey = normalizeFormulaSubscripts(formula);
            return {
              specKey,
              coeff,
              formula,
              name: `${formula} Compound`
            };
          }).filter(s => s.formula.length > 0 && s.formula !== '?');
        };

        const parsedReactants = parseSide(leftStr);
        const parsedProducts = parseSide(rightStr);

        if (parsedReactants.length > 0 && parsedProducts.length > 0 && !parsedProducts.some(p => p.formula.toLowerCase() === 'products')) {
          return {
            id: 'custom-reaction',
            name: 'Stoichiometric Chemical Transformation',
            equation: eq,
            reactants: parsedReactants,
            products: parsedProducts,
            energyType: 'exothermic',
            tempBase: 25,
            tempPeak: 75,
            hasSparks: false,
            hasBubbles: parsedProducts.some(p => ['CO2', 'O2', 'H2', 'N2', 'NH3', 'Cl2'].includes(p.specKey)),
            hasPrecipitate: parsedProducts.some(p => ['Cu', 'Fe', 'Al2O3', 'CaO', 'AgCl', 'BaSO4', 'PbI2'].includes(p.specKey)),
            colorTheme: '#4E5B47',
            batches: 4
          };
        }
      }
    }
  }

  // Default Fallback Reaction: Water Synthesis 2H2 + O2 -> 2H2O
  return {
    id: 'general-synthesis',
    name: 'Chemical Recombination & Bond Synthesis',
    equation: '2H₂ + O₂ → 2H₂O',
    reactants: [
      { specKey: 'H2', coeff: 2, formula: 'H₂', name: 'Hydrogen' },
      { specKey: 'O2', coeff: 1, formula: 'O₂', name: 'Oxygen' }
    ],
    products: [
      { specKey: 'H2O', coeff: 2, formula: 'H₂O', name: 'Water' }
    ],
    energyType: 'exothermic',
    tempBase: 25,
    tempPeak: 120,
    hasSparks: true,
    hasBubbles: false,
    hasPrecipitate: false,
    colorTheme: '#4E5B47',
    batches: 4
  };
}


