import React from 'react';
import { AppView } from '../common/Navbar';
import { useLanguage } from '../../i18n/LanguageContext';

interface CtaBannerProps {
  onNavigate: (view: AppView) => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <section className="cta-section" id="cta">
      <div className="cta-container">
        <div className="cta-card">
          <div className="cta-card__inner">
            <span className="cta-card__eyebrow">{t.cta.badge}</span>
            <h2 className="cta-card__heading">{t.cta.title}</h2>
            <p className="cta-card__desc">
              {t.cta.desc}
            </p>
            <div className="cta-card__actions">
              <button
                onClick={() => {
                  onNavigate('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cta-card__btn cta-card__btn--primary"
              >
                <span>{t.cta.btnPrimary}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <button
                onClick={() => {
                  onNavigate('elements');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cta-card__btn cta-card__btn--secondary"
              >
                <span>{t.cta.btnSecondary}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
