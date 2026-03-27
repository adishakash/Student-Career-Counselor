import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HeroSection() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleStart = (plan) => {
    dispatch({ type: 'SET_PLAN_TYPE', payload: plan });
    navigate('/questionnaire', { state: { planType: plan } });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28 text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          Trusted by students across Jammu & India
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Your Dream Career
          <br />
          <span className="text-amber-400">Starts with Clarity</span>
        </h1>

        <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
          Get a personalized career counseling report powered by AI — based on your interests,
          personality, and goals. Made for Class 8–12 students and their parents.
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-200 mb-10">
          {['10-minute assessment', 'Report delivered instantly by email', 'Expert-backed guidance'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-teal-300 flex-shrink-0" />
              {t}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => handleStart('free')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-800 font-bold text-lg rounded-xl hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl"
          >
            Get Free Report
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleStart('paid')}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold text-lg rounded-xl hover:bg-amber-600 transition-all shadow-xl hover:shadow-2xl"
          >
            Get Premium Report — ₹499
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-blue-300 text-sm">
          Join hundreds of students who discovered their perfect career path
        </p>
      </div>
    </section>
  );
}
