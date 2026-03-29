import React, { useState } from 'react';
import { GraduationCap, Mail, MapPin, Send } from 'lucide-react';
import { resendReport } from '../../services/api';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      await resendReport(email.trim());
      setStatus('success');
      setMessage(t.footer.resendSuccess);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <footer id="footer" className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-4">
              <GraduationCap className="w-7 h-7 text-amber-400" />
              {t.footer.brand}
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t.footer.brandDesc}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-base">{t.footer.contactTitle}</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:adish@cadgurukul.com"
                className="flex items-start gap-2 text-slate-400 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                adish@cadgurukul.com
              </a>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {t.footer.location}
              </div>
            </div>
          </div>

          {/* Resend Report */}
          <div>
            <h4 className="text-white font-semibold mb-2 text-base">{t.footer.resendTitle}</h4>
            <p className="text-slate-400 text-sm mb-4">
              {t.footer.resendDesc}
            </p>
            <form onSubmit={handleResend} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder={t.footer.resendPlaceholder}
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
                {t.footer.resendBtn}
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
          {t.footer.rights(new Date().getFullYear(), 'CAD Gurukul')}
          &nbsp;|&nbsp;
          <a href="mailto:contact@cadgurukul.com" className="hover:text-amber-400 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
}
