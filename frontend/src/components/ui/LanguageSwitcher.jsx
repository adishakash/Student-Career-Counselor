import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Prominent language toggle button.
 * Shows current language flag + label, with a pill toggle design.
 */
export default function LanguageSwitcher({ className = '' }) {
  const { language, toggleLanguage, t } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <button
      onClick={toggleLanguage}
      aria-label={`Switch to ${isHindi ? 'English' : 'Hindi'}`}
      className={`
        group relative inline-flex items-center gap-1.5
        bg-gradient-to-r from-amber-50 to-orange-50
        border-2 border-amber-400 hover:border-amber-500
        text-amber-800 hover:text-amber-900
        rounded-full px-3 py-1.5
        text-sm font-bold
        shadow-sm hover:shadow-md
        transition-all duration-200
        select-none
        ${className}
      `}
    >
      {/* Flag emoji */}
      <span className="text-base leading-none" aria-hidden="true">
        {isHindi ? '🇮🇳' : '🇮🇳'}
      </span>

      {/* Toggle pill */}
      <span className="flex items-center gap-1">
        <span
          className={`transition-all duration-200 ${!isHindi ? 'text-amber-900 font-extrabold' : 'text-amber-500 font-normal line-through'}`}
        >
          EN
        </span>
        <span className="text-amber-400 font-normal">/</span>
        <span
          className={`transition-all duration-200 ${isHindi ? 'text-amber-900 font-extrabold' : 'text-amber-500 font-normal line-through'}`}
        >
          हिं
        </span>
      </span>

      {/* Active label */}
      <span className="hidden sm:inline text-xs font-semibold bg-amber-400 text-white rounded-full px-2 py-0.5 ml-0.5 group-hover:bg-amber-500 transition-colors">
        {t.switchLabel}
      </span>
    </button>
  );
}
