import React, { useState } from 'react';
import { Language } from '../types';
import { Globe, Check, Sparkles, Heart, ArrowRight, ArrowLeft, BookOpen, X } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage
}) => {
  const [selected, setSelected] = useState<Language>(currentLang || 'ur');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectLanguage(selected);
    onClose();
  };

  const isRtl = selected === 'ur' || selected === 'ar';

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-24 sm:pt-28 md:pt-32 pb-6 px-3 sm:px-5 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-8 shadow-2xl text-center overflow-hidden text-stone-100 max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8.5rem)] my-auto sm:my-0 overflow-y-auto">
        
        {/* Prominent High-Visibility Cancel / Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/90 hover:bg-rose-950/80 border border-stone-700 hover:border-rose-500/50 text-stone-300 hover:text-rose-200 transition-all shadow-sm cursor-pointer active:scale-95"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold">بند کریں</span>
        </button>

        {/* Decorative corner glows */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Sacred Bismillah Calligraphy */}
        <div className="mb-3">
          <p className="font-amiri text-2xl sm:text-3xl text-amber-300 font-bold tracking-wider leading-relaxed" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        {/* Academy Emblem Crest */}
        <div className="flex items-center justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl shadow-emerald-950/40">
            <BookOpen className="w-7 h-7 text-amber-400" />
          </div>
        </div>

        {/* Main Warm Welcome Title */}
        <div className="space-y-1 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>اہلاً وسہلاً و مرحبا &bull; Warm Islamic Welcome</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold font-kufi text-stone-100 pt-1">
            Kaleem Online Academy
          </h2>
          <p className="font-amiri text-base sm:text-lg text-amber-400 font-bold">
            کلیم آن لائن اکیڈمی میں خوش آمدید
          </p>
        </div>

        {/* Triple-Language Warm Greetings Container */}
        <div className="space-y-2.5 mb-6 text-xs sm:text-sm">
          
          {/* Urdu Warm Welcome */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-600/30 text-right font-nastaliq text-stone-200 leading-[2.1] shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-1 border-b border-emerald-700/30 pb-1">
              <span className="text-[10px] text-amber-400 font-bold font-sans uppercase">خیر مقدم (اردو)</span>
              <span className="text-xs">🇵🇰</span>
            </div>
            <p>
              <strong>السلام علیکم ورحمۃ اللہ وبرکاتہ!</strong> ہم آپ کو کلیم آن لائن اکیڈمی کے بابرکت تعلیمی پلیٹ فارم پر تہہِ دل سے خوش آمدید کہتے ہیں۔ مفتی دانش کلیم صاحب کی زیرِ نگرانی قرآن و سنت، تجوید اور عربی گرائمر کی مستند تدریس کا آغاز فرمائیے۔
            </p>
          </div>

          {/* Arabic Warm Welcome */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 text-right font-amiri text-stone-200 leading-relaxed shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-1 border-b border-amber-700/30 pb-1">
              <span className="text-[10px] text-amber-400 font-bold font-sans uppercase">ترحيب مبارك (العربية)</span>
              <span className="text-xs">🇸🇦</span>
            </div>
            <p className="text-sm sm:text-base">
              <strong>أهلاً وسهلاً ومرحباً بكم</strong> في رحاب أكاديمية كليم العالمية للتعليم الإلكتروني، صرح العلم والإيمان لتعليم التجويد والنحو والصرف بإشراف فضيلة المفتي دانش كليم.
            </p>
          </div>

          {/* English Warm Welcome */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-850 border border-stone-700 text-left text-stone-300 leading-relaxed shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-1 border-b border-stone-700 pb-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase">Cordial Welcome (English)</span>
              <span className="text-xs">🇬🇧</span>
            </div>
            <p className="text-xs sm:text-[13px]">
              <strong>Assalamu Alaikum & Welcome!</strong> An international sanctuary of authentic Sacred Islamic Knowledge, Quranic Tajweed, Classical Arabic Syntax (Nahw & Sarf), and Fiqh under Mufti Danish Kaleem.
            </p>
          </div>

        </div>

        {/* Language Selection Header */}
        <div className="mb-3 text-center">
          <p className="text-xs font-bold text-amber-300 uppercase tracking-wider font-sans">
            براہِ کرم اپنی پسندیدہ زبان منتخب فرمائیں &bull; Choose Your Language:
          </p>
        </div>

        {/* 3 Interactive Language Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
          
          {/* Urdu Option */}
          <button
            type="button"
            onClick={() => setSelected('ur')}
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              selected === 'ur'
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                : 'bg-stone-850 hover:bg-stone-800 text-stone-300 border-stone-700'
            }`}
          >
            <span className="text-2xl">🇵🇰</span>
            <span className="font-nastaliq text-base sm:text-lg">اردو (Urdu)</span>
            <span className="text-[10px] opacity-80">پاکستانی و بین الاقوامی</span>
            {selected === 'ur' && <Check className="w-4 h-4 text-stone-950 mt-1" />}
          </button>

          {/* Arabic Option */}
          <button
            type="button"
            onClick={() => setSelected('ar')}
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              selected === 'ar'
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                : 'bg-stone-850 hover:bg-stone-800 text-stone-300 border-stone-700'
            }`}
          >
            <span className="text-2xl">🇸🇦</span>
            <span className="font-amiri text-base sm:text-lg font-bold">العربية (Arabic)</span>
            <span className="text-[10px] opacity-80">للناطقين بالعربية</span>
            {selected === 'ar' && <Check className="w-4 h-4 text-stone-950 mt-1" />}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => setSelected('en')}
            className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 ${
              selected === 'en'
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                : 'bg-stone-850 hover:bg-stone-800 text-stone-300 border-stone-700'
            }`}
          >
            <span className="text-2xl">🇬🇧</span>
            <span className="font-bold text-sm sm:text-base">English</span>
            <span className="text-[10px] opacity-80">International</span>
            {selected === 'en' && <Check className="w-4 h-4 text-stone-950 mt-1" />}
          </button>

        </div>

        {/* Primary Enter Action Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full py-3.5 sm:py-4 rounded-2xl font-bold font-kufi text-stone-950 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>
            {selected === 'ur'
              ? 'اکیڈمی میں داخل ہوں (Enter Academy)'
              : selected === 'ar'
              ? 'دخول الصرح الأكاديمي'
              : 'Enter Academy Website'}
          </span>
          {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>

        <p className="text-[11px] text-stone-500 mt-3">
          You can change the language anytime from the top navigation bar.
        </p>

      </div>
    </div>
  );
};
