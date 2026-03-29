import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Home, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import { useApp } from '../context/AppContext';

export default function ThankYouPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const planType = location.state?.planType || state.planType || 'free';
  const email = state.student?.email;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 page-enter">
      <div className="card max-w-lg w-full text-center shadow-lg">

        {/* Success animation */}
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-teal-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
          You're All Done! 🎉
        </h1>

        <p className="text-xl font-semibold text-slate-700 mb-2">
          Your Report is on its way.
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-600 mb-6">
          <Mail className="w-5 h-5 text-primary-600" />
          <span className="text-sm">
            Report sent to{' '}
            <strong>{email || 'your email address'}</strong>
          </span>
        </div>

        {/* Plan badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${
          planType === 'paid'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-primary-50 text-primary-800'
        }`}>
          {planType === 'paid' && <Star className="w-4 h-4 fill-amber-500 text-amber-500" />}
          {planType === 'paid' ? 'Premium Career Report' : 'Free Career Report'}
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 mb-8 text-left space-y-2">
          <p className="font-semibold text-slate-800 mb-2">What happens next:</p>
          <p>✅ Check your inbox (and spam folder) for the PDF report</p>
          <p>✅ Review the career suggestions with your parents</p>
          <p>✅ Follow the action plan provided in the report</p>
          {planType === 'free' && (
            <p>⭐ Want deeper guidance? Upgrade to Premium for only ₹499!</p>
          )}
        </div>

        {/* Didn't receive? */}
        <p className="text-sm text-slate-500 mb-3">
          Didn't receive the email? Check spam or{' '}
          <a href="/#footer" className="text-primary-700 underline font-medium">
            request resend at the footer
          </a>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Button
            onClick={() => { dispatch({ type: 'RESET' }); navigate('/'); }}
            variant="outline"
            fullWidth
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
          {planType === 'free' && (
            <Button
              onClick={() => {
                if (state.upgradeToken) {
                  navigate(`/upgrade?token=${state.upgradeToken}`);
                } else {
                  // Token not in context (e.g. after page refresh) — instruct user to use email link
                  navigate('/upgrade');
                }
              }}
              variant="secondary"
              fullWidth
            >
              <Star className="w-4 h-4" />
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-8 text-slate-400 text-xs text-center">
        Questions? Email us at{' '}
        <a href="mailto:contact@cadgurukul.com" className="text-primary-600 underline">
          contact@cadgurukul.com
        </a>
      </p>
    </div>
  );
}
