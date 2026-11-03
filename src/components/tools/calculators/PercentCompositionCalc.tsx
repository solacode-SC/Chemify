import React, { useState, useEffect } from 'react';
import { calculateMolarMass, getElementBreakdown, validateFormula } from '../../../utils/formulaParser';

interface PercentCompositionCalcProps {
  initialFormula?: string;
}

export const PercentCompositionCalc: React.FC<PercentCompositionCalcProps> = ({
  initialFormula = 'C6H12O6'
}) => {
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
          Chemical Formula
        </label>
        <input
          type="text"
          value={formula}
          onChange={e => setFormula(e.target.value)}
          placeholder="e.g. C6H12O6, H2SO4"
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
              Mass Proportion Distribution
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
          <div style={{ border: '1px solid #6F7F63', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#DCE0CF', color: '#4E5B47' }}>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Element</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Atoms</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Atomic Mass</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Subtotal Mass</th>
                  <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Mass %</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map(item => (
                  <tr key={item.symbol} style={{ borderBottom: '1px solid #e0ddd8', background: '#FAF8F5' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>
                      {item.name} ({item.symbol})
                    </td>
                    <td style={{ padding: '8px' }}>{item.count}</td>
                    <td style={{ padding: '8px' }}>{item.atomicMass.toFixed(3)} u</td>
                    <td style={{ padding: '8px' }}>{item.totalMass.toFixed(3)} g/mol</td>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>
                      {item.percentage.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.9rem', color: '#5F6F5B' }}>
            Total Molar Mass: <strong style={{ color: '#4E5B47' }}>{totalMass.toFixed(3)} g/mol</strong>
          </div>
        </>
      )}
    </div>
  );
};

