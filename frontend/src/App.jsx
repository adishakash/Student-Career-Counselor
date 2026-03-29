import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy-load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const QuestionnairePage = lazy(() => import('./pages/QuestionnairePage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const PaymentFailurePage = lazy(() => import('./pages/PaymentFailurePage'));
const UpgradePage = lazy(() => import('./pages/UpgradePage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoadingSpinner size="lg" />
    </div>
  );
}

const getBasename = () => {
  if (typeof window === 'undefined') return '';
  const path = window.location.pathname;
  if (path.startsWith('/hi')) return '/hi';
  if (path.startsWith('/en')) return '/en';
  return '';
};

export default function App() {
  const basename = getBasename();
  return (
    <LanguageProvider>
    <AppProvider>
      <BrowserRouter basename={basename}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/payment-failed" element={<PaymentFailurePage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
    </LanguageProvider>
  );
}
