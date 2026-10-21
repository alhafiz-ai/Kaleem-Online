import React, { useState } from 'react';
import { Language, SiteSettings } from '../types';
import { storage } from '../utils/storage';
import { INITIAL_POLICIES } from '../data/initialData';
import { X, ShieldCheck, RefreshCw, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'refund' | 'privacy' | 'payment' | 'terms';
  lang: Language;
  policies?: SiteSettings['policies'];
}

export const PoliciesModal: React.FC<PoliciesModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'refund',
  lang,
  policies: propPolicies
}) => {
  const [activeTab, setActiveTab] = useState<'refund' | 'privacy' | 'payment' | 'terms'>(initialTab);

  if (!isOpen) return null;

  const currentPolicies = propPolicies || storage.getSettings().policies || INITIAL_POLICIES;
  const isRtl = lang === 'ur' || lang === 'ar';

  const tabLabels = {
    refund: {
      en: "Refund Guarantee",
      ur: "فیس واپسی ضمانت",
      ar: "سياسة الاسترجاع"
    },
    privacy: {
      en: "Privacy & Female Modesty",
      ur: "حجاب و شرعی پردہ",
      ar: "الخصوصية والستر الشرعي"
    },
    payment: {
      en: "Tuition & Fees",
      ur: "ماہانہ فیس کے ضوابط",
      ar: "ضوابط الرسوم"
    },
    terms: {
      en: "Terms & Conduct",
      ur: "قواعد و ضوابطِ داخلہ",
      ar: "شروط الخدمة"
    }
  };

  const currentText = currentPolicies[activeTab]?.[lang] || currentPolicies[activeTab]?.en || INITIAL_POLICIES[activeTab][lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Pinned Modal Header with High-Visibility Close Button */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-800 bg-stone-900/95 backdrop-blur flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl font-bold font-kufi text-amber-300 truncate">
                {lang === 'ur' 
                  ? 'دار العلوم و اکیڈمی کے رہنما اصول و پالیسیز' 
                  : lang === 'ar' 
                  ? 'السياسات والضوابط الرسمية' 
                  : 'Academy Policies & Bylaws'}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">
                {lang === 'ur'
                  ? 'طالب علم کے حقوق و فیس واپسی کا تحفظ'
                  : lang === 'ar'
                  ? 'حماية حقوق الطلاب وضمان الاسترجاع'
                  : 'Student safeguards & guarantees'}
              </p>
            </div>
          </div>

          {/* Dedicated High-Visibility Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-800 hover:bg-rose-950/80 hover:border-rose-500/50 text-stone-300 hover:text-rose-200 border border-stone-700 transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span className="text-xs font-semibold">
              {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
            </span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-stone-800 text-xs">
          <button
            onClick={() => setActiveTab('refund')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'refund' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{tabLabels.refund[lang]}</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{tabLabels.privacy[lang]}</span>
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'payment' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{tabLabels.payment[lang]}</span>
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'terms' ? 'bg-amber-500 text-stone-950 shadow-md' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{tabLabels.terms[lang]}</span>
          </button>
        </div>

        {/* Content Display */}
        <div className="bg-stone-950/80 p-5 rounded-2xl border border-stone-800 text-xs sm:text-sm leading-relaxed text-stone-200 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold font-kufi text-base">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{tabLabels[activeTab][lang]}</span>
          </div>

          <div className="whitespace-pre-line text-stone-300 font-sans leading-relaxed">
            {currentText}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-stone-400 font-amiri">
            {lang === 'ur'
              ? 'زیرِ نگرانی: مفتی دانش کلیم (فاضل درسِ نظامی و مفتی)'
              : lang === 'ar'
              ? 'تحت إشراف: فضيلة المفتي دانش كليم (المشرف العام)'
              : 'Supervised by: Mufti Danish Kaleem'}
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow transition-all font-kufi"
          >
            {lang === 'ur' ? 'سمجھ لیا اور متفق ہوں' : lang === 'ar' ? 'قرأت وموافق' : 'I Understand & Agree'}
          </button>
        </div>
        </div>

      </div>
    </div>
  );
};
