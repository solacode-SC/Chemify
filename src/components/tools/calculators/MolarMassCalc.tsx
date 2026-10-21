import React, { useState } from 'react';
import { calculateMolarMass, getElementBreakdown, validateFormula } from '../../../utils/formulaParser';

export const MolarMassCalc: React.FC = () => {
  const [formula, setFormula] = useState('H2O');

  const validation = validateFormula(formula);
  const molarMass = validation.valid ? calculateMolarMass(formula) : 0;
  const breakdown = validation.valid ? getElementBreakdown(formula) : null;

  const presets = ['H2O', 'C6H12O6', 'Ca(OH)2', 'CuSO4·5H2O', 'NaCl', 'H2SO4', 'KMnO4'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', marginBottom: '0.4rem' }}>
          Chemical Formula
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={formula}
            onChange={e => setFormula(e.target.value)}
            placeholder="e.g. H2O, CuSO4·5H2O, Fe2(SO4)3..."
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              border: `1.5px solid ${!formula ? '#6F7F63' : validation.valid ? '#6F7F63' : '#b91c1c'}`,
              background: '#FAF8F5',
              fontSize: '1.2rem',
              fontFamily: "'DM Sans', sans-serif",
              color: '#4E5B47',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <span
            style={{
              position: 'absolute',
              right: '12px',
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
              Total Molar Mass
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#4E5B47',
                margin: '0.25rem 0'
              }}
            >
              {molarMass.toFixed(3)}{' '}
              <span style={{ fontSize: '1.2rem', fontFamily: 'sans-serif', fontWeight: 500 }}>g/mol</span>
            </div>
          </div>

          {/* Elemental Composition Breakdown */}
          {breakdown && breakdown.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.95rem', color: '#4E5B47', marginBottom: '0.75rem' }}>
                Elemental Mass Fractions & Composition
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {breakdown.map(item => (
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
                        {item.name} ({item.symbol}) × {item.count}
                      </span>
                      <span style={{ fontWeight: 700, color: '#4E5B47' }}>{item.percentage.toFixed(2)}%</span>
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
                      <span>Single Atom: {item.atomicMass.toFixed(2)} u</span>
                      <span>Total Element Mass: {item.totalMass.toFixed(3)} g/mol</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

