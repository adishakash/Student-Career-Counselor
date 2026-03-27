import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CreditCard, AlertCircle, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createPaymentOrder, verifyPayment, recordPaymentFailure } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

// Load Razorpay script dynamically
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

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [status, setStatus] = useState('loading'); // loading | ready | processing | error
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  const { assessmentId, student, studentId } = state;

  useEffect(() => {
    if (!assessmentId || !student) {
      navigate('/');
      return;
    }
    initPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initPayment = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Failed to load payment gateway. Please refresh and try again.');

      const data = await createPaymentOrder({ assessmentId, paymentType: 'new' });
      setOrderData(data.data);
      setStatus('ready');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const openRazorpay = useCallback(() => {
    if (!orderData) return;
    setStatus('processing');

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: 'Akash Universal Solutions',
      description: 'Student Career Counseling — Premium Report',
      image: '/favicon.svg',
      prefill: {
        name: orderData.studentName,
        email: orderData.studentEmail,
      },
      theme: { color: '#1e40af' },
      handler: async (response) => {
        try {
          await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            assessmentId,
          });
          dispatch({ type: 'PAYMENT_SUCCESS' });
          navigate('/questionnaire', { state: { planType: 'paid' } });
        } catch (err) {
          setError('Payment verification failed. Please contact support.');
          setStatus('error');
        }
      },
      modal: {
        ondismiss: async () => {
          setStatus('ready');
          try {
            await recordPaymentFailure({ razorpayOrderId: orderData.orderId, assessmentId, reason: 'dismissed' });
          } catch {}
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', async (response) => {
      try {
        await recordPaymentFailure({
          razorpayOrderId: orderData.orderId,
          assessmentId,
          reason: response.error?.description,
        });
      } catch {}
      navigate('/payment-failed', { state: { assessmentId } });
    });

    rzp.open();
  }, [orderData, assessmentId, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-primary-800 text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-400" />
          <span className="font-semibold">Secure Checkout</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="card max-w-md w-full animate-slide-up">

          {status === 'loading' && (
            <div className="flex flex-col items-center py-8 gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-slate-500">Loading secure payment...</p>
            </div>
          )}

          {(status === 'ready' || status === 'processing') && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-primary-700" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Payment</h1>
                <p className="text-slate-500 text-sm">
                  Hi {student?.name}, you're one step away from your Premium Career Report!
                </p>
              </div>

              {/* Order summary */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Premium Career Counseling Report</span>
                  <span className="font-semibold text-slate-800">₹499</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                  <span className="font-semibold text-slate-800">Total</span>
                  <span className="font-bold text-primary-800 text-lg">₹499</span>
                </div>
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
                Pay ₹499 Securely
              </Button>

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" />
                  Razorpay Secured
                </div>
                <div>•</div>
                <span>UPI, Cards, NetBanking</span>
                <div>•</div>
                <span>100% Safe</span>
              </div>
            </>
          )}

          {status === 'error' && (
            <div className="text-center py-6">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Payment Setup Failed</h2>
              <p className="text-slate-500 text-sm mb-6">{error}</p>
              <Button onClick={initPayment} variant="outline">Try Again</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
