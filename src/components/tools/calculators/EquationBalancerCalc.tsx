import React, { useState, useEffect } from 'react';
import { balanceChemicalEquation, parseEquationInput } from '../../../utils/equationBalancer';
import { useLanguage } from '../../../i18n/LanguageContext';

interface EquationBalancerCalcProps {
  initialEquation?: string;
}

export const EquationBalancerCalc: React.FC<EquationBalancerCalcProps> = ({
  initialEquation = 'C3H8 + O2 -> CO2 + H2O'
}) => {
  const { language } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;
  const [equationInput, setEquationInput] = useState(initialEquation);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialEquation) {
      setEquationInput(initialEquation);
      setError(null);
    }
  }, [initialEquation]);

  const presets = [
    'H2 + O2 -> H2O',
    'C3H8 + O2 -> CO2 + H2O',
    'Fe + O2 -> Fe2O3',
    'Al + HCl -> AlCl3 + H2',
    'KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2',
    'NaOH + H2SO4 -> Na2SO4 + H2O'
  ];

  const parsed = parseEquationInput(equationInput);
  const result = parsed ? balanceChemicalEquation(parsed.reactants, parsed.products) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', marginBottom: '0.4rem' }}>
          {l('Unbalanced Chemical Equation', 'Équation Chimique Non Équilibrée', 'المعادلة الكيميائية غير الموزونة')}
        </label>
        <input
          type="text"
          value={equationInput}
          onChange={e => {
            setEquationInput(e.target.value);
            setError(null);
          }}
          placeholder="e.g. C3H8 + O2 -> CO2 + H2O"
          className="formula-ltr"
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            border: `1.5px solid ${result ? '#6F7F63' : '#b91c1c'}`,
            background: '#FAF8F5',
            fontSize: '1.15rem',
            color: '#4E5B47',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {/* Quick Presets */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setEquationInput(p)}
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

      {result ? (
        <>
          {/* Balanced Output */}
          <div
            style={{
              background: '#DCE0CF',
              border: '1.5px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <span
                style={{
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                {result.reactionType}
              </span>
              <span
                style={{
                  background: '#8FA882',
                  color: '#2a3424',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {l('Balanced', 'Équilibrée', 'موزونة بدقة')}
              </span>
            </div>
            <div
              className="formula-ltr"
              style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                color: '#4E5B47'
              }}
            >
              {result.formattedEquation}
            </div>
          </div>

          {/* Atom Balance Verification Table */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#4E5B47', marginBottom: '0.5rem' }}>
              {l('Atom Conservation & Mass Balance Check', 'Vérification de la Conservation des Atomes', 'التحقق من قانون حفظ المادة وعدد الذرات')}
            </h4>
            <div style={{ border: '1px solid #6F7F63', borderRadius: '8px', overflowX: 'auto' }} className="no-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#DCE0CF', color: '#4E5B47' }}>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Element', 'Élément', 'العنصر')}</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Reactant Atoms', 'Atomes Réactifs', 'ذرات المتفاعلات')}</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Product Atoms', 'Atomes Produits', 'ذرات النواتج')}</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>{l('Status', 'Statut', 'الحالة')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.atomBalance.map(item => (
                    <tr key={item.element} style={{ borderBottom: '1px solid #e0ddd8', background: '#FAF8F5' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>{item.element}</td>
                      <td className="formula-ltr" style={{ padding: '8px', color: '#4E5B47' }}>{item.reactantCount}</td>
                      <td className="formula-ltr" style={{ padding: '8px', color: '#4E5B47' }}>{item.productCount}</td>
                      <td style={{ padding: '8px', color: item.reactantCount === item.productCount ? '#15803d' : '#b91c1c', fontWeight: 600 }}>
                        {item.reactantCount === item.productCount
                          ? l('✓ Conserved', '✓ Conservé', '✓ متطابق')
                          : l('Mismatched', 'Différent', 'غير متطابق')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#5F6F5B', fontSize: '0.9rem' }}>
          {l(
            'Please enter a valid unbalanced equation using "->" or "=". Example: ',
            'Veuillez saisir une équation non équilibrée valide avec "->" ou "=". Exemple : ',
            'يرجى إدخال معادلة غير موزونة صالحة باستخدام "->" أو "=". مثال: '
          )}
          <code className="formula-ltr">H2 + O2 &rarr; H2O</code>
        </div>
      )}
    </div>
  );
};
