import React from 'react';
import { Compass, TrendingUp, Users, BookOpen, Lightbulb, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const ICONS = [Compass, TrendingUp, Users, BookOpen, Lightbulb, Shield];
const COLORS = [
  'text-primary-700 bg-primary-50',
  'text-amber-600 bg-amber-50',
  'text-teal-600 bg-teal-50',
  'text-purple-600 bg-purple-50',
  'text-orange-600 bg-orange-50',
  'text-green-600 bg-green-50',
];

export default function WhyCounseling() {
  const { t } = useLanguage();

  return (
    <section id="why" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-3">{t.why.tag}</p>
          <h2 className="section-title mb-4">
            {t.why.title}
            <br />
            <span className="text-primary-800">{t.why.titleHighlight}</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {t.why.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.why.reasons.map((r, i) => {
            const Icon = ICONS[i];
            return (
              <div key={r.title} className="card hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${COLORS[i]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">{r.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Stat strip */}
        <div className="mt-14 bg-primary-800 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {t.why.stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-amber-400 mb-1">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
