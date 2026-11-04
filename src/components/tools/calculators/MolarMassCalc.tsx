import React, { useState, useEffect } from 'react';
import { calculateMolarMass, getElementBreakdown, validateFormula } from '../../../utils/formulaParser';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getElementName } from '../../../i18n/translations/elements';

interface MolarMassCalcProps {
  initialFormula?: string;
}

export const MolarMassCalc: React.FC<MolarMassCalcProps> = ({ initialFormula = 'H2O' }) => {
  const { language } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;
  const [formula, setFormula] = useState(initialFormula);

  useEffect(() => {
    if (initialFormula) {
      setFormula(initialFormula);
    }
  }, [initialFormula]);

  const validation = validateFormula(formula);
  const molarMass = validation.valid ? calculateMolarMass(formula) : 0;
  const breakdown = validation.valid ? getElementBreakdown(formula) : null;

  const presets = ['H2O', 'C6H12O6', 'Ca(OH)2', 'CuSO4·5H2O', 'NaCl', 'H2SO4', 'KMnO4'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', marginBottom: '0.4rem' }}>
          {l('Compound Chemical Formula', 'Formule Chimique du Composé', 'الصيغة الكيميائية للمركب')}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={formula}
            onChange={e => setFormula(e.target.value)}
            placeholder={l('e.g. H2O, CuSO4·5H2O, Fe2(SO4)3...', 'ex. H2O, CuSO4·5H2O, Fe2(SO4)3...', 'مثال: H2O, CuSO4·5H2O, Fe2(SO4)3...')}
            className="formula-ltr"
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: `1.5px solid ${!formula ? '#6F7F63' : validation.valid ? '#6F7F63' : '#b91c1c'}`,
              background: '#FAF8F5',
              fontSize: '1.2rem',
              color: '#4E5B47',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <span
            style={{
              position: 'absolute',
              right: language === 'ar' ? 'auto' : '12px',
              left: language === 'ar' ? '12px' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.1rem'
            }}
          >
            {formula && (validation.valid ? '✅' : '❌')}
          </span>
        </div>
        {!validation.valid && formula && (
          <span style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
            {validation.error}
          </span>
        )}

        {/* Quick Presets */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setFormula(p)}
              className="formula-ltr"
              style={{
                background: '#DCE0CF',
                border: '1px solid #6F7F63',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.78rem',
                color: '#4E5B47',
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {validation.valid && molarMass > 0 && (
        <>
          {/* Molar Mass Highlight Display */}
          <div
            style={{
              background: '#DCE0CF',
              border: '1.5px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>
              {l('Total Molar Mass', 'Masse Molaire Totale', 'الكتلة المولية الإجمالية')}
            </div>
            <div
              className="formula-ltr"
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#4E5B47',
                margin: '0.25rem 0'
              }}
            >
              {molarMass.toFixed(3)}{' '}
              <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>g/mol</span>
            </div>
          </div>

          {/* Elemental Composition Breakdown */}
          {breakdown && breakdown.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#4E5B47', marginBottom: '0.75rem' }}>
                {l('Mass Fraction & Elemental Breakdown', 'Fraction Massique & Composition Élémentaire', 'النسب المئوية والكتلية لكل عنصر')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {breakdown.map(item => {
                  const localizedElemName = getElementName(item.symbol, language, item.name);
                  return (
                    <div
                      key={item.symbol}
                      style={{
                        background: '#FAF8F5',
                        border: '1px solid #6F7F63',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#4E5B47' }}>
                          {localizedElemName} (<span className="formula-ltr">{item.symbol}</span>) × {item.count}
                        </span>
                        <span className="formula-ltr" style={{ fontWeight: 700, color: '#4E5B47' }}>{item.percentage.toFixed(2)}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div
                        style={{
                          height: '6px',
                          background: '#e0ddd8',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          marginBottom: '4px'
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${item.percentage}%`,
                            background: '#6F7F63',
                            borderRadius: '3px'
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#5F6F5B' }}>
                        <span>{l('Single atom: ', 'Atome unique : ', 'الذرة الواحدة: ')}<span className="formula-ltr">{item.atomicMass.toFixed(2)} u</span></span>
                        <span>{l('Total mass: ', 'Masse totale : ', 'الكتلة الكلية: ')}<span className="formula-ltr">{item.totalMass.toFixed(3)} g/mol</span></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
