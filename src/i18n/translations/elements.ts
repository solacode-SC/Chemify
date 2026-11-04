import { Language } from '../types';
import { ELEMENTS } from '../../data/elementsData';

export const ELEMENT_NAMES: Record<Language, Record<number, string>> = {
  en: Object.fromEntries(ELEMENTS.map(el => [el.atomicNumber, el.name])),
  fr: {
    1: 'Hydrogène', 2: 'Hélium', 3: 'Lithium', 4: 'Béryllium', 5: 'Bore',
    6: 'Carbone', 7: 'Azote', 8: 'Oxygène', 9: 'Fluor', 10: 'Néon',
    11: 'Sodium', 12: 'Magnésium', 13: 'Aluminium', 14: 'Silicium', 15: 'Phosphore',
    16: 'Soufre', 17: 'Chlore', 18: 'Argon', 19: 'Potassium', 20: 'Calcium',
    21: 'Scandium', 22: 'Titane', 23: 'Vanadium', 24: 'Chrome', 25: 'Manganèse',
    26: 'Fer', 27: 'Cobalt', 28: 'Nickel', 29: 'Cuivre', 30: 'Zinc',
    31: 'Gallium', 32: 'Germanium', 33: 'Arsenic', 34: 'Sélénium', 35: 'Brome',
    36: 'Krypton', 37: 'Rubidium', 38: 'Strontium', 39: 'Yttrium', 40: 'Zirconium',
    41: 'Niobium', 42: 'Molybdène', 43: 'Technétium', 44: 'Ruthénium', 45: 'Rhodium',
    46: 'Palladium', 47: 'Argent', 48: 'Cadmium', 49: 'Indium', 50: 'Étain',
    51: 'Antimoine', 52: 'Tellure', 53: 'Iode', 54: 'Xénon', 55: 'Césium',
    56: 'Baryum', 57: 'Lanthane', 58: 'Cérium', 59: 'Praséodyme', 60: 'Néodyme',
    61: 'Prométhium', 62: 'Samarium', 63: 'Europium', 64: 'Gadolinium', 65: 'Terbium',
    66: 'Dysprosium', 67: 'Holmium', 68: 'Erbium', 69: 'Thulium', 70: 'Ytterbium',
    71: 'Lutécium', 72: 'Hafnium', 73: 'Tantale', 74: 'Tungstène', 75: 'Rhénium',
    76: 'Osmium', 77: 'Iridium', 78: 'Platine', 79: 'Or', 80: 'Mercure',
    81: 'Thallium', 82: 'Plomb', 83: 'Bismuth', 84: 'Polonium', 85: 'Astate',
    86: 'Radon', 87: 'Francium', 88: 'Radium', 89: 'Actinium', 90: 'Thorium',
    91: 'Protactinium', 92: 'Uranium', 93: 'Neptunium', 94: 'Plutonium', 95: 'Américium',
    96: 'Curium', 97: 'Berkélium', 98: 'Californium', 99: 'Einsteinium', 100: 'Fermium',
    101: 'Mendélévium', 102: 'Nobélium', 103: 'Lawrencium', 104: 'Rutherfordium', 105: 'Dubnium',
    106: 'Seaborgium', 107: 'Bohrium', 108: 'Hassium', 109: 'Meitnérium', 110: 'Darmstadtium',
    111: 'Roentgenium', 112: 'Copernicium', 113: 'Nihonium', 114: 'Flérovium', 115: 'Moscovium',
    116: 'Livermorium', 117: 'Tennesse', 118: 'Oganesson'
  },
  ar: {
    1: 'هيدروجين', 2: 'هيليوم', 3: 'ليثيوم', 4: 'بيريليوم', 5: 'بورون',
    6: 'كربون', 7: 'نيتروجين', 8: 'أكسجين', 9: 'فلور', 10: 'نيون',
    11: 'صوديوم', 12: 'مغنيسيوم', 13: 'ألومنيوم', 14: 'سيليكون', 15: 'فوسفور',
    16: 'كبريت', 17: 'كلور', 18: 'أرغون', 19: 'بوتاسيوم', 20: 'كالسيوم',
    21: 'سكانديوم', 22: 'تيتانيوم', 23: 'فاناديوم', 24: 'كروم', 25: 'منغنيز',
    26: 'حديد', 27: 'كوبالت', 28: 'نيكل', 29: 'نحاس', 30: 'زنك',
    31: 'غاليوم', 32: 'جرمانيوم', 33: 'زرنيخ', 34: 'سيلينيوم', 35: 'بروم',
    36: 'كريبتون', 37: 'روبيديوم', 38: 'سترونشيوم', 39: 'إتريوم', 40: 'زركونيوم',
    41: 'نيوبيوم', 42: 'موليبدنوم', 43: 'تكنيشيوم', 44: 'روثينيوم', 45: 'روديوم',
    46: 'بالاديوم', 47: 'فضة', 48: 'كادميوم', 49: 'إنديوم', 50: 'قصدير',
    51: 'إثمد (أنتيمون)', 52: 'تيلوريوم', 53: 'يود', 54: 'زينون', 55: 'سيزيوم',
    56: 'باريوم', 57: 'لانثانوم', 58: 'سيريوم', 59: 'براسوديميوم', 60: 'نيوديميوم',
    61: 'بروميثيوم', 62: 'ساماريوم', 63: 'يوروبيوم', 64: 'غادولينيوم', 65: 'تيربيوم',
    66: 'ديسبروسيوم', 67: 'هولميوم', 68: 'إربيوم', 69: 'ثوليوم', 70: 'إيتربيوم',
    71: 'لوتيشيوم', 72: 'هافنيوم', 73: 'تانتالوم', 74: 'تنغستن', 75: 'رينيوم',
    76: 'أوزميوم', 77: 'إيريديوم', 78: 'بلاتين', 79: 'ذهب', 80: 'زئبق',
    81: 'ثاليوم', 82: 'رصاص', 83: 'بزموت', 84: 'بولونيوم', 85: 'أستاتين',
    86: 'رادون', 87: 'فرنسيوم', 88: 'راديوم', 89: 'أكتينيوم', 90: 'ثوريوم',
    91: 'بروتكتينيوم', 92: 'يورانيوم', 93: 'نبتونيوم', 94: 'بلوتونيوم', 95: 'أمريسيوم',
    96: 'كوريوم', 97: 'بركليوم', 98: 'كاليفورنيوم', 99: 'أينشتاينيوم', 100: 'فيرميوم',
    101: 'مندليفيوم', 102: 'نوبليوم', 103: 'لورنسيوم', 104: 'رذرفورديوم', 105: 'دوبنيوم',
    106: 'سيبورغيوم', 107: 'بوريوم', 108: 'هاسيوم', 109: 'مايتنريوم', 110: 'دارمشتاتيوم',
    111: 'رونتجينيوم', 112: 'كوبرنيسيوم', 113: 'نيهونيوم', 114: 'فليروفيوم', 115: 'موسكوفيوم',
    116: 'ليفرموريوم', 117: 'تينيسين', 118: 'أوغانيسون'
  }
};

const SYMBOL_TO_ATOMIC_NUMBER: Record<string, number> = {};
ELEMENTS.forEach(el => {
  SYMBOL_TO_ATOMIC_NUMBER[el.symbol] = el.atomicNumber;
  SYMBOL_TO_ATOMIC_NUMBER[el.symbol.toUpperCase()] = el.atomicNumber;
});

export const getElementName = (
  identifier: number | string,
  lang: Language,
  fallbackName = ''
): string => {
  const atomicNum = typeof identifier === 'number'
    ? identifier
    : SYMBOL_TO_ATOMIC_NUMBER[identifier] || SYMBOL_TO_ATOMIC_NUMBER[identifier.toUpperCase()];
  if (atomicNum && ELEMENT_NAMES[lang]?.[atomicNum]) {
    return ELEMENT_NAMES[lang][atomicNum];
  }
  return fallbackName || (typeof identifier === 'string' ? identifier : '');
};
