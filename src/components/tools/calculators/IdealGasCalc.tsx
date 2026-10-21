import React, { useState } from 'react';
import { solveIdealGas } from '../../../utils/chemistryCalculations';

export const IdealGasCalc: React.FC = () => {
  const [solveFor, setSolveFor] = useState<'P' | 'V' | 'n' | 'T'>('P');

  // Working values in base units: atm, L, mol, K
  const [pVal, setPVal] = useState<number>(1.0);
  const [pUnit, setPUnit] = useState<'atm' | 'kPa' | 'bar'>('atm');

  const [vVal, setVVal] = useState<number>(22.414);
  const [vUnit, setVUnit] = useState<'L' | 'mL'>('L');

  const [nVal, setNVal] = useState<number>(1.0);
  const [tVal, setTVal] = useState<number>(273.15);
  const [tUnit, setTUnit] = useState<'K' | 'C'>('K');

  // Convert inputs to base units
  const pAtm = pUnit === 'atm' ? pVal : pUnit === 'kPa' ? pVal / 101.325 : pVal / 1.01325;
  const vL = vUnit === 'L' ? vVal : vVal / 1000;
  const tK = tUnit === 'K' ? tVal : tVal + 273.15;
  const nMol = nVal;

  const resultBase = solveIdealGas(solveFor, pAtm, vL, nMol, tK);

  // Convert result back to selected unit
  let displayResult = resultBase;
  let unitLabel = '';

  if (solveFor === 'P') {
    displayResult = pUnit === 'atm' ? resultBase : pUnit === 'kPa' ? resultBase * 101.325 : resultBase * 1.01325;
    unitLabel = pUnit;
  } else if (solveFor === 'V') {
    displayResult = vUnit === 'L' ? resultBase : resultBase * 1000;
    unitLabel = vUnit;
  } else if (solveFor === 'n') {
    displayResult = resultBase;
    unitLabel = 'moles';
  } else if (solveFor === 'T') {
    displayResult = tUnit === 'K' ? resultBase : resultBase - 273.15;
    unitLabel = `°${tUnit}`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Equation display */}
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
        Ideal Gas Law: <strong>P · V = n · R · T</strong> (R = 0.08206 L·atm/(mol·K))
      </div>

      {/* Target Variable Selector */}
      <div>
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '6px' }}>
          Select Variable to Calculate:
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'P', label: 'Pressure (P)' },
            { id: 'V', label: 'Volume (V)' },
            { id: 'n', label: 'Moles (n)' },
            { id: 'T', label: 'Temperature (T)' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSolveFor(item.id as any)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #6F7F63',
                background: solveFor === item.id ? '#4E5B47' : '#FAF8F5',
                color: solveFor === item.id ? '#FAF8F5' : '#4E5B47',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {/* Pressure */}
        <div style={{ opacity: solveFor === 'P' ? 0.5 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            Pressure (P)
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              disabled={solveFor === 'P'}
              value={solveFor === 'P' ? displayResult.toFixed(3) : pVal}
              onChange={e => setPVal(parseFloat(e.target.value) || 0)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47'
              }}
            />
            <select
              value={pUnit}
              onChange={e => setPUnit(e.target.value as any)}
              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #6F7F63', background: '#DCE0CF', color: '#4E5B47' }}
            >
              <option value="atm">atm</option>
              <option value="kPa">kPa</option>
              <option value="bar">bar</option>
            </select>
          </div>
        </div>

        {/* Volume */}
        <div style={{ opacity: solveFor === 'V' ? 0.5 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            Volume (V)
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              disabled={solveFor === 'V'}
              value={solveFor === 'V' ? displayResult.toFixed(3) : vVal}
              onChange={e => setVVal(parseFloat(e.target.value) || 0)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47'
              }}
            />
            <select
              value={vUnit}
              onChange={e => setVUnit(e.target.value as any)}
              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #6F7F63', background: '#DCE0CF', color: '#4E5B47' }}
            >
              <option value="L">L</option>
              <option value="mL">mL</option>
            </select>
          </div>
        </div>

        {/* Moles */}
        <div style={{ opacity: solveFor === 'n' ? 0.5 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            Amount of Substance (n)
          </label>
          <input
            type="number"
            disabled={solveFor === 'n'}
            value={solveFor === 'n' ? displayResult.toFixed(4) : nVal}
            onChange={e => setNVal(parseFloat(e.target.value) || 0)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #6F7F63',
              background: '#FAF8F5',
              color: '#4E5B47',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Temperature */}
        <div style={{ opacity: solveFor === 'T' ? 0.5 : 1 }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', marginBottom: '4px' }}>
            Temperature (T)
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="number"
              disabled={solveFor === 'T'}
              value={solveFor === 'T' ? displayResult.toFixed(2) : tVal}
              onChange={e => setTVal(parseFloat(e.target.value) || 0)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #6F7F63',
                background: '#FAF8F5',
                color: '#4E5B47'
              }}
            />
            <select
              value={tUnit}
              onChange={e => setTUnit(e.target.value as any)}
              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #6F7F63', background: '#DCE0CF', color: '#4E5B47' }}
            >
              <option value="K">K</option>
              <option value="C">°C</option>
            </select>
          </div>
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
          Calculated {solveFor} Value
        </span>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#4E5B47' }}>
          {displayResult.toFixed(4)} <span style={{ fontSize: '1.2rem', fontFamily: 'sans-serif' }}>{unitLabel}</span>
        </div>
      </div>
    </div>
  );
};

