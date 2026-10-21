import React from 'react';
import { AppView } from '../common/Navbar';

interface PersonasSectionProps {
  onNavigate: (view: AppView) => void;
}

export const PersonasSection: React.FC<PersonasSectionProps> = ({ onNavigate }) => {
  return (
    <section className="personas-section" id="personas">
      <div className="personas-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Target Personas</span>
          <h2 className="section-title">Built for Every Kind of Chemist</h2>
          <p className="section-desc">
            Whether you are mastering school coursework, publishing thermodynamic research, or discovering the elements for the very first time.
          </p>
        </div>

        {/* 3 Personas Cards Grid */}
        <div className="personas-grid">
          {/* Card 1: Student */}
          <article className="persona-card">
            <div className="persona-card__frame">
              <div className="persona-card__image-container">
                <img
                  src="assets/images/img4.png"
                  alt="Student in chemistry laboratory conducting experiments"
                  className="persona-card__img"
                  loading="lazy"
                />
                <span className="persona-card__badge">Student Learning</span>
              </div>
              <div className="persona-card__content">
                <h3 className="persona-card__title">The Student</h3>
                <p className="persona-card__text">
                  Master chemistry with interactive Bohr electron shells, step-by-step reaction balancing, and visual stoichiometry. Study smarter, retain faster, and make atomic concepts click intuitively.
                </p>
                <div className="persona-card__footer">
                  <button
                    onClick={() => onNavigate('elements')}
                    className="persona-card__link"
                    aria-label="Start Learning as a student"
                  >
                    <span>Start Learning</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                  src="assets/images/img3.png"
                  alt="Researcher analyzing chemical equations and isotopic data"
                  className="persona-card__img"
                  loading="lazy"
                />
                <span className="persona-card__badge">Research & Analysis</span>
              </div>
              <div className="persona-card__content">
                <h3 className="persona-card__title">The Researcher</h3>
                <p className="persona-card__text">
                  Access granular isotope tables, Gibbs free energy spontaneity thresholds, Ideal Gas Law constants, and matrix Gaussian equation solvers calibrated for professional accuracy.
                </p>
                <div className="persona-card__footer">
                  <button
                    onClick={() => onNavigate('tools')}
                    className="persona-card__link"
                    aria-label="Open Research Tools"
                  >
                    <span>Open Research Tools</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                  src="assets/images/curious-mind.png"
                  alt="Curious explorer discovering atomic structures and glowing reactions"
                  className="persona-card__img"
                  loading="lazy"
                />
                <span className="persona-card__badge">Curious Discovery</span>
              </div>
              <div className="persona-card__content">
                <h3 className="persona-card__title">The Curious Mind</h3>
                <p className="persona-card__text">
                  No lab coat or prerequisites needed. Discover why gold resists corrosion, how neon signs emit radiance, and what fuels the stars through playful, engaging simulations.
                </p>
                <div className="persona-card__footer">
                  <button
                    onClick={() => onNavigate('lab')}
                    className="persona-card__link"
                    aria-label="Step into the Reaction Studio"
                  >
                    <span>Step into the Lab</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
              src="assets/images/lab-studio.png"
              alt="Reaction Studio laboratory apparatus with distillation flask and balance"
              className="studio-showcase__img"
              loading="lazy"
            />
            <div className="studio-showcase__stamp">
              <span>Reaction Studio</span>
            </div>
          </div>
          <div className="studio-showcase__body">
            <span className="studio-showcase__tag">Interactive Chemistry Engine</span>
            <h3 className="studio-showcase__title">A Living Reaction Bench In Your Browser</h3>
            <p className="studio-showcase__text">
              Synthesize chemical reactions with exact stoichiometry. Measure thermodynamic enthalpy emission (ΔH), predict limiting reagents, compute exact product yields, and balance complex systems with our Gaussian solver.
            </p>
            <div className="studio-showcase__features">
              <div className="studio-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E5B47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Live Enthalpy & Exothermic Heat</span>
              </div>
              <div className="studio-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E5B47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Automated Gaussian Equation Balancer</span>
              </div>
              <div className="studio-feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4E5B47" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Limiting Reagent & Gram-Mole Calculators</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('lab')}
              className="studio-showcase__btn"
            >
              <span>Launch Reaction Studio</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
