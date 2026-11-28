import React, { useState, useEffect, useRef } from 'react';
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
  electronegativity: string;
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
    electronegativity: '2.20',
    phase: { en: 'Gas', fr: 'Gaz', ar: 'غاز' },
    catLabel: { en: 'Nonmetal', fr: 'Non-métal', ar: 'لافلز' },
    color: '#2E7D5B',
    soft: '#E6F3EC'
  },
  {
    num: 6,
    sym: 'C',
    name: 'Carbon',
    mass: '12.011',
    config: '[He] 2s² 2p²',
    shells: [2, 4],
    electronegativity: '2.55',
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Nonmetal', fr: 'Non-métal', ar: 'لافلز' },
    color: '#34634D',
    soft: '#E7F1EC'
  },
  {
    num: 7,
    sym: 'N',
    name: 'Nitrogen',
    mass: '14.007',
    config: '[He] 2s² 2p³',
    shells: [2, 5],
    electronegativity: '3.04',
    phase: { en: 'Gas', fr: 'Gaz', ar: 'غاز' },
    catLabel: { en: 'Nonmetal', fr: 'Non-métal', ar: 'لافلز' },
    color: '#2C7A7B',
    soft: '#E5F3F3'
  },
  {
    num: 8,
    sym: 'O',
    name: 'Oxygen',
    mass: '15.999',
    config: '[He] 2s² 2p⁴',
    shells: [2, 6],
    electronegativity: '3.44',
    phase: { en: 'Gas', fr: 'Gaz', ar: 'غاز' },
    catLabel: { en: 'Nonmetal', fr: 'Non-métal', ar: 'لافلز' },
    color: '#367A68',
    soft: '#E6F2EE'
  },
  {
    num: 11,
    sym: 'Na',
    name: 'Sodium',
    mass: '22.990',
    config: '[Ne] 3s¹',
    shells: [2, 8, 1],
    electronegativity: '0.93',
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Alkali Metal', fr: 'Métal alcalin', ar: 'فلز قلوي' },
    color: '#B85D3B',
    soft: '#F9ECE6'
  },
  {
    num: 26,
    sym: 'Fe',
    name: 'Iron',
    mass: '55.845',
    config: '[Ar] 3d⁶ 4s²',
    shells: [2, 8, 14, 2],
    electronegativity: '1.83',
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Transition Metal', fr: 'Métal de transition', ar: 'فلز انتقالي' },
    color: '#4D6782',
    soft: '#EBF0F5'
  },
  {
    num: 29,
    sym: 'Cu',
    name: 'Copper',
    mass: '63.546',
    config: '[Ar] 3d¹⁰ 4s¹',
    shells: [2, 8, 18, 1],
    electronegativity: '1.90',
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Transition Metal', fr: 'Métal de transition', ar: 'فلز انتقالي' },
    color: '#AE5C35',
    soft: '#F8ECE5'
  },
  {
    num: 47,
    sym: 'Ag',
    name: 'Silver',
    mass: '107.87',
    config: '[Kr] 4d¹⁰ 5s¹',
    shells: [2, 8, 18, 18, 1],
    electronegativity: '1.93',
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Noble Metal', fr: 'Métal noble', ar: 'فلز نفيس' },
    color: '#5B6D55',
    soft: '#ECF1EA'
  },
  {
    num: 79,
    sym: 'Au',
    name: 'Gold',
    mass: '196.97',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    shells: [2, 8, 18, 32, 18, 1],
    electronegativity: '2.54',
    phase: { en: 'Solid', fr: 'Solide', ar: 'صلب' },
    catLabel: { en: 'Noble Metal', fr: 'Métal noble', ar: 'فلز نفيس' },
    color: '#A97822',
    soft: '#F8F1E1'
  },
  {
    num: 80,
    sym: 'Hg',
    name: 'Mercury',
    mass: '200.59',
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    shells: [2, 8, 18, 32, 18, 2],
    electronegativity: '2.00',
    phase: { en: 'Liquid', fr: 'Liquide', ar: 'سائل' },
    catLabel: { en: 'Transition Metal', fr: 'Métal de transition', ar: 'فلز انتقالي' },
    color: '#3F6D6F',
    soft: '#E7F1F1'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(1); // Carbon (C)
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  useEffect(() => {
    if (isAutoPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % HERO_TILES.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isAutoPaused]);

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 7,
      ry: (px - 0.5) * 8,
      gx: Math.round(px * 100),
      gy: Math.round(py * 100)
    });
  };

  const resetCardTilt = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const activeTile = HERO_TILES[activeIndex];
  const activeLocalizedName = getElementName(activeTile.num, language, activeTile.name);
  const visibleRings = Math.min(activeTile.shells.length, 3);

  return (
    <section
      className="hero-section hero-section--redesigned"
      id="hero"
      style={{ '--active-el-color': activeTile.color, '--active-el-soft': activeTile.soft } as React.CSSProperties}
    >
      {/* Sunlit Botanical Atmosphere */}
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
                <span className="hero-highlight-pill__dot" style={{ background: '#A97822' }} />
                <span>{l('10 Precision Solvers', '10 Calculateurs Précis', '10 حاسبات علمية')}</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Precision Tactile Specimen Instrument Card */}
          <div
            className="hero-showcase hero-animate hero-animate--4"
            onMouseEnter={() => setIsAutoPaused(true)}
            onMouseLeave={() => {
              setIsAutoPaused(false);
              resetCardTilt();
            }}
          >
            <div
              ref={cardRef}
              className="specimen-plate"
              onPointerMove={handleCardPointerMove}
              onPointerLeave={resetCardTilt}
              style={
                {
                  '--tilt-x': `${tilt.rx}deg`,
                  '--tilt-y': `${tilt.ry}deg`,
                  '--glare-x': `${tilt.gx}%`,
                  '--glare-y': `${tilt.gy}%`
                } as React.CSSProperties
              }
            >
              {/* Subtle Paper Specular Glare on Pointer Move */}
              <div className="specimen-plate__glare" aria-hidden="true" />

              {/* Top Ruled Instrument Header */}
              <div className="specimen-plate__bar">
                <div className="specimen-plate__id formula-ltr">
                  <span className="specimen-plate__led" />
                  <span>SPECIMEN // Z={String(activeTile.num).padStart(2, '0')}</span>
                </div>
                <span className="specimen-plate__cat">
                  {activeTile.catLabel[language]}
                </span>
              </div>

              {/* Auto-Cycle Precision Progress Hairline */}
              <div className="specimen-plate__progress" aria-hidden="true">
                <span
                  key={`${activeTile.sym}-${isAutoPaused ? 'p' : 'r'}`}
                  className={`specimen-plate__progress-fill ${isAutoPaused ? 'is-paused' : ''}`}
                />
              </div>

              {/* Center Precision Orbital & Medallion Viewport */}
              <div className="specimen-plate__viewport" key={activeTile.sym}>
                {/* Registration Corner Crosshairs */}
                <span className="reg-mark reg-mark--tl" aria-hidden="true" />
                <span className="reg-mark reg-mark--tr" aria-hidden="true" />
                <span className="reg-mark reg-mark--bl" aria-hidden="true" />
                <span className="reg-mark reg-mark--br" aria-hidden="true" />

                {/* Sharp Concentric SVG Orbital Instrument */}
                <div className="specimen-orbital">
                  <svg className="specimen-orbital__ticks" viewBox="0 0 240 240" aria-hidden="true">
                    <circle cx="120" cy="120" r="108" fill="none" stroke="rgba(78,91,71,0.16)" strokeWidth="1" strokeDasharray="2 6" />
                    <line x1="120" y1="6" x2="120" y2="18" stroke="rgba(78,91,71,0.35)" strokeWidth="1.2" />
                    <line x1="120" y1="222" x2="120" y2="234" stroke="rgba(78,91,71,0.35)" strokeWidth="1.2" />
                    <line x1="6" y1="120" x2="18" y2="120" stroke="rgba(78,91,71,0.35)" strokeWidth="1.2" />
                    <line x1="222" y1="120" x2="234" y2="120" stroke="rgba(78,91,71,0.35)" strokeWidth="1.2" />
                  </svg>

                  <div className="specimen-ring specimen-ring--1" aria-hidden="true">
                    <span className="specimen-ring__dot" />
                  </div>
                  {visibleRings >= 2 && (
                    <div className="specimen-ring specimen-ring--2" aria-hidden="true">
                      <span className="specimen-ring__dot" />
                    </div>
                  )}
                  {visibleRings >= 3 && (
                    <div className="specimen-ring specimen-ring--3" aria-hidden="true">
                      <span className="specimen-ring__dot" />
                    </div>
                  )}

                  {/* Tactile Central Element Block */}
                  <button
                    type="button"
                    onClick={() => onNavigate('elements')}
                    className="specimen-core"
                    title={`${activeLocalizedName} — ${l('Open in Periodic Table', 'Ouvrir dans le Tableau', 'فتح في الجدول الدوري')}`}
                  >
                    <span className="specimen-core__num formula-ltr">{activeTile.num}</span>
                    <span className="specimen-core__sym">{activeTile.sym}</span>
                    <span className="specimen-core__name">{activeLocalizedName}</span>
                  </button>
                </div>
              </div>

              {/* Ruled IUPAC Datasheet Grid */}
              <div className="specimen-ledger">
                <div className="specimen-ledger__cell">
                  <span className="specimen-ledger__label">{l('Atomic Mass', 'Masse atom.', 'الكتلة الذرية')}</span>
                  <span className="specimen-ledger__val formula-ltr">{activeTile.mass} u</span>
                </div>
                <div className="specimen-ledger__cell">
                  <span className="specimen-ledger__label">{l('Electroneg.', 'Électronég.', 'الكهروسالبية')}</span>
                  <span className="specimen-ledger__val formula-ltr">χ {activeTile.electronegativity}</span>
                </div>
                <div className="specimen-ledger__cell">
                  <span className="specimen-ledger__label">{l('Config', 'Config.', 'التوزيع')}</span>
                  <span className="specimen-ledger__val formula-ltr">{activeTile.config}</span>
                </div>
                <div className="specimen-ledger__cell">
                  <span className="specimen-ledger__label">{l('State (STP)', 'État (25°C)', 'الحالة')}</span>
                  <span className="specimen-ledger__val">{activeTile.phase[language]}</span>
                </div>
              </div>

              {/* Tactile Ink-Slide Footer CTA */}
              <button
                type="button"
                className="specimen-plate__action"
                onClick={() => onNavigate('elements')}
              >
                <span className="specimen-plate__action-text">
                  {l(`Open ${activeLocalizedName} Dossier`, `Ouvrir la fiche ${activeLocalizedName}`, `فتح ملف ${activeLocalizedName}`)}
                </span>
                <span className="specimen-plate__action-arrow rtl-flip" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM INTERACTIVE ENAMEL PERIODIC TILE DOCK */}
        <div
          className="hero-deck-wrapper hero-animate hero-animate--6"
          onMouseEnter={() => setIsAutoPaused(true)}
          onMouseLeave={() => setIsAutoPaused(false)}
        >
          <div className="hero-deck-header">
            <span className="hero-deck-label">
              {l('Specimen Index — Hover or select to inspect', 'Index des Spécimens — Survolez ou sélectionnez', 'فهرس العناصر — اختر عنصراً لمعاينته')}
            </span>
            <button
              type="button"
              className="hero-deck-all-link"
              onClick={() => onNavigate('elements')}
            >
              <span>{l('Full 118 Catalog', 'Catalogue des 118', 'كتالوج الـ 118')}</span>
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
                      '--tile-soft': tile.soft,
                      '--tile-delay': `${idx * 40}ms`
                    } as React.CSSProperties
                  }
                  title={`${localizedName} — ${l('Select or click again to open', 'Sélectionnez pour inspecter', 'انقر للمعاينة أو الفتح')}`}
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

      {/* Minimal Scroll Cue */}
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
