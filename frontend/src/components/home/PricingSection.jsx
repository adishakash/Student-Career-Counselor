import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Star, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export default function PricingSection() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const { t } = useLanguage();

  const handleStart = (plan) => {
    dispatch({ type: 'SET_PLAN_TYPE', payload: plan });
    navigate('/questionnaire', { state: { planType: plan } });
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-3">{t.pricing.tag}</p>
          <h2 className="section-title mb-4">{t.pricing.title}</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Free Plan */}
          <div className="card border-2 border-slate-200 hover:border-primary-300 transition-colors flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-semibold text-teal-600 uppercase tracking-wide">{t.pricing.free.label}</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-extrabold text-slate-900">₹0</span>
                <span className="text-slate-500 text-sm mb-2">{t.pricing.free.forever}</span>
              </div>
              <p className="text-slate-600 text-sm">
                {t.pricing.free.desc}
              </p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-8">
              {t.pricing.free.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleStart('free')}
              className="btn-outline w-full"
            >
              {t.pricing.free.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Paid Plan */}
          <div className="relative card border-2 border-primary-700 shadow-xl flex flex-col">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
              {t.pricing.mostPopular}
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">{t.pricing.paid.label}</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-extrabold text-primary-800">₹499</span>
                <span className="text-slate-500 text-sm mb-2">{t.pricing.paid.period}</span>
              </div>
              <p className="text-slate-600 text-sm">
                {t.pricing.paid.desc}
              </p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-8">
              {t.pricing.paid.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <CheckCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleStart('paid')}
              className="btn-primary w-full text-base py-4"
            >
              {t.pricing.paid.cta}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">{t.pricing.paid.secure}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
