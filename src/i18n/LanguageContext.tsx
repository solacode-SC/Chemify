import React, { createContext, useContext, useState, useEffect } from 'react';
import { CommonTranslations, Language } from './types';
import { COMMON_TRANSLATIONS } from './translations/common';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: CommonTranslations;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'chemify_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved === 'en' || saved === 'fr' || saved === 'ar') {
        return saved;
      }
      // Browser language check: if user's system starts with 'ar', default to Arabic, if 'fr', French, else English
      if (typeof navigator !== 'undefined') {
        if (navigator.language?.startsWith('ar')) return 'ar';
        if (navigator.language?.startsWith('fr')) return 'fr';
      }
    } catch {
      // ignore localStorage errors in sandboxed iframes
    }
    return 'en';
  });

  const isRTL = language === 'ar';
  const dir: 'ltr' | 'rtl' = isRTL ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore storage errors
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = dir;

      document.body.classList.remove('lang-en', 'lang-fr', 'lang-ar');
      document.body.classList.add(`lang-${language}`);
    }
  }, [language, dir, isRTL]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'fr' : prev === 'fr' ? 'ar' : 'en'));
  };

  const t = COMMON_TRANSLATIONS[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isRTL,
        dir
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

