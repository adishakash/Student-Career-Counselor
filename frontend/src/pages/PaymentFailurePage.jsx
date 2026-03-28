import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle, RefreshCw, Home, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const assessmentId = location.state?.assessmentId;

  const handleRetry = () => {
    // Navigate back to payment page — assessment still exists
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 page-enter">
      <div className="card max-w-md w-full text-center shadow-lg">

        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Payment Unsuccessful</h1>

        <p className="text-slate-600 mb-2">
          Don't worry — your progress has been saved and <strong>no money was charged</strong>.
        </p>

        <p className="text-slate-500 text-sm mb-8">
          This can happen due to a network issue, insufficient balance, or a bank decline. You can safely try again.
        </p>

        <div className="space-y-3">
          <Button onClick={handleRetry} fullWidth size="lg" variant="secondary">
            <RefreshCw className="w-4 h-4" />
            Try Payment Again
          </Button>

          <Button onClick={() => navigate('/')} fullWidth variant="outline">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
          Need help?{' '}
          <a
            href="mailto:contact@cadgurukul.com"
            className="text-primary-700 underline font-medium inline-flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
