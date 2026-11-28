import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export type AppView = 'home' | 'elements' | 'lab' | 'tools' | 'about';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const l = (en: string, fr: string, ar: string) =>
    language === 'ar' ? ar : language === 'fr' ? fr : en;

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

  // Lock body scroll when mobile/tablet side drawer is open
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

  const navItems: {
    id: AppView;
    icon: string;
    label: string;
    desc: string;
    badge?: string;
  }[] = [
    {
      id: 'home',
      icon: '🏛️',
      label: t.nav.home,
      desc: l('Botanical chemistry observatory overview', 'Aperçu de l’observatoire chimique', 'نظرة عامة على المرصد الكيميائي')
    },
    {
      id: 'elements',
      icon: '🧬',
      label: t.nav.elements,
      desc: l('Interactive 118-element periodic table & shells', 'Tableau périodique interactif des 118 éléments', 'الجدول الدوري التفاعلي لـ 118 عنصراً'),
      badge: '118'
    },
    {
      id: 'lab',
      icon: '⚗️',
      label: t.nav.reactions,
      desc: l('Live lab bench apparatus & molecular field', 'Paillasse en direct & simulateur moléculaire', 'طاولة المختبر الحية ومحاكاة الجزيئات'),
      badge: l('Live', 'Direct', 'حي')
    },
    {
      id: 'tools',
      icon: '🧮',
      label: t.nav.tools,
      desc: l('10 precision calculators & crash courses', '10 calculateurs de précision & cours express', '10 حاسبات كيميائية دقيقة وشروحات'),
      badge: '10'
    },
    {
      id: 'about',
      icon: '🌿',
      label: t.nav.about,
      desc: l('Scientific mission & design philosophy', 'Mission scientifique & philosophie', 'الرسالة العلمية وفلسفة التصميم')
    }
  ];

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
                <circle cx="20" cy="20" r="4.2" fill="#2E7D5B" />
                <ellipse cx="20" cy="20" rx="16" ry="7" stroke="#4E5B47" strokeWidth="1.65" fill="none" />
                <ellipse
                  cx="20"
                  cy="20"
                  rx="16"
                  ry="7"
                  stroke="#2C7A7B"
                  strokeWidth="1.65"
                  fill="none"
                  transform="rotate(60 20 20)"
                />
                <ellipse
                  cx="20"
                  cy="20"
                  rx="16"
                  ry="7"
                  stroke="#6F7F63"
                  strokeWidth="1.65"
                  fill="none"
                  transform="rotate(-60 20 20)"
                />
                <circle cx="36" cy="20" r="2.2" fill="#2E7D5B" />
                <circle cx="12" cy="6.15" r="2.2" fill="#2C7A7B" />
                <circle cx="12" cy="33.85" r="2.2" fill="#C6923A" />
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

          {/* RIGHT: Call To Action & Language Switcher & Mobile/Tablet Hamburger */}
          <div className="navbar__right">
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

      {/* Structured Mobile & Tablet Side Drawer + Backdrop */}
      <div
        className={`side-drawer-backdrop ${isMobileOpen ? 'is-open' : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden={!isMobileOpen}
      />

      <aside
        className={`side-drawer ${isMobileOpen ? 'is-open' : ''} ${isRTL ? 'side-drawer--rtl' : ''}`}
        id="mobileOverlay"
        aria-hidden={!isMobileOpen}
        aria-label={l('Site Navigation Drawer', 'Menu latéral de navigation', 'القائمة الجانبية للتصفح')}
      >
        {/* 1. Drawer Top Header */}
        <div className="side-drawer__header">
          <div className="side-drawer__brand">
            <div className="side-drawer__brand-icon">
              <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <circle cx="20" cy="20" r="4" fill="#FAF8F5" />
                <ellipse cx="20" cy="20" rx="16" ry="7" stroke="#FAF8F5" strokeWidth="1.8" fill="none" />
                <ellipse cx="20" cy="20" rx="16" ry="7" stroke="#FAF8F5" strokeWidth="1.8" fill="none" transform="rotate(60 20 20)" />
                <ellipse cx="20" cy="20" rx="16" ry="7" stroke="#FAF8F5" strokeWidth="1.8" fill="none" transform="rotate(-60 20 20)" />
              </svg>
            </div>
            <div>
              <div className="side-drawer__brand-title">Chemify</div>
              <div className="side-drawer__brand-subtitle">
                {l('Botanical Chemistry Studio', 'Observatoire Chimique', 'مرصد الكيمياء النباتي')}
              </div>
            </div>
          </div>

          <button
            className="side-drawer__close"
            onClick={() => setIsMobileOpen(false)}
            aria-label={t.nav.closeMenu}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 2. Drawer Scrollable Body: Structured Navigation Cards */}
        <div className="side-drawer__body no-scrollbar">
          <div className="side-drawer__section-label">
            {l('Observatory Modules', 'Modules de l’Observatoire', 'أقسام المرصد العلمي')}
          </div>

          <ul className="side-drawer__nav-list">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`side-drawer__nav-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                  >
                    <span className="side-drawer__nav-icon">{item.icon}</span>
                    <div className="side-drawer__nav-text">
                      <div className="side-drawer__nav-title-row">
                        <span className="side-drawer__nav-title">{item.label}</span>
                        {item.badge && (
                          <span className={`side-drawer__nav-badge ${isActive ? 'is-active' : ''}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="side-drawer__nav-desc">{item.desc}</span>
                    </div>
                    <span className="side-drawer__nav-arrow">{isRTL ? '←' : '→'}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Featured Quick-Launch Studio Card */}
          <div className="side-drawer__highlight-card">
            <div className="side-drawer__highlight-header">
              <span>🧪</span>
              <strong>
                {l('Interactive Reaction Lab', 'Laboratoire de Réactions', 'مختبر التفاعلات التفاعلي')}
              </strong>
            </div>
            <p className="side-drawer__highlight-text">
              {l(
                'Switch seamlessly between macroscopic lab glassware and live atomic molecular collisions.',
                'Basculez entre la verrerie de paillasse et les collisions moléculaires atomiques en direct.',
                'بدّل بسلاسة بين أدوات المختبر الزجاجية الحية ومحاكاة تصادمات الجزيئات والذرات.'
              )}
            </p>
            <button
              type="button"
              className="side-drawer__cta-btn"
              onClick={() => handleNavClick('lab')}
            >
              <span>⚗️</span>
              <span>{t.nav.enterLab}</span>
              <span>{isRTL ? '←' : '→'}</span>
            </button>
          </div>
        </div>

        {/* 3. Drawer Footer: Structured Language Switcher */}
        <div className="side-drawer__footer">
          <div className="side-drawer__section-label" style={{ marginBottom: '8px' }}>
            🌐 {t.nav.language}
          </div>
          <div className="side-drawer__lang-grid">
            <button
              type="button"
              className={`side-drawer__lang-btn ${language === 'en' ? 'is-active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              <span className="side-drawer__lang-code">EN</span>
              <span className="side-drawer__lang-name">English</span>
            </button>
            <button
              type="button"
              className={`side-drawer__lang-btn ${language === 'fr' ? 'is-active' : ''}`}
              onClick={() => setLanguage('fr')}
            >
              <span className="side-drawer__lang-code">FR</span>
              <span className="side-drawer__lang-name">Français</span>
            </button>
            <button
              type="button"
              className={`side-drawer__lang-btn ${language === 'ar' ? 'is-active' : ''}`}
              onClick={() => setLanguage('ar')}
              style={{ fontFamily: "'Readex Pro', sans-serif" }}
            >
              <span className="side-drawer__lang-code">AR</span>
              <span className="side-drawer__lang-name">العربية</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
