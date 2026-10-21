import React from 'react';
import { AppView } from '../common/Navbar';

interface CtaBannerProps {
  onNavigate: (view: AppView) => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onNavigate }) => {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-container">
        <div className="cta-card">
          <div className="cta-card__inner">
            <span className="cta-card__eyebrow">Interactive Chemistry Laboratory</span>
            <h2 className="cta-card__heading">Ready to Step Into the Lab?</h2>
            <p className="cta-card__desc">
              Explore 118 elements, simulate reactions in real-time, compute thermodynamic yields, and unlock the molecular building blocks of our universe — all in your browser with zero installation.
            </p>
            <div className="cta-card__actions">
              <button
                onClick={() => {
                  onNavigate('lab');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cta-card__btn cta-card__btn--primary"
              >
                <span>Enter the Reaction Studio</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
                <span>Browse Periodic Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
