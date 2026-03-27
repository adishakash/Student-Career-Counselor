import React from 'react';
import { Compass, TrendingUp, Users, BookOpen, Lightbulb, Shield } from 'lucide-react';

const reasons = [
  {
    icon: Compass,
    title: 'Stop Guessing, Start Planning',
    desc: 'Most students choose a stream or college without proper understanding of their strengths. Our assessment removes that guesswork completely.',
    color: 'text-primary-700 bg-primary-50',
  },
  {
    icon: TrendingUp,
    title: 'Map Your Strengths to Careers',
    desc: 'Everyone has unique aptitudes. We analyze your interests, personality, and academic profile to suggest careers where you will genuinely thrive.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Users,
    title: 'Guidance Parents Trust',
    desc: 'Parents often struggle to guide their children beyond traditional paths. Our structured report gives families a common language to discuss the future.',
    color: 'text-teal-600 bg-teal-50',
  },
  {
    icon: BookOpen,
    title: 'Right Stream, Right Future',
    desc: 'Choosing Science, Commerce, or Arts is one of the most critical decisions. Our counseling ensures that decision is data-backed, not pressure-driven.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: Lightbulb,
    title: 'Discover Hidden Passions',
    desc: 'Sometimes students don\'t know their own potential. Our questions are designed to surface passions and strengths that haven\'t been explored yet.',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    icon: Shield,
    title: 'Avoid Costly Mistakes',
    desc: 'Switching streams or courses mid-way is expensive and stressful. Early, informed counseling saves years of time and significant money.',
    color: 'text-green-600 bg-green-50',
  },
];

export default function WhyCounseling() {
  return (
    <section id="why" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-3">The Challenge</p>
          <h2 className="section-title mb-4">
            Why Career Counseling
            <br />
            <span className="text-primary-800">Matters More Than Ever</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            India has 93 million students — yet less than 1% receive proper career guidance before making life-altering decisions. That changes today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r) => (
            <div key={r.title} className="card hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${r.color}`}>
                <r.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2 text-lg">{r.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* Stat strip */}
        <div className="mt-14 bg-primary-800 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: '93M+', label: 'Students in India' },
              { value: '<1%', label: 'Receive proper counseling' },
              { value: '40%', label: 'Drop out due to wrong stream choice' },
              { value: '10 min', label: 'To get your personalized report' },
            ].map((s) => (
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
