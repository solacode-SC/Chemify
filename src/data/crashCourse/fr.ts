import { CrashCourseItem } from './types';

export const CRASH_COURSES_FR: Record<string, CrashCourseItem> = {
  'molar-mass': {
    id: 'molar-mass',
    title: 'Masse Molaire & Poids Formulaire',
    tagline: 'Le pont universel de conversion entre l’atome microscopique et les grammes macroscopiques.',
    category: 'Calculs',
    badge: 'Basic',
    estimatedTime: '3 min de lecture',
    calculatorPresetValue: { formula: 'CuSO4·5H2O' },
    calculatorPresetLabel: 'Charger CuSO₄·5H₂O dans le calculateur de masse molaire',
    mentalModelAnalogy: {
      title: 'Le Modèle Mental de la Boîte d’Œufs',
      analogy: 'Imaginez faire vos courses où les œufs sont vendus par douzaines (12 œufs). Une douzaine d’œufs de caille pèse 120 grammes, tandis qu’une douzaine d’œufs d’autruche pèse 18 000 grammes. Les deux contiennent exactement 12 œufs ! En chimie, la "mole" est simplement la méga-douzaine du chimiste (6,022 × 10²³ particules). La masse molaire est la masse sur la balance d’une "boîte" entière de cette molécule.'
    },
    plainEnglish:
      'La masse molaire est la masse en grammes d’exactement une mole d’une substance chimique. Parce que les atomes individuels sont trop minuscules pour être pesés sur une balance de laboratoire, les chimistes les regroupent en moles. Connaître la masse molaire permet de convertir instantanément les masses pesées en nombre exact de molécules.',
    whyItMatters:
      'Chaque mesure quantitative en chimie commence ici. Sans la masse molaire, impossible de calculer les rendements de réaction, préparer des solutions molaires ou doser les principes actifs pharmaceutiques.',
    primaryEquation: 'M = \\frac{m}{n} = \\sum_{i} (N_i \\times A_{r,i})',
    equationNote: 'Où M est la masse molaire (g/mol), m est la masse (g), n est la quantité de matière (mol), et Ar,i est la masse atomique standard de chaque élément.',
    variables: [
      { symbol: 'M', name: 'Masse Molaire', unit: 'g/mol', desc: 'Masse totale d’une mole de composé' },
      { symbol: 'm', name: 'Masse de la Substance', unit: 'g (grammes)', desc: 'Poids physique mesuré sur la balance' },
      { symbol: 'n', name: 'Quantité de Matière', unit: 'mol (moles)', desc: 'Nombre de paquets de particules (1 mol = 6,022 × 10²³)' },
      { symbol: 'Aᵣ', name: 'Masse Atomique', unit: 'u ou g/mol', desc: 'Masse atomique standard issue du tableau périodique' }
    ],
    unitConversions: [
      { from: 'mg (milligrammes)', to: 'g (grammes)', formula: 'g = mg / 1000' },
      { from: 'kg (kilogrammes)', to: 'g (grammes)', formula: 'g = kg × 1000' },
      { from: 'Moles', to: 'Molécules', formula: 'Nombre = moles × 6,022 × 10²³' }
    ],
    workedExample: {
      problemStatement: 'Calculez la masse molaire totale du sulfate de cuivre(II) pentahydraté : CuSO₄·5H₂O.',
      given: [
        'Formule : 1 Cu, 1 S, 4 O (dans le sulfate) et 5 groupes H₂O d’hydratation (10 H, 5 O)',
        'Masses atomiques : Cu = 63,546 g/mol, S = 32,06 g/mol, O = 15,999 g/mol, H = 1,008 g/mol'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculer la partie anhydre CuSO₄',
          explanation: 'Sommez les masses de 1 cuivre, 1 soufre et 4 atomes d’oxygène.',
          math: 'CuSO_4 = 63,55 + 32,06 + (4 \\times 16,00) = 159,61\\text{ g/mol}'
        },
        {
          stepNumber: 2,
          title: 'Calculer l’eau d’hydratation (5 H₂O)',
          explanation: 'Chaque molécule d’eau pèse 18,016 g/mol. Multipliez par le coefficient d’hydratation 5.',
          math: '5\\text{H}_2\\text{O} = 5 \\times [(2 \\times 1,008) + 16,00] = 5 \\times 18,016 = 90,08\\text{ g/mol}'
        },
        {
          stepNumber: 3,
          title: 'Additionner les deux composantes',
          explanation: 'Ajoutez la masse du réseau cristallin anhydre à celle des molécules d’eau piégées.',
          math: 'M = 159,61 + 90,08 = 249,69\\text{ g/mol}'
        }
      ],
      finalResult: '249,69 g/mol (CuSO₄·5H₂O)',
      verificationNote: 'Pensez toujours à multiplier la molécule d’eau entière par le coefficient d’hydratation avant d’additionner.'
    },
    knowledgeCheck: {
      question: 'Quelle est la masse molaire de l’eau pure (H₂O) avec H = 1,008 et O = 15,999 g/mol ?',
      options: ['17,01 g/mol', '18,02 g/mol', '32,00 g/mol', '16,00 g/mol'],
      correctIndex: 1,
      explanation: 'L’eau contient 2 atomes d’hydrogène (2 × 1,008 = 2,016) plus 1 atome d’oxygène (15,999) = 18,015 g/mol, arrondi à 18,02 g/mol.'
    },
    labApplications: [
      { domain: 'Chimie de Synthèse', application: 'Calculer les quantités stœchiométriques exactes pour éviter de gaspiller des réactifs onéreux.' },
      { domain: 'Contrôle Pharmaceutique', application: 'Vérifier l’identité chimique et le degré d’hydratation des principes actifs.' },
      { domain: 'Dosages & Titrages', application: 'Convertir les volumes d’équivalence en masses et pourcentages de pureté.' }
    ],
    commonTraps: [
      {
        trap: 'Confondre les indices multiplicatifs entre parenthèses (ex: Al₂(SO₄)₃).',
        howToAvoid: 'Multipliez l’indice extérieur par chaque indice intérieur : 2 Al, 3 S et 3×4 = 12 atomes O.'
      },
      {
        trap: 'Traiter le point d’hydratation (·) comme une multiplication mathématique.',
        howToAvoid: 'Le point désigne un complexe d’inclusion cristalline : il faut ADDITIONNER la masse de l’eau, jamais la multiplier !'
      }
    ],
    proTips: [
      'Mémorisez les fragments fréquents : H₂O = 18,02 g/mol, SO₄²⁻ = 96,06 g/mol, CO₃²⁻ = 60,01 g/mol.',
      'Vérifiez la cohérence : dans les sels de métaux de transition, le métal représente souvent 20 à 50% de la masse.'
    ],
    recommendedPractice: 'Calculez la masse molaire du glucose (C₆H₁₂O₆) et du nitrate de magnésium hexahydraté (Mg(NO₃)₂·6H₂O).'
  },

  'stoichiometry': {
    id: 'stoichiometry',
    title: 'Stœchiométrie & Rendements de Réaction',
    tagline: 'Les proportions mathématiques de la chimie : prévoir exactement ce qui est produit à partir des réactifs.',
    category: 'Calculs',
    badge: 'Intermediate',
    estimatedTime: '4 min de lecture',
    calculatorPresetValue: { equation: 'N2 + 3H2 -> 2NH3', inputVal: 28.0 },
    calculatorPresetLabel: 'Charger la synthèse de Haber (NH₃) dans le solveur de stœchiométrie',
    mentalModelAnalogy: {
      title: 'L’Analogie de la Recette de Cuisine',
      analogy: 'Pour préparer un sandwich, il vous faut 2 tranches de pain et 1 tranche de fromage. Si vous possédez 10 tranches de pain et 20 tranches de fromage, vous ne pouvez confectionner que 5 sandwiches, car le pain vient à manquer en premier ! En chimie, le pain est votre "réactif limitant".'
    },
    plainEnglish:
      'La stœchiométrie étudie les proportions dans lesquelles les réactifs réagissent et les produits se forment. Tout comme dans une recette équilibrée, l’équation chimique fournit le rapport molaire exact. Dès qu’un réactif est épuisé, la réaction s’arrête — c’est le réactif limitant.',
    whyItMatters:
      'Les usines chimiques et les laboratoires de recherche dépendent de la stœchiométrie pour limiter les déchets toxiques, optimiser les coûts et déterminer le rendement maximal théorique.',
    primaryEquation: '\\text{Rapport Molaire} = \\frac{n_{\\text{Produit}}}{n_{\\text{Réactif}}} = \\frac{c_{\\text{Produit}}}{c_{\\text{Réactif}}}, \\quad \\% \\text{ Rendement} = \\frac{m_{\\text{Réel}}}{m_{\\text{Théorique}}} \\times 100\\%',
    equationNote: 'Où c représente les coefficients stœchiométriques entiers de l’équation équilibrée.',
    variables: [
      { symbol: 'n', name: 'Quantité de Matière', unit: 'mol', desc: 'Grandeur fondamentale : n = m / M' },
      { symbol: 'm_reel', name: 'Rendement Réel', unit: 'g', desc: 'Masse effectivement pesée après purification au laboratoire' },
      { symbol: 'm_theor', name: 'Rendement Théorique', unit: 'g', desc: 'Masse maximale calculée selon la stœchiométrie' },
      { symbol: '% Rendement', name: 'Rendement Pourcentage', unit: '%', desc: 'Mesure d’efficacité : (Réel / Théorique) × 100%' }
    ],
    workedExample: {
      problemStatement: 'Dans le procédé Haber N₂ + 3H₂ → 2NH₃, vous faites réagir 28,0 g de N₂ avec 9,0 g de H₂. Quel est le réactif limitant et le rendement théorique en NH₃ ?',
      given: [
        'N₂ : 28,0 g, Masse molaire = 28,02 g/mol',
        'H₂ : 9,0 g, Masse molaire = 2,016 g/mol',
        'NH₃ : Masse molaire = 17,03 g/mol'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Convertir les masses en moles',
          explanation: 'Divisez la masse par la masse molaire pour chaque réactif initial.',
          math: 'n(\\text{N}_2) = \\frac{28,0}{28,02} = 1,00\\text{ mol}, \\quad n(\\text{H}_2) = \\frac{9,0}{2,016} = 4,46\\text{ mol}'
        },
        {
          stepNumber: 2,
          title: 'Identifier le réactif limitant',
          explanation: 'Comparez les moles disponibles divisées par leur coefficient stœchiométrique (1 pour N₂, 3 pour H₂).',
          math: '\\frac{n(\\text{N}_2)}{1} = 1,00, \\quad \\frac{n(\\text{H}_2)}{3} = \\frac{4,46}{3} = 1,49'
        },
        {
          stepNumber: 3,
          title: 'Calculer le rendement théorique en NH₃',
          explanation: 'N₂ étant limitant (1,00 < 1,49), il dicte la production : 1 mol de N₂ produit 2 mol de NH₃.',
          math: 'n(\\text{NH}_3) = 1,00 \\times 2 = 2,00\\text{ mol} \\implies m = 2,00 \\times 17,03 = 34,06\\text{ g}'
        }
      ],
      finalResult: 'Réactif limitant : N₂ | Rendement théorique : 34,06 g de NH₃',
      verificationNote: 'Remarquez qu’il restera 4,46 - 3,00 = 1,46 mol de gaz H₂ non réagi dans le réacteur.'
    },
    knowledgeCheck: {
      question: 'Dans la réaction 2H₂ + O₂ → 2H₂O, si vous avez 4 moles de H₂ et 1 mole de O₂, quel est le réactif limitant ?',
      options: ['H₂ est limitant', 'O₂ est limitant', 'Les deux réagissent sans aucun reste', 'L’eau est limitante'],
      correctIndex: 1,
      explanation: 'Le rapport stœchiométrique exige 2 moles de H₂ pour 1 mole de O₂. 1 mole de O₂ consomme 2 moles de H₂, laissant 2 moles de H₂ en excès. O₂ s’épuise en premier.'
    },
    labApplications: [
      { domain: 'Génie Chimique', application: 'Extrapoler la production du bécher aux tonnes industrielles en minimisant les réactifs perdus.' },
      { domain: 'Chimie Verte', application: 'Mesurer l’économie d’atomes pour prévenir les rejets polluants.' },
      { domain: 'Contrôle de Pureté', application: 'Détecter les réactions secondaires en comparant le rendement réel au plafond théorique.' }
    ],
    commonTraps: [
      {
        trap: 'Penser que le réactif présent en plus petite masse (en grammes) est toujours le réactif limitant.',
        howToAvoid: 'Convertissez TOUJOURS en moles et divisez par le coefficient stœchiométrique !'
      },
      {
        trap: 'Oublier que les molécules diatomiques (H₂, N₂, O₂, Cl₂) ont une masse molaire doublée.',
        howToAvoid: 'Prenez 2,016 g/mol pour H₂, et non 1,008 g/mol !'
      }
    ],
    proTips: [
      'La méthode du pont molaire : Grammes A → Moles A → (Rapport stœchiométrique) → Moles B → Grammes B.',
      'Un rendement supérieur à 100% au laboratoire signifie souvent que le solide est humide ou contaminé par le solvant.'
    ],
    recommendedPractice: 'Calculez le rendement théorique lorsque 10,0 g de méthane (CH₄) brûlent dans 30,0 g de dioxygène (O₂).'
  },

  'equation-balancer': {
    id: 'equation-balancer',
    title: 'Équilibrage des Équations Chimiques',
    tagline: 'Préserver l’inviolable loi de conservation de la masse à travers toutes les transformations.',
    category: 'Équations',
    badge: 'Intermediate',
    estimatedTime: '3 min de lecture',
    calculatorPresetValue: { equation: 'C3H8 + O2 -> CO2 + H2O' },
    calculatorPresetLabel: 'Charger la combustion du propane dans l’équilibreur',
    mentalModelAnalogy: {
      title: 'Le Modèle des Briques LEGO',
      analogy: 'Imaginez construire un château avec 20 briques bleues et 10 briques rouges. Si vous le détruisez pour assembler un vaisseau spatial, vous avez toujours exactement 20 briques bleues et 10 briques rouges ! Les atomes lors d’une réaction se réarrangent dans de nouvelles liaisons, mais aucun atome ne disparaît dans le néant.'
    },
    plainEnglish:
      'Dans toute réaction chimique ordinaire, les atomes ne sont ni créés ni détruits : ils sont simplement réorganisés. Équilibrer une équation consiste à déterminer les coefficients stœchiométriques entiers pour que le nombre d’atomes de chaque élément à gauche (réactifs) soit strictement égal à celui de droite (produits).',
    whyItMatters:
      'Une équation chimique non équilibrée est physiquement impossible. Elle ne peut être utilisée ni pour les calculs de stœchiométrie, ni pour la thermodynamique, ni pour la cinétique.',
    primaryEquation: '\\sum_{\\text{Réactifs}} c_i \\cdot A_{i,j} = \\sum_{\\text{Produits}} c_k \\cdot A_{k,j}',
    equationNote: 'Où c désigne les coefficients et A le nombre d’atomes pour chaque élément j.',
    variables: [
      { symbol: 'Réactifs', name: 'Matières Premières', unit: 'Formules chimiques', desc: 'Substances présentes avant le déroulement de la réaction' },
      { symbol: 'Produits', name: 'Substances Formées', unit: 'Formules chimiques', desc: 'Espèces obtenues après recombinaison des liaisons' },
      { symbol: 'Coefficients', name: 'Entiers Stœchiométriques', unit: 'Sans dimension', desc: 'Multiplicateurs placés devant chaque formule' },
      { symbol: 'Indices', name: 'Nombre d’Atomes Liés', unit: 'Sans dimension', desc: 'Rapports atomiques fixes au sein de la molécule' }
    ],
    workedExample: {
      problemStatement: 'Équilibrez la réaction de combustion du propane : C₃H₈ + O₂ → CO₂ + H₂O.',
      given: [
        'Atomes réactifs : C = 3, H = 8, O = 2',
        'Atomes produits : C = 1, H = 2, O = 3 (1 dans H₂O + 2 dans CO₂)'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Équilibrer les atomes de carbone',
          explanation: 'Il y a 3 carbones à gauche, placez donc le coefficient 3 devant CO₂.',
          math: '\\text{C}_3\\text{H}_8 + \\text{O}_2 \\rightarrow 3\\text{CO}_2 + \\text{H}_2\\text{O}'
        },
        {
          stepNumber: 2,
          title: 'Équilibrer les atomes d’hydrogène',
          explanation: 'Il y a 8 hydrogènes à gauche, placez le coefficient 4 devant H₂O (4 × 2 = 8).',
          math: '\\text{C}_3\\text{H}_8 + \\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}'
        },
        {
          stepNumber: 3,
          title: 'Compter les oxygènes à droite et ajuster O₂',
          explanation: 'Les produits contiennent (3 × 2) + (4 × 1) = 10 oxygènes. Divisez par 2 pour O₂ : coefficient 5.',
          math: '\\text{C}_3\\text{H}_8 + 5\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}'
        }
      ],
      finalResult: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
      verificationNote: 'Gauche : 3 C, 8 H, 10 O | Droite : 3 C, 8 H, 10 O. Équilibrée !'
    },
    knowledgeCheck: {
      question: 'Lors de l’équilibrage de C₃H₈ + O₂ → CO₂ + H₂O, quel est le coefficient entier devant O₂ ?',
      options: ['3', '4', '5', '10'],
      correctIndex: 2,
      explanation: 'L’équilibrage donne C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. Les produits comptent 10 atomes d’oxygène, soit 5 molécules de dioxygène O₂.'
    },
    labApplications: [
      { domain: 'Génie de la Combustion', application: 'Calculer le ratio air-carburant stœchiométrique pour minimiser les suies et le monoxyde de carbone.' },
      { domain: 'Chimie Industrielle', application: 'Programmer les débits automatisés des réacteurs continus.' },
      { domain: 'Bilan Carbone', application: 'Quantifier avec précision les émissions gazeuses de dioxyde de carbone.' }
    ],
    commonTraps: [
      {
        trap: 'Modifier les indices chimiques pour faire correspondre les atomes (ex: transformer H₂O en H₂O₂).',
        howToAvoid: 'Ne changez JAMAIS les indices ! Cela dénature totalement la molécule. Seuls les coefficients peuvent être ajustés.'
      },
      {
        trap: 'Laisser des fractions dans les équations chimiques finales.',
        howToAvoid: 'Multipliez tous les coefficients par le dénominateur pour obtenir des nombres entiers.'
      }
    ],
    proTips: [
      'Ordre d’équilibrage efficace : 1) Métaux d’abord, 2) Ions polyatomiques qui restent intacts, 3) Non-métaux, 4) Hydrogène, 5) Oxygène élémentaire en dernier.',
      'Chemify utilise l’élimination matricielle de Gauss pour résoudre instantanément les réactions complexes.'
    ],
    recommendedPractice: 'Équilibrez la réaction d’oxydoréduction : KMnO₄ + HCl → KCl + MnCl₂ + H₂O + Cl₂.'
  },

  'ph-calculator': {
    id: 'ph-calculator',
    title: 'pH, pOH & Concentrations Ioniques',
    tagline: 'Comprendre l’échelle logarithmique d’acidité, de l’acide de batterie à l’eau de Javel.',
    category: 'Solutions',
    badge: 'Basic',
    estimatedTime: '3 min de lecture',
    calculatorPresetValue: { mode: 'H', val: 0.005 },
    calculatorPresetLabel: 'Charger [H⁺] = 0,005 M dans le calculateur de pH',
    mentalModelAnalogy: {
      title: 'L’Échelle de Richter de la Chimie',
      analogy: 'Tout comme sur l’échelle de Richter où un séisme de magnitude 7 est 10 fois plus intense qu’un séisme de magnitude 6, le pH est une échelle logarithmique en base 10. Une solution à pH 3 n’est PAS "un tout petit peu plus acide" qu’à pH 4 : elle contient 10 fois plus d’ions hydrogène corrosifs ! Passer de pH 6 à pH 3 représente une multiplication par 1 000 de l’acidité.'
    },
    plainEnglish:
      'Le pH mesure l’acidité ou la basicité d’une solution aqueuse selon la concentration en ions hydrogène [H⁺]. Comme [H⁺] peut varier de 1 mol/L (acide de batterie) jusqu’à 0,00000000000001 mol/L (déboucheur), le chimiste Sørensen a imaginé l’échelle logarithmique négative de pH (0 à 14) pour rendre ces grandeurs maniables.',
    whyItMatters:
      'Le pH sanguin humain doit demeurer dans une fourchette extrêmement étroite de 7,35 à 7,45 ; un écart de 0,4 unité est mortel. Le pH conditionne le fonctionnement enzymatique, la santé des océans et l’assimilation des médicaments.',
    primaryEquation: '\\text{pH} = -\\log_{10}[\\text{H}^+], \\quad \\text{pOH} = -\\log_{10}[\\text{OH}^-], \\quad \\text{pH} + \\text{pOH} = 14,00 \\text{ (à 25°C)}',
    equationNote: 'Issu de l’autoprotolyse de l’eau Kw = [H⁺][OH⁻] = 1,0 × 10⁻¹⁴ à 298,15 K.',
    variables: [
      { symbol: 'pH', name: 'Potentiel Hydrogène', unit: 'Sans dimension (0–14)', desc: 'Indicateur d’acidité (<7 : acide, =7 : neutre, >7 : basique)' },
      { symbol: '[H⁺] / [H₃O⁺]', name: 'Concentration en Ions Hydronium', unit: 'M (mol/L)', desc: 'Ions hydrogène actifs en solution' },
      { symbol: 'pOH', name: 'Potentiel Hydroxyde', unit: 'Sans dimension (0–14)', desc: 'Mesure complémentaire d’alcalinité' },
      { symbol: '[OH⁻]', name: 'Concentration en Ions Hydroxyde', unit: 'M (mol/L)', desc: 'Ions hydroxyde actifs en solution' }
    ],
    workedExample: {
      problemStatement: 'Un échantillon de jus d’orange présente une concentration [H⁺] = 3,16 × 10⁻⁴ M. Déterminez son pH, son pOH et sa concentration [OH⁻].',
      given: ['[H⁺] = 3,16 × 10⁻⁴ M', 'Température = 25 °C (Kw = 1,0 × 10⁻¹⁴)'],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculer le pH',
          explanation: 'Appliquez le logarithme décimal négatif à [H⁺].',
          math: '\\text{pH} = -\\log_{10}(3,16 \\times 10^{-4}) = -(-3,50) = 3,50'
        },
        {
          stepNumber: 2,
          title: 'Calculer le pOH',
          explanation: 'Soustrayez le pH de 14,00.',
          math: '\\text{pOH} = 14,00 - 3,50 = 10,50'
        },
        {
          stepNumber: 3,
          title: 'Calculer la concentration en ions hydroxyde [OH⁻]',
          explanation: 'Élevez 10 à la puissance -pOH.',
          math: '[\\text{OH}^-] = 10^{-\\text{pOH}} = 10^{-10,50} = 3,16 \\times 10^{-11}\\text{ M}'
        }
      ],
      finalResult: 'pH = 3,50 (Acide) | pOH = 10,50 | [OH⁻] = 3,16 × 10⁻¹¹ M',
      verificationNote: 'Vérification : [H⁺] × [OH⁻] = (3,16 × 10⁻⁴) × (3,16 × 10⁻¹¹) = 1,0 × 10⁻¹⁴. Parfait !'
    },
    knowledgeCheck: {
      question: 'Si la solution A a un pH de 3 et la solution B un pH de 5, comment se comparent leurs concentrations en [H⁺] ?',
      options: ['A est 2 fois plus concentrée', 'A est 20 fois plus concentrée', 'A est 100 fois plus concentrée', 'A est 10 fois moins concentrée'],
      correctIndex: 2,
      explanation: 'L’échelle de pH étant logarithmique décimale, une différence de 2 unités de pH correspond à un facteur de 10² = 100 en concentration d’ions [H⁺].'
    },
    labApplications: [
      { domain: 'Biomédical & Pharmacie', application: 'Formuler des solutés injectables tamponnés compatibles avec le pH physiologique.' },
      { domain: 'Traitement des Eaux', application: 'Ajuster le pH de l’eau potable pour neutraliser l’agressivité corrosive des tuyauteries.' },
      { domain: 'Agronomie', application: 'Contrôler le pH des sols pour assurer la biodisponibilité des sels minéraux aux racines.' }
    ],
    commonTraps: [
      {
        trap: 'Penser qu’une diminution de pH de 6 à 3 rend le liquide "deux fois plus acide".',
        howToAvoid: 'C’est une échelle logarithmique : un écart de 3 unités correspond à une acidité 1 000 fois plus intense (10³) !'
      },
      {
        trap: 'Chiffres significatifs dans le pH : croire que 3,50 possède 3 chiffres significatifs.',
        howToAvoid: 'Dans un logarithme, seuls les chiffres situés APRÈS la virgule sont significatifs (3,50 possède 2 chiffres significatifs).'
      }
    ],
    proTips: [
      'Astuce mentale : Si [H⁺] = 1 × 10⁻⁵ M, le pH vaut exactement 5,0. Si [H⁺] = 2 × 10⁻⁵ M, le pH avoisine 4,7.',
      'Les acides forts (HCl, HNO₃) se dissocient à 100% : [H⁺] est alors directement égal à la molarité initiale de l’acide.'
    ],
    recommendedPractice: 'Calculez le pH d’une solution d’hydroxyde de baryum Ba(OH)₂ à 0,050 M (attention : 2 OH⁻ par mole de soluté).'
  },

  'molarity-dilution': {
    id: 'molarity-dilution',
    title: 'Molarité & Dilution de Solutions',
    tagline: 'Préparer des solutions titrées de précision et calculer les dilutions volumétriques.',
    category: 'Solutions',
    badge: 'Basic',
    estimatedTime: '3 min de lecture',
    calculatorPresetValue: { tab: 'dilution', m1: 6.0, v1: 50, m2: 0.5, v2: 600, solveFor: 'V2' },
    calculatorPresetLabel: 'Charger une dilution acide (6,0 M → 0,5 M)',
    mentalModelAnalogy: {
      title: 'L’Analogie du Sirop de Grenadine',
      analogy: 'Imaginez un verre de grenadine avec 4 cuillères de sirop. Si vous ajoutez de l’eau fraîche, le verre est plus plein et le goût est moins sucré, mais la quantité totale de sirop a-t-elle varié ? Non ! Il y a toujours exactement 4 cuillères de sucre. C’est la loi de dilution M₁V₁ = M₂V₂ : les moles avant dilution égalent les moles après dilution.'
    },
    plainEnglish:
      'La molarité (M) exprime la concentration d’une solution en nombre de moles de soluté dissous par litre de solution. Lorsqu’on rajoute du solvant pour diluer une solution mère, le volume total augmente tandis que la quantité de matière dissoute reste constante — d’où la relation fondamentale C₁V₁ = C₂V₂ (ou M₁V₁ = M₂V₂).',
    whyItMatters:
      'La quasi-totalité des réactions au laboratoire se déroule en milieu liquide. Les réactifs commerciaux sont livrés sous forme concentrée (ex: HCl 12 M ou H₂SO₄ 18 M) et doivent être dilués avec précaution.',
    primaryEquation: 'M = \\frac{n}{V} = \\frac{m}{MW \\times V}, \\qquad M_1 V_1 = M_2 V_2',
    equationNote: 'Où M est la molarité (mol/L), V le volume (L), m la masse pesée (g) et MW la masse molaire (g/mol).',
    variables: [
      { symbol: 'M₁ / C₁', name: 'Molarité Initiale', unit: 'M (mol/L)', desc: 'Concentration de la solution mère concentrée' },
      { symbol: 'V₁', name: 'Volume Initial', unit: 'mL ou L', desc: 'Volume de solution mère à prélever à la pipette' },
      { symbol: 'M₂ / C₂', name: 'Molarité Cible', unit: 'M (mol/L)', desc: 'Concentration de travail diluée souhaitée' },
      { symbol: 'V₂', name: 'Volume Final', unit: 'mL ou L', desc: 'Volume total de la fiole jaugée' }
    ],
    workedExample: {
      problemStatement: 'Vous disposez d’une solution mère de NaOH à 6,0 M. Vous devez préparer 500 mL d’une solution de travail à 0,25 M. Quel volume prélever et quelle quantité d’eau ajouter ?',
      given: ['M₁ = 6,0 M', 'M₂ = 0,25 M', 'V₂ = 500 mL'],
      steps: [
        {
          stepNumber: 1,
          title: 'Isoler le volume V₁ dans la formule de dilution',
          explanation: 'Réarrangez M₁V₁ = M₂V₂ pour obtenir V₁.',
          math: 'V_1 = \\frac{M_2 \\times V_2}{M_1}'
        },
        {
          stepNumber: 2,
          title: 'Calculer le volume de solution mère à pipeter',
          explanation: 'Insérez les valeurs numériques (unités conservées en mL).',
          math: 'V_1 = \\frac{0,25\\text{ M} \\times 500\\text{ mL}}{6,0\\text{ M}} = 20,83\\text{ mL}'
        },
        {
          stepNumber: 3,
          title: 'Calculer le volume d’eau à ajouter',
          explanation: 'Soustrayez le volume de solution mère du volume final souhaité.',
          math: 'V_{\\text{eau}} = 500\\text{ mL} - 20,83\\text{ mL} = 479,17\\text{ mL}'
        }
      ],
      finalResult: 'Pipeter 20,8 mL de solution mère à 6,0 M, puis ajuster au trait de jauge à 500,0 mL dans une fiole.',
      verificationNote: 'Vérification : 0,02083 L × 6,0 M = 0,125 mol ; 0,500 L × 0,25 M = 0,125 mol. Égalité parfaite !'
    },
    knowledgeCheck: {
      question: 'Combien d’eau pure faut-il ajouter à 100 mL d’une solution de NaCl à 2,0 M pour la diluer à 1,0 M ?',
      options: ['50 mL', '100 mL', '200 mL', '500 mL'],
      correctIndex: 1,
      explanation: 'Par M₁V₁ = M₂V₂ : (2,0 M)(100 mL) = (1,0 M)(V₂), soit un volume total V₂ = 200 mL. Comme vous aviez déjà 100 mL, vous devez ajouter 200 - 100 = 100 mL d’eau.'
    },
    labApplications: [
      { domain: 'Spectrophotométrie', application: 'Préparer des gammes étalon pour les dosages d’absorbance par la loi de Beer-Lambert.' },
      { domain: 'Chromatographie HPLC', application: 'Préparer les phases mobiles avec une force ionique rigoureuse.' },
      { domain: 'Médecine Clinique', application: 'Formuler du sérum physiologique stérile isotonique (NaCl 0,154 M).' }
    ],
    commonTraps: [
      {
        trap: 'Verser l’eau dans l’acide concentré (« On ne donne jamais à boire à un acide »).',
        howToAvoid: 'Versez TOUJOURS l’acide lentement dans l’eau pour dissiper la chaleur et éviter les projections bouillantes.'
      },
      {
        trap: 'Confondre le volume de solvant ajouté avec le volume final de la solution.',
        howToAvoid: 'Les solutés occupent un volume propre. Dissolvez d’abord dans un volume partiel puis ajustez au trait de jauge.'
      }
    ],
    proTips: [
      'Dans M₁V₁ = M₂V₂, les volumes n’ont pas besoin d’être en litres à condition que V₁ et V₂ utilisent la même unité.',
      'Pour préparer une solution à partir d’un solide : Masse (g) = Molarité souhaitée × Volume en litres × Masse molaire.'
    ],
    recommendedPractice: 'Calculez la masse de NaCl anhydre (M = 58,44 g/mol) pour préparer 250 mL de sérum physiologique à 0,154 M.'
  },

  'percent-composition': {
    id: 'percent-composition',
    title: 'Composition Centésimale Massique',
    tagline: 'Décomposer les composés chimiques en pourcentages massiques élémentaires.',
    category: 'Calculs',
    badge: 'Basic',
    estimatedTime: '3 min de lecture',
    calculatorPresetValue: { formula: 'C6H12O6' },
    calculatorPresetLabel: 'Charger le glucose (C₆H₁₂O₆) dans le calculateur de composition',
    mentalModelAnalogy: {
      title: 'Le Modèle du Mélange Apéritif',
      analogy: 'Imaginez un sachet de 100 grammes contenant 50g de cacahuètes, 30g de raisins et 20g de chocolat. Les cacahuètes constituent 50% de la masse totale. Dans les molécules, la composition centésimale indique quelle fraction de la masse molaire provient du carbone, de l’hydrogène ou de l’oxygène.'
    },
    plainEnglish:
      'La composition en pourcentage massique indique la part de chaque élément dans la masse totale d’une molécule. Si vous disposiez de 100 grammes de composé pur, ce pourcentage correspondrait directement au nombre de grammes de chaque élément chimique.',
    whyItMatters:
      'Les analyseurs élémentaires en laboratoire fournissent des pourcentages bruts. En comparant les pourcentages mesurés aux valeurs théoriques, les chimistes vérifient la réussite de leurs synthèses.',
    primaryEquation: '\\%\\text{ Élément } X = \\frac{N_X \\times A_{r,X}}{M_{\\text{Composé}}} \\times 100\\%',
    equationNote: 'Où Nx est le nombre d’atomes de l’élément X, Ar,x sa masse atomique et M la masse molaire du composé.',
    variables: [
      { symbol: '% X', name: 'Fraction Massique en %', unit: '%', desc: 'Part de la masse totale imputable à l’élément X' },
      { symbol: 'N_x', name: 'Nombre d’Atomes de X', unit: 'Sans dimension', desc: 'Indice stœchiométrique dans la formule brute' },
      { symbol: 'Aᵣ', name: 'Masse Atomique Standard', unit: 'g/mol', desc: 'Masse de l’élément d’après le tableau périodique' },
      { symbol: 'M', name: 'Masse Molaire Totale', unit: 'g/mol', desc: 'Masse totale de la molécule complète' }
    ],
    workedExample: {
      problemStatement: 'Calculez la composition centésimale massique de l’éthanol (C₂H₅OH).',
      given: [
        'Formule condensée : C₂H₆O (2 C, 6 H, 1 O)',
        'Masses atomiques : C = 12,011, H = 1,008, O = 16,00 g/mol'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculer la masse molaire de l’éthanol',
          explanation: 'Additionnez les contributions de chaque élément.',
          math: 'M = (2 \\times 12,011) + (6 \\times 1,008) + 16,00 = 46,07\\text{ g/mol}'
        },
        {
          stepNumber: 2,
          title: 'Calculer le pourcentage de chaque élément',
          explanation: 'Divisez la sous-masse de chaque élément par 46,07 et multipliez par 100.',
          math: '\\%\\text{C} = 52,14\\%, \\quad \\%\\text{H} = 13,13\\%, \\quad \\%\\text{O} = 34,73\\%'
        },
        {
          stepNumber: 3,
          title: 'Vérifier la somme des pourcentages',
          explanation: 'La somme de tous les éléments doit être égale à 100,00%.',
          math: '52,14\\% + 13,13\\% + 34,73\\% = 100,00\\%'
        }
      ],
      finalResult: 'C : 52,14% | H : 13,13% | O : 34,73%',
      verificationNote: 'Vérifiez systématiquement que le total égale 100,0% (±0,1% dû aux arrondis).'
    },
    knowledgeCheck: {
      question: 'Dans l’eau pure (H₂O, masse molaire ~18,02 g/mol), quel est le pourcentage en masse d’Oxygène (~16,00 g/mol) ?',
      options: ['11,2%', '33,3%', '88,8%', '50,0%'],
      correctIndex: 2,
      explanation: 'Le pourcentage massique vaut (16,00 / 18,02) × 100% = 88,79% ~ 88,8%. Même si l’hydrogène compte pour 2 atomes sur 3, l’oxygène représente l’essentiel de la masse.'
    },
    labApplications: [
      { domain: 'Synthèse Organique', application: 'Microanalyse de combustion (CHNO) pour authentifier les molécules pharmaceutiques créées.' },
      { domain: 'Industrie Minière', application: 'Estimer la teneur en métaux précieux des minerais bruts.' },
      { domain: 'Agrochimie', application: 'Certifier les teneurs en azote, phosphore et potassium (N-P-K) des engrais.' }
    ],
    commonTraps: [
      {
        trap: 'Oublier l’hydrogène lié au groupement hydroxyle (C₂H₅OH compte 6 hydrogènes au total).',
        howToAvoid: 'Rassemblez toujours la formule en formule brute condensée (C₂H₆O) avant de débuter.'
      },
      {
        trap: 'Arrondir les pourcentages trop tôt dans le calcul.',
        howToAvoid: 'Gardez au moins 4 chiffres significatifs pendant les opérations intermédiaires.'
      }
    ],
    proTips: [
      'Le pourcentage massique est indépendant de la taille de l’échantillon : une goutte d’eau possède exactement les mêmes 88,8% d’oxygène qu’un océan.',
      'La composition massique est la porte d’entrée directe vers la détermination de la formule brute.'
    ],
    recommendedPractice: 'Calculez le pourcentage en masse d’azote dans le nitrate d’ammonium (NH₄NO₃).'
  },

  'gibbs-free-energy': {
    id: 'gibbs-free-energy',
    title: 'Énergie Libre de Gibbs & Spontanéité',
    tagline: 'Prédire si les réactions chimiques se déroulent spontanément ou exigent un apport énergétique continu.',
    category: 'Thermodynamique',
    badge: 'Advanced',
    estimatedTime: '4 min de lecture',
    calculatorPresetValue: { deltaH: -92.4, deltaS: -198.3, temp: 298.15 },
    calculatorPresetLabel: 'Charger la synthèse de l’ammoniac dans le solveur de Gibbs',
    mentalModelAnalogy: {
      title: 'Le Modèle des Montagnes Russes et du Désordre',
      analogy: 'L’enthalpie (ΔH) est comme la gravité : les systèmes préfèrent naturellement rouler vers le bas et libérer de la chaleur (-ΔH). L’entropie (ΔS) est la tendance naturelle au désordre et au chaos (+ΔS). La température (T) amplifie ce désordre. L’énergie libre de Gibbs (ΔG = ΔH - TΔS) est l’arbitre : si le bilan est négatif, la réaction démarre d’elle-même !'
    },
    plainEnglish:
      'L’énergie libre de Gibbs (ΔG) est le critère absolu de la spontanéité thermodynamique. Elle arbitre deux tendances naturelles : l’enthalpie (la recherche du niveau d’énergie le plus bas) et l’entropie (la recherche du désordre maximal), pondérées par la température absolue en Kelvin (T). Si ΔG est négatif, la réaction est spontanée !',
    whyItMatters:
      'La thermodynamique indique ce qui est chimiquement possible. Elle fait économiser des millions d’euros à la recherche en éliminant les synthèses impossibles avant les essais au laboratoire.',
    primaryEquation: '\\Delta G = \\Delta H - T\\Delta S',
    equationNote: 'Spontané quand ΔG < 0 ; Non spontané quand ΔG > 0 ; Équilibre dynamique quand ΔG = 0.',
    variables: [
      { symbol: 'ΔG', name: 'Variation d’Énergie Libre', unit: 'kJ/mol', desc: 'Potentiel thermodynamique disponible' },
      { symbol: 'ΔH', name: 'Variation d’Enthalpie', unit: 'kJ/mol', desc: 'Chaleur absorbée (> 0 endothermique) ou libérée (< 0 exothermique)' },
      { symbol: 'T', name: 'Température Absolue', unit: 'K (Kelvin)', desc: 'Température au-dessus du zéro absolu (K = °C + 273,15)' },
      { symbol: 'ΔS', name: 'Variation d’Entropie', unit: 'J/(mol·K)', desc: 'Évolution du désordre moléculaire' }
    ],
    workedExample: {
      problemStatement: 'Pour la réaction N₂ + 3H₂ → 2NH₃, ΔH = -92,4 kJ/mol et ΔS = -198,4 J/(mol·K). La réaction est-elle spontanée à 298 K (25 °C) ? À quelle température s’arrête-t-elle ?',
      given: [
        'ΔH = -92,4 kJ/mol (Exothermique)',
        'ΔS = -198,4 J/(mol·K) = -0,1984 kJ/(mol·K)',
        'T = 298,15 K'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Harmoniser les unités entre ΔH et ΔS',
          explanation: 'ΔH est en kJ tandis que ΔS est en Joules. Divisez ΔS par 1 000.',
          math: '\\Delta S = \\frac{-198,4}{1000} = -0,1984\\text{ kJ/(mol}\\cdot\\text{K)}'
        },
        {
          stepNumber: 2,
          title: 'Calculer ΔG à 298,15 K',
          explanation: 'Appliquez la relation ΔG = ΔH - TΔS.',
          math: '\\Delta G = -92,4 - (298,15 \\times -0,1984) = -33,25\\text{ kJ/mol}'
        },
        {
          stepNumber: 3,
          title: 'Calculer la température d’inversion (ΔG = 0)',
          explanation: 'À l’équilibre, Teq = ΔH / ΔS.',
          math: 'T_{\\text{eq}} = \\frac{-92,4}{-0,1984} = 465,7\\text{ K} \\approx 192,6\\text{ }^\\circ\\text{C}'
        }
      ],
      finalResult: 'ΔG = -33,25 kJ/mol (Spontané à 25 °C) | T d’inversion = 465,7 K (192,6 °C)',
      verificationNote: 'Au-delà de 465,7 K, le terme -TΔS devient trop positif et la réaction cesse d’être spontanée.'
    },
    knowledgeCheck: {
      question: 'Sous quelle condition thermodynamique une réaction est-elle TOUJOURS spontanée (ΔG < 0) à toute température ?',
      options: ['ΔH > 0 et ΔS < 0', 'ΔH < 0 (exothermique) et ΔS > 0 (l’entropie augmente)', 'ΔH < 0 et ΔS < 0', 'ΔH > 0 et ΔS > 0'],
      correctIndex: 1,
      explanation: 'Dans l’équation ΔG = ΔH - TΔS, avec ΔH négatif et ΔS positif, les deux termes contribuent négativement quelle que soit la température en Kelvin.'
    },
    labApplications: [
      { domain: 'Génie des Réacteurs', application: 'Définir la fenêtre thermique idéale pour favoriser la formation du produit sans décomposition.' },
      { domain: 'Biochimie Cellulaire', application: 'Coupler les synthèses endergoniques avec l’hydrolyse exergonique de l’ATP (ΔG° = -30,5 kJ/mol).' },
      { domain: 'Électrochimie', application: 'Prédire la tension théorique des batteries au lithium par ΔG° = -nFE°.' }
    ],
    commonTraps: [
      {
        trap: 'Oublier de convertir ΔS de J/(mol·K) en kJ/(mol·K).',
        howToAvoid: 'Divisez systématiquement ΔS par 1 000 avant de le soustraire à ΔH !'
      },
      {
        trap: 'Utiliser des degrés Celsius au lieu de Kelvin.',
        howToAvoid: 'La thermodynamique impose strictement l’échelle absolue de Kelvin (K = °C + 273,15).'
      }
    ],
    proTips: [
      'Les 4 cas : (-ΔH, +ΔS) = Toujours spontané ; (+ΔH, -ΔS) = Jamais spontané ; (-ΔH, -ΔS) = Spontané à basse T ; (+ΔH, +ΔS) = Spontané à haute T.',
      'Spontané ne veut pas dire rapide ! La transformation du diamant en graphite a un ΔG < 0, mais requiert des milliards d’années en raison d’une haute énergie d’activation.'
    ],
    recommendedPractice: 'Calculez ΔG pour la décomposition du calcaire CaCO₃(s) → CaO(s) + CO₂(g) à 298 K et 1 100 K.'
  },

  'ideal-gas-law': {
    id: 'ideal-gas-law',
    title: 'Loi des Gaz Parfaits & Variables d’État',
    tagline: 'Relier la pression, le volume, la température et la quantité de matière dans la phase gazeuse.',
    category: 'Lois des Gaz',
    badge: 'Intermediate',
    estimatedTime: '4 min de lecture',
    calculatorPresetValue: { solveFor: 'P', n: 2.5, v: 10.0, t: 298.15 },
    calculatorPresetLabel: 'Charger 2,5 mol de gaz dans 10 L à 298,15 K',
    mentalModelAnalogy: {
      title: 'Le Modèle des Balles de Ping-Pong',
      analogy: 'Imaginez une pièce fermée remplie de balles de ping-pong rebondissantes. La pression correspond à la violence et à la fréquence des chocs contre les murs. Si vous chauffez la pièce (hausse de Température), les balles volent plus vite. Si vous réduisez la pièce (baisse de Volume), elles percutent les parois plus souvent. PV = nRT est la loi reliant vitesse, chocs et espace.'
    },
    plainEnglish:
      'La loi des gaz parfaits (PV = nRT) unit les quatre propriétés physiques d’un gaz en une équation élégante. Elle synthétise la loi de Boyle (la pression augmente si le volume diminue), la loi de Charles (le gaz se dilate sous l’effet de la chaleur) et la loi d’Avogadro (plus de matière occupe plus de place).',
    whyItMatters:
      'De la poussée des ballons météorologiques dans la stratosphère à la pression des bouteilles de plongée sous-marine et des autoclaves hospitaliers, le comportement des gaz régit les technologies modernes.',
    primaryEquation: 'PV = nRT',
    equationNote: 'R est la constante universelle des gaz parfaits : 0,08206 L·atm/(mol·K) ou 8,314 J/(mol·K) = 8,314 kPa·L/(mol·K).',
    variables: [
      { symbol: 'P', name: 'Pression', unit: 'atm, kPa, bar', desc: 'Force exercée par les collisions gazeuses par unité de surface' },
      { symbol: 'V', name: 'Volume', unit: 'L (litres) ou m³', desc: 'Espace physique occupé par le gaz' },
      { symbol: 'n', name: 'Quantité de Matière', unit: 'mol', desc: 'Nombre de moles de molécules de gaz' },
      { symbol: 'R', name: 'Constante des Gaz Parfaits', unit: '0,08206 L·atm/(mol·K)', desc: 'Constante universelle de proportionnalité' },
      { symbol: 'T', name: 'Température Absolue', unit: 'K (Kelvin)', desc: 'Mesure directe de l’énergie cinétique moyenne des molécules' }
    ],
    workedExample: {
      problemStatement: 'Une bonbonne rigide de 15,0 L contient 48,0 g de gaz dioxygène (O₂) à une température de 27 °C. Quelle est la pression à l’intérieur en atmosphères ?',
      given: [
        'V = 15,0 L',
        'Masse = 48,0 g d’O₂ (Masse molaire = 32,00 g/mol)',
        'T = 27 °C → T = 27 + 273,15 = 300,15 K',
        'R = 0,08206 L·atm/(mol·K)'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Calculer la quantité de matière en O₂',
          explanation: 'Divisez la masse par la masse molaire du dioxygène diatomique (32,00 g/mol).',
          math: 'n = \\frac{48,0\\text{ g}}{32,00\\text{ g/mol}} = 1,50\\text{ mol}'
        },
        {
          stepNumber: 2,
          title: 'Isoler la pression P',
          explanation: 'Divisez les deux membres de PV = nRT par le volume V.',
          math: 'P = \\frac{nRT}{V}'
        },
        {
          stepNumber: 3,
          title: 'Calculer la valeur numérique',
          explanation: 'Insérez les valeurs avec R = 0,08206.',
          math: 'P = \\frac{1,50 \\times 0,08206 \\times 300,15}{15,0} = 2,46\\text{ atm}'
        }
      ],
      finalResult: '2,46 atm (soit 249,5 kPa)',
      verificationNote: 'Vérifiez toujours que la température est en Kelvin. Utiliser 27 conduirait à une erreur de plus de 90% !'
    },
    knowledgeCheck: {
      question: 'Si la température absolue d’un gaz dans une bonbonne rigide scellée passe de 300 K à 600 K, qu’advient-il de la pression ?',
      options: ['La pression est divisée par deux', 'La pression double', 'La pression quadruple', 'La pression reste inchangée'],
      correctIndex: 1,
      explanation: 'Selon la loi de Gay-Lussac, à volume et quantité de matière constants, la pression est directement proportionnelle à la température en Kelvin (P ∝ T). Doubler la température double la pression.'
    },
    labApplications: [
      { domain: 'Sécurité des Gaz Comprimés', application: 'Calculer les marges de rupture des bouteilles haute pression.' },
      { domain: 'Aéronautique & Météo', application: 'Modéliser la poussée d’Archimède des ballons sondes stratosphériques.' },
      { domain: 'Hydrogénation Catalytique', application: 'Déterminer les volumes de gaz réactifs nécessaires dans les autoclaves chimiques.' }
    ],
    commonTraps: [
      {
        trap: 'Insérer la température en degrés Celsius au lieu de Kelvin.',
        howToAvoid: 'Ajoutez TOUJOURS 273,15 à la température en °C avant tout calcul sur les gaz !'
      },
      {
        trap: 'Mélanger les constantes R (utiliser 0,08206 avec des Pascals ou 8,314 avec des atmosphères).',
        howToAvoid: 'Utilisez R = 0,08206 avec des litres et des atmosphères. Utilisez R = 8,314 avec des Pascals et des m³.'
      }
    ],
    proTips: [
      'Dans les conditions normales de température et de pression (CNTP : 0°C, 1 atm), exactement 1 mole de gaz parfait occupe 22,414 litres.',
      'Les gaz réels s’écartent du comportement idéal uniquement sous très haute pression ou à très basse température.'
    ],
    recommendedPractice: 'Calculez le volume occupé par 2,0 moles de gaz néon à 2,0 atm et 350 K.'
  },

  'empirical-formula': {
    id: 'empirical-formula',
    title: 'Détermination des Formules Brutes & Empiriques',
    tagline: 'Retrouver les rapports atomiques entiers les plus simples à partir des analyses élémentaires.',
    category: 'Analyse',
    badge: 'Intermediate',
    estimatedTime: '4 min de lecture',
    calculatorPresetValue: { elements: [{ symbol: 'C', amount: 40.0 }, { symbol: 'H', amount: 6.7 }, { symbol: 'O', amount: 53.3 }] },
    calculatorPresetLabel: 'Charger 40% C, 6,7% H, 53,3% O dans le chercheur de formule',
    mentalModelAnalogy: {
      title: 'Le Plan d’Architecte vs L’Immeuble Construit',
      analogy: 'Une formule empirique est comme un ratio d’architecte : "2 briques pour chaque fenêtre" (CH₂O). La formule moléculaire représente le gratte-ciel réel : il a 6 fenêtres et 12 briques (C₆H₁₂O₆). Les deux décrivent la même composition, mais la formule moléculaire indique la taille réelle.'
    },
    plainEnglish:
      'Lorsque les chimistes découvrent un nouvel extrait végétal ou synthétisent une molécule, l’analyse centésimale révèle les pourcentages de Carbone, d’Hydrogène, d’Oxygène, etc. La formule brute empirique est le rapport entier le plus simple entre ces atomes.',
    whyItMatters:
      'C’est la première étape indispensable en chimie des substances naturelles, en identification médico-légale et en contrôle qualité pharmaceutique.',
    primaryEquation: '\\text{Rapport Molaire} = \\frac{m_i}{A_{r,i}}, \\quad n = \\frac{M_{\\text{moléculaire}}}{M_{\\text{empirique}}}',
    equationNote: 'Où n est le multiplicateur entier permettant de passer de la formule empirique à la formule moléculaire réelle.',
    variables: [
      { symbol: '% ou m', name: 'Pourcentage ou Masse', unit: '% ou g', desc: 'Résultat analytique expérimental de la combustion' },
      { symbol: 'n_i', name: 'Nombre de Moles de l’Élément', unit: 'mol', desc: 'n_i = masse / masse atomique' },
      { symbol: 'Ratio', name: 'Rapport d’Indices', unit: 'Entier', desc: 'Division par le plus petit nombre de moles' },
      { symbol: 'M_mol', name: 'Masse Molaire Moléculaire', unit: 'g/mol', desc: 'Mesurée par spectrométrie de masse' }
    ],
    workedExample: {
      problemStatement: 'L’analyse élémentaire d’un glucide donne 40,0% de C, 6,7% de H et 53,3% d’O en masse. Sa masse molaire mesurée est de 180,16 g/mol. Trouvez ses formules empirique et moléculaire.',
      given: [
        'C = 40,0%, H = 6,7%, O = 53,3%',
        'Masses atomiques : C = 12,011, H = 1,008, O = 16,00 g/mol',
        'Masse molaire réelle = 180,16 g/mol'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Considérer un échantillon de 100 g',
          explanation: 'Pour 100 g d’échantillon, chaque pourcentage devient directement une masse en grammes.',
          math: 'm(\\text{C}) = 40,0\\text{ g}, \\; m(\\text{H}) = 6,7\\text{ g}, \\; m(\\text{O}) = 53,3\\text{ g}'
        },
        {
          stepNumber: 2,
          title: 'Convertir les grammes en moles',
          explanation: 'Divisez par la masse atomique de chaque élément.',
          math: 'n(\\text{C}) = 3,33\\text{ mol}, \\quad n(\\text{H}) = 6,65\\text{ mol}, \\quad n(\\text{O}) = 3,33\\text{ mol}'
        },
        {
          stepNumber: 3,
          title: 'Diviser par le plus petit nombre de moles (3,33)',
          explanation: 'Obtenez les rapports entiers les plus simples.',
          math: '\\text{C} = 1,00, \\quad \\text{H} = 2,00, \\quad \\text{O} = 1,00 \\implies \\text{CH}_2\\text{O}'
        },
        {
          stepNumber: 4,
          title: 'Déterminer le multiplicateur moléculaire n',
          explanation: 'Masse empirique de CH₂O = 30,03 g/mol. Divisez la masse réelle par 30,03.',
          math: 'n = \\frac{180,16}{30,03} = 6,00 \\implies (\\text{CH}_2\\text{O})_6 = \\text{C}_6\\text{H}_{12}\\text{O}_6'
        }
      ],
      finalResult: 'Formule empirique : CH₂O | Formule moléculaire : C₆H₁₂O₆ (Glucose)',
      verificationNote: 'C₆H₁₂O₆ présente bien une masse molaire de 180,16 g/mol conforme aux données.'
    },
    knowledgeCheck: {
      question: 'Un composé a pour formule empirique CH₂O (masse 30,03 g/mol) et une masse molaire de 180,16 g/mol. Quelle est sa formule moléculaire ?',
      options: ['CH₂O', 'C₂H₄O₂', 'C₆H₁₂O₆', 'C₁₂H₂₂O₁₁'],
      correctIndex: 2,
      explanation: 'En divisant la masse molaire par la masse empirique : 180,16 / 30,03 = 6. Multiplier les indices par 6 donne C₆H₁₂O₆ (glucose).'
    },
    labApplications: [
      { domain: 'Substances Naturelles', application: 'Identifier de nouveaux principes actifs végétaux issus de la biodiversité.' },
      { domain: 'Police Scientifique', application: 'Caractériser des poudres inconnues à partir des bilans de microcombustion.' },
      { domain: 'Polymères', application: 'Calculer la stœchiométrie des motifs répétitifs de polymérisation.' }
    ],
    commonTraps: [
      {
        trap: 'Arrondir hâtivement des fractions de rapports (ex: arrondir 1,33 à 1 ou 1,5 à 2).',
        howToAvoid: 'Si le ratio finit par ,5 multipliez tout par 2. Si c’est ,33 ou ,67 multipliez tout par 3 !'
      },
      {
        trap: 'Diviser directement les pourcentages par la masse de la molécule au lieu de la masse atomique de l’élément.',
        howToAvoid: 'Convertissez toujours chaque élément en quantité de matière individuelle d’abord.'
      }
    ],
    proTips: [
      'Le moyen mnémotechnique : Pourcentage en Masse, Masse en Moles, Diviser par le plus Petit, Multiplier jusqu’à l’Entier.',
      'La formule empirique et la formule moléculaire peuvent être identiques (ex: H₂O, CO₂, NH₃) quand n = 1.'
    ],
    recommendedPractice: 'Trouvez la formule empirique d’un composé contenant 52,9% d’aluminium et 47,1% d’oxygène.'
  },

  'oxidation-state': {
    id: 'oxidation-state',
    title: 'Degrés d’Oxydation & Bilan Électronique',
    tagline: 'Suivre les transferts d’électrons dans les réactions d’oxydoréduction et les complexes.',
    category: 'Équations',
    badge: 'Intermediate',
    estimatedTime: '3 min de lecture',
    calculatorPresetValue: { formula: 'KMnO4' },
    calculatorPresetLabel: 'Charger le permanganate (KMnO₄) dans le calculateur de degrés d’oxydation',
    mentalModelAnalogy: {
      title: 'Le Modèle du Compte Bancaire Électronique',
      analogy: 'Imaginez les degrés d’oxydation comme un registre comptable pour les électrons. Quand un atome "dépense" ou cède des électrons négatifs, son solde devient plus positif (+1, +2, +3) — c’est l’Oxydation. Quand un atome "reçoit" des électrons négatifs, son solde diminue (-1, -2) — c’est la Réduction.'
    },
    plainEnglish:
      'Le nombre ou degré d’oxydation est la charge électrique fictive qu’aurait un atome si toutes ses liaisons avec les atomes voisins étaient considérées comme 100% ioniques. Il permet de suivre immédiatement si un élément s’oxyde (perte d’électrons, le degré augmente) ou se réduit (gain d’électrons, le degré diminue).',
    whyItMatters:
      'Les réactions redox gouvernent la vie (respiration cellulaire et photosynthèse) et l’industrie (batteries au lithium, piles à combustible, galvanoplastie et protection contre la corrosion).',
    primaryEquation: '\\sum (\\text{Degrés d\'Oxydation}) = \\text{Charge Nette Totale}',
    equationNote: 'Pour une molécule neutre, la somme est 0 ; pour un ion polyatomique, elle est égale à la charge nette.',
    variables: [
      { symbol: 'n.o. / d.o.', name: 'Degré d’Oxydation', unit: 'Entier (-4 à +8)', desc: 'Charge formelle de comptabilité électronique' },
      { symbol: 'Oxydation', name: 'Perte d’électrons', unit: 'Processus', desc: 'Augmentation algébrique du degré d’oxydation' },
      { symbol: 'Réduction', name: 'Gain d’électrons', unit: 'Processus', desc: 'Diminution algébrique du degré d’oxydation' },
      { symbol: 'q_net', name: 'Charge Nette', unit: 'e (charge élémentaire)', desc: 'Charge totale de l’espèce (ex: -2 pour SO₄²⁻)' }
    ],
    workedExample: {
      problemStatement: 'Trouvez le degré d’oxydation du manganèse (Mn) dans l’ion permanganate : MnO₄⁻.',
      given: [
        'L’espèce est un ion polyatomique de charge globale = -1',
        'Règle standard : L’oxygène a un degré d’oxydation de -2',
        'L’ion contient 1 Mn et 4 atomes O'
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Poser l’équation de neutralité de charge',
          explanation: 'La somme des degrés d’oxydation doit être égale à la charge de l’ion (-1).',
          math: '1 \\times \\text{d.o.}(\\text{Mn}) + 4 \\times \\text{d.o.}(\\text{O}) = -1'
        },
        {
          stepNumber: 2,
          title: 'Remplacer l’oxygène par sa valeur (-2)',
          explanation: 'Chaque oxygène compte pour -2.',
          math: '\\text{d.o.}(\\text{Mn}) + 4(-2) = -1 \\implies \\text{d.o.}(\\text{Mn}) - 8 = -1'
        },
        {
          stepNumber: 3,
          title: 'Résoudre pour le Manganèse (Mn)',
          explanation: 'Ajoutez 8 des deux côtés.',
          math: '\\text{d.o.}(\\text{Mn}) = -1 + 8 = +7'
        }
      ],
      finalResult: 'Le manganèse dans MnO₄⁻ est au degré d’oxydation +7 (MnVII)',
      verificationNote: 'Vérification : (+7) + 4(-2) = +7 - 8 = -1. Correspond exactement à la charge de l’ion !'
    },
    knowledgeCheck: {
      question: 'Quel est le degré d’oxydation du Manganèse (Mn) dans le permanganate de potassium (KMnO₄) ?',
      options: ['+2', '+4', '+6', '+7'],
      correctIndex: 3,
      explanation: 'K est un métal alcalin (+1), chaque O vaut -2 (soit -8 pour 4 oxygènes). Pour la molécule neutre : +1 + Mn + (-8) = 0, donc Mn = +7.'
    },
    labApplications: [
      { domain: 'Technologie des Batteries', application: 'Concevoir les matériaux de cathode lithium-ion reposant sur les couples redox (ex: Co³⁺ / Co⁴⁺).' },
      { domain: 'Protection Anticorrosion', application: 'Installer des anodes sacrificielles de zinc sur les coques de navires pour protéger le fer de l’oxydation.' },
      { domain: 'Galvanoplastie', application: 'Calculer la quantité d’électricité pour déposer de fines couches d’or ou de chrome protecteur.' }
    ],
    commonTraps: [
      {
        trap: 'Penser qu’un élément a toujours le même degré d’oxydation dans tous ses composés.',
        howToAvoid: 'Les métaux de transition (Fe, Mn, Cr, Cu) possèdent plusieurs degrés courants (ex: Fe²⁺ et Fe³⁺ ; Mn peut valoir +2, +4, +7).'
      },
      {
        trap: 'Confondre la notation de charge (2+) avec le degré d’oxydation (+2).',
        howToAvoid: 'Par convention IUPAC : la charge formelle place le signe après (2+), tandis que le degré d’oxydation place le signe devant (+2).'
      }
    ],
    proTips: [
      'Règles d’or absolues : 1) Les corps simples purs = 0 (Fe, O₂, H₂). 2) Le fluor vaut TOUJOURS -1. 3) Les métaux alcalins du groupe 1 valent TOUJOURS +1, le groupe 2 vaut +2. 4) L’hydrogène vaut +1 (sauf dans les hydrures métalliques comme NaH où il vaut -1). 5) L’oxygène vaut -2 (sauf peroxydes -1 et OF₂).',
      'Le degré d’oxydation le plus élevé connu en chimie stable est +8 (dans OsO₄ et IrO₄⁺).'
    ],
    recommendedPractice: 'Déterminez le degré d’oxydation du chrome dans l’ion dichromate Cr₂O₇²⁻.'
  }
};

