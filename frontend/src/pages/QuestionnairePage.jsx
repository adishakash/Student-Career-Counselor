import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { registerStudent, getQuestions, submitAnswers, generateReport } from '../services/api';
import IntakeForm from '../components/questionnaire/IntakeForm';
import QuestionCard from '../components/questionnaire/QuestionCard';
import ProgressBar from '../components/questionnaire/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const STEPS = { INTAKE: 'intake', LOADING_QUESTIONS: 'loading_questions', QUESTIONS: 'questions', SUBMITTING: 'submitting' };

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();

  // planType can come from router state (from home page) or from context
  const planType = location.state?.planType || state.planType || 'free';

  const [step, setStep] = useState(STEPS.INTAKE);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If assessment already exists in context and we're in questionnaire step, load questions
  useEffect(() => {
    if (state.currentStep === 'questionnaire' && state.assessmentId) {
      loadQuestions(state.assessmentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadQuestions = async (assessmentId) => {
    setStep(STEPS.LOADING_QUESTIONS);
    setError('');
    try {
      const data = await getQuestions(assessmentId);
      setQuestions(data.data.questions);
      setStep(STEPS.QUESTIONS);
    } catch (err) {
      setError(err.message);
      setStep(STEPS.INTAKE);
    }
  };

  const handleIntakeSubmit = async (formData) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await registerStudent({ ...formData, planType });

      dispatch({
        type: 'SET_REGISTRATION',
        payload: {
          student: formData,
          studentId: result.data.studentId,
          assessmentId: result.data.assessmentId,
          planType,
        },
      });

      if (planType === 'paid') {
        // Redirect to payment page with context already set
        navigate('/payment');
        return;
      }

      // Free flow: load questions directly
      await loadQuestions(result.data.assessmentId);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = useCallback(async (answer) => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);
    const isLast = currentQuestionIndex === questions.length - 1;

    if (!isLast) {
      setCurrentQuestionIndex((i) => i + 1);
      return;
    }

    // All questions answered — submit
    setStep(STEPS.SUBMITTING);
    setError('');
    try {
      await submitAnswers({ assessmentId: state.assessmentId, answers: updatedAnswers });
      const reportData = await generateReport(state.assessmentId);
      if (reportData?.data?.upgradeToken) {
        dispatch({ type: 'SET_UPGRADE_TOKEN', payload: reportData.data.upgradeToken });
      }
      dispatch({ type: 'QUESTIONNAIRE_COMPLETE' });
      navigate('/thank-you', { state: { planType } });
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
      setStep(STEPS.QUESTIONS);
    }
  }, [answers, currentQuestionIndex, questions.length, state.assessmentId, dispatch, navigate, planType]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-primary-800 text-white px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <GraduationCap className="w-6 h-6 text-amber-400" />
          <span className="font-semibold">Career Assessment</span>
          <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${planType === 'paid' ? 'bg-amber-500 text-white' : 'bg-white/20 text-white'}`}>
            {planType === 'paid' ? '★ Premium' : 'Free'}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 page-enter">

        {/* Progress bar (during questionnaire) */}
        {step === STEPS.QUESTIONS && questions.length > 0 && (
          <div className="mb-8">
            <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* INTAKE STEP */}
        {step === STEPS.INTAKE && (
          <IntakeForm
            onSubmit={handleIntakeSubmit}
            planType={planType}
            isLoading={isLoading}
          />
        )}

        {/* LOADING QUESTIONS */}
        {step === STEPS.LOADING_QUESTIONS && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <LoadingSpinner size="xl" />
            <p className="text-slate-600 font-medium text-lg">Preparing your personalized questions...</p>
            <p className="text-slate-400 text-sm">This takes just a moment</p>
          </div>
        )}

        {/* QUESTIONNAIRE */}
        {step === STEPS.QUESTIONS && questions.length > 0 && (
          <QuestionCard
            key={questions[currentQuestionIndex]?.id}
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
            isLast={currentQuestionIndex === questions.length - 1}
            isSubmitting={step === STEPS.SUBMITTING}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        )}

        {/* SUBMITTING */}
        {step === STEPS.SUBMITTING && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <LoadingSpinner size="xl" />
            <p className="text-slate-600 font-medium text-lg">Generating your career report...</p>
            <p className="text-slate-400 text-sm">Our AI is analysing your responses. Please wait.</p>
          </div>
        )}
      </div>
    </div>
  );
}
