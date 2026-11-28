import React, { useState, useEffect } from 'react';
import { HeroCanvas } from '../common/HeroCanvas';
import { AppView } from '../common/Navbar';
import { useLanguage } from '../../i18n/LanguageContext';
import { getElementName } from '../../i18n/translations/elements';

interface HeroSectionProps {
  onNavigate: (view: AppView) => void;
}

interface HeroTileItem {
  num: number;
  sym: string;
  name: string;
  mass: string;
  config: string;
  shells: number[];
  phase: { en: string; fr: string; ar: string };
  catLabel: { en: string; fr: string; ar: string };
  color: string;
  soft: string;
}

const HERO_TILES: HeroTileItem[] = [
  {
    num: 1,
    sym: 'H',
    name: 'Hydrogen',
    mass: '1.008',
    config: '1s¹',
    shells: [1],
    phase: { en: 'Gas', fr: 'Gaz', ar: 'غاز' },
    catLabel: { en: 'Nonmetal', fr: 'Non-métal', ar: 'لافلز' },
    color: '#2E7D5B',
    soft: 'rgba(46, 125, 91, 0.14)'
  },
  {
    num: 6,
    sym: 'C',
    name: 'Carbon',
    mass: '12.011',
    config: '[He] 2s² 2p²',
    shells: [2, 4],
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Nonmetal', fr: 'Non-métal', ar: 'لافلز' },
    color: '#3A6B54',
    soft: 'rgba(58, 107, 84, 0.14)'
  },
  {
    num: 7,
    sym: 'N',
    name: 'Nitrogen',
    mass: '14.007',
    config: '[He] 2s² 2p³',
    shells: [2, 5],
    phase: { en: 'Gas', fr: 'Gaz', ar: 'غاز' },
    catLabel: { en: 'Nonmetal', fr: 'Non-métal', ar: 'لافلز' },
    color: '#2C7A7B',
    soft: 'rgba(44, 122, 123, 0.14)'
  },
  {
    num: 8,
    sym: 'O',
    name: 'Oxygen',
    mass: '15.999',
    config: '[He] 2s² 2p⁴',
    shells: [2, 6],
    phase: { en: 'Gas', fr: 'Gaz', ar: 'غاز' },
    catLabel: { en: 'Nonmetal', fr: 'Non-métal', ar: 'لافلز' },
    color: '#3B8471',
    soft: 'rgba(59, 132, 113, 0.14)'
  },
  {
    num: 11,
    sym: 'Na',
    name: 'Sodium',
    mass: '22.990',
    config: '[Ne] 3s¹',
    shells: [2, 8, 1],
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Alkali Metal', fr: 'Métal alcalin', ar: 'فلز قلوي' },
    color: '#C26D4A',
    soft: 'rgba(194, 109, 74, 0.15)'
  },
  {
    num: 26,
    sym: 'Fe',
    name: 'Iron',
    mass: '55.845',
    config: '[Ar] 3d⁶ 4s²',
    shells: [2, 8, 14, 2],
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Transition Metal', fr: 'Métal de transition', ar: 'فلز انتقالي' },
    color: '#567189',
    soft: 'rgba(86, 113, 137, 0.15)'
  },
  {
    num: 29,
    sym: 'Cu',
    name: 'Copper',
    mass: '63.546',
    config: '[Ar] 3d¹⁰ 4s¹',
    shells: [2, 8, 18, 1],
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Transition Metal', fr: 'Métal de transition', ar: 'فلز انتقالي' },
    color: '#B8653E',
    soft: 'rgba(184, 101, 62, 0.15)'
  },
  {
    num: 47,
    sym: 'Ag',
    name: 'Silver',
    mass: '107.87',
    config: '[Kr] 4d¹⁰ 5s¹',
    shells: [2, 8, 18, 18, 1],
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Noble Metal', fr: 'Métal noble', ar: 'فلز نفيس' },
    color: '#64765C',
    soft: 'rgba(100, 118, 92, 0.15)'
  },
  {
    num: 79,
    sym: 'Au',
    name: 'Gold',
    mass: '196.97',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    shells: [2, 8, 18, 32, 18, 1],
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Noble Metal', fr: 'Métal noble', ar: 'فلز نفيس' },
    color: '#B9852E',
    soft: 'rgba(185, 133, 46, 0.16)'
  },
  {
    num: 80,
    sym: 'Hg',
    name: 'Mercury',
    mass: '200.59',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    shells: [2, 8, 18, 32, 18, 2],
    phase: { en: 'Liquid', fr: 'Liquide', ar: 'سائل' },
    catLabel: { en: 'Transition Metal', fr: 'Métal de transition', ar: 'فلز انتقالي' },
    color: '#467476',
    soft: 'rgba(70, 116, 118, 0.15)'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(1); // Start on Carbon (C)
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  useEffect(() => {
    if (isAutoPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % HERO_TILES.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [isAutoPaused]);

  const activeTile = HERO_TILES[activeIndex];
  const activeLocalizedName = getElementName(activeTile.num, language, activeTile.name);
  const visibleRings = Math.min(activeTile.shells.length, 3);

  return (
    <section
      className="hero-section hero-section--redesigned"
      id="hero"
      style={{ '--active-el-color': activeTile.color, '--active-el-soft': activeTile.soft } as React.CSSProperties}
    >
      {/* Multi-Layer Sunlit Botanical Atmosphere */}
      <div className="hero-ambient" aria-hidden="true">
        <div className="hero-orb hero-orb--sage" />
        <div className="hero-orb hero-orb--gold" />
        <div className="hero-orb hero-orb--verdigris" />
        <div className="hero-sunbeam" />
      </div>

      {/* Interactive Hexagonal Molecular Lattice & Drifting Molecules Canvas */}
      <HeroCanvas />

      <div className="hero-stage-shell">
        <div className="hero-split">
          {/* LEFT COLUMN: Editorial Headline, CTAs & Capability Chips */}
          <div className="hero-copy">
            <div className="hero-eyebrow hero-animate hero-animate--1">
              <span className="hero-eyebrow__dot"></span>
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="hero-title hero-animate hero-animate--2">
              <span className="hero-title__line1">{t.hero.titleLine1}</span>
              <br />
              <span className="hero-title__gradient">{t.hero.titleLine2}</span>
            </h1>

            <p className="hero-subtitle hero-animate hero-animate--3">
              {t.hero.subtitle}
            </p>

            <div className="hero-actions hero-animate hero-animate--4">
              <button
                onClick={() => onNavigate('elements')}
                className="hero-btn hero-btn--primary"
              >
                <span>{t.hero.exploreBtn}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <button
                onClick={() => onNavigate('lab')}
                className="hero-btn hero-btn--ghost"
              >
                <span>{t.hero.labBtn}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"></path>
                </svg>
              </button>
            </div>

            <div className="hero-highlights hero-animate hero-animate--5">
              <button type="button" className="hero-highlight-pill" onClick={() => onNavigate('elements')}>
                <span className="hero-highlight-pill__dot" style={{ background: '#2E7D5B' }} />
                <span>{l('118 IUPAC Elements', '118 Éléments IUPAC', '118 عنصراً كيميائياً')}</span>
              </button>
              <button type="button" className="hero-highlight-pill" onClick={() => onNavigate('lab')}>
                <span className="hero-highlight-pill__dot" style={{ background: '#2C7A7B' }} />
                <span>{l('Real-Time Lab Bench', 'Paillasse en Direct', 'مختبر تفاعلات حي')}</span>
              </button>
              <button type="button" className="hero-highlight-pill" onClick={() => onNavigate('tools')}>
                <span className="hero-highlight-pill__dot" style={{ background: '#C6923A' }} />
                <span>{l('10 Precision Solvers', '10 Calculateurs Précis', '10 حاسبات علمية')}</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Live Botanical Quantum Showcase */}
          <div
            className="hero-showcase hero-animate hero-animate--4"
            onMouseEnter={() => setIsAutoPaused(true)}
            onMouseLeave={() => setIsAutoPaused(false)}
          >
            {/* Floating Reaction Telemetry Satellite */}
            <div className="hero-satellite hero-satellite--top formula-ltr" aria-hidden="true">
              <span className="hero-satellite__dot" />
              <span className="hero-satellite__eq">2H₂ + O₂ → 2H₂O</span>
              <span className="hero-satellite__tag">−483.6 kJ</span>
            </div>

            {/* Central Interactive Specimen Observatory Card */}
            <div className="hero-orb-card">
              <div className="hero-orb-card__header">
                <span className="hero-orb-card__cat">
                  {activeTile.catLabel[language]}
                </span>
                <span className="hero-orb-card__num formula-ltr">
                  № {String(activeTile.num).padStart(2, '0')}
                </span>
              </div>

              {/* Animated Orbital Stage */}
              <div className="hero-orb-stage" key={activeTile.sym}>
                <div className="hero-orb-stage__glow" aria-hidden="true" />

                {/* Rotating Quantum Rings */}
                <div className="hero-ring hero-ring--1" aria-hidden="true">
                  <span className="hero-ring__electron" />
                </div>
                {visibleRings >= 2 && (
                  <div className="hero-ring hero-ring--2" aria-hidden="true">
                    <span className="hero-ring__electron" />
                  </div>
                )}
                {visibleRings >= 3 && (
                  <div className="hero-ring hero-ring--3" aria-hidden="true">
                    <span className="hero-ring__electron" />
                  </div>
                )}

                {/* Center Element Medallion */}
                <button
                  type="button"
                  onClick={() => onNavigate('elements')}
                  className="hero-medallion"
                  title={`${activeLocalizedName} — ${l('Open in Periodic Table', 'Ouvrir dans le Tableau', 'فتح في الجدول الدوري')}`}
                >
                  <span className="hero-medallion__sym">{activeTile.sym}</span>
                  <span className="hero-medallion__name">{activeLocalizedName}</span>
                  <span className="hero-medallion__mass formula-ltr">{activeTile.mass} u</span>
                </button>
              </div>

              {/* Live Atomic Readout Strip */}
              <div className="hero-orb-card__meta">
                <div className="hero-meta-box">
                  <span className="hero-meta-box__label">{l('Config', 'Config.', 'التوزيع')}</span>
                  <span className="hero-meta-box__val formula-ltr">{activeTile.config}</span>
                </div>
                <div className="hero-meta-box">
                  <span className="hero-meta-box__label">{l('Shells', 'Couches', 'المدارات')}</span>
                  <span className="hero-meta-box__val formula-ltr">{activeTile.shells.join(' · ')}</span>
                </div>
                <div className="hero-meta-box">
                  <span className="hero-meta-box__label">{l('State', 'État', 'الحالة')}</span>
                  <span className="hero-meta-box__val">{activeTile.phase[language]}</span>
                </div>
              </div>

              <button
                type="button"
                className="hero-orb-card__inspect"
                onClick={() => onNavigate('elements')}
              >
                <span>{l(`Inspect ${activeLocalizedName}`, `Explorer ${activeLocalizedName}`, `استكشف ${activeLocalizedName}`)}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            {/* Floating Bottom Quantum Formula Satellite */}
            <div className="hero-satellite hero-satellite--bottom formula-ltr" aria-hidden="true">
              <span className="hero-satellite__formula">PV = nRT</span>
              <span className="hero-satellite__sep">•</span>
              <span className="hero-satellite__formula">ΔG = ΔH − TΔS</span>
            </div>
          </div>
        </div>

        {/* BOTTOM INTERACTIVE ELEMENT DOCK */}
        <div
          className="hero-deck-wrapper hero-animate hero-animate--6"
          onMouseEnter={() => setIsAutoPaused(true)}
          onMouseLeave={() => setIsAutoPaused(false)}
        >
          <div className="hero-deck-header">
            <span className="hero-deck-label">
              {l('Interactive Specimen Dock — Select an element', 'Sélecteur d’Éléments — Choisissez un spécimen', 'شريط العناصر التفاعلي — اختر عنصراً لمعاينته')}
            </span>
            <button
              type="button"
              className="hero-deck-all-link"
              onClick={() => onNavigate('elements')}
            >
              <span>{l('View all 118', 'Voir les 118', 'عرض الـ 118')}</span>
              <span className="rtl-flip">→</span>
            </button>
          </div>
          <div className="hero-deck no-scrollbar">
            {HERO_TILES.map((tile, idx) => {
              const localizedName = getElementName(tile.num, language, tile.name);
              const isSelected = idx === activeIndex;
              return (
                <button
                  type="button"
                  key={tile.sym}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  onClick={() => {
                    if (isSelected) {
                      onNavigate('elements');
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                  className={`hero-element-tile ${isSelected ? 'is-selected' : ''}`}
                  style={
                    {
                      '--tile-accent': tile.color,
                      '--tile-delay': `${idx * 45}ms`
                    } as React.CSSProperties
                  }
                  title={`${localizedName} — ${l('Click to preview or open catalog', 'Cliquez pour explorer', 'انقر للمعاينة أو فتح الكتالوج')}`}
                >
                  <div className="hero-element-tile__top">
                    <span className="hero-element-tile__num">{tile.num}</span>
                    <span className="hero-element-tile__mass">{tile.mass}</span>
                  </div>
                  <div className="hero-element-tile__sym">{tile.sym}</div>
                  <div className="hero-element-tile__name">{localizedName}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <a
        href="#about"
        className="hero-scroll-cue"
        aria-label={l('Scroll to explore', 'Défiler pour explorer', 'مرر للاستكشاف')}
      >
        <span className="hero-scroll-cue__mouse">
          <span className="hero-scroll-cue__wheel" />
        </span>
      </a>
    </section>
  );
};
