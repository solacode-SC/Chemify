export interface ReactantItem {
  id: string;
  formula: string;
  massGrams?: number;
  moles?: number;
}

export type ReactionStatus = 'idle' | 'ready' | 'running' | 'complete' | 'error';
export type EnergyType = 'exothermic' | 'endothermic' | null;

export interface ReactionConditions {
  temperature: string | null;
  pressure: string | null;
  catalyst: string | null;
}

export interface ReactionCalculations {
  limitingReagent: string | null;
  theoreticalYield: string | null;
  percentYield: string | null;
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

