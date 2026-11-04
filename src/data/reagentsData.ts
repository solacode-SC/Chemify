import { calculateMolarMass, formatChemicalFormula } from '../utils/formulaParser';

export interface ReagentMeta {
  formula: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  state: 'gas' | 'liquid' | 'solid' | 'aqueous';
  stateLabel: '(g)' | '(l)' | '(s)' | '(aq)';
  color: string;           // Color of the substance in flask/bottle
  bottleColor: string;     // Bottle glass tone
  bottleType: 'gas-cylinder' | 'liquid-bottle' | 'solid-jar' | 'powder-dish';
  molarMass: number;
  hazard?: 'flammable' | 'corrosive' | 'oxidizer' | 'toxic' | 'safe';
  hazardIcon?: string;
  appearance: {
    en: string;
    fr: string;
    ar: string;
  };
}

export const REAGENTS_MAP: Record<string, ReagentMeta> = {
  H2: {
    formula: 'H2',
    name: {
      en: 'Hydrogen Gas',
      fr: 'Hydrogène Gazeux',
      ar: 'غاز الهيدروجين'
    },
    state: 'gas',
    stateLabel: '(g)',
    color: 'rgba(235, 245, 255, 0.45)',
    bottleColor: '#94A3B8',
    bottleType: 'gas-cylinder',
    molarMass: 2.016,
    hazard: 'flammable',
    hazardIcon: '🔥',
    appearance: {
      en: 'Colorless, odorless, highly flammable diatomic gas',
      fr: 'Gaz diatomique incolore, inodore et très inflammable',
      ar: 'غاز ثنائي الذرة عديم اللون والرائحة وشديد الاشتعال'
    }
  },
  O2: {
    formula: 'O2',
    name: {
      en: 'Oxygen Gas',
      fr: 'Oxygène Gazeux',
      ar: 'غاز الأكسجين'
    },
    state: 'gas',
    stateLabel: '(g)',
    color: 'rgba(239, 246, 255, 0.5)',
    bottleColor: '#3B82F6',
    bottleType: 'gas-cylinder',
    molarMass: 31.998,
    hazard: 'oxidizer',
    hazardIcon: '💨',
    appearance: {
      en: 'Vital atmospheric oxidizer gas for combustion',
      fr: 'Comburant gazeux essentiel à la combustion',
      ar: 'غاز مؤكسد حيوي يساعد على الاحتراق'
    }
  },
  H2O: {
    formula: 'H2O',
    name: {
      en: 'Water',
      fr: 'Eau Purifiée',
      ar: 'ماء مقطر'
    },
    state: 'liquid',
    stateLabel: '(l)',
    color: 'rgba(219, 234, 254, 0.6)',
    bottleColor: '#60A5FA',
    bottleType: 'liquid-bottle',
    molarMass: 18.015,
    hazard: 'safe',
    hazardIcon: '💧',
    appearance: {
      en: 'Pure transparent universal solvent (1.00 g/mL)',
      fr: 'Solvant universel transparent pur (1,00 g/mL)',
      ar: 'مذيب عام نقي وشفاف (كثافة 1.00 غ/مل)'
    }
  },
  CH4: {
    formula: 'CH4',
    name: {
      en: 'Methane Gas',
      fr: 'Méthane',
      ar: 'غاز الميثان'
    },
    state: 'gas',
    stateLabel: '(g)',
    color: 'rgba(240, 253, 244, 0.4)',
    bottleColor: '#10B981',
    bottleType: 'gas-cylinder',
    molarMass: 16.043,
    hazard: 'flammable',
    hazardIcon: '🔥',
    appearance: {
      en: 'Hydrocarbon natural gas fuel',
      fr: 'Gaz naturel combustible hydrocarbure',
      ar: 'غاز هيدروكربوني طبيعي وقود للاشتعال'
    }
  },
  CO2: {
    formula: 'CO2',
    name: {
      en: 'Carbon Dioxide',
      fr: 'Dioxyde de Carbone',
      ar: 'ثاني أكسيد الكربون'
    },
    state: 'gas',
    stateLabel: '(g)',
    color: 'rgba(243, 244, 246, 0.5)',
    bottleColor: '#6B7280',
    bottleType: 'gas-cylinder',
    molarMass: 44.01,
    hazard: 'safe',
    hazardIcon: '💨',
    appearance: {
      en: 'Dense inert combustion product gas',
      fr: 'Gaz dense inerte issu de la combustion',
      ar: 'غاز خامل كثيف ناتج عن الاحتراق'
    }
  },
  N2: {
    formula: 'N2',
    name: {
      en: 'Nitrogen Gas',
      fr: 'Azote Gazeux',
      ar: 'غاز النيتروجين'
    },
    state: 'gas',
    stateLabel: '(g)',
    color: 'rgba(241, 245, 249, 0.45)',
    bottleColor: '#475569',
    bottleType: 'gas-cylinder',
    molarMass: 28.014,
    hazard: 'safe',
    hazardIcon: '💨',
    appearance: {
      en: 'Inert diatomic gas with strong triple covalent bond',
      fr: 'Gaz diatomique inerte à triple liaison covalente forte',
      ar: 'غاز خامل ذو رابطة تساهمية ثلاثية قوية'
    }
  },
  NH3: {
    formula: 'NH3',
    name: {
      en: 'Ammonia',
      fr: 'Ammoniac',
      ar: 'غاز النشادر (الأمونيا)'
    },
    state: 'gas',
    stateLabel: '(g)',
    color: 'rgba(224, 231, 255, 0.55)',
    bottleColor: '#6366F1',
    bottleType: 'liquid-bottle',
    molarMass: 17.031,
    hazard: 'corrosive',
    hazardIcon: '⚠️',
    appearance: {
      en: 'Pungent alkaline nitrogen hydride',
      fr: 'Hydrure d’azote alcalin d’odeur piquante',
      ar: 'مركب قلوي ذو رائحة نفاذة'
    }
  },
  HCl: {
    formula: 'HCl',
    name: {
      en: 'Hydrochloric Acid',
      fr: 'Acide Chlorhydrique',
      ar: 'حمض الهيدروكلوريك'
    },
    state: 'aqueous',
    stateLabel: '(aq)',
    color: 'rgba(238, 242, 255, 0.7)',
    bottleColor: '#4F46E5',
    bottleType: 'liquid-bottle',
    molarMass: 36.461,
    hazard: 'corrosive',
    hazardIcon: '⚠️',
    appearance: {
      en: 'Strong monoprotic mineral acid solution',
      fr: 'Solution d’acide minéral fort monoprotique',
      ar: 'حمض معدني قوي وأكّال في وسط مائي'
    }
  },
  NaOH: {
    formula: 'NaOH',
    name: {
      en: 'Sodium Hydroxide',
      fr: 'Hydroxyde de Sodium',
      ar: 'هيدروكسيد الصوديوم (الصودا الكاوية)'
    },
    state: 'aqueous',
    stateLabel: '(aq)',
    color: 'rgba(250, 245, 255, 0.7)',
    bottleColor: '#9333EA',
    bottleType: 'liquid-bottle',
    molarMass: 39.997,
    hazard: 'corrosive',
    hazardIcon: '⚠️',
    appearance: {
      en: 'Strong caustic alkali solution',
      fr: 'Solution alcaline caustique forte',
      ar: 'محلول قلوي كاوي وقوي'
    }
  },
  NaCl: {
    formula: 'NaCl',
    name: {
      en: 'Sodium Chloride (Salt)',
      fr: 'Chlorure de Sodium (Sel)',
      ar: 'كلوريد الصوديوم (ملح الطعام)'
    },
    state: 'solid',
    stateLabel: '(s)',
    color: '#FAF8F5',
    bottleColor: '#D1D5DB',
    bottleType: 'solid-jar',
    molarMass: 58.443,
    hazard: 'safe',
    hazardIcon: '🧂',
    appearance: {
      en: 'White ionic crystalline mineral salt',
      fr: 'Sel minéral blanc cristallin ionique',
      ar: 'بلورات ملحية أيونية بيضاء نقية'
    }
  },
  Fe: {
    formula: 'Fe',
    name: {
      en: 'Iron Filings / Powder',
      fr: 'Limaille de Fer',
      ar: 'برادة الحديد النقي'
    },
    state: 'solid',
    stateLabel: '(s)',
    color: '#4B5563',
    bottleColor: '#374151',
    bottleType: 'solid-jar',
    molarMass: 55.845,
    hazard: 'safe',
    hazardIcon: '🪨',
    appearance: {
      en: 'Dark gray magnetic metallic transition element',
      fr: 'Métal de transition gris foncé magnétique',
      ar: 'فلز انتقالي رمادي داكن ذو خواص مغناطيسية'
    }
  },
  CuSO4: {
    formula: 'CuSO4',
    name: {
      en: 'Copper(II) Sulfate',
      fr: 'Sulfate de Cuivre(II)',
      ar: 'كبريتات النحاس الثنائي'
    },
    state: 'aqueous',
    stateLabel: '(aq)',
    color: '#0284C7',
    bottleColor: '#0369A1',
    bottleType: 'liquid-bottle',
    molarMass: 159.609,
    hazard: 'toxic',
    hazardIcon: '🧪',
    appearance: {
      en: 'Characteristic brilliant cobalt blue solution',
      fr: 'Solution bleue azur caractéristique éclatante',
      ar: 'محلول أزرق فيروزي ساطع ومميز'
    }
  },
  FeSO4: {
    formula: 'FeSO4',
    name: {
      en: 'Iron(II) Sulfate',
      fr: 'Sulfate de Fer(II)',
      ar: 'كبريتات الحديد الثنائي'
    },
    state: 'aqueous',
    stateLabel: '(aq)',
    color: '#10B981',
    bottleColor: '#059669',
    bottleType: 'liquid-bottle',
    molarMass: 151.908,
    hazard: 'safe',
    hazardIcon: '🧪',
    appearance: {
      en: 'Pale sea-green redox aqueous solution',
      fr: 'Solution aqueuse vert pâle issue de l’oxydoréduction',
      ar: 'محلول مائي ذو لون أخضر فاتح ناتج عن الإزاحة'
    }
  },
  Cu: {
    formula: 'Cu',
    name: {
      en: 'Copper Precipitate',
      fr: 'Précipité de Cuivre Métallique',
      ar: 'راسب فلز النحاس الأحمر'
    },
    state: 'solid',
    stateLabel: '(s)',
    color: '#C2410C',
    bottleColor: '#9A3412',
    bottleType: 'solid-jar',
    molarMass: 63.546,
    hazard: 'safe',
    hazardIcon: '🪨',
    appearance: {
      en: 'Reddish-brown metallic solid precipitate',
      fr: 'Précipité solide métallique rouge-brun lustré',
      ar: 'راسب فلزي صلب أحمر مائل للبني'
    }
  },
  H2O2: {
    formula: 'H2O2',
    name: {
      en: 'Hydrogen Peroxide (30%)',
      fr: 'Peroxyde d’Hydrogène (30%)',
      ar: 'فوق أكسيد الهيدروجين (ماء الأكسجين)'
    },
    state: 'liquid',
    stateLabel: '(l)',
    color: 'rgba(224, 242, 254, 0.7)',
    bottleColor: '#78350F', // Amber glass bottle to block light
    bottleType: 'liquid-bottle',
    molarMass: 34.015,
    hazard: 'oxidizer',
    hazardIcon: '💨',
    appearance: {
      en: 'Effervescent oxidizing liquid in amber bottle',
      fr: 'Liquide oxydant effervescent en flacon ambré',
      ar: 'سائل مؤكسد فوّار يُحفظ في زجاجة عاتمة'
    }
  },
  Al: {
    formula: 'Al',
    name: {
      en: 'Aluminum Metal Powder',
      fr: 'Poudre d’Aluminium',
      ar: 'مسحوق فلز الألومنيوم'
    },
    state: 'solid',
    stateLabel: '(s)',
    color: '#94A3B8',
    bottleColor: '#64748B',
    bottleType: 'powder-dish',
    molarMass: 26.982,
    hazard: 'flammable',
    hazardIcon: '🔥',
    appearance: {
      en: 'Fine silvery reactive metallic powder',
      fr: 'Poudre métallique argentée réactive fine',
      ar: 'مسحوق فلزي فضي نشط وسريع التفاعل'
    }
  },
  Fe2O3: {
    formula: 'Fe2O3',
    name: {
      en: 'Iron(III) Oxide (Rust)',
      fr: 'Oxyde de Fer(III) (Rouille)',
      ar: 'أكسيد الحديد الثلاثي (الصدأ)'
    },
    state: 'solid',
    stateLabel: '(s)',
    color: '#7C2D12',
    bottleColor: '#451A03',
    bottleType: 'powder-dish',
    molarMass: 159.687,
    hazard: 'safe',
    hazardIcon: '🪨',
    appearance: {
      en: 'Dense reddish-brown mineral oxide powder',
      fr: 'Poudre minérale dense rouge-brun foncé',
      ar: 'مسحوق أكسيد معدني بني محمر كثيف'
    }
  },
  Al2O3: {
    formula: 'Al2O3',
    name: {
      en: 'Aluminum Oxide (Alumina)',
      fr: 'Alumine (Oxyde d’Aluminium)',
      ar: 'أكسيد الألومنيوم (الألومينا)'
    },
    state: 'solid',
    stateLabel: '(s)',
    color: '#E2E8F0',
    bottleColor: '#CBD5E1',
    bottleType: 'solid-jar',
    molarMass: 101.961,
    hazard: 'safe',
    hazardIcon: '🪨',
    appearance: {
      en: 'White refractory ceramic oxide slag',
      fr: 'Laitier céramique blanc réfractaire inerte',
      ar: 'خبث خزفي أبيض مقاوم للحرارة'
    }
  },
  CaCO3: {
    formula: 'CaCO3',
    name: {
      en: 'Calcium Carbonate (Limestone)',
      fr: 'Carbonate de Calcium (Craie)',
      ar: 'كربونات الكالسيوم (الحجر الجيري)'
    },
    state: 'solid',
    stateLabel: '(s)',
    color: '#F8FAFC',
    bottleColor: '#E2E8F0',
    bottleType: 'solid-jar',
    molarMass: 100.086,
    hazard: 'safe',
    hazardIcon: '🪨',
    appearance: {
      en: 'White chalk powder that decomposes under heat',
      fr: 'Poudre de craie blanche qui se décompose sous l’effet de la chaleur',
      ar: 'مسحوق طباشيري أبيض يتفكك بالحرارة العالية'
    }
  },
  CaO: {
    formula: 'CaO',
    name: {
      en: 'Calcium Oxide (Quicklime)',
      fr: 'Chaux Vive (Oxyde de Calcium)',
      ar: 'أكسيد الكالسيوم (الجير الحي)'
    },
    state: 'solid',
    stateLabel: '(s)',
    color: '#F1F5F9',
    bottleColor: '#94A3B8',
    bottleType: 'solid-jar',
    molarMass: 56.077,
    hazard: 'corrosive',
    hazardIcon: '⚠️',
    appearance: {
      en: 'White caustic calcined mineral powder',
      fr: 'Poudre minérale calcinée caustique blanche',
      ar: 'مسحوق معدني كلسي أبيض كاوي ناتج عن التكليس'
    }
  }
};

