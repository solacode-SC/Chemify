/* ===================================================
   Chemify — All 118 Elements Data
   Each element: name, symbol, atomicNumber, atomicMass,
   category, period, group, gridColumn, gridRow
   =================================================== */

const ELEMENTS = [
    // Period 1
    { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', atomicMass: '1.008', category: 'nonmetal', period: 1, group: 1, gridColumn: 1, gridRow: 1 },
    { atomicNumber: 2, symbol: 'He', name: 'Helium', atomicMass: '4.003', category: 'noble-gas', period: 1, group: 18, gridColumn: 18, gridRow: 1 },

    // Period 2
    { atomicNumber: 3, symbol: 'Li', name: 'Lithium', atomicMass: '6.941', category: 'alkali-metal', period: 2, group: 1, gridColumn: 1, gridRow: 2 },
    { atomicNumber: 4, symbol: 'Be', name: 'Beryllium', atomicMass: '9.012', category: 'alkaline-earth', period: 2, group: 2, gridColumn: 2, gridRow: 2 },
    { atomicNumber: 5, symbol: 'B', name: 'Boron', atomicMass: '10.81', category: 'metalloid', period: 2, group: 13, gridColumn: 13, gridRow: 2 },
    { atomicNumber: 6, symbol: 'C', name: 'Carbon', atomicMass: '12.01', category: 'nonmetal', period: 2, group: 14, gridColumn: 14, gridRow: 2 },
    { atomicNumber: 7, symbol: 'N', name: 'Nitrogen', atomicMass: '14.01', category: 'nonmetal', period: 2, group: 15, gridColumn: 15, gridRow: 2 },
    { atomicNumber: 8, symbol: 'O', name: 'Oxygen', atomicMass: '16.00', category: 'nonmetal', period: 2, group: 16, gridColumn: 16, gridRow: 2 },
    { atomicNumber: 9, symbol: 'F', name: 'Fluorine', atomicMass: '19.00', category: 'halogen', period: 2, group: 17, gridColumn: 17, gridRow: 2 },
    { atomicNumber: 10, symbol: 'Ne', name: 'Neon', atomicMass: '20.18', category: 'noble-gas', period: 2, group: 18, gridColumn: 18, gridRow: 2 },

    // Period 3
    { atomicNumber: 11, symbol: 'Na', name: 'Sodium', atomicMass: '22.99', category: 'alkali-metal', period: 3, group: 1, gridColumn: 1, gridRow: 3 },
    { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', atomicMass: '24.31', category: 'alkaline-earth', period: 3, group: 2, gridColumn: 2, gridRow: 3 },
    { atomicNumber: 13, symbol: 'Al', name: 'Aluminium', atomicMass: '26.98', category: 'post-transition', period: 3, group: 13, gridColumn: 13, gridRow: 3 },
    { atomicNumber: 14, symbol: 'Si', name: 'Silicon', atomicMass: '28.09', category: 'metalloid', period: 3, group: 14, gridColumn: 14, gridRow: 3 },
    { atomicNumber: 15, symbol: 'P', name: 'Phosphorus', atomicMass: '30.97', category: 'nonmetal', period: 3, group: 15, gridColumn: 15, gridRow: 3 },
    { atomicNumber: 16, symbol: 'S', name: 'Sulfur', atomicMass: '32.07', category: 'nonmetal', period: 3, group: 16, gridColumn: 16, gridRow: 3 },
    { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', atomicMass: '35.45', category: 'halogen', period: 3, group: 17, gridColumn: 17, gridRow: 3 },
    { atomicNumber: 18, symbol: 'Ar', name: 'Argon', atomicMass: '39.95', category: 'noble-gas', period: 3, group: 18, gridColumn: 18, gridRow: 3 },

    // Period 4
    { atomicNumber: 19, symbol: 'K', name: 'Potassium', atomicMass: '39.10', category: 'alkali-metal', period: 4, group: 1, gridColumn: 1, gridRow: 4 },
    { atomicNumber: 20, symbol: 'Ca', name: 'Calcium', atomicMass: '40.08', category: 'alkaline-earth', period: 4, group: 2, gridColumn: 2, gridRow: 4 },
    { atomicNumber: 21, symbol: 'Sc', name: 'Scandium', atomicMass: '44.96', category: 'transition-metal', period: 4, group: 3, gridColumn: 3, gridRow: 4 },
    { atomicNumber: 22, symbol: 'Ti', name: 'Titanium', atomicMass: '47.87', category: 'transition-metal', period: 4, group: 4, gridColumn: 4, gridRow: 4 },
    { atomicNumber: 23, symbol: 'V', name: 'Vanadium', atomicMass: '50.94', category: 'transition-metal', period: 4, group: 5, gridColumn: 5, gridRow: 4 },
    { atomicNumber: 24, symbol: 'Cr', name: 'Chromium', atomicMass: '52.00', category: 'transition-metal', period: 4, group: 6, gridColumn: 6, gridRow: 4 },
    { atomicNumber: 25, symbol: 'Mn', name: 'Manganese', atomicMass: '54.94', category: 'transition-metal', period: 4, group: 7, gridColumn: 7, gridRow: 4 },
    { atomicNumber: 26, symbol: 'Fe', name: 'Iron', atomicMass: '55.85', category: 'transition-metal', period: 4, group: 8, gridColumn: 8, gridRow: 4 },
    { atomicNumber: 27, symbol: 'Co', name: 'Cobalt', atomicMass: '58.93', category: 'transition-metal', period: 4, group: 9, gridColumn: 9, gridRow: 4 },
    { atomicNumber: 28, symbol: 'Ni', name: 'Nickel', atomicMass: '58.69', category: 'transition-metal', period: 4, group: 10, gridColumn: 10, gridRow: 4 },
    { atomicNumber: 29, symbol: 'Cu', name: 'Copper', atomicMass: '63.55', category: 'transition-metal', period: 4, group: 11, gridColumn: 11, gridRow: 4 },
    { atomicNumber: 30, symbol: 'Zn', name: 'Zinc', atomicMass: '65.38', category: 'transition-metal', period: 4, group: 12, gridColumn: 12, gridRow: 4 },
    { atomicNumber: 31, symbol: 'Ga', name: 'Gallium', atomicMass: '69.72', category: 'post-transition', period: 4, group: 13, gridColumn: 13, gridRow: 4 },
    { atomicNumber: 32, symbol: 'Ge', name: 'Germanium', atomicMass: '72.63', category: 'metalloid', period: 4, group: 14, gridColumn: 14, gridRow: 4 },
    { atomicNumber: 33, symbol: 'As', name: 'Arsenic', atomicMass: '74.92', category: 'metalloid', period: 4, group: 15, gridColumn: 15, gridRow: 4 },
    { atomicNumber: 34, symbol: 'Se', name: 'Selenium', atomicMass: '78.97', category: 'nonmetal', period: 4, group: 16, gridColumn: 16, gridRow: 4 },
    { atomicNumber: 35, symbol: 'Br', name: 'Bromine', atomicMass: '79.90', category: 'halogen', period: 4, group: 17, gridColumn: 17, gridRow: 4 },
    { atomicNumber: 36, symbol: 'Kr', name: 'Krypton', atomicMass: '83.80', category: 'noble-gas', period: 4, group: 18, gridColumn: 18, gridRow: 4 },

    // Period 5
    { atomicNumber: 37, symbol: 'Rb', name: 'Rubidium', atomicMass: '85.47', category: 'alkali-metal', period: 5, group: 1, gridColumn: 1, gridRow: 5 },
    { atomicNumber: 38, symbol: 'Sr', name: 'Strontium', atomicMass: '87.62', category: 'alkaline-earth', period: 5, group: 2, gridColumn: 2, gridRow: 5 },
    { atomicNumber: 39, symbol: 'Y', name: 'Yttrium', atomicMass: '88.91', category: 'transition-metal', period: 5, group: 3, gridColumn: 3, gridRow: 5 },
    { atomicNumber: 40, symbol: 'Zr', name: 'Zirconium', atomicMass: '91.22', category: 'transition-metal', period: 5, group: 4, gridColumn: 4, gridRow: 5 },
    { atomicNumber: 41, symbol: 'Nb', name: 'Niobium', atomicMass: '92.91', category: 'transition-metal', period: 5, group: 5, gridColumn: 5, gridRow: 5 },
    { atomicNumber: 42, symbol: 'Mo', name: 'Molybdenum', atomicMass: '95.95', category: 'transition-metal', period: 5, group: 6, gridColumn: 6, gridRow: 5 },
    { atomicNumber: 43, symbol: 'Tc', name: 'Technetium', atomicMass: '[98]', category: 'transition-metal', period: 5, group: 7, gridColumn: 7, gridRow: 5 },
    { atomicNumber: 44, symbol: 'Ru', name: 'Ruthenium', atomicMass: '101.1', category: 'transition-metal', period: 5, group: 8, gridColumn: 8, gridRow: 5 },
    { atomicNumber: 45, symbol: 'Rh', name: 'Rhodium', atomicMass: '102.9', category: 'transition-metal', period: 5, group: 9, gridColumn: 9, gridRow: 5 },
    { atomicNumber: 46, symbol: 'Pd', name: 'Palladium', atomicMass: '106.4', category: 'transition-metal', period: 5, group: 10, gridColumn: 10, gridRow: 5 },
    { atomicNumber: 47, symbol: 'Ag', name: 'Silver', atomicMass: '107.9', category: 'transition-metal', period: 5, group: 11, gridColumn: 11, gridRow: 5 },
    { atomicNumber: 48, symbol: 'Cd', name: 'Cadmium', atomicMass: '112.4', category: 'transition-metal', period: 5, group: 12, gridColumn: 12, gridRow: 5 },
    { atomicNumber: 49, symbol: 'In', name: 'Indium', atomicMass: '114.8', category: 'post-transition', period: 5, group: 13, gridColumn: 13, gridRow: 5 },
    { atomicNumber: 50, symbol: 'Sn', name: 'Tin', atomicMass: '118.7', category: 'post-transition', period: 5, group: 14, gridColumn: 14, gridRow: 5 },
    { atomicNumber: 51, symbol: 'Sb', name: 'Antimony', atomicMass: '121.8', category: 'metalloid', period: 5, group: 15, gridColumn: 15, gridRow: 5 },
    { atomicNumber: 52, symbol: 'Te', name: 'Tellurium', atomicMass: '127.6', category: 'metalloid', period: 5, group: 16, gridColumn: 16, gridRow: 5 },
    { atomicNumber: 53, symbol: 'I', name: 'Iodine', atomicMass: '126.9', category: 'halogen', period: 5, group: 17, gridColumn: 17, gridRow: 5 },
    { atomicNumber: 54, symbol: 'Xe', name: 'Xenon', atomicMass: '131.3', category: 'noble-gas', period: 5, group: 18, gridColumn: 18, gridRow: 5 },

    // Period 6
    { atomicNumber: 55, symbol: 'Cs', name: 'Caesium', atomicMass: '132.9', category: 'alkali-metal', period: 6, group: 1, gridColumn: 1, gridRow: 6 },
    { atomicNumber: 56, symbol: 'Ba', name: 'Barium', atomicMass: '137.3', category: 'alkaline-earth', period: 6, group: 2, gridColumn: 2, gridRow: 6 },
    // La–Lu → lanthanide row (gridRow 9)
    { atomicNumber: 72, symbol: 'Hf', name: 'Hafnium', atomicMass: '178.5', category: 'transition-metal', period: 6, group: 4, gridColumn: 4, gridRow: 6 },
    { atomicNumber: 73, symbol: 'Ta', name: 'Tantalum', atomicMass: '180.9', category: 'transition-metal', period: 6, group: 5, gridColumn: 5, gridRow: 6 },
    { atomicNumber: 74, symbol: 'W', name: 'Tungsten', atomicMass: '183.8', category: 'transition-metal', period: 6, group: 6, gridColumn: 6, gridRow: 6 },
    { atomicNumber: 75, symbol: 'Re', name: 'Rhenium', atomicMass: '186.2', category: 'transition-metal', period: 6, group: 7, gridColumn: 7, gridRow: 6 },
    { atomicNumber: 76, symbol: 'Os', name: 'Osmium', atomicMass: '190.2', category: 'transition-metal', period: 6, group: 8, gridColumn: 8, gridRow: 6 },
    { atomicNumber: 77, symbol: 'Ir', name: 'Iridium', atomicMass: '192.2', category: 'transition-metal', period: 6, group: 9, gridColumn: 9, gridRow: 6 },
    { atomicNumber: 78, symbol: 'Pt', name: 'Platinum', atomicMass: '195.1', category: 'transition-metal', period: 6, group: 10, gridColumn: 10, gridRow: 6 },
    { atomicNumber: 79, symbol: 'Au', name: 'Gold', atomicMass: '197.0', category: 'transition-metal', period: 6, group: 11, gridColumn: 11, gridRow: 6 },
    { atomicNumber: 80, symbol: 'Hg', name: 'Mercury', atomicMass: '200.6', category: 'transition-metal', period: 6, group: 12, gridColumn: 12, gridRow: 6 },
    { atomicNumber: 81, symbol: 'Tl', name: 'Thallium', atomicMass: '204.4', category: 'post-transition', period: 6, group: 13, gridColumn: 13, gridRow: 6 },
    { atomicNumber: 82, symbol: 'Pb', name: 'Lead', atomicMass: '207.2', category: 'post-transition', period: 6, group: 14, gridColumn: 14, gridRow: 6 },
    { atomicNumber: 83, symbol: 'Bi', name: 'Bismuth', atomicMass: '209.0', category: 'post-transition', period: 6, group: 15, gridColumn: 15, gridRow: 6 },
    { atomicNumber: 84, symbol: 'Po', name: 'Polonium', atomicMass: '[209]', category: 'post-transition', period: 6, group: 16, gridColumn: 16, gridRow: 6 },
    { atomicNumber: 85, symbol: 'At', name: 'Astatine', atomicMass: '[210]', category: 'halogen', period: 6, group: 17, gridColumn: 17, gridRow: 6 },
    { atomicNumber: 86, symbol: 'Rn', name: 'Radon', atomicMass: '[222]', category: 'noble-gas', period: 6, group: 18, gridColumn: 18, gridRow: 6 },

    // Period 7
    { atomicNumber: 87, symbol: 'Fr', name: 'Francium', atomicMass: '[223]', category: 'alkali-metal', period: 7, group: 1, gridColumn: 1, gridRow: 7 },
    { atomicNumber: 88, symbol: 'Ra', name: 'Radium', atomicMass: '[226]', category: 'alkaline-earth', period: 7, group: 2, gridColumn: 2, gridRow: 7 },
    // Ac–Lr → actinide row (gridRow 10)
    { atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordium', atomicMass: '[267]', category: 'transition-metal', period: 7, group: 4, gridColumn: 4, gridRow: 7 },
    { atomicNumber: 105, symbol: 'Db', name: 'Dubnium', atomicMass: '[268]', category: 'transition-metal', period: 7, group: 5, gridColumn: 5, gridRow: 7 },
    { atomicNumber: 106, symbol: 'Sg', name: 'Seaborgium', atomicMass: '[269]', category: 'transition-metal', period: 7, group: 6, gridColumn: 6, gridRow: 7 },
    { atomicNumber: 107, symbol: 'Bh', name: 'Bohrium', atomicMass: '[270]', category: 'transition-metal', period: 7, group: 7, gridColumn: 7, gridRow: 7 },
    { atomicNumber: 108, symbol: 'Hs', name: 'Hassium', atomicMass: '[277]', category: 'transition-metal', period: 7, group: 8, gridColumn: 8, gridRow: 7 },
    { atomicNumber: 109, symbol: 'Mt', name: 'Meitnerium', atomicMass: '[278]', category: 'transition-metal', period: 7, group: 9, gridColumn: 9, gridRow: 7 },
    { atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtium', atomicMass: '[281]', category: 'transition-metal', period: 7, group: 10, gridColumn: 10, gridRow: 7 },
    { atomicNumber: 111, symbol: 'Rg', name: 'Roentgenium', atomicMass: '[282]', category: 'transition-metal', period: 7, group: 11, gridColumn: 11, gridRow: 7 },
    { atomicNumber: 112, symbol: 'Cn', name: 'Copernicium', atomicMass: '[285]', category: 'transition-metal', period: 7, group: 12, gridColumn: 12, gridRow: 7 },
    { atomicNumber: 113, symbol: 'Nh', name: 'Nihonium', atomicMass: '[286]', category: 'post-transition', period: 7, group: 13, gridColumn: 13, gridRow: 7 },
    { atomicNumber: 114, symbol: 'Fl', name: 'Flerovium', atomicMass: '[289]', category: 'post-transition', period: 7, group: 14, gridColumn: 14, gridRow: 7 },
    { atomicNumber: 115, symbol: 'Mc', name: 'Moscovium', atomicMass: '[290]', category: 'post-transition', period: 7, group: 15, gridColumn: 15, gridRow: 7 },
    { atomicNumber: 116, symbol: 'Lv', name: 'Livermorium', atomicMass: '[293]', category: 'post-transition', period: 7, group: 16, gridColumn: 16, gridRow: 7 },
    { atomicNumber: 117, symbol: 'Ts', name: 'Tennessine', atomicMass: '[294]', category: 'halogen', period: 7, group: 17, gridColumn: 17, gridRow: 7 },
    { atomicNumber: 118, symbol: 'Og', name: 'Oganesson', atomicMass: '[294]', category: 'noble-gas', period: 7, group: 18, gridColumn: 18, gridRow: 7 },

    // Lanthanides — gridRow 9 (row 8 is spacer)
    { atomicNumber: 57, symbol: 'La', name: 'Lanthanum', atomicMass: '138.9', category: 'lanthanide', period: 6, group: 3, gridColumn: 4, gridRow: 9 },
    { atomicNumber: 58, symbol: 'Ce', name: 'Cerium', atomicMass: '140.1', category: 'lanthanide', period: 6, group: 3, gridColumn: 5, gridRow: 9 },
    { atomicNumber: 59, symbol: 'Pr', name: 'Praseodymium', atomicMass: '140.9', category: 'lanthanide', period: 6, group: 3, gridColumn: 6, gridRow: 9 },
    { atomicNumber: 60, symbol: 'Nd', name: 'Neodymium', atomicMass: '144.2', category: 'lanthanide', period: 6, group: 3, gridColumn: 7, gridRow: 9 },
    { atomicNumber: 61, symbol: 'Pm', name: 'Promethium', atomicMass: '[145]', category: 'lanthanide', period: 6, group: 3, gridColumn: 8, gridRow: 9 },
    { atomicNumber: 62, symbol: 'Sm', name: 'Samarium', atomicMass: '150.4', category: 'lanthanide', period: 6, group: 3, gridColumn: 9, gridRow: 9 },
    { atomicNumber: 63, symbol: 'Eu', name: 'Europium', atomicMass: '152.0', category: 'lanthanide', period: 6, group: 3, gridColumn: 10, gridRow: 9 },
    { atomicNumber: 64, symbol: 'Gd', name: 'Gadolinium', atomicMass: '157.3', category: 'lanthanide', period: 6, group: 3, gridColumn: 11, gridRow: 9 },
    { atomicNumber: 65, symbol: 'Tb', name: 'Terbium', atomicMass: '158.9', category: 'lanthanide', period: 6, group: 3, gridColumn: 12, gridRow: 9 },
    { atomicNumber: 66, symbol: 'Dy', name: 'Dysprosium', atomicMass: '162.5', category: 'lanthanide', period: 6, group: 3, gridColumn: 13, gridRow: 9 },
    { atomicNumber: 67, symbol: 'Ho', name: 'Holmium', atomicMass: '164.9', category: 'lanthanide', period: 6, group: 3, gridColumn: 14, gridRow: 9 },
    { atomicNumber: 68, symbol: 'Er', name: 'Erbium', atomicMass: '167.3', category: 'lanthanide', period: 6, group: 3, gridColumn: 15, gridRow: 9 },
    { atomicNumber: 69, symbol: 'Tm', name: 'Thulium', atomicMass: '168.9', category: 'lanthanide', period: 6, group: 3, gridColumn: 16, gridRow: 9 },
    { atomicNumber: 70, symbol: 'Yb', name: 'Ytterbium', atomicMass: '173.0', category: 'lanthanide', period: 6, group: 3, gridColumn: 17, gridRow: 9 },
    { atomicNumber: 71, symbol: 'Lu', name: 'Lutetium', atomicMass: '175.0', category: 'lanthanide', period: 6, group: 3, gridColumn: 18, gridRow: 9 },

    // Actinides — gridRow 10
    { atomicNumber: 89, symbol: 'Ac', name: 'Actinium', atomicMass: '[227]', category: 'actinide', period: 7, group: 3, gridColumn: 4, gridRow: 10 },
    { atomicNumber: 90, symbol: 'Th', name: 'Thorium', atomicMass: '232.0', category: 'actinide', period: 7, group: 3, gridColumn: 5, gridRow: 10 },
    { atomicNumber: 91, symbol: 'Pa', name: 'Protactinium', atomicMass: '231.0', category: 'actinide', period: 7, group: 3, gridColumn: 6, gridRow: 10 },
    { atomicNumber: 92, symbol: 'U', name: 'Uranium', atomicMass: '238.0', category: 'actinide', period: 7, group: 3, gridColumn: 7, gridRow: 10 },
    { atomicNumber: 93, symbol: 'Np', name: 'Neptunium', atomicMass: '[237]', category: 'actinide', period: 7, group: 3, gridColumn: 8, gridRow: 10 },
    { atomicNumber: 94, symbol: 'Pu', name: 'Plutonium', atomicMass: '[244]', category: 'actinide', period: 7, group: 3, gridColumn: 9, gridRow: 10 },
    { atomicNumber: 95, symbol: 'Am', name: 'Americium', atomicMass: '[243]', category: 'actinide', period: 7, group: 3, gridColumn: 10, gridRow: 10 },
    { atomicNumber: 96, symbol: 'Cm', name: 'Curium', atomicMass: '[247]', category: 'actinide', period: 7, group: 3, gridColumn: 11, gridRow: 10 },
    { atomicNumber: 97, symbol: 'Bk', name: 'Berkelium', atomicMass: '[247]', category: 'actinide', period: 7, group: 3, gridColumn: 12, gridRow: 10 },
    { atomicNumber: 98, symbol: 'Cf', name: 'Californium', atomicMass: '[251]', category: 'actinide', period: 7, group: 3, gridColumn: 13, gridRow: 10 },
    { atomicNumber: 99, symbol: 'Es', name: 'Einsteinium', atomicMass: '[252]', category: 'actinide', period: 7, group: 3, gridColumn: 14, gridRow: 10 },
    { atomicNumber: 100, symbol: 'Fm', name: 'Fermium', atomicMass: '[257]', category: 'actinide', period: 7, group: 3, gridColumn: 15, gridRow: 10 },
    { atomicNumber: 101, symbol: 'Md', name: 'Mendelevium', atomicMass: '[258]', category: 'actinide', period: 7, group: 3, gridColumn: 16, gridRow: 10 },
    { atomicNumber: 102, symbol: 'No', name: 'Nobelium', atomicMass: '[259]', category: 'actinide', period: 7, group: 3, gridColumn: 17, gridRow: 10 },
    { atomicNumber: 103, symbol: 'Lr', name: 'Lawrencium', atomicMass: '[266]', category: 'actinide', period: 7, group: 3, gridColumn: 18, gridRow: 10 }
];

// Category display names & colors
const CATEGORIES = {
    'alkali-metal': { label: 'Alkali Metals', color: '#fff5f5' },
    'alkaline-earth': { label: 'Alkaline Earth Metals', color: '#fff8f0' },
    'transition-metal': { label: 'Transition Metals', color: '#f8f8ff' },
    'post-transition': { label: 'Post-transition Metals', color: '#f5fff5' },
    'metalloid': { label: 'Metalloids', color: '#fffff0' },
    'nonmetal': { label: 'Nonmetals', color: '#f0f8ff' },
    'halogen': { label: 'Halogens', color: '#fdf0ff' },
    'noble-gas': { label: 'Noble Gases', color: '#f0f0ff' },
    'lanthanide': { label: 'Lanthanides', color: '#fff0f8' },
    'actinide': { label: 'Actinides', color: '#fff0f0' }
};
