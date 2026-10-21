import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ReactantItem, ReactionStatus } from '../../types/reaction';

interface ReactionDiagramProps {
  status: ReactionStatus;
  equation: string;
  reactionType?: string;
  energyType?: 'exothermic' | 'endothermic' | null;
  deltaH?: string;
  conditions?: { temperature: string | null; pressure: string | null; catalyst: string | null };
  reactants?: ReactantItem[];
  onReset?: () => void;
}

// ==========================================
// Atomic & Molecular Geometry Specifications
// ==========================================
interface AtomNode {
  sym: string;
  dx: number;
  dy: number;
  r: number;
  color: string;
  textColor?: string;
  border?: string;
}

interface BondEdge {
  from: number;
  to: number;
  order?: 1 | 2 | 3;
}

interface MoleculeSpec {
  formula: string;
  name: string;
  atoms: AtomNode[];
  bonds: BondEdge[];
  isGas?: boolean;
  isPrecipitate?: boolean;
}

const MOLECULE_SPECS: Record<string, MoleculeSpec> = {
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
  // Acid-Base: HCl / Hydronium & Chloride
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
  // Single Displacement: Metallic Iron Fe
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
  // Ferrous Sulfate FeSO4
  FeSO4: {
    formula: 'FeSO₄',
    name: 'Iron(II) Sulfate',
    atoms: [
      { sym: 'Fe²', dx: -9, dy: 0, r: 11, color: '#10B981', textColor: '#FAF8F5' },
      { sym: 'S', dx: 9, dy: 0, r: 8.5, color: '#D97706', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 1 }]
  },
  // Precipitated Copper Cu
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
  // Thermite: Aluminum Al
  Al: {
    formula: 'Al',
    name: 'Aluminum',
    atoms: [{ sym: 'Al', dx: 0, dy: 0, r: 10, color: '#94A3B8', textColor: '#0F172A', border: '#64748B' }],
    bonds: []
  },
  // Thermite: Iron Oxide Fe2O3
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
  // Alumina Al2O3
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
// Reaction Archetypes & Dynamics Profile
// ==========================================
interface ReactionProfile {
  id: string;
  name: string;
  reactants: string[];
  products: string[];
  energyType: 'exothermic' | 'endothermic';
  tempBase: number;
  tempPeak: number;
  hasSparks: boolean;
  hasBubbles: boolean;
  hasPrecipitate: boolean;
  colorTheme: string;
}

function resolveReactionProfile(eq: string): ReactionProfile {
  const clean = eq.toLowerCase();

  // Water Synthesis 2H2 + O2 -> 2H2O
  if (clean.includes('h₂o') && clean.includes('o₂') && (clean.includes('h₂') || clean.includes('h2'))) {
    return {
      id: 'water-synthesis',
      name: 'Formation of Water (Covalent Synthesis)',
      reactants: ['H2', 'H2', 'O2'],
      products: ['H2O', 'H2O'],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 280,
      hasSparks: true,
      hasBubbles: false,
      hasPrecipitate: false,
      colorTheme: '#DC2626'
    };
  }

  // Methane Combustion CH4 + 2O2 -> CO2 + 2H2O
  if (clean.includes('ch₄') || clean.includes('ch4')) {
    return {
      id: 'methane-combustion',
      name: 'Hydrocarbon Combustion (High Exothermic)',
      reactants: ['CH4', 'O2', 'O2'],
      products: ['CO2', 'H2O', 'H2O'],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 620,
      hasSparks: true,
      hasBubbles: true,
      hasPrecipitate: false,
      colorTheme: '#EA580C'
    };
  }

  // Haber-Bosch N2 + 3H2 -> 2NH3
  if ((clean.includes('nh₃') || clean.includes('nh3')) || (clean.includes('n₂') && clean.includes('h₂'))) {
    return {
      id: 'haber-process',
      name: 'Haber-Bosch Ammonia Synthesis (Catalyzed)',
      reactants: ['N2', 'H2', 'H2', 'H2'],
      products: ['NH3', 'NH3'],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 450,
      hasSparks: true,
      hasBubbles: true,
      hasPrecipitate: false,
      colorTheme: '#2563EB'
    };
  }

  // Acid-Base Neutralization HCl + NaOH -> NaCl + H2O
  if (clean.includes('hcl') || clean.includes('naoh') || clean.includes('neutralization')) {
    return {
      id: 'neutralization',
      name: 'Acid-Base Aqueous Neutralization',
      reactants: ['HCl', 'NaOH'],
      products: ['NaCl', 'H2O'],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 65,
      hasSparks: false,
      hasBubbles: false,
      hasPrecipitate: false,
      colorTheme: '#16A34A'
    };
  }

  // Single Displacement Fe + CuSO4 -> FeSO4 + Cu
  if (clean.includes('cuso') || (clean.includes('cu') && clean.includes('fe'))) {
    return {
      id: 'copper-displacement',
      name: 'Single Displacement & Redox Precipitation',
      reactants: ['Fe', 'CuSO4'],
      products: ['FeSO4', 'Cu'],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 55,
      hasSparks: true,
      hasBubbles: false,
      hasPrecipitate: true,
      colorTheme: '#C2410C'
    };
  }

  // Catalytic Peroxide Decomposition 2H2O2 -> 2H2O + O2
  if (clean.includes('h2o2') || clean.includes('h₂o₂')) {
    return {
      id: 'peroxide-decomposition',
      name: 'Catalytic Effervescent Decomposition',
      reactants: ['H2O2', 'H2O2'],
      products: ['H2O', 'H2O', 'O2'],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 85,
      hasSparks: false,
      hasBubbles: true,
      hasPrecipitate: false,
      colorTheme: '#0284C7'
    };
  }

  // Thermite Reaction 2Al + Fe2O3 -> Al2O3 + 2Fe
  if (clean.includes('al') && clean.includes('fe₂o₃')) {
    return {
      id: 'thermite',
      name: 'Thermite Incandescent Redox',
      reactants: ['Al', 'Al', 'Fe2O3'],
      products: ['Al2O3', 'Fe', 'Fe'],
      energyType: 'exothermic',
      tempBase: 25,
      tempPeak: 1450,
      hasSparks: true,
      hasBubbles: false,
      hasPrecipitate: true,
      colorTheme: '#F59E0B'
    };
  }

  // Limestone Calcination CaCO3 -> CaO + CO2
  if (clean.includes('caco3') || clean.includes('caco₃')) {
    return {
      id: 'calcination',
      name: 'Limestone Endothermic Calcination',
      reactants: ['CaCO3'],
      products: ['CaO', 'CO2'],
      energyType: 'endothermic',
      tempBase: 25,
      tempPeak: 880,
      hasSparks: false,
      hasBubbles: true,
      hasPrecipitate: true,
      colorTheme: '#4F46E5'
    };
  }

  // Default Fallback Reaction
  return {
    id: 'general-synthesis',
    name: 'Chemical Recombination & Bond Synthesis',
    reactants: ['H2', 'O2'],
    products: ['H2O'],
    energyType: 'exothermic',
    tempBase: 25,
    tempPeak: 120,
    hasSparks: true,
    hasBubbles: false,
    hasPrecipitate: false,
    colorTheme: '#4E5B47'
  };
}

export const ReactionDiagram: React.FC<ReactionDiagramProps> = ({
  status,
  equation,
  reactionType,
  energyType,
  deltaH,
  reactants,
  onReset
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showIllustration, setShowIllustration] = useState(false);
  const [simSpeed, setSimSpeed] = useState<1 | 2>(1);
  const [temperature, setTemperature] = useState<number>(25);

  const profile = useMemo(() => resolveReactionProfile(equation), [equation]);

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

    // ==========================================
    // Molecule Simulation Entity
    // ==========================================
    interface SimMolecule {
      id: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      angle: number;
      vAngle: number;
      spec: MoleculeSpec;
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
    let currentTemp = 25;
    let nextId = 1;

    // Beaker boundary box
    const getBeakerBounds = () => {
      const padX = Math.max(30, width * 0.08);
      const topY = 45;
      const botY = height - 40;
      return {
        left: padX,
        right: width - padX,
        top: topY,
        bottom: botY,
        width: width - padX * 2,
        height: botY - topY
      };
    };

    // Populate initial reactant molecules
    const initReactants = () => {
      molecules = [];
      sparks = [];
      bubbles = [];
      shockwaves = [];
      currentTemp = profile.tempBase;
      setTemperature(profile.tempBase);

      const bounds = getBeakerBounds();
      const countEach = status === 'complete' ? 0 : 7;

      profile.reactants.forEach(specKey => {
        const spec = MOLECULE_SPECS[specKey] || MOLECULE_SPECS['H2'];
        for (let i = 0; i < countEach; i++) {
          molecules.push({
            id: nextId++,
            x: bounds.left + 30 + Math.random() * (bounds.width - 60),
            y: bounds.top + 30 + Math.random() * (bounds.height - 60),
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            angle: Math.random() * Math.PI * 2,
            vAngle: (Math.random() - 0.5) * 0.04,
            spec,
            isProduct: false,
            flash: 0,
            settled: false
          });
        }
      });

      // If initially loaded in complete status, spawn products directly
      if (status === 'complete') {
        initProducts();
      }
    };

    const initProducts = () => {
      const bounds = getBeakerBounds();
      profile.products.forEach(specKey => {
        const spec = MOLECULE_SPECS[specKey] || MOLECULE_SPECS['H2O'];
        for (let i = 0; i < 7; i++) {
          molecules.push({
            id: nextId++,
            x: bounds.left + 30 + Math.random() * (bounds.width - 60),
            y: spec.isPrecipitate ? bounds.bottom - 15 - Math.random() * 20 : bounds.top + 30 + Math.random() * (bounds.height - 60),
            vx: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.9,
            vy: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.9,
            angle: Math.random() * Math.PI * 2,
            vAngle: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.03,
            spec,
            isProduct: true,
            flash: 0,
            settled: Boolean(spec.isPrecipitate)
          });
        }
      });
    };

    // Trigger synthesis of matching reactant collision
    const triggerSynthesis = (m1: SimMolecule, m2: SimMolecule) => {
      const productKeys = profile.products;
      const targetKey = productKeys[Math.floor(Math.random() * productKeys.length)] || 'H2O';
      const productSpec = MOLECULE_SPECS[targetKey] || MOLECULE_SPECS['H2O'];

      const midX = (m1.x + m2.x) / 2;
      const midY = (m1.y + m2.y) / 2;

      // Transform m1 into the product molecule
      m1.spec = productSpec;
      m1.isProduct = true;
      m1.flash = 1.0;
      m1.vx = (Math.random() - 0.5) * 1.5;
      m1.vy = (Math.random() - 0.5) * 1.5;

      // If precipitate, let it gradually sink
      if (productSpec.isPrecipitate) {
        m1.vy = 0.8 + Math.random() * 0.6;
        m1.vx = (Math.random() - 0.5) * 0.3;
      }

      // Remove m2
      molecules = molecules.filter(m => m.id !== m2.id);

      // Thermal shockwave
      shockwaves.push({
        x: midX,
        y: midY,
        r: 4,
        maxR: profile.energyType === 'exothermic' ? 45 : 30,
        alpha: 0.8,
        color: profile.energyType === 'exothermic' ? '255, 120, 40' : '96, 165, 250'
      });

      // Sparks / incandescent particles
      if (profile.hasSparks) {
        for (let s = 0; s < 7; s++) {
          sparks.push({
            x: midX,
            y: midY,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 0.5,
            alpha: 1,
            color: Math.random() > 0.5 ? '#F59E0B' : '#DC2626',
            size: 2 + Math.random() * 2
          });
        }
      }

      // Gas bubbles
      if (profile.hasBubbles || productSpec.isGas) {
        bubbles.push({
          x: midX + (Math.random() - 0.5) * 20,
          y: midY,
          r: 3 + Math.random() * 4,
          vy: -1.2 - Math.random() * 1.2,
          drift: (Math.random() - 0.5) * 0.4
        });
      }
    };

    initReactants();

    // ==========================================
    // Render Loop
    // ==========================================
    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const bounds = getBeakerBounds();
      const speedMult = (status === 'running' ? 2.6 : status === 'complete' ? 1.0 : 0.7) * simSpeed;

      // Dynamically ramp temperature
      if (status === 'running') {
        currentTemp += (profile.tempPeak - currentTemp) * 0.02;
      } else if (status === 'complete') {
        const eqTemp = profile.energyType === 'exothermic' ? profile.tempPeak * 0.75 : profile.tempPeak;
        currentTemp += (eqTemp - currentTemp) * 0.03;
      } else {
        currentTemp += (profile.tempBase - currentTemp) * 0.05;
      }

      if (frame % 8 === 0) {
        setTemperature(Math.round(currentTemp));
      }

      // 1. Draw Laboratory Beaker Vessel with Volume Graduations
      ctx.save();
      ctx.strokeStyle = '#6F7F63';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Top rim of beaker with spout
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

      // Fluid Meniscus / Liquid fill
      ctx.fillStyle = profile.energyType === 'exothermic' && status === 'running'
        ? 'rgba(254, 243, 199, 0.35)'
        : 'rgba(240, 244, 238, 0.45)';
      ctx.beginPath();
      ctx.moveTo(bounds.left + 2, bounds.top + 20);
      ctx.lineTo(bounds.left + 2, bounds.bottom - 16);
      ctx.quadraticCurveTo(bounds.left + 2, bounds.bottom - 2, bounds.left + 16, bounds.bottom - 2);
      ctx.lineTo(bounds.right - 16, bounds.bottom - 2);
      ctx.quadraticCurveTo(bounds.right - 2, bounds.bottom - 2, bounds.right - 2, bounds.bottom - 16);
      ctx.lineTo(bounds.right - 2, bounds.top + 20);
      ctx.closePath();
      ctx.fill();

      // Glassware Graduations & Volume Ticks
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
        ctx.fillText(g.label, bounds.left + 22, y + 3.5);
      });
      ctx.restore();

      // 2. Active Shockwaves & Heat Waves
      for (let w = shockwaves.length - 1; w >= 0; w--) {
        const wave = shockwaves[w];
        wave.r += 1.8 * simSpeed;
        wave.alpha -= 0.025 * simSpeed;
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

      // 3. Bubbles in Gas Evolution Reactions
      for (let b = bubbles.length - 1; b >= 0; b--) {
        const bubble = bubbles[b];
        bubble.y += bubble.vy * simSpeed;
        bubble.x += bubble.drift;
        if (bubble.y <= bounds.top + 20) {
          bubbles.splice(b, 1);
          continue;
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
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

          // Precipitate settling down to the bottom
          if (m.spec.isPrecipitate && m.isProduct) {
            if (m.y >= bounds.bottom - 16) {
              m.y = bounds.bottom - 14 - (m.id % 4) * 4;
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

          if (m.y < bounds.top + 25) {
            m.y = bounds.top + 25;
            m.vy = Math.abs(m.vy);
          } else if (m.y > bounds.bottom - pad && !m.settled) {
            m.y = bounds.bottom - pad;
            m.vy = -Math.abs(m.vy);
          }
        }

        // Inter-molecular collision & synthesis triggers during 'running'
        if (status === 'running' && !m.isProduct && !m.settled) {
          for (let j = i + 1; j < molecules.length; j++) {
            const m2 = molecules[j];
            if (!m2.isProduct && !m2.settled) {
              const dx = m.x - m2.x;
              const dy = m.y - m2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 26) {
                // If they are different reactant species, trigger bond rearrangement
                if (m.spec.formula !== m2.spec.formula || profile.reactants.length === 1) {
                  triggerSynthesis(m, m2);
                  break;
                }
              }
            }
          }
        }

        // Draw Molecule with Bonds and CPK Atoms
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);

        // Activation Energy Flash Glow
        if (m.flash > 0) {
          m.flash -= 0.03 * simSpeed;
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 230, 150, ${m.flash * 0.7})`;
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
        spark.vy += 0.08 * simSpeed; // gravity
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
      // Vessel Status Pill
      ctx.font = '600 11px Inter, sans-serif';
      const statusText =
        status === 'running'
          ? '⚡ ACTIVATION & BOND SYNTHESIS'
          : status === 'complete'
          ? '✓ THERMODYNAMIC EQUILIBRIUM'
          : '● REACTANTS IN SOLUTION';
      const statusColor =
        status === 'running' ? '#D97706' : status === 'complete' ? '#16A34A' : '#4E5B47';

      ctx.fillStyle = 'rgba(250, 248, 245, 0.92)';
      ctx.strokeStyle = '#6F7F63';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bounds.left + 2, 12, 230, 24, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = statusColor;
      ctx.fillText(statusText, bounds.left + 14, 28);

      // Temperature Gauge Badge
      const tempColor =
        currentTemp > 200 ? '#DC2626' : currentTemp > 60 ? '#D97706' : '#2563EB';
      ctx.fillStyle = 'rgba(250, 248, 245, 0.92)';
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
  }, [status, profile, simSpeed]);

  const activeSpecs = useMemo(() => {
    const set = new Set<string>();
    if (status === 'complete') {
      profile.products.forEach(p => set.add(p));
    } else {
      profile.reactants.forEach(r => set.add(r));
      if (status === 'running') profile.products.forEach(p => set.add(p));
    }
    return Array.from(set).map(k => MOLECULE_SPECS[k]).filter(Boolean);
  }, [status, profile]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '440px',
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
        <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '440px', background: '#EDEAE1' }}>
          <img
            src="assets/images/lab-studio.png"
            alt="Chemistry Reaction Studio Apparatus"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
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
            <strong>Reaction Studio Apparatus</strong> — Classical distillation retort bench rendered with botanical parchment aesthetic.
          </div>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '380px',
              display: 'block',
              flex: 1
            }}
          />

          {/* Bottom Species Legend Bar */}
          <div
            style={{
              background: 'rgba(230, 226, 211, 0.92)',
              borderTop: '1px solid #6F7F63',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B' }}>
                Active Species:
              </span>
              {activeSpecs.map(spec => (
                <div
                  key={spec.formula}
                  style={{
                    background: '#FAF8F5',
                    border: '1px solid #6F7F63',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#4E5B47'
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: spec.atoms[0]?.color || '#4E5B47',
                      border: '1px solid #334155'
                    }}
                  />
                  <span>{spec.formula}</span>
                  <span style={{ opacity: 0.65, fontWeight: 500, fontSize: '0.7rem' }}>({spec.name})</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#5F6F5B', fontWeight: 600 }}>
              {status === 'complete'
                ? `Reaction Complete • ${deltaH || '-483.6 kJ/mol'}`
                : status === 'running'
                ? 'Synthesizing Bonds & Exchanging Enthalpy...'
                : 'Click [Run Reaction] to Begin'}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
