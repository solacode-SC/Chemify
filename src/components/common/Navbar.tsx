import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export type AppView = 'home' | 'elements' | 'lab' | 'tools' | 'about';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`} id="navbar">
        <div className="navbar__inner">
          {/* LEFT: Logo & Brand */}
          <div className="navbar__left">
            <button
              onClick={() => handleNavClick('home')}
              className="navbar__logo"
              aria-label="Chemify Home"
            >
              <svg
                className="navbar__logo-icon"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="20" cy="20" r="4" fill="#4E5B47" />
                <ellipse cx="20" cy="20" rx="16" ry="7" stroke="#4E5B47" strokeWidth="1.6" fill="none" />
                <ellipse
                  cx="20"
                  cy="20"
                  rx="16"
                  ry="7"
                  stroke="#4E5B47"
                  strokeWidth="1.6"
                  fill="none"
                  transform="rotate(60 20 20)"
                />
                <ellipse
                  cx="20"
                  cy="20"
                  rx="16"
                  ry="7"
                  stroke="#4E5B47"
                  strokeWidth="1.6"
                  fill="none"
                  transform="rotate(-60 20 20)"
                />
                <circle cx="36" cy="20" r="2.2" fill="#4E5B47" />
                <circle cx="12" cy="6.15" r="2.2" fill="#4E5B47" />
                <circle cx="12" cy="33.85" r="2.2" fill="#4E5B47" />
              </svg>
              <span className="navbar__logo-text">Chemify</span>
            </button>
          </div>

          {/* CENTER: Primary Navigation Links */}
          <nav className="navbar__center" aria-label="Main Navigation">
            <ul className="navbar__links" id="navLinks">
              <li>
                <button
                  className={`navbar__link ${currentView === 'elements' ? 'is-active' : ''}`}
                  onClick={() => handleNavClick('elements')}
                >
                  <span>{t.nav.elements}</span>
                </button>
              </li>
              <li>
                <button
                  className={`navbar__link ${currentView === 'lab' ? 'is-active' : ''}`}
                  onClick={() => handleNavClick('lab')}
                >
                  <span>{t.nav.reactions}</span>
                </button>
              </li>
              <li>
                <button
                  className={`navbar__link ${currentView === 'tools' ? 'is-active' : ''}`}
                  onClick={() => handleNavClick('tools')}
                >
                  <span>{t.nav.tools}</span>
                </button>
              </li>
              <li>
                <button
                  className={`navbar__link ${currentView === 'about' ? 'is-active' : ''}`}
                  onClick={() => handleNavClick('about')}
                >
                  <span>{t.nav.about}</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* RIGHT: Call To Action & Language Switcher & Mobile Hamburger */}
          <div className="navbar__right">
            {/* Elegant 3-Way Language Switcher Pill */}
            <div className="lang-switcher" role="group" aria-label={t.nav.language}>
              <button
                type="button"
                className={`lang-switcher__btn ${language === 'en' ? 'is-active' : ''}`}
                onClick={() => setLanguage('en')}
                title="English"
                aria-pressed={language === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                className={`lang-switcher__btn ${language === 'fr' ? 'is-active' : ''}`}
                onClick={() => setLanguage('fr')}
                title="Français"
                aria-pressed={language === 'fr'}
              >
                FR
              </button>
              <button
                type="button"
                className={`lang-switcher__btn ${language === 'ar' ? 'is-active' : ''}`}
                onClick={() => setLanguage('ar')}
                title="العربية"
                aria-pressed={language === 'ar'}
                style={{ fontFamily: "'Readex Pro', sans-serif" }}
              >
                العربية
              </button>
            </div>

            <button
              onClick={() => handleNavClick('lab')}
              className="navbar__cta"
            >
              {t.nav.enterLab}
            </button>

            <button
              className={`navbar__hamburger ${isMobileOpen ? 'is-active' : ''}`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={isMobileOpen}
            >
              <span className="navbar__hamburger-line"></span>
              <span className="navbar__hamburger-line"></span>
              <span className="navbar__hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-overlay ${isMobileOpen ? 'is-open' : ''}`}
        id="mobileOverlay"
        aria-hidden={!isMobileOpen}
      >
        <button
          className="mobile-overlay__close"
          onClick={() => setIsMobileOpen(false)}
          aria-label={t.nav.closeMenu}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4E5B47" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <ul className="mobile-overlay__links">
          <li>
            <button
              className={`mobile-overlay__link ${currentView === 'home' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              {t.nav.home}
            </button>
          </li>
          <li>
            <button
              className={`mobile-overlay__link ${currentView === 'elements' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('elements')}
            >
              {t.nav.elements}
            </button>
          </li>
          <li>
            <button
              className={`mobile-overlay__link ${currentView === 'lab' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('lab')}
            >
              {t.nav.reactions}
            </button>
          </li>
          <li>
            <button
              className={`mobile-overlay__link ${currentView === 'tools' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('tools')}
            >
              {t.nav.tools}
            </button>
          </li>
          <li>
            <button
              className={`mobile-overlay__link ${currentView === 'about' ? 'is-active' : ''}`}
              onClick={() => handleNavClick('about')}
            >
              {t.nav.about}
            </button>
          </li>
        </ul>

        {/* Mobile Language Switcher */}
        <div className="mobile-lang-switcher">
          <span className="mobile-lang-switcher__title">{t.nav.language}</span>
          <div className="lang-switcher" style={{ width: '100%', justifyContent: 'center' }}>
            <button
              type="button"
              className={`lang-switcher__btn ${language === 'en' ? 'is-active' : ''}`}
              onClick={() => setLanguage('en')}
              style={{ flex: 1, padding: '8px 8px' }}
            >
              English (EN)
            </button>
            <button
              type="button"
              className={`lang-switcher__btn ${language === 'fr' ? 'is-active' : ''}`}
              onClick={() => setLanguage('fr')}
              style={{ flex: 1, padding: '8px 8px' }}
            >
              Français (FR)
            </button>
            <button
              type="button"
              className={`lang-switcher__btn ${language === 'ar' ? 'is-active' : ''}`}
              onClick={() => setLanguage('ar')}
              style={{ flex: 1, padding: '8px 8px', fontFamily: "'Readex Pro', sans-serif" }}
            >
              العربية (AR)
            </button>
          </div>
        </div>

        <button
          className="mobile-overlay__cta"
          onClick={() => handleNavClick('lab')}
          style={{ marginTop: '1.25rem' }}
        >
          {t.nav.enterLab}
        </button>
      </div>
    </>
  );
};
