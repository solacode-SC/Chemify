import { ToolItem } from '../types/tool';

export const TOOLS_DATA: ToolItem[] = [
  {
    id: 'molar-mass',
    title: 'Molar Mass Calculator',
    subtitle: 'Find the molar mass and average mass of any chemical formula',
    desc: 'Calculate the molecular weight of compounds with instant validation, element breakdown, and mass percentage breakdown.',
    category: 'Calculations',
    badge: 'Basic',
    iconPath: 'assets/icons/Molar Mass Calculator.png'
  },
  {
    id: 'stoichiometry',
    title: 'Stoichiometry Calculator',
    subtitle: 'Calculate reactant and product relationships easily',
    desc: 'Determine mole ratios, mass-to-mole conversions, limiting reactants, and expected product amounts from balanced chemical equations.',
    category: 'Calculations',
    badge: 'Intermediate',
    iconPath: 'assets/icons/Stoichiometry Calculator.png'
  },
  {
    id: 'equation-balancer',
    title: 'Chemical Equation Balancer',
    subtitle: 'Automatically balance complex chemical reactions',
    desc: 'Input unbalanced equations and instantly find stoichiometric integer coefficients with step-by-step atom count verification.',
    category: 'Equations',
    badge: 'Intermediate',
    iconPath: 'assets/icons/Chemical Equation Balancer.png'
  },
  {
    id: 'ph-calculator',
    title: 'pH & pOH Calculator',
    subtitle: 'Calculate pH, pOH, and ion concentrations',
    desc: 'Interactive acid-base analysis tool connecting [H⁺], [OH⁻], pH, and pOH with visual color spectrum slider and substance benchmarks.',
    category: 'Solutions',
    badge: 'Basic',
    iconPath: 'assets/icons/pH & pOH Calculator.png'
  },
  {
    id: 'molarity-dilution',
    title: 'Molarity & Dilution',
    subtitle: 'Compute solution concentrations and dilutions precisely',
    desc: 'Dual calculator for preparing solutions from mass or performing serial dilutions using M₁V₁ = M₂V₂.',
    category: 'Solutions',
    badge: 'Basic',
    iconPath: 'assets/icons/Molarity & Dilution.png'
  },
  {
    id: 'percent-composition',
    title: 'Percent Composition',
    subtitle: 'Determine elemental mass percentages within compounds',
    desc: 'Break down any chemical formula into individual constituent element weights and percentages of total compound mass.',
    category: 'Calculations',
    badge: 'Basic',
    iconPath: 'assets/icons/Percent Composition.png'
  },
  {
    id: 'gibbs-free-energy',
    title: 'Gibbs Free Energy',
    subtitle: 'Assess reaction spontaneity from ΔH and ΔS',
    desc: 'Calculate ΔG = ΔH - TΔS, evaluate thermodynamic spontaneity, and discover the critical temperature boundary for reactions.',
    category: 'Thermodynamics',
    badge: 'Advanced',
    iconPath: 'assets/icons/Gibbs Free Energy.png'
  },
  {
    id: 'ideal-gas-law',
    title: 'Ideal Gas Law',
    subtitle: 'Solve for P, V, n, or T in PV = nRT',
    desc: 'Calculate pressure, volume, moles, or temperature of an ideal gas across various unit systems (atm, kPa, bar, L, K, °C).',
    category: 'Gas Laws',
    badge: 'Intermediate',
    iconPath: 'assets/icons/Ideal Gas Law.png'
  },
  {
    id: 'empirical-formula',
    title: 'Empirical Formula Finder',
    subtitle: 'Calculate lowest whole number ratios of elements',
    desc: 'Convert percent compositions or raw experimental masses into simplified empirical and molecular chemical formulas.',
    category: 'Calculations',
    badge: 'Intermediate',
    iconPath: 'assets/icons/Empirical Formula Finder.png'
  },
  {
    id: 'oxidation-state',
    title: 'Oxidation State Finder',
    subtitle: 'Identify oxidation numbers of atoms in compounds',
    desc: 'Determine electron distribution and oxidation states of elements in polyatomic ions and coordination complexes.',
    category: 'Equations',
    badge: 'Intermediate',
    iconPath: 'assets/icons/Oxidation State Finder.png'
  }
];

