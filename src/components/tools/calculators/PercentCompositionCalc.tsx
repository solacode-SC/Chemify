import React, { useState, useEffect } from 'react';
import { calculateMolarMass, getElementBreakdown, validateFormula } from '../../../utils/formulaParser';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getElementName } from '../../../i18n/translations/elements';

interface PercentCompositionCalcProps {
  initialFormula?: string;
}

export const PercentCompositionCalc: React.FC<PercentCompositionCalcProps> = ({
  initialFormula = 'C6H12O6'
}) => {
  const { language } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;

  const [formula, setFormula] = useState(initialFormula);

  useEffect(() => {
    if (initialFormula) setFormula(initialFormula);
  }, [initialFormula]);

  const validation = validateFormula(formula);
  const totalMass = validation.valid ? calculateMolarMass(formula) : 0;
  const breakdown = validation.valid ? getElementBreakdown(formula) : null;

  const presets = ['C6H12O6', 'H2SO4', 'K2Cr2O7', 'C8H10N4O2 (Caffeine)', 'NaHCO3'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', marginBottom: '0.4rem' }}>
          {l('Chemical Formula', 'Formule chimique', 'الصيغة الكيميائية')}
        </label>
        <input
          type="text"
          value={formula}
          onChange={e => setFormula(e.target.value)}
          placeholder="e.g. C6H12O6, H2SO4"
          className="formula-ltr"
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            border: `1.5px solid ${validation.valid ? '#6F7F63' : '#b91c1c'}`,
            background: '#FAF8F5',
            fontSize: '1.15rem',
            color: '#4E5B47',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {presets.map(p => {
            const clean = p.split(' ')[0];
            return (
              <button
                key={p}
                onClick={() => setFormula(clean)}
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
            );
          })}
        </div>
      </div>

      {validation.valid && breakdown && totalMass > 0 && (
        <>
          {/* Stacked Visual Bar */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase', marginBottom: '6px' }}>
              {l('Mass Fraction Distribution', 'Répartition proportionnelle de la masse', 'توزيع النسب المئوية الكتلية')}
            </div>
            <div style={{ height: '28px', borderRadius: '8px', overflow: 'hidden', display: 'flex', border: '1px solid #6F7F63' }}>
              {breakdown.map((item, idx) => {
                const colors = ['#4E5B47', '#6F7F63', '#8FA882', '#A3B899', '#C9CBB8', '#99A389'];
                return (
                  <div
                    key={item.symbol}
                    style={{
                      width: `${item.percentage}%`,
                      background: colors[idx % colors.length],
                      color: '#FAF8F5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={`${item.symbol}: ${item.percentage.toFixed(1)}%`}
                  >
                    {item.percentage > 8 ? `${item.symbol} ${item.percentage.toFixed(1)}%` : ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown Table */}
          <div style={{ border: '1px solid #6F7F63', borderRadius: '10px', overflowX: 'auto' }} className="no-scrollbar">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#DCE0CF', color: '#4E5B47' }}>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Element', 'Élément', 'العنصر')}</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Atoms', 'Atomes', 'الذرات')}</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Atomic Mass', 'Masse atomique', 'الكتلة الذرية')}</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Subtotal Mass', 'Masse totale', 'الكتلة الجزئية')}</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Mass %', '% Massique', '% كتلية')}</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map(item => {
                  const localizedElementName = getElementName(item.symbol, language) || item.name;
                  return (
                    <tr key={item.symbol} style={{ borderBottom: '1px solid #e0ddd8', background: '#FAF8F5' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>
                        {localizedElementName} (<span className="formula-ltr">{item.symbol}</span>)
                      </td>
                      <td style={{ padding: '8px' }} className="math-ltr">{item.count}</td>
                      <td style={{ padding: '8px' }} className="math-ltr">{item.atomicMass.toFixed(3)} u</td>
                      <td style={{ padding: '8px' }} className="math-ltr">{item.totalMass.toFixed(3)} g/mol</td>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }} className="math-ltr">
                        {item.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: language === 'ar' ? 'left' : 'right', fontSize: '0.9rem', color: '#5F6F5B' }}>
            {l('Total Molar Mass:', 'Masse molaire totale :', 'الكتلة المولية الإجمالية :')}{' '}
            <strong style={{ color: '#4E5B47' }} className="formula-ltr">{totalMass.toFixed(3)} g/mol</strong>
          </div>
        </>
      )}
    </div>
  );
};
