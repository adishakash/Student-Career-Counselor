import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function ProgressBar({ current, total }) {
  const { t } = useLanguage();
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600">
          {t.progress.label(current, total)}
        </span>
        <span className="text-sm font-bold text-primary-700">{percent}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className="bg-primary-700 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
