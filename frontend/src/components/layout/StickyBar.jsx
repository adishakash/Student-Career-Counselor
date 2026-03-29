import React, { useState } from 'react';
import { Share2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function StickyBar({ onStart }) {
  const [shared, setShared] = useState(false);
  const { t } = useLanguage();

  const handleShare = async () => {
    const shareData = {
      title: 'Student Career Counselor',
      text: 'Discover your ideal career path with a FREE AI-powered assessment! Check this out:',
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // User cancelled share — no error needed
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl px-4 py-3 flex items-center gap-3 md:hidden">
      <button
        onClick={onStart}
        className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"
      >
        {t.sticky.startBtn}
        <ArrowRight className="w-4 h-4" />
      </button>
      <button
        onClick={handleShare}
        className="flex-shrink-0 p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
        aria-label="Share"
      >
        {shared ? (
          <span className="text-xs text-teal-600 font-semibold px-1">{t.sticky.copied}</span>
        ) : (
          <Share2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
