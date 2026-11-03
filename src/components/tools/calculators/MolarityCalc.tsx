import React, { useState, useEffect } from 'react';
import { calculateDilution, calculateMolarity } from '../../../utils/chemistryCalculations';
import { calculateMolarMass } from '../../../utils/formulaParser';

interface MolarityCalcProps {
  initialTab?: 'molarity' | 'dilution';
  initialFormula?: string;
  initialMass?: number;
  initialVolume?: number;
  initialM1?: number;
  initialV1?: number;
  initialM2?: number;
  initialV2?: number;
  initialSolveFor?: 'M1' | 'V1' | 'M2' | 'V2';
}

export const MolarityCalc: React.FC<MolarityCalcProps> = ({
  initialTab = 'molarity',
  initialFormula = 'NaCl',
  initialMass = 5.84,
  initialVolume = 0.5,
  initialM1 = 2.0,
  initialV1 = 50,
  initialM2 = 0.5,
  initialV2 = 200,
  initialSolveFor = 'V2'
}) => {
  const [tab, setTab] = useState<'molarity' | 'dilution'>(initialTab);

  // Molarity state
  const [formula, setFormula] = useState(initialFormula);
  const [mass, setMass] = useState<number>(initialMass);
  const [volume, setVolume] = useState<number>(initialVolume); // Liters

  // Dilution state: M1*V1 = M2*V2
  const [m1, setM1] = useState<number>(initialM1);
  const [v1, setV1] = useState<number>(initialV1); // mL
  const [m2, setM2] = useState<number>(initialM2);
  const [v2, setV2] = useState<number>(initialV2); // mL
  const [solveFor, setSolveFor] = useState<'M1' | 'V1' | 'M2' | 'V2'>(initialSolveFor);

  useEffect(() => {
    if (initialTab) setTab(initialTab);
    if (initialFormula) setFormula(initialFormula);
    if (initialMass !== undefined) setMass(initialMass);
    if (initialVolume !== undefined) setVolume(initialVolume);
    if (initialM1 !== undefined) setM1(initialM1);
    if (initialV1 !== undefined) setV1(initialV1);
    if (initialM2 !== undefined) setM2(initialM2);
    if (initialV2 !== undefined) setV2(initialV2);
    if (initialSolveFor) setSolveFor(initialSolveFor);
  }, [initialTab, initialFormula, initialMass, initialVolume, initialM1, initialV1, initialM2, initialV2, initialSolveFor]);

  const mw = calculateMolarMass(formula) || 58.44;
  const molarityResult = calculateMolarity(mass, mw, volume);

  const dilutionResult = calculateDilution(m1, v1, m2, v2, solveFor);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Tab Switcher */}
      <div style={{ display: 'flex', background: '#DCE0CF', padding: '4px', borderRadius: '10px' }}>
        <button
          onClick={() => setTab('molarity')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '8px',
            background: tab === 'molarity' ? '#4E5B47' : 'transparent',
            color: tab === 'molarity' ? '#FAF8F5' : '#4E5B47',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          1. Molarity from Mass
        </button>
        <button
          onClick={() => setTab('dilution')}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '8px',
            background: tab === 'dilution' ? '#4E5B47' : 'transparent',
            color: tab === 'dilution' ? '#FAF8F5' : '#4E5B47',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          2. Dilution (M₁V₁ = M₂V₂)
        </button>
      </div>

      {tab === 'molarity' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
                Solute Formula
              </label>
              <input
                type="text"
                value={formula}
                onChange={e => setFormula(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>Molar Mass: {mw.toFixed(2)} g/mol</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
                Mass of Solute (g)
              </label>
              <input
                type="number"
                value={mass}
                onChange={e => setMass(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  boxSizing: 'border-box'
                }}
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
                Solution Volume (L)
              </label>
              <input
                type="number"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  boxSizing: 'border-box'
                }}
                min="0.01"
                step="0.1"
              />
            </div>
          </div>

          {/* Result Card */}
          <div
            style={{
              background: '#DCE0CF',
              border: '1.5px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>
              Solution Concentration
            </span>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#4E5B47' }}>
              {molarityResult.toFixed(4)}{' '}
              <span style={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>M (mol/L)</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#5F6F5B', marginTop: '4px' }}>
              Moles of solute: {(mass / mw).toFixed(4)} mol in {volume} L of solution.
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
              Solve For:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['M1', 'V1', 'M2', 'V2'] as const).map(variable => (
                <button
                  key={variable}
                  onClick={() => setSolveFor(variable)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #6F7F63',
                    background: solveFor === variable ? '#4E5B47' : '#FAF8F5',
                    color: solveFor === variable ? '#FAF8F5' : '#4E5B47',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {variable}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#5F6F5B', fontWeight: 600 }}>Initial Molarity (M₁)</label>
              <input
                type="number"
                disabled={solveFor === 'M1'}
                value={solveFor === 'M1' ? dilutionResult.toFixed(3) : m1}
                onChange={e => setM1(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: solveFor === 'M1' ? '#DCE0CF' : '#FAF8F5',
                  color: '#4E5B47',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#5F6F5B', fontWeight: 600 }}>Initial Volume (V₁)</label>
              <input
                type="number"
                disabled={solveFor === 'V1'}
                value={solveFor === 'V1' ? dilutionResult.toFixed(2) : v1}
                onChange={e => setV1(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: solveFor === 'V1' ? '#DCE0CF' : '#FAF8F5',
                  color: '#4E5B47',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#5F6F5B', fontWeight: 600 }}>Target Molarity (M₂)</label>
              <input
                type="number"
                disabled={solveFor === 'M2'}
                value={solveFor === 'M2' ? dilutionResult.toFixed(3) : m2}
                onChange={e => setM2(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: solveFor === 'M2' ? '#DCE0CF' : '#FAF8F5',
                  color: '#4E5B47',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#5F6F5B', fontWeight: 600 }}>Target Volume (V₂)</label>
              <input
                type="number"
                disabled={solveFor === 'V2'}
                value={solveFor === 'V2' ? dilutionResult.toFixed(2) : v2}
                onChange={e => setV2(parseFloat(e.target.value) || 0)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #6F7F63',
                  background: solveFor === 'V2' ? '#DCE0CF' : '#FAF8F5',
                  color: '#4E5B47',
                  fontWeight: 600,
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div
            style={{
              background: '#DCE0CF',
              border: '1.5px solid #6F7F63',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>
              Calculated {solveFor}
            </span>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#4E5B47' }}>
              {dilutionResult.toFixed(3)}{' '}
              <span style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}>
                {solveFor.startsWith('M') ? 'M' : 'volume units'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

