import React from 'react';
import { Language, SiteSettings, ThemeMode } from '../types';
import { UI_TEXT } from '../utils/translations';
import { 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Lock, 
  GraduationCap, 
  Sparkles, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface FooterProps {
  lang: Language;
  settings: SiteSettings;
  theme?: ThemeMode;
  onOpenPolicy: (tab: 'refund' | 'privacy' | 'payment' | 'terms') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  settings,
  theme = 'dark',
  onOpenPolicy,
  onOpenAdmin
}) => {
  const t = UI_TEXT.footer;
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t pt-16 pb-24 md:pb-12 relative overflow-hidden transition-colors duration-200 ${
      isDark 
        ? 'bg-stone-950 text-stone-300 border-amber-600/30' 
        : 'bg-[#06382b] text-emerald-100 border-amber-500/40'
    }`}>
      
      {/* Background Islamic glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-emerald-950/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className={`grid grid-cols-1 md:grid-cols-2 ${settings.activeSections.policies !== false ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-10 mb-12`}>
          
          {/* Col 1: Academy & Founder */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-lg shrink-0">
                <BookOpen className="w-6 h-6 text-amber-300 drop-shadow" />
              </div>
              <div>
                <h3 className="font-academy-brand font-bold text-lg text-amber-300">
                  {settings.siteTitle[lang] || settings.siteTitle.en}
                </h3>
                <p className="text-xs text-amber-200/80">
                  {settings.founderName[lang] || settings.founderName.en}
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed opacity-90">
              {settings.tagline[lang] || settings.tagline.en}
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Certified Alimiyyah & Ifta Credentials</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider">
              Academic Wings
            </h4>
            <ul className="space-y-2 text-xs opacity-90">
              <li>
                <a href="#courses" className="hover:text-amber-300 transition-colors">
                  1-on-1 Quran Tajweed & Phonetics
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-amber-300 transition-colors">
                  Classical Arabic Syntax (Nahw & Sarf)
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-amber-300 transition-colors">
                  Hadith Texts & Hanafi Fiqh Studies
                </a>
              </li>
              <li>
                <a href="#store" className="hover:text-amber-300 transition-colors">
                  Digital Bookstore & Video Library
                </a>
              </li>
              <li>
                <a href="#scholar-apps" className="hover:text-amber-300 transition-colors">
                  Shamela & Al-Bahith Research Directory
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Verification */}
          {settings.activeSections.policies !== false && (
          <div className="space-y-4">
            <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs opacity-90">
              <li>
                <button
                  onClick={() => onOpenPolicy('refund')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Tuition Fee & 7-Day Refund Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Student Data & Privacy Protection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('payment')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Payment Methods & Verification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Code of Scholarly Conduct
                </button>
              </li>
            </ul>
          </div>
          )}

          {/* Col 4: Contact & Admin */}
          <div className="space-y-4">
            <h4 className="font-bold text-amber-300 text-sm uppercase tracking-wider">
              Admissions Desk
            </h4>
            <div className="space-y-2 text-xs opacity-90">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {settings.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Head Office: Lahore, Pakistan (Global Online)</span>
              </div>
            </div>

            {/* Quick Admin Access Button */}
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{UI_TEXT.nav.adminPortal[lang]}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-80">
          <p className="text-center sm:text-left">
            {t.rights[lang]}
          </p>
          {settings.activeSections.policies !== false && (
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenPolicy('terms')} className="hover:text-amber-300 cursor-pointer">
              {t.terms[lang]}
            </button>
            <span>&bull;</span>
            <button onClick={() => onOpenPolicy('privacy')} className="hover:text-amber-300 cursor-pointer">
              {t.privacy[lang]}
            </button>
            <span>&bull;</span>
            <button onClick={() => onOpenPolicy('refund')} className="hover:text-amber-300 cursor-pointer">
              {t.refund[lang]}
            </button>
          </div>
          )}
        </div>

      </div>
    </footer>
  );
};
