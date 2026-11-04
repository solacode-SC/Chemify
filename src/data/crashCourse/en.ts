import { CrashCourseItem } from './types';

export const CRASH_COURSES_EN: Record<string, CrashCourseItem> = {
  'molar-mass': {
    id: 'molar-mass',
    title: 'Molar Mass & Formula Weight',
    tagline: 'The universal conversion bridge between the microscopic atom and macroscopic grams.',
    category: 'Calculations',
    badge: 'Basic',
    estimatedTime: '3 min read',
    calculatorPresetValue: { formula: 'CuSO4·5H2O' },
    calculatorPresetLabel: 'Load CuSO₄·5H₂O in Molar Mass Calculator',
    mentalModelAnalogy: {
      title: 'The Egg Carton Mental Model',
      analogy: 'Imagine grocery shopping where eggs are sold in dozens (12 eggs). A dozen quail eggs weighs 120 grams, while a dozen ostrich eggs weighs 18,000 grams. Both contain exactly 12 eggs! In chemistry, a "mole" is simply a chemist\'s mega-dozen (6.022 × 10²³ particles). Molar mass is how much one "carton" of that molecule weighs on a scale.'
    },
    plainEnglish:
      'Molar mass is the mass in grams of exactly one mole of a chemical substance. Because single atoms are unimaginably tiny to weigh on a laboratory balance, chemists group them into moles. Once you know the molar mass of any compound, you can instantly translate laboratory masses into exact molecule counts.',
    whyItMatters:
      'Every single quantitative measurement in chemistry starts here. Without molar mass, you cannot calculate reaction yields, prepare molar solutions, or dose pharmaceuticals safely.',
    primaryEquation: 'M = \\frac{m}{n} = \\sum_{i} (N_i \\times A_{r,i})',
    equationNote: 'Where M is molar mass (g/mol), m is mass (g), n is moles (mol), and Ar,i is the standard atomic weight of each constituent element from the periodic table.',
    variables: [
      { symbol: 'M', name: 'Molar Mass', unit: 'g/mol', desc: 'Total mass of one mole of compound' },
      { symbol: 'm', name: 'Substance Mass', unit: 'g (grams)', desc: 'Measured physical weight on laboratory scale' },
      { symbol: 'n', name: 'Amount of Substance', unit: 'mol (moles)', desc: 'Count of particle packets (1 mol = 6.022×10²³)' },
      { symbol: 'Aᵣ', name: 'Atomic Weight', unit: 'amu or g/mol', desc: 'Standard periodic table atomic weight of each element' }
    ],
    unitConversions: [
      { from: 'mg (milligrams)', to: 'g (grams)', formula: 'g = mg / 1000' },
      { from: 'kg (kilograms)', to: 'g (grams)', formula: 'g = kg × 1000' },
      { from: 'Moles', to: 'Molecules', formula: 'Count = moles × 6.022 × 10²³' }
    ],
    workedExample: {
      problemStatement: 'Calculate the total molar mass of Copper(II) Sulfate Pentahydrate: CuSO₄·5H₂O.',
      given: [
        'Formula contains: 1 Cu, 1 S, 4 O (in sulfate), and 5 H₂O hydrate groups (10 H, 5 O)',
        'Atomic weights: Cu = 63.546 g/mol, S = 32.06 g/mol, O = 15.999 g/mol, H = 1.008 g/mol'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate Anhydrous CuSO₄',
          explanation: 'Sum the masses of 1 copper, 1 sulfur, and 4 oxygen atoms.',
          math: 'CuSO_4 = 63.55 + 32.06 + (4 \\times 16.00) = 159.61\\text{ g/mol}'
        },
        {
          stepNumber: 2,
          title: 'Calculate Hydrate Water (5 H₂O)',
          explanation: 'Each water molecule has 2 H and 1 O (18.016 g/mol). Multiply by the hydrate coefficient 5.',
          math: '5\\text{H}_2\\text{O} = 5 \\times [(2 \\times 1.008) + 16.00] = 5 \\times 18.016 = 90.08\\text{ g/mol}'
        },
        {
          stepNumber: 3,
          title: 'Sum Anhydrous and Water Components',
          explanation: 'Add the anhydrous crystal mass to the trapped water of crystallization.',
          math: 'M = 159.61 + 90.08 = 249.69\\text{ g/mol}'
        }
      ],
      finalResult: '249.69 g/mol (CuSO₄·5H₂O)',
      verificationNote: 'Always remember to multiply the entire water molecule by the hydrate coefficient before adding.'
    },
    knowledgeCheck: {
      question: 'What is the molar mass of pure water (H₂O), using H = 1.008 and O = 15.999 g/mol?',
      options: ['17.01 g/mol', '18.02 g/mol', '32.00 g/mol', '16.00 g/mol'],
      correctIndex: 1,
      explanation: 'Water contains 2 hydrogen atoms (2 × 1.008 = 2.016) plus 1 oxygen atom (15.999) = 18.015 g/mol, rounded to 18.02 g/mol.'
    },
    labApplications: [
      { domain: 'Synthetic Chemistry', application: 'Determining exact stoichiometric amounts for synthesis reactions without wasting costly reagents.' },
      { domain: 'Pharmaceutical Quality', application: 'Confirming identity and crystallization hydrate state in drug formulations.' },
      { domain: 'Analytical Titration', application: 'Translating titration volume endpoints into solute mass and purity percentages.' }
    ],
    commonTraps: [
      {
        trap: 'Confusing subscripts with coefficients inside parentheses (e.g., Al₂(SO₄)₃).',
        howToAvoid: 'Multiply outer subscripts into each inner subscript: 2 Al, 3 S, and 3×4 = 12 O atoms.'
      },
      {
        trap: 'Treating the hydrate dot (·) as mathematical multiplication.',
        howToAvoid: 'The dot means physical crystal adduct — ADD the water mass, never multiply the masses together!'
      }
    ],
    proTips: [
      'Memorize common molecular fragments: H₂O = 18.02 g/mol, SO₄²⁻ = 96.06 g/mol, CO₃²⁻ = 60.01 g/mol.',
      'Check elemental percentages: in heavy salts, the transition metal often accounts for 20-50% of the mass.'
    ],
    recommendedPractice: 'Try computing Glucose (C₆H₁₂O₆) and Magnesium Nitrate Hexahydrate (Mg(NO₃)₂·6H₂O).'
  },

  'stoichiometry': {
    id: 'stoichiometry',
    title: 'Reaction Stoichiometry & Yields',
    tagline: 'The recipe math of chemistry: predicting exactly what comes out from what goes in.',
    category: 'Calculations',
    badge: 'Intermediate',
    estimatedTime: '4 min read',
    calculatorPresetValue: { equation: 'N2 + 3H2 -> 2NH3', inputVal: 28.0 },
    calculatorPresetLabel: 'Load Haber NH₃ Synthesis in Stoichiometry Solver',
    mentalModelAnalogy: {
      title: 'The S’more Recipe Analogy',
      analogy: 'To make 1 S’more, you need 2 Graham Crackers, 1 Marshmallow, and 3 Chocolate squares (2 Gc + 1 M + 3 Ch → 1 Smore). If you have 10 Graham Crackers, 20 Marshmallows, and 100 Chocolates, you can only make 5 S’mores because Graham Crackers run out first! In chemistry, Graham Crackers are your "Limiting Reactant".'
    },
    plainEnglish:
      'Stoichiometry is the mathematical relationship between the quantities of reactants and products in a chemical reaction. Just like baking where ingredients must be in balance, chemical equations give you the exact mole ratio. If one ingredient runs out first, the reaction stops — that is your limiting reactant.',
    whyItMatters:
      'Industrial chemical plants and research labs rely on stoichiometry to minimize toxic waste, optimize costly reagents, and determine the maximum possible (theoretical) yield.',
    primaryEquation: '\\text{Mole Ratio} = \\frac{n_{\\text{Product}}}{n_{\\text{Reactant}}} = \\frac{c_{\\text{Product}}}{c_{\\text{Reactant}}}, \\quad \\% \\text{ Yield} = \\frac{m_{\\text{Actual}}}{m_{\\text{Theoretical}}} \\times 100\\%',
    equationNote: 'Where c represents the integer stoichiometric coefficients from the balanced equation.',
    variables: [
      { symbol: 'n', name: 'Moles', unit: 'mol', desc: 'Fundamental quantity: n = mass / molar mass' },
      { symbol: 'm_actual', name: 'Actual Yield', unit: 'g', desc: 'Real mass weighed after isolating product in lab' },
      { symbol: 'm_theor', name: 'Theoretical Yield', unit: 'g', desc: 'Maximum mathematically possible yield' },
      { symbol: '% Yield', name: 'Percent Yield', unit: '%', desc: 'Efficiency measure: (Actual / Theoretical) × 100%' }
    ],
    workedExample: {
      problemStatement: 'In the Haber process N₂ + 3H₂ → 2NH₃, you react 28.0 g of N₂ with 9.0 g of H₂. What is the limiting reactant and theoretical yield of NH₃?',
      given: [
        'N₂: 28.0 g, Molar Mass = 28.02 g/mol',
        'H₂: 9.0 g, Molar Mass = 2.016 g/mol',
        'NH₃ Molar Mass = 17.03 g/mol'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Convert Masses to Moles',
          explanation: 'Divide mass by molar mass for both starting reactants.',
          math: 'n(\\text{N}_2) = \\frac{28.0}{28.02} = 1.00\\text{ mol}, \\quad n(\\text{H}_2) = \\frac{9.0}{2.016} = 4.46\\text{ mol}'
        },
        {
          stepNumber: 2,
          title: 'Determine Limiting Reactant via Stoichiometric Ratios',
          explanation: 'Compare available moles divided by stoichiometric coefficients (1 for N₂, 3 for H₂).',
          math: '\\frac{n(\\text{N}_2)}{1} = 1.00, \\quad \\frac{n(\\text{H}_2)}{3} = \\frac{4.46}{3} = 1.49'
        },
        {
          stepNumber: 3,
          title: 'Calculate Theoretical Yield of NH₃',
          explanation: 'Since N₂ is the limiting reagent (1.00 < 1.49), it dictates yield: 1 mol N₂ produces 2 mol NH₃.',
          math: 'n(\\text{NH}_3) = 1.00 \\times 2 = 2.00\\text{ mol} \\implies m = 2.00 \\times 17.03 = 34.06\\text{ g}'
        }
      ],
      finalResult: 'Limiting Reagent: N₂ | Theoretical Yield: 34.06 g NH₃',
      verificationNote: 'Notice that 4.46 - 3.00 = 1.46 moles of unreacted H₂ gas will remain in the vessel.'
    },
    knowledgeCheck: {
      question: 'In the reaction 2H₂ + O₂ → 2H₂O, if you have 4 moles of H₂ and 1 mole of O₂, which is the limiting reactant?',
      options: ['H₂ is limiting', 'O₂ is limiting', 'Both react completely with no excess', 'Water is limiting'],
      correctIndex: 1,
      explanation: 'The stoichiometric ratio is 2 moles of H₂ per 1 mole of O₂. 1 mole of O₂ consumes 2 moles of H₂, leaving 2 moles of unreacted H₂. O₂ runs out first, making it limiting.'
    },
    labApplications: [
      { domain: 'Industrial Scale-Up', application: 'Scaling from bench-scale grams to pilot-plant tons with minimal raw material waste.' },
      { domain: 'Green Chemistry', application: 'Measuring atom economy and reaction mass efficiency to prevent environmental pollution.' },
      { domain: 'Synthesis Verification', application: 'Comparing actual laboratory yield to theoretical ceiling to detect synthetic side-reactions.' }
    ],
    commonTraps: [
      {
        trap: 'Assuming the reactant with fewer grams is always the limiting reactant.',
        howToAvoid: 'Always convert to MOLES first and divide by the stoichiometric coefficient!'
      },
      {
        trap: 'Forgetting that diatomic gases (H₂, N₂, O₂, Cl₂) weigh twice their atomic number.',
        howToAvoid: 'Use 2.016 g/mol for H₂, not 1.008 g/mol!'
      }
    ],
    proTips: [
      'The "Mole Bridge" rule: Grams A → Moles A → (Mole Ratio from Equation) → Moles B → Grams B.',
      'A percent yield above 100% in the lab usually means your product is wet with solvent or contaminated.'
    ],
    recommendedPractice: 'Calculate the theoretical yield when 10.0 g of methane (CH₄) burns in 30.0 g of oxygen (O₂).'
  },

  'equation-balancer': {
    id: 'equation-balancer',
    title: 'Chemical Equation Balancing',
    tagline: 'Preserving the inviolable Law of Conservation of Mass across all transformations.',
    category: 'Equations',
    badge: 'Intermediate',
    estimatedTime: '3 min read',
    calculatorPresetValue: { equation: 'C3H8 + O2 -> CO2 + H2O' },
    calculatorPresetLabel: 'Load Propane Combustion in Equation Balancer',
    mentalModelAnalogy: {
      title: 'The LEGO Brick Model',
      analogy: 'Imagine building a castle out of 20 blue LEGO bricks and 10 red bricks. If you tear it down and build a spaceship, you still have exactly 20 blue bricks and 10 red bricks! Atoms in reactions are like LEGO bricks: they disconnect and snap into new shapes, but not a single atom vanishes into thin air.'
    },
    plainEnglish:
      'In any ordinary chemical reaction, atoms are neither created nor destroyed — they are simply rearranged. Balancing an equation means finding integer stoichiometric coefficients so that the total count of each element on the left (reactants) precisely equals the total count on the right (products).',
    whyItMatters:
      'An unbalanced chemical equation is physically impossible. It cannot be used for stoichiometry, thermodynamics, or chemical kinetics.',
    primaryEquation: '\\sum_{\\text{Reactants}} c_i \\cdot A_{i,j} = \\sum_{\\text{Products}} c_k \\cdot A_{k,j}',
    equationNote: 'Where c represents stoichiometric coefficients and A denotes atom counts for each element j.',
    variables: [
      { symbol: 'Reactants', name: 'Starting Materials', unit: 'Chemical Formulas', desc: 'Substances present before reaction takes place' },
      { symbol: 'Products', name: 'Resulting Materials', unit: 'Chemical Formulas', desc: 'Substances produced after bond reorganization' },
      { symbol: 'Coefficients', name: 'Stoichiometric Integers', unit: 'Dimensionless', desc: 'Multipliers placed in front of chemical formulas' },
      { symbol: 'Subscripts', name: 'Atomic Counts', unit: 'Dimensionless', desc: 'Permanent atomic ratios within a specific molecule' }
    ],
    workedExample: {
      problemStatement: 'Balance the combustion reaction of propane: C₃H₈ + O₂ → CO₂ + H₂O.',
      given: [
        'Reactant atoms: C = 3, H = 8, O = 2',
        'Product atoms: C = 1, H = 2, O = 3 (1 from H₂O + 2 from CO₂)'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Balance Carbon Atoms',
          explanation: 'There are 3 Carbons on the left, so place coefficient 3 in front of CO₂.',
          math: '\\text{C}_3\\text{H}_8 + \\text{O}_2 \\rightarrow 3\\text{CO}_2 + \\text{H}_2\\text{O}'
        },
        {
          stepNumber: 2,
          title: 'Balance Hydrogen Atoms',
          explanation: 'There are 8 Hydrogens on the left, so place coefficient 4 in front of H₂O (4 × 2 = 8).',
          math: '\\text{C}_3\\text{H}_8 + \\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}'
        },
        {
          stepNumber: 3,
          title: 'Count Right-Hand Oxygens & Balance Left Oxygen',
          explanation: 'Products have (3 × 2) + (4 × 1) = 10 Oxygen atoms. Divide by 2 for O₂ to get coefficient 5.',
          math: '\\text{C}_3\\text{H}_8 + 5\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}'
        }
      ],
      finalResult: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
      verificationNote: 'Left: 3 C, 8 H, 10 O | Right: 3 C, 8 H, 10 O. Balanced perfectly!'
    },
    knowledgeCheck: {
      question: 'When balancing the combustion of propane C₃H₈ + O₂ → CO₂ + H₂O, what is the balanced integer coefficient in front of O₂?',
      options: ['3', '4', '5', '10'],
      correctIndex: 2,
      explanation: 'Balancing yields C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. The products have 3×2 + 4×1 = 10 oxygen atoms, requiring 5 diatomic O₂ molecules.'
    },
    labApplications: [
      { domain: 'Combustion Engineering', application: 'Calculating exact air-to-fuel ratios for clean engines and rocket thrusters.' },
      { domain: 'Chemical Manufacturing', application: 'Establishing stoichiometric equations for automated reagent dosing systems.' },
      { domain: 'Environmental Auditing', application: 'Tracking carbon mass balance and greenhouse gas emissions in industrial stacks.' }
    ],
    commonTraps: [
      {
        trap: 'Altering chemical subscripts to make atoms balance (e.g., turning H₂O into H₂O₂).',
        howToAvoid: 'NEVER change chemical subscripts! That alters the identity of the chemical entirely. Only modify coefficients.'
      },
      {
        trap: 'Leaving fractional coefficients in final representations.',
        howToAvoid: 'Multiply the entire equation by the denominator to clear fractions (e.g. multiply by 2 if you had 7/2 O₂).'
      }
    ],
    proTips: [
      'Balance strategy order: 1) Metals first, 2) Polyatomic ions that stay intact, 3) Non-metals, 4) Hydrogen, 5) Pure elemental oxygen last.',
      'Chemify uses Gaussian matrix elimination to solve complex multi-phase reactions instantly.'
    ],
    recommendedPractice: 'Balance the redox reaction: KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂.'
  },

  'ph-calculator': {
    id: 'ph-calculator',
    title: 'pH, pOH & Ion Concentrations',
    tagline: 'Decoding the logarithmic acidity spectrum from battery acid to household bleach.',
    category: 'Solutions',
    badge: 'Basic',
    estimatedTime: '3 min read',
    calculatorPresetValue: { mode: 'H', val: 0.005 },
    calculatorPresetLabel: 'Load [H⁺] = 0.005 M in pH & pOH Calculator',
    mentalModelAnalogy: {
      title: 'The Richter Scale of Chemistry',
      analogy: 'Just like the earthquake Richter scale where a magnitude 7 quake is 10 times stronger than magnitude 6, pH is a base-10 logarithmic scale. A liquid with pH 3 is NOT "a little more acidic" than pH 4 — it has 10 times more corrosive hydrogen ions! A jump from pH 6 to 3 is a 1,000-fold surge in acidity.'
    },
    plainEnglish:
      'pH measures the acidity or basicity of an aqueous solution based on hydrogen ion concentration [H⁺]. Because [H⁺] can vary from 1 mol/L in battery acid down to 0.00000000000001 mol/L in drain cleaner, Danish chemist Sørensen invented the negative logarithmic pH scale (0 to 14) to make these numbers intuitive to work with.',
    whyItMatters:
      'Blood pH must remain within the razor-thin window of 7.35 to 7.45; a shift of just 0.4 units causes death. pH dictates enzyme function, marine coral health, drug absorption, and agricultural soil fertility.',
    primaryEquation: '\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad \\text{pOH} = -\\log_{10}[\\text{OH}^-], \\quad \\text{pH} + \\text{pOH} = 14.00 \\text{ (at 25°C)}',
    equationNote: 'Derived from water autoionization constant Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 298.15 K.',
    variables: [
      { symbol: 'pH', name: 'Potential of Hydrogen', unit: 'Dimensionless (0–14)', desc: 'Measure of acidity (<7: acid, =7: neutral, >7: base)' },
      { symbol: '[H⁺] / [H₃O⁺]', name: 'Hydrogen / Hydronium Ion Concentration', unit: 'M (mol/L)', desc: 'Active hydronium ions in solution' },
      { symbol: 'pOH', name: 'Potential of Hydroxide', unit: 'Dimensionless (0–14)', desc: 'Measure of alkalinity' },
      { symbol: '[OH⁻]', name: 'Hydroxide Ion Concentration', unit: 'M (mol/L)', desc: 'Active hydroxide ions in solution' }
    ],
    workedExample: {
      problemStatement: 'A sample of orange juice has a hydrogen ion concentration [H⁺] = 3.16 × 10⁻⁴ M. Find its pH, pOH, and [OH⁻].',
      given: ['[H⁺] = 3.16 × 10⁻⁴ M', 'Temperature = 25 °C (Kw = 1.0 × 10⁻¹⁴)'],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate pH',
          explanation: 'Take the negative base-10 logarithm of [H⁺].',
          math: '\\text{pH} = -\\log_{10}(3.16 \\times 10^{-4}) = -(-3.50) = 3.50'
        },
        {
          stepNumber: 2,
          title: 'Calculate pOH',
          explanation: 'Subtract pH from 14.00.',
          math: '\\text{pOH} = 14.00 - 3.50 = 10.50'
        },
        {
          stepNumber: 3,
          title: 'Calculate Hydroxide Concentration [OH⁻]',
          explanation: 'Raise 10 to the power of negative pOH.',
          math: '[\\text{OH}^-] = 10^{-\\text{pOH}} = 10^{-10.50} = 3.16 \\times 10^{-11}\\text{ M}'
        }
      ],
      finalResult: 'pH = 3.50 (Acidic) | pOH = 10.50 | [OH⁻] = 3.16 × 10⁻¹¹ M',
      verificationNote: 'Check: [H⁺] × [OH⁻] = (3.16 × 10⁻⁴) × (3.16 × 10⁻¹¹) = 1.0 × 10⁻¹⁴. Perfect!'
    },
    knowledgeCheck: {
      question: 'If Solution A has a pH of 3 and Solution B has a pH of 5, how does the hydrogen ion concentration [H⁺] of A compare to B?',
      options: ['2 times more concentrated', '20 times more concentrated', '100 times more concentrated', '10 times less concentrated'],
      correctIndex: 2,
      explanation: 'pH is a base-10 logarithmic scale. A difference of 2 pH units corresponds to a 10² = 100-fold difference in [H⁺] concentration.'
    },
    labApplications: [
      { domain: 'Biomedicine & Pharmacology', application: 'Formulating injectable medications buffered to match physiological blood pH.' },
      { domain: 'Water Sanitation', application: 'Balancing municipal drinking water to prevent pipe corrosion and bacterial growth.' },
      { domain: 'Agriculture', application: 'Monitoring soil pH to ensure mineral nutrient solubility for plant roots.' }
    ],
    commonTraps: [
      {
        trap: 'Assuming a pH decrease from 6 to 3 means the liquid is "twice as acidic".',
        howToAvoid: 'pH is logarithmic! Each unit is a 10-fold change. A jump of 3 units means 10³ = 1,000 times more acidic!'
      },
      {
        trap: 'Significant figures in pH: thinking 3.50 has 3 sig figs.',
        howToAvoid: 'In logarithms, only the digits AFTER the decimal point count as significant figures (3.50 has 2 sig figs).'
      }
    ],
    proTips: [
      'Quick mental check: If [H⁺] = 1 × 10⁻⁵, pH is exactly 5. If [H⁺] = 2 × 10⁻⁵, pH is around 4.7.',
      'Strong acids (HCl, HNO₃, H₂SO₄) dissociate 100%, so [H⁺] directly equals initial molarity.'
    ],
    recommendedPractice: 'Compute the pH of a 0.050 M Barium Hydroxide Ba(OH)₂ solution (note: 2 OH⁻ per formula unit).'
  },

  'molarity-dilution': {
    id: 'molarity-dilution',
    title: 'Molarity & Dilution Preparation',
    tagline: 'Mixing precision chemical solutions and calculating volumetric stock dilutions.',
    category: 'Solutions',
    badge: 'Basic',
    estimatedTime: '3 min read',
    calculatorPresetValue: { tab: 'dilution', m1: 6.0, v1: 50, m2: 0.5, v2: 600, solveFor: 'V2' },
    calculatorPresetLabel: 'Load Acid Dilution (6.0 M → 0.5 M) in Molarity Solver',
    mentalModelAnalogy: {
      title: 'The Sweet Tea Dilution Analogy',
      analogy: 'Imagine a glass of sweet tea with 4 spoonfuls of sugar. If you pour in extra water, the glass gets fuller and tastes less sweet, but does the total amount of sugar change? No! There are still exactly 4 spoonfuls of sugar. That is M₁V₁ = M₂V₂: Moles of chemical before dilution = Moles after dilution.'
    },
    plainEnglish:
      'Molarity (M) expresses how concentrated a solution is, defined as the number of moles of solute dissolved in one liter of total solution. When you add solvent (like water) to dilute a stock solution, the total volume increases while the total moles of chemical remain unchanged — giving rise to the famous dilution law M₁V₁ = M₂V₂.',
    whyItMatters:
      'Almost all wet-lab chemistry takes place in solution. Reagents are shipped as concentrated stocks (e.g. 12 M HCl or 18 M H₂SO₄) that must be diluted safely to working concentrations.',
    primaryEquation: 'M = \\frac{n}{V} = \\frac{m}{MW \\times V}, \\qquad M_1 V_1 = M_2 V_2',
    equationNote: 'Where M is molarity (mol/L), V is solution volume (L), m is mass (g), and MW is molar mass (g/mol).',
    variables: [
      { symbol: 'M₁', name: 'Initial Molarity', unit: 'M (mol/L)', desc: 'Concentration of concentrated stock solution' },
      { symbol: 'V₁', name: 'Initial Volume', unit: 'mL or L', desc: 'Volume of stock solution to pipette' },
      { symbol: 'M₂', name: 'Final Molarity', unit: 'M (mol/L)', desc: 'Desired diluted working concentration' },
      { symbol: 'V₂', name: 'Final Volume', unit: 'mL or L', desc: 'Target total volume of diluted solution' }
    ],
    workedExample: {
      problemStatement: 'You have a 6.0 M stock solution of Sodium Hydroxide (NaOH). You need to prepare 500 mL of a 0.25 M NaOH working solution. How much stock solution and water are needed?',
      given: ['M₁ = 6.0 M', 'M₂ = 0.25 M', 'V₂ = 500 mL'],
      steps: [
        {
          stepNumber: 1,
          title: 'Rearrange Dilution Law for V₁',
          explanation: 'Solve M₁V₁ = M₂V₂ for the initial pipette volume V₁.',
          math: 'V_1 = \\frac{M_2 \\times V_2}{M_1}'
        },
        {
          stepNumber: 2,
          title: 'Calculate Volume of Stock Solution',
          explanation: 'Substitute known values. You can keep units in mL since both volumes match.',
          math: 'V_1 = \\frac{0.25\\text{ M} \\times 500\\text{ mL}}{6.0\\text{ M}} = 20.83\\text{ mL}'
        },
        {
          stepNumber: 3,
          title: 'Calculate Water Volume Added',
          explanation: 'Subtract stock volume from final target volume.',
          math: 'V_{\\text{water}} = 500\\text{ mL} - 20.83\\text{ mL} = 479.17\\text{ mL}'
        }
      ],
      finalResult: 'Pipette 20.8 mL of 6.0 M stock NaOH, then dilute to 500.0 mL in volumetric flask.',
      verificationNote: 'Check moles: 0.02083 L × 6.0 M = 0.125 mol; 0.500 L × 0.25 M = 0.125 mol. Exact match!'
    },
    knowledgeCheck: {
      question: 'How much pure water must be added to 100 mL of 2.0 M NaCl solution to dilute it down to 1.0 M?',
      options: ['50 mL', '100 mL', '200 mL', '500 mL'],
      correctIndex: 1,
      explanation: 'Using M₁V₁ = M₂V₂: (2.0 M)(100 mL) = (1.0 M)(V₂), so V₂ = 200 mL total volume. Since you started with 100 mL, you must add 200 - 100 = 100 mL of water.'
    },
    labApplications: [
      { domain: 'Spectroscopy', application: 'Preparing serial calibration standards for Beer-Lambert UV-Vis absorbance assays.' },
      { domain: 'Chromatography', application: 'Compounding HPLC mobile phase buffers with precise ionic strengths.' },
      { domain: 'Clinical Medicine', application: 'Formulating sterile intravenous saline (0.154 M NaCl) and electrolyte replacements.' }
    ],
    commonTraps: [
      {
        trap: 'Adding water to concentrated acid ("Do as you oughta, add acid to water!").',
        howToAvoid: 'Always add acid slowly to water to dissipate heat and prevent boiling acid splatters.'
      },
      {
        trap: 'Using solvent volume instead of total solution volume in M = n/V.',
        howToAvoid: 'Solutes occupy physical volume. Dissolve the solute in partial volume first, then bring up to the mark in a volumetric flask.'
      }
    ],
    proTips: [
      'In M₁V₁ = M₂V₂, units of volume don’t need to be in Liters as long as V₁ and V₂ use the identical unit.',
      'For solid solute weighing: Grams needed = Desired Molarity × Target Liters × Molar Mass.'
    ],
    recommendedPractice: 'Calculate how many grams of anhydrous NaCl (MW = 58.44) are needed to make 250 mL of 0.90% isotonic saline (0.154 M).'
  },

  'percent-composition': {
    id: 'percent-composition',
    title: 'Elemental Percent Composition',
    tagline: 'Deconstructing compounds into elemental mass percentages.',
    category: 'Calculations',
    badge: 'Basic',
    estimatedTime: '3 min read',
    calculatorPresetValue: { formula: 'C6H12O6' },
    calculatorPresetLabel: 'Load Glucose (C₆H₁₂O₆) in Percent Composition Calculator',
    mentalModelAnalogy: {
      title: 'The Trail Mix Percentage Model',
      analogy: 'Imagine a 100-gram bag of trail mix with 50g peanuts, 30g raisins, and 20g chocolate. The peanuts make up 50% of the total mass. In molecules, percent composition breaks down what fraction of the total molecular weight comes from Carbon, Hydrogen, Oxygen, or Nitrogen.'
    },
    plainEnglish:
      'Percent composition tells you the percentage by mass contributed by each element inside a compound. If you had 100 grams of a compound, the percent composition tells you exactly how many grams of that total are Carbon, Hydrogen, Oxygen, or Nitrogen.',
    whyItMatters:
      'Elemental analyzers in analytical chemistry output raw mass percentages. Comparing experimental percent compositions to theoretical values is how synthetic chemists confirm they successfully created their target molecule.',
    primaryEquation: '\\%\\text{ Element } X = \\frac{N_X \\times A_{r,X}}{M_{\\text{Compound}}} \\times 100\\%',
    equationNote: 'Where Nx is atom count of element X, Ar,x is atomic weight, and M is the compound’s total molar mass.',
    variables: [
      { symbol: '% X', name: 'Mass Fraction Percentage', unit: '%', desc: 'Portion of total compound weight from element X' },
      { symbol: 'N_x', name: 'Element Subscript', unit: 'Dimensionless', desc: 'Number of atoms of element X in formula' },
      { symbol: 'Aᵣ', name: 'Standard Atomic Weight', unit: 'g/mol', desc: 'Element mass from the periodic table' },
      { symbol: 'M', name: 'Total Molar Mass', unit: 'g/mol', desc: 'Formula weight of the complete molecule' }
    ],
    workedExample: {
      problemStatement: 'Calculate the percent composition of Ethanol (C₂H₅OH).',
      given: [
        'Formula: C₂H₆O (2 C, 6 H, 1 O)',
        'Atomic weights: C = 12.011, H = 1.008, O = 16.00 g/mol'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate Total Molar Mass of Ethanol',
          explanation: 'Sum each element’s total mass contribution.',
          math: 'M = (2 \\times 12.011) + (6 \\times 1.008) + 16.00 = 24.022 + 6.048 + 16.00 = 46.07\\text{ g/mol}'
        },
        {
          stepNumber: 2,
          title: 'Calculate Percentages for Each Element',
          explanation: 'Divide each element’s sub-total mass by 46.07 g/mol and multiply by 100%.',
          math: '\\%\\text{C} = \\frac{24.022}{46.07} \\times 100 = 52.14\\%, \\quad \\%\\text{H} = \\frac{6.048}{46.07} \\times 100 = 13.13\\%, \\quad \\%\\text{O} = \\frac{16.00}{46.07} \\times 100 = 34.73\\%'
        },
        {
          stepNumber: 3,
          title: 'Verify Conservation of Mass',
          explanation: 'Ensure the sum of all percentages equals 100%.',
          math: '52.14\\% + 13.13\\% + 34.73\\% = 100.00\\%'
        }
      ],
      finalResult: 'C: 52.14% | H: 13.13% | O: 34.73%',
      verificationNote: 'Always verify the total equals 100.0% (±0.1% due to rounding).'
    },
    knowledgeCheck: {
      question: 'In pure water (H₂O, molar mass ~18.02 g/mol), what is the mass percentage of Oxygen (~16.00 g/mol)?',
      options: ['11.2%', '33.3%', '88.8%', '50.0%'],
      correctIndex: 2,
      explanation: 'Mass percentage is (16.00 / 18.02) × 100% = 88.79% ~ 88.8%. Although hydrogen accounts for 2 of 3 atoms, oxygen accounts for nearly 89% of total molecular mass.'
    },
    labApplications: [
      { domain: 'Organic Synthesis', application: 'Combustion microanalysis (CHNO) to confirm structure and purity of synthesized drugs.' },
      { domain: 'Mining & Metallurgy', application: 'Determining metal recovery percentage from natural mineral ores.' },
      { domain: 'Agrochemicals', application: 'Verifying nitrogen-phosphorus-potassium (N-P-K) percentages on commercial fertilizers.' }
    ],
    commonTraps: [
      {
        trap: 'Forgetting the Hydrogen attached to the alcohol group (C₂H₅OH has 6 Hydrogens total).',
        howToAvoid: 'Condense structural formulas into empirical summaries (C₂H₆O) before calculating mass fractions.'
      },
      {
        trap: 'Rounding elemental percentages prematurely.',
        howToAvoid: 'Maintain at least 4 significant figures during calculations, rounding only at the final step.'
      }
    ],
    proTips: [
      'Mass percent is independent of sample size: 1 drop of pure water has the exact same 88.8% Oxygen as an entire ocean.',
      'Percent composition is the direct bridge to empirical formula determination.'
    ],
    recommendedPractice: 'Find the mass percent of Nitrogen in Ammonium Nitrate fertilizer (NH₄NO₃).'
  },

  'gibbs-free-energy': {
    id: 'gibbs-free-energy',
    title: 'Gibbs Free Energy & Spontaneity',
    tagline: 'Predicting whether chemical reactions occur spontaneously or require continuous external energy.',
    category: 'Thermodynamics',
    badge: 'Advanced',
    estimatedTime: '4 min read',
    calculatorPresetValue: { deltaH: -92.4, deltaS: -198.3, temp: 298.15 },
    calculatorPresetLabel: 'Load Haber Ammonia Synthesis in Gibbs Engine',
    mentalModelAnalogy: {
      title: 'The Roller Coaster & Party Model',
      analogy: 'Enthalpy (ΔH) is like gravity on a roller coaster: systems naturally prefer rolling downhill and releasing heat (-ΔH). Entropy (ΔS) is like a wild party: systems naturally tend toward chaos and messy disorder (+ΔS). Temperature (T) acts as the amplifier for chaos. Gibbs Free Energy (ΔG = ΔH - TΔS) is the judge: if the total energy balance is negative, the reaction rolls forward on its own!'
    },
    plainEnglish:
      'Gibbs Free Energy (ΔG) is the master criterion for chemical spontaneity. It balances two competing forces in nature: Enthalpy (ΔH, the desire of systems to release heat and reach a lower energy state) and Entropy (ΔS, the natural tendency toward randomness and disorder), mediated by absolute temperature in Kelvin (T). If ΔG is negative, the reaction happens spontaneously!',
    whyItMatters:
      'Thermodynamics tells you if a reaction is chemically possible. Millions of dollars in chemical research are saved by calculating ΔG before attempting reactions in the lab.',
    primaryEquation: '\\Delta G = \\Delta H - T\\Delta S',
    equationNote: 'Spontaneous when ΔG < 0; Non-spontaneous when ΔG > 0; Dynamic Equilibrium when ΔG = 0.',
    variables: [
      { symbol: 'ΔG', name: 'Gibbs Free Energy Change', unit: 'kJ/mol', desc: 'Net available thermodynamic work potential' },
      { symbol: 'ΔH', name: 'Enthalpy Change', unit: 'kJ/mol', desc: 'Heat absorbed (endothermic > 0) or released (exothermic < 0)' },
      { symbol: 'T', name: 'Absolute Temperature', unit: 'K (Kelvin)', desc: 'Temperature above absolute zero (K = °C + 273.15)' },
      { symbol: 'ΔS', name: 'Entropy Change', unit: 'J/(mol·K)', desc: 'Change in molecular disorder or microstates' }
    ],
    workedExample: {
      problemStatement: 'For the Haber reaction N₂ + 3H₂ → 2NH₃, ΔH = -92.4 kJ/mol and ΔS = -198.4 J/(mol·K). Is the reaction spontaneous at 298 K (25 °C)? At what temperature does it cease being spontaneous?',
      given: [
        'ΔH = -92.4 kJ/mol (Exothermic)',
        'ΔS = -198.4 J/(mol·K) = -0.1984 kJ/(mol·K)',
        'T = 298.15 K'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Convert Units so ΔH and ΔS Match',
          explanation: 'ΔH is in kJ while ΔS is usually in J. Convert ΔS to kJ by dividing by 1,000.',
          math: '\\Delta S = \\frac{-198.4}{1000} = -0.1984\\text{ kJ/(mol}\\cdot\\text{K)}'
        },
        {
          stepNumber: 2,
          title: 'Calculate ΔG at 298.15 K',
          explanation: 'Apply ΔG = ΔH - TΔS.',
          math: '\\Delta G = -92.4 - (298.15 \\times -0.1984) = -92.4 - (-59.15) = -33.25\\text{ kJ/mol}'
        },
        {
          stepNumber: 3,
          title: 'Find the Crossover Equilibrium Temperature (ΔG = 0)',
          explanation: 'Set ΔG = 0 to find the critical temperature threshold where spontaneity flips: T_eq = ΔH / ΔS.',
          math: 'T_{\\text{eq}} = \\frac{-92.4\\text{ kJ/mol}}{-0.1984\\text{ kJ/(mol}\\cdot\\text{K)}} = 465.7\\text{ K} \\approx 192.6\\text{ }^\\circ\\text{C}'
        }
      ],
      finalResult: 'ΔG = -33.25 kJ/mol (Spontaneous at 25 °C) | T_crossover = 465.7 K (192.6 °C)',
      verificationNote: 'Above 465.7 K, the -TΔS term becomes overwhelmingly positive, making ΔG positive and stopping ammonia formation.'
    },
    knowledgeCheck: {
      question: 'Under what thermodynamic condition is a chemical reaction GUARANTEED to be spontaneous (ΔG < 0) at all temperatures?',
      options: ['ΔH > 0 and ΔS < 0', 'ΔH < 0 (exothermic) and ΔS > 0 (entropy increases)', 'ΔH < 0 and ΔS < 0', 'ΔH > 0 and ΔS > 0'],
      correctIndex: 1,
      explanation: 'In the Gibbs equation ΔG = ΔH - TΔS, when ΔH is negative and ΔS is positive, both terms contribute negatively at any positive Kelvin temperature, ensuring ΔG < 0.'
    },
    labApplications: [
      { domain: 'Industrial Reactors', application: 'Optimizing operating temperature windows to maximize product formation while suppressing backward decomposition.' },
      { domain: 'Cellular Biochemistry', application: 'Coupling non-spontaneous anabolic pathways with ATP hydrolysis (ΔG° = -30.5 kJ/mol).' },
      { domain: 'Electrochemistry', application: 'Predicting theoretical cell voltages in lithium-ion and flow batteries using ΔG° = -nFE°.' }
    ],
    commonTraps: [
      {
        trap: 'Forgetting to convert ΔS from J/(mol·K) to kJ/(mol·K).',
        howToAvoid: 'Always divide ΔS by 1,000 before combining it with ΔH in kJ/mol! Otherwise your answer is off by a factor of 1,000.'
      },
      {
        trap: 'Using Celsius (°C) instead of Kelvin (K) for temperature.',
        howToAvoid: 'Thermodynamics strictly requires absolute zero Kelvin (K = °C + 273.15).'
      }
    ],
    proTips: [
      'The 4 Scenarios: (-ΔH, +ΔS) = Always spontaneous; (+ΔH, -ΔS) = Never spontaneous; (-ΔH, -ΔS) = Spontaneous at low T; (+ΔH, +ΔS) = Spontaneous at high T.',
      'Spontaneous does NOT mean fast! Diamond converting to graphite has ΔG < 0, but takes billions of years because of high activation energy.'
    ],
    recommendedPractice: 'Calculate ΔG for the thermal decomposition of limestone CaCO₃(s) → CaO(s) + CO₂(g) at 298 K and 1100 K.'
  },

  'ideal-gas-law': {
    id: 'ideal-gas-law',
    title: 'Ideal Gas Law & State Variables',
    tagline: 'Linking macroscopic pressure, volume, temperature, and molecular moles in the gas phase.',
    category: 'Gas Laws',
    badge: 'Intermediate',
    estimatedTime: '4 min read',
    calculatorPresetValue: { solveFor: 'P', n: 2.5, v: 10.0, t: 298.15 },
    calculatorPresetLabel: 'Load 2.5 mol Gas in 10 L Vessel at 298.15 K',
    mentalModelAnalogy: {
      title: 'The Bouncing Ping-Pong Ball Model',
      analogy: 'Imagine a closed room filled with bouncing ping-pong balls. Pressure is how hard and often they slam into the walls. If you heat them up (increase Temperature), they fly faster and slam harder. If you squeeze the room (decrease Volume), they hit the walls more frequently. The Ideal Gas Law PV = nRT is the mathematical rule connecting ball speed, wall collisions, and room size.'
    },
    plainEnglish:
      'The Ideal Gas Law (PV = nRT) unites the four fundamental physical properties of a gas into one elegant equation. It combines Boyle’s Law (pressure increases as volume shrinks), Charles’s Law (gas expands when heated), and Avogadro’s Law (more gas molecules take up more space).',
    whyItMatters:
      'From weather balloon expansion in the stratosphere to scuba tank cylinder pressures, internal combustion engines, and autoclave sterilizers — gas behavior governs modern engineering.',
    primaryEquation: 'PV = nRT',
    equationNote: 'R is the Universal Gas Constant: 0.08206 L·atm/(mol·K) or 8.314 J/(mol·K) = 8.314 kPa·L/(mol·K).',
    variables: [
      { symbol: 'P', name: 'Pressure', unit: 'atm, kPa, bar, mmHg', desc: 'Force exerted by gas collisions per unit area' },
      { symbol: 'V', name: 'Volume', unit: 'L (liters) or m³', desc: 'Physical space occupied by the gas' },
      { symbol: 'n', name: 'Moles', unit: 'mol', desc: 'Amount of gas molecules' },
      { symbol: 'R', name: 'Ideal Gas Constant', unit: '0.08206 L·atm/(mol·K)', desc: 'Universal proportionality constant' },
      { symbol: 'T', name: 'Absolute Temperature', unit: 'K (Kelvin)', desc: 'Direct measure of average kinetic energy' }
    ],
    workedExample: {
      problemStatement: 'A rigid 15.0 L gas cylinder contains 48.0 g of Oxygen gas (O₂) at a temperature of 27 °C. What is the pressure inside the cylinder in atmospheres?',
      given: [
        'V = 15.0 L',
        'Mass = 48.0 g of O₂ (Molar Mass = 32.00 g/mol)',
        'T = 27 °C → T = 27 + 273.15 = 300.15 K',
        'R = 0.08206 L·atm/(mol·K)'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculate Moles of Oxygen Gas (O₂)',
          explanation: 'Divide mass by molar mass of diatomic oxygen (32.00 g/mol).',
          math: 'n = \\frac{48.0\\text{ g}}{32.00\\text{ g/mol}} = 1.50\\text{ mol}'
        },
        {
          stepNumber: 2,
          title: 'Rearrange Ideal Gas Law for Pressure',
          explanation: 'Isolate P by dividing both sides of PV = nRT by Volume V.',
          math: 'P = \\frac{nRT}{V}'
        },
        {
          stepNumber: 3,
          title: 'Substitute Values & Compute',
          explanation: 'Plug in n = 1.50 mol, R = 0.08206, T = 300.15 K, V = 15.0 L.',
          math: 'P = \\frac{1.50 \\times 0.08206 \\times 300.15}{15.0} = 2.46\\text{ atm}'
        }
      ],
      finalResult: '2.46 atm (or 249.5 kPa)',
      verificationNote: 'Always verify that temperature is in Kelvin. Using Celsius (27) would result in an error of over 90%!'
    },
    knowledgeCheck: {
      question: 'If the absolute temperature of a gas in a sealed rigid container is doubled from 300 K to 600 K, what happens to the pressure?',
      options: ['Pressure halves', 'Pressure doubles', 'Pressure quadruples', 'Pressure remains unchanged'],
      correctIndex: 1,
      explanation: 'Gay-Lussac\'s Law states that at constant volume and moles, pressure is directly proportional to absolute temperature (P ∝ T). Doubling Kelvin temperature doubles pressure.'
    },
    labApplications: [
      { domain: 'Compressed Gas Safety', application: 'Calculating cylinder burst safety margins in high-pressure gas storage.' },
      { domain: 'Aerospace & Weather', application: 'Modeling tropospheric pressure decay and balloon buoyancy.' },
      { domain: 'Organic Synthesis', application: 'Determining exact gas volume requirements for catalytic hydrogenation reactors.' }
    ],
    commonTraps: [
      {
        trap: 'Plugging in temperatures in Celsius instead of Kelvin.',
        howToAvoid: 'ALWAYS add 273.15 to Celsius before doing any gas calculations!'
      },
      {
        trap: 'Mixing up gas constant units (using 0.08206 with Pascal or 8.314 with Atmospheres).',
        howToAvoid: 'Use R = 0.08206 when V is in L and P is in atm. Use R = 8.314 when P is in Pa and V is in m³.'
      }
    ],
    proTips: [
      'At Standard Temperature and Pressure (STP: 0°C, 1 atm), exactly 1 mole of any ideal gas occupies 22.414 Liters.',
      'Gases deviate from ideal behavior only at extreme high pressures and near-liquefaction cold temperatures.'
    ],
    recommendedPractice: 'Calculate the volume occupied by 2.0 moles of Neon gas at 2.0 atm and 350 K.'
  },

  'empirical-formula': {
    id: 'empirical-formula',
    title: 'Empirical & Molecular Formula Determination',
    tagline: 'Deciphering the simplest whole-number atomic ratio from combustion elemental analysis.',
    category: 'Analysis',
    badge: 'Intermediate',
    estimatedTime: '4 min read',
    calculatorPresetValue: { elements: [{ symbol: 'C', amount: 40.0 }, { symbol: 'H', amount: 6.7 }, { symbol: 'O', amount: 53.3 }] },
    calculatorPresetLabel: 'Load 40% C, 6.7% H, 53.3% O in Empirical Formula Finder',
    mentalModelAnalogy: {
      title: 'The Blueprint vs Finished Building Model',
      analogy: 'An empirical formula is like an architectural ratio: "2 bricks for every 1 window" (CH₂O). The molecular formula is the actual finished skyscraper: it has 6 windows and 12 bricks (C₆H₁₂O₆). Both describe the same material, but the molecular formula tells you the true size of the building.'
    },
    plainEnglish:
      'When chemists discover a new plant extract or synthesize a novel compound, combustion analysis reveals mass percentages of Carbon, Hydrogen, Oxygen, etc. The empirical formula is the simplest integer ratio of atoms in that molecule.',
    whyItMatters:
      'Universal first step in natural product chemistry, forensic narcotics identification, and quality verification in organic synthesis.',
    primaryEquation: '\\text{Mole Ratio} = \\frac{m_i}{A_{r,i}}, \\quad n = \\frac{M_{\\text{molecular}}}{M_{\\text{empirical}}}',
    equationNote: 'Where n is the integer multiplier to transform the empirical formula into the true molecular formula.',
    variables: [
      { symbol: '% or m', name: 'Elemental Percentage or Mass', unit: '% or g', desc: 'Experimental mass analysis from combustion' },
      { symbol: 'n_i', name: 'Moles of Element i', unit: 'mol', desc: 'n_i = mass / atomic weight' },
      { symbol: 'Ratio', name: 'Subscript Ratio', unit: 'Integer', desc: 'Divided by lowest mole value and cleared of fractions' },
      { symbol: 'M_mol', name: 'Molecular Molar Mass', unit: 'g/mol', desc: 'Measured by mass spectrometry' }
    ],
    workedExample: {
      problemStatement: 'Elemental analysis of a carbohydrate shows 40.0% Carbon, 6.7% Hydrogen, and 53.3% Oxygen by mass. If its measured molar mass is 180.16 g/mol, determine both the empirical and molecular formulas.',
      given: [
        'C = 40.0%, H = 6.7%, O = 53.3%',
        'Atomic weights: C = 12.011 g/mol, H = 1.008 g/mol, O = 16.00 g/mol',
        'Measured molar mass = 180.16 g/mol'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Assume a 100 g Sample',
          explanation: 'In a 100 g sample, percentage equals mass directly in grams.',
          math: 'm(\\text{C}) = 40.0\\text{ g}, \\; m(\\text{H}) = 6.7\\text{ g}, \\; m(\\text{O}) = 53.3\\text{ g}'
        },
        {
          stepNumber: 2,
          title: 'Convert Grams to Moles',
          explanation: 'Divide each mass by atomic weight.',
          math: 'n(\\text{C}) = \\frac{40.0}{12.011} = 3.33\\text{ mol}, \\quad n(\\text{H}) = \\frac{6.7}{1.008} = 6.65\\text{ mol}, \\quad n(\\text{O}) = \\frac{53.3}{16.00} = 3.33\\text{ mol}'
        },
        {
          stepNumber: 3,
          title: 'Divide by Smallest Mole Value (3.33)',
          explanation: 'Find the lowest whole number atom ratio.',
          math: '\\text{C} = \\frac{3.33}{3.33} = 1.00, \\quad \\text{H} = \\frac{6.65}{3.33} = 2.00, \\quad \\text{O} = \\frac{3.33}{3.33} = 1.00 \\implies \\text{CH}_2\\text{O}'
        },
        {
          stepNumber: 4,
          title: 'Determine Molecular Formula Multiplier n',
          explanation: 'Empirical mass of CH₂O = 12.011 + 2(1.008) + 16.00 = 30.03 g/mol. Divide actual molar mass by empirical mass.',
          math: 'n = \\frac{180.16\\text{ g/mol}}{30.03\\text{ g/mol}} = 6.00 \\implies (\\text{CH}_2\\text{O})_6 = \\text{C}_6\\text{H}_{12}\\text{O}_6'
        }
      ],
      finalResult: 'Empirical Formula: CH₂O | Molecular Formula: C₆H₁₂O₆ (Glucose)',
      verificationNote: 'C₆H₁₂O₆ has MW = 180.16 g/mol and exact percentage breakdown matching given values.'
    },
    knowledgeCheck: {
      question: 'A compound has the empirical formula CH₂O (mass 30.03 g/mol) and a molar mass of 180.16 g/mol. What is its molecular formula?',
      options: ['CH₂O', 'C₂H₄O₂', 'C₆H₁₂O₆', 'C₁₂H₂₂O₁₁'],
      correctIndex: 2,
      explanation: 'Dividing molar mass by empirical formula mass gives 180.16 / 30.03 = 6. Multiplying subscripts by 6 gives C₆H₁₂O₆ (Glucose).'
    },
    labApplications: [
      { domain: 'Natural Product Isolation', application: 'Identifying novel secondary metabolites and alkaloids extracted from rainforest plants.' },
      { domain: 'Forensics', application: 'Identifying seized unknown contraband powders from elemental combustion data.' },
      { domain: 'Polymer Engineering', application: 'Calculating repeat monomer units from elemental analysis percentages.' }
    ],
    commonTraps: [
      {
        trap: 'Rounding fractional ratios too early (e.g. rounding 1.33 to 1 or 1.5 to 2).',
        howToAvoid: 'If a ratio ends in .5, multiply all by 2. If it ends in .33 or .67, multiply all by 3. If it ends in .25 or .75, multiply all by 4!'
      },
      {
        trap: 'Dividing percents directly by the formula weight instead of individual element atomic weights.',
        howToAvoid: 'Always convert each individual element to moles on its own first.'
      }
    ],
    proTips: [
      'The 4-Word Mantra: "Percent to Mass, Mass to Mole, Divide by Small, Multiply \'til Whole."',
      'Empirical and molecular formulas can be identical (e.g. H₂O, CO₂, NH₃) when n = 1.'
    ],
    recommendedPractice: 'Find empirical formula of a compound with 52.9% Aluminum and 47.1% Oxygen.'
  },

  'oxidation-state': {
    id: 'oxidation-state',
    title: 'Oxidation States & Electron Bookkeeping',
    tagline: 'Tracking electron transfer in redox reactions and polyatomic coordination complexes.',
    category: 'Equations',
    badge: 'Intermediate',
    estimatedTime: '3 min read',
    calculatorPresetValue: { formula: 'KMnO4' },
    calculatorPresetLabel: 'Load Permanganate (KMnO₄) in Oxidation State Finder',
    mentalModelAnalogy: {
      title: 'The Electron Bank Account Model',
      analogy: 'Think of oxidation states as formal bank ledgers for electrons. When an atom "spends" or loses electrons, its bank balance becomes more positive (+1, +2, +3) — this is Oxidation (LEO = Lose Electrons Oxidation). When an atom "deposits" or gains negative electrons, its balance drops (-1, -2) — this is Reduction (GER = Gain Electrons Reduction).'
    },
    plainEnglish:
      'An oxidation state (or oxidation number) is an imaginary bookkeeping charge an atom would have if all bonds to other atoms were 100% ionic. It tracks whether an element has gained electrons (reduction = decrease in oxidation number) or lost electrons (oxidation = increase in oxidation number).',
    whyItMatters:
      'Redox reactions power life (cellular respiration and photosynthesis) and technology (lithium-ion batteries, fuel cells, electroplating, and metal corrosion prevention).',
    primaryEquation: '\\sum (\\text{Oxidation States}) = \\text{Total Net Charge}',
    equationNote: 'Neutral molecules sum to 0; Polyatomic ions sum to the net ionic charge.',
    variables: [
      { symbol: 'Ox #', name: 'Oxidation Number', unit: 'Integer (-4 to +8)', desc: 'Formal ionic bookkeeping charge' },
      { symbol: 'OIL RIG', name: 'Memory Mnemonic', unit: 'Rule', desc: 'Oxidation Is Loss of electrons, Reduction Is Gain of electrons' },
      { symbol: 'LEO GER', name: 'Alternative Mnemonic', unit: 'Rule', desc: 'Lose Electrons = Oxidation, Gain Electrons = Reduction' },
      { symbol: 'q_net', name: 'Net Complex Charge', unit: 'e (elementary charge)', desc: 'Total charge of the species (e.g. -2 for SO₄²⁻)' }
    ],
    workedExample: {
      problemStatement: 'Find the oxidation state of Manganese (Mn) in the permanganate ion: MnO₄⁻.',
      given: [
        'Species is a polyatomic ion with net charge = -1',
        'Standard rule: Oxygen has an oxidation state of -2 in compounds',
        'Formula has 1 Mn and 4 O atoms'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Set Up Charge Sum Equation',
          explanation: 'The sum of all oxidation numbers must equal the net charge of the ion (-1).',
          math: '1 \\times \\text{Ox}(\\text{Mn}) + 4 \\times \\text{Ox}(\\text{O}) = -1'
        },
        {
          stepNumber: 2,
          title: 'Substitute Known Oxygen State (-2)',
          explanation: 'Each oxygen contributes -2.',
          math: '\\text{Ox}(\\text{Mn}) + 4(-2) = -1 \\implies \\text{Ox}(\\text{Mn}) - 8 = -1'
        },
        {
          stepNumber: 3,
          title: 'Solve for Manganese (Mn)',
          explanation: 'Add 8 to both sides.',
          math: '\\text{Ox}(\\text{Mn}) = -1 + 8 = +7'
        }
      ],
      finalResult: 'Manganese in MnO₄⁻ has an oxidation state of +7 (MnVII)',
      verificationNote: 'Check: (+7) + 4(-2) = +7 - 8 = -1. Equals the ion charge exactly!'
    },
    knowledgeCheck: {
      question: 'What is the oxidation state of Manganese (Mn) in potassium permanganate (KMnO₄)?',
      options: ['+2', '+4', '+6', '+7'],
      correctIndex: 3,
      explanation: 'K is +1, each O is -2 (4 × -2 = -8). For a neutral molecule: +1 + Mn + (-8) = 0, which gives Mn = +7.'
    },
    labApplications: [
      { domain: 'Battery Technology', application: 'Designing lithium-ion cathode intercalation chemistries based on transition metal redox couples (e.g. Co³⁺ / Co⁴⁺).' },
      { domain: 'Corrosion Prevention', application: 'Installing sacrificial zinc anodes on ship hulls to protect iron from oxidation.' },
      { domain: 'Electroplating', application: 'Calculating Faradaic electricity needed to deposit thin decorative gold or chromium layers.' }
    ],
    commonTraps: [
      {
        trap: 'Assuming an element always has the same oxidation state in every compound.',
        howToAvoid: 'Transition metals (like Fe, Mn, Cr, Cu) have multiple common states (e.g., Fe²⁺ vs Fe³⁺; Mn can be +2, +4, +7).'
      },
      {
        trap: 'Confusing charge notation (+2 vs 2+).',
        howToAvoid: 'By IUPAC convention: formal charge puts the number first (2+), whereas oxidation states put the sign first (+2).'
      }
    ],
    proTips: [
      'Ironclad Priority Rules: 1) Free pure elements = 0 (Fe, O₂, H₂). 2) Fluorine is ALWAYS -1. 3) Group 1 alkali metals are ALWAYS +1, Group 2 are +2. 4) Hydrogen is +1 (except in metal hydrides like NaH where it is -1). 5) Oxygen is -2 (except peroxides -1 and OF₂).',
      'The highest known oxidation state in stable chemistry is +8 (in OsO₄ and IrO₄⁺).'
    ],
    recommendedPractice: 'Determine the oxidation state of Chromium in the dichromate ion Cr₂O₇²⁻.'
  }
};

