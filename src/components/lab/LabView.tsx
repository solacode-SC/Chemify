import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ReactantItem, ReactionState, ReactionStatus } from '../../types/reaction';
import { computeReaction, PRESET_REACTIONS } from '../../utils/reactionEngine';
import { ReactionDiagram } from './ReactionDiagram';

export const LabView: React.FC = () => {
  const [newFormula, setNewFormula] = useState('');
  const [reactants, setReactants] = useState<ReactantItem[]>([
    { id: '1', formula: 'H2', massGrams: 4.0 },
    { id: '2', formula: 'O2', massGrams: 32.0 }
  ]);
  const [status, setStatus] = useState<ReactionStatus>('ready');
  const [openAccordion, setOpenAccordion] = useState<string | null>('limiting');

  // Compute reaction state based on current reactants
  const reactionData = computeReaction(reactants);

  const handleAddReactant = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFormula.trim();
    if (!trimmed) return;

    if (reactants.some(r => r.formula.toLowerCase() === trimmed.toLowerCase())) {
      return;
    }

    setReactants([...reactants, { id: crypto.randomUUID(), formula: trimmed, massGrams: 10 }]);
    setNewFormula('');
    setStatus('ready');
  };

  const handleRemoveReactant = (id: string) => {
    const updated = reactants.filter(r => r.id !== id);
    setReactants(updated);
    setStatus(updated.length >= 2 ? 'ready' : 'idle');
  };

  const handleMassChange = (id: string, grams: number) => {
    setReactants(reactants.map(r => (r.id === id ? { ...r, massGrams: Math.max(0.1, grams) } : r)));
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_REACTIONS.find(p => p.id === presetId);
    if (!preset) return;

    const newR = preset.reactants.map((f, i) => ({
      id: String(i + 1),
      formula: f,
      massGrams: 15 + i * 5
    }));
    setReactants(newR);
    setStatus('ready');
  };

  const handleRunReaction = () => {
    if (status === 'complete') {
      setStatus('ready');
      setTimeout(() => setStatus('running'), 50);
    } else {
      setStatus('running');
    }
  };

  const handleResetReaction = () => {
    setStatus('ready');
  };

  return (
    <div className="lab-page" style={{ minHeight: '100vh', paddingBottom: '5rem', paddingTop: '100px' }}>
      {/* Header */}
      <section style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 1rem' }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#6F7F63',
            display: 'block',
            marginBottom: '0.5rem'
          }}
        >
          REACTION STUDIO
        </span>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
            color: '#4E5B47',
            marginBottom: '0.75rem'
          }}
        >
          Simulate Chemical Reactions
        </h1>
        <p style={{ color: '#5F6F5B', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Add reactants, test real-time stoichiometry, examine energy profiles, and watch chemistry unfold in your
          browser.
        </p>
      </section>

      {/* Main Lab Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Preset Selector Banner */}
        <div
          style={{
            background: '#DCE0CF',
            border: '1px solid #6F7F63',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚗️</span>
            <div>
              <strong style={{ color: '#4E5B47', fontSize: '0.95rem' }}>Quick Reaction Presets:</strong>
              <div style={{ fontSize: '0.8rem', color: '#5F6F5B' }}>Select a curated reaction to load reactants instantly</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PRESET_REACTIONS.slice(0, 4).map(preset => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                style={{
                  background: '#FAF8F5',
                  border: '1px solid #6F7F63',
                  borderRadius: '8px',
                  padding: '5px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#4E5B47',
                  cursor: 'pointer'
                }}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Top Control Bar */}
        <div
          style={{
            background: '#FAF8F5',
            border: '1.5px solid #6F7F63',
            borderRadius: '14px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Input Form */}
            <form onSubmit={handleAddReactant} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={newFormula}
                onChange={e => setNewFormula(e.target.value)}
                placeholder="Reactant formula (e.g. H2, O2, HCl)..."
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #6F7F63',
                  background: '#E6E2D3',
                  color: '#4E5B47',
                  fontSize: '0.95rem',
                  outline: 'none',
                  minWidth: '220px'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.65rem 1.25rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                ＋ Add
              </button>
            </form>

            {/* Reactants Area */}
            <div style={{ display: 'flex', gap: '0.75rem', flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              {reactants.map(r => (
                <div
                  key={r.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#DCE0CF',
                    border: '1px solid #6F7F63',
                    borderRadius: '10px',
                    padding: '4px 10px'
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#4E5B47', fontSize: '1rem' }}>{r.formula}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <input
                      type="number"
                      value={r.massGrams}
                      onChange={e => handleMassChange(r.id, parseFloat(e.target.value) || 0)}
                      style={{
                        width: '54px',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        border: '1px solid #6F7F63',
                        fontSize: '0.8rem',
                        textAlign: 'right',
                        background: '#FAF8F5',
                        color: '#4E5B47'
                      }}
                      min="0.1"
                      step="0.5"
                    />
                    <span style={{ fontSize: '0.75rem', color: '#5F6F5B' }}>g</span>
                  </div>
                  <button
                    onClick={() => handleRemoveReactant(r.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8b4545',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      lineHeight: 1,
                      padding: '0 2px'
                    }}
                    title="Remove reactant"
                  >
                    ×
                  </button>
                </div>
              ))}
              {reactants.length === 0 && (
                <span style={{ color: '#5F6F5B', fontSize: '0.88rem' }}>No reactants added yet.</span>
              )}
            </div>

            {/* Run & Reset Reaction Buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handleRunReaction}
                disabled={reactants.length < 1 || status === 'running'}
                style={{
                  background: status === 'running' ? '#6F7F63' : '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1.4rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: reactants.length >= 1 && status !== 'running' ? 'pointer' : 'not-allowed',
                  opacity: reactants.length < 1 ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(78, 91, 71, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{status === 'running' ? '⏳' : '⚗️'}</span>
                <span>{status === 'running' ? 'Reacting…' : status === 'complete' ? 'Run Again ↺' : 'Run Reaction'}</span>
              </button>

              <button
                onClick={handleResetReaction}
                style={{
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  border: '1.5px solid #6F7F63',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Reset simulation to initial reactant solution"
              >
                Reset ↺
              </button>
            </div>
          </div>
        </div>

        {/* Equation Display Card */}
        <div
          style={{
            background: '#E6E2D3',
            border: '1.5px solid #6F7F63',
            borderRadius: '14px',
            padding: '1.75rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            position: 'relative',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
          }}
        >
          {reactionData.energyType && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                padding: '4px 12px',
                borderRadius: '14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: reactionData.energyType === 'exothermic' ? '#fee2e2' : '#e0e7ff',
                color: reactionData.energyType === 'exothermic' ? '#991b1b' : '#3730a3',
                border: `1px solid ${reactionData.energyType === 'exothermic' ? '#f87171' : '#818cf8'}`
              }}
            >
              {reactionData.energyType === 'exothermic' ? '🔥 Exothermic' : '❄️ Endothermic'} ({reactionData.deltaH})
            </span>
          )}

          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
              color: '#4E5B47',
              margin: '0.5rem 0'
            }}
          >
            {reactionData.equation || 'Add reactants to simulate chemical pathway'}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#5F6F5B' }}>
            Stoichiometrically balanced equation with conservation of mass verified.
          </div>
        </div>

        {/* Bottom Grid: Left Diagram + Right Info Panels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            alignItems: 'stretch'
          }}
        >
          {/* Reaction Diagram - Multi-Stage Chemical Molecular Simulator */}
          <ReactionDiagram
            status={status}
            equation={reactionData.equation || ''}
            reactionType={reactionData.reactionType}
            energyType={reactionData.energyType}
            deltaH={reactionData.deltaH}
            conditions={reactionData.conditions}
            reactants={reactants}
            onReset={() => setStatus('ready')}
            onComplete={() => setStatus('complete')}
          />

          {/* Right Info Panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Reaction Type */}
            <div
              style={{
                background: '#FAF8F5',
                border: '1.5px solid #6F7F63',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block' }}>
                Classification
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4E5B47', marginTop: '4px' }}>
                {reactionData.reactionType || '—'}
              </div>
            </div>

            {/* Required Conditions */}
            <div
              style={{
                background: '#FAF8F5',
                border: '1.5px solid #6F7F63',
                borderRadius: '12px',
                padding: '1.25rem'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '0.5rem' }}>
                Thermodynamic & Physical Conditions
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e0ddd8', paddingBottom: '4px' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.88rem' }}>Temperature</span>
                  <strong style={{ color: '#4E5B47', fontSize: '0.88rem' }}>{reactionData.conditions?.temperature || '—'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e0ddd8', paddingBottom: '4px' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.88rem' }}>Pressure</span>
                  <strong style={{ color: '#4E5B47', fontSize: '0.88rem' }}>{reactionData.conditions?.pressure || '—'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.88rem' }}>Catalyst</span>
                  <strong style={{ color: '#4E5B47', fontSize: '0.88rem' }}>{reactionData.conditions?.catalyst || '—'}</strong>
                </div>
              </div>
            </div>

            {/* Stoichiometry Calculations Accordion */}
            <div
              style={{
                background: '#FAF8F5',
                border: '1.5px solid #6F7F63',
                borderRadius: '12px',
                padding: '1.25rem',
                flex: 1
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '0.75rem' }}>
                Quantitative Calculations
              </span>

              {/* Limiting Reagent */}
              <div style={{ marginBottom: '0.5rem', border: '1px solid #6F7F63', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'limiting' ? null : 'limiting')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#DCE0CF',
                    border: 'none',
                    fontWeight: 600,
                    color: '#4E5B47',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>Limiting Reagent</span>
                  <span>{openAccordion === 'limiting' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'limiting' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#4E5B47', background: '#FAF8F5' }}>
                    {reactionData.calculations?.limitingReagent ? (
                      <>
                        Reagent with lowest stoichiometric mole equivalent:{' '}
                        <strong>{reactionData.calculations.limitingReagent}</strong>
                      </>
                    ) : (
                      'Run reaction to evaluate limiting reactant.'
                    )}
                  </div>
                )}
              </div>

              {/* Theoretical Yield */}
              <div style={{ marginBottom: '0.5rem', border: '1px solid #6F7F63', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'theoretical' ? null : 'theoretical')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#DCE0CF',
                    border: 'none',
                    fontWeight: 600,
                    color: '#4E5B47',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>Theoretical Yield</span>
                  <span>{openAccordion === 'theoretical' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'theoretical' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#4E5B47', background: '#FAF8F5' }}>
                    {reactionData.calculations?.theoreticalYield ? (
                      <>
                        Maximum product mass assuming 100% conversion:{' '}
                        <strong>{reactionData.calculations.theoreticalYield}</strong>
                      </>
                    ) : (
                      'Theoretical yield calculated upon running.'
                    )}
                  </div>
                )}
              </div>

              {/* Percent Yield */}
              <div style={{ border: '1px solid #6F7F63', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'percent' ? null : 'percent')}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#DCE0CF',
                    border: 'none',
                    fontWeight: 600,
                    color: '#4E5B47',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <span>Percent Yield</span>
                  <span>{openAccordion === 'percent' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'percent' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#4E5B47', background: '#FAF8F5' }}>
                    {reactionData.calculations?.percentYield ? (
                      <>
                        Estimated laboratory conversion efficiency:{' '}
                        <strong>{reactionData.calculations.percentYield}</strong>
                      </>
                    ) : (
                      'Simulated percentage yield.'
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

