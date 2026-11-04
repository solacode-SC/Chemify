import React from 'react';
import { AppView } from './Navbar';
import { useLanguage } from '../../i18n/LanguageContext';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="footer__logo"
            aria-label="Chemify Home"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <svg
              className="footer__logo-icon"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="20" cy="20" r="4" fill="#5F6F5B" />
              <ellipse cx="20" cy="20" rx="16" ry="7" stroke="#5F6F5B" strokeWidth="1.4" fill="none" />
              <ellipse
                cx="20"
                cy="20"
                rx="16"
                ry="7"
                stroke="#5F6F5B"
                strokeWidth="1.4"
                fill="none"
                transform="rotate(60 20 20)"
              />
              <ellipse
                cx="20"
                cy="20"
                rx="16"
                ry="7"
                stroke="#5F6F5B"
                strokeWidth="1.4"
                fill="none"
                transform="rotate(-60 20 20)"
              />
            </svg>
            <span className="footer__logo-text">Chemify</span>
          </button>
          <p className="footer__tagline">{t.footer.tagline}</p>
        </div>

        <nav className="footer__nav">
          <ul className="footer__links">
            <li>
              <button className="footer__link" onClick={() => onNavigate('elements')}>
                {t.nav.elements}
              </button>
            </li>
            <li>
              <button className="footer__link" onClick={() => onNavigate('lab')}>
                {t.nav.reactions}
              </button>
            </li>
            <li>
              <button className="footer__link" onClick={() => onNavigate('tools')}>
                {t.nav.tools}
              </button>
            </li>
            <li>
              <button className="footer__link" onClick={() => onNavigate('about')}>
                {t.nav.about}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="footer__bottom">
        <p>{t.footer.copyright} © {new Date().getFullYear()} Chemify.</p>
      </div>
    </footer>
  );
};

