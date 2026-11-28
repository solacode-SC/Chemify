import React, { useState } from 'react';
import { ELEMENTS, CATEGORIES } from '../../data/elementsData';
import { ElementCategory } from '../../types/element';
import { AppView } from '../common/Navbar';
import { useLanguage } from '../../i18n/LanguageContext';
import { getElementName } from '../../i18n/translations/elements';

interface PeriodicTableTeaserProps {
  onNavigate: (view: AppView) => void;
}

const SHOWCASE_CATEGORIES: { id: ElementCategory; count: number }[] = [
  { id: 'nonmetal', count: 7 },
  { id: 'noble-gas', count: 7 },
  { id: 'alkali-metal', count: 6 },
  { id: 'alkaline-earth', count: 6 },
  { id: 'transition-metal', count: 38 },
  { id: 'post-transition', count: 11 },
  { id: 'metalloid', count: 7 },
  { id: 'halogen', count: 6 }
];

const BOTANICAL_MINERAL_ACCENTS: Record<ElementCategory, { accent: string; soft: string }> = {
  'alkali-metal': { accent: '#C45B5F', soft: '#FCECEC' },
  'alkaline-earth': { accent: '#C47D3B', soft: '#FDF3E5' },
  'transition-metal': { accent: '#5675A8', soft: '#EDF2FB' },
  'post-transition': { accent: '#3B8B60', soft: '#E8F6EE' },
  'metalloid': { accent: '#A6952D', soft: '#FAF7DC' },
  'nonmetal': { accent: '#2C7A7B', soft: '#E6F5F4' },
  'halogen': { accent: '#9E5698', soft: '#F7ECF7' },
  'noble-gas': { accent: '#6B5EB8', soft: '#F0EEFC' },
  'lanthanide': { accent: '#B45A80', soft: '#FAEDF2' },
  'actinide': { accent: '#B85B60', soft: '#FBECEE' }
};

export const PeriodicTableTeaser: React.FC<PeriodicTableTeaserProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('nonmetal');

  const filteredElements = ELEMENTS.filter(e => e.category === activeCategory).slice(0, 8);
  const currentAccent = BOTANICAL_MINERAL_ACCENTS[activeCategory];

  return (
    <section className="ptable-section" id="periodic-table">
      <div className="ptable-container">
        {/* Section Header */}
        <div className="section-header reveal-on-scroll">
          <span className="section-eyebrow">{t.teaser.badge}</span>
          <h2 className="section-title">{t.teaser.title}</h2>
          <p className="section-desc">
            {t.teaser.subtitle}
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="ptable-tabs no-scrollbar reveal-on-scroll" role="tablist">
          {SHOWCASE_CATEGORIES.map(cat => {
            const catLabel = t.explorer.categories[cat.id] || cat.id;
            const palette = BOTANICAL_MINERAL_ACCENTS[cat.id];
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`ptable-tab ${isActive ? 'is-active' : ''}`}
                style={
                  {
                    '--tab-accent': palette.accent,
                    '--tab-soft': palette.soft
                  } as React.CSSProperties
                }
              >
                <span
                  className="ptable-tab__dot"
                  style={{ backgroundColor: palette.accent }}
                />
                <span className="ptable-tab__text">{catLabel}</span>
                <span className="ptable-tab__count">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Specimen Deck for active category */}
        <div className="ptable-specimens" key={activeCategory}>
          {filteredElements.map((el, idx) => {
            const localizedName = getElementName(el.atomicNumber, language, el.name);
            const catLabel = t.explorer.categories[el.category] || el.category;
            return (
              <div
                key={el.atomicNumber}
                onClick={() => onNavigate('elements')}
                className="element-specimen-card specimen-pop"
                style={
                  {
                    '--spec-accent': currentAccent.accent,
                    '--spec-soft': currentAccent.soft,
                    '--spec-delay': `${idx * 45}ms`
                  } as React.CSSProperties
                }
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') onNavigate('elements');
                }}
                title={`View ${localizedName} (${el.symbol}) details`}
              >
                <div className="element-specimen-card__header">
                  <span className="element-specimen-card__num">№ {el.atomicNumber}</span>
                  <span
                    className="element-specimen-card__badge"
                    style={{
                      backgroundColor: currentAccent.soft,
                      borderColor: currentAccent.accent,
                      color: currentAccent.accent
                    }}
                  >
                    {catLabel}
                  </span>
                </div>
                <div className="element-specimen-card__symbol">{el.symbol}</div>
                <div className="element-specimen-card__name">{localizedName}</div>
                <div className="element-specimen-card__footer">
                  <span className="element-specimen-card__mass">{el.atomicMass} u</span>
                  <span className="element-specimen-card__period">{t.explorer.period} {el.period}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini 18-Column Grid Architecture Preview */}
        <div className="ptable-preview-wrap reveal-on-scroll">
          <div className="ptable-preview-header">
            <span className="ptable-preview-title">
              {language === 'ar'
                ? 'معاينة بنية الجدول الدوري (الدورات 1–7)'
                : language === 'fr'
                ? 'Aperçu de la Structure du Tableau (Périodes 1–7)'
                : 'Periodic Table Architecture Preview (Periods 1–7)'}
            </span>
            <span className="ptable-preview-hint">
              {language === 'ar'
                ? 'انقر على أي عنصر لفتح التفاصيل'
                : language === 'fr'
                ? 'Cliquez sur une case pour ouvrir sa fiche'
                : 'Click any cell to open its details'}
            </span>
          </div>

          <div className="ptable-scroll-container">
            <div className="ptable-mini-grid">
              {ELEMENTS.map(el => {
                const cat = CATEGORIES[el.category];
                const mineral = BOTANICAL_MINERAL_ACCENTS[el.category];
                const isHighlighted = el.category === activeCategory;
                const localizedName = getElementName(el.atomicNumber, language, el.name);

                return (
                  <div
                    key={el.atomicNumber}
                    onClick={() => onNavigate('elements')}
                    className={`ptable-mini-cell ${isHighlighted ? 'is-highlighted' : ''}`}
                    style={{
                      gridRow: el.gridRow,
                      gridColumn: el.gridColumn,
                      backgroundColor: isHighlighted ? (mineral?.soft || cat?.color || '#fff') : 'rgba(250, 248, 245, 0.72)',
                      borderColor: isHighlighted ? (mineral?.accent || cat?.border || '#6F7F63') : 'rgba(111, 127, 99, 0.28)'
                    }}
                    title={`${el.atomicNumber} — ${localizedName} (${el.symbol})`}
                  >
                    <span
                      className="ptable-mini-cell__num"
                      style={{ color: isHighlighted ? mineral?.accent : undefined }}
                    >
                      {el.atomicNumber}
                    </span>
                    <span className="ptable-mini-cell__sym">{el.symbol}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary CTA to open complete Explorer */}
        <div className="ptable-cta-wrap reveal-on-scroll">
          <button
            onClick={() => onNavigate('elements')}
            className="ptable-explore-btn"
          >
            <span>{t.teaser.exploreAll}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
