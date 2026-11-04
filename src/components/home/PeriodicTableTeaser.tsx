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

export const PeriodicTableTeaser: React.FC<PeriodicTableTeaserProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ElementCategory>('nonmetal');

  const filteredElements = ELEMENTS.filter(e => e.category === activeCategory).slice(0, 8);
  const currentCategoryInfo = CATEGORIES[activeCategory];

  return (
    <section className="ptable-section" id="periodic-table">
      <div className="ptable-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">{t.teaser.badge}</span>
          <h2 className="section-title">{t.teaser.title}</h2>
          <p className="section-desc">
            {t.teaser.subtitle}
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="ptable-tabs no-scrollbar" role="tablist">
          {SHOWCASE_CATEGORIES.map(cat => {
            const catLabel = t.explorer.categories[cat.id] || cat.id;
            return (
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
                <span className="ptable-tab__text">{catLabel}</span>
                <span className="ptable-tab__count">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Specimen Deck for active category */}
        <div className="ptable-specimens">
          {filteredElements.map(el => {
            const localizedName = getElementName(el.atomicNumber, language, el.name);
            const catLabel = t.explorer.categories[el.category] || el.category;
            return (
              <div
                key={el.atomicNumber}
                onClick={() => onNavigate('elements')}
                className="element-specimen-card"
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
                      backgroundColor: currentCategoryInfo?.color || '#E8EFE3',
                      borderColor: currentCategoryInfo?.border || '#6F7F63'
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
        <div className="ptable-preview-wrap">
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
                      backgroundColor: isHighlighted ? (cat?.color || '#fff') : 'rgba(250, 248, 245, 0.7)',
                      borderColor: isHighlighted ? (cat?.border || '#6F7F63') : 'rgba(111, 127, 99, 0.3)'
                    }}
                    title={`${el.atomicNumber} — ${localizedName} (${el.symbol})`}
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
