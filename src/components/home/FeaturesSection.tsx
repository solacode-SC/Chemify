import React from 'react';
import { AppView } from '../common/Navbar';
import { useLanguage } from '../../i18n/LanguageContext';

interface FeaturesSectionProps {
  onNavigate: (view: AppView) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="section-header reveal-on-scroll">
          <span className="section-eyebrow">{t.features.badge}</span>
          <h2 className="section-title">{t.features.title}</h2>
          <p className="section-desc">
            {t.features.subtitle}
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1: Periodic Table Explorer */}
          <div
            className="feature-card feature-card--emerald reveal-on-scroll"
            onClick={() => onNavigate('elements')}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate('elements');
            }}
          >
            <div className="feature-card__header-bar">
              <span className="feature-card__module formula-ltr">MODULE 01</span>
              <span className="feature-card__tag">{l('CATALOG', 'CATALOGUE', 'الكتالوج')}</span>
            </div>

            <div className="feature-card__blueprint">
              <svg viewBox="0 0 80 80" fill="none" className="feature-card__icon">
                <rect className="svg-cell svg-cell--1" x="8" y="12" width="14" height="14" rx="2.5" stroke="#2E7D5B" strokeWidth="1.8" fill="rgba(46,125,91,0.12)" />
                <rect className="svg-cell svg-cell--2" x="26" y="12" width="14" height="14" rx="2.5" stroke="#4E5B47" strokeWidth="1.8" />
                <rect className="svg-cell svg-cell--3" x="44" y="12" width="14" height="14" rx="2.5" stroke="#2E7D5B" strokeWidth="1.8" />
                <rect x="8" y="30" width="14" height="14" rx="2.5" stroke="#4E5B47" strokeWidth="1.8" />
                <rect className="svg-cell svg-cell--2" x="26" y="30" width="14" height="14" rx="2.5" stroke="#2E7D5B" strokeWidth="1.8" fill="rgba(46,125,91,0.16)" />
                <rect x="44" y="30" width="14" height="14" rx="2.5" stroke="#4E5B47" strokeWidth="1.8" />
                <rect x="8" y="48" width="14" height="14" rx="2.5" stroke="#2E7D5B" strokeWidth="1.8" />
                <rect x="26" y="48" width="14" height="14" rx="2.5" stroke="#4E5B47" strokeWidth="1.8" />
                <circle cx="58" cy="52" r="12" stroke="#253224" strokeWidth="2" fill="#FCFBF7" />
                <line x1="66.5" y1="60.5" x2="74" y2="68" stroke="#253224" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>

            <div className="feature-card__inner">
              <h3 className="feature-card__title">{t.features.card1Title}</h3>
              <p className="feature-card__desc">{t.features.card1Desc}</p>
              <ul className="feature-card__list">
                <li>{t.features.card1Item1}</li>
                <li>{t.features.card1Item2}</li>
                <li>{t.features.card1Item3}</li>
              </ul>
            </div>

            <div className="feature-card__action-bar">
              <span>{t.features.card1Cta}</span>
              <span className="feature-card__action-arrow rtl-flip" aria-hidden="true">→</span>
            </div>
          </div>

          {/* Card 2: Reaction Studio */}
          <div
            className="feature-card feature-card--teal reveal-on-scroll reveal-delay-1"
            onClick={() => onNavigate('lab')}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate('lab');
            }}
          >
            <div className="feature-card__header-bar">
              <span className="feature-card__module formula-ltr">MODULE 02</span>
              <span className="feature-card__tag">{l('SIMULATOR', 'SIMULATEUR', 'المحاكي')}</span>
            </div>

            <div className="feature-card__blueprint">
              <svg viewBox="0 0 80 80" fill="none" className="feature-card__icon">
                <path
                  d="M32 10 L48 10 M40 10 L40 28 L18 64 C16 67 18 70 22 70 L58 70 C62 70 64 67 62 64 L40 28"
                  stroke="#253224"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="rgba(44,122,123,0.08)"
                />
                <path d="M24 54 C30 50 36 58 42 54 C48 50 54 56 56 54" stroke="#2C7A7B" strokeWidth="2" strokeLinecap="round" />
                <circle className="svg-bubble svg-bubble--1" cx="34" cy="46" r="2.7" fill="#2C7A7B" />
                <circle className="svg-bubble svg-bubble--2" cx="44" cy="40" r="2.1" fill="#2E7D5B" />
                <circle className="svg-bubble svg-bubble--3" cx="42" cy="61" r="2.2" fill="#2C7A7B" />
              </svg>
            </div>

            <div className="feature-card__inner">
              <h3 className="feature-card__title">{t.features.card2Title}</h3>
              <p className="feature-card__desc">{t.features.card2Desc}</p>
              <ul className="feature-card__list">
                <li>{t.features.card2Item1}</li>
                <li>{t.features.card2Item2}</li>
                <li>{t.features.card2Item3}</li>
              </ul>
            </div>

            <div className="feature-card__action-bar">
              <span>{t.features.card2Cta}</span>
              <span className="feature-card__action-arrow rtl-flip" aria-hidden="true">→</span>
            </div>
          </div>

          {/* Card 3: Chemistry Calculators */}
          <div
            className="feature-card feature-card--gold reveal-on-scroll reveal-delay-2"
            onClick={() => onNavigate('tools')}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate('tools');
            }}
          >
            <div className="feature-card__header-bar">
              <span className="feature-card__module formula-ltr">MODULE 03</span>
              <span className="feature-card__tag">{l('SOLVERS', 'OUTILS', 'الحاسبات')}</span>
            </div>

            <div className="feature-card__blueprint">
              <svg viewBox="0 0 80 80" fill="none" className="feature-card__icon">
                <rect x="18" y="10" width="44" height="60" rx="7" stroke="#253224" strokeWidth="1.9" fill="#FCFBF7" />
                <rect x="26" y="18" width="28" height="14" rx="3" stroke="#A97822" strokeWidth="1.8" fill="rgba(169,120,34,0.14)" />
                <circle cx="28" cy="42" r="3" fill="#4E5B47" />
                <circle cx="40" cy="42" r="3" fill="#4E5B47" />
                <circle cx="52" cy="42" r="3" fill="#A97822" />
                <circle cx="28" cy="52" r="3" fill="#4E5B47" />
                <circle cx="40" cy="52" r="3" fill="#4E5B47" />
                <circle cx="52" cy="52" r="3" fill="#A97822" />
                <circle cx="28" cy="62" r="3" fill="#4E5B47" />
                <circle cx="40" cy="62" r="3" fill="#4E5B47" />
                <rect x="49" y="59" width="6" height="6" rx="1.8" fill="#B85D3B" />
              </svg>
            </div>

            <div className="feature-card__inner">
              <h3 className="feature-card__title">{t.features.card3Title}</h3>
              <p className="feature-card__desc">{t.features.card3Desc}</p>
              <ul className="feature-card__list">
                <li>{t.features.card3Item1}</li>
                <li>{t.features.card3Item2}</li>
                <li>{t.features.card3Item3}</li>
              </ul>
            </div>

            <div className="feature-card__action-bar">
              <span>{t.features.card3Cta}</span>
              <span className="feature-card__action-arrow rtl-flip" aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
