import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Renders a single question card based on question_type.
 * Props: question, onAnswer, isLast, isSubmitting
 */
export default function QuestionCard({ question, onAnswer, isLast, isSubmitting, questionNumber, totalQuestions }) {
  const [selected, setSelected] = useState(null);
  const [multiSelected, setMultiSelected] = useState([]);
  const [textValue, setTextValue] = useState('');
  const { t } = useLanguage();

  const MIN_TEXT_LENGTH = 3;

  const canProceed = () => {
    if (question.question_type === 'text') return textValue.trim().length >= MIN_TEXT_LENGTH;
    if (question.question_type === 'multi_choice') return multiSelected.length > 0;
    return selected !== null;
  };

  const handleSubmit = () => {
    if (!canProceed()) return;

    let answerText = null;
    let answerValue = null;

    if (question.question_type === 'text') {
      answerText = textValue.trim();
      answerValue = textValue.trim();
    } else if (question.question_type === 'multi_choice') {
      answerValue = multiSelected;
      const labels = question.options
        .filter((o) => multiSelected.includes(o.value))
        .map((o) => o.label);
      answerText = labels.join(', ');
    } else {
      answerValue = selected;
      const option = (question.options || []).find((o) => o.value === selected);
      answerText = option?.label || selected;
    }

    onAnswer({
      questionId: question.id,
      answerText,
      answerValue,
    });

    setSelected(null);
    setMultiSelected([]);
    setTextValue('');
  };

  const toggleMulti = (value) => {
    setMultiSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="card animate-slide-up max-w-2xl mx-auto w-full">
      {/* Category tag */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
          {question.category}
        </span>
        <span className="text-xs text-slate-400">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question */}
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 leading-snug">
        {question.question_text}
      </h3>

      {/* Answer area */}
      {(question.question_type === 'single_choice' || question.question_type === 'scale') && (
        <div className="space-y-3">
          {(question.options || []).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150
                ${selected === opt.value
                  ? 'border-primary-600 bg-primary-50 text-primary-800'
                  : 'border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-slate-50'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {question.question_type === 'multi_choice' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 mb-2">{t.question.selectAll}</p>
          {(question.options || []).map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleMulti(opt.value)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-150 flex items-center gap-3
                ${multiSelected.includes(opt.value)
                  ? 'border-primary-600 bg-primary-50 text-primary-800'
                  : 'border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-slate-50'
                }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors
                ${multiSelected.includes(opt.value) ? 'bg-primary-600 border-primary-600' : 'border-slate-300'}`}>
                {multiSelected.includes(opt.value) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.7 6.3l1.6 1.6 3.3-3.3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {question.question_type === 'text' && (
        <div className="relative">
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder={t.question.writeAnswer}
            rows={4}
            className={`input-field resize-none pb-6 ${
              textValue.length > 900 ? 'border-amber-400 focus:ring-amber-400' : ''
            }`}
            maxLength={1000}
          />
          <span
            className={`absolute bottom-2 right-3 text-xs pointer-events-none ${
              textValue.length > 900 ? 'text-amber-500 font-semibold' : 'text-slate-400'
            }`}
          >
            {textValue.length}/1000
          </span>
        </div>
      )}

      {question.question_type === 'text' && textValue.length > 0 && textValue.trim().length < MIN_TEXT_LENGTH && (
        <p className="text-xs text-slate-400 mt-1">Please write at least a few words</p>
      )}

      {/* Next button */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!canProceed()}
          loading={isLast && isSubmitting}
          size="lg"
        >
          {isLast
            ? (isSubmitting ? t.question.submitting : t.question.submit)
            : t.question.next}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
