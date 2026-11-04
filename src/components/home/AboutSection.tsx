import React from 'react';
import { AtomVisualizer } from '../common/AtomVisualizer';
import { AppView } from '../common/Navbar';
import { useLanguage } from '../../i18n/LanguageContext';

interface AboutSectionProps {
  onNavigate: (view: AppView) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-grid">
          {/* Left Column: Text & Values */}
          <div className="about-content">
            <span className="section-eyebrow">{t.about.badge}</span>
            <h2 className="section-title">
              {t.about.titleLine1}<br />{t.about.titleLine2}
            </h2>
            <p className="about-paragraph">
              {t.about.p1}
            </p>
            <p className="about-paragraph">
              {t.about.p2}
            </p>

            {/* Metric / Feature Highlights */}
            <div className="about-metrics">
              <div className="about-metric">
                <span className="about-metric__value">118</span>
                <span className="about-metric__label">{t.about.metricElements}</span>
              </div>
              <div className="about-metric">
                <span className="about-metric__value">50+</span>
                <span className="about-metric__label">{t.about.metricReactions}</span>
              </div>
              <div className="about-metric">
                <span className="about-metric__value">10</span>
                <span className="about-metric__label">{t.about.metricCalculators}</span>
              </div>
            </div>

            <div className="about-cta-wrap">
              <button
                onClick={() => onNavigate('elements')}
                className="about-link-btn"
              >
                <span>{t.about.browseCatalog}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Botanical Observatory Atom Frame */}
          <div className="about-visual">
            <div className="about-atom-observatory">
              <div className="about-atom-observatory__header">
                <span className="about-atom-observatory__dot"></span>
                <span className="about-atom-observatory__label">{t.about.bohrModelTitle}</span>
              </div>
              <div className="about-atom-observatory__canvas-wrap">
                <AtomVisualizer size={280} />
              </div>
              <div className="about-atom-observatory__caption">
                {t.about.bohrModelCaption}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
