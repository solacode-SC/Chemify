import React, { useState, useEffect } from 'react';
import { calculateGibbs } from '../../../utils/chemistryCalculations';
import { useLanguage } from '../../../i18n/LanguageContext';

interface GibbsCalcProps {
  initialDeltaH?: number;
  initialDeltaS?: number;
  initialTemp?: number;
}

export const GibbsCalc: React.FC<GibbsCalcProps> = ({
  initialDeltaH = -92.4,
  initialDeltaS = -198.2,
  initialTemp = 298.15
}) => {
  const { language } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;

  const [deltaH, setDeltaH] = useState<number>(initialDeltaH); // kJ/mol
  const [temp, setTemp] = useState<number>(initialTemp); // K
  const [tempUnit, setTempUnit] = useState<'K' | 'C'>('K');
  const [deltaS, setDeltaS] = useState<number>(initialDeltaS); // J/(mol·K)

  useEffect(() => {
    if (initialDeltaH !== undefined) setDeltaH(initialDeltaH);
    if (initialDeltaS !== undefined) setDeltaS(initialDeltaS);
    if (initialTemp !== undefined) setTemp(initialTemp);
  }, [initialDeltaH, initialDeltaS, initialTemp]);

  const tempK = tempUnit === 'C' ? temp + 273.15 : temp;
  const result = calculateGibbs(deltaH, deltaS, tempK);

  const presets = [
    { name: l('Haber Process (N₂ + 3H₂)', 'Procédé Haber (N₂ + 3H₂)', 'عملية هابر (N₂ + 3H₂)'), dH: -92.4, dS: -198.2, t: 298.15 },
    { name: l('Water Vaporization', "Vaporisation de l'eau", 'تبخر الماء'), dH: 44.0, dS: 118.8, t: 373.15 },
    { name: l('Reverse Photosynthesis (Respiration)', 'Photosynthèse inverse', 'التركيب الضوئي العكسي'), dH: -2803, dS: -259, t: 298.15 },
    { name: l('Limestone Decomposition', 'Décomposition du calcaire', 'تفكك كربونات الكالسيوم'), dH: 178.0, dS: 161.0, t: 298.15 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Formula reminder */}
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
        {l('Fundamental thermodynamic relation:', 'Relation thermodynamique fondamentale :', 'العلاقة الديناميكية الحرارية الأساسية :')}{' '}
        <strong className="formula-ltr">ΔG = ΔH − T·ΔS</strong>
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            {l('Enthalpy Change (ΔH)', "Variation d'enthalpie (ΔH)", 'التغير في الإنثالبي (ΔH)')}
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={deltaH}
              onChange={e => setDeltaH(parseFloat(e.target.value) || 0)}
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
              step="1"
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>
            {l('in kJ/mol (negative = exothermic)', 'en kJ/mol (négatif = exothermique)', 'بوحدة كيلوجول/مول (سالب = طارد للحرارة)')}
          </span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            {l('Temperature (T)', 'Température (T)', 'درجة الحرارة (T)')}
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              value={temp}
              onChange={e => setTemp(parseFloat(e.target.value) || 0)}
              className="math-ltr"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47',
                boxSizing: 'border-box'
              }}
              step="1"
            />
            <button
              onClick={() => {
                if (tempUnit === 'K') {
                  setTempUnit('C');
                  setTemp(parseFloat((temp - 273.15).toFixed(2)));
                } else {
                  setTempUnit('K');
                  setTemp(parseFloat((temp + 273.15).toFixed(2)));
                }
              }}
              style={{
                background: '#DCE0CF',
                border: '1px solid #6F7F63',
                borderRadius: '6px',
                padding: '0 12px',
                cursor: 'pointer',
                color: '#4E5B47',
                fontWeight: 700
              }}
            >
              °{tempUnit}
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>
            {l('Effective T:', 'T effective :', 'درجة الحرارة الفعلية :')}{' '}
            <span className="formula-ltr">{tempK.toFixed(2)} K</span>
          </span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            {l('Entropy Change (ΔS)', "Variation d'entropie (ΔS)", 'التغير في الإنتروبيا (ΔS)')}
          </label>
          <input
            type="number"
            value={deltaS}
            onChange={e => setDeltaS(parseFloat(e.target.value) || 0)}
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
            step="1"
          />
          <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>
            {l('in J/(mol·K)', 'en J/(mol·K)', 'بوحدة جول/(مول·كلفن)')}
          </span>
        </div>
      </div>

      {/* Result Display */}
      <div
        style={{
          background: result.isSpontaneous ? '#edf7ee' : '#fceced',
          border: `1.5px solid ${result.isSpontaneous ? '#8fc398' : '#cf7b81'}`,
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: result.isSpontaneous ? '#166534' : '#991b1b'
          }}
        >
          {result.isSpontaneous
            ? l('✓ Thermodynamically Spontaneous', '✓ Thermodynamiquement spontané', '✓ تفاعل تلقائي ديناميكياً حرارياً')
            : l('✗ Non-spontaneous (Endergonic)', '✗ Non spontané (endergonique)', '✗ غير تلقائي (ماص للطاقة / غير مواتٍ)')}
        </span>
        <div
          style={{
            fontFamily: "var(--font-heading, 'Playfair Display', serif)",
            fontSize: '2.5rem',
            fontWeight: 700,
            color: result.isSpontaneous ? '#166534' : '#991b1b',
            margin: '0.4rem 0'
          }}
        >
          <span className="formula-ltr">
            ΔG = {result.deltaG > 0 ? `+${result.deltaG}` : result.deltaG}{' '}
            <span style={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>kJ/mol</span>
          </span>
        </div>
        <p style={{ color: '#4E5B47', fontSize: '0.9rem', margin: 0 }}>
          {result.isSpontaneous
            ? l('The reaction proceeds spontaneously at the specified temperature because ΔG is negative.', 'La réaction se produit spontanément à la température donnée car ΔG est négatif.', 'ينطلق التفاعل تلقائياً عند درجة الحرارة المعطاة نظراً لكون ΔG سالبة.')
            : l('The forward reaction is non-spontaneous at the current temperature because ΔG is positive.', 'La réaction directe est non spontanée à la température actuelle car ΔG est positif.', 'التفاعل غير تلقائي في الاتجاه الأمامي عند درجة الحرارة الحالية نظراً لكون ΔG موجبة.')}
        </p>
        {result.equilibriumTempKelvin && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#5F6F5B' }}>
            {l('Equilibrium / Inversion Temperature (Teq):', "Température d'équilibre / d'inversion (Teq) :", 'درجة حرارة التوازن والانعكاس (Teq) :')}{' '}
            <strong className="formula-ltr">
              {result.equilibriumTempKelvin} K ({(result.equilibriumTempKelvin - 273.15).toFixed(1)} °C)
            </strong>
          </div>
        )}
      </div>

      {/* Presets */}
      <div>
        <span style={{ fontSize: '0.78rem', color: '#5F6F5B', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
          {l('Load standard reference systems:', 'Charger des systèmes de référence :', 'تحميل أنظمة مرجعية نمطية :')}
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => {
                setDeltaH(p.dH);
                setDeltaS(p.dS);
                setTemp(p.t);
                setTempUnit('K');
              }}
              style={{
                background: '#DCE0CF',
                border: '1px solid #6F7F63',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.78rem',
                color: '#4E5B47',
                cursor: 'pointer'
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
