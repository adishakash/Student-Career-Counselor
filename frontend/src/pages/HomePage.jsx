import React, { useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import StickyBar from '../components/layout/StickyBar';
import HeroSection from '../components/home/HeroSection';
import WhyCounseling from '../components/home/WhyCounseling';
import PricingSection from '../components/home/PricingSection';
import Testimonials from '../components/home/Testimonials';
import FAQSection from '../components/home/FAQSection';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const pricingRef = useRef(null);

  const handleStickyStart = () => {
    if (pricingRef.current) {
      pricingRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      dispatch({ type: 'SET_PLAN_TYPE', payload: 'free' });
      navigate('/questionnaire', { state: { planType: 'free' } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 page-enter">
        <HeroSection />
        <WhyCounseling />
        <Testimonials />
        <div ref={pricingRef}>
          <PricingSection />
        </div>
        <FAQSection />
      </main>

      <Footer />

      {/* Sticky mobile CTA bar */}
      <StickyBar onStart={handleStickyStart} />

      {/* Bottom padding on mobile to avoid overlap with sticky bar */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
}
