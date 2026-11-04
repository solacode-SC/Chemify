import React, { useState, useEffect } from 'react';
import { calculateDilution, calculateMolarity } from '../../../utils/chemistryCalculations';
import { calculateMolarMass } from '../../../utils/formulaParser';
import { useLanguage } from '../../../i18n/LanguageContext';

interface MolarityCalcProps {
  initialTab?: 'molarity' | 'dilution';
  initialFormula?: string;
  initialMass?: number;
  initialVolume?: number;
  initialM1?: number;
  initialV1?: number;
  initialM2?: number;
  initialV2?: number;
  initialSolveFor?: 'M1' | 'V1' | 'M2' | 'V2';
}

export const MolarityCalc: React.FC<MolarityCalcProps> = ({
  initialTab = 'molarity',
  initialFormula = 'NaCl',
  initialMass = 5.84,
  initialVolume = 0.5,
  initialM1 = 2.0,
  initialV1 = 50,
  initialM2 = 0.5,
  initialV2 = 200,
  initialSolveFor = 'V2'
}) => {
  const { language } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;

  const [tab, setTab] = useState<'molarity' | 'dilution'>(initialTab);

  // Molarity state
  const [formula, setFormula] = useState(initialFormula);
  const [mass, setMass] = useState<number>(initialMass);
  const [volume, setVolume] = useState<number>(initialVolume); // Liters

  // Dilution state: M1*V1 = M2*V2
  const [m1, setM1] = useState<number>(initialM1);
  const [v1, setV1] = useState<number>(initialV1); // mL
  const [m2, setM2] = useState<number>(initialM2);
  const [v2, setV2] = useState<number>(initialV2); // mL
  const [solveFor, setSolveFor] = useState<'M1' | 'V1' | 'M2' | 'V2'>(initialSolveFor);

  useEffect(() => {
    if (initialTab) setTab(initialTab);
    if (initialFormula) setFormula(initialFormula);
    if (initialMass !== undefined) setMass(initialMass);
    if (initialVolume !== undefined) setVolume(initialVolume);
    if (initialM1 !== undefined) setM1(initialM1);
    if (initialV1 !== undefined) setV1(initialV1);
    if (initialM2 !== undefined) setM2(initialM2);
    if (initialV2 !== undefined) setV2(initialV2);
    if (initialSolveFor) setSolveFor(initialSolveFor);
  }, [initialTab, initialFormula, initialMass, initialVolume, initialM1, initialV1, initialM2, initialV2, initialSolveFor]);

  const mw = calculateMolarMass(formula) || 58.44;
  const molarityResult = calculateMolarity(mass, mw, volume);
  const dilutionResult = calculateDilution(m1, v1, m2, v2, solveFor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', background: '#DCE0CF', padding: '4px', borderRadius: '10px' }}>
        <button
          onClick={() => setTab('molarity')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '8px',
            background: tab === 'molarity' ? '#4E5B47' : 'transparent',
            color: tab === 'molarity' ? '#FAF8F5' : '#4E5B47',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {l('1. Molarity from Mass', '1. Molarité à partir de la masse', '١. المولارية من الكتلة')}
        </button>
        <button
          onClick={() => setTab('dilution')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '8px',
            background: tab === 'dilution' ? '#4E5B47' : 'transparent',
            color: tab === 'dilution' ? '#FAF8F5' : '#4E5B47',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          {l('2. Dilution (M₁V₁ = M₂V₂)', '2. Dilution (M₁V₁ = M₂V₂)', '٢. التخفيف (M₁V₁ = M₂V₂)')}
        </button>
      </div>

      {tab === 'molarity' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
                {l('Solute Formula', 'Formule du soluté', 'صيغة المذاب')}
              </label>
              <input
                type="text"
                value={formula}
                onChange={e => setFormula(e.target.value)}
                className="formula-ltr"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>
                {l('Molar mass: ', 'Masse molaire : ', 'الكتلة المولية : ')} <span className="formula-ltr">{mw.toFixed(2)} g/mol</span>
              </span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
                {l('Solute Mass (g)', 'Masse du soluté (g)', 'كتلة المذاب (غ)')}
              </label>
              <input
                type="number"
                value={mass}
                onChange={e => setMass(parseFloat(e.target.value) || 0)}
                className="math-ltr"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  boxSizing: 'border-box'
                }}
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
                {l('Solution Volume (L)', 'Volume de la solution (L)', 'حجم المحلول (لتر)')}
              </label>
              <input
                type="number"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value) || 0)}
                className="math-ltr"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  boxSizing: 'border-box'
                }}
                min="0.01"
                step="0.1"
              />
            </div>
          </div>

          {/* Result Card */}
          <div
            style={{
              background: '#DCE0CF',
              border: '1.5px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>
              {l('Solution Concentration', 'Concentration de la solution', 'تركيز المحلول')}
            </span>
            <div style={{ fontFamily: "var(--font-heading, 'Playfair Display', serif)", fontSize: '2.5rem', fontWeight: 700, color: '#4E5B47' }}>
              <span className="math-ltr">{molarityResult.toFixed(4)}</span>{' '}
              <span style={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>M (mol/L)</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#5F6F5B', marginTop: '4px' }}>
              {l(
                `${(mass / mw).toFixed(4)} mol of solute in ${volume} L of solution.`,
                `${(mass / mw).toFixed(4)} mol de soluté dans ${volume} L de solution.`,
                `${(mass / mw).toFixed(4)} مول من المذاب في ${volume} لتر من المحلول.`
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
              {l('Solve for:', 'Calculer pour :', 'المجهول المطلوب :')}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['M1', 'V1', 'M2', 'V2'] as const).map(variable => (
                <button
                  key={variable}
                  onClick={() => setSolveFor(variable)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #6F7F63',
                    background: solveFor === variable ? '#4E5B47' : '#FAF8F5',
                    color: solveFor === variable ? '#FAF8F5' : '#4E5B47',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span className="formula-ltr">{variable}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#5F6F5B', fontWeight: 600 }}>
                {l('Initial Molarity (M₁)', 'Molarité initiale (M₁)', 'المولارية الابتدائية (M₁)')}
              </label>
              <input
                type="number"
                disabled={solveFor === 'M1'}
                value={solveFor === 'M1' ? dilutionResult.toFixed(3) : m1}
                onChange={e => setM1(parseFloat(e.target.value) || 0)}
                className="math-ltr"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: solveFor === 'M1' ? '#DCE0CF' : '#FAF8F5',
                  color: '#4E5B47',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#5F6F5B', fontWeight: 600 }}>
                {l('Initial Volume (V₁)', 'Volume initial (V₁)', 'الحجم الابتدائي (V₁)')}
              </label>
              <input
                type="number"
                disabled={solveFor === 'V1'}
                value={solveFor === 'V1' ? dilutionResult.toFixed(2) : v1}
                onChange={e => setV1(parseFloat(e.target.value) || 0)}
                className="math-ltr"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: solveFor === 'V1' ? '#DCE0CF' : '#FAF8F5',
                  color: '#4E5B47',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#5F6F5B', fontWeight: 600 }}>
                {l('Target Molarity (M₂)', 'Molarité cible (M₂)', 'المولارية المستهدفة (M₂)')}
              </label>
              <input
                type="number"
                disabled={solveFor === 'M2'}
                value={solveFor === 'M2' ? dilutionResult.toFixed(3) : m2}
                onChange={e => setM2(parseFloat(e.target.value) || 0)}
                className="math-ltr"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: solveFor === 'M2' ? '#DCE0CF' : '#FAF8F5',
                  color: '#4E5B47',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#5F6F5B', fontWeight: 600 }}>
                {l('Target Volume (V₂)', 'Volume cible (V₂)', 'الحجم المستهدف (V₂)')}
              </label>
              <input
                type="number"
                disabled={solveFor === 'V2'}
                value={solveFor === 'V2' ? dilutionResult.toFixed(2) : v2}
                onChange={e => setV2(parseFloat(e.target.value) || 0)}
                className="math-ltr"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: solveFor === 'V2' ? '#DCE0CF' : '#FAF8F5',
                  color: '#4E5B47',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: '#DCE0CF',
              border: '1.5px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>
              {l(`Calculated Value (${solveFor})`, `Valeur calculée (${solveFor})`, `القيمة المحسوبة (${solveFor})`)}
            </span>
            <div style={{ fontFamily: "var(--font-heading, 'Playfair Display', serif)", fontSize: '2.2rem', fontWeight: 700, color: '#4E5B47' }}>
              <span className="math-ltr">{dilutionResult.toFixed(3)}</span>{' '}
              <span style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}>
                {solveFor.startsWith('M') ? 'M' : l('volume units', 'unités de volume', 'وحدات حجم')}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
