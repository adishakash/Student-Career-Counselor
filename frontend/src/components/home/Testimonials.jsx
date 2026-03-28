import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    class: 'Class 12 Science, Delhi',
    avatar: 'PS',
    rating: 5,
    text: 'I was completely confused between Engineering and Medicine. The premium report helped me realize I\'m better suited for Biomedical Engineering — something I had never even considered! The analysis was incredibly detailed.',
    color: 'bg-blue-600',
  },
  {
    name: 'Rohit Gupta',
    class: 'Class 11 Commerce, Mumbai',
    avatar: 'RG',
    rating: 5,
    text: 'My parents wanted me to become a CA, but the report showed my strengths lie in entrepreneurship and marketing. It gave me the courage to have an honest conversation with my family. Best ₹499 I ever spent!',
    color: 'bg-amber-600',
  },
  {
    name: 'Anjali Bhat',
    class: 'Class 10, Preparing for 11th',
    avatar: 'AB',
    rating: 5,
    text: 'The free report gave me a good idea of my interests, and I immediately upgraded. The paid report had a step-by-step roadmap for becoming a UX Designer — complete with which colleges and courses to target!',
    color: 'bg-teal-600',
  },
  {
    name: 'Vikram Mahajan',
    class: 'Class 12 Arts, Pune',
    avatar: 'VM',
    rating: 5,
    text: 'I was embarrassed about being an Arts student until this report showed me the amazing careers possible — journalism, civil services, psychology, law. It completely changed my perspective. Thank you!',
    color: 'bg-purple-600',
  },
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
  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-3">Student Stories</p>
          <h2 className="section-title mb-4">Real Students, Real Results</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            See what students across India say about their career counseling experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card hover:shadow-md transition-shadow">
              <Stars count={t.rating} />
              <p className="text-slate-700 text-sm leading-relaxed mt-4 mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} text-white text-sm font-bold flex items-center justify-center flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.class}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
