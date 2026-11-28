import React from 'react';
import { HeroCanvas } from '../common/HeroCanvas';
import { AppView } from '../common/Navbar';
import { useLanguage } from '../../i18n/LanguageContext';
import { getElementName } from '../../i18n/translations/elements';

interface HeroSectionProps {
  onNavigate: (view: AppView) => void;
}

const HERO_TILES = [
  { num: 1, sym: 'H', name: 'Hydrogen', mass: '1.008', cat: 'nonmetal', color: '#2E7D5B' },
  { num: 6, sym: 'C', name: 'Carbon', mass: '12.011', cat: 'nonmetal', color: '#3E6B55' },
  { num: 7, sym: 'N', name: 'Nitrogen', mass: '14.007', cat: 'nonmetal', color: '#2C7A7B' },
  { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999', cat: 'nonmetal', color: '#4B8673' },
  { num: 11, sym: 'Na', name: 'Sodium', mass: '22.990', cat: 'alkali', color: '#C26D4A' },
  { num: 26, sym: 'Fe', name: 'Iron', mass: '55.845', cat: 'transition', color: '#5D748B' },
  { num: 29, sym: 'Cu', name: 'Copper', mass: '63.546', cat: 'transition', color: '#B86B43' },
  { num: 47, sym: 'Ag', name: 'Silver', mass: '107.87', cat: 'transition', color: '#6F7F63' },
  { num: 79, sym: 'Au', name: 'Gold', mass: '196.97', cat: 'transition', color: '#C6923A' },
  { num: 80, sym: 'Hg', name: 'Mercury', mass: '200.59', cat: 'transition', color: '#4E7B7D' }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  return (
    <section className="hero-section" id="hero">
      {/* Ambient Sunlit Botanical Glows */}
      <div className="hero-ambient" aria-hidden="true">
        <div className="hero-orb hero-orb--sage" />
        <div className="hero-orb hero-orb--gold" />
        <div className="hero-orb hero-orb--verdigris" />
      </div>

      {/* Dynamic Interactive Molecular Particle & Pulse Canvas */}
      <HeroCanvas />

      <div className="hero-container">
        {/* Eyebrow badge */}
        <div className="hero-eyebrow hero-animate hero-animate--1">
          <span className="hero-eyebrow__dot"></span>
          <span>{t.hero.badge}</span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-title hero-animate hero-animate--2">
          <span className="hero-title__line1">{t.hero.titleLine1}</span>
          <br />
          <span className="hero-title__gradient">{t.hero.titleLine2}</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle hero-animate hero-animate--3">
          {t.hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="hero-actions hero-animate hero-animate--4">
          <button
            onClick={() => onNavigate('elements')}
            className="hero-btn hero-btn--primary"
          >
            <span>{t.hero.exploreBtn}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
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

        {/* Quick Live Capabilities Pills */}
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

        {/* Curated Interactive Floating Element Deck */}
        <div className="hero-deck-wrapper hero-animate hero-animate--6">
          <div className="hero-deck-label">
            <span>{l('Essential Elementary Blocks', 'Blocs Élémentaires Fondamentaux', 'عناصر مميزة من الجدول الدوري')}</span>
          </div>
          <div className="hero-deck no-scrollbar">
            {HERO_TILES.map((tile, idx) => {
              const localizedName = getElementName(tile.num, language, tile.name);
              return (
                <div
                  key={tile.sym}
                  onClick={() => onNavigate('elements')}
                  className="hero-element-tile"
                  style={
                    {
                      '--tile-accent': tile.color,
                      '--tile-delay': `${idx * 55}ms`
                    } as React.CSSProperties
                  }
                  title={`${localizedName} — Click to view in Elements Catalog`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') onNavigate('elements');
                  }}
                >
                  <div className="hero-element-tile__top">
                    <span className="hero-element-tile__num">{tile.num}</span>
                    <span className="hero-element-tile__mass">{tile.mass}</span>
                  </div>
                  <div className="hero-element-tile__sym">{tile.sym}</div>
                  <div className="hero-element-tile__name">{localizedName}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
