import { Language } from '../types';

export interface LocalizedReactionInfo {
  name: string;
  type: string;
  desc: string;
}

export const PRESET_REACTIONS_TRANSLATIONS: Record<Language, Record<string, LocalizedReactionInfo>> = {
  en: {
    'water-synthesis': {
      name: 'Water Synthesis',
      type: 'Synthesis',
      desc: 'Clean, highly energetic covalent combination of hydrogen and oxygen gas to form pure water.'
    },
    synthesis_h2o: {
      name: 'Water Synthesis',
      type: 'Synthesis',
      desc: 'Clean, highly energetic covalent combination of hydrogen and oxygen gas to form pure water.'
    },
    'methane-combustion': {
      name: 'Methane Combustion',
      type: 'Combustion',
      desc: 'Highly exothermic hydrocarbon oxidation releasing carbon dioxide, water vapor, and intense heat.'
    },
    combustion_ch4: {
      name: 'Methane Combustion',
      type: 'Combustion',
      desc: 'Highly exothermic hydrocarbon oxidation releasing carbon dioxide, water vapor, and intense heat.'
    },
    'haber-process': {
      name: 'Haber-Bosch Ammonia Synthesis',
      type: 'Industrial Synthesis',
      desc: 'Catalytic combination of atmospheric nitrogen and hydrogen under pressure to yield ammonia.'
    },
    haber_bosch: {
      name: 'Haber-Bosch Ammonia Synthesis',
      type: 'Industrial Synthesis',
      desc: 'Catalytic combination of atmospheric nitrogen and hydrogen under pressure to yield ammonia.'
    },
    neutralization: {
      name: 'Acid-Base Neutralization',
      type: 'Neutralization',
      desc: 'Strong hydrochloric acid reacts with sodium hydroxide solution forming saline water.'
    },
    neutralization_hcl_naoh: {
      name: 'Acid-Base Neutralization',
      type: 'Neutralization',
      desc: 'Strong hydrochloric acid reacts with sodium hydroxide solution forming saline water.'
    },
    'copper-displacement': {
      name: 'Copper Single Displacement',
      type: 'Single Displacement / Redox',
      desc: 'Iron displaces copper from blue copper sulfate solution, precipitating lustrous copper metal.'
    },
    'hydrogen-peroxide': {
      name: 'Catalytic Peroxide Decomposition',
      type: 'Decomposition',
      desc: 'Effervescent breakdown of hydrogen peroxide into water and rising oxygen gas bubbles.'
    },
    decomposition_h2o2: {
      name: 'Catalytic Peroxide Decomposition',
      type: 'Decomposition',
      desc: 'Effervescent breakdown of hydrogen peroxide into water and rising oxygen gas bubbles.'
    },
    thermite: {
      name: 'Thermite Incandescent Redox',
      type: 'Redox / High Exothermic',
      desc: 'Blinding pyrotechnic oxidation of aluminum by iron(III) oxide generating molten metallic iron.'
    },
    'calcium-carbonate': {
      name: 'Limestone Calcination',
      type: 'Thermal Decomposition',
      desc: 'Endothermic breakdown of solid limestone into quicklime (calcium oxide) and carbon dioxide gas.'
    },
    photosynthesis: {
      name: 'Photosynthesis',
      type: 'Endothermic',
      desc: 'Solar conversion of carbon dioxide and water into glucose and oxygen.'
    },
    silver_chloride_precipitate: {
      name: 'Silver Chloride Precipitation',
      type: 'Precipitation',
      desc: 'Instantaneous formation of insoluble white silver chloride precipitate.'
    },
    rusting_iron: {
      name: 'Iron Oxidation (Rusting)',
      type: 'Redox',
      desc: 'Gradual electrochemical oxidation of iron in the presence of oxygen and moisture.'
    }
  },
  fr: {
    'water-synthesis': {
      name: 'Synthèse de l’Eau',
      type: 'Synthèse',
      desc: 'Combinaison covalente hautement énergétique de l’hydrogène et de l’oxygène gazeux pour former de l’eau.'
    },
    synthesis_h2o: {
      name: 'Synthèse de l’Eau',
      type: 'Synthèse',
      desc: 'Combinaison covalente hautement énergétique de l’hydrogène et de l’oxygène gazeux pour former de l’eau.'
    },
    'methane-combustion': {
      name: 'Combustion du Méthane',
      type: 'Combustion',
      desc: 'Oxydation très exothermique produisant du dioxyde de carbone, de la vapeur d’eau et une chaleur vive.'
    },
    combustion_ch4: {
      name: 'Combustion du Méthane',
      type: 'Combustion',
      desc: 'Oxydation très exothermique produisant du dioxyde de carbone, de la vapeur d’eau et une chaleur vive.'
    },
    'haber-process': {
      name: 'Procédé Haber-Bosch',
      type: 'Synthèse industrielle',
      desc: 'Synthèse catalytique de l’ammoniac à partir d’azote et d’hydrogène sous haute pression.'
    },
    haber_bosch: {
      name: 'Procédé Haber-Bosch',
      type: 'Synthèse industrielle',
      desc: 'Synthèse catalytique de l’ammoniac à partir d’azote et d’hydrogène sous haute pression.'
    },
    neutralization: {
      name: 'Neutralisation Acide-Base',
      type: 'Neutralisation',
      desc: 'L’acide chlorhydrique réagit avec la soude pour former de l’eau salée et libérer de la chaleur.'
    },
    neutralization_hcl_naoh: {
      name: 'Neutralisation Acide-Base',
      type: 'Neutralisation',
      desc: 'L’acide chlorhydrique réagit avec la soude pour former de l’eau salée et libérer de la chaleur.'
    },
    'copper-displacement': {
      name: 'Déplacement Simple du Cuivre',
      type: 'Oxydoréduction / Déplacement',
      desc: 'Le fer métallique déplace le cuivre de la solution bleue de CuSO₄ et précipite du cuivre rouge.'
    },
    'hydrogen-peroxide': {
      name: 'Décomposition de l’Eau Oxygénée',
      type: 'Décomposition',
      desc: 'Dégagement effervescent d’oxygène gazeux et formation d’eau catalysée par MnO₂.'
    },
    decomposition_h2o2: {
      name: 'Décomposition de l’Eau Oxygénée',
      type: 'Décomposition',
      desc: 'Dégagement effervescent d’oxygène gazeux et formation d’eau catalysée par MnO₂.'
    },
    thermite: {
      name: 'Réaction de la Thermite',
      type: 'Rédox / Incandescence',
      desc: 'Réduction pyrotechnique spectaculaire de l’oxyde de fer par l’aluminium produisant du fer en fusion.'
    },
    'calcium-carbonate': {
      name: 'Calcination du Calcaire',
      type: 'Décomposition thermique',
      desc: 'Décomposition endothermique de la craie en chaux vive (CaO) et dioxyde de carbone gazeux.'
    },
    photosynthesis: {
      name: 'Photosynthèse',
      type: 'Endothermique',
      desc: 'Conversion de la lumière, de l’eau et du CO₂ en glucose et dioxygène.'
    },
    silver_chloride_precipitate: {
      name: 'Précipitation du Chlorure d’Argent',
      type: 'Précipitation',
      desc: 'Formation instantanée d’un précipité blanc insoluble d’AgCl.'
    },
    rusting_iron: {
      name: 'Oxydation du Fer (Rouille)',
      type: 'Oxydoréduction',
      desc: 'Corrosion lente du fer métallique en présence d’oxygène et d’humidité.'
    }
  },
  ar: {
    'water-synthesis': {
      name: 'تخليق الماء',
      type: 'تفاعل اتحاد (تكوين)',
      desc: 'اتحاد شديد الطاقة بين غازي الهيدروجين والأكسجين لتكوين جزيئات الماء النقي.'
    },
    synthesis_h2o: {
      name: 'تخليق الماء',
      type: 'تفاعل اتحاد (تكوين)',
      desc: 'اتحاد شديد الطاقة بين غازي الهيدروجين والأكسجين لتكوين جزيئات الماء النقي.'
    },
    'methane-combustion': {
      name: 'احتراق غاز الميثان',
      type: 'تفاعل احتراق',
      desc: 'أكسدة هيدروكربونية طاردة للحرارة تنتج غاز ثاني أكسيد الكربون وبخار الماء.'
    },
    combustion_ch4: {
      name: 'احتراق غاز الميثان',
      type: 'تفاعل احتراق',
      desc: 'أكسدة هيدروكربونية طاردة للحرارة تنتج غاز ثاني أكسيد الكربون وبخار الماء.'
    },
    'haber-process': {
      name: 'طريقة هابر-بوش الصناعية',
      type: 'تخليق صناعي',
      desc: 'تخليق غاز الأمونيا انطلاقاً من النيتروجين والهيدروجين تحت ضغط وحرارة عالية.'
    },
    haber_bosch: {
      name: 'طريقة هابر-بوش الصناعية',
      type: 'تخليق صناعي',
      desc: 'تخليق غاز الأمونيا انطلاقاً من النيتروجين والهيدروجين تحت ضغط وحرارة عالية.'
    },
    neutralization: {
      name: 'تعادل حمض وقاعدة',
      type: 'تفاعل تعادل',
      desc: 'تفاعل حمض الهيدروكلوريك مع هيدروكسيد الصوديوم لتكوين محلول ملحي وماء مع انطلاق حرارة.'
    },
    neutralization_hcl_naoh: {
      name: 'تعادل حمض وقاعدة',
      type: 'تفاعل تعادل',
      desc: 'تفاعل حمض الهيدروكلوريك مع هيدروكسيد الصوديوم لتكوين محلول ملحي وماء مع انطلاق حرارة.'
    },
    'copper-displacement': {
      name: 'إزاحة النحاس الأحادية',
      type: 'إزاحة أحادية وأكسدة واختزال',
      desc: 'يحل الحديد محل النحاس في محلول كبريتات النحاس الأزرق ليرسب فلز النحاس الأحمر اللامع.'
    },
    'hydrogen-peroxide': {
      name: 'تفكك ماء الأكسجين (فوق أكسيد الهيدروجين)',
      type: 'تفاعل تفكك حفزي',
      desc: 'انطلاق غاز الأكسجين الفوّار وتكون الماء بتأثير محفز ثاني أكسيد المنغنيز.'
    },
    decomposition_h2o2: {
      name: 'تفكك ماء الأكسجين (فوق أكسيد الهيدروجين)',
      type: 'تفاعل تفكك حفزي',
      desc: 'انطلاق غاز الأكسجين الفوّار وتكون الماء بتأثير محفز ثاني أكسيد المنغنيز.'
    },
    thermite: {
      name: 'تفاعل الثيرمايت المتوهج',
      type: 'أكسدة واختزال شديد الاشتعال',
      desc: 'اختزال ناري مذهل لأكسيد الحديد بواسطة مسحوق الألومنيوم ينتج حديداً منصهراً سائل.'
    },
    'calcium-carbonate': {
      name: 'تكليس الحجر الجيري',
      type: 'تفكك حراري ماص للحرارة',
      desc: 'تفكك كربونات الكالسيوم بالحرارة العالية إلى جير حي (أكسيد الكالسيوم) وغاز CO₂.'
    },
    photosynthesis: {
      name: 'التمثيل الضوئي (البناء الضوئي)',
      type: 'تفاعل ماص للحرارة والطاقة',
      desc: 'تحويل الطاقة الضوئية والماء وثاني أكسيد الكربون إلى سكر الجلوكوز وأكسجين.'
    },
    silver_chloride_precipitate: {
      name: 'ترسيب كلوريد الفضة',
      type: 'تفاعل ترسيب',
      desc: 'تكون سريع لراسب أبيض ناصع غير ذواب من كلوريد الفضة (AgCl).'
    },
    rusting_iron: {
      name: 'أكسدة وصدأ الحديد',
      type: 'تفاعل أكسدة واختزال',
      desc: 'تآكل بطيء للحديد الفلزي في وجود الأكسجين والرطوبة الجوية.'
    }
  }
};
