import React, { useState } from 'react';
import { calculateEmpiricalFormula, ElementInput } from '../../../utils/chemistryCalculations';

export const EmpiricalFormulaCalc: React.FC = () => {
  const [elements, setElements] = useState<ElementInput[]>([
    { symbol: 'C', amount: 40.0 },
    { symbol: 'H', amount: 6.7 },
    { symbol: 'O', amount: 53.3 }
  ]);

  const result = calculateEmpiricalFormula(elements);

  const handleAdd = () => {
    setElements([...elements, { symbol: 'N', amount: 10 }]);
  };

  const handleRemove = (idx: number) => {
    setElements(elements.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, field: keyof ElementInput, val: any) => {
    const copy = [...elements];
    copy[idx] = { ...copy[idx], [field]: val };
    setElements(copy);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#5F6F5B', textTransform: 'uppercase' }}>
            Element Composition (Mass in g or %)
          </label>
          <button
            onClick={handleAdd}
            style={{
              background: '#4E5B47',
              color: '#FAF8F5',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ＋ Add Element
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {elements.map((el, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                background: '#FAF8F5',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #6F7F63'
              }}
            >
              <input
                type="text"
                value={el.symbol}
                onChange={e => handleChange(i, 'symbol', e.target.value.toUpperCase())}
                placeholder="Sym"
                style={{
                  width: '60px',
                  padding: '6px',
                  borderRadius: '4px',
                  border: '1px solid #6F7F63',
                  fontWeight: 700,
                  textAlign: 'center',
                  background: '#E6E2D3',
                  color: '#4E5B47'
                }}
              />
              <input
                type="number"
                value={el.amount}
                onChange={e => handleChange(i, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Amount (% or g)"
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #6F7F63',
                  background: '#E6E2D3',
                  color: '#4E5B47',
                  fontWeight: 600
                }}
                step="0.1"
              />
              {elements.length > 1 && (
                <button
                  onClick={() => handleRemove(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#991b1b',
                    fontSize: '1.2rem',
                    cursor: 'pointer'
                  }}
                  title="Remove element"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {result ? (
        <>
          {/* Result Formula */}
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
              Simplest Empirical Formula
            </span>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#4E5B47',
                margin: '0.25rem 0'
              }}
            >
              {result.formula}
            </div>
          </div>

          {/* Mole Ratio Steps */}
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#4E5B47', marginBottom: '0.5rem' }}>
              Intermediate Mole Ratios
            </h4>
            <div style={{ border: '1px solid #6F7F63', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#DCE0CF', color: '#4E5B47' }}>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Element</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Calculated Moles</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6F7F63' }}>Integer Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {result.moles.map(m => (
                    <tr key={m.symbol} style={{ borderBottom: '1px solid #e0ddd8', background: '#FAF8F5' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>{m.symbol}</td>
                      <td style={{ padding: '8px' }}>{m.moles.toFixed(4)} mol</td>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#4E5B47' }}>{m.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#5F6F5B' }}>
          Enter valid element symbols and mass values.
        </div>
      )}
    </div>
  );
};

