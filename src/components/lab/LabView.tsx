import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ReactantItem, ReactionStatus } from '../../types/reaction';
import {
  computeReaction,
  PRESET_REACTIONS,
  normalizeChemicalFormulaInput,
  getStoichiometricMassesForReactants
} from '../../utils/reactionEngine';
import { parseFormula } from '../../utils/formulaParser';
import { ReactionDiagram } from './ReactionDiagram';
import { useLanguage } from '../../i18n/LanguageContext';
import { PRESET_REACTIONS_TRANSLATIONS } from '../../i18n/translations/reactions';
import { getReagentInfo, STOCKROOM_REAGENTS } from '../../data/reagentsData';

export const LabView: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  const [newFormula, setNewFormula] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [reactants, setReactants] = useState<ReactantItem[]>([
    { id: '1', formula: 'H2', massGrams: 4.0 },
    { id: '2', formula: 'O2', massGrams: 32.0 }
  ]);
  const [status, setStatus] = useState<ReactionStatus>('ready');
  const [openAccordion, setOpenAccordion] = useState<string | null>('limiting');

  // Compute reaction state based on current reactants (memoized for fast renders)
  const reactionData = useMemo(() => computeReaction(reactants), [reactants]);

  const handleAddReactant = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = newFormula.trim();
    if (!raw) return;

    // Support adding a single formula OR multiple formulas separated by "+" (e.g. "CaCO3 + HCl")
    const parts = raw
      .split(/[→\->=]/)[0]
      .split('+')
      .map(p => normalizeChemicalFormulaInput(p))
      .filter(Boolean);

    if (parts.length === 0) return;

    const invalidPart = parts.find(f => !parseFormula(f));
    if (invalidPart) {
      setInputError(
        l(
          `Invalid chemical formula "${invalidPart}". Use standard element symbols (e.g. H2SO4, CaCO3, Fe).`,
          `Formule chimique invalide "${invalidPart}". Utilisez des symboles standards (ex: H2SO4, CaCO3, Fe).`,
          `صيغة كيميائية غير صالحة "${invalidPart}". يرجى استخدام رموز العناصر القياسية (مثل H2SO4, CaCO3, Fe).`
        )
      );
      return;
    }

    setInputError(null);
    let updated = [...reactants];
    parts.forEach(formula => {
      if (!updated.some(r => r.formula.toLowerCase() === formula.toLowerCase())) {
        const meta = getReagentInfo(formula);
        const defaultMass = parseFloat(Math.max(2.0, Math.min(50.0, meta.molarMass || 15)).toFixed(1));
        updated.push({
          id: crypto.randomUUID(),
          formula,
          massGrams: defaultMass
        });
      }
    });

    setReactants(updated);
    setNewFormula('');
    setStatus('ready');
  };

  const handleRemoveReactant = (id: string) => {
    const updated = reactants.filter(r => r.id !== id);
    setReactants(updated);
    setStatus(updated.length >= 1 ? 'ready' : 'idle');
  };

  const handleClearBench = () => {
    setReactants([]);
    setStatus('idle');
    setInputError(null);
  };

  const handleMassChange = (id: string, grams: number) => {
    setReactants(prev =>
      prev.map(r => (r.id === id ? { ...r, massGrams: Math.max(0.1, grams) } : r))
    );
  };

  const handleStepMass = (id: string, delta: number) => {
    setReactants(prev =>
      prev.map(r =>
        r.id === id
          ? { ...r, massGrams: Math.max(0.1, parseFloat(((r.massGrams || 0) + delta).toFixed(1))) }
          : r
      )
    );
  };

  const handleAutoBalanceMasses = () => {
    if (reactants.length < 1) return;
    const balanced = getStoichiometricMassesForReactants(reactants, reactionData.equation || '');
    setReactants(balanced);
  };

  const handleQuickAdd = (formula: string) => {
    setInputError(null);
    if (reactants.some(r => r.formula.toLowerCase() === formula.toLowerCase())) {
      return;
    }
    const meta = getReagentInfo(formula);
    const defaultMass =
      meta.state === 'gas'
        ? formula === 'H2'
          ? 4.0
          : 32.0
        : formula === 'Fe'
        ? 28.0
        : formula === 'CuSO4'
        ? 40.0
        : 15.0;
    setReactants([...reactants, { id: crypto.randomUUID(), formula, massGrams: defaultMass }]);
    setStatus('ready');
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_REACTIONS.find(p => p.id === presetId);
    if (!preset) return;
    setInputError(null);

    const newR = preset.reactants.map((f, i) => {
      let defaultMass = 15;
      if (f === 'H2') defaultMass = 4.0;
      else if (f === 'O2') defaultMass = 32.0;
      else if (f === 'CH4') defaultMass = 16.0;
      else if (f === 'N2') defaultMass = 28.0;
      else if (f === 'HCl') defaultMass = 36.5;
      else if (f === 'NaOH') defaultMass = 40.0;
      else if (f === 'Fe') defaultMass = 28.0;
      else if (f === 'CuSO4') defaultMass = 80.0;
      else if (f === 'H2O2') defaultMass = 34.0;
      else if (f === 'Al') defaultMass = 27.0;
      else if (f === 'Fe2O3') defaultMass = 80.0;
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
    if (status === 'complete' || status === 'running') {
      setStatus('ready');
      setTimeout(() => setStatus('running'), 40);
    } else {
      setStatus('running');
    }
  };

  const handlePauseToggle = () => {
    setStatus(prev => (prev === 'running' ? 'paused' : prev === 'paused' ? 'running' : prev));
  };

  const handleResetReaction = () => {
    setStatus('ready');
  };

  const isStoichBalanced = reactionData.calculations?.isStoichiometricBalance;

  return (
    <div className="lab-page" style={{ minHeight: '100vh', paddingBottom: '5rem', paddingTop: '100px' }}>
      {/* Header */}
      <section style={{ textAlign: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
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
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            color: '#4E5B47',
            marginBottom: '0.75rem'
          }}
        >
          {t.lab.title}
        </h1>
        <p style={{ color: '#5F6F5B', maxWidth: '640px', margin: '0 auto', fontSize: '1.02rem', lineHeight: 1.6 }}>
          {t.lab.subtitle}
        </p>
      </section>

      {/* Main Lab Container */}
      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Preset Selector Banner */}
        <div
          style={{
            background: '#DCE0CF',
            border: '1.5px solid #6F7F63',
            borderRadius: '16px',
            padding: '1.15rem',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.3rem' }}>⚗️</span>
              <div>
                <strong style={{ color: '#4E5B47', fontSize: '0.98rem' }}>
                  {l('Preset Reactions Library', 'Bibliothèque de Réactions Modèles', 'مكتبة التفاعلات الكيميائية النموذجية')}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#5F6F5B', display: 'block' }}>
                  {l(
                    'Select any standard chemical pathway to automatically load stoichiometric reactants on the bench',
                    'Sélectionnez une réaction modèle pour charger automatiquement les réactifs sur la paillasse',
                    'اختر تفاعلاً قياسياً لتحميل المتفاعلات والكميات تلقائياً على طاولة المختبر'
                  )}
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4E5B47', background: '#FAF8F5', border: '1px solid #6F7F63', padding: '3px 10px', borderRadius: '999px' }}>
              8 {l('Standard Reactions', 'Réactions Types', 'تفاعلات نموذجية')}
            </span>
          </div>

          {/* Presets Horizontal Scroll */}
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
                    minWidth: '195px',
                    textAlign: isRTL ? 'right' : 'left',
                    boxShadow: isCurrent ? '0 4px 12px rgba(78, 91, 71, 0.25)' : 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <strong style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {name}
                    </strong>
                    <span style={{ fontSize: '0.7rem' }}>
                      {preset.energyType === 'exothermic' ? '🔥' : '❄️'}
                    </span>
                  </div>
                  <div className="formula-ltr" style={{ fontSize: '0.8rem', fontWeight: 700, opacity: isCurrent ? 0.95 : 0.85 }}>
                    {preset.equation}
                  </div>
                  <div style={{ fontSize: '0.71rem', opacity: isCurrent ? 0.8 : 0.7 }}>
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
            padding: '1.15rem',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Stockroom Quick Add Shelf */}
          <div style={{ marginBottom: '1.15rem', paddingBottom: '0.9rem', borderBottom: '1px solid #E2DDD3' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', letterSpacing: '0.06em' }}>
                🌿 {l('Quick Add from Stockroom Shelf:', 'Ajout Rapide depuis la Réserve :', 'إضافة سريعة من رف المواد المخبرية:')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: '#6F7F63' }}>
                  {l('Click any chemical to place it on the bench', 'Cliquez pour placer le réactif sur la paillasse', 'انقر على أي مادة لإضافتها إلى طاولة العمل')}
                </span>
                {reactants.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearBench}
                    style={{
                      background: 'none',
                      border: '1px dashed #8b4545',
                      color: '#8b4545',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {l('Clear Bench ×', 'Vider la Paillasse ×', 'تفريغ الطاولة ×')}
                  </button>
                )}
              </div>
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
                      fontSize: '0.78rem',
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
                    <span style={{ fontSize: '0.66rem', opacity: 0.8 }}>{info.stateLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Reagent Form + Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: inputError ? '0.5rem' : '1.15rem' }}>
            {/* Custom Input */}
            <form onSubmit={handleAddReactant} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '240px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newFormula}
                onChange={e => {
                  setNewFormula(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder={l(
                  'Enter formula or pair (e.g. CaCO3 + HCl, AgNO3 + NaCl, Mg)...',
                  'Formule ou paire (ex: CaCO3 + HCl, AgNO3 + NaCl, Mg)...',
                  'أدخل صيغة أو متفاعلين (مثل CaCO3 + HCl أو AgNO3 + NaCl)...'
                )}
                className="formula-ltr"
                style={{
                  flex: 1,
                  minWidth: '170px',
                  padding: '0.68rem 0.9rem',
                  borderRadius: '10px',
                  border: `1.5px solid ${inputError ? '#DC2626' : '#6F7F63'}`,
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  fontSize: '0.9rem',
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
                  padding: '0.68rem 1.15rem',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'nowrap'
                }}
              >
                {l('＋ Add to Bench', '＋ Poser sur la Paillasse', '＋ إضافة للطاولة')}
              </button>
            </form>

            {/* Run, Pause, Auto-Balance & Reset Controls */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {reactants.length > 1 && (
                <button
                  type="button"
                  onClick={handleAutoBalanceMasses}
                  style={{
                    background: isStoichBalanced ? '#DCFCE7' : '#EDEAE1',
                    color: isStoichBalanced ? '#15803D' : '#4E5B47',
                    border: `1.5px solid ${isStoichBalanced ? '#16A34A' : '#6F7F63'}`,
                    borderRadius: '10px',
                    padding: '0.68rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  title={l(
                    'Automatically set reactant masses to exact stoichiometric molar ratios',
                    'Ajuster automatiquement les masses aux proportions stœchiométriques exactes',
                    'ضبط كتل المتفاعلات تلقائياً وفق النسب المولية الستوكيومترية الدقيقة'
                  )}
                >
                  <span>⚖️</span>
                  <span>
                    {isStoichBalanced
                      ? l('Stoichiometric ✓', 'Stœchiométrique ✓', 'متكافئ مولياً ✓')
                      : l('Auto-Balance Masses', 'Équilibrer Masses', 'موازنة الكتل تلقائياً')}
                  </span>
                </button>
              )}

              <button
                onClick={handleRunReaction}
                disabled={reactants.length < 1 || status === 'running'}
                style={{
                  background: status === 'running' ? '#6F7F63' : status === 'complete' ? '#15803D' : '#4E5B47',
                  color: '#FAF8F5',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.7rem 1.4rem',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: reactants.length >= 1 && status !== 'running' ? 'pointer' : 'not-allowed',
                  opacity: reactants.length < 1 ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(78, 91, 71, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{status === 'running' ? '⏳' : status === 'complete' ? '↺' : '⚗️'}</span>
                <span>
                  {status === 'running'
                    ? t.lab.runningStatus
                    : status === 'complete'
                    ? l('Rerun Test', 'Relancer le Test', 'إعادة الاختبار')
                    : t.lab.runReaction}
                </span>
              </button>

              {(status === 'running' || status === 'paused') && (
                <button
                  onClick={handlePauseToggle}
                  style={{
                    background: status === 'paused' ? '#15803D' : '#D97706',
                    color: '#FAF8F5',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.7rem 1rem',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {status === 'paused' ? l('▶ Resume', '▶ Reprendre', '▶ استئناف') : l('⏸ Pause', '⏸ Pause', '⏸ إيقاف مؤقت')}
                </button>
              )}

              <button
                onClick={handleResetReaction}
                style={{
                  background: '#FAF8F5',
                  color: '#4E5B47',
                  border: '1.5px solid #6F7F63',
                  borderRadius: '10px',
                  padding: '0.7rem 0.95rem',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
                title={t.lab.reset}
              >
                {t.lab.reset} ↺
              </button>
            </div>
          </div>

          {inputError && (
            <div
              style={{
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1rem'
              }}
            >
              ⚠️ {inputError}
            </div>
          )}

          {/* Active Reactants Detailed Bench Cards */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', marginBottom: '8px' }}>
              {l('Active Reactants Loaded on Bench:', 'Réactifs Actifs sur la Paillasse :', 'المتفاعلات المحملة على طاولة التجربة:')}
            </div>

            {reactants.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {reactants.map(r => {
                  const info = getReagentInfo(r.formula);
                  const localizedName = info.name[language] || info.name.en;
                  const mass = r.massGrams ?? 0;
                  const moles = info.molarMass > 0 ? (mass / info.molarMass).toFixed(3) : '—';
                  const stoichDetail = reactionData.calculations?.reactantDetails?.find(
                    d => d.formula.toLowerCase() === r.formula.toLowerCase()
                  );

                  return (
                    <div
                      key={r.id}
                      style={{
                        background: '#FAF8F5',
                        border: `1.5px solid ${stoichDetail?.isLimiting ? '#D97706' : '#6F7F63'}`,
                        borderRadius: '12px',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        position: 'relative'
                      }}
                    >
                      {/* Top row: Formula, State, Role Badge, Close */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                          <span style={{ fontSize: '1.1rem' }}>{info.hazardIcon}</span>
                          <strong className="formula-ltr" style={{ fontSize: '1.05rem', color: '#4E5B47' }}>
                            {r.formula}
                          </strong>
                          <span style={{ fontSize: '0.76rem', color: '#5F6F5B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            • {localizedName}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          {stoichDetail && reactants.length > 1 && (
                            <span
                              style={{
                                fontSize: '0.66rem',
                                fontWeight: 800,
                                background: isStoichBalanced ? '#DCFCE7' : stoichDetail.isLimiting ? '#FEF3C7' : '#EDEAE1',
                                color: isStoichBalanced ? '#15803D' : stoichDetail.isLimiting ? '#B45309' : '#4E5B47',
                                padding: '2px 7px',
                                borderRadius: '999px',
                                border: `1px solid ${isStoichBalanced ? '#86EFAC' : stoichDetail.isLimiting ? '#FCD34D' : '#6F7F63'}`
                              }}
                            >
                              {isStoichBalanced
                                ? l('Stoichiometric', 'Stœchiométrique', 'متكافئ')
                                : stoichDetail.isLimiting
                                ? l('Limiting', 'Limitant', 'محدِّد')
                                : l('Excess', 'Excès', 'فائض')}
                            </span>
                          )}
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#DCE0CF', color: '#4E5B47', padding: '2px 7px', borderRadius: '999px' }}>
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
                      <div style={{ display: 'flex', justifyContent: 'space-between', background: '#EDEAE1', padding: '5px 10px', borderRadius: '8px', fontSize: '0.75rem', color: '#4E5B47', flexWrap: 'wrap', gap: '6px' }}>
                        <div>
                          {l('Molar Mass M:', 'Masse Molaire M :', 'الكتلة المولية M:')} <strong className="formula-ltr">{info.molarMass} g/mol</strong>
                        </div>
                        <div>
                          {l('Moles n:', 'Moles n :', 'عدد المولات n:')} <strong className="formula-ltr">{moles} mol</strong>
                        </div>
                      </div>

                      {/* Bottom: Mass Stepper & Direct Input */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {[-5, -1, 1, 5].map(delta => (
                            <button
                              key={delta}
                              type="button"
                              onClick={() => handleStepMass(r.id, delta)}
                              style={{
                                background: '#EDEAE1',
                                border: '1px solid #6F7F63',
                                borderRadius: '6px',
                                padding: '3px 8px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: '#4E5B47'
                              }}
                              title={`${delta > 0 ? '+' : ''}${delta} g`}
                            >
                              {delta > 0 ? `+${delta}` : delta}
                            </button>
                          ))}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.76rem', color: '#5F6F5B', fontWeight: 600 }}>
                            {l('Mass:', 'Masse :', 'الكتلة:')}
                          </span>
                          <input
                            type="number"
                            value={r.massGrams}
                            onChange={e => handleMassChange(r.id, parseFloat(e.target.value) || 0)}
                            className="formula-ltr"
                            style={{
                              width: '68px',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1.5px solid #6F7F63',
                              fontSize: '0.85rem',
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

        {/* Equation Display Card (Responsive non-overlapping header + formula) */}
        <div
          style={{
            background: '#E6E2D3',
            border: '1.5px solid #6F7F63',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            textAlign: 'center',
            marginBottom: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5F6F5B' }}>
              {t.lab.balancedEquation}
            </span>
            {reactionData.energyType && (
              <span
                style={{
                  padding: '3px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
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
          </div>

          <div
            className="formula-ltr"
            style={{
              fontSize: 'clamp(1.35rem, 3.5vw, 2.3rem)',
              color: '#4E5B47',
              fontWeight: 800,
              letterSpacing: '0.02em',
              wordBreak: 'break-word',
              maxWidth: '100%'
            }}
          >
            {reactionData.equation ||
              l(
                'Add reactants to simulate chemical pathway',
                'Ajoutez des réactifs pour simuler la voie chimique',
                'أضف المتفاعلات لمحاكاة المسار الكيميائي'
              )}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#5F6F5B' }}>
            {l(
              'Stoichiometrically balanced equation with mass & atom conservation check.',
              'Équation stœchiométriquement équilibrée avec vérification de la conservation de la masse.',
              'معادلة موزونة ستوكيومترياً مع التحقق من حفظ الكتلة والذرات.'
            )}
          </div>
        </div>

        {/* Bottom Grid: Left Diagram + Right Info Panels */}
        <div className="lab-main-grid">
          {/* Reaction Diagram - Multi-Stage Chemical Simulator */}
          <ReactionDiagram
            status={status}
            equation={reactionData.equation || ''}
            reactionType={reactionData.reactionType}
            energyType={reactionData.energyType}
            deltaH={reactionData.deltaH}
            conditions={reactionData.conditions}
            reactants={reactants}
            onRun={handleRunReaction}
            onPauseToggle={handlePauseToggle}
            onReset={handleResetReaction}
            onAutoBalance={handleAutoBalanceMasses}
            onComplete={() => {
              setStatus('complete');
              confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
            }}
          />

          {/* Right Info Panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
            {/* Reaction Type */}
            <div
              style={{
                background: '#FAF8F5',
                border: '1.5px solid #6F7F63',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem'
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block' }}>
                {t.lab.reactionType}
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#4E5B47', marginTop: '4px' }}>
                {reactionData.reactionType || '—'}
              </div>
            </div>

            {/* Required Conditions */}
            <div
              style={{
                background: '#FAF8F5',
                border: '1.5px solid #6F7F63',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem'
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '0.5rem' }}>
                {l('Physical & Thermodynamic Conditions', 'Conditions Physiques & Thermodynamiques', 'الشروط الفيزيائية والديناميكية الحرارية')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e0ddd8', paddingBottom: '4px', gap: '8px' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.86rem' }}>{l('Temperature', 'Température', 'درجة الحرارة')}</span>
                  <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '0.86rem' }}>{reactionData.conditions?.temperature || '—'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e0ddd8', paddingBottom: '4px', gap: '8px' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.86rem' }}>{l('Pressure', 'Pression', 'الضغط')}</span>
                  <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '0.86rem' }}>{reactionData.conditions?.pressure || '—'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                  <span style={{ color: '#5F6F5B', fontSize: '0.86rem' }}>{l('Catalyst', 'Catalyseur', 'العامل الحفاز')}</span>
                  <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '0.86rem' }}>{reactionData.conditions?.catalyst || '—'}</strong>
                </div>
              </div>
            </div>

            {/* Stoichiometry Calculations Accordion */}
            <div
              style={{
                background: '#FAF8F5',
                border: '1.5px solid #6F7F63',
                borderRadius: '12px',
                padding: '1.1rem 1.25rem',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#5F6F5B', display: 'block', marginBottom: '0.25rem' }}>
                {t.lab.results}
              </span>

              {/* Limiting & Excess Reagents */}
              <div style={{ border: '1px solid #6F7F63', borderRadius: '8px', overflow: 'hidden' }}>
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
                    fontWeight: 700,
                    color: '#4E5B47',
                    cursor: 'pointer',
                    fontSize: '0.84rem'
                  }}
                >
                  <span>{t.lab.limitingReactant} & {t.lab.excessReactant}</span>
                  <span>{openAccordion === 'limiting' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'limiting' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.82rem', color: '#4E5B47', background: '#FAF8F5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {reactionData.calculations?.limitingReagent ? (
                      <>
                        <div>
                          <span style={{ color: '#5F6F5B', fontWeight: 600 }}>{t.lab.limitingReactant}: </span>
                          <strong className="formula-ltr" style={{ color: '#B45309' }}>
                            {reactionData.calculations.limitingReagent}
                          </strong>
                        </div>
                        {reactionData.calculations.excessReagent && (
                          <div>
                            <span style={{ color: '#5F6F5B', fontWeight: 600 }}>{t.lab.excessReactant}: </span>
                            <strong className="formula-ltr" style={{ color: '#4E5B47' }}>
                              {reactionData.calculations.excessReagent}
                            </strong>
                          </div>
                        )}
                      </>
                    ) : (
                      l('Add reactants to evaluate limiting and excess reagents.', 'Ajoutez des réactifs pour évaluer le réactif limitant.', 'أضف المتفاعلات لحساب المتفاعل المحدِّد والفائض.')
                    )}
                  </div>
                )}
              </div>

              {/* Theoretical Yield & Product Breakdown */}
              <div style={{ border: '1px solid #6F7F63', borderRadius: '8px', overflow: 'hidden' }}>
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
                    fontWeight: 700,
                    color: '#4E5B47',
                    cursor: 'pointer',
                    fontSize: '0.84rem'
                  }}
                >
                  <span>{t.lab.theoreticalYield}</span>
                  <span>{openAccordion === 'theoretical' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'theoretical' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.82rem', color: '#4E5B47', background: '#FAF8F5', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {reactionData.calculations?.productDetails && reactionData.calculations.productDetails.length > 0 ? (
                      <>
                        {reactionData.calculations.productDetails.map((p, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #E2DDD3', paddingBottom: '4px' }}>
                            <span className="formula-ltr" style={{ fontWeight: 700 }}>
                              {p.coeff > 1 ? `${p.coeff} ` : ''}{p.formula} <span style={{ fontSize: '0.72rem', opacity: 0.75 }}>{p.stateLabel}</span>
                            </span>
                            <strong className="formula-ltr" style={{ color: '#15803D' }}>
                              {p.theoreticalGrams.toFixed(2)} g ({p.theoreticalMoles.toFixed(3)} mol)
                            </strong>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '2px', fontWeight: 800 }}>
                          <span>{l('Total Formed Products:', 'Total des Produits Formés :', 'إجمالي النواتج المتكونة:')}</span>
                          <span className="formula-ltr">{(reactionData.calculations.totalProductMass ?? 0).toFixed(2)} g</span>
                        </div>
                      </>
                    ) : (
                      l('Theoretical yield calculated upon selecting a reaction.', 'Rendement théorique calculé lors de la sélection.', 'يتم حساب الإنتاجية النظرية عند اختيار التفاعل.')
                    )}
                  </div>
                )}
              </div>

              {/* Percent Yield & Mass Balance */}
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
                    fontWeight: 700,
                    color: '#4E5B47',
                    cursor: 'pointer',
                    fontSize: '0.84rem'
                  }}
                >
                  <span>{l('Mass Balance & Efficiency', 'Bilan Massique & Rendement', 'توازن الكتلة وكفاءة التفاعل')}</span>
                  <span>{openAccordion === 'percent' ? '▾' : '▸'}</span>
                </button>
                {openAccordion === 'percent' && (
                  <div style={{ padding: '10px 12px', fontSize: '0.82rem', color: '#4E5B47', background: '#FAF8F5', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {reactionData.calculations?.percentYield ? (
                      <>
                        <div>
                          {l('Conversion Efficiency: ', 'Efficacité de conversion : ', 'كفاءة التحويل المخبرية: ')}
                          <strong className="formula-ltr">{reactionData.calculations.percentYield}</strong>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#5F6F5B', marginTop: '2px' }}>
                          {l('Total Input:', 'Masse Entrante :', 'الكتلة الداخلة:')}{' '}
                          <strong className="formula-ltr">{(reactionData.calculations.totalInputMass ?? 0).toFixed(2)} g</strong> ={' '}
                          {l('Products', 'Produits', 'النواتج')}{' '}
                          <strong className="formula-ltr">{(reactionData.calculations.totalProductMass ?? 0).toFixed(2)} g</strong> +{' '}
                          {l('Unreacted', 'Excès', 'الفائض')}{' '}
                          <strong className="formula-ltr">{(reactionData.calculations.totalRemainingMass ?? 0).toFixed(2)} g</strong>
                        </div>
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
