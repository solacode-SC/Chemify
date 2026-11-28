import React from 'react';
import { HeroCanvas } from '../common/HeroCanvas';
import { AppView } from '../common/Navbar';
import { useLanguage } from '../../i18n/LanguageContext';
import { getElementName } from '../../i18n/translations/elements';

interface HeroSectionProps {
  onNavigate: (view: AppView) => void;
}

const HERO_TILES = [
  { num: 1, sym: 'H', name: 'Hydrogen', mass: '1.008', cat: 'nonmetal', color: '#22D3EE' },
  { num: 6, sym: 'C', name: 'Carbon', mass: '12.011', cat: 'nonmetal', color: '#38BDF8' },
  { num: 7, sym: 'N', name: 'Nitrogen', mass: '14.007', cat: 'nonmetal', color: '#34D399' },
  { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999', cat: 'nonmetal', color: '#2DD4BF' },
  { num: 11, sym: 'Na', name: 'Sodium', mass: '22.990', cat: 'alkali', color: '#FB7185' },
  { num: 26, sym: 'Fe', name: 'Iron', mass: '55.845', cat: 'transition', color: '#818CF8' },
  { num: 29, sym: 'Cu', name: 'Copper', mass: '63.546', cat: 'transition', color: '#FB923C' },
  { num: 47, sym: 'Ag', name: 'Silver', mass: '107.87', cat: 'transition', color: '#A78BFA' },
  { num: 79, sym: 'Au', name: 'Gold', mass: '196.97', cat: 'transition', color: '#FBBF24' },
  { num: 80, sym: 'Hg', name: 'Mercury', mass: '200.59', cat: 'transition', color: '#E879F9' }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  return (
    <section className="hero-section" id="hero">
      {/* Ambient Plasma Nebula Glows */}
      <div className="hero-ambient" aria-hidden="true">
        <div className="hero-orb hero-orb--cyan" />
        <div className="hero-orb hero-orb--violet" />
        <div className="hero-orb hero-orb--emerald" />
      </div>

      {/* Dynamic Interactive Molecular Particle & Pulse Canvas */}
      <HeroCanvas />

      <div className="hero-container">
        {/* Eyebrow badge */}
        <div className="hero-eyebrow">
          <span className="hero-eyebrow__dot"></span>
          <span>{t.hero.badge}</span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-title">
          <span className="hero-title__line1">{t.hero.titleLine1}</span>
          <br />
          <span className="hero-title__gradient">{t.hero.titleLine2}</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          {t.hero.subtitle}
        </p>

        {/* CTAs */}
        <div className="hero-actions">
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"></path>
            </svg>
          </button>
        </div>

        {/* Quick Live Capabilities Pills */}
        <div className="hero-highlights">
          <button type="button" className="hero-highlight-pill" onClick={() => onNavigate('elements')}>
            <span className="hero-highlight-pill__dot" style={{ background: '#22D3EE' }} />
            <span>{l('118 IUPAC Elements', '118 Éléments IUPAC', '118 عنصراً كيميائياً')}</span>
          </button>
          <button type="button" className="hero-highlight-pill" onClick={() => onNavigate('lab')}>
            <span className="hero-highlight-pill__dot" style={{ background: '#34D399' }} />
            <span>{l('Real-Time Lab Bench', 'Paillasse en Direct', 'مختبر تفاعلات حي')}</span>
          </button>
          <button type="button" className="hero-highlight-pill" onClick={() => onNavigate('tools')}>
            <span className="hero-highlight-pill__dot" style={{ background: '#A78BFA' }} />
            <span>{l('10 Precision Solvers', '10 Calculateurs Précis', '10 حاسبات علمية')}</span>
          </button>
        </div>

        {/* Curated Interactive Floating Element Deck */}
        <div className="hero-deck-wrapper">
          <div className="hero-deck-label">
            <span>{l('Essential Elementary Blocks', 'Blocs Élémentaires Fondamentaux', 'عناصر مميزة من الجدول الدوري')}</span>
          </div>
          <div className="hero-deck no-scrollbar">
            {HERO_TILES.map(tile => {
              const localizedName = getElementName(tile.num, language, tile.name);
              return (
                <div
                  key={tile.sym}
                  onClick={() => onNavigate('elements')}
                  className="hero-element-tile"
                  style={{ '--tile-accent': tile.color } as React.CSSProperties}
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
