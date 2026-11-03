import React, { useState, useEffect } from 'react';
import { parseEquationInput, balanceChemicalEquation } from '../../../utils/equationBalancer';
import { calculateMolarMass } from '../../../utils/formulaParser';

interface StoichiometryCalcProps {
  initialEquation?: string;
  initialInputVal?: number;
}

export const StoichiometryCalc: React.FC<StoichiometryCalcProps> = ({
  initialEquation = '2H2 + O2 -> 2H2O',
  initialInputVal = 4.0
}) => {
  const [eqInput, setEqInput] = useState(initialEquation);
  const [inputIdx, setInputIdx] = useState(0);
  const [inputVal, setInputVal] = useState<number>(initialInputVal);
  const [unit, setUnit] = useState<'grams' | 'moles'>('grams');

  useEffect(() => {
    if (initialEquation) setEqInput(initialEquation);
    if (initialInputVal !== undefined) setInputVal(initialInputVal);
  }, [initialEquation, initialInputVal]);

  const parsed = parseEquationInput(eqInput);
  const balanced = parsed ? balanceChemicalEquation(parsed.reactants, parsed.products) : null;

  const reactants = balanced ? balanced.reactants : [];
  const products = balanced ? balanced.products : [];
  const rCoeffs = balanced ? balanced.reactantsCoeffs : [];
  const pCoeffs = balanced ? balanced.productsCoeffs : [];

  // Active reactant
  const activeReactant = reactants[inputIdx] || reactants[0] || 'H2';
  const activeCoeff = rCoeffs[inputIdx] || 1;
  const activeMolarMass = calculateMolarMass(activeReactant) || 1;

  const molesActive = unit === 'grams' ? inputVal / activeMolarMass : inputVal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', marginBottom: '0.4rem' }}>
          Balanced Chemical Equation
        </label>
        <input
          type="text"
          value={eqInput}
          onChange={e => setEqInput(e.target.value)}
          placeholder="e.g. 2H2 + O2 -> 2H2O"
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            border: '1.5px solid #6F7F63',
            background: '#FAF8F5',
            fontSize: '1.1rem',
            fontFamily: "'DM Sans', sans-serif",
            color: '#4E5B47',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {balanced ? (
        <>
          {/* Given reactant amount */}
          <div
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '10px',
              padding: '1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block' }}>
                Given Reactant
              </span>
              <select
                value={inputIdx}
                onChange={e => setInputIdx(parseInt(e.target.value, 10))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: '#E6E2D3',
                  color: '#4E5B47',
                  fontWeight: 600
                }}
              >
                {reactants.map((r, i) => (
                  <option key={r} value={i}>
                    {r} (coeff: {rCoeffs[i]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block' }}>
                Quantity
              </span>
              <input
                type="number"
                value={inputVal}
                onChange={e => setInputVal(parseFloat(e.target.value) || 0)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  width: '100px',
                  background: '#E6E2D3',
                  color: '#4E5B47',
                  fontWeight: 600
                }}
                min="0"
                step="0.5"
              />
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block' }}>
                Unit
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setUnit('grams')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #6F7F63',
                    background: unit === 'grams' ? '#4E5B47' : '#FAF8F5',
                    color: unit === 'grams' ? '#FAF8F5' : '#4E5B47',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Grams (g)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('moles')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #6F7F63',
                    background: unit === 'moles' ? '#4E5B47' : '#FAF8F5',
                    color: unit === 'moles' ? '#FAF8F5' : '#4E5B47',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Moles (mol)
                </button>
              </div>
            </div>
          </div>

          {/* Stoichiometric Results Table */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#4E5B47', marginBottom: '0.5rem' }}>
              Stoichiometric Mass & Mole Relationship
            </h4>
            <div style={{ border: '1px solid #6F7F63', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#DCE0CF', color: '#4E5B47' }}>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Substance</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Role</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Molar Mass</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Moles Required / Produced</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Mass (g)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Reactants */}
                  {reactants.map((r, i) => {
                    const mw = calculateMolarMass(r);
                    const moleRatio = rCoeffs[i] / activeCoeff;
                    const molesNeeded = molesActive * moleRatio;
                    const massNeeded = molesNeeded * mw;

                    return (
                      <tr key={`r-${r}`} style={{ borderBottom: '1px solid #e0ddd8', background: i === inputIdx ? '#FAF8F5' : '#f5f3ef' }}>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>{r}</td>
                        <td style={{ padding: '8px', color: '#5F6F5B' }}>Reactant</td>
                        <td style={{ padding: '8px' }}>{mw.toFixed(2)} g/mol</td>
                        <td style={{ padding: '8px', fontWeight: 600 }}>{molesNeeded.toFixed(4)} mol</td>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>{massNeeded.toFixed(3)} g</td>
                      </tr>
                    );
                  })}

                  {/* Products */}
                  {products.map((p, i) => {
                    const mw = calculateMolarMass(p);
                    const moleRatio = pCoeffs[i] / activeCoeff;
                    const molesFormed = molesActive * moleRatio;
                    const massFormed = molesFormed * mw;

                    return (
                      <tr key={`p-${p}`} style={{ borderBottom: '1px solid #e0ddd8', background: '#eef4ed' }}>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#2a5a24' }}>{p}</td>
                        <td style={{ padding: '8px', color: '#2a5a24' }}>Theoretical Product</td>
                        <td style={{ padding: '8px' }}>{mw.toFixed(2)} g/mol</td>
                        <td style={{ padding: '8px', fontWeight: 600, color: '#2a5a24' }}>{molesFormed.toFixed(4)} mol</td>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#2a5a24' }}>{massFormed.toFixed(3)} g</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#5F6F5B', padding: '1rem' }}>
          Enter a valid chemical equation to calculate stoichiometric relationships.
        </div>
      )}
    </div>
  );
};

