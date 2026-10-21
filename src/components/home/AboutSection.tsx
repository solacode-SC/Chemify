import React from 'react';
import { AtomVisualizer } from '../common/AtomVisualizer';
import { AppView } from '../common/Navbar';

interface AboutSectionProps {
  onNavigate: (view: AppView) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-grid">
          {/* Left Column: Text & Values */}
          <div className="about-content">
            <span className="section-eyebrow">About the Platform</span>
            <h2 className="section-title">
              Chemistry, Finally<br />Made Visual
            </h2>
            <p className="about-paragraph">
              Chemify transforms the way you interact with physical science. Instead of memorizing static paper tables and deciphering abstract formulas, explore the elements and reactions through intuitive quantum models, live orbital representations, and real-time stoichiometry.
            </p>
            <p className="about-paragraph">
              Built for students grasping valence electrons, researchers verifying Gibbs spontaneity thresholds, and curious minds who believe understanding the material world should feel inspiring.
            </p>

            {/* Metric / Feature Highlights */}
            <div className="about-metrics">
              <div className="about-metric">
                <span className="about-metric__value">118</span>
                <span className="about-metric__label">Elements with Isotopes</span>
              </div>
              <div className="about-metric">
                <span className="about-metric__value">50+</span>
                <span className="about-metric__label">Simulated Reactions</span>
              </div>
              <div className="about-metric">
                <span className="about-metric__value">10</span>
                <span className="about-metric__label">Precision Calculators</span>
              </div>
            </div>

            <div className="about-cta-wrap">
              <button
                onClick={() => onNavigate('elements')}
                className="about-link-btn"
              >
                <span>Browse the 118-Element Catalog</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                <span className="about-atom-observatory__label">Bohr Quantum Model (3D)</span>
              </div>
              <div className="about-atom-observatory__canvas-wrap">
                <AtomVisualizer size={280} />
              </div>
              <div className="about-atom-observatory__caption">
                Continuous orbital electron distribution with harmonic spin phase
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
