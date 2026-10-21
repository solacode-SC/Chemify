import React, { useState } from 'react';
import { ELEMENTS, CATEGORIES } from '../../data/elementsData';
import { ElementCategory } from '../../types/element';
import { AppView } from '../common/Navbar';

interface PeriodicTableTeaserProps {
  onNavigate: (view: AppView) => void;
}

const SHOWCASE_CATEGORIES: { id: ElementCategory; label: string; count: number }[] = [
  { id: 'nonmetal', label: 'Reactive Nonmetals', count: 7 },
  { id: 'noble-gas', label: 'Noble Gases', count: 7 },
  { id: 'alkali-metal', label: 'Alkali Metals', count: 6 },
  { id: 'alkaline-earth', label: 'Alkaline Earth', count: 6 },
  { id: 'transition-metal', label: 'Transition Metals', count: 38 },
  { id: 'post-transition', label: 'Post-Transition', count: 11 },
  { id: 'metalloid', label: 'Metalloids', count: 7 },
  { id: 'halogen', label: 'Halogens', count: 6 }
];

export const PeriodicTableTeaser: React.FC<PeriodicTableTeaserProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('nonmetal');

  const filteredElements = ELEMENTS.filter(e => e.category === activeCategory).slice(0, 8);
  const currentCategoryInfo = CATEGORIES[activeCategory];

  return (
    <section className="ptable-section" id="periodic-table">
      <div className="ptable-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">The Universal Catalog</span>
          <h2 className="section-title">118 Elements. Infinite Discovery.</h2>
          <p className="section-desc">
            Organized by atomic structure, electron configurations, and chemical affinities. Tap any category to inspect elemental specimens.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="ptable-tabs" role="tablist">
          {SHOWCASE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`ptable-tab ${activeCategory === cat.id ? 'is-active' : ''}`}
            >
              <span
                className="ptable-tab__dot"
                style={{ backgroundColor: CATEGORIES[cat.id]?.border || '#6F7F63' }}
              />
              <span className="ptable-tab__text">{cat.label}</span>
              <span className="ptable-tab__count">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Interactive Specimen Deck for active category */}
        <div className="ptable-specimens">
          {filteredElements.map(el => (
            <div
              key={el.atomicNumber}
              onClick={() => onNavigate('elements')}
              className="element-specimen-card"
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate('elements');
              }}
              title={`View ${el.name} (${el.symbol}) details`}
            >
              <div className="element-specimen-card__header">
                <span className="element-specimen-card__num">№ {el.atomicNumber}</span>
                <span
                  className="element-specimen-card__badge"
                  style={{
                    backgroundColor: currentCategoryInfo?.color || '#E8EFE3',
                    borderColor: currentCategoryInfo?.border || '#6F7F63'
                  }}
                >
                  {el.category.replace('-', ' ')}
                </span>
              </div>
              <div className="element-specimen-card__symbol">{el.symbol}</div>
              <div className="element-specimen-card__name">{el.name}</div>
              <div className="element-specimen-card__footer">
                <span className="element-specimen-card__mass">{el.atomicMass} u</span>
                <span className="element-specimen-card__period">Period {el.period}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mini 18-Column Grid Architecture Preview */}
        <div className="ptable-preview-wrap">
          <div className="ptable-preview-header">
            <span className="ptable-preview-title">Table Architecture Preview (Periods 1–7)</span>
            <span className="ptable-preview-hint">Click any tile to open full modal</span>
          </div>

          <div className="ptable-scroll-container">
            <div className="ptable-mini-grid">
              {ELEMENTS.map(el => {
                const cat = CATEGORIES[el.category];
                const isHighlighted = el.category === activeCategory;

                return (
                  <div
                    key={el.atomicNumber}
                    onClick={() => onNavigate('elements')}
                    className={`ptable-mini-cell ${isHighlighted ? 'is-highlighted' : ''}`}
                    style={{
                      gridRow: el.gridRow,
                      gridColumn: el.gridColumn,
                      backgroundColor: isHighlighted ? (cat?.color || '#fff') : 'rgba(250, 248, 245, 0.7)',
                      borderColor: isHighlighted ? (cat?.border || '#6F7F63') : 'rgba(111, 127, 99, 0.3)'
                    }}
                    title={`${el.atomicNumber} — ${el.name} (${el.symbol})`}
                  >
                    <span className="ptable-mini-cell__num">{el.atomicNumber}</span>
                    <span className="ptable-mini-cell__sym">{el.symbol}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary CTA to open complete Explorer */}
        <div className="ptable-cta-wrap">
          <button
            onClick={() => onNavigate('elements')}
            className="ptable-explore-btn"
          >
            <span>Launch Complete 118-Element Periodic Explorer</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
