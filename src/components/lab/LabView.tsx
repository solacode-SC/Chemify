import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ReactantItem, ReactionState, ReactionStatus } from '../../types/reaction';
import { computeReaction, PRESET_REACTIONS } from '../../utils/reactionEngine';
import { ReactionDiagram } from './ReactionDiagram';
import { useLanguage } from '../../i18n/LanguageContext';
import { PRESET_REACTIONS_TRANSLATIONS } from '../../i18n/translations/reactions';
import { getReagentInfo, STOCKROOM_REAGENTS } from '../../data/reagentsData';
import { MathEquation } from '../common/MathEquation';

export const LabView: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const l = (en: string, fr: string, ar: string) => language === 'ar' ? ar : language === 'fr' ? fr : en;
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

  const handleStepMass = (id: string, delta: number) => {
    setReactants(
      reactants.map(r => (r.id === id ? { ...r, massGrams: Math.max(0.1, parseFloat(((r.massGrams || 0) + delta).toFixed(1))) } : r))
    );
  };

  const handleQuickAdd = (formula: string) => {
    if (reactants.some(r => r.formula.toLowerCase() === formula.toLowerCase())) {
      return;
    }
    const meta = getReagentInfo(formula);
    const defaultMass = meta.state === 'gas' ? (formula === 'H2' ? 4.0 : 32.0) : formula === 'Fe' ? 28.0 : formula === 'CuSO4' ? 40.0 : 15.0;
    setReactants([...reactants, { id: crypto.randomUUID(), formula, massGrams: defaultMass }]);
    setStatus('ready');
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_REACTIONS.find(p => p.id === presetId);
    if (!preset) return;

    const newR = preset.reactants.map((f, i) => {
      let defaultMass = 15;
      if (f === 'H2') defaultMass = 4.0;
      else if (f === 'O2') defaultMass = 32.0;
      else if (f === 'CH4') defaultMass = 16.0;
      else if (f === 'N2') defaultMass = 28.0;
      else if (f === 'HCl') defaultMass = 36.5;
      else if (f === 'NaOH') defaultMass = 40.0;
      else if (f === 'Fe') defaultMass = 28.0;
      else if (f === 'CuSO4') defaultMass = 40.0;
      else if (f === 'H2O2') defaultMass = 34.0;
      else if (f === 'Al') defaultMass = 27.0;
      else if (f === 'Fe2O3') defaultMass = 40.0;
      else if (f === 'CaCO3') defaultMass = 50.0;

      return {
        id: String(i + 1),
        formula: f,
        massGrams: defaultMass
      };
    });
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
          {l('Chemical Reaction Simulation Studio', 'STUDIO DE RÉACTIONS CHIMIQUES', 'استوديو محاكاة التفاعلات الكيميائية')}
        </span>
        <h1
          className="section-title"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
            color: '#4E5B47',
            marginBottom: '0.75rem'
          }}
        >
          {t.lab.title}
        </h1>
        <p style={{ color: '#5F6F5B', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          {t.lab.subtitle}
        </p>
      </section>

      {/* Main Lab Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Preset Selector Banner */}
        <div
          style={{
            background: '#DCE0CF',
            border: '1.5px solid #6F7F63',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>⚗️</span>
              <div>
                <strong style={{ color: '#4E5B47', fontSize: '1rem' }}>
                  {l('Preset Reactions Library', 'Bibliothèque de Réactions Modèles', 'مكتبة التفاعلات الكيميائية النموذجية')}
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#5F6F5B', display: 'block' }}>
                  {l('Select any standard chemical pathway to automatically load stoichiometric reactants on the bench', 'Sélectionnez une réaction modèle pour charger automatiquement les réactifs sur la paillasse', 'اختر تفاعلاً قياسياً لتحميل المتفاعلات والكميات تلقائياً على طاولة المختبر')}
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4E5B47', background: '#FAF8F5', border: '1px solid #6F7F63', padding: '3px 10px', borderRadius: '999px' }}>
              8 {l('Standard Reactions', 'Réactions Types', 'تفاعلات نموذجية')}
            </span>
          </div>

          {/* Presets Horizontal Scroll / Grid */}
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              padding: '4px 2px'
            }}
          >
            {PRESET_REACTIONS.map(preset => {
              const localized = PRESET_REACTIONS_TRANSLATIONS[language]?.[preset.id];
              const name = localized?.name || preset.name;
              const isCurrent = reactionData.equation === preset.equation;

              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  style={{
                    background: isCurrent ? '#4E5B47' : '#FAF8F5',
                    color: isCurrent ? '#FAF8F5' : '#4E5B47',
                    border: '1.5px solid #6F7F63',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    minWidth: '200px',
                    textAlign: isRTL ? 'right' : 'left',
                    boxShadow: isCurrent ? '0 4px 12px rgba(78, 91, 71, 0.25)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <strong style={{ fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {name}
                    </strong>
                    <span style={{ fontSize: '0.7rem' }}>
                      {preset.energyType === 'exothermic' ? '🔥' : '❄️'}
                    </span>
                  </div>
                  <div className="formula-ltr" style={{ fontSize: '0.82rem', fontWeight: 700, opacity: isCurrent ? 0.95 : 0.85 }}>
                    {preset.equation}
                  </div>
                  <div style={{ fontSize: '0.72rem', opacity: isCurrent ? 0.8 : 0.7 }}>
                    {preset.reactionType}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reagents & Lab Bench Controls */}
        <div
          style={{
            background: '#FAF8F5',
            border: '1.5px solid #6F7F63',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Stockroom Quick Add Shelf */}
          <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #E2DDD3' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', letterSpacing: '0.06em' }}>
                🌿 {l('Quick Add from Stockroom Shelf:', 'Ajout Rapide depuis la Réserve :', 'إضافة سريعة من رف المواد المخبرية:')}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#6F7F63' }}>
                {l('Click any chemical to place it on the bench', 'Cliquez pour placer le réactif sur la paillasse', 'انقر على أي مادة لإضافتها إلى طاولة العمل')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {STOCKROOM_REAGENTS.map(formula => {
                const info = getReagentInfo(formula);
                const isLoaded = reactants.some(r => r.formula.toLowerCase() === formula.toLowerCase());
                return (
                  <button
                    key={formula}
                    onClick={() => handleQuickAdd(formula)}
                    disabled={isLoaded}
                    style={{
                      background: isLoaded ? '#DCE0CF' : '#FAF8F5',
                      color: isLoaded ? '#6F7F63' : '#4E5B47',
                      border: `1.5px solid ${isLoaded ? '#8FA882' : '#6F7F63'}`,
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: isLoaded ? 'default' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      opacity: isLoaded ? 0.65 : 1,
                      transition: 'all 0.15s ease'
                    }}
                    title={info.name[language] || info.name.en}
                  >
                    <span>{info.hazardIcon}</span>
                    <span className="formula-ltr">{formula}</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>{info.stateLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Reagent Form + Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Custom Input */}
            <form onSubmit={handleAddReactant} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
              <input
                type="text"
                value={newFormula}
                onChange={e => setNewFormula(e.target.value)}
                placeholder={l('Custom formula (e.g. H2SO4, AgNO3, Mg)...', 'Formule personnalisée (ex: H2SO4, AgNO3)...', 'صيغة كيميائية خاصة (مثل H2SO4, AgNO3)...')}
                className="formula-ltr"
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #6F7F63',
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.7rem 1.3rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {l('＋ Add to Bench', '＋ Poser sur la Paillasse', '＋ إضافة للطاولة')}
              </button>
            </form>

            {/* Run & Reset Controls */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handleRunReaction}
                disabled={reactants.length < 1 || status === 'running'}
                style={{
                  background: status === 'running' ? '#6F7F63' : '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.6rem',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: reactants.length >= 1 && status !== 'running' ? 'pointer' : 'not-allowed',
                  opacity: reactants.length < 1 ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(78, 91, 71, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{status === 'running' ? '⏳' : '⚗️'}</span>
                <span>
                  {status === 'running'
                    ? t.lab.runningStatus
                    : status === 'complete'
                    ? l('Re-simulate ↺', 'Relancer ↺', 'إعادة المحاكاة ↺')
                    : t.lab.runReaction}
                </span>
              </button>

              <button
                onClick={handleResetReaction}
                style={{
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  border: '1.5px solid #6F7F63',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
                title={t.lab.reset}
              >
                {t.lab.reset} ↺
              </button>
            </div>
          </div>

          {/* Active Reactants Detailed Bench Cards */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', marginBottom: '8px' }}>
              {l('Active Reactants Loaded on Bench:', 'Réactifs Actifs sur la Paillasse :', 'المتفاعلات المحملة على طاولة التجربة:')}
            </div>

            {reactants.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {reactants.map(r => {
                  const info = getReagentInfo(r.formula);
                  const localizedName = info.name[language] || info.name.en;
                  const mass = r.massGrams ?? 0;
                  const moles = info.molarMass > 0 ? (mass / info.molarMass).toFixed(3) : '—';

                  return (
                    <div
                      key={r.id}
                      style={{
                        background: '#FAF8F5',
                        border: '1.5px solid #6F7F63',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        position: 'relative'
                      }}
                    >
                      {/* Top row: Formula, State, Close */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.15rem' }}>{info.hazardIcon}</span>
                          <div>
                            <strong className="formula-ltr" style={{ fontSize: '1.1rem', color: '#4E5B47' }}>
                              {r.formula}
                            </strong>
                            <span style={{ fontSize: '0.76rem', color: '#5F6F5B', margin: '0 6px' }}>•</span>
                            <span style={{ fontSize: '0.78rem', color: '#5F6F5B' }}>{localizedName}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#DCE0CF', color: '#4E5B47', padding: '2px 8px', borderRadius: '999px' }}>
                            {info.stateLabel}
                          </span>
                          <button
                            onClick={() => handleRemoveReactant(r.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#8b4545',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              lineHeight: 1,
                              padding: '0 4px'
                            }}
                            title={l('Remove reactant', 'Supprimer le réactif', 'حذف المتفاعل')}
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {/* Middle: Molar calculations */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#EDEAE1', padding: '6px 10px', borderRadius: '8px', fontSize: '0.76rem', color: '#4E5B47' }}>
                        <div>
                          {l('Molar Mass M:', 'Masse Molaire M :', 'الكتلة المولية M:')} <strong className="formula-ltr">{info.molarMass} g/mol</strong>
                        </div>
                        <div>
                          {l('Moles n:', 'Moles n :', 'عدد المولات n:')} <strong className="formula-ltr">{moles} mol</strong>
                        </div>
                      </div>

                      {/* Bottom: Mass Stepper & Direct Input */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => handleStepMass(r.id, -5)}
                            style={{ background: '#EDEAE1', border: '1px solid #6F7F63', borderRadius: '6px', padding: '2px 7px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#4E5B47' }}
                            title="-5 g"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleStepMass(r.id, -1)}
                            style={{ background: '#EDEAE1', border: '1px solid #6F7F63', borderRadius: '6px', padding: '2px 7px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#4E5B47' }}
                            title="-1 g"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleStepMass(r.id, 1)}
                            style={{ background: '#EDEAE1', border: '1px solid #6F7F63', borderRadius: '6px', padding: '2px 7px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#4E5B47' }}
                            title="+1 g"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleStepMass(r.id, 5)}
                            style={{ background: '#EDEAE1', border: '1px solid #6F7F63', borderRadius: '6px', padding: '2px 7px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', color: '#4E5B47' }}
                            title="+5 g"
                          >
                            +5
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#5F6F5B', fontWeight: 600 }}>
                            {l('Mass:', 'Masse :', 'الكتلة:')}
                          </span>
                          <input
                            type="number"
                            value={r.massGrams}
                            onChange={e => handleMassChange(r.id, parseFloat(e.target.value) || 0)}
                            className="formula-ltr"
                            style={{
                              width: '64px',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1.5px solid #6F7F63',
                              fontSize: '0.86rem',
                              fontWeight: 700,
                              textAlign: 'right',
                              background: '#FAF8F5',
                              color: '#4E5B47',
                              outline: 'none'
                            }}
                            min="0.1"
                            step="0.5"
                          />
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4E5B47' }}>g</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', background: '#EDEAE1', borderRadius: '10px', color: '#5F6F5B' }}>
                {t.lab.emptyState}
              </div>
            )}
          </div>
        </div>

        {/* Equation Display Card */}
        <div
          style={{
            background: '#E6E2D3',
            border: '1.5px solid #6F7F63',
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            position: 'relative',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {reactionData.energyType && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                right: isRTL ? 'auto' : '16px',
                left: isRTL ? '16px' : 'auto',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: reactionData.energyType === 'exothermic' ? '#fee2e2' : '#e0e7ff',
                color: reactionData.energyType === 'exothermic' ? '#991b1b' : '#3730a3',
                border: `1px solid ${reactionData.energyType === 'exothermic' ? '#f87171' : '#818cf8'}`
              }}
            >
              {reactionData.energyType === 'exothermic' ? `🔥 ${t.lab.exothermic}` : `❄️ ${t.lab.endothermic}`} ({reactionData.deltaH})
            </span>
          )}

          <div
            className="formula-ltr"
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
              color: '#4E5B47',
              margin: '0.5rem 0',
              fontWeight: 800,
              letterSpacing: '0.02em'
            }}
          >
            {reactionData.equation || l('Add reactants to simulate chemical pathway', 'Ajoutez des réactifs pour simuler la voie chimique', 'أضف المتفاعلات لمحاكاة المسار الكيميائي')}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#5F6F5B' }}>
            {l(
              'Stoichiometrically balanced equation with mass & atom conservation check.',
              'Équation stœchiométriquement équilibrée avec vérification de la conservation de la masse.',
              'معادلة موزونة ستوكيومترياً مع التحقق من حفظ الكتلة والذرات.'
            )}
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
            onRun={handleRunReaction}
            onReset={handleResetReaction}
            onComplete={() => {
              setStatus('complete');
              confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
            }}
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
                {t.lab.reactionType}
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
                {l('Physical & Thermodynamic Conditions', 'Conditions Physiques & Thermodynamiques', 'الشروط الفيزيائية والديناميكية الحرارية')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e0ddd8', paddingBottom: '4px' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.88rem' }}>{l('Temperature', 'Température', 'درجة الحرارة')}</span>
                  <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '0.88rem' }}>{reactionData.conditions?.temperature || '—'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e0ddd8', paddingBottom: '4px' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.88rem' }}>{l('Pressure', 'Pression', 'الضغط')}</span>
                  <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '0.88rem' }}>{reactionData.conditions?.pressure || '—'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.88rem' }}>{l('Catalyst', 'Catalyseur', 'العامل الحفاز')}</span>
                  <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '0.88rem' }}>{reactionData.conditions?.catalyst || '—'}</strong>
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
                {t.lab.results}
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
                  <span>{t.lab.limitingReactant}</span>
                  <span>{openAccordion === 'limiting' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'limiting' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#4E5B47', background: '#FAF8F5' }}>
                    {reactionData.calculations?.limitingReagent ? (
                      <>
                        {l('Reactant with the lowest stoichiometric ratio: ', 'Réactif au ratio molaire le plus faible : ', 'المتفاعل ذو المكافئ المولي الأقل استهلاكاً: ')}
                        <strong className="formula-ltr">{reactionData.calculations.limitingReagent}</strong>
                      </>
                    ) : (
                      l('Run the reaction to evaluate the limiting reagent.', 'Lancez la réaction pour évaluer le réactif limitant.', 'شغّل التفاعل لحساب المتفاعل المحدِّد.')
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
                  <span>{t.lab.theoreticalYield}</span>
                  <span>{openAccordion === 'theoretical' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'theoretical' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#4E5B47', background: '#FAF8F5' }}>
                    {reactionData.calculations?.theoreticalYield ? (
                      <>
                        {l('Maximum product mass assuming 100% conversion: ', 'Masse maximale de produit pour une conversion à 100% : ', 'أقصى كتلة ناتجة بافتراض تحول بنسبة 100%: ')}
                        <strong className="formula-ltr">{reactionData.calculations.theoreticalYield}</strong>
                      </>
                    ) : (
                      l('Theoretical yield calculated upon running simulation.', 'Rendement théorique calculé lors de la simulation.', 'يتم حساب الإنتاجية النظرية عند تشغيل المحاكاة.')
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
                  <span>{l('Estimated Yield', 'Rendement Estimé', 'مردود التفاعل المقدر')}</span>
                  <span>{openAccordion === 'percent' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'percent' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.85rem', color: '#4E5B47', background: '#FAF8F5' }}>
                    {reactionData.calculations?.percentYield ? (
                      <>
                        {l('Estimated laboratory conversion efficiency: ', 'Efficacité de conversion estimée : ', 'كفاءة التحويل المخبرية التقديرية: ')}
                        <strong className="formula-ltr">{reactionData.calculations.percentYield}</strong>
                      </>
                    ) : (
                      l('Simulated percentage yield.', 'Rendement en pourcentage simulé.', 'مردود التفاعل المحاكى.')
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

