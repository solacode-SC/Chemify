import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ReactantItem, ReactionStatus } from '../../types/reaction';
import { parseFormula } from '../../utils/formulaParser';

interface ReactionDiagramProps {
  status: ReactionStatus;
  equation: string;
  reactionType?: string;
  energyType?: 'exothermic' | 'endothermic' | null;
  deltaH?: string;
  conditions?: { temperature: string | null; pressure: string | null; catalyst: string | null };
  reactants?: ReactantItem[];
  onReset?: () => void;
  onComplete?: () => void;
}

// ==========================================
// Atomic & Molecular Geometry Specifications
// ==========================================
export interface AtomNode {
  sym: string;
  dx: number;
  dy: number;
  r: number;
  color: string;
  textColor?: string;
  border?: string;
}

export interface BondEdge {
  from: number;
  to: number;
  order?: 1 | 2 | 3;
}

export interface MoleculeSpec {
  formula: string;
  name: string;
  atoms: AtomNode[];
  bonds: BondEdge[];
  isGas?: boolean;
  isPrecipitate?: boolean;
}

export const MOLECULE_SPECS: Record<string, MoleculeSpec> = {
  // Diatomic Hydrogen H2
  H2: {
    formula: 'H₂',
    name: 'Hydrogen',
    atoms: [
      { sym: 'H', dx: -7, dy: 0, r: 7, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' },
      { sym: 'H', dx: 7, dy: 0, r: 7, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' }
    ],
    bonds: [{ from: 0, to: 1, order: 1 }],
    isGas: true
  },
  // Diatomic Oxygen O2
  O2: {
    formula: 'O₂',
    name: 'Oxygen',
    atoms: [
      { sym: 'O', dx: -9, dy: 0, r: 9.5, color: '#DC2626', textColor: '#FAF8F5' },
      { sym: 'O', dx: 9, dy: 0, r: 9.5, color: '#DC2626', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 2 }],
    isGas: true
  },
  // Bent Water H2O (104.5 deg angle)
  H2O: {
    formula: 'H₂O',
    name: 'Water',
    atoms: [
      { sym: 'O', dx: 0, dy: -4, r: 10, color: '#DC2626', textColor: '#FAF8F5' },
      { sym: 'H', dx: -10, dy: 6, r: 6.5, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' },
      { sym: 'H', dx: 10, dy: 6, r: 6.5, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 }
    ]
  },
  // Tetrahedral Methane CH4
  CH4: {
    formula: 'CH₄',
    name: 'Methane',
    atoms: [
      { sym: 'C', dx: 0, dy: 0, r: 11, color: '#374151', textColor: '#FAF8F5' },
      { sym: 'H', dx: 0, dy: -14, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' },
      { sym: 'H', dx: -13, dy: 6, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' },
      { sym: 'H', dx: 13, dy: 6, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 }
    ],
    isGas: true
  },
  // Linear Carbon Dioxide CO2
  CO2: {
    formula: 'CO₂',
    name: 'Carbon Dioxide',
    atoms: [
      { sym: 'C', dx: 0, dy: 0, r: 9.5, color: '#374151', textColor: '#FAF8F5' },
      { sym: 'O', dx: -18, dy: 0, r: 9, color: '#DC2626', textColor: '#FAF8F5' },
      { sym: 'O', dx: 18, dy: 0, r: 9, color: '#DC2626', textColor: '#FAF8F5' }
    ],
    bonds: [
      { from: 0, to: 1, order: 2 },
      { from: 0, to: 2, order: 2 }
    ],
    isGas: true
  },
  // Nitrogen N2 (Triple Bond)
  N2: {
    formula: 'N₂',
    name: 'Nitrogen',
    atoms: [
      { sym: 'N', dx: -8.5, dy: 0, r: 9.5, color: '#2563EB', textColor: '#FAF8F5' },
      { sym: 'N', dx: 8.5, dy: 0, r: 9.5, color: '#2563EB', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 3 }],
    isGas: true
  },
  // Ammonia NH3 (Pyramidal)
  NH3: {
    formula: 'NH₃',
    name: 'Ammonia',
    atoms: [
      { sym: 'N', dx: 0, dy: -4, r: 10, color: '#2563EB', textColor: '#FAF8F5' },
      { sym: 'H', dx: -11, dy: 7, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' },
      { sym: 'H', dx: 11, dy: 7, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' },
      { sym: 'H', dx: 0, dy: 13, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 0, to: 2, order: 1 },
      { from: 0, to: 3, order: 1 }
    ],
    isGas: true
  },
  // Hydrochloric Acid HCl
  HCl: {
    formula: 'HCl',
    name: 'Hydrochloric Acid',
    atoms: [
      { sym: 'H⁺', dx: -9, dy: 0, r: 6.5, color: '#60A5FA', textColor: '#FAF8F5' },
      { sym: 'Cl⁻', dx: 8, dy: 0, r: 12, color: '#16A34A', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 1 }]
  },
  // Sodium Hydroxide NaOH
  NaOH: {
    formula: 'NaOH',
    name: 'Sodium Hydroxide',
    atoms: [
      { sym: 'Na⁺', dx: -12, dy: 0, r: 10, color: '#9333EA', textColor: '#FAF8F5' },
      { sym: 'O', dx: 4, dy: -3, r: 9, color: '#DC2626', textColor: '#FAF8F5' },
      { sym: 'H', dx: 14, dy: 4, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 }
    ]
  },
  // Sodium Chloride NaCl
  NaCl: {
    formula: 'NaCl',
    name: 'Sodium Chloride (Salt)',
    atoms: [
      { sym: 'Na⁺', dx: -9, dy: 0, r: 10, color: '#9333EA', textColor: '#FAF8F5' },
      { sym: 'Cl⁻', dx: 9, dy: 0, r: 12, color: '#16A34A', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 1 }]
  },
  // Metallic Iron Fe
  Fe: {
    formula: 'Fe',
    name: 'Iron Metal',
    atoms: [{ sym: 'Fe', dx: 0, dy: 0, r: 11, color: '#64748B', textColor: '#FAF8F5', border: '#334155' }],
    bonds: [],
    isPrecipitate: true
  },
  // Copper Sulfate CuSO4
  CuSO4: {
    formula: 'CuSO₄',
    name: 'Copper Sulfate',
    atoms: [
      { sym: 'Cu²', dx: -9, dy: 0, r: 11, color: '#0284C7', textColor: '#FAF8F5' },
      { sym: 'S', dx: 9, dy: 0, r: 8.5, color: '#D97706', textColor: '#FAF8F5' },
      { sym: 'O', dx: 15, dy: -7, r: 5.5, color: '#DC2626' },
      { sym: 'O', dx: 15, dy: 7, r: 5.5, color: '#DC2626' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 1, to: 3, order: 1 }
    ]
  },
  // Iron Sulfate FeSO4
  FeSO4: {
    formula: 'FeSO₄',
    name: 'Iron(II) Sulfate',
    atoms: [
      { sym: 'Fe²', dx: -9, dy: 0, r: 11, color: '#10B981', textColor: '#FAF8F5' },
      { sym: 'S', dx: 9, dy: 0, r: 8.5, color: '#D97706', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 1 }]
  },
  // Copper Precipitate Cu
  Cu: {
    formula: 'Cu',
    name: 'Copper Precipitate',
    atoms: [{ sym: 'Cu', dx: 0, dy: 0, r: 11, color: '#C2410C', textColor: '#FAF8F5', border: '#7C2D12' }],
    bonds: [],
    isPrecipitate: true
  },
  // Hydrogen Peroxide H2O2
  H2O2: {
    formula: 'H₂O₂',
    name: 'Hydrogen Peroxide',
    atoms: [
      { sym: 'H', dx: -14, dy: -4, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' },
      { sym: 'O', dx: -5, dy: 2, r: 9, color: '#DC2626', textColor: '#FAF8F5' },
      { sym: 'O', dx: 5, dy: -2, r: 9, color: '#DC2626', textColor: '#FAF8F5' },
      { sym: 'H', dx: 14, dy: 4, r: 6, color: '#FAF8F5', textColor: '#4E5B47', border: '#6F7F63' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 },
      { from: 2, to: 3, order: 1 }
    ]
  },
  // Aluminum Al
  Al: {
    formula: 'Al',
    name: 'Aluminum',
    atoms: [{ sym: 'Al', dx: 0, dy: 0, r: 10, color: '#94A3B8', textColor: '#0F172A', border: '#64748B' }],
    bonds: []
  },
  // Iron(III) Oxide Fe2O3
  Fe2O3: {
    formula: 'Fe₂O₃',
    name: 'Iron(III) Oxide',
    atoms: [
      { sym: 'Fe', dx: -10, dy: 0, r: 10, color: '#7C2D12', textColor: '#FAF8F5' },
      { sym: 'O', dx: 0, dy: 0, r: 7.5, color: '#DC2626' },
      { sym: 'Fe', dx: 10, dy: 0, r: 10, color: '#7C2D12', textColor: '#FAF8F5' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 }
    ]
  },
  // Aluminum Oxide Al2O3
  Al2O3: {
    formula: 'Al₂O₃',
    name: 'Aluminum Oxide',
    atoms: [
      { sym: 'Al', dx: -9, dy: 0, r: 9, color: '#E2E8F0', textColor: '#1E293B' },
      { sym: 'O', dx: 0, dy: 0, r: 7, color: '#DC2626' },
      { sym: 'Al', dx: 9, dy: 0, r: 9, color: '#E2E8F0', textColor: '#1E293B' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 }
    ],
    isPrecipitate: true
  },
  // Calcium Carbonate CaCO3
  CaCO3: {
    formula: 'CaCO₃',
    name: 'Calcium Carbonate',
    atoms: [
      { sym: 'Ca²', dx: -9, dy: 0, r: 11, color: '#E0E7FF', textColor: '#312E81' },
      { sym: 'C', dx: 6, dy: 0, r: 8, color: '#374151' },
      { sym: 'O', dx: 12, dy: -6, r: 6, color: '#DC2626' }
    ],
    bonds: [
      { from: 0, to: 1, order: 1 },
      { from: 1, to: 2, order: 1 }
    ],
    isPrecipitate: true
  },
  // Calcium Oxide CaO
  CaO: {
    formula: 'CaO',
    name: 'Calcium Oxide',
    atoms: [
      { sym: 'Ca', dx: -8, dy: 0, r: 11, color: '#E0E7FF', textColor: '#312E81' },
      { sym: 'O', dx: 8, dy: 0, r: 8.5, color: '#DC2626', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 2 }],
    isPrecipitate: true
  }
};

// ==========================================
// Stoichiometric Item Definition
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

export function resolveStoichiometricProfile(eq: string): StoichiometricReactionProfile {
  const clean = eq.toLowerCase();

  // Water Synthesis 2H2 + O2 -> 2H2O
  if (clean.includes('h₂o') && clean.includes('o₂') && (clean.includes('h₂') || clean.includes('h2'))) {
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
      batches: 4 // yields 8 H2 + 4 O2 -> 8 H2O
    };
  }

  // Methane Combustion CH4 + 2O2 -> CO2 + 2H2O
  if (clean.includes('ch₄') || clean.includes('ch4')) {
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
      batches: 3 // yields 3 CH4 + 6 O2 -> 3 CO2 + 6 H2O
    };
  }

  // Haber-Bosch N2 + 3H2 -> 2NH3
  if ((clean.includes('nh₃') || clean.includes('nh3')) || (clean.includes('n₂') && clean.includes('h₂'))) {
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
      hasSparks: true,
      hasBubbles: true,
      hasPrecipitate: false,
      colorTheme: '#2563EB',
      batches: 3 // yields 3 N2 + 9 H2 -> 6 NH3
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
      tempPeak: 65,
      hasSparks: false,
      hasBubbles: false,
      hasPrecipitate: false,
      colorTheme: '#16A34A',
      batches: 5 // yields 5 HCl + 5 NaOH -> 5 NaCl + 5 H2O
    };
  }

  // Single Displacement Fe + CuSO4 -> FeSO4 + Cu
  if (clean.includes('cuso') || (clean.includes('cu') && clean.includes('fe'))) {
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
      tempPeak: 55,
      hasSparks: true,
      hasBubbles: false,
      hasPrecipitate: true,
      colorTheme: '#C2410C',
      batches: 5 // yields 5 Fe + 5 CuSO4 -> 5 FeSO4 + 5 Cu
    };
  }

  // Catalytic Peroxide Decomposition 2H2O2 -> 2H2O + O2
  if (clean.includes('h2o2') || clean.includes('h₂o₂')) {
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
      batches: 4 // yields 8 H2O2 -> 8 H2O + 4 O2
    };
  }

  // Thermite Reaction 2Al + Fe2O3 -> Al2O3 + 2Fe
  if (clean.includes('al') && clean.includes('fe₂o₃')) {
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
      batches: 3 // yields 6 Al + 3 Fe2O3 -> 3 Al2O3 + 6 Fe
    };
  }

  // Limestone Calcination CaCO3 -> CaO + CO2
  if (clean.includes('caco3') || clean.includes('caco₃')) {
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
      batches: 5 // yields 5 CaCO3 -> 5 CaO + 5 CO2
    };
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

export const ReactionDiagram: React.FC<ReactionDiagramProps> = ({
  status,
  equation,
  reactionType,
  energyType,
  deltaH,
  reactants,
  onReset,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showIllustration, setShowIllustration] = useState(false);
  const [simSpeed, setSimSpeed] = useState<1 | 2>(1);
  const [temperature, setTemperature] = useState<number>(25);

  const profile = useMemo(() => resolveStoichiometricProfile(equation), [equation]);

  // Live stoichiometric counters for the HUD
  const [reactantsRemaining, setReactantsRemaining] = useState<Record<string, number>>({});
  const [productsGenerated, setProductsGenerated] = useState<Record<string, number>>({});
  const [completedBatchesCount, setCompletedBatchesCount] = useState<number>(0);

  // Setup / reset simulation state ref
  const simStateRef = useRef<{
    completedBatches: number;
    totalBatches: number;
    lastReactionTime: number;
  }>({
    completedBatches: 0,
    totalBatches: profile.batches,
    lastReactionTime: 0
  });

  useEffect(() => {
    simStateRef.current = {
      completedBatches: status === 'complete' ? profile.batches : 0,
      totalBatches: profile.batches,
      lastReactionTime: 0
    };
    setCompletedBatchesCount(status === 'complete' ? profile.batches : 0);

    // Initial counts based on equation stoichiometry
    const rCounts: Record<string, number> = {};
    const pCounts: Record<string, number> = {};

    profile.reactants.forEach(r => {
      rCounts[r.specKey] = status === 'complete' ? 0 : r.coeff * profile.batches;
    });
    profile.products.forEach(p => {
      pCounts[p.specKey] = status === 'complete' ? p.coeff * profile.batches : 0;
    });

    setReactantsRemaining(rCounts);
    setProductsGenerated(pCounts);
  }, [profile, status]);

  // Main Canvas Animation Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    interface SimMolecule {
      id: number;
      specKey: string;
      spec: MoleculeSpec;
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      vAngle: number;
      isProduct: boolean;
      flash: number;
      settled: boolean;
    }

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }

    interface Bubble {
      x: number;
      y: number;
      r: number;
      vy: number;
      drift: number;
    }

    interface Shockwave {
      x: number;
      y: number;
      r: number;
      maxR: number;
      alpha: number;
      color: string;
    }

    let molecules: SimMolecule[] = [];
    let sparks: Spark[] = [];
    let bubbles: Bubble[] = [];
    let shockwaves: Shockwave[] = [];
    let currentTemp = profile.tempBase;
    let nextId = 1;

    const getBeakerBounds = () => {
      const padX = Math.max(28, width * 0.08);
      const topY = 46;
      const botY = height - 38;
      return {
        left: padX,
        right: width - padX,
        top: topY,
        bottom: botY,
        width: width - padX * 2,
        height: botY - topY
      };
    };

    // Populate initial stoichiometric molecules strictly in accordance with equation!
    const initSimulation = () => {
      molecules = [];
      sparks = [];
      bubbles = [];
      shockwaves = [];
      currentTemp = status === 'complete' ? (profile.energyType === 'exothermic' ? profile.tempPeak * 0.75 : profile.tempPeak) : profile.tempBase;
      setTemperature(Math.round(currentTemp));

      const bounds = getBeakerBounds();
      const batches = profile.batches;

      if (status === 'complete') {
        // Direct complete state: only product molecules in exact equation stoichiometry!
        profile.products.forEach(p => {
          const spec = MOLECULE_SPECS[p.specKey] || MOLECULE_SPECS['H2O'];
          const totalProducts = p.coeff * batches;
          for (let i = 0; i < totalProducts; i++) {
            molecules.push({
              id: nextId++,
              specKey: p.specKey,
              spec,
              x: bounds.left + 24 + Math.random() * (bounds.width - 48),
              y: spec.isPrecipitate
                ? bounds.bottom - 12 - (i % 3) * 6
                : bounds.top + 30 + Math.random() * (bounds.height - 50),
              vx: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.9,
              vy: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.9,
              angle: Math.random() * Math.PI * 2,
              vAngle: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.03,
              isProduct: true,
              flash: 0,
              settled: Boolean(spec.isPrecipitate)
            });
          }
        });
      } else {
        // Initial state: only reactant molecules in exact equation stoichiometry!
        profile.reactants.forEach(r => {
          const spec = MOLECULE_SPECS[r.specKey] || MOLECULE_SPECS['H2'];
          const totalReactants = r.coeff * batches;
          for (let i = 0; i < totalReactants; i++) {
            molecules.push({
              id: nextId++,
              specKey: r.specKey,
              spec,
              x: bounds.left + 24 + Math.random() * (bounds.width - 48),
              y: bounds.top + 30 + Math.random() * (bounds.height - 50),
              vx: (Math.random() - 0.5) * 1.2,
              vy: (Math.random() - 0.5) * 1.2,
              angle: Math.random() * Math.PI * 2,
              vAngle: (Math.random() - 0.5) * 0.04,
              isProduct: false,
              flash: 0,
              settled: false
            });
          }
        });
      }
    };

    // Execute one stoichiometric turnover batch strictly according to the equation
    const executeStoichiometricBatch = () => {
      if (simStateRef.current.completedBatches >= profile.batches) {
        return;
      }

      // Check if we have enough of each reactant species
      const toRemove: SimMolecule[] = [];
      let canReact = true;

      for (const r of profile.reactants) {
        const available = molecules.filter(
          m => !m.isProduct && m.specKey === r.specKey && !toRemove.some(rem => rem.id === m.id)
        );
        if (available.length < r.coeff) {
          canReact = false;
          break;
        }
        toRemove.push(...available.slice(0, r.coeff));
      }

      if (!canReact || toRemove.length === 0) {
        return;
      }

      // Determine reaction collision epicenter
      let avgX = 0;
      let avgY = 0;
      toRemove.forEach(m => {
        avgX += m.x;
        avgY += m.y;
      });
      avgX /= toRemove.length;
      avgY /= toRemove.length;

      // Remove the exact stoichiometric reactant molecules
      const removeIds = new Set(toRemove.map(m => m.id));
      molecules = molecules.filter(m => !removeIds.has(m.id));

      // Generate the exact stoichiometric product molecules from the epicenter!
      const bounds = getBeakerBounds();
      profile.products.forEach(p => {
        const spec = MOLECULE_SPECS[p.specKey] || MOLECULE_SPECS['H2O'];
        for (let i = 0; i < p.coeff; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.0 + Math.random() * 1.2;
          molecules.push({
            id: nextId++,
            specKey: p.specKey,
            spec,
            x: avgX + (Math.random() - 0.5) * 20,
            y: avgY + (Math.random() - 0.5) * 20,
            vx: spec.isPrecipitate ? (Math.random() - 0.5) * 0.3 : Math.cos(angle) * speed,
            vy: spec.isPrecipitate ? 1.0 + Math.random() * 0.8 : Math.sin(angle) * speed,
            angle,
            vAngle: (Math.random() - 0.5) * 0.05,
            isProduct: true,
            flash: 1.0,
            settled: false
          });
        }
      });

      // Visual effects: Thermal shockwave
      shockwaves.push({
        x: avgX,
        y: avgY,
        r: 6,
        maxR: profile.energyType === 'exothermic' ? 50 : 35,
        alpha: 0.85,
        color: profile.energyType === 'exothermic' ? '255, 120, 30' : '96, 165, 250'
      });

      // Sparks
      if (profile.hasSparks) {
        for (let s = 0; s < 10; s++) {
          sparks.push({
            x: avgX,
            y: avgY,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5 - 0.8,
            alpha: 1.0,
            color: Math.random() > 0.4 ? '#F59E0B' : '#DC2626',
            size: 2.2 + Math.random() * 2.5
          });
        }
      }

      // Bubbles for gas evolution
      if (profile.hasBubbles || profile.products.some(p => MOLECULE_SPECS[p.specKey]?.isGas)) {
        for (let b = 0; b < 4; b++) {
          bubbles.push({
            x: avgX + (Math.random() - 0.5) * 30,
            y: avgY + (Math.random() - 0.5) * 15,
            r: 3 + Math.random() * 4,
            vy: -1.3 - Math.random() * 1.5,
            drift: (Math.random() - 0.5) * 0.5
          });
        }
      }

      simStateRef.current.completedBatches++;
      const currentCompleted = simStateRef.current.completedBatches;
      setCompletedBatchesCount(currentCompleted);

      // Update HUD reactant and product counters
      const remaining: Record<string, number> = {};
      const generated: Record<string, number> = {};

      profile.reactants.forEach(r => {
        remaining[r.specKey] = Math.max(0, (profile.batches - currentCompleted) * r.coeff);
      });
      profile.products.forEach(p => {
        generated[p.specKey] = currentCompleted * p.coeff;
      });

      setReactantsRemaining(remaining);
      setProductsGenerated(generated);

      // Trigger completion confetti & callback if all batches finished
      if (currentCompleted >= profile.batches) {
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4E5B47', '#6F7F63', '#8FA882', '#E6E2D3', '#D97706']
          });
          onComplete?.();
        }, 500);
      }
    };

    initSimulation();

    // ==========================================
    // Render Loop
    // ==========================================
    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const bounds = getBeakerBounds();
      const speedMult = (status === 'running' ? 2.2 : status === 'complete' ? 1.0 : 0.75) * simSpeed;

      // Automated stoichiometric reaction timer during 'running'
      if (status === 'running' && simStateRef.current.completedBatches < profile.batches) {
        const interval = Math.max(30, Math.floor(65 / simSpeed));
        if (frame % interval === 0) {
          executeStoichiometricBatch();
        }
      }

      // Dynamic temperature curve
      if (status === 'running' || status === 'complete') {
        const target =
          profile.energyType === 'exothermic'
            ? profile.tempBase + (profile.tempPeak - profile.tempBase) * (simStateRef.current.completedBatches / profile.batches)
            : profile.tempBase - (profile.tempBase - 5) * (simStateRef.current.completedBatches / profile.batches);
        currentTemp += (target - currentTemp) * 0.05;
      } else {
        currentTemp += (profile.tempBase - currentTemp) * 0.05;
      }

      if (frame % 6 === 0) {
        setTemperature(Math.round(currentTemp));
      }

      // 1. Draw Laboratory Beaker Vessel with Volume Graduations
      ctx.save();
      ctx.strokeStyle = '#6F7F63';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Rim with spout
      ctx.beginPath();
      ctx.moveTo(bounds.left - 12, bounds.top - 6);
      ctx.lineTo(bounds.left, bounds.top);
      ctx.lineTo(bounds.right, bounds.top);
      ctx.lineTo(bounds.right + 6, bounds.top - 6);
      ctx.stroke();

      // Body and curved base
      ctx.beginPath();
      ctx.moveTo(bounds.left, bounds.top);
      ctx.lineTo(bounds.left, bounds.bottom - 16);
      ctx.quadraticCurveTo(bounds.left, bounds.bottom, bounds.left + 16, bounds.bottom);
      ctx.lineTo(bounds.right - 16, bounds.bottom);
      ctx.quadraticCurveTo(bounds.right, bounds.bottom, bounds.right, bounds.bottom - 16);
      ctx.lineTo(bounds.right, bounds.top);
      ctx.stroke();

      // Fluid Fill
      ctx.fillStyle =
        profile.energyType === 'exothermic' && (status === 'running' || status === 'complete')
          ? 'rgba(254, 243, 199, 0.38)'
          : 'rgba(235, 242, 232, 0.45)';
      ctx.beginPath();
      ctx.moveTo(bounds.left + 2, bounds.top + 20);
      ctx.lineTo(bounds.left + 2, bounds.bottom - 16);
      ctx.quadraticCurveTo(bounds.left + 2, bounds.bottom - 2, bounds.left + 16, bounds.bottom - 2);
      ctx.lineTo(bounds.right - 16, bounds.bottom - 2);
      ctx.quadraticCurveTo(bounds.right - 2, bounds.bottom - 2, bounds.right - 2, bounds.bottom - 16);
      ctx.lineTo(bounds.right - 2, bounds.top + 20);
      ctx.closePath();
      ctx.fill();

      // Beaker Graduations
      ctx.strokeStyle = 'rgba(111, 127, 99, 0.45)';
      ctx.fillStyle = '#5F6F5B';
      ctx.font = '10px Inter, sans-serif';
      ctx.lineWidth = 1.2;

      const gradSteps = [
        { label: '400 ml', pct: 0.25 },
        { label: '300 ml', pct: 0.45 },
        { label: '200 ml', pct: 0.65 },
        { label: '100 ml', pct: 0.85 }
      ];

      gradSteps.forEach(g => {
        const y = bounds.top + bounds.height * g.pct;
        ctx.beginPath();
        ctx.moveTo(bounds.left + 2, y);
        ctx.lineTo(bounds.left + 16, y);
        ctx.stroke();
        ctx.fillText(g.label, bounds.left + 20, y + 3.5);
      });
      ctx.restore();

      // 2. Active Shockwaves
      for (let w = shockwaves.length - 1; w >= 0; w--) {
        const wave = shockwaves[w];
        wave.r += 2.0 * simSpeed;
        wave.alpha -= 0.03 * simSpeed;
        if (wave.alpha <= 0 || wave.r >= wave.maxR) {
          shockwaves.splice(w, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(${wave.color}, ${wave.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3. Bubbles in Gas Evolution
      for (let b = bubbles.length - 1; b >= 0; b--) {
        const bubble = bubbles[b];
        bubble.y += bubble.vy * simSpeed;
        bubble.x += bubble.drift;
        if (bubble.y <= bounds.top + 16) {
          bubbles.splice(b, 1);
          continue;
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.strokeStyle = 'rgba(111, 127, 99, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // 4. Update and Draw Molecules
      for (let i = 0; i < molecules.length; i++) {
        const m = molecules[i];

        if (!m.settled) {
          m.x += m.vx * speedMult;
          m.y += m.vy * speedMult;
          m.angle += m.vAngle * speedMult;

          // Precipitate settling down to bottom
          if (m.spec.isPrecipitate && m.isProduct) {
            if (m.y >= bounds.bottom - 16) {
              m.y = bounds.bottom - 12 - (m.id % 4) * 4;
              m.vx = 0;
              m.vy = 0;
              m.vAngle = 0;
              m.settled = true;
            }
          }

          // Boundary Collisions
          const pad = 16;
          if (m.x < bounds.left + pad) {
            m.x = bounds.left + pad;
            m.vx = Math.abs(m.vx);
          } else if (m.x > bounds.right - pad) {
            m.x = bounds.right - pad;
            m.vx = -Math.abs(m.vx);
          }

          if (m.y < bounds.top + 24) {
            m.y = bounds.top + 24;
            m.vy = Math.abs(m.vy);
          } else if (m.y > bounds.bottom - pad && !m.settled) {
            m.y = bounds.bottom - pad;
            m.vy = -Math.abs(m.vy);
          }
        }

        // Draw Molecule with Bonds and CPK Atoms
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);

        // Activation Energy Flash Glow
        if (m.flash > 0) {
          m.flash -= 0.035 * simSpeed;
          ctx.beginPath();
          ctx.arc(0, 0, 26, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 235, 160, ${m.flash * 0.75})`;
          ctx.fill();
        }

        // Covalent Bonds
        m.spec.bonds.forEach(bond => {
          const a1 = m.spec.atoms[bond.from];
          const a2 = m.spec.atoms[bond.to];
          if (!a1 || !a2) return;

          ctx.strokeStyle = '#4E5B47';
          if (bond.order === 3) {
            ctx.lineWidth = 1.2;
            [-2.5, 0, 2.5].forEach(offset => {
              ctx.beginPath();
              ctx.moveTo(a1.dx, a1.dy + offset);
              ctx.lineTo(a2.dx, a2.dy + offset);
              ctx.stroke();
            });
          } else if (bond.order === 2) {
            ctx.lineWidth = 1.4;
            [-2, 2].forEach(offset => {
              ctx.beginPath();
              ctx.moveTo(a1.dx, a1.dy + offset);
              ctx.lineTo(a2.dx, a2.dy + offset);
              ctx.stroke();
            });
          } else {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(a1.dx, a1.dy);
            ctx.lineTo(a2.dx, a2.dy);
            ctx.stroke();
          }
        });

        // Atoms in Molecule
        m.spec.atoms.forEach(atom => {
          ctx.beginPath();
          ctx.arc(atom.dx, atom.dy, atom.r, 0, Math.PI * 2);
          ctx.fillStyle = atom.color;
          ctx.fill();

          ctx.strokeStyle = atom.border || '#334155';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Atom Symbol Label
          if (atom.sym) {
            ctx.fillStyle = atom.textColor || '#FAF8F5';
            ctx.font = `bold ${Math.max(8, atom.r * 0.95)}px Inter, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(atom.sym, atom.dx, atom.dy + 0.5);
          }
        });

        ctx.restore();
      }

      // 5. Sparks and Incandescent Particles
      for (let s = sparks.length - 1; s >= 0; s--) {
        const spark = sparks[s];
        spark.x += spark.vx * simSpeed;
        spark.y += spark.vy * simSpeed;
        spark.vy += 0.08 * simSpeed;
        spark.alpha -= 0.03 * simSpeed;

        if (spark.alpha <= 0) {
          sparks.splice(s, 1);
          continue;
        }

        ctx.fillStyle = spark.color;
        ctx.globalAlpha = spark.alpha;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 6. Draw HUD: Live Temperature & Reaction Phase Status
      ctx.save();
      ctx.font = '600 11px Inter, sans-serif';
      const statusText =
        status === 'running'
          ? `⚡ REACTING EQUATION (${simStateRef.current.completedBatches}/${profile.batches} BATCHES)`
          : status === 'complete'
          ? '✓ PRODUCTS REACHED EQUILIBRIUM'
          : '● REACTIVE INPUTS IN VESSEL';
      const statusColor =
        status === 'running' ? '#D97706' : status === 'complete' ? '#16A34A' : '#4E5B47';

      ctx.fillStyle = 'rgba(250, 248, 245, 0.94)';
      ctx.strokeStyle = '#6F7F63';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bounds.left + 2, 12, 260, 24, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = statusColor;
      ctx.fillText(statusText, bounds.left + 14, 28);

      // Temperature Gauge Badge
      const tempColor =
        currentTemp > 200 ? '#DC2626' : currentTemp > 60 ? '#D97706' : '#2563EB';
      ctx.fillStyle = 'rgba(250, 248, 245, 0.94)';
      ctx.beginPath();
      ctx.roundRect(bounds.right - 120, 12, 116, 24, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = tempColor;
      ctx.fillText(`🌡️ ${Math.round(currentTemp)} °C`, bounds.right - 108, 28);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [status, profile, simSpeed, onComplete]);

  // Compute active species for species legend
  const activeSpecs = useMemo(() => {
    const list: MoleculeSpec[] = [];
    profile.reactants.forEach(r => {
      if (MOLECULE_SPECS[r.specKey]) list.push(MOLECULE_SPECS[r.specKey]);
    });
    profile.products.forEach(p => {
      if (MOLECULE_SPECS[p.specKey] && !list.some(s => s.formula === MOLECULE_SPECS[p.specKey].formula)) {
        list.push(MOLECULE_SPECS[p.specKey]);
      }
    });
    return list;
  }, [profile]);

  return (
    <div
      className="no-scrollbar"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '480px',
        height: '100%',
        background: '#FAF8F5',
        borderRadius: '16px',
        border: '1.5px solid #6F7F63',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Simulation Top Bar Controls */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 20,
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}
      >
        {/* Speed toggle */}
        <button
          onClick={() => setSimSpeed(simSpeed === 1 ? 2 : 1)}
          style={{
            background: 'rgba(250, 248, 245, 0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #6F7F63',
            borderRadius: '999px',
            padding: '5px 12px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#4E5B47',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Toggle Simulation Speed"
        >
          {simSpeed}x Speed
        </button>

        {/* View mode toggle */}
        <button
          onClick={() => setShowIllustration(!showIllustration)}
          style={{
            background: 'rgba(250, 248, 245, 0.92)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #6F7F63',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '0.8rem',
            color: '#4E5B47',
            cursor: 'pointer',
            fontWeight: 700,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {showIllustration ? '🔬 View Molecular Field' : '🎨 View Lab Bench'}
        </button>
      </div>

      {showIllustration ? (
        <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '480px', background: '#EDEAE1' }}>
          <img
            src="assets/images/ghibli-botanical-lab.png"
            alt="Botanical Chemistry Greenhouse Setup generated via Nano Banana"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            loading="lazy"
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(35, 42, 33, 0.88))',
              color: '#FAF8F5',
              padding: '1.5rem',
              fontSize: '0.92rem'
            }}
          >
            <strong>Botanical Reaction Studio</strong> — A harmonious laboratory framed with cascading wisteria blossoms, where molecular reactions strictly respect chemical stoichiometry.
          </div>
        </div>
      ) : (
        <>
          {/* Reaction Live Equation Ribbon (Strict Equation Respect) */}
          <div
            style={{
              background: 'rgba(220, 224, 207, 0.65)',
              borderBottom: '1.5px solid #6F7F63',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            {/* Reactants side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B' }}>
                Reactants (In):
              </span>
              {profile.reactants.map((r, i) => (
                <span
                  key={r.specKey}
                  style={{
                    background: status === 'complete' ? '#FAF8F5' : '#4E5B47',
                    color: status === 'complete' ? '#5F6F5B' : '#FAF8F5',
                    border: '1px solid #6F7F63',
                    borderRadius: '8px',
                    padding: '2px 8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{r.coeff > 1 ? `${r.coeff} ` : ''}{r.formula}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>({reactantsRemaining[r.specKey] ?? (r.coeff * profile.batches)})</span>
                </span>
              ))}
            </div>

            {/* Reaction arrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4E5B47', fontWeight: 700, fontSize: '0.9rem' }}>
              <span>⟶</span>
              <span style={{ fontSize: '0.72rem', background: '#FAF8F5', border: '1px solid #6F7F63', padding: '1px 6px', borderRadius: '4px' }}>
                {status === 'running' ? 'Bond Exchange ⚡' : profile.energyType === 'exothermic' ? 'Exothermic' : 'Endothermic'}
              </span>
              <span>⟶</span>
            </div>

            {/* Products side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B' }}>
                Products (Out):
              </span>
              {profile.products.map(p => (
                <span
                  key={p.specKey}
                  style={{
                    background: status === 'complete' ? '#16A34A' : '#FAF8F5',
                    color: status === 'complete' ? '#FAF8F5' : '#4E5B47',
                    border: '1px solid #6F7F63',
                    borderRadius: '8px',
                    padding: '2px 8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{p.coeff > 1 ? `${p.coeff} ` : ''}{p.formula}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>({productsGenerated[p.specKey] ?? 0})</span>
                </span>
              ))}
            </div>
          </div>

          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '340px',
              display: 'block',
              flex: 1
            }}
          />

          {/* Bottom Live Stoichiometry & Atom Conservation Board */}
          <div
            style={{
              background: 'rgba(230, 226, 211, 0.95)',
              borderTop: '1px solid #6F7F63',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B' }}>
                Conservation of Mass:
              </span>
              <div
                style={{
                  background: '#FAF8F5',
                  border: '1px solid #6F7F63',
                  borderRadius: '12px',
                  padding: '3px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: '#4E5B47'
                }}
              >
                <span>✓ Atoms Balanced & Conserved</span>
                <span style={{ opacity: 0.6 }}>•</span>
                <span>{status === 'complete' ? '100% Equation Stoichiometric Yield' : 'Ready to Transform'}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#4E5B47', fontWeight: 600 }}>
              {status === 'complete' ? (
                <span style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>✓</span> Equation Equilibrium Reached ({deltaH || '-483.6 kJ/mol'})
                </span>
              ) : status === 'running' ? (
                <span style={{ color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>⚡</span> Reacting stoichiometric batches ({completedBatchesCount}/{profile.batches})...
                </span>
              ) : (
                <span>Click [Run Reaction] to simulate stoichiometric pathway</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
