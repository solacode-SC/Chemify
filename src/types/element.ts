export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide';

export type ElementPhase = 'Solid' | 'Liquid' | 'Gas' | 'Unknown';

export interface ElementItem {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  category: ElementCategory;
  period: number;
  group: number;
  gridColumn: number;
  gridRow: number;
}

export interface ElementDetail {
  phase: ElementPhase;
  mp: string;
  bp: string;
  density: string;
  en: string;
  ec: string;
  ox: string;
  year: string;
  by: string;
  shells: number[];
  desc: string;
  uses: string[];
}

export interface FullElement extends ElementItem {
  detail?: ElementDetail;
}

