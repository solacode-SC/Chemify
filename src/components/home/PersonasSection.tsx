import React from 'react';
import { AppView } from '../common/Navbar';
import { useLanguage } from '../../i18n/LanguageContext';

interface PersonasSectionProps {
  onNavigate: (view: AppView) => void;
}

export const PersonasSection: React.FC<PersonasSectionProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <section className="personas-section" id="personas">
      <div className="personas-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">{t.personas.badge}</span>
          <h2 className="section-title">{t.personas.title}</h2>
          <p className="section-desc">
            {t.personas.subtitle}
          </p>
        </div>

        {/* 3 Personas Cards Grid */}
        <div className="personas-grid">
          {/* Card 1: Student */}
          <article className="persona-card">
            <div className="persona-card__frame">
              <div className="persona-card__image-container">
                <img
                  src="assets/images/botanical-student-chemist.png"
                  alt="Student chemist with dark wavy hair studying glowing atomic models in sunlit botanical greenhouse with white wisteria and kitten"
                  className="persona-card__img"
                  loading="lazy"
                />
                <span className="persona-card__badge">{t.personas.studentBadge}</span>
              </div>
              <div className="persona-card__content">
                <h3 className="persona-card__title">{t.personas.studentTitle}</h3>
                <p className="persona-card__text">
                  {t.personas.studentDesc}
                </p>
                <div className="persona-card__footer">
                  <button
                    onClick={() => onNavigate('elements')}
                    className="persona-card__link"
                    aria-label="Start Learning as a student"
                  >
                    <span>{t.personas.studentCta}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2: Researcher */}
          <article className="persona-card">
            <div className="persona-card__frame">
              <div className="persona-card__image-container">
                <img
                  src="assets/images/botanical-researcher-chemist.png"
                  alt="Researcher examining glowing crystal solutions and analytical balances in vintage greenhouse herbarium"
                  className="persona-card__img"
                  loading="lazy"
                />
                <span className="persona-card__badge">{t.personas.researcherBadge}</span>
              </div>
              <div className="persona-card__content">
                <h3 className="persona-card__title">{t.personas.researcherTitle}</h3>
                <p className="persona-card__text">
                  {t.personas.researcherDesc}
                </p>
                <div className="persona-card__footer">
                  <button
                    onClick={() => onNavigate('tools')}
                    className="persona-card__link"
                    aria-label="Open Research Tools"
                  >
                    <span>{t.personas.researcherCta}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Card 3: Curious Mind */}
          <article className="persona-card">
            <div className="persona-card__frame">
              <div className="persona-card__image-container">
                <img
                  src="assets/images/botanical-tools-guide.png"
                  alt="Curious explorer discovering atomic structures and glowing reactions in botanical conservatory"
                  className="persona-card__img"
                  loading="lazy"
                />
                <span className="persona-card__badge">{t.personas.curiousBadge}</span>
              </div>
              <div className="persona-card__content">
                <h3 className="persona-card__title">{t.personas.curiousTitle}</h3>
                <p className="persona-card__text">
                  {t.personas.curiousDesc}
                </p>
                <div className="persona-card__footer">
                  <button
                    onClick={() => onNavigate('lab')}
                    className="persona-card__link"
                    aria-label="Step into the Reaction Studio"
                  >
                    <span>{t.personas.curiousCta}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* Reaction Studio Showcase Banner */}
        <div className="studio-showcase">
          <div className="studio-showcase__image-wrap">
            <img
              src="assets/images/ghibli-botanical-lab.png"
              alt="Reaction Studio botanical laboratory apparatus with distillation flask and glowing solutions"
              className="studio-showcase__img"
              loading="lazy"
            />
            <div className="studio-showcase__stamp">
              <span>{t.personas.stampText}</span>
            </div>
          </div>
          <div className="studio-showcase__body">
            <span className="studio-showcase__tag">
              {language === 'ar' ? 'محرك كيميائي تفاعلي' : language === 'fr' ? 'Moteur Chimique Interactif' : 'Interactive Chemical Engine'}
            </span>
            <h3 className="studio-showcase__title">{t.personas.bannerTitle}</h3>
            <p className="studio-showcase__text">
              {t.personas.bannerDesc}
            </p>
            <div className="studio-showcase__features">
              <div className="studio-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E5B47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{language === 'ar' ? 'حرارة التفاعل والإنثالبي المباشر (ΔH)' : language === 'fr' ? 'Enthalpie & Énergie thermique en direct' : 'Live Heat of Reaction & Enthalpy (ΔH)'}</span>
              </div>
              <div className="studio-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E5B47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{language === 'ar' ? 'موازنة المعادلات بمصفوفات غاوس' : language === 'fr' ? 'Équilibrage matriciel gaussien automatique' : 'Gaussian Matrix Automatic Equation Balancing'}</span>
              </div>
              <div className="studio-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E5B47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{language === 'ar' ? 'حساب المتفاعل المحدِّد والإنتاجية' : language === 'fr' ? 'Calculateur de réactif limitant et rendement' : 'Limiting Reagent & Theoretical Yield Solver'}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('lab')}
              className="studio-showcase__btn"
            >
              <span>{t.personas.bannerCta}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rtl-flip">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
