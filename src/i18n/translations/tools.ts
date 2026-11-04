import { Language } from '../types';

export interface LocalizedToolInfo {
  title: string;
  subtitle: string;
  desc: string;
}

export const TOOLS_TRANSLATIONS: Record<Language, Record<string, LocalizedToolInfo>> = {
  en: {
    'molar-mass': {
      title: 'Molar Mass Calculator',
      subtitle: 'Find molar and formula mass of any chemical formula',
      desc: 'Compute molecular weight with instant formula parsing, elemental mass breakdown, and mass percentages.'
    },
    'stoichiometry': {
      title: 'Stoichiometry Calculator',
      subtitle: 'Calculate stoichiometric mole-mass relationships easily',
      desc: 'Determine mole ratios, mass-to-mole conversions, limiting reagent identification, and theoretical product yields.'
    },
    'equation-balancer': {
      title: 'Chemical Equation Balancer',
      subtitle: 'Balance complex reactions using linear algebraic methods',
      desc: 'Enter unbalanced chemical equations and instantly compute integer stoichiometric coefficients with step-by-step verification.'
    },
    'ph-calculator': {
      title: 'pH & pOH Calculator',
      subtitle: 'Determine pH, pOH, and ion concentrations',
      desc: 'Interactive acid-base analysis tool connecting [H⁺], [OH⁻], pH, and pOH with full color gradient scale and everyday benchmarks.'
    },
    'molarity-dilution': {
      title: 'Molarity & Dilution Suite',
      subtitle: 'Accurately calculate solution concentrations and serial dilutions',
      desc: 'Dual-purpose calculator to prepare molar solutions from solute mass or perform serial dilutions using M₁V₁ = M₂V₂.'
    },
    'percent-composition': {
      title: 'Percent Composition Calculator',
      subtitle: 'Find the percentage by mass of each constituent element',
      desc: 'Deconstruct any chemical compound into individual elemental masses and their corresponding percentages of the total mass.'
    },
    'gibbs-free-energy': {
      title: 'Gibbs Free Energy (ΔG)',
      subtitle: 'Evaluate reaction spontaneity from enthalpy and entropy',
      desc: 'Calculate ΔG = ΔH - TΔS, determine thermodynamic spontaneity, and discover critical equilibrium inversion temperatures.'
    },
    'ideal-gas-law': {
      title: 'Ideal Gas Law (PV = nRT)',
      subtitle: 'Solve for pressure, volume, moles, or temperature with unit conversions',
      desc: 'Compute P, V, n, or T for ideal gas systems with dynamic conversions across atm, kPa, bar, L, mL, and Kelvin.'
    },
    'empirical-formula': {
      title: 'Empirical & Molecular Formula',
      subtitle: 'Derive simplest integer ratios from mass percentages',
      desc: 'Input elemental mass composition in grams or percentages to determine the simplest empirical formula with mole ratio steps.'
    },
    'oxidation-state': {
      title: 'Oxidation State Calculator',
      subtitle: 'Determine oxidation numbers for each element in compounds',
      desc: 'Analyze charge distribution and assign IUPAC oxidation numbers to each atom in neutral molecules or polyatomic ions.'
    }
  },
  fr: {
    'molar-mass': {
      title: 'Calculateur de Masse Molaire',
      subtitle: 'Trouvez la masse molaire et moyenne de n’importe quelle formule',
      desc: 'Calculez la masse moléculaire des composés avec validation instantanée, décomposition élémentaire et pourcentages massiques.'
    },
    'stoichiometry': {
      title: 'Calculateur de Stœchiométrie',
      subtitle: 'Calculez facilement les relations entre réactifs et produits',
      desc: 'Déterminez les rapports molaires, les conversions masse-moles, le réactif limitant et les quantités de produit attendues.'
    },
    'equation-balancer': {
      title: 'Équilibreur d’Équations Chimiques',
      subtitle: 'Équilibrez automatiquement les réactions complexes',
      desc: 'Saisissez des équations non équilibrées et trouvez instantanément les coefficients stœchiométriques entiers avec vérification pas à pas.'
    },
    'ph-calculator': {
      title: 'Calculateur de pH & pOH',
      subtitle: 'Calculez le pH, pOH et les concentrations ioniques',
      desc: 'Outil interactif d’analyse acide-base reliant [H⁺], [OH⁻], pH et pOH avec curseur de spectre coloré et repères de substances.'
    },
    'molarity-dilution': {
      title: 'Molarité & Dilution de Solutions',
      subtitle: 'Calculez avec précision les concentrations et les dilutions',
      desc: 'Double calculateur pour préparer des solutions à partir d’une masse ou réaliser des dilutions en série selon C₁V₁ = C₂V₂.'
    },
    'percent-composition': {
      title: 'Composition Centésimale Massique',
      subtitle: 'Déterminez les pourcentages en masse des éléments',
      desc: 'Décomposez n’importe quelle formule chimique en masses individuelles des éléments et pourcentages de la masse totale.'
    },
    'gibbs-free-energy': {
      title: 'Énergie Libre de Gibbs (ΔG)',
      subtitle: 'Évaluez la spontanéité d’une réaction selon ΔH et ΔS',
      desc: 'Calculez ΔG = ΔH - TΔS, déterminez la spontanéité thermodynamique et découvrez la température critique d’inversion.'
    },
    'ideal-gas-law': {
      title: 'Loi des Gaz Parfaits (PV = nRT)',
      subtitle: 'Résolvez pour P, V, n ou T avec conversions d’unités',
      desc: 'Calculez la pression, le volume, la quantité de matière ou la température pour des gaz idéaux avec gestion complète des unités.'
    },
    'empirical-formula': {
      title: 'Formule Brute & Empirique',
      subtitle: 'Déterminez les ratios atomiques les plus simples',
      desc: 'Calculez la formule empirique à partir des pourcentages massiques ou masses d’éléments, et la formule moléculaire avec la masse molaire.'
    },
    'oxidation-state': {
      title: 'Nombres d’Oxydation',
      subtitle: 'Attribuez les états d’oxydation aux atomes d’un composé',
      desc: 'Déterminez les états d’oxydation pour chaque élément avec règles d’électronégativité et vérification de la charge globale.'
    }
  },
  ar: {
    'molar-mass': {
      title: 'حاسبة الكتلة المولية',
      subtitle: 'احسب الكتلة المولية والكتلة المتوسطة لأي مركب كيميائي',
      desc: 'حساب الوزن الجزيئي للمركبات مع تحقق فوري، وتفصيل العناصر، والنسب المئوية الكتلية لكل عنصر.'
    },
    'stoichiometry': {
      title: 'حاسبة القياسات الكيميائية (الستوكيومتري)',
      subtitle: 'احسب بدقة العلاقات الكمية بين المتفاعلات والنواتج',
      desc: 'تحديد النسب المولية، والتحويل بين الكتلة والمولات، وتحديد المتفاعل المحدِّد والكميات المتوقعة.'
    },
    'equation-balancer': {
      title: 'موازن المعادلات الكيميائية',
      subtitle: 'موازنة المعادلات الكيميائية المعقدة تلقائياً',
      desc: 'أدخل المعادلات غير الموزونة واحصل فورياً على المعاملات الصحيحة مع التحقق خطوة بخطوة من حفظ الذرات.'
    },
    'ph-calculator': {
      title: 'حاسبة الرقم الهيدروجيني pH و pOH',
      subtitle: 'حساب تركيز أيونات الهيدروجين والهيدروكسيد وقيم الحموضة',
      desc: 'أداة تفاعلية لتحليل الأحماض والقواعد تربط بين [H⁺] و [OH⁻] و pH و pOH مع طيف لوني وأمثلة واقعية.'
    },
    'molarity-dilution': {
      title: 'حاسبة المولارية والتخفيف',
      subtitle: 'حساب تراكيز المحاليل وعمليات التخفيف بدقة متناهية',
      desc: 'حاسبة مزدوجة لتحضير المحاليل من الكتلة أو إجراء التخفيف وفق معادلة التخفيف الشهيرة M₁V₁ = M₂V₂.'
    },
    'percent-composition': {
      title: 'حاسبة النسب المئوية الكتلية',
      subtitle: 'تحديد النسبة المئوية لكتلة كل عنصر في المركب',
      desc: 'تحليل أي صيغة كيميائية إلى أوزان عناصرها المكونة ونسبتها المئوية من إجمالي كتلة المركب.'
    },
    'gibbs-free-energy': {
      title: 'طاقة غيبس الحرة (ΔG)',
      subtitle: 'تقييم تلقائية التفاعل اعتماداً على التغير في الإنثالبي والإنتروبيا',
      desc: 'حساب ΔG = ΔH - TΔS، وتقييم الجدوى الديناميكية الحرارية للتفاعل وتحديد درجة الحرارة الحرجة.'
    },
    'ideal-gas-law': {
      title: 'قانون الغاز المثالي (PV = nRT)',
      subtitle: 'حساب الضغط، الحجم، عدد المولات، أو درجة الحرارة للغازات',
      desc: 'حل معادلة الغاز المثالي لحساب أي متغير مجهول مع دعم التحويل بين مختلف وحدات القياس العلمية.'
    },
    'empirical-formula': {
      title: 'حاسبة الصيغة الأولية والجزيئية',
      subtitle: 'استنتاج أبسط نسبة عددية للذرات في المركب الكيميائي',
      desc: 'استنتاج الصيغة الأولية من نسب كتل العناصر أو الغرامات، وحساب الصيغة الجزيئية بالكتلة المولية.'
    },
    'oxidation-state': {
      title: 'حاسبة أعداد التأكسد',
      subtitle: 'تحديد حالات التأكسد لكل ذرة في المركبات والأيونات',
      desc: 'حساب أعداد التأكسد لجميع العناصر وفق قواعد الكهروسالبية وتوزيع الشحنات الكلية للمركب.'
    }
  }
};

