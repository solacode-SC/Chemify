import React from 'react';
import { HeroCanvas } from '../common/HeroCanvas';
import { AppView } from '../common/Navbar';

interface HeroSectionProps {
  onNavigate: (view: AppView) => void;
}

const HERO_TILES = [
  { num: 1, sym: 'H', name: 'Hydrogen', mass: '1.008', cat: 'nonmetal', color: '#B5C4AE' },
  { num: 6, sym: 'C', name: 'Carbon', mass: '12.011', cat: 'nonmetal', color: '#B5C4AE' },
  { num: 7, sym: 'N', name: 'Nitrogen', mass: '14.007', cat: 'nonmetal', color: '#B5C4AE' },
  { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999', cat: 'nonmetal', color: '#B5C4AE' },
  { num: 11, sym: 'Na', name: 'Sodium', mass: '22.990', cat: 'alkali', color: '#D4C49E' },
  { num: 26, sym: 'Fe', name: 'Iron', mass: '55.845', cat: 'transition', color: '#A8BCB2' },
  { num: 29, sym: 'Cu', name: 'Copper', mass: '63.546', cat: 'transition', color: '#C8A992' },
  { num: 47, sym: 'Ag', name: 'Silver', mass: '107.87', cat: 'transition', color: '#C2C8BA' },
  { num: 79, sym: 'Au', name: 'Gold', mass: '196.97', cat: 'transition', color: '#E2C785' },
  { num: 80, sym: 'Hg', name: 'Mercury', mass: '200.59', cat: 'transition', color: '#A3B4A2' }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="hero-section" id="hero">
      {/* Dynamic Background Particle/Pulse Canvas */}
      <HeroCanvas />

      <div className="hero-container">
        {/* Eyebrow badge */}
        <div className="hero-eyebrow">
          <span className="hero-eyebrow__dot"></span>
          <span>Interactive Chemistry Catalog & Simulator</span>
        </div>

        {/* Main Heading */}
        <h1 className="hero-title">
          Where Chemistry<br />Comes Alive
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Explore all 118 elements of the periodic table, simulate reactions in real-time with thermodynamic precision, and solve complex stoichiometry equations — all crafted with botanical elegance.
        </p>

        {/* CTAs */}
        <div className="hero-actions">
          <button
            onClick={() => onNavigate('elements')}
            className="hero-btn hero-btn--primary"
          >
            <span>Explore Elements</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

          <button
            onClick={() => onNavigate('lab')}
            className="hero-btn hero-btn--ghost"
          >
            <span>Enter the Lab</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"></path>
            </svg>
          </button>
        </div>

        {/* Curated Interactive Floating Element Deck */}
        <div className="hero-deck-wrapper">
          <div className="hero-deck-label">
            <span>Featured Elemental Building Blocks</span>
          </div>
          <div className="hero-deck">
            {HERO_TILES.map(tile => (
              <div
                key={tile.sym}
                onClick={() => onNavigate('elements')}
                className="hero-element-tile"
                style={{ '--tile-accent': tile.color } as React.CSSProperties}
                title={`${tile.name} — Click to view in Elements Catalog`}
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
                <div className="hero-element-tile__name">{tile.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
