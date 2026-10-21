import React from 'react';
import { Language, SiteSettings } from '../types';
import { X, Award, CheckCircle2, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

interface FounderBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
  lang: Language;
}

export const FounderBioModal: React.FC<FounderBioModalProps> = ({
  isOpen,
  onClose,
  settings,
  lang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-200">
        
        {/* Pinned Modal Header with Prominent Cancel Button */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-800 bg-stone-900/95 backdrop-blur flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-950 border border-amber-400 flex items-center justify-center text-amber-300 font-amiri text-2xl shrink-0 overflow-hidden shadow">
              <img 
                src={settings.founderImage || '/assets/aistudio/founder.jpg_450b2eb5.jpeg'} 
                alt={settings.founderName[lang] || settings.founderName.en} 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl font-bold font-kufi text-amber-300 truncate">
                {settings.founderName[lang] || settings.founderName.en}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">
                {settings.founderTitle[lang] || settings.founderTitle.en}
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

        {/* Scholar Portrait & Identity Card */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-stone-900 to-amber-950/40 p-4 sm:p-5 rounded-2xl border-2 border-amber-500/40 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 shadow-xl">
          <div className="relative shrink-0">
            <img 
              src={settings.founderImage || '/assets/aistudio/founder.jpg_450b2eb5.jpeg'} 
              alt={settings.founderName[lang] || settings.founderName.en}
              className="w-24 h-28 sm:w-28 sm:h-36 rounded-2xl object-cover object-top border-2 border-amber-400 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
              <Award className="w-3 h-3" />
              <span>مستند مفتی</span>
            </div>
          </div>
          <div className="text-center sm:text-right flex-1 min-w-0">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 inline-block mb-1.5">
              {lang === 'ur' ? 'بانی و مہتممِ ادارہ' : lang === 'ar' ? 'المؤسس والمشرف العام' : 'Founder & Academic Director'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-kufi text-amber-300">
              {settings.founderName[lang] || settings.founderName.en}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 font-medium leading-relaxed">
              {settings.founderTitle[lang] || settings.founderTitle.en}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start text-[11px]">
              <span className="bg-stone-800/80 px-2.5 py-1 rounded-lg text-emerald-300 border border-stone-700">
                {settings.founderExperience?.[lang] || settings.founderExperience?.en || (lang === 'ur' ? '12+ سالہ تدریسی تجربہ' : lang === 'ar' ? 'أكثر من 12 عاماً من الخبرة' : '12+ Years Experience')}
              </span>
              <span className="bg-stone-800/80 px-2.5 py-1 rounded-lg text-amber-300 border border-stone-700">
                {lang === 'ur' ? 'فاضل درسِ نظامی و مفتی' : lang === 'ar' ? 'خريج الدرس النظامي ومفتٍ' : 'Graduate Scholar & Mufti'}
              </span>
              <span className="bg-stone-800/80 px-2.5 py-1 rounded-lg text-stone-300 border border-stone-700">
                {lang === 'ur' ? 'مجاز فی التجوید و القراءات' : lang === 'ar' ? 'مجاز في التجويد' : 'Certified in Tajweed'}
              </span>
            </div>
          </div>
        </div>

        {/* Biography Content */}
        <div className="space-y-6 text-sm leading-relaxed text-stone-300">
          <div>
            <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-2 text-base">
              <GraduationCap className="w-5 h-5 text-amber-400" />
              {lang === 'ur' ? "علمی سند و اسناد (Academic Degrees)" : lang === 'ar' ? "السند العلمي والمؤهلات" : "Scholarly Qualifications & Degrees"}
            </h4>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-2 bg-stone-800/60 p-3 rounded-xl border border-stone-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Shahadat-ul-Alimiyyah (Dars-e-Nizami):</strong> 8-Year comprehensive classical Arabic & Shariah curriculum recognized by HEC equivalent to Master of Arts in Islamic Studies.
                </span>
              </li>
              <li className="flex items-start gap-2 bg-stone-800/60 p-3 rounded-xl border border-stone-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Takhasus fil-Fiqh wal-Ifta (Mufti Specialization):</strong> 2-Year intensive jurisprudential specialization in issuing legal verdicts according to classical Sunni principles.
                </span>
              </li>
              <li className="flex items-start gap-2 bg-stone-800/60 p-3 rounded-xl border border-stone-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Ijazah in Quranic Tajweed & Hafs 'an Asim:</strong> Connected sanad (chain) through renowned reciters with mastery in Makharij, Sifat, and Waqf.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-2 text-base">
              <BookOpen className="w-5 h-5 text-amber-400" />
              {lang === 'ur' ? "تفصیلی بائیوگرافی" : lang === 'ar' ? "السيرة الذاتية والمنهج التعليمي" : "Detailed Biography & Vision"}
            </h4>
            <p className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/40 text-stone-200 whitespace-pre-line leading-relaxed">
              {settings.founderBio[lang] || settings.founderBio.en}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-2 text-base">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              {lang === 'ur' ? "تدریسی طریقہ کار" : lang === 'ar' ? "الميزات والأسلوب التعليمي" : "Teaching Methodology & Standards"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                <span className="font-bold text-amber-300 block text-xs">1-on-1 Focus</span>
                <span className="text-xs text-stone-300">Individual pacing tailored to each student's capacity and schedule.</span>
              </div>
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                <span className="font-bold text-amber-300 block text-xs">Phonetic Accuracy</span>
                <span className="text-xs text-stone-300">Live vocal correction with daily audio feedback between lessons.</span>
              </div>
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                <span className="font-bold text-amber-300 block text-xs">Direct Quran Syntax</span>
                <span className="text-xs text-stone-300">Teaching Arabic grammar directly through Quranic examples and Ayaat.</span>
              </div>
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                <span className="font-bold text-amber-300 block text-xs">Strict Islamic Modesty</span>
                <span className="text-xs text-stone-300">Dedicated female teachers for sisters and young girls.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-stone-800 bg-stone-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors text-xs sm:text-sm shadow-md cursor-pointer font-kufi"
          >
            {lang === 'ur' ? 'مکمل / بند کریں' : lang === 'ar' ? 'تم / إغلاق' : 'Close Biography'}
          </button>
        </div>
        </div>

      </div>
    </div>
  );
};
