import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-primary-800 text-lg">
          <GraduationCap className="w-7 h-7 text-amber-500" />
          <span className="hidden sm:inline">Akash Universal</span>
          <span className="sm:hidden">AUS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#why" className="hover:text-primary-800 transition-colors">Why Counseling?</a>
          <a href="#pricing" className="hover:text-primary-800 transition-colors">Plans</a>
          <a href="#testimonials" className="hover:text-primary-800 transition-colors">Stories</a>
          <a href="#faq" className="hover:text-primary-800 transition-colors">FAQ</a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/#pricing')}
            className="btn-primary text-sm px-5 py-2"
          >
            Start Free
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-4 text-sm font-medium text-slate-700">
          <a href="#why" onClick={() => setMenuOpen(false)} className="hover:text-primary-800">Why Counseling?</a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="hover:text-primary-800">Plans & Pricing</a>
          <a href="#testimonials" onClick={() => setMenuOpen(false)} className="hover:text-primary-800">Student Stories</a>
          <a href="#faq" onClick={() => setMenuOpen(false)} className="hover:text-primary-800">FAQ</a>
          <button
            onClick={() => { setMenuOpen(false); navigate('/#pricing'); }}
            className="btn-primary text-sm py-2 mt-2"
          >
            Start Your Assessment
          </button>
        </div>
      )}
    </nav>
  );
}
