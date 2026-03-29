import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const TESTIMONIAL_META = [
  { name: 'Priya Sharma', classLabel: 'Class 12 Science, Delhi', avatar: 'PS', color: 'bg-blue-600' },
  { name: 'Rohit Gupta', classLabel: 'Class 11 Commerce, Mumbai', avatar: 'RG', color: 'bg-amber-600' },
  { name: 'Anjali Bhat', classLabel: 'Class 10, Preparing for 11th', avatar: 'AB', color: 'bg-teal-600' },
  { name: 'Vikram Mahajan', classLabel: 'Class 12 Arts, Pune', avatar: 'VM', color: 'bg-purple-600' },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-3">{t.testimonials.tag}</p>
          <h2 className="section-title mb-4">{t.testimonials.title}</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIAL_META.map((meta, i) => (
            <div key={meta.name} className="card hover:shadow-md transition-shadow">
              <Stars count={5} />
              <p className="text-slate-700 text-sm leading-relaxed mt-4 mb-6">
                "{t.testimonials.items[i]?.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${meta.color} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
                  {meta.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{meta.name}</div>
                  <div className="text-slate-500 text-xs">{meta.classLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
