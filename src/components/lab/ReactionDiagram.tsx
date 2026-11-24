import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ReactantItem, ReactionStatus } from '../../types/reaction';
import { parseFormula, calculateMolarMass } from '../../utils/formulaParser';
import {
  StoichSpecies,
  StoichiometricReactionProfile,
  resolveStoichiometricProfile,
  normalizeFormulaSubscripts,
  toSubscriptFormula
} from '../../utils/reactionEngine';
import { getReagentInfo } from '../../data/reagentsData';
import { useLanguage } from '../../i18n/LanguageContext';
import { LabBenchApparatus } from './LabBenchApparatus';

export type { StoichSpecies, StoichiometricReactionProfile };
export { resolveStoichiometricProfile };

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
  onRun?: () => void;
  onPauseToggle?: () => void;
  onAutoBalance?: () => void;
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
  HCl: {
    formula: 'HCl',
    name: 'Hydrochloric Acid',
    atoms: [
      { sym: 'H⁺', dx: -9, dy: 0, r: 6.5, color: '#60A5FA', textColor: '#FAF8F5' },
      { sym: 'Cl⁻', dx: 8, dy: 0, r: 12, color: '#16A34A', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 1 }]
  },
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
  NaCl: {
    formula: 'NaCl',
    name: 'Sodium Chloride (Salt)',
    atoms: [
      { sym: 'Na⁺', dx: -9, dy: 0, r: 10, color: '#9333EA', textColor: '#FAF8F5' },
      { sym: 'Cl⁻', dx: 9, dy: 0, r: 12, color: '#16A34A', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 1 }]
  },
  Fe: {
    formula: 'Fe',
    name: 'Iron Metal',
    atoms: [{ sym: 'Fe', dx: 0, dy: 0, r: 11, color: '#64748B', textColor: '#FAF8F5', border: '#334155' }],
    bonds: [],
    isPrecipitate: true
  },
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
  FeSO4: {
    formula: 'FeSO₄',
    name: 'Iron(II) Sulfate',
    atoms: [
      { sym: 'Fe²', dx: -9, dy: 0, r: 11, color: '#10B981', textColor: '#FAF8F5' },
      { sym: 'S', dx: 9, dy: 0, r: 8.5, color: '#D97706', textColor: '#FAF8F5' }
    ],
    bonds: [{ from: 0, to: 1, order: 1 }]
  },
  Cu: {
    formula: 'Cu',
    name: 'Copper Precipitate',
    atoms: [{ sym: 'Cu', dx: 0, dy: 0, r: 11, color: '#C2410C', textColor: '#FAF8F5', border: '#7C2D12' }],
    bonds: [],
    isPrecipitate: true
  },
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
  Al: {
    formula: 'Al',
    name: 'Aluminum',
    atoms: [{ sym: 'Al', dx: 0, dy: 0, r: 10, color: '#94A3B8', textColor: '#0F172A', border: '#64748B' }],
    bonds: []
  },
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

// CPK Element Color Palette for dynamically synthesizing any custom molecule
const CPK_ATOM_COLORS: Record<string, { color: string; textColor: string; r: number }> = {
  H: { color: '#FAF8F5', textColor: '#4E5B47', r: 6.5 },
  O: { color: '#DC2626', textColor: '#FAF8F5', r: 9 },
  N: { color: '#2563EB', textColor: '#FAF8F5', r: 9.5 },
  C: { color: '#374151', textColor: '#FAF8F5', r: 9.5 },
  Cl: { color: '#16A34A', textColor: '#FAF8F5', r: 11 },
  S: { color: '#D97706', textColor: '#FAF8F5', r: 9.5 },
  Na: { color: '#9333EA', textColor: '#FAF8F5', r: 10 },
  K: { color: '#7C3AED', textColor: '#FAF8F5', r: 10.5 },
  Fe: { color: '#64748B', textColor: '#FAF8F5', r: 11 },
  Cu: { color: '#C2410C', textColor: '#FAF8F5', r: 11 },
  Al: { color: '#94A3B8', textColor: '#0F172A', r: 10 },
  Ca: { color: '#E0E7FF', textColor: '#312E81', r: 11 },
  Mg: { color: '#CBD5E1', textColor: '#0F172A', r: 10 },
  Zn: { color: '#475569', textColor: '#FAF8F5', r: 10.5 },
  Ag: { color: '#E2E8F0', textColor: '#0F172A', r: 11 }
};

