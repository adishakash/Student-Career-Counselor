import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full text-left flex items-center justify-between gap-4 px-6 py-5 hover:bg-slate-50 transition-colors"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-slate-800 text-sm">{item.q}</span>
        {isOpen
          ? <ChevronUp className="w-5 h-5 text-primary-700 flex-shrink-0" />
          : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        }
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useLanguage();

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-3">{t.faq.tag}</p>
          <h2 className="section-title mb-4">{t.faq.title}</h2>
          <p className="section-subtitle">{t.faq.subtitle}</p>
        </div>

        <div className="space-y-3">
          {t.faq.items.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
