import React from 'react';
import { AppView } from '../common/Navbar';

interface FeaturesSectionProps {
  onNavigate: (view: AppView) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onNavigate }) => {
  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="section-header">
          <span className="section-eyebrow">Comprehensive Capabilities</span>
          <h2 className="section-title">Everything You Need to Explore Matter</h2>
          <p className="section-desc">
            A cohesive suite of visual discovery and computational tools designed to replace clunky legacy software.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1: Periodic Table Explorer */}
          <div
            className="feature-card"
            onClick={() => onNavigate('elements')}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate('elements');
            }}
          >
            <div className="feature-card__inner">
              <div className="feature-card__icon-box">
                <svg viewBox="0 0 80 80" fill="none" className="feature-card__icon">
                  <rect x="8" y="12" width="14" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.8" />
                  <rect x="26" y="12" width="14" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.8" />
                  <rect x="44" y="12" width="14" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.8" />
                  <rect x="8" y="30" width="14" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.8" />
                  <rect x="26" y="30" width="14" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.8" />
                  <rect x="44" y="30" width="14" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.8" />
                  <rect x="8" y="48" width="14" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.8" />
                  <rect x="26" y="48" width="14" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.8" />
                  <circle cx="58" cy="52" r="12" stroke="#4E5B47" strokeWidth="1.8" />
                  <line x1="66.5" y1="60.5" x2="74" y2="68" stroke="#4E5B47" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="feature-card__title">Periodic Table Explorer</h3>
              <p className="feature-card__desc">
                Navigate through every element with rich detail — electron shell diagrams, electronegativity heatmaps, historical discovery, isotopic abundance, and real-world uses.
              </p>
              <ul className="feature-card__list">
                <li>118 verified elements with IUPAC data</li>
                <li>Filter by chemical families & phase states</li>
                <li>Interactive Bohr atom & electron shells</li>
              </ul>
              <div className="feature-card__cta">
                <span>Explore Catalog</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Reaction Studio */}
          <div
            className="feature-card"
            onClick={() => onNavigate('lab')}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate('lab');
            }}
          >
            <div className="feature-card__inner">
              <div className="feature-card__icon-box">
                <svg viewBox="0 0 80 80" fill="none" className="feature-card__icon">
                  <path
                    d="M32 10 L48 10 M40 10 L40 28 L18 64 C16 67 18 70 22 70 L58 70 C62 70 64 67 62 64 L40 28"
                    stroke="#4E5B47"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M24 54 C30 50 36 58 42 54 C48 50 54 56 56 54" stroke="#4E5B47" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="34" cy="46" r="2.5" fill="#4E5B47" />
                  <circle cx="44" cy="40" r="1.8" fill="#4E5B47" />
                  <circle cx="42" cy="62" r="2" fill="#4E5B47" />
                </svg>
              </div>
              <h3 className="feature-card__title">Reaction Studio</h3>
              <p className="feature-card__desc">
                Combine compounds and witness reactions in real-time. Automatically calculate enthalpy (ΔH), predict limiting reagents, compute theoretical yields, and balance complex chemical systems.
              </p>
              <ul className="feature-card__list">
                <li>Gaussian matrix equation balancer</li>
                <li>Endothermic & exothermic enthalpy curves</li>
                <li>50+ preset organic & inorganic reactions</li>
              </ul>
              <div className="feature-card__cta">
                <span>Enter Studio</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Chemistry Calculators */}
          <div
            className="feature-card"
            onClick={() => onNavigate('tools')}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate('tools');
            }}
          >
            <div className="feature-card__inner">
              <div className="feature-card__icon-box">
                <svg viewBox="0 0 80 80" fill="none" className="feature-card__icon">
                  <rect x="18" y="10" width="44" height="60" rx="8" stroke="#4E5B47" strokeWidth="1.8" />
                  <rect x="26" y="18" width="28" height="14" rx="3" stroke="#4E5B47" strokeWidth="1.6" />
                  <circle cx="28" cy="42" r="3" fill="#4E5B47" />
                  <circle cx="40" cy="42" r="3" fill="#4E5B47" />
                  <circle cx="52" cy="42" r="3" fill="#4E5B47" />
                  <circle cx="28" cy="52" r="3" fill="#4E5B47" />
                  <circle cx="40" cy="52" r="3" fill="#4E5B47" />
                  <circle cx="52" cy="52" r="3" fill="#4E5B47" />
                  <circle cx="28" cy="62" r="3" fill="#4E5B47" />
                  <circle cx="40" cy="62" r="3" fill="#4E5B47" />
                  <rect x="49" y="59" width="6" height="6" rx="2" fill="#4E5B47" />
                </svg>
              </div>
              <h3 className="feature-card__title">10 Precision Tools</h3>
              <p className="feature-card__desc">
                From empirical formula solvers to Gibbs free energy and Henderson-Hasselbalch pH calculators — every computational tool is tuned with high precision and step-by-step explanations.
              </p>
              <ul className="feature-card__list">
                <li>Molar Mass & Empirical Formula solvers</li>
                <li>Thermodynamic spontaneity & Gibbs ΔG</li>
                <li>Molarity dilution & Ideal Gas Law PV=nRT</li>
              </ul>
              <div className="feature-card__cta">
                <span>View Calculators</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
