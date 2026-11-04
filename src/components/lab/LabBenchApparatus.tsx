import React, { useState, useEffect } from 'react';
import { ReactantItem, ReactionStatus } from '../../types/reaction';
import { getReagentInfo, ReagentMeta } from '../../data/reagentsData';
import { useLanguage } from '../../i18n/LanguageContext';
import { MathEquation } from '../common/MathEquation';

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
  simSpeed,
  onToggleSpeed,
  onSwitchToMolecular
}) => {
  const { language, isRTL } = useLanguage();
  const l = (en: string, fr: string, ar: string) => (language === 'ar' ? ar : language === 'fr' ? fr : en);

  // Dynamic simulation telemetry
  const [temperature, setTemperature] = useState<number>(25);
  const [stirrerActive, setStirrerActive] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(status === 'complete' ? 100 : 0);

  // Determine peak temperature based on reaction energy
  const targetTemp =
    energyType === 'exothermic'
      ? (equation.includes('CH₄') || equation.includes('Al') ? 480 : equation.includes('H₂O₂') ? 85 : 65)
      : (equation.includes('CaCO') ? 820 : 18);

  useEffect(() => {
    let interval: any;
    if (status === 'running') {
      setStirrerActive(true);
      let p = 0;
      interval = setInterval(() => {
        p += 2.5 * simSpeed;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setStirrerActive(false);
        }
        setProgress(p);
        const curT = 25 + (targetTemp - 25) * (p / 100);
        setTemperature(Math.round(curT));
      }, 50);
    } else if (status === 'complete') {
      setProgress(100);
      setStirrerActive(false);
      setTemperature(targetTemp);
    } else {
      setProgress(0);
      setStirrerActive(false);
      setTemperature(25);
    }
    return () => clearInterval(interval);
  }, [status, simSpeed, targetTemp]);

  // Total initial mass on bench
  const totalMass = reactants.reduce((sum, r) => sum + (r.massGrams || 0), 0);

  // Reaction vessel fluid color progression
  const getFluidColor = () => {
    const eq = equation.toLowerCase();
    if (eq.includes('cuso') || eq.includes('cu')) {
      // Copper single displacement: Cobalt blue -> Sea green
      if (progress < 20) return '#0284C7';
      if (progress < 60) return '#0D9488';
      return '#10B981';
    }
    if (eq.includes('al') && eq.includes('fe')) {
      // Thermite: Dark rust -> Molten incandescent glowing orange
      if (progress < 30) return '#7C2D12';
      return '#EA580C';
    }
    if (eq.includes('hcl') || eq.includes('naoh')) {
      // Neutralization: Transparent aqueous with slight pale tint
      return 'rgba(224, 231, 255, 0.65)';
    }
    if (eq.includes('ch₄')) {
      // Methane combustion
      return 'rgba(254, 243, 199, 0.7)';
    }
    if (eq.includes('h2o2')) {
      // Peroxide decomposition: effervescent frothy pale cyan
      return 'rgba(224, 242, 254, 0.85)';
    }
    // Default water synthesis / general
    return 'rgba(219, 234, 254, 0.7)';
  };

  const fluidColor = getFluidColor();

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '520px',
        background: 'linear-gradient(180deg, #FAF8F5 0%, #EDEAE1 60%, #E2DDD3 100%)',
        borderRadius: '16px',
        border: '1.5px solid #6F7F63',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Bench Controls & Mode Switcher */}
      <div
        style={{
          background: 'rgba(220, 224, 207, 0.75)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1.5px solid #6F7F63',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          zIndex: 10
        }}
      >
        {/* Bench Mode Title Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>🧪</span>
          <div>
            <strong style={{ color: '#4E5B47', fontSize: '0.92rem', display: 'block', lineHeight: 1.2 }}>
              {l('Chemistry Lab Bench — Live Apparatus', 'Paillasse de Laboratoire — Montage Réel', 'طاولة المختبر الكيميائي — التجربة الحية')}
            </strong>
            <span style={{ fontSize: '0.74rem', color: '#5F6F5B' }}>
              {l('Macroscopic glassware, reagents, heating plate & reactions', 'Verrerie, flacons de réactifs, plaque chauffante et réaction', 'أدوات الزجاجيات، قوارير المتفاعلات، المسخن والتفاعل الحي')}
            </span>
          </div>
        </div>

        {/* View Switchers & Controls */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={onToggleSpeed}
            style={{
              background: '#FAF8F5',
              border: '1px solid #6F7F63',
              borderRadius: '999px',
              padding: '4px 12px',
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

          <button
            onClick={onSwitchToMolecular}
            style={{
              background: '#4E5B47',
              color: '#FAF8F5',
              border: '1px solid #4E5B47',
              borderRadius: '999px',
              padding: '5px 14px',
              fontSize: '0.8rem',
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
            <span>{l('View Molecular Field', 'Vue Moléculaire', 'حقل الجزيئات')}</span>
          </button>
        </div>
      </div>

      {/* Main Lab Bench Visual Area */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem 0',
          minHeight: '380px'
        }}
      >
        {/* Upper Reagents Shelf on Bench Wall */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5F6F5B' }}>
              {l('Active Reagents on Bench Shelf:', 'Réactifs Actifs sur la Paillasse :', 'المتفاعلات المحضرة على رف الطاولة:')}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#4E5B47', fontWeight: 600 }}>
              {l('Total Mass:', 'Masse Totale :', 'الكتلة الكلية:')} <strong className="formula-ltr">{totalMass.toFixed(2)} g</strong>
            </span>
          </div>

          {/* Reagent Bottle Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {reactants.map((r, idx) => {
              const meta = getReagentInfo(r.formula);
              const localizedName = meta.name[language] || meta.name.en;
              const mass = r.massGrams ?? 0;
              const moles = meta.molarMass > 0 ? (mass / meta.molarMass).toFixed(3) : '—';

              return (
                <div
                  key={r.id || idx}
                  style={{
                    background: '#FAF8F5',
                    border: '1.5px solid #6F7F63',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle color highlight bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: '4px',
                      background: meta.color.startsWith('rgba') ? meta.bottleColor : meta.color
                    }}
                  />

                  {/* Bottle / Flask Visual Graphic */}
                  <div
                    style={{
                      width: '46px',
                      height: '56px',
                      flexShrink: 0,
                      background: '#EDEAE1',
                      border: '1.5px solid #6F7F63',
                      borderRadius: meta.state === 'gas' ? '12px' : '8px 8px 12px 12px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
                    }}
                  >
                    {/* Bottle Neck / Cap */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '18px',
                        height: '8px',
                        background: '#6F7F63',
                        borderRadius: '2px 2px 0 0'
                      }}
                    />

                    {/* Liquid / Solid Fill Level */}
                    <div
                      style={{
                        width: '100%',
                        height: status === 'complete' ? '15%' : '65%',
                        background: meta.color,
                        borderTop: '1px solid rgba(111,127,99,0.3)',
                        transition: 'height 0.8s ease'
                      }}
                    />

                    {/* Reagent icon inside flask */}
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.85rem'
                      }}
                    >
                      {meta.hazardIcon || (meta.state === 'gas' ? '🎈' : meta.state === 'solid' ? '🪨' : '💧')}
                    </span>
                  </div>

                  {/* Reagent Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                      <strong className="formula-ltr" style={{ color: '#4E5B47', fontSize: '1.05rem', fontWeight: 800 }}>
                        {r.formula}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          background: '#DCE0CF',
                          color: '#4E5B47',
                          padding: '1px 6px',
                          borderRadius: '999px'
                        }}
                      >
                        {meta.stateLabel}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: '#5F6F5B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {localizedName}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '0.72rem', color: '#4E5B47' }}>
                      <span>
                        {l('Mass:', 'Masse :', 'كتلة:')} <strong className="formula-ltr">{r.massGrams} g</strong>
                      </span>
                      <span>•</span>
                      <span>
                        {l('Moles:', 'Moles :', 'مول:')} <strong className="formula-ltr">{moles} mol</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Central Reaction Glassware & Workbench Setup */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '1.5rem 0 0'
          }}
        >
          {/* Reaction Stage HUD Banner */}
          <div
            style={{
              background: '#FAF8F5',
              border: '1.5px solid #6F7F63',
              borderRadius: '999px',
              padding: '4px 18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: status === 'running' ? '#D97706' : status === 'complete' ? '#16A34A' : '#4E5B47',
                boxShadow: status === 'running' ? '0 0 8px #D97706' : 'none'
              }}
            />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4E5B47' }}>
              {status === 'running'
                ? l(`⚡ Chemical Reaction in Progress (${progress.toFixed(0)}%)...`, `⚡ Réaction Chimique en Cours (${progress.toFixed(0)}%)...`, `⚡ التفاعل الكيميائي قيد الحدوث (${progress.toFixed(0)}%)...`)
                : status === 'complete'
                ? l('✓ Equilibrium Reached — Products Formed', '✓ Équilibre Atteint — Produits Formés', '✓ تم الوصول للتوازن — تكونت النواتج')
                : l('● Reagents Ready in Vessel', '● Réactifs Prêts dans le Réacteur', '● المتفاعلات جاهزة في الوعاء')}
            </span>
          </div>

          {/* Glassware Apparatus Container */}
          <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', justifyContent: 'center' }}>
            {/* Vapor / Steam clouds during running */}
            {status === 'running' && (
              <div
                style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: '6px',
                  animation: 'pulse 1s infinite alternate'
                }}
              >
                <span style={{ fontSize: '1.2rem', opacity: 0.8 }}>💨</span>
                <span style={{ fontSize: '1rem', opacity: 0.6 }}>💨</span>
              </div>
            )}

            {/* SVG Erlenmeyer Reaction Flask with Live Fluid & Graduations */}
            <svg width="180" height="190" viewBox="0 0 180 190" style={{ overflow: 'visible' }}>
              <defs>
                {/* Glass reflection gradient */}
                <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
                </linearGradient>

                {/* Heating glow gradient */}
                <radialGradient id="heatingGlow" cx="50%" cy="100%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Hotplate glow under flask */}
              {(status === 'running' || status === 'complete') && energyType === 'exothermic' && (
                <ellipse cx="90" cy="180" rx="75" ry="14" fill="url(#heatingGlow)" />
              )}

              {/* Liquid inside Erlenmeyer Flask */}
              <clipPath id="flaskClip">
                <path d="M 75 40 L 75 70 L 22 165 C 20 172 26 178 35 178 L 145 178 C 154 178 160 172 158 165 L 105 70 L 105 40 Z" />
              </clipPath>

              {/* Fluid Body */}
              <g clipPath="url(#flaskClip)">
                <rect
                  x="15"
                  y={status === 'complete' ? '90' : status === 'running' ? '80' : '95'}
                  width="150"
                  height="95"
                  fill={fluidColor}
                  style={{ transition: 'all 0.6s ease' }}
                />

                {/* Stirring Vortex Waves */}
                {stirrerActive && (
                  <ellipse
                    cx="90"
                    cy="145"
                    rx="30"
                    ry="6"
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                )}

                {/* Rising Bubbles */}
                {status === 'running' && (
                  <g>
                    <circle cx="80" cy="130" r="3" fill="#ffffff" opacity="0.8" />
                    <circle cx="100" cy="115" r="4.5" fill="#ffffff" opacity="0.85" />
                    <circle cx="65" cy="140" r="2.5" fill="#ffffff" opacity="0.7" />
                    <circle cx="115" cy="135" r="3.5" fill="#ffffff" opacity="0.75" />
                  </g>
                )}

                {/* Precipitate layer at bottom (for single displacement or thermite) */}
                {status === 'complete' && (equation.includes('Cu') || equation.includes('Al')) && (
                  <rect x="25" y="166" width="130" height="12" fill="#C2410C" rx="4" />
                )}
              </g>

              {/* Erlenmeyer Flask Outer Glass Contour */}
              <path
                d="M 72 35 L 72 70 L 20 166 C 17 174 23 182 32 182 L 148 182 C 157 182 163 174 160 166 L 108 70 L 108 35"
                fill="none"
                stroke="#6F7F63"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Glass Rim */}
              <ellipse cx="90" cy="35" rx="18" ry="4.5" fill="#EDEAE1" stroke="#6F7F63" strokeWidth="2.5" />

              {/* Glass Reflection Highlight */}
              <path
                d="M 76 75 L 35 165 C 38 172 45 174 55 174 L 65 174 L 88 80 Z"
                fill="url(#glassReflection)"
              />

              {/* Graduation Markings */}
              <line x1="120" y1="110" x2="135" y2="110" stroke="#6F7F63" strokeWidth="1.5" />
              <text x="138" y="113" fill="#5F6F5B" fontSize="8" fontWeight="600">300 ml</text>

              <line x1="125" y1="135" x2="142" y2="135" stroke="#6F7F63" strokeWidth="1.5" />
              <text x="145" y="138" fill="#5F6F5B" fontSize="8" fontWeight="600">200 ml</text>

              <line x1="130" y1="160" x2="148" y2="160" stroke="#6F7F63" strokeWidth="1.5" />
              <text x="151" y="163" fill="#5F6F5B" fontSize="8" fontWeight="600">100 ml</text>

              {/* Glass Thermometer dipping inside */}
              <g>
                <rect x="88" y="10" width="4" height="150" fill="#FAF8F5" stroke="#6F7F63" strokeWidth="1" rx="2" />
                <rect x="89" y={160 - (temperature / 100) * 80} width="2" height={(temperature / 100) * 80} fill="#DC2626" rx="1" />
                <circle cx="90" cy="162" r="5" fill="#DC2626" />
              </g>
            </svg>

            {/* Digital Thermometer Display Pill */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '0',
                background: '#FAF8F5',
                border: '1.5px solid #6F7F63',
                borderRadius: '8px',
                padding: '4px 8px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '0.85rem' }}>🌡️</span>
              <strong className="formula-ltr" style={{ fontSize: '0.85rem', color: temperature > 60 ? '#DC2626' : '#2563EB' }}>
                {temperature} °C
              </strong>
            </div>

            {/* Magnetic Stirrer / Hotplate Base Graphic */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '190px',
                height: '24px',
                background: '#4E5B47',
                borderRadius: '6px 6px 10px 10px',
                border: '1.5px solid #3B4536',
                boxShadow: '0 4px 10px rgba(0,0,0,0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: stirrerActive ? '#10B981' : '#94A3B8',
                    boxShadow: stirrerActive ? '0 0 6px #10B981' : 'none'
                  }}
                />
                <span style={{ fontSize: '0.66rem', color: '#FAF8F5', fontWeight: 600 }}>
                  {stirrerActive ? 'STIRRING 400 RPM' : 'HEATING STAND'}
                </span>
              </div>
              <span style={{ fontSize: '0.66rem', color: '#FAF8F5', opacity: 0.8 }}>
                {energyType === 'exothermic' ? '🔥 EXOTHERMIC' : '❄️ ENDOTHERMIC'}
              </span>
            </div>
          </div>
        </div>

        {/* Polished Wooden / Slate Lab Workstation Bench Surface */}
        <div
          style={{
            height: '42px',
            background: 'linear-gradient(180deg, #5A4A3C 0%, #3B2E24 100%)',
            borderTop: '3px solid #8C7355',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
            margin: '0 -1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            color: '#FAF8F5',
            fontSize: '0.78rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌿</span>
            <span style={{ opacity: 0.9, fontWeight: 600 }}>
              {l('Botanical Chemical Observatory Workstation', 'Observatoire Chimique Botanique', 'منصة المرصد الكيميائي النباتي')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>
              {l('Mass Conserved:', 'Masse Conservée :', 'حفظ الكتلة:')} <strong className="formula-ltr">{totalMass.toFixed(2)} g</strong>
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span>
              {l('Enthalpy ΔH:', 'Enthalpie ΔH :', 'المحتوى الحراري ΔH:')} <strong className="formula-ltr">{deltaH || '-483.6 kJ/mol'}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