export function getMoleculeSpec(specKey: string, fallbackName?: string): MoleculeSpec {
  const cleanKey = normalizeFormulaSubscripts(specKey);
  if (MOLECULE_SPECS[cleanKey]) {
    return MOLECULE_SPECS[cleanKey];
  }

  const parsed = parseFormula(cleanKey);
  const atoms: AtomNode[] = [];
  const bonds: BondEdge[] = [];

  if (parsed) {
    const entries = Object.entries(parsed);
    // Build compact cluster up to 4 representative atoms
    const symbols: string[] = [];
    entries.forEach(([el, count]) => {
      const cap = Math.min(count, 2);
      for (let i = 0; i < cap && symbols.length < 4; i++) {
        symbols.push(el);
      }
    });

    if (symbols.length === 1) {
      const cpk = CPK_ATOM_COLORS[symbols[0]] || { color: '#4E5B47', textColor: '#FAF8F5', r: 10 };
      atoms.push({ sym: symbols[0], dx: 0, dy: 0, r: cpk.r, color: cpk.color, textColor: cpk.textColor });
    } else if (symbols.length === 2) {
      symbols.forEach((sym, idx) => {
        const cpk = CPK_ATOM_COLORS[sym] || { color: '#4E5B47', textColor: '#FAF8F5', r: 9.5 };
        atoms.push({ sym, dx: idx === 0 ? -9 : 9, dy: 0, r: cpk.r, color: cpk.color, textColor: cpk.textColor });
      });
      bonds.push({ from: 0, to: 1, order: 1 });
    } else {
      const offsets = [
        { dx: 0, dy: -3 },
        { dx: -11, dy: 6 },
        { dx: 11, dy: 6 },
        { dx: 0, dy: -13 }
      ];
      symbols.forEach((sym, idx) => {
        const cpk = CPK_ATOM_COLORS[sym] || { color: '#4E5B47', textColor: '#FAF8F5', r: 8.5 };
        const off = offsets[idx] || { dx: 0, dy: 0 };
        atoms.push({ sym, dx: off.dx, dy: off.dy, r: cpk.r, color: cpk.color, textColor: cpk.textColor });
        if (idx > 0) {
          bonds.push({ from: 0, to: idx, order: 1 });
        }
      });
    }
  } else {
    atoms.push({ sym: cleanKey.slice(0, 2), dx: 0, dy: 0, r: 10, color: '#4E5B47', textColor: '#FAF8F5' });
  }

  const isGas = ['H2', 'O2', 'N2', 'CO2', 'CH4', 'NH3', 'Cl2'].includes(cleanKey);
  const isPrecipitate = ['Cu', 'Fe', 'AgCl', 'CaO', 'Al2O3', 'MgO', 'Cu(OH)2', 'Fe(OH)2', 'CaCO3'].includes(cleanKey);

  return {
    formula: toSubscriptFormula(cleanKey),
    name: fallbackName || toSubscriptFormula(cleanKey),
    atoms,
    bonds,
    isGas,
    isPrecipitate
  };
}

