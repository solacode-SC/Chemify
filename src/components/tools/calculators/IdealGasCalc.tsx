import React, { useState, useEffect } from 'react';
import { solveIdealGas } from '../../../utils/chemistryCalculations';
import { useLanguage } from '../../../i18n/LanguageContext';

interface IdealGasCalcProps {
  initialSolveFor?: 'P' | 'V' | 'n' | 'T';
  initialP?: number;
  initialV?: number;
  initialN?: number;
  initialT?: number;
}

export const IdealGasCalc: React.FC<IdealGasCalcProps> = ({
  initialSolveFor = 'P',
  initialP = 1.0,
  initialV = 22.414,
  initialN = 1.0,
  initialT = 273.15
}) => {
  const { language } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;

  const [solveFor, setSolveFor] = useState<'P' | 'V' | 'n' | 'T'>(initialSolveFor);

  // Working values in base units: atm, L, mol, K
  const [pVal, setPVal] = useState<number>(initialP);
  const [pUnit, setPUnit] = useState<'atm' | 'kPa' | 'bar'>('atm');

  const [vVal, setVVal] = useState<number>(initialV);
  const [vUnit, setVUnit] = useState<'L' | 'mL'>('L');

  const [nVal, setNVal] = useState<number>(initialN);
  const [tVal, setTVal] = useState<number>(initialT);
  const [tUnit, setTUnit] = useState<'K' | 'C'>('K');

  useEffect(() => {
    if (initialSolveFor) setSolveFor(initialSolveFor);
    if (initialP !== undefined) setPVal(initialP);
    if (initialV !== undefined) setVVal(initialV);
    if (initialN !== undefined) setNVal(initialN);
    if (initialT !== undefined) setTVal(initialT);
  }, [initialSolveFor, initialP, initialV, initialN, initialT]);

  // Convert inputs to base units
  const pAtm = pUnit === 'atm' ? pVal : pUnit === 'kPa' ? pVal / 101.325 : pVal / 1.01325;
  const vL = vUnit === 'L' ? vVal : vVal / 1000;
  const tK = tUnit === 'K' ? tVal : tVal + 273.15;
  const nMol = nVal;

  const resultBase = solveIdealGas(solveFor, pAtm, vL, nMol, tK);

  // Convert result back to selected unit
  let displayResult = resultBase;
  let unitLabel = '';

  if (solveFor === 'P') {
    displayResult = pUnit === 'atm' ? resultBase : pUnit === 'kPa' ? resultBase * 101.325 : resultBase * 1.01325;
    unitLabel = pUnit;
  } else if (solveFor === 'V') {
    displayResult = vUnit === 'L' ? resultBase : resultBase * 1000;
    unitLabel = vUnit;
  } else if (solveFor === 'n') {
    displayResult = resultBase;
    unitLabel = l('moles', 'moles', 'مول');
  } else if (solveFor === 'T') {
    displayResult = tUnit === 'K' ? resultBase : resultBase - 273.15;
    unitLabel = `°${tUnit}`;
  }

  const variableOptions = [
    { id: 'P', label: l('Pressure (P)', 'Pression (P)', 'الضغط (P)') },
    { id: 'V', label: l('Volume (V)', 'Volume (V)', 'الحجم (V)') },
    { id: 'n', label: l('Amount of substance (n)', 'Quantité de matière (n)', 'كمية المادة (n)') },
    { id: 'T', label: l('Temperature (T)', 'Température (T)', 'درجة الحرارة (T)') }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Equation display */}
      <div
        style={{
          background: '#DCE0CF',
          border: '1px solid #6F7F63',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          textAlign: 'center',
          color: '#4E5B47',
          fontWeight: 600
        }}
      >
        {l('Ideal Gas Law:', 'Loi des gaz parfaits :', 'قانون الغاز المثالي :')}{' '}
        <strong className="formula-ltr">P · V = n · R · T</strong> (R = 0.08206 L·atm/(mol·K))
      </div>

      {/* Target Variable Selector */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '6px' }}>
          {l('Select variable to solve for:', 'Sélectionner la variable à calculer :', 'اختر المتغير المراد حسابه :')}
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {variableOptions.map(item => (
            <button
              key={item.id}
              onClick={() => setSolveFor(item.id as any)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #6F7F63',
                background: solveFor === item.id ? '#4E5B47' : '#FAF8F5',
                color: solveFor === item.id ? '#FAF8F5' : '#4E5B47',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* Pressure */}
        <div style={{ opacity: solveFor === 'P' ? 0.5 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            {l('Pressure (P)', 'Pression (P)', 'الضغط (P)')}
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              disabled={solveFor === 'P'}
              value={solveFor === 'P' ? displayResult.toFixed(3) : pVal}
              onChange={e => setPVal(parseFloat(e.target.value) || 0)}
              className="math-ltr"
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47'
              }}
            />
            <select
              value={pUnit}
              onChange={e => setPUnit(e.target.value as any)}
              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #6F7F63', background: '#DCE0CF', color: '#4E5B47' }}
            >
              <option value="atm">atm</option>
              <option value="kPa">kPa</option>
              <option value="bar">bar</option>
            </select>
          </div>
        </div>

        {/* Volume */}
        <div style={{ opacity: solveFor === 'V' ? 0.5 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            {l('Volume (V)', 'Volume (V)', 'الحجم (V)')}
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              disabled={solveFor === 'V'}
              value={solveFor === 'V' ? displayResult.toFixed(3) : vVal}
              onChange={e => setVVal(parseFloat(e.target.value) || 0)}
              className="math-ltr"
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47'
              }}
            />
            <select
              value={vUnit}
              onChange={e => setVUnit(e.target.value as any)}
              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #6F7F63', background: '#DCE0CF', color: '#4E5B47' }}
            >
              <option value="L">L</option>
              <option value="mL">mL</option>
            </select>
          </div>
        </div>

        {/* Moles */}
        <div style={{ opacity: solveFor === 'n' ? 0.5 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            {l('Amount of substance (n)', 'Quantité de matière (n)', 'كمية المادة (n)')}
          </label>
          <input
            type="number"
            disabled={solveFor === 'n'}
            value={solveFor === 'n' ? displayResult.toFixed(4) : nVal}
            onChange={e => setNVal(parseFloat(e.target.value) || 0)}
            className="math-ltr"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #6F7F63',
              background: '#FAF8F5',
              color: '#4E5B47',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Temperature */}
        <div style={{ opacity: solveFor === 'T' ? 0.5 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            {l('Temperature (T)', 'Température (T)', 'درجة الحرارة (T)')}
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              disabled={solveFor === 'T'}
              value={solveFor === 'T' ? displayResult.toFixed(2) : tVal}
              onChange={e => setTVal(parseFloat(e.target.value) || 0)}
              className="math-ltr"
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47'
              }}
            />
            <select
              value={tUnit}
              onChange={e => setTUnit(e.target.value as any)}
              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #6F7F63', background: '#DCE0CF', color: '#4E5B47' }}
            >
              <option value="K">K</option>
              <option value="C">°C</option>
            </select>
          </div>
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
          {l(`Calculated value for ${solveFor}`, `Valeur calculée pour ${solveFor}`, `القيمة المحسوبة لـ (${solveFor})`)}
        </span>
        <div style={{ fontFamily: "var(--font-heading, 'Playfair Display', serif)", fontSize: '2.5rem', fontWeight: 700, color: '#4E5B47' }}>
          <span className="math-ltr">{displayResult.toFixed(4)}</span>{' '}
          <span style={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{unitLabel}</span>
        </div>
      </div>
    </div>
  );
};
