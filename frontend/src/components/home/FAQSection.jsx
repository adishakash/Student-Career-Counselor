import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: 'Who is this for?',
    a: 'This service is designed for students in Class 8 through 12 (ages 12–18) who are trying to choose the right stream, course, or career path. Parents who want guidance for their children will also find the report very valuable.',
  },
  {
    q: 'How does the AI-powered assessment work?',
    a: 'After you provide your basic information, our system generates a personalized set of questions based on your profile. These cover your academic interests, personality, skills, and goals. Your answers are then analyzed to produce a tailored career counseling report.',
  },
  {
    q: 'What is the difference between the Free and Paid report?',
    a: 'The Free report gives you a 10-question assessment with a preliminary overview, top 3 career suggestions, and key strengths. The Premium (₹499) report includes a 20-question deep-dive, 6+ career paths with detailed pathways, personality analysis, academic roadmap, and a complete action plan.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. We store your information securely in an encrypted database. We never sell your data to third parties. Your email is only used to send you your report and any replies you request.',
  },
  {
    q: 'How do I receive my report?',
    a: 'Once the assessment is complete and payment is verified (for paid reports), your PDF report will be generated and emailed to the address you provided within a few minutes.',
  },
  {
    q: 'What if I don\'t receive my email?',
    a: 'Please check your spam/junk folder first. If you still don\'t find it, scroll to the footer of this page and use the "Already took the test?" feature to resend the report to your email.',
  },
  {
    q: 'Can I upgrade from a Free to a Paid report?',
    a: 'Yes! Your free PDF report includes a special upgrade link. Clicking it will take you directly to the payment page where you can upgrade for ₹499 and receive a comprehensive premium report.',
  },
  {
    q: 'Is the ₹499 payment secure?',
    a: 'Absolutely. Payment is processed through Razorpay, one of India\'s most trusted payment gateways. We accept UPI, cards, net banking, and wallets. We never store your card details.',
  },
  {
    q: 'What if I\'m still confused after reading the report?',
    a: 'The report is designed to be a starting point for deeper exploration. For personalised 1-on-1 counseling, please reach out to us at adish@akashuniversalsolutions.com and we will be happy to schedule a session.',
  },
];

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

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-primary-700 font-semibold text-sm uppercase tracking-wider mb-3">FAQ</p>
          <h2 className="section-title mb-4">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know before getting started.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, i) => (
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