export const ReactionDiagram: React.FC<ReactionDiagramProps> = ({
  status,
  equation,
  reactionType,
  energyType,
  deltaH,
  conditions,
  reactants = [],
  onReset,
  onComplete,
  onRun,
  onPauseToggle,
  onAutoBalance
}) => {
  const { language } = useLanguage();
  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'bench' | 'molecular'>('bench');
  const [simSpeed, setSimSpeed] = useState<0.5 | 1 | 2>(1);
  const [temperature, setTemperature] = useState<number>(25);

  const cycleSpeed = () => {
    setSimSpeed(prev => (prev === 1 ? 2 : prev === 2 ? 0.5 : 1));
  };

  const profile = useMemo(() => resolveStoichiometricProfile(equation, reactants), [equation, reactants]);

  // Live stoichiometric counters for the HUD
  const [reactantsRemaining, setReactantsRemaining] = useState<Record<string, number>>({});
  const [productsGenerated, setProductsGenerated] = useState<Record<string, number>>({});
  const [completedBatchesCount, setCompletedBatchesCount] = useState<number>(0);

  // Ref for imperative batch step or scrub trigger inside the canvas closure
  const stepBatchTriggerRef = useRef<(() => void) | null>(null);
  const setTargetBatchesRef = useRef<((target: number) => void) | null>(null);

  const simStateRef = useRef<{
    completedBatches: number;
    totalBatches: number;
    lastReactionTime: number;
  }>({
    completedBatches: 0,
    totalBatches: profile.batches,
    lastReactionTime: 0
  });

  // Check if reactant masses are stoichiometrically balanced
  const isStoichBalanced = useMemo(() => {
    if (reactants.length <= 1) return false;
    const ratios = profile.reactants.map(spec => {
      const norm = normalizeFormulaSubscripts(spec.specKey).toLowerCase();
      const userR = reactants.find(r => normalizeFormulaSubscripts(r.formula).toLowerCase() === norm);
      const meta = getReagentInfo(spec.specKey);
      const mw = meta.molarMass > 0 ? meta.molarMass : (calculateMolarMass(spec.specKey) || 1);
      const mass = userR?.massGrams ?? spec.coeff * mw;
      return (mass / mw) / Math.max(1, spec.coeff);
    });
    const minR = Math.min(...ratios);
    const maxR = Math.max(...ratios);
    return maxR > 0 && Math.abs(maxR - minR) / maxR < 0.015;
  }, [profile, reactants]);

  const totalMass = useMemo(() => {
    return reactants.reduce((sum, r) => sum + (r.massGrams || 0), 0);
  }, [reactants]);

  useEffect(() => {
    if (status === 'paused') return;

    simStateRef.current = {
      completedBatches: status === 'complete' ? profile.batches : 0,
      totalBatches: profile.batches,
      lastReactionTime: 0
    };
    setCompletedBatchesCount(status === 'complete' ? profile.batches : 0);

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

  // Main Canvas Animation Effect (includes viewMode in dependency array so switching from bench -> molecular initializes canvas!)
  useEffect(() => {
    if (viewMode !== 'molecular') return;
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
      width = Math.max(280, parent.clientWidth || 600);
      height = Math.max(320, parent.clientHeight || 360);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
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
      const padX = Math.max(18, Math.min(44, width * 0.06));
      const topY = 48;
      const botY = height - 24;
      return {
        left: padX,
        right: width - padX,
        top: topY,
        bottom: botY,
        width: Math.max(200, width - padX * 2),
        height: Math.max(180, botY - topY)
      };
    };

    const populateForBatchCount = (targetCompleted: number) => {
      molecules = [];
      sparks = [];
      bubbles = [];
      shockwaves = [];
      const bounds = getBeakerBounds();
      const batches = profile.batches;
      const clampedCompleted = Math.max(0, Math.min(batches, targetCompleted));
      const remainingBatches = batches - clampedCompleted;

      simStateRef.current.completedBatches = clampedCompleted;
      setCompletedBatchesCount(clampedCompleted);

      const rCounts: Record<string, number> = {};
      const pCounts: Record<string, number> = {};

      // Spawn remaining reactants
      profile.reactants.forEach(r => {
        const spec = getMoleculeSpec(r.specKey, r.name);
        const count = r.coeff * remainingBatches;
        rCounts[r.specKey] = count;
        for (let i = 0; i < count; i++) {
          molecules.push({
            id: nextId++,
            specKey: r.specKey,
            spec,
            x: bounds.left + 24 + Math.random() * Math.max(40, bounds.width - 48),
            y: bounds.top + 30 + Math.random() * Math.max(40, bounds.height - 56),
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

      // Spawn generated products
      profile.products.forEach(p => {
        const spec = getMoleculeSpec(p.specKey, p.name);
        const count = p.coeff * clampedCompleted;
        pCounts[p.specKey] = count;
        for (let i = 0; i < count; i++) {
          molecules.push({
            id: nextId++,
            specKey: p.specKey,
            spec,
            x: bounds.left + 24 + Math.random() * Math.max(40, bounds.width - 48),
            y: spec.isPrecipitate
              ? bounds.bottom - 12 - (i % 3) * 6
              : bounds.top + 30 + Math.random() * Math.max(40, bounds.height - 56),
            vx: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.95,
            vy: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.95,
            angle: Math.random() * Math.PI * 2,
            vAngle: spec.isPrecipitate ? 0 : (Math.random() - 0.5) * 0.03,
            isProduct: true,
            flash: 0.4,
            settled: Boolean(spec.isPrecipitate)
          });
        }
      });

      setReactantsRemaining(rCounts);
      setProductsGenerated(pCounts);
      currentTemp =
        profile.tempBase + (profile.tempPeak - profile.tempBase) * (clampedCompleted / Math.max(1, batches));
      setTemperature(Math.round(currentTemp));
    };

    const executeStoichiometricBatch = () => {
      if (simStateRef.current.completedBatches >= profile.batches) {
        return;
      }

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

      let avgX = 0;
      let avgY = 0;
      toRemove.forEach(m => {
        avgX += m.x;
        avgY += m.y;
      });
      avgX /= toRemove.length;
      avgY /= toRemove.length;

      const removeIds = new Set(toRemove.map(m => m.id));
      molecules = molecules.filter(m => !removeIds.has(m.id));

      profile.products.forEach(p => {
        const spec = getMoleculeSpec(p.specKey, p.name);
        for (let i = 0; i < p.coeff; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.0 + Math.random() * 0.8;
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

      shockwaves.push({
        x: avgX,
        y: avgY,
        r: 6,
        maxR: profile.energyType === 'exothermic' ? 50 : 35,
        alpha: 0.85,
        color: profile.energyType === 'exothermic' ? '255, 120, 30' : '96, 165, 250'
      });

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

      if (profile.hasBubbles || profile.products.some(p => getMoleculeSpec(p.specKey).isGas)) {
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

      if (currentCompleted >= profile.batches) {
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 65,
            origin: { y: 0.65 },
            colors: ['#4E5B47', '#6F7F63', '#8FA882', '#E6E2D3', '#D97706']
          });
          onComplete?.();
        }, 400);
      }
    };

    stepBatchTriggerRef.current = executeStoichiometricBatch;
    setTargetBatchesRef.current = populateForBatchCount;

    resize();
    populateForBatchCount(status === 'complete' ? profile.batches : simStateRef.current.completedBatches);

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const bounds = getBeakerBounds();
      const isPaused = status === 'paused';
      const speedMult = isPaused
        ? 0
        : (status === 'running' ? 2.1 : status === 'complete' ? 0.95 : 0.75) * simSpeed;

      if (status === 'running' && simStateRef.current.completedBatches < profile.batches) {
        const interval = Math.max(24, Math.floor(60 / simSpeed));
        if (frame % interval === 0) {
          executeStoichiometricBatch();
        }
      }

      if (!isPaused) {
        const ratio = simStateRef.current.completedBatches / Math.max(1, profile.batches);
        const target =
          status === 'running' || status === 'complete' || simStateRef.current.completedBatches > 0
            ? profile.tempBase + (profile.tempPeak - profile.tempBase) * ratio
            : profile.tempBase;
        currentTemp += (target - currentTemp) * 0.06;
        if (frame % 6 === 0) {
          setTemperature(Math.round(currentTemp));
        }
      }

      // 1. Draw Laboratory Beaker Vessel with Volume Graduations
      ctx.save();
      ctx.strokeStyle = '#6F7F63';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(bounds.left - 10, bounds.top - 5);
      ctx.lineTo(bounds.left, bounds.top);
      ctx.lineTo(bounds.right, bounds.top);
      ctx.lineTo(bounds.right + 6, bounds.top - 5);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(bounds.left, bounds.top);
      ctx.lineTo(bounds.left, bounds.bottom - 16);
      ctx.quadraticCurveTo(bounds.left, bounds.bottom, bounds.left + 16, bounds.bottom);
      ctx.lineTo(bounds.right - 16, bounds.bottom);
      ctx.quadraticCurveTo(bounds.right, bounds.bottom, bounds.right, bounds.bottom - 16);
      ctx.lineTo(bounds.right, bounds.top);
      ctx.stroke();

      ctx.fillStyle =
        profile.energyType === 'exothermic' && simStateRef.current.completedBatches > 0
          ? 'rgba(254, 243, 199, 0.38)'
          : 'rgba(235, 242, 232, 0.45)';
      ctx.beginPath();
      ctx.moveTo(bounds.left + 2, bounds.top + 18);
      ctx.lineTo(bounds.left + 2, bounds.bottom - 16);
      ctx.quadraticCurveTo(bounds.left + 2, bounds.bottom - 2, bounds.left + 16, bounds.bottom - 2);
      ctx.lineTo(bounds.right - 16, bounds.bottom - 2);
      ctx.quadraticCurveTo(bounds.right - 2, bounds.bottom - 2, bounds.right - 2, bounds.bottom - 16);
      ctx.lineTo(bounds.right - 2, bounds.top + 18);
      ctx.closePath();
      ctx.fill();

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
        ctx.lineTo(bounds.left + 14, y);
        ctx.stroke();
        ctx.fillText(g.label, bounds.left + 18, y + 3.5);
      });
      ctx.restore();

      // 2. Active Shockwaves
      for (let w = shockwaves.length - 1; w >= 0; w--) {
        const wave = shockwaves[w];
        if (!isPaused) {
          wave.r += 2.0 * simSpeed;
          wave.alpha -= 0.03 * simSpeed;
        }
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

      // 3. Bubbles
      for (let b = bubbles.length - 1; b >= 0; b--) {
        const bubble = bubbles[b];
        if (!isPaused) {
          bubble.y += bubble.vy * simSpeed;
          bubble.x += bubble.drift;
        }
        if (bubble.y <= bounds.top + 16) {
          bubbles.splice(b, 1);
          continue;
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
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

        if (!m.settled && !isPaused) {
          m.x += m.vx * speedMult;
          m.y += m.vy * speedMult;
          m.angle += m.vAngle * speedMult;

          if (m.spec.isPrecipitate && m.isProduct) {
            if (m.y >= bounds.bottom - 16) {
              m.y = bounds.bottom - 12 - (m.id % 4) * 4;
              m.vx = 0;
              m.vy = 0;
              m.vAngle = 0;
              m.settled = true;
            }
          }

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

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.angle);

        if (m.flash > 0) {
          if (!isPaused) m.flash = Math.max(0, m.flash - 0.035 * simSpeed);
          ctx.beginPath();
          ctx.arc(0, 0, 26, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 235, 160, ${m.flash * 0.75})`;
          ctx.fill();
        }

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

        m.spec.atoms.forEach(atom => {
          ctx.beginPath();
          ctx.arc(atom.dx, atom.dy, atom.r, 0, Math.PI * 2);
          ctx.fillStyle = atom.color;
          ctx.fill();

          ctx.strokeStyle = atom.border || '#334155';
          ctx.lineWidth = 1.2;
          ctx.stroke();

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

      // 5. Sparks
      for (let s = sparks.length - 1; s >= 0; s--) {
        const spark = sparks[s];
        if (!isPaused) {
          spark.x += spark.vx * simSpeed;
          spark.y += spark.vy * simSpeed;
          spark.vy += 0.08 * simSpeed;
          spark.alpha -= 0.03 * simSpeed;
        }
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

      // 6. Responsive Canvas HUD Pills (never overlapping on small screens)
      ctx.save();
      const isCompact = width < 440;
      ctx.font = isCompact ? '600 9.5px Inter, sans-serif' : '600 10.5px Inter, sans-serif';
      const statusText =
        status === 'running'
          ? `⚡ BATCH ${simStateRef.current.completedBatches}/${profile.batches}`
          : status === 'paused'
          ? `⏸ PAUSED (${simStateRef.current.completedBatches}/${profile.batches})`
          : simStateRef.current.completedBatches >= profile.batches
          ? '✓ EQUILIBRIUM REACHED'
          : '● REACTANTS IN VESSEL';
      const statusColor =
        status === 'running'
          ? '#D97706'
          : status === 'paused'
          ? '#3730A3'
          : simStateRef.current.completedBatches >= profile.batches
          ? '#16A34A'
          : '#4E5B47';

      const leftPillWidth = isCompact ? 148 : 190;
      ctx.fillStyle = 'rgba(250, 248, 245, 0.94)';
      ctx.strokeStyle = '#6F7F63';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bounds.left, 12, leftPillWidth, 24, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = statusColor;
      ctx.fillText(statusText, bounds.left + 12, 27.5);

      const rightPillWidth = isCompact ? 86 : 104;
      const tempColor = currentTemp > 200 ? '#DC2626' : currentTemp > 60 ? '#D97706' : '#2563EB';
      ctx.fillStyle = 'rgba(250, 248, 245, 0.94)';
      ctx.beginPath();
      ctx.roundRect(bounds.right - rightPillWidth, 12, rightPillWidth, 24, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = tempColor;
      ctx.fillText(`🌡️ ${Math.round(currentTemp)} °C`, bounds.right - rightPillWidth + 10, 27.5);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [viewMode, status, profile, simSpeed, onComplete]);

  // Compute active species for species legend (supports any custom species via getMoleculeSpec)
  const activeSpecs = useMemo(() => {
    const list: { spec: MoleculeSpec; role: 'reactant' | 'product'; key: string }[] = [];
    profile.reactants.forEach(r => {
      list.push({ spec: getMoleculeSpec(r.specKey, r.name), role: 'reactant', key: r.specKey });
    });
    profile.products.forEach(p => {
      if (!list.some(s => s.key === p.specKey)) {
        list.push({ spec: getMoleculeSpec(p.specKey, p.name), role: 'product', key: p.specKey });
      }
    });
    return list;
  }, [profile]);

  if (viewMode === 'bench') {
    return (
      <LabBenchApparatus
        status={status}
        equation={equation}
        reactionType={reactionType}
        energyType={energyType}
        deltaH={deltaH}
        conditions={conditions}
        reactants={reactants}
        onRun={onRun}
        onPauseToggle={onPauseToggle}
        onReset={onReset}
        onComplete={onComplete}
        onAutoBalance={onAutoBalance}
        simSpeed={simSpeed}
        onToggleSpeed={cycleSpeed}
        onSwitchToMolecular={() => setViewMode('molecular')}
      />
    );
  }

  const batchProgressPct = Math.round((completedBatchesCount / Math.max(1, profile.batches)) * 100);

  return (
    <div
      className="molecular-view-container no-scrollbar"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '560px',
        background: 'linear-gradient(180deg, #FAF8F5 0%, #F3EFE6 100%)',
        borderRadius: '16px',
        border: '1.5px solid #6F7F63',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. TOP MOLECULAR FIELD HEADER & FULL CONTROL BAR (MATCHING LAB BENCH APPARATUS) */}
      <div
        className="lab-bench-header"
        style={{
          background: 'rgba(220, 224, 207, 0.88)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1.5px solid #6F7F63',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          zIndex: 10
        }}
      >
        {/* Left: Molecular Mode Title & Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#4E5B47',
              color: '#FAF8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}
          >
            🔬
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <strong style={{ color: '#4E5B47', fontSize: '0.94rem', fontWeight: 800, lineHeight: 1.2 }}>
                {l(
                  'Atomic & Molecular Reaction Field — Kinetic View',
                  'Champ Moléculaire & Atomique — Vue Cinétique',
                  'حقل الجزيئات والذرات — المحاكاة الحركية الحية'
                )}
              </strong>
              <span
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background:
                    status === 'complete'
                      ? '#DCFCE7'
                      : status === 'running'
                      ? '#FEF3C7'
                      : status === 'paused'
                      ? '#E0E7FF'
                      : '#E2DDD3',
                  color:
                    status === 'complete'
                      ? '#15803D'
                      : status === 'running'
                      ? '#B45309'
                      : status === 'paused'
                      ? '#3730A3'
                      : '#5F6F5B',
                  border: `1px solid ${
                    status === 'complete'
                      ? '#86EFAC'
                      : status === 'running'
                      ? '#FCD34D'
                      : status === 'paused'
                      ? '#A5B4FC'
                      : '#6F7F63'
                  }`
                }}
              >
                {status === 'complete'
                  ? l('✓ Complete', '✓ Terminé', '✓ مكتمل')
                  : status === 'running'
                  ? l(`⚡ Batch ${completedBatchesCount}/${profile.batches}`, `⚡ Lot ${completedBatchesCount}/${profile.batches}`, `⚡ دفعة ${completedBatchesCount}/${profile.batches}`)
                  : status === 'paused'
                  ? l('⏸ Paused', '⏸ En pause', '⏸ متوقف مؤقتاً')
                  : l('● Ready', '● Prêt', '● جاهز')}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#5F6F5B', display: 'block' }}>
              {l(
                'Real-time covalent bond breaking, CPK atomic collisions & batch turnover',
                'Rupture de liaisons covalentes, collisions atomiques CPK et stœchiométrie',
                'تفكك وتكون الروابط التساهمية وتصادم الذرات في الوقت الفعلي'
              )}
            </span>
          </div>
        </div>

        {/* Right: Complete Controls Suite (Rerun, Run, Pause, Auto-Balance, Reset, Speed, Lab Bench View) */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {status === 'complete' && onRun && (
            <button
              onClick={onRun}
              style={{
                background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                color: '#FFFFFF',
                border: '1.5px solid #166534',
                borderRadius: '999px',
                padding: '5px 14px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 3px 10px rgba(21, 128, 61, 0.3)'
              }}
              title={l('Rerun molecular reaction test', 'Relancer la simulation moléculaire', 'إعادة تشغيل محاكاة الجزيئات')}
            >
              <span>↺</span>
              <span>{l('Rerun Test', 'Relancer le Test', 'إعادة الاختبار')}</span>
            </button>
          )}

          {(status === 'running' || status === 'paused') && onPauseToggle && (
            <button
              onClick={onPauseToggle}
              style={{
                background: status === 'paused' ? '#15803D' : '#D97706',
                color: '#FAF8F5',
                border: 'none',
                borderRadius: '999px',
                padding: '5px 13px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>{status === 'paused' ? '▶' : '⏸'}</span>
              <span>{status === 'paused' ? l('Resume', 'Reprendre', 'استئناف') : l('Pause', 'Pause', 'إيقاف مؤقت')}</span>
            </button>
          )}

          {status !== 'complete' && status !== 'running' && status !== 'paused' && onRun && (
            <button
              onClick={onRun}
              disabled={reactants.length < 1}
              style={{
                background: '#4E5B47',
                color: '#FAF8F5',
                border: '1.5px solid #4E5B47',
                borderRadius: '999px',
                padding: '5px 14px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: reactants.length >= 1 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 3px 10px rgba(78, 91, 71, 0.22)'
              }}
            >
              <span>▶</span>
              <span>{l('Run Test', 'Lancer le Test', 'تشغيل الاختبار')}</span>
            </button>
          )}

          {onAutoBalance && reactants.length > 1 && (
            <button
              onClick={onAutoBalance}
              style={{
                background: isStoichBalanced ? '#DCFCE7' : '#FAF8F5',
                border: `1px solid ${isStoichBalanced ? '#16A34A' : '#6F7F63'}`,
                borderRadius: '999px',
                padding: '5px 11px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isStoichBalanced ? '#15803D' : '#4E5B47',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title={l('Set exact stoichiometric reactant masses', 'Ajuster aux masses stœchiométriques', 'موازنة الكتل ستوكيومترياً')}
            >
              <span>⚖️</span>
              <span>{isStoichBalanced ? l('Balanced ✓', 'Équilibré ✓', 'متوازن ✓') : l('Auto-Balance', 'Équilibrer', 'موازنة الكتل')}</span>
            </button>
          )}

          {onReset && (
            <button
              onClick={() => {
                setTargetBatchesRef.current?.(0);
                onReset();
              }}
              style={{
                background: '#FAF8F5',
                border: '1px solid #6F7F63',
                borderRadius: '999px',
                padding: '5px 11px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#4E5B47',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title={l('Reset molecular vessel', 'Réinitialiser le réacteur', 'إعادة ضبط الوعاء')}
            >
              <span>↺</span>
              <span>{l('Reset', 'Réinitialiser', 'إعادة ضبط')}</span>
            </button>
          )}

          <button
            onClick={cycleSpeed}
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '999px',
              padding: '5px 11px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#4E5B47',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
            title={l('Cycle Simulation Speed (0.5x / 1x / 2x)', 'Changer la vitesse (0.5x / 1x / 2x)', 'تغيير سرعة المحاكاة')}
          >
            ⚡ {simSpeed}x
          </button>

          <button
            onClick={() => setViewMode('bench')}
            style={{
              background: '#4E5B47',
              color: '#FAF8F5',
              border: '1.5px solid #4E5B47',
              borderRadius: '999px',
              padding: '5px 13px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: 'var(--shadow-sm)'
            }}
            title={l('Switch back to macroscopic Lab Bench Apparatus', 'Retourner à la paillasse de laboratoire', 'العودة إلى طاولة المختبر الحية')}
          >
            <span>🧪</span>
            <span>{l('Lab Bench View', 'Vue Paillasse', 'طاولة المختبر')}</span>
          </button>
        </div>
      </div>

      {/* 2. EQUATION RIBBON & INTERACTIVE MOLECULAR BATCH SCRUBBER */}
      <div
        style={{
          background: '#FAF8F5',
          borderBottom: '1.5px solid #6F7F63',
          padding: '8px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          {/* Reactants side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#5F6F5B' }}>
              {l('Reactants (In):', 'Réactifs (Entrée) :', 'المتفاعلات:')}
            </span>
            {profile.reactants.map(r => (
              <span
                key={r.specKey}
                className="formula-ltr"
                style={{
                  background: completedBatchesCount >= profile.batches ? '#FAF8F5' : '#4E5B47',
                  color: completedBatchesCount >= profile.batches ? '#5F6F5B' : '#FAF8F5',
                  border: '1px solid #6F7F63',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{r.coeff > 1 ? `${r.coeff} ` : ''}{r.formula}</span>
                <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>
                  ({reactantsRemaining[r.specKey] ?? r.coeff * profile.batches} {l('mol', 'mol', 'جزيء')})
                </span>
              </span>
            ))}
          </div>

          {/* Reaction arrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4E5B47', fontWeight: 700, fontSize: '0.86rem' }}>
            <span>⟶</span>
            <span style={{ fontSize: '0.7rem', background: '#EDEAE1', border: '1px solid #6F7F63', padding: '1px 7px', borderRadius: '999px' }}>
              {status === 'running'
                ? l('Bond Exchange ⚡', 'Échange de Liaisons ⚡', 'تبادل الروابط ⚡')
                : profile.energyType === 'exothermic'
                ? `🔥 ${l('Exothermic', 'Exothermique', 'طارد للحرارة')}`
                : `❄️ ${l('Endothermic', 'Endothermique', 'ماص للحرارة')}`}
            </span>
            <span>⟶</span>
          </div>

          {/* Products side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#5F6F5B' }}>
              {l('Products (Out):', 'Produits (Sortie) :', 'النواتج:')}
            </span>
            {profile.products.map(p => (
              <span
                key={p.specKey}
                className="formula-ltr"
                style={{
                  background: completedBatchesCount >= profile.batches ? '#16A34A' : '#FAF8F5',
                  color: completedBatchesCount >= profile.batches ? '#FAF8F5' : '#4E5B47',
                  border: '1px solid #6F7F63',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{p.coeff > 1 ? `${p.coeff} ` : ''}{p.formula}</span>
                <span style={{ fontSize: '0.68rem', opacity: 0.85 }}>
                  ({productsGenerated[p.specKey] ?? 0} {l('mol', 'mol', 'جزيء')})
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Batch Scrubber & Step Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#EDEAE1',
            padding: '5px 10px',
            borderRadius: '8px',
            border: '1px solid rgba(111, 127, 99, 0.3)',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4E5B47', whiteSpace: 'nowrap' }}>
            🎚️ {l('Molecular Batch Control:', 'Contrôle des Lots Moléculaires :', 'التحكم بدفعات التصادم الجزيئي:')}
          </span>
          <input
            type="range"
            min={0}
            max={profile.batches}
            step={1}
            value={completedBatchesCount}
            onChange={e => {
              const target = parseInt(e.target.value, 10) || 0;
              setTargetBatchesRef.current?.(target);
              if (target >= profile.batches && status !== 'complete') {
                onComplete?.();
              }
            }}
            aria-label="Molecular batch progress scrubber"
            style={{
              flex: 1,
              minWidth: '100px',
              accentColor: '#4E5B47',
              cursor: 'pointer',
              height: '6px'
            }}
          />
          <span className="formula-ltr" style={{ fontSize: '0.74rem', fontWeight: 800, color: '#4E5B47' }}>
            {completedBatchesCount}/{profile.batches} ({batchProgressPct}%)
          </span>
          <button
            type="button"
            disabled={completedBatchesCount >= profile.batches}
            onClick={() => stepBatchTriggerRef.current?.()}
            style={{
              background: completedBatchesCount >= profile.batches ? '#DCE0CF' : '#4E5B47',
              color: completedBatchesCount >= profile.batches ? '#6F7F63' : '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '6px',
              padding: '2px 9px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: completedBatchesCount >= profile.batches ? 'default' : 'pointer',
              whiteSpace: 'nowrap'
            }}
            title={l('Trigger 1 stoichiometric collision batch manually', 'Déclencher 1 lot de collision manuellement', 'تنفيذ دفعة تصادم جزيئي واحدة يدوياً')}
          >
            ⚡ {l('+1 Collision Batch', '+1 Lot Collision', '+1 دفعة تصادم')}
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE 2D KINETIC MOLECULAR CANVAS */}
      <div style={{ position: 'relative', flex: 1, minHeight: '320px', display: 'flex' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: '320px',
            display: 'block',
            flex: 1
          }}
        />
      </div>

      {/* 4. CPK ATOMIC SPECIES LEGEND BAR */}
      <div
        style={{
          background: 'rgba(237, 234, 225, 0.9)',
          borderTop: '1px solid rgba(111, 127, 99, 0.35)',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#5F6F5B' }}>
          🧬 {l('Active Species in Vessel:', 'Espèces Actives :', 'الجزيئات في الوعاء:')}
        </span>
        {activeSpecs.map(item => (
          <span
            key={item.key}
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '999px',
              padding: '2px 9px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#4E5B47',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: item.spec.atoms[0]?.color || '#4E5B47',
                border: '1px solid #334155',
                display: 'inline-block'
              }}
            />
            <span className="formula-ltr">{item.spec.formula}</span>
            <span style={{ fontSize: '0.65rem', color: '#5F6F5B' }}>
              ({item.role === 'reactant' ? l('Reactant', 'Réactif', 'متفاعل') : l('Product', 'Produit', 'ناتج')})
            </span>
          </span>
        ))}
      </div>

      {/* 5. SOLID POLISHED OAK/SLATE WORKSTATION TELEMETRY BAR (MATCHING LAB BENCH APPARATUS) */}
      <div
        className="lab-bench-footer"
        style={{
          background: 'linear-gradient(180deg, #4A3C2F 0%, #2E241B 100%)',
          borderTop: '3px solid #8C7355',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.12)',
          padding: '10px 1rem',
          color: '#FAF8F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          zIndex: 6
        }}
      >
        {/* Left: Atom & Mass Conservation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.05rem' }}>⚖️</span>
          <div>
            <div style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {l('Atom & Mass Conservation:', 'Conservation Atomique & Massique :', 'حفظ الذرات والكتلة:')}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>
              <span className="formula-ltr">{totalMass.toFixed(2)} g</span>
              <span style={{ opacity: 0.6, margin: '0 5px' }}>➔</span>
              <span className="formula-ltr" style={{ color: '#86EFAC' }}>{totalMass.toFixed(2)} g</span>
              <span style={{ fontSize: '0.7rem', color: '#86EFAC', marginLeft: '5px' }}>
                ({l('100% Atoms Conserved ✓', '100% Atomes Conservés ✓', 'الذرات محفوظة 100% ✓')})
              </span>
            </div>
          </div>
        </div>

        {/* Center: Primary Action Button (Rerun / Run / Pause) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {status === 'complete' && onRun && (
            <button
              onClick={onRun}
              style={{
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                color: '#FAF8F5',
                border: '1.5px solid #86EFAC',
                borderRadius: '999px',
                padding: '6px 18px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.45)'
              }}
            >
              <span>↺</span>
              <span>{l('Rerun Test', 'Relancer le Test', 'إعادة الاختبار')}</span>
            </button>
          )}

          {status === 'running' && (
            <div
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '5px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              <span style={{ color: '#FCD34D' }}>⚡</span>
              <span>
                {l(
                  `Colliding Batches (${completedBatchesCount}/${profile.batches})...`,
                  `Collisions en cours (${completedBatchesCount}/${profile.batches})...`,
                  `تصادم الدفعات (${completedBatchesCount}/${profile.batches})...`
                )}
              </span>
            </div>
          )}

          {status !== 'running' && status !== 'complete' && onRun && (
            <button
              onClick={onRun}
              disabled={reactants.length < 1}
              style={{
                background: '#FAF8F5',
                color: '#4E5B47',
                border: '1.5px solid #DCE0CF',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: reactants.length >= 1 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>▶</span>
              <span>
                {status === 'paused'
                  ? l('Resume Reaction', 'Reprendre', 'استئناف التفاعل')
                  : l('Run Reaction', 'Lancer la Réaction', 'تشغيل التفاعل')}
              </span>
            </button>
          )}
        </div>

        {/* Right: Live Temperature & Enthalpy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ opacity: 0.75 }}>{l('Vessel Temp:', 'Temp. Réacteur :', 'حرارة الوعاء:')} </span>
            <strong className="formula-ltr" style={{ color: temperature > 60 ? '#FCA5A5' : '#93C5FD' }}>
              {temperature} °C
            </strong>
          </div>
          <span style={{ opacity: 0.4 }}>|</span>
          <div>
            <span style={{ opacity: 0.75 }}>ΔH: </span>
            <strong className="formula-ltr" style={{ color: '#FAF8F5' }}>
              {deltaH || (energyType === 'exothermic' ? '-483.6 kJ/mol' : '+178.0 kJ/mol')}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
