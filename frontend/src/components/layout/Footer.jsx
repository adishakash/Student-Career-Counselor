import React, { useState } from 'react';
import { GraduationCap, Mail, MapPin, Send } from 'lucide-react';
import { resendReport } from '../../services/api';
import Button from '../ui/Button';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await resendReport(email.trim());
      setStatus('success');
      setMessage('If your email is in our system, your report has been resent!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <GraduationCap className="w-7 h-7 text-amber-400" />
              CAD Gurukul
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Helping students in India discover their true career potential through intelligent assessments, expert counseling, and personalised guidance.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:contact@cadgurukul.com"
                className="flex items-start gap-2 text-slate-400 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                adish@cadgurukul.com
              </a>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                India
              </div>
            </div>
          </div>

          {/* Resend Report */}
          <div>
            <h4 className="text-white font-semibold mb-2 text-base">Already Took the Test?</h4>
            <p className="text-slate-400 text-sm mb-4">
              Enter your email below to receive your report again.
            </p>
            <form onSubmit={handleResend} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                required
              />
              <Button
                type="submit"
                loading={status === 'loading'}
                variant="secondary"
                size="sm"
                fullWidth
              >
                <Send className="w-4 h-4" />
                Resend My Report
              </Button>
              {status === 'success' && (
                <p className="text-green-400 text-xs">{message}</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-xs">{message}</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} CAD Gurukul. All rights reserved.
          &nbsp;|&nbsp;
          <a href="mailto:contact@cadgurukul.com" className="hover:text-amber-400 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
}
