import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Lock, AlertCircle, Shield, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { getUpgradeInfo, createPaymentOrder, verifyPayment, recordPaymentFailure, generateReport } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function UpgradePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const { t } = useLanguage();

  const token = searchParams.get('token');
  const up = t.upgrade;

  const [status, setStatus] = useState('validating'); // validating | ready | processing | generating | error | invalid | timeout
  const [studentInfo, setStudentInfo] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setError('No upgrade token found. Please use the link from your PDF report.');
      return;
    }
    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateToken = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load payment gateway.');

      const data = await getUpgradeInfo(token);
      setStudentInfo(data.data);

      // Create an order for this upgrade
      const orderResult = await createPaymentOrder({
        assessmentId: data.data.assessmentId,
        paymentType: 'upgrade',
      });
      setOrderData(orderResult.data);

      // Pre-fill app context for post-payment questionnaire
      dispatch({
        type: 'SET_REGISTRATION',
        payload: {
          student: { name: data.data.studentName, email: data.data.studentEmail },
          studentId: data.data.studentId,
          assessmentId: data.data.assessmentId,
          planType: 'paid',
        },
      });

      setStatus('ready');
    } catch (err) {
      if (err.status === 504 || err.status === 503 || err.status === 502) {
        setStatus('timeout');
        setError('The server is temporarily unavailable. Please wait a moment and try again.');
      } else {
        setStatus('invalid');
        setError(err.message || 'This upgrade link is invalid or has expired.');
      }
    }
  };

  const openRazorpay = useCallback(() => {
    if (!orderData || !studentInfo) return;
    setStatus('processing');

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'CAD Gurukul',
      description: 'Career Counseling — Upgrade to Premium Report',
      prefill: {
        name: studentInfo.studentName,
        email: studentInfo.studentEmail,
      },
      theme: { color: '#1e40af' },
      handler: async (response) => {
        try {
          await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            assessmentId: studentInfo.assessmentId,
          });
          // Payment verified — generate paid report using cached answers (no re-questionnaire)
          setStatus('generating');
          await generateReport(studentInfo.assessmentId);
          dispatch({ type: 'PAYMENT_SUCCESS' });
          navigate('/thank-you', { state: { planType: 'paid' } });
        } catch (err) {
          setError(err.message || 'Payment verification failed. Please contact support.');
          setStatus('error');
        }
      },
      modal: {
        ondismiss: async () => {
          setStatus('ready');
          try {
            await recordPaymentFailure({ razorpayOrderId: orderData.orderId, assessmentId: studentInfo.assessmentId, reason: 'dismissed' });
          } catch {}
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      navigate('/payment-failed', { state: { assessmentId: studentInfo.assessmentId } });
    });
    rzp.open();
  }, [orderData, studentInfo, dispatch, navigate]);

  const PAID_HIGHLIGHTS = [
    '6+ career paths with fit scores & detailed pathways',
    'Full personality & interest pattern analysis',
    'Detailed academic roadmap with entrance exam guide',
    'Step-by-step personalised action plan',
    'Premium branded PDF report — delivered to your email',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-primary-800 text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-400" />
          <span className="font-semibold">{up.title}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card max-w-md w-full animate-slide-up">

          {status === 'validating' && (
            <div className="flex flex-col items-center py-10 gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-slate-500">{up.processing}</p>
            </div>
          )}

          {status === 'generating' && (
            <div className="flex flex-col items-center py-10 gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-slate-600 font-medium">{up.generating}</p>
            </div>
          )}

          {status === 'invalid' && (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">{up.invalidToken}</h2>
              <p className="text-slate-500 text-sm mb-6">{error}</p>
              <Button onClick={() => navigate('/')} variant="outline">{up.goHome}</Button>
            </div>
          )}

          {status === 'timeout' && (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Server Unavailable</h2>
              <p className="text-slate-500 text-sm mb-6">{up.timeoutMsg}</p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => { setStatus('validating'); setError(''); validateToken(); }}
                  variant="primary"
                >
                  {up.tryAgain}
                </Button>
                <Button onClick={() => navigate('/')} variant="outline">{up.goHome}</Button>
              </div>
            </div>
          )}

          {(status === 'ready' || status === 'processing' || status === 'error') && studentInfo && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-1">{up.title}</h1>
                <p className="text-slate-500 text-sm">{up.subtitle}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {PAID_HIGHLIGHTS.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="bg-slate-50 rounded-xl p-4 mb-5 flex justify-between items-center">
                <span className="text-slate-600 text-sm font-medium">Premium Report</span>
                <span className="text-2xl font-extrabold text-primary-800">₹499</span>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-3 rounded-lg text-sm mb-4">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Button
                onClick={openRazorpay}
                loading={status === 'processing'}
                fullWidth
                size="lg"
                variant="secondary"
              >
                {up.payBtn}
              </Button>

              <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-400">
                <div className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Razorpay Secured</div>
                <div>•</div>
                <span>UPI / Cards / NetBanking</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
