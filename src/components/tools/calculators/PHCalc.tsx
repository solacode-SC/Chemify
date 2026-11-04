import React, { useState, useEffect } from 'react';
import { calculatePHFromAny } from '../../../utils/chemistryCalculations';
import { useLanguage } from '../../../i18n/LanguageContext';

interface PHCalcProps {
  initialMode?: 'pH' | 'pOH' | 'H' | 'OH';
  initialVal?: number;
}

export const PHCalc: React.FC<PHCalcProps> = ({ initialMode = 'pH', initialVal = 7.0 }) => {
  const { language } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;
  const [val, setVal] = useState<number>(initialVal);
  const [mode, setMode] = useState<'pH' | 'pOH' | 'H' | 'OH'>(initialMode);

  useEffect(() => {
    if (initialMode) setMode(initialMode);
    if (initialVal !== undefined) setVal(initialVal);
  }, [initialMode, initialVal]);

  const result = calculatePHFromAny(mode, val) || {
    pH: 7.0,
    pOH: 7.0,
    hConcentration: 1e-7,
    ohConcentration: 1e-7,
    classification: 'Neutral' as const,
    benchmark: 'Pure Water (pH 7.0)'
  };

  const benchmarks = [
    { name: l('Battery Acid', 'Acide de batterie', 'حمض البطارية'), ph: 0.5 },
    { name: l('Lemon Juice', 'Jus de citron', 'عصير الليمون'), ph: 2.3 },
    { name: l('Black Coffee', 'Café noir', 'قهوة سوداء'), ph: 5.0 },
    { name: l('Pure Water', 'Eau pure', 'ماء نقي'), ph: 7.0 },
    { name: l('Baking Soda', 'Bicarbonate de soude', 'بيكربونات الصوديوم'), ph: 8.4 },
    { name: l('Household Ammonia', 'Ammoniaque', 'أمونيا'), ph: 11.5 },
    { name: l('Bleach', 'Eau de Javel', 'مبيض (كلور)'), ph: 13.0 }
  ];

  const getClassificationLabel = (cls: string) => {
    if (cls === 'Strongly Acidic') return l('Strongly Acidic', 'Fortement Acide', 'حمضي قوي');
    if (cls === 'Weakly Acidic') return l('Weakly Acidic', 'Faiblement Acide', 'حمضي ضعيف');
    if (cls === 'Neutral') return l('Neutral', 'Neutre', 'متعادل');
    if (cls === 'Weakly Basic') return l('Weakly Basic', 'Faiblement Basique', 'قاعدي ضعيف');
    if (cls === 'Strongly Basic') return l('Strongly Basic', 'Fortement Basique', 'قاعدي قوي');
    return cls;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Mode selection & Input */}
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          {(['pH', 'pOH', 'H', 'OH'] as const).map(m => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                if (m === 'pH') setVal(7.0);
                if (m === 'pOH') setVal(7.0);
                if (m === 'H') setVal(1e-7);
                if (m === 'OH') setVal(1e-7);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #6F7F63',
                background: mode === m ? '#4E5B47' : '#FAF8F5',
                color: mode === m ? '#FAF8F5' : '#4E5B47',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {m === 'H' ? '[H⁺] (mol/L)' : m === 'OH' ? '[OH⁻] (mol/L)' : m}
            </button>
          ))}
        </div>

        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', marginBottom: '0.4rem' }}>
          {mode === 'pH'
            ? l('Enter pH value (0 to 14)', 'Entrez le pH (0 à 14)', 'أدخل قيمة pH (من 0 إلى 14)')
            : mode === 'pOH'
            ? l('Enter pOH value (0 to 14)', 'Entrez le pOH (0 à 14)', 'أدخل قيمة pOH (من 0 إلى 14)')
            : l('Enter molar concentration (e.g. 1e-7)', 'Entrez la concentration molaire (ex: 1e-7)', 'أدخل التركيز المولي (مثال: 1e-7)')}
        </label>
        <input
          type="number"
          value={val}
          onChange={e => setVal(parseFloat(e.target.value) || 0)}
          step={mode === 'H' || mode === 'OH' ? '0.0000001' : '0.1'}
          min="0"
          max={mode === 'pH' || mode === 'pOH' ? 14 : undefined}
          className="formula-ltr"
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1.5px solid #6F7F63',
            background: '#FAF8F5',
            fontSize: '1.2rem',
            color: '#4E5B47',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Visual pH Spectrum Scale */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
          <span>0 ({l('Strong Acid', 'Acide fort', 'حمض قوي')})</span>
          <span>7 ({l('Neutral', 'Neutre', 'متعادل')})</span>
          <span>14 ({l('Strong Base', 'Base forte', 'قاعدة قوية')})</span>
        </div>
        <div
          style={{
            height: '20px',
            borderRadius: '10px',
            background: 'linear-gradient(to right, #ef4444 0%, #f97316 20%, #eab308 40%, #22c55e 50%, #06b6d4 70%, #3b82f6 85%, #8b5cf6 100%)',
            position: 'relative',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
            direction: 'ltr'
          }}
        >
          {/* Slider Pin */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: `${Math.min(100, Math.max(0, (result.pH / 14) * 100))}%`,
              transform: 'translateX(-50%)',
              width: '16px',
              height: '32px',
              background: '#FAF8F5',
              border: '2px solid #1a1a1a',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              transition: 'left 0.2s ease'
            }}
          />
        </div>
      </div>

      {/* Results Card */}
      <div
        style={{
          background: '#DCE0CF',
          border: '1.5px solid #6F7F63',
          borderRadius: '12px',
          padding: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1rem',
          textAlign: 'center'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>pH</span>
          <div className="formula-ltr" style={{ fontSize: '2rem', fontWeight: 700, color: '#4E5B47' }}>
            {result.pH.toFixed(2)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>pOH</span>
          <div className="formula-ltr" style={{ fontSize: '2rem', fontWeight: 700, color: '#4E5B47' }}>
            {result.pOH.toFixed(2)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>[H⁺]</span>
          <div className="formula-ltr" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4E5B47', marginTop: '6px' }}>
            {result.hConcentration.toExponential(2)} M
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>[OH⁻]</span>
          <div className="formula-ltr" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4E5B47', marginTop: '6px' }}>
            {result.ohConcentration.toExponential(2)} M
          </div>
        </div>
      </div>

      {/* Classification & Benchmark */}
      <div
        style={{
          background: '#FAF8F5',
          border: '1px solid #6F7F63',
          borderRadius: '10px',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 700 }}>
            {l('Classification', 'Classification', 'التصنيف')}
          </span>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4E5B47' }}>
            {getClassificationLabel(result.classification)}
          </div>
        </div>

        <div style={{ textAlign: language === 'ar' ? 'left' : 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#5F6F5B', textTransform: 'uppercase', fontWeight: 700 }}>
            {l('Reference Benchmark', 'Référence', 'المعيار المرجعي')}
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#5F6F5B' }}>{result.benchmark}</div>
        </div>
      </div>

      {/* Quick Benchmark buttons */}
      <div>
        <span style={{ fontSize: '0.78rem', color: '#5F6F5B', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
          {l('Common Substance Benchmarks:', 'Exemples de substances courantes :', 'أمثلة لمواد شائعة:')}
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {benchmarks.map(b => (
            <button
              key={b.name}
              onClick={() => {
                setMode('pH');
                setVal(b.ph);
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
              {b.name} (<span className="formula-ltr">{b.ph}</span>)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
