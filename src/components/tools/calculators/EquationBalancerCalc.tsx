import React, { useState } from 'react';
import { balanceChemicalEquation, parseEquationInput } from '../../../utils/equationBalancer';

export const EquationBalancerCalc: React.FC = () => {
  const [equationInput, setEquationInput] = useState('C3H8 + O2 -> CO2 + H2O');
  const [error, setError] = useState<string | null>(null);

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
          Unbalanced Chemical Equation
        </label>
        <input
          type="text"
          value={equationInput}
          onChange={e => {
            setEquationInput(e.target.value);
            setError(null);
          }}
          placeholder="e.g. C3H8 + O2 -> CO2 + H2O"
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '8px',
            border: `1.5px solid ${result ? '#6F7F63' : '#b91c1c'}`,
            background: '#FAF8F5',
            fontSize: '1.15rem',
            fontFamily: "'DM Sans', sans-serif",
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
                Balanced
              </span>
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
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
              Atomic Conservation Verification
            </h4>
            <div style={{ border: '1px solid #6F7F63', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#DCE0CF', color: '#4E5B47' }}>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Element</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Reactants Atoms</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Products Atoms</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.atomBalance.map(item => (
                    <tr key={item.element} style={{ borderBottom: '1px solid #e0ddd8', background: '#FAF8F5' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>{item.element}</td>
                      <td style={{ padding: '8px', color: '#4E5B47' }}>{item.reactantCount}</td>
                      <td style={{ padding: '8px', color: '#4E5B47' }}>{item.productCount}</td>
                      <td style={{ padding: '8px', color: item.reactantCount === item.productCount ? '#15803d' : '#b91c1c' }}>
                        {item.reactantCount === item.productCount ? '✓ Conserved' : 'Mismatch'}
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
          Please input a valid unbalanced equation using &quot;-&gt;&quot; or &quot;=&quot;. Example: <code>H2 + O2 &rarr; H2O</code>
        </div>
      )}
    </div>
  );
};

