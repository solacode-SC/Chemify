import React, { useState, useEffect } from 'react';
import { determineOxidationStates } from '../../../utils/chemistryCalculations';

interface OxidationStateCalcProps {
  initialFormula?: string;
}

export const OxidationStateCalc: React.FC<OxidationStateCalcProps> = ({ initialFormula = 'KMnO4' }) => {
  const [formula, setFormula] = useState(initialFormula);

  useEffect(() => {
    if (initialFormula) setFormula(initialFormula);
  }, [initialFormula]);

  const results = determineOxidationStates(formula);

  const presets = ['KMnO4', 'K2Cr2O7', 'H2SO4', 'Fe2O3', 'HNO3', 'CO2', 'CH4', 'NaCl'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Compound Formula
        </label>
        <input
          type="text"
          value={formula}
          onChange={e => setFormula(e.target.value)}
          placeholder="e.g. KMnO4, K2Cr2O7"
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            border: '1.5px solid #6F7F63',
            background: '#FAF8F5',
            fontSize: '1.15rem',
            color: '#4E5B47',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

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

      {results && results.length > 0 ? (
        <>
          {/* Grid of Element Oxidation badges */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {results.map(r => (
              <div
                key={r.symbol}
                style={{
                  background: '#DCE0CF',
                  border: '1.5px solid #6F7F63',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  textAlign: 'center',
                  minWidth: '110px'
                }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#5F6F5B' }}>{r.symbol}</div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '2.2rem',
                    fontWeight: 700,
                    color: r.oxidationState > 0 ? '#15803d' : r.oxidationState < 0 ? '#b91c1c' : '#4E5B47'
                  }}
                >
                  {r.oxidationState > 0 ? `+${r.oxidationState}` : r.oxidationState}
                </div>
              </div>
            ))}
          </div>

          {/* Explanation Notes */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#4E5B47', marginBottom: '0.5rem' }}>
              Assignment Rules & Explanation
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {results.map(r => (
                <div
                  key={r.symbol}
                  style={{
                    background: '#FAF8F5',
                    border: '1px solid #6F7F63',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.88rem'
                  }}
                >
                  <strong style={{ color: '#4E5B47' }}>{r.symbol}: </strong>
                  <span style={{ color: '#5F6F5B' }}>{r.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#5F6F5B', padding: '1rem' }}>
          Please enter a valid chemical compound.
        </div>
      )}
    </div>
  );
};

