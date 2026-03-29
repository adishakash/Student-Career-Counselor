import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../context/LanguageContext';

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const pf = t.paymentFailure;

  const handleRetry = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12 page-enter">
      <div className="card max-w-md w-full text-center shadow-lg">

        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-3">{pf.title}</h1>

        <p className="text-slate-600 mb-2">
          {pf.desc} — <strong>{pf.noCharge}</strong>.
        </p>

        <p className="text-slate-500 text-sm mb-8">
          {pf.hint}
        </p>

        <div className="space-y-3">
          <Button onClick={handleRetry} fullWidth size="lg" variant="secondary">
            <RefreshCw className="w-4 h-4" />
            {pf.retry}
          </Button>

          <Button onClick={() => navigate('/')} fullWidth variant="outline">
            <Home className="w-4 h-4" />
            {pf.backHome}
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
          {pf.needHelp}{' '}
          <a
            href="mailto:contact@cadgurukul.com"
            className="text-primary-700 underline font-medium inline-flex items-center gap-1"
          >
            <Mail className="w-3.5 h-3.5" />
            {pf.contactSupport}
          </a>
        </div>
      </div>
    </div>
  );
}
