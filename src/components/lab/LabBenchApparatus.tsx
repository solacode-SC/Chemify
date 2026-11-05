import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ReactantItem, ReactionStatus } from '../../types/reaction';
import { getReagentInfo, ReagentMeta } from '../../data/reagentsData';
import { calculateMolarMass } from '../../utils/formulaParser';
import {
  resolveStoichiometricProfile,
  normalizeFormulaSubscripts,
  StoichSpecies,
  StoichiometricReactionProfile
} from '../../utils/reactionEngine';
import { useLanguage } from '../../i18n/LanguageContext';

interface LabBenchApparatusProps {
  status: ReactionStatus;
  equation: string;
  reactionType?: string;
  energyType?: 'exothermic' | 'endothermic' | null;
  deltaH?: string;
  conditions?: { temperature: string | null; pressure: string | null; catalyst: string | null };
  reactants: ReactantItem[];
  onRun?: () => void;
  onReset?: () => void;
  onComplete?: () => void;
  simSpeed: 1 | 2;
  onToggleSpeed: () => void;
  onSwitchToMolecular: () => void;
}

export const LabBenchApparatus: React.FC<LabBenchApparatusProps> = ({
  status,
  equation,
  reactionType,
  energyType,
  deltaH,
  conditions,
  reactants,
  onRun,
  onReset,
  onComplete,
  simSpeed,
  onToggleSpeed,
  onSwitchToMolecular
}) => {
  const { language, isRTL } = useLanguage();
  const l = (en: string, fr: string, ar: string) => (language === 'ar' ? ar : language === 'fr' ? fr : en);

  // Resolve stoichiometric profile respecting the reaction equation
  const profile: StoichiometricReactionProfile = useMemo(
    () => resolveStoichiometricProfile(equation),
    [equation]
  );

  // Dynamic simulation telemetry
  const [temperature, setTemperature] = useState<number>(25);
  const [stirrerActive, setStirrerActive] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(status === 'complete' ? 100 : 0);

  // Peak temperature based on stoichiometric profile
  const targetTemp = profile.tempPeak || (energyType === 'exothermic' ? 180 : 18);
  const baseTemp = profile.tempBase || 25;

  // Track progress and update live telemetry
  useEffect(() => {
    let interval: any;
    if (status === 'running') {
      setStirrerActive(true);
      let p = 0;
      interval = setInterval(() => {
        p += 1.8 * simSpeed;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setStirrerActive(false);
          setProgress(100);
          setTemperature(targetTemp);
          if (onComplete) {
            onComplete();
          }
        } else {
          setProgress(p);
          const curT = baseTemp + (targetTemp - baseTemp) * (p / 100);
          setTemperature(Math.round(curT));
        }
      }, 40);
    } else if (status === 'complete') {
      setProgress(100);
      setStirrerActive(false);
      setTemperature(targetTemp);
    } else {
      setProgress(0);
      setStirrerActive(false);
      setTemperature(baseTemp);
    }
    return () => clearInterval(interval);
  }, [status, simSpeed, targetTemp, baseTemp, onComplete]);

  // Handle Rerun Test directly from apparatus
  const handleRerunTest = () => {
    setProgress(0);
    setTemperature(baseTemp);
    setStirrerActive(true);
    if (onRun) {
      onRun();
    }
  };

  // Handle Run Test directly from apparatus
  const handleRunTest = () => {
    if (onRun) {
      onRun();
    }
  };

  // Handle Reset Setup directly from apparatus
  const handleResetSetup = () => {
    setProgress(0);
    setTemperature(baseTemp);
    setStirrerActive(false);
    if (onReset) {
      onReset();
    }
  };

  // Total initial mass on bench
  const totalReactantMass = useMemo(() => {
    return reactants.reduce((sum, r) => sum + (r.massGrams || 0), 0);
  }, [reactants]);

  // Stoichiometric calculations for Reactants & Products
  const { stoichReactants, stoichProducts, totalMass } = useMemo(() => {
    // Determine reactants data
    const rList = profile.reactants.map(spec => {
      const normalizedKey = normalizeFormulaSubscripts(spec.specKey);
      const userReactant = reactants.find(
        r => normalizeFormulaSubscripts(r.formula).toLowerCase() === normalizedKey.toLowerCase()
      );
      const meta = getReagentInfo(spec.specKey);
      const initialMass = userReactant?.massGrams ?? (spec.coeff * 10);
      const mw = meta.molarMass > 0 ? meta.molarMass : (calculateMolarMass(spec.specKey) || 1);
      const initialMoles = initialMass / mw;
      const ratio = initialMoles / Math.max(1, spec.coeff);
      return {
        spec,
        meta,
        initialMass,
        mw,
        initialMoles,
        ratio
      };
    });

    // Limiting batch factor
    const limitingRatio = rList.length > 0 ? Math.min(...rList.map(r => r.ratio)) : 1;

    // Build finalized reactants with remaining amount based on progress
    const computedReactants = rList.map(r => {
      const consumedMoles = limitingRatio * r.spec.coeff * (progress / 100);
      const consumedMass = consumedMoles * r.mw;
      const remainingMass = Math.max(0, r.initialMass - consumedMass);
      const remainingMoles = remainingMass / r.mw;
      return {
        ...r,
        remainingMass,
        remainingMoles,
        fillPercent: Math.max(8, Math.round(100 - (consumedMass / Math.max(0.1, r.initialMass)) * 92))
      };
    });

    // Determine products data
    const computedProducts = profile.products.map(spec => {
      const meta = getReagentInfo(spec.specKey);
      const mw = meta.molarMass > 0 ? meta.molarMass : (calculateMolarMass(spec.specKey) || 1);
      const theoreticalMoles = limitingRatio * spec.coeff;
      const theoreticalMass = theoreticalMoles * mw;
      const currentMass = theoreticalMass * (progress / 100);
      const currentMoles = theoreticalMoles * (progress / 100);
      return {
        spec,
        meta,
        mw,
        theoreticalMoles,
        theoreticalMass,
        currentMass,
        currentMoles,
        fillPercent: Math.max(5, Math.round((progress / 100) * 85))
      };
    });

    // Sum masses for mass conservation display
    const finalTotalMass = totalReactantMass > 0
      ? totalReactantMass
      : computedReactants.reduce((s, r) => s + r.initialMass, 0);

    return {
      stoichReactants: computedReactants,
      stoichProducts: computedProducts,
      totalMass: finalTotalMass
    };
  }, [profile, reactants, totalReactantMass, progress]);

  // Reaction vessel fluid color progression matching specific reaction chemistry
  const getFluidColor = () => {
    const eq = equation.toLowerCase();
    const p = progress;

    if (eq.includes('cuso') || (eq.includes('cu') && eq.includes('fe'))) {
      // Single displacement: Cobalt blue (#0284C7) -> Turquoise (#0D9488) -> Pale Green (#10B981)
      if (p < 25) return '#0284C7';
      if (p < 65) return '#0D9488';
      return '#10B981';
    }

    if (eq.includes('al') && (eq.includes('fe2o3') || eq.includes('fe₂o₃'))) {
      // Thermite: Dark rust (#7C2D12) -> Molten incandescent glowing orange-white
      if (p < 20) return '#7C2D12';
      if (p < 75) return '#EA580C';
      return '#F59E0B';
    }

    if (eq.includes('hcl') || eq.includes('naoh') || eq.includes('neutralization')) {
      // Neutralization: Transparent aqueous with slight warmth tint
      return 'rgba(219, 234, 254, 0.65)';
    }

    if (eq.includes('ch4') || eq.includes('ch₄')) {
      // Methane combustion: incandescent blue-orange core
      return 'rgba(254, 240, 138, 0.75)';
    }

    if (eq.includes('h2o2') || eq.includes('h₂o₂')) {
      // Peroxide decomposition: effervescent frothy pale cyan/white
      return 'rgba(224, 242, 254, 0.88)';
    }

    if (eq.includes('caco3') || eq.includes('caco₃')) {
      // Limestone Calcination: milky white calcining suspension
      return 'rgba(243, 244, 246, 0.85)';
    }

    if (eq.includes('nh3') || eq.includes('nh₃') || (eq.includes('n2') && eq.includes('h2'))) {
      // Haber-Bosch Ammonia: cool light sky blue
      return 'rgba(186, 230, 253, 0.7)';
    }

    // Default synthesis / general
    return 'rgba(219, 234, 254, 0.7)';
  };

  const fluidColor = getFluidColor();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '620px',
        background: 'linear-gradient(180deg, #FAF8F5 0%, #EDEAE1 55%, #E2DDD3 100%)',
        borderRadius: '16px',
        border: '1.5px solid #6F7F63',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 1. TOP BENCH CONTROLS & APPARATUS HEADER */}
      <div
        style={{
          background: 'rgba(220, 224, 207, 0.82)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1.5px solid #6F7F63',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          zIndex: 10
        }}
      >
        {/* Title & Live Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#4E5B47',
              color: '#FAF8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0
            }}
          >
            🧪
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <strong style={{ color: '#4E5B47', fontSize: '1rem', fontWeight: 800, lineHeight: 1.2 }}>
                {l('Chemistry Lab Bench — Live Apparatus', 'Paillasse de Laboratoire — Montage Réel', 'طاولة المختبر الكيميائي — التجربة الحية')}
              </strong>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '2px 9px',
                  borderRadius: '999px',
                  background: status === 'complete' ? '#DCFCE7' : status === 'running' ? '#FEF3C7' : '#E2DDD3',
                  color: status === 'complete' ? '#15803D' : status === 'running' ? '#B45309' : '#5F6F5B',
                  border: `1px solid ${status === 'complete' ? '#86EFAC' : status === 'running' ? '#FCD34D' : '#6F7F63'}`
                }}
              >
                {status === 'complete'
                  ? l('✓ Complete', '✓ Terminé', '✓ مكتمل')
                  : status === 'running'
                  ? l(`⚡ Active ${Math.round(progress)}%`, `⚡ En cours ${Math.round(progress)}%`, `⚡ جاري ${Math.round(progress)}%`)
                  : l('● Ready', '● Prêt', '● جاهز')}
              </span>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#5F6F5B' }}>
              {l(
                'Precision glassware, dynamic thermal reaction & mass conservation',
                'Verrerie de précision, réaction thermique et conservation de la masse',
                'أدوات زجاجية دقيقة، تفاعل حراري وحفظ تام للكتلة'
              )}
            </span>
          </div>
        </div>

        {/* Bench Actions: Rerun Test, Run Test, Reset, Speed, Molecular View */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Prominent RERUN TEST button when complete */}
          {status === 'complete' && (
            <button
              onClick={handleRerunTest}
              style={{
                background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                color: '#FFFFFF',
                border: '1.5px solid #166534',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(21, 128, 61, 0.35)',
                transition: 'all 0.2s ease'
              }}
              title={l('Rerun this chemical reaction test from the beginning', 'Relancer ce test de réaction depuis le début', 'إعادة إجراء هذا الاختبار الكيميائي من البداية')}
            >
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>↺</span>
              <span>{l('Rerun Test', 'Relancer le Test', 'إعادة الاختبار')}</span>
            </button>
          )}

          {/* RUN TEST button when ready / idle */}
          {status !== 'complete' && status !== 'running' && (
            <button
              onClick={handleRunTest}
              disabled={reactants.length < 1}
              style={{
                background: '#4E5B47',
                color: '#FAF8F5',
                border: '1.5px solid #4E5B47',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: reactants.length >= 1 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(78, 91, 71, 0.25)',
                opacity: reactants.length < 1 ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
              title={l('Start reaction simulation', 'Lancer la simulation de la réaction', 'تشغيل محاكاة التفاعل')}
            >
              <span>▶</span>
              <span>{l('Run Test', 'Lancer le Test', 'تشغيل الاختبار')}</span>
            </button>
          )}

          {/* RESET SETUP button */}
          <button
            onClick={handleResetSetup}
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#4E5B47',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={l('Reset reaction setup to initial state', 'Réinitialiser le montage', 'إعادة ضبط التجربة')}
          >
            <span>↺</span>
            <span>{l('Reset', 'Réinitialiser', 'إعادة ضبط')}</span>
          </button>

          {/* Simulation Speed Toggle */}
          <button
            onClick={onToggleSpeed}
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#4E5B47',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
            title={l('Simulation Speed', 'Vitesse de Simulation', 'سرعة المحاكاة')}
          >
            ⚡ {simSpeed}x {l('Speed', 'Vitesse', 'سرعة')}
          </button>

          {/* Switch to Molecular Field */}
          <button
            onClick={onSwitchToMolecular}
            style={{
              background: '#FAF8F5',
              color: '#4E5B47',
              border: '1.5px solid #6F7F63',
              borderRadius: '999px',
              padding: '5px 13px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.2s ease'
            }}
            title={l('Switch to atomic & molecular bonds view', 'Basculer vers la vue moléculaire atomique', 'التبديل إلى حقل الجزيئات والذرات')}
          >
            <span>🔬</span>
            <span>{l('Molecular View', 'Vue Moléculaire', 'حقل الجزيئات')}</span>
          </button>
        </div>
      </div>

      {/* 2. REACTION EQUATION RIBBON (RESPECTING THE REACTION EQUATION) */}
      <div
        style={{
          background: '#FAF8F5',
          borderBottom: '1.5px solid #6F7F63',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        {/* Left: Reaction Equation with Reactants -> Arrow -> Products */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5F6F5B' }}>
            {l('Reaction Equation:', 'Équation de Réaction :', 'معادلة التفاعل الكيميائي:')}
          </span>

          <div className="formula-ltr" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {/* Reactants side chips */}
            {stoichReactants.map((r, i) => (
              <React.Fragment key={r.spec.specKey || i}>
                {i > 0 && <span style={{ color: '#6F7F63', fontWeight: 700, margin: '0 2px' }}>+</span>}
                <span
                  style={{
                    background: '#EDEAE1',
                    border: '1px solid #6F7F63',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: '#4E5B47',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {r.spec.coeff > 1 && <span style={{ color: '#D97706', fontWeight: 900 }}>{r.spec.coeff}</span>}
                  <span>{r.spec.formula}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.75, fontWeight: 600 }}>{r.meta.stateLabel}</span>
                </span>
              </React.Fragment>
            ))}

            {/* Reaction arrow with conditions */}
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 6px' }}>
              {conditions?.catalyst && (
                <span style={{ fontSize: '0.62rem', color: '#5F6F5B', fontWeight: 700, lineHeight: 1 }}>
                  {conditions.catalyst}
                </span>
              )}
              <span
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: status === 'running' ? '#D97706' : '#4E5B47',
                  lineHeight: 1
                }}
              >
                ➔
              </span>
              {conditions?.temperature && (
                <span style={{ fontSize: '0.62rem', color: '#5F6F5B', fontWeight: 700, lineHeight: 1 }}>
                  {conditions.temperature}
                </span>
              )}
            </div>

            {/* Products side chips */}
            {stoichProducts.map((p, i) => (
              <React.Fragment key={p.spec.specKey || i}>
                {i > 0 && <span style={{ color: '#6F7F63', fontWeight: 700, margin: '0 2px' }}>+</span>}
                <span
                  style={{
                    background: status === 'complete' ? '#DCFCE7' : '#EDEAE1',
                    border: `1px solid ${status === 'complete' ? '#86EFAC' : '#6F7F63'}`,
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '0.86rem',
                    fontWeight: 800,
                    color: status === 'complete' ? '#15803D' : '#4E5B47',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {p.spec.coeff > 1 && <span style={{ color: '#2563EB', fontWeight: 900 }}>{p.spec.coeff}</span>}
                  <span>{p.spec.formula}</span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.75, fontWeight: 600 }}>{p.meta.stateLabel}</span>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: Enthalpy & Reaction Type Badges */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              background: energyType === 'exothermic' ? '#FEE2E2' : '#EFF6FF',
              color: energyType === 'exothermic' ? '#DC2626' : '#2563EB',
              border: `1px solid ${energyType === 'exothermic' ? '#FCA5A5' : '#BFDBFE'}`,
              padding: '2px 8px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{energyType === 'exothermic' ? '🔥' : '❄️'}</span>
            <span className="formula-ltr">ΔH: {deltaH || (energyType === 'exothermic' ? '-483.6 kJ/mol' : '+178.0 kJ/mol')}</span>
          </span>

          {reactionType && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                background: '#DCE0CF',
                color: '#4E5B47',
                border: '1px solid #6F7F63',
                padding: '2px 8px',
                borderRadius: '999px'
              }}
            >
              {reactionType}
            </span>
          )}
        </div>
      </div>

      {/* 3. MAIN LABORATORY WORKSTATION (TRI-ZONE LAYOUT) */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 1fr) minmax(320px, 1.4fr) minmax(200px, 1fr)',
          gap: '12px',
          padding: '1rem 1.25rem 0.5rem',
          alignItems: 'stretch'
        }}
        className="bench-stage-grid"
      >
        {/* ==================================================== */}
        {/* ZONE 1 (LEFT): REACTANTS INPUT FEED & BENCH SHELF   */}
        {/* ==================================================== */}
        <div
          style={{
            background: 'rgba(250, 248, 245, 0.7)',
            border: '1px solid #6F7F63',
            borderRadius: '12px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2DDD3', paddingBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#5F6F5B', letterSpacing: '0.04em' }}>
              🌿 {l('Reactants Feed (Inputs)', 'Réactifs (Entrées)', 'المتفاعلات (المدخلات)')}
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#4E5B47' }}>
              {l('Ratio', 'Rapport', 'النسبة')}
            </span>
          </div>

          {/* List of Reactant Feed Containers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '380px' }} className="no-scrollbar">
            {stoichReactants.map((r, idx) => {
              const localizedName = r.meta.name[language] || r.meta.name.en;
              return (
                <div
                  key={r.spec.specKey || idx}
                  style={{
                    background: '#FAF8F5',
                    border: '1px solid #6F7F63',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative'
                  }}
                >
                  {/* Container Graphic (Cylinder / Dropper Bottle / Jar) */}
                  <div
                    style={{
                      width: '42px',
                      height: '54px',
                      flexShrink: 0,
                      background: '#EDEAE1',
                      border: '1.5px solid #6F7F63',
                      borderRadius: r.meta.state === 'gas' ? '12px 12px 6px 6px' : '6px 6px 10px 10px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Bottle Cap / Valve */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: r.meta.state === 'gas' ? '14px' : '18px',
                        height: '7px',
                        background: r.meta.state === 'gas' ? '#475569' : '#6F7F63',
                        borderRadius: '2px 2px 0 0'
                      }}
                    />

                    {/* Draining Fluid / Gas Level */}
                    <div
                      style={{
                        width: '100%',
                        height: `${r.fillPercent}%`,
                        background: r.meta.color,
                        borderTop: '1.5px solid rgba(111,127,99,0.3)',
                        transition: 'height 0.4s ease'
                      }}
                    />

                    {/* Hazard Icon */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.8rem'
                      }}
                    >
                      {r.meta.hazardIcon || (r.meta.state === 'gas' ? '🎈' : r.meta.state === 'solid' ? '🪨' : '💧')}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '0.98rem', fontWeight: 800 }}>
                        {r.spec.coeff > 1 && <span style={{ color: '#D97706', marginRight: '2px' }}>{r.spec.coeff}× </span>}
                        {r.spec.formula}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          background: '#DCE0CF',
                          color: '#4E5B47',
                          padding: '1px 5px',
                          borderRadius: '999px'
                        }}
                      >
                        {r.meta.stateLabel}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#5F6F5B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {localizedName}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontSize: '0.7rem', color: '#4E5B47' }}>
                      <span>
                        {l('Remaining:', 'Reste :', 'المتبقي:')} <strong className="formula-ltr">{r.remainingMass.toFixed(2)} g</strong>
                      </span>
                      <span className="formula-ltr" style={{ opacity: 0.8 }}>
                        {r.remainingMoles.toFixed(3)} mol
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery pipe indicator */}
          <div style={{ marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid #E2DDD3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#5F6F5B' }}>
            <span>{l('Feed Line', 'Conduite d\'Alimentation', 'خط التغذية')}</span>
            <span style={{ color: status === 'running' ? '#D97706' : '#6F7F63', fontWeight: 700 }}>
              {status === 'running' ? l('➔ Dispensing...', '➔ Injection...', '➔ تغذية جارية...') : l('● Ready', '● Prêt', '● جاهز')}
            </span>
          </div>
        </div>

        {/* ==================================================== */}
        {/* ZONE 2 (CENTER): REACTION CORE & LIVE APPARATUS     */}
        {/* ==================================================== */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Reaction State Badge */}
          <div
            style={{
              background: '#FAF8F5',
              border: '1.5px solid #6F7F63',
              borderRadius: '999px',
              padding: '4px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: status === 'running' ? '#D97706' : status === 'complete' ? '#16A34A' : '#4E5B47',
                boxShadow: status === 'running' ? '0 0 8px #D97706' : 'none',
                animation: status === 'running' ? 'pulse 1s infinite alternate' : 'none'
              }}
            />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4E5B47' }}>
              {status === 'running'
                ? l(`⚡ Chemical Reaction Active (${Math.round(progress)}%)...`, `⚡ Réaction Chimique Active (${Math.round(progress)}%)...`, `⚡ التفاعل الكيميائي نشط (${Math.round(progress)}%)...`)
                : status === 'complete'
                ? l('✓ Equilibrium Reached — Products Formed', '✓ Équilibre Atteint — Produits Formés', '✓ تم الوصول للتوازن — تكونت النواتج')
                : l('● Reagents Ready in Vessel', '● Réactifs Prêts dans le Réacteur', '● المتفاعلات جاهزة في الوعاء')}
            </span>
          </div>

          {/* SVG Apparatus Container */}
          <div style={{ position: 'relative', width: '320px', height: '330px', display: 'flex', justifyContent: 'center' }}>
            {/* Vapor & Steam Wisps during running */}
            {status === 'running' && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 4,
                  animation: 'pulse 1.2s infinite alternate'
                }}
              >
                <span style={{ fontSize: '1.3rem', opacity: 0.85 }}>💨</span>
                <span style={{ fontSize: '1rem', opacity: 0.7 }}>💨</span>
              </div>
            )}

            {/* Spark Ignition during combustion/thermite/water synthesis */}
            {status === 'running' && profile.hasSparks && (
              <div
                style={{
                  position: 'absolute',
                  top: '110px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '12px',
                  zIndex: 5,
                  animation: 'pulse 0.4s infinite alternate'
                }}
              >
                <span style={{ fontSize: '1.2rem', color: '#F59E0B' }}>✨</span>
                <span style={{ fontSize: '1.1rem', color: '#DC2626' }}>⚡</span>
              </div>
            )}

            {/* SVG Apparatus: Erlenmeyer Flask + Immersion Thermometer + Stirrer + Hotplate */}
            <svg width="320" height="330" viewBox="0 0 320 330" style={{ overflow: 'visible' }}>
              <defs>
                {/* Glass reflection gradient */}
                <linearGradient id="glassReflectionLg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                  <stop offset="35%" stopColor="#ffffff" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
                </linearGradient>

                {/* Hotplate ceramic heating glow */}
                <radialGradient id="heatingMantleGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={status === 'running' ? 0.8 : 0.4} />
                  <stop offset="60%" stopColor="#DC2626" stopOpacity={status === 'running' ? 0.4 : 0.15} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
                </radialGradient>

                {/* Flask interior clip */}
                <clipPath id="erlenmeyerInterior">
                  <path d="M 146 65 L 146 115 L 86 242 C 84 250 90 256 100 256 L 220 256 C 230 256 236 250 234 242 L 174 115 L 174 65 Z" />
                </clipPath>
              </defs>

              {/* Connecting Glass Arms */}
              {/* Left feed line entering the flask neck */}
              <path
                d="M 30 75 L 140 75"
                fill="none"
                stroke="#6F7F63"
                strokeWidth="3"
                strokeDasharray={status === 'running' ? '4 3' : 'none'}
              />

              {/* Right delivery arm leading to product receiver */}
              <path
                d="M 174 75 Q 240 75 290 95"
                fill="none"
                stroke="#6F7F63"
                strokeWidth="3.5"
                strokeDasharray={status === 'running' ? '6 4' : 'none'}
              />

              {/* Hotplate ceramic plate heating glow under flask */}
              {(status === 'running' || status === 'complete') && energyType === 'exothermic' && (
                <ellipse cx="160" cy="256" rx="85" ry="14" fill="url(#heatingMantleGlow)" />
              )}

              {/* Inside the Erlenmeyer Flask */}
              <g clipPath="url(#erlenmeyerInterior)">
                {/* Fluid Liquid Body */}
                <rect
                  x="70"
                  y={status === 'complete' ? 140 : status === 'running' ? 130 : 150}
                  width="180"
                  height="130"
                  fill={fluidColor}
                  style={{ transition: 'all 0.5s ease' }}
                />

                {/* Stirring Vortex Waves */}
                {stirrerActive && (
                  <g>
                    <ellipse
                      cx="160"
                      cy="200"
                      rx="38"
                      ry="7"
                      fill="none"
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="2.5"
                      strokeDasharray="8 5"
                    />
                    <ellipse
                      cx="160"
                      cy="215"
                      rx="26"
                      ry="5"
                      fill="none"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                  </g>
                )}

                {/* Rising Gas Effervescence / Bubbles */}
                {(status === 'running' || profile.hasBubbles) && status !== 'ready' && (
                  <g>
                    <circle cx="145" cy={180 - (progress % 40) * 1.5} r="3" fill="#ffffff" opacity="0.85" />
                    <circle cx="170" cy={195 - ((progress + 15) % 45) * 1.6} r="4" fill="#ffffff" opacity="0.9" />
                    <circle cx="130" cy={210 - ((progress + 30) % 50) * 1.4} r="2.5" fill="#ffffff" opacity="0.75" />
                    <circle cx="185" cy={200 - ((progress + 8) % 42) * 1.5} r="3.5" fill="#ffffff" opacity="0.8" />
                    <circle cx="155" cy={165 - ((progress + 22) % 35) * 1.7} r="2" fill="#ffffff" opacity="0.8" />
                  </g>
                )}

                {/* Solid Precipitate Layer at bottom (e.g. Copper, Iron, CaO, Al2O3) */}
                {(status === 'complete' || progress > 40) && profile.hasPrecipitate && (
                  <rect
                    x="95"
                    y={246}
                    width="130"
                    height={status === 'complete' ? 10 : (progress / 100) * 10}
                    fill={equation.toLowerCase().includes('cu') ? '#C2410C' : '#78350F'}
                    rx="3"
                  />
                )}

                {/* Stirring Magnetic Bar in the liquid bottom */}
                <rect
                  x={stirrerActive ? 144 : 148}
                  y={242}
                  width={stirrerActive ? 32 : 24}
                  height="7"
                  rx="3.5"
                  fill="#FAF8F5"
                  stroke="#4E5B47"
                  strokeWidth="1.5"
                />
              </g>

              {/* Erlenmeyer Glass Contour */}
              <path
                d="M 144 60 L 144 115 L 84 245 C 80 254 88 262 98 262 L 222 262 C 232 262 240 254 236 245 L 176 115 L 176 60"
                fill="none"
                stroke="#6F7F63"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glass Neck Rim */}
              <ellipse cx="160" cy="60" rx="18" ry="4.5" fill="#EDEAE1" stroke="#6F7F63" strokeWidth="2.5" />

              {/* Glass Reflection Highlight */}
              <path
                d="M 148 120 L 100 242 C 104 250 114 252 125 252 L 138 252 L 162 126 Z"
                fill="url(#glassReflectionLg)"
              />

              {/* Volume Graduations */}
              <line x1="190" y1="165" x2="208" y2="165" stroke="#6F7F63" strokeWidth="2" />
              <text x="212" y="168" fill="#5F6F5B" fontSize="9" fontWeight="700">300 ml</text>

              <line x1="198" y1="195" x2="218" y2="195" stroke="#6F7F63" strokeWidth="2" />
              <text x="222" y="198" fill="#5F6F5B" fontSize="9" fontWeight="700">200 ml</text>

              <line x1="205" y1="225" x2="228" y2="225" stroke="#6F7F63" strokeWidth="2" />
              <text x="232" y="228" fill="#5F6F5B" fontSize="9" fontWeight="700">100 ml</text>

              {/* Glass Immersion Thermometer dipping into fluid */}
              <g>
                {/* Thermometer Stem */}
                <rect x="158" y="25" width="5" height="195" fill="#FAF8F5" stroke="#6F7F63" strokeWidth="1.2" rx="2.5" />
                {/* Dynamic Mercury/Alcohol red column */}
                <rect
                  x="159.5"
                  y={215 - Math.min(170, (temperature / Math.max(100, targetTemp)) * 160)}
                  width="2"
                  height={Math.min(170, (temperature / Math.max(100, targetTemp)) * 160)}
                  fill="#DC2626"
                  rx="1"
                />
                {/* Thermometer Bulb */}
                <circle cx="160.5" cy="220" r="6" fill="#DC2626" stroke="#6F7F63" strokeWidth="0.8" />
              </g>

              {/* Laboratory Hotplate & Magnetic Stirrer Base */}
              <g>
                {/* Ceramic Heating Top Plate */}
                <rect x="65" y="262" width="190" height="9" rx="3" fill="#DCE0CF" stroke="#6F7F63" strokeWidth="1.5" />

                {/* Hotplate Main Chassis */}
                <path
                  d="M 60 271 L 260 271 L 268 312 C 268 316 264 318 260 318 L 60 318 C 56 318 52 316 52 312 Z"
                  fill="#4E5B47"
                  stroke="#3B4536"
                  strokeWidth="2"
                />

                {/* Rubber feet resting directly on bench */}
                <rect x="68" y="318" width="18" height="5" rx="2" fill="#292524" />
                <rect x="234" y="318" width="18" height="5" rx="2" fill="#292524" />

                {/* Digital LED Temperature Display */}
                <rect x="74" y="278" width="70" height="26" rx="4" fill="#18181B" stroke="#52525B" strokeWidth="1" />
                <text x="79" y="287" fill="#A1A1AA" fontSize="6.5" fontWeight="600">HEAT TEMP</text>
                <text x="79" y="299" fill={temperature > 50 ? '#EF4444' : '#38BDF8'} fontSize="11" fontWeight="800" fontFamily="monospace">
                  {temperature} °C
                </text>

                {/* Digital LED Stirrer Display */}
                <rect x="150" y="278" width="70" height="26" rx="4" fill="#18181B" stroke="#52525B" strokeWidth="1" />
                <text x="155" y="287" fill="#A1A1AA" fontSize="6.5" fontWeight="600">STIR SPEED</text>
                <text x="155" y="299" fill={stirrerActive ? '#4ADE80' : '#94A3B8'} fontSize="11" fontWeight="800" fontFamily="monospace">
                  {stirrerActive ? '450 RPM' : '0 RPM'}
                </text>

                {/* Control Dial Knobs */}
                <circle cx="236" cy="286" r="6" fill="#71717A" stroke="#3F3F46" strokeWidth="1.5" />
                <circle cx="250" cy="286" r="6" fill="#71717A" stroke="#3F3F46" strokeWidth="1.5" />
                <text x="230" y="298" fill="#DCE0CF" fontSize="5.5" fontWeight="700">TEMP</text>
                <text x="246" y="298" fill="#DCE0CF" fontSize="5.5" fontWeight="700">STIR</text>

                {/* Active Heat Indicator LED */}
                <circle
                  cx="243"
                  cy="308"
                  r="3"
                  fill={(status === 'running' || status === 'complete') && energyType === 'exothermic' ? '#EF4444' : '#52525B'}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* ==================================================== */}
        {/* ZONE 3 (RIGHT): PRODUCTS RECEIVER & OUTPUT VESSELS  */}
        {/* ==================================================== */}
        <div
          style={{
            background: 'rgba(250, 248, 245, 0.7)',
            border: '1px solid #6F7F63',
            borderRadius: '12px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2DDD3', paddingBottom: '6px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#5F6F5B', letterSpacing: '0.04em' }}>
              ✨ {l('Products Formed (Outputs)', 'Produits Formés (Sorties)', 'النواتج المتكونة (المخرجات)')}
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: status === 'complete' ? '#15803D' : '#4E5B47' }}>
              {status === 'complete' ? l('100% Formed', '100% Formé', 'تكونت 100%') : `${Math.round(progress)}%`}
            </span>
          </div>

          {/* List of Product Collection Receivers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '380px' }} className="no-scrollbar">
            {stoichProducts.map((p, idx) => {
              const localizedName = p.meta.name[language] || p.meta.name.en;
              return (
                <div
                  key={p.spec.specKey || idx}
                  style={{
                    background: status === 'complete' ? '#F0FDF4' : '#FAF8F5',
                    border: `1px solid ${status === 'complete' ? '#86EFAC' : '#6F7F63'}`,
                    borderRadius: '10px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {/* Container Graphic (Receiver Flask / Gas Syringe / Crystallizer) */}
                  <div
                    style={{
                      width: '42px',
                      height: '54px',
                      flexShrink: 0,
                      background: '#EDEAE1',
                      border: '1.5px solid #6F7F63',
                      borderRadius: p.meta.state === 'gas' ? '12px' : '4px 4px 10px 10px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Bottle Neck */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '16px',
                        height: '6px',
                        background: '#6F7F63',
                        borderRadius: '2px 2px 0 0'
                      }}
                    />

                    {/* Filling Product Level */}
                    <div
                      style={{
                        width: '100%',
                        height: `${p.fillPercent}%`,
                        background: p.meta.color,
                        borderTop: '1.5px solid rgba(111,127,99,0.3)',
                        transition: 'height 0.4s ease'
                      }}
                    />

                    {/* State Icon */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.8rem'
                      }}
                    >
                      {p.meta.hazardIcon || (p.meta.state === 'gas' ? '💨' : p.meta.state === 'solid' ? '✨' : '💧')}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '0.98rem', fontWeight: 800 }}>
                        {p.spec.coeff > 1 && <span style={{ color: '#2563EB', marginRight: '2px' }}>{p.spec.coeff}× </span>}
                        {p.spec.formula}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          background: status === 'complete' ? '#DCFCE7' : '#DCE0CF',
                          color: status === 'complete' ? '#15803D' : '#4E5B47',
                          padding: '1px 5px',
                          borderRadius: '999px'
                        }}
                      >
                        {p.meta.stateLabel}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.74rem', color: '#5F6F5B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {localizedName}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontSize: '0.7rem', color: '#4E5B47' }}>
                      <span>
                        {l('Yield:', 'Rendement :', 'الناتج:')} <strong className="formula-ltr">{p.currentMass.toFixed(2)} g</strong>
                      </span>
                      <span className="formula-ltr" style={{ opacity: 0.8 }}>
                        {p.currentMoles.toFixed(3)} mol
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Collection status */}
          <div style={{ marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid #E2DDD3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#5F6F5B' }}>
            <span>{l('Collection Receiver', 'Récepteur de Collecte', 'وعاء استقبال النواتج')}</span>
            <span style={{ color: status === 'complete' ? '#15803D' : '#6F7F63', fontWeight: 700 }}>
              {status === 'complete' ? l('✓ Collected', '✓ Collecté', '✓ تم التجميع') : l('Receiving...', 'Réception...', 'استقبال...')}
            </span>
          </div>
        </div>
      </div>

      {/* 4. SOLID POLISHED OAK/SLATE BENCH SURFACE & TELEMETRY DASHBOARD */}
      <div
        style={{
          background: 'linear-gradient(180deg, #4A3C2F 0%, #2E241B 100%)',
          borderTop: '3px solid #8C7355',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.12)',
          padding: '10px 1.25rem',
          color: '#FAF8F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          zIndex: 6
        }}
      >
        {/* Left: Mass Conservation Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>⚖️</span>
          <div>
            <div style={{ fontSize: '0.74rem', opacity: 0.85, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {l('Mass Conservation Law (Lavoisier):', 'Loi de Conservation de la Masse :', 'قانون حفظ الكتلة (لافوازييه):')}
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>
              <span className="formula-ltr">{totalMass.toFixed(2)} g</span>
              <span style={{ opacity: 0.6, margin: '0 6px' }}>➔</span>
              <span className="formula-ltr" style={{ color: '#86EFAC' }}>{totalMass.toFixed(2)} g</span>
              <span style={{ fontSize: '0.72rem', color: '#86EFAC', marginLeft: '6px' }}>(100.0% ✓)</span>
            </div>
          </div>
        </div>

        {/* Center: Dedicated Action Trigger (Rerun / Run / Progress) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {status === 'complete' && (
            <button
              onClick={handleRerunTest}
              style={{
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                color: '#FAF8F5',
                border: '1.5px solid #86EFAC',
                borderRadius: '999px',
                padding: '6px 20px',
                fontSize: '0.86rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.45)',
                transition: 'all 0.2s ease'
              }}
              title={l('Rerun this chemical reaction test', 'Relancer ce test de réaction', 'إعادة إجراء هذا الاختبار الكيميائي')}
            >
              <span style={{ fontSize: '1.1rem' }}>↺</span>
              <span>{l('Rerun Test', 'Relancer le Test', 'إعادة الاختبار')}</span>
            </button>
          )}

          {status === 'running' && (
            <div
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '5px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              <span style={{ color: '#FCD34D' }}>⚡</span>
              <span>{l(`Reaction in Progress (${Math.round(progress)}%)...`, `Réaction en cours (${Math.round(progress)}%)...`, `التفاعل قيد الحدوث (${Math.round(progress)}%)...`)}</span>
            </div>
          )}

          {status !== 'running' && status !== 'complete' && (
            <button
              onClick={handleRunTest}
              disabled={reactants.length < 1}
              style={{
                background: '#FAF8F5',
                color: '#4E5B47',
                border: '1.5px solid #DCE0CF',
                borderRadius: '999px',
                padding: '6px 18px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: reactants.length >= 1 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <span>▶</span>
              <span>{l('Run Reaction', 'Lancer la Réaction', 'تشغيل التفاعل')}</span>
            </button>
          )}
        </div>

        {/* Right: Telemetry (Peak Temperature & Energy Mode) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem' }}>
          <div>
            <span style={{ opacity: 0.75 }}>{l('Peak Temp:', 'Temp. Max :', 'أعلى حرارة:')} </span>
            <strong className="formula-ltr" style={{ color: targetTemp > 60 ? '#FCA5A5' : '#93C5FD' }}>
              {targetTemp} °C
            </strong>
          </div>
          <span style={{ opacity: 0.4 }}>|</span>
          <div>
            <span style={{ opacity: 0.75 }}>{l('Enthalpy ΔH:', 'Enthalpie ΔH :', 'المحتوى الحراري ΔH:')} </span>
            <strong className="formula-ltr" style={{ color: '#FAF8F5' }}>
              {deltaH || (energyType === 'exothermic' ? '-483.6 kJ/mol' : '+178.0 kJ/mol')}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
