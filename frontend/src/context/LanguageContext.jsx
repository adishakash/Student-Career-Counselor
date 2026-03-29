import React, { createContext, useContext, useState, useCallback } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'cg_lang';

function getSavedLanguage() {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.startsWith('/hi')) return 'hi';
    if (path.startsWith('/en')) return 'en';
  }
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'hi' || v === 'en') return v;
  } catch {}
  return 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getSavedLanguage);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      // Update URL to match language
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const currentPrefix = prev === 'en' ? '/en' : '/hi';
        const newPrefix = next === 'en' ? '/en' : '/hi';
        const newPath = currentPath.replace(new RegExp(`^${currentPrefix}`), newPrefix) || (newPrefix + currentPath);
        window.location.href = window.location.origin + newPath;
      }
      return next;
    });
  }, []);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
