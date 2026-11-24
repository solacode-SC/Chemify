export interface ReactantItem {
  id: string;
  formula: string;
  massGrams?: number;
  moles?: number;
}

export type ReactionStatus = 'idle' | 'ready' | 'running' | 'paused' | 'complete' | 'error';
export type EnergyType = 'exothermic' | 'endothermic' | null;

export interface ReactionConditions {
  temperature: string | null;
  pressure: string | null;
  catalyst: string | null;
}

export interface ProductYieldDetail {
  formula: string;
  name: string;
  coeff: number;
  molarMass: number;
  theoreticalMoles: number;
  theoreticalGrams: number;
  stateLabel: string;
}

export interface ReactantStoichDetail {
  formula: string;
  name: string;
  coeff: number;
  molarMass: number;
  initialGrams: number;
  initialMoles: number;
  consumedGrams: number;
  consumedMoles: number;
  remainingGrams: number;
  remainingMoles: number;
  isLimiting: boolean;
}

export interface ReactionCalculations {
  limitingReagent: string | null;
  excessReagent: string | null;
  theoreticalYield: string | null;
  percentYield: string | null;
  isStoichiometricBalance?: boolean;
  totalInputMass?: number;
  totalProductMass?: number;
  totalRemainingMass?: number;
  reactantDetails?: ReactantStoichDetail[];
  productDetails?: ProductYieldDetail[];
}

export interface ReactionState {
  reactants: ReactantItem[];
  equation: string;
  reactionType: string;
  energyType: EnergyType;
  deltaH?: string;
  conditions: ReactionConditions;
  calculations: ReactionCalculations;
  status: ReactionStatus;
  productsFormula?: string;
}
