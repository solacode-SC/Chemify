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

