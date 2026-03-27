import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Zap, Star, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FREE_FEATURES = [
  '10-question personalized assessment',
  'Preliminary career overview',
  'Top 3 career path suggestions',
  'Key strengths summary',
  'Basic next steps guidance',
  'PDF report delivered by email',
];

const PAID_FEATURES = [
  '20-question deep-dive assessment',
  'AI-powered comprehensive analysis',
  '6+ personalized career paths with fit scores',
  'Personality & interest pattern analysis',
  'Strengths & development areas report',
  'Detailed academic roadmap & entrance exam guide',
  'Step-by-step action plan',
  'Motivational coaching message',
  'Premium branded PDF report',
  'Priority email delivery',
];

export default function PricingSection() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleStart = (plan) => {
    dispatch({ type: 'SET_PLAN_TYPE', payload: plan });
    navigate('/questionnaire', { state: { planType: plan } });
  };

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-3">Pricing</p>
          <h2 className="section-title mb-4">Choose Your Path</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Whether you're just exploring or ready for a deep dive, we have the right plan for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Free Plan */}
          <div className="card border-2 border-slate-200 hover:border-primary-300 transition-colors flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-semibold text-teal-600 uppercase tracking-wide">Free</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-extrabold text-slate-900">₹0</span>
                <span className="text-slate-500 text-sm mb-2">forever free</span>
              </div>
              <p className="text-slate-600 text-sm">
                Perfect for students who want to explore their career options without any commitment.
              </p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-8">
              {FREE_FEATURES.map((f) => (
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
              Let's Start — Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Paid Plan */}
          <div className="relative card border-2 border-primary-700 shadow-xl flex flex-col">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
              MOST POPULAR
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Premium</span>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-extrabold text-primary-800">₹499</span>
                <span className="text-slate-500 text-sm mb-2">one-time</span>
              </div>
              <p className="text-slate-600 text-sm">
                The complete career counseling experience with deep personalization and expert-level analysis.
              </p>
            </div>

            <ul className="space-y-2.5 flex-1 mb-8">
              {PAID_FEATURES.map((f) => (
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
              Let's Start — ₹499
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">Secure payment via Razorpay. 100% satisfaction guaranteed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
