import React, { useState } from 'react';
import { calculateGibbs } from '../../../utils/chemistryCalculations';

export const GibbsCalc: React.FC = () => {
  const [deltaH, setDeltaH] = useState<number>(-92.4); // kJ/mol (e.g. Haber process)
  const [temp, setTemp] = useState<number>(298.15); // K
  const [tempUnit, setTempUnit] = useState<'K' | 'C'>('K');
  const [deltaS, setDeltaS] = useState<number>(-198.2); // J/(mol·K)

  const tempK = tempUnit === 'C' ? temp + 273.15 : temp;
  const result = calculateGibbs(deltaH, deltaS, tempK);

  const presets = [
    { name: 'Haber Process (N2 + 3H2)', dH: -92.4, dS: -198.2, t: 298.15 },
    { name: 'Water Vaporization', dH: 44.0, dS: 118.8, t: 373.15 },
    { name: 'Photosynthesis (Reverse)', dH: -2803, dS: -259, t: 298.15 },
    { name: 'Limestone Decomposition', dH: 178.0, dS: 161.0, t: 298.15 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Formula reminder */}
      <div
        style={{
          background: '#DCE0CF',
          border: '1px solid #6F7F63',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          textAlign: 'center',
          color: '#4E5B47',
          fontWeight: 600
        }}
      >
        Fundamental Thermodynamic Relation: <strong>ΔG = ΔH − T·ΔS</strong>
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            Enthalpy Change (ΔH)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={deltaH}
              onChange={e => setDeltaH(parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47',
                boxSizing: 'border-box'
              }}
              step="1"
            />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>in kJ/mol (negative = exothermic)</span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            Temperature (T)
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              value={temp}
              onChange={e => setTemp(parseFloat(e.target.value) || 0)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47',
                boxSizing: 'border-box'
              }}
              step="1"
            />
            <button
              onClick={() => {
                if (tempUnit === 'K') {
                  setTempUnit('C');
                  setTemp(parseFloat((temp - 273.15).toFixed(2)));
                } else {
                  setTempUnit('K');
                  setTemp(parseFloat((temp + 273.15).toFixed(2)));
                }
              }}
              style={{
                background: '#DCE0CF',
                border: '1px solid #6F7F63',
                borderRadius: '6px',
                padding: '0 12px',
                cursor: 'pointer',
                color: '#4E5B47',
                fontWeight: 700
              }}
            >
              °{tempUnit}
            </button>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>Effective T: {tempK.toFixed(2)} K</span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            Entropy Change (ΔS)
          </label>
          <input
            type="number"
            value={deltaS}
            onChange={e => setDeltaS(parseFloat(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #6F7F63',
              background: '#FAF8F5',
              color: '#4E5B47',
              boxSizing: 'border-box'
            }}
            step="1"
          />
          <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>in J/(mol·K)</span>
        </div>
      </div>

      {/* Result Display */}
      <div
        style={{
          background: result.isSpontaneous ? '#edf7ee' : '#fceced',
          border: `1.5px solid ${result.isSpontaneous ? '#8fc398' : '#cf7b81'}`,
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: result.isSpontaneous ? '#166534' : '#991b1b'
          }}
        >
          {result.isSpontaneous ? '✓ Thermodynamically Spontaneous' : '✗ Non-Spontaneous (Endergonic)'}
        </span>
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            fontWeight: 700,
            color: result.isSpontaneous ? '#166534' : '#991b1b',
            margin: '0.4rem 0'
          }}
        >
          ΔG = {result.deltaG > 0 ? `+${result.deltaG}` : result.deltaG}{' '}
          <span style={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>kJ/mol</span>
        </div>
        <p style={{ color: '#4E5B47', fontSize: '0.9rem', margin: 0 }}>{result.explanation}</p>
        {result.equilibriumTempKelvin && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#5F6F5B' }}>
            Equilibrium / Inversion Temperature (T<sub>eq</sub>):{' '}
            <strong>
              {result.equilibriumTempKelvin} K ({(result.equilibriumTempKelvin - 273.15).toFixed(1)} °C)
            </strong>
          </div>
        )}
      </div>

      {/* Presets */}
      <div>
        <span style={{ fontSize: '0.78rem', color: '#5F6F5B', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
          Load reference systems:
        </span>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => {
                setDeltaH(p.dH);
                setDeltaS(p.dS);
                setTemp(p.t);
                setTempUnit('K');
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
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