/**
 * Common reagents available in the Lab Stockroom for 1-click addition.
 */
export const STOCKROOM_REAGENTS = [
  'H2',
  'O2',
  'CH4',
  'N2',
  'HCl',
  'NaOH',
  'Fe',
  'CuSO4',
  'H2O2',
  'Al',
  'Fe2O3',
  'CaCO3'
];

/**
 * Returns rich reagent metadata for any chemical formula.
 * Gracefully generates defaults for any valid custom formula.
 */
export function getReagentInfo(formula: string): ReagentMeta {
  const clean = formula.trim();
  const match = REAGENTS_MAP[clean];
  if (match) return match;

  const mm = calculateMolarMass(clean) || 50;
  const isGas = ['H2', 'O2', 'N2', 'Cl2', 'F2', 'CO2', 'CH4', 'NH3'].includes(clean);
  const isAqueous = clean.includes('SO4') || clean.includes('NO3') || clean.includes('Cl') || clean.endsWith('OH');

  return {
    formula: clean,
    name: {
      en: `${clean} Compound`,
      fr: `Composé ${clean}`,
      ar: `مركب ${clean}`
    },
    state: isGas ? 'gas' : isAqueous ? 'aqueous' : 'solid',
    stateLabel: isGas ? '(g)' : isAqueous ? '(aq)' : '(s)',
    color: isAqueous ? 'rgba(186, 230, 253, 0.65)' : '#FAF8F5',
    bottleColor: '#6F7F63',
    bottleType: isGas ? 'gas-cylinder' : isAqueous ? 'liquid-bottle' : 'solid-jar',
    molarMass: parseFloat(mm.toFixed(3)),
    hazard: 'safe',
    hazardIcon: '🧪',
    appearance: {
      en: `Laboratory chemical compound (${mm.toFixed(2)} g/mol)`,
      fr: `Composé chimique de laboratoire (${mm.toFixed(2)} g/mol)`,
      ar: `مركب كيميائي مخبري (${mm.toFixed(2)} غ/مول)`
    }
  };
}

