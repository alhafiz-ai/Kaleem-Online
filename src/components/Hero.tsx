import React, { useState } from 'react';
import { Language, SiteSettings, ThemeMode } from '../types';
import { UI_TEXT } from '../utils/translations';
import { resolveAssetUrl } from '../utils/imageUtils';
import { FounderBioModal } from './FounderBioModal';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Globe2, 
  Award,
  Video,
  ShoppingBag
} from 'lucide-react';

interface HeroProps {
  lang: Language;
  settings: SiteSettings;
  theme?: ThemeMode;
  onOpenEnrollment: (courseTitle?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  settings,
  theme = 'dark',
  onOpenEnrollment
}) => {
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const t = UI_TEXT.hero;
  const isRtl = lang === 'ur' || lang === 'ar';
  const isDark = theme === 'dark';

  const scrollToCourses = () => {
    const el = document.getElementById('courses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToStore = () => {
    const el = document.getElementById('store');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={`relative overflow-hidden py-12 sm:py-20 lg:py-24 border-b transition-colors duration-200 ${
      isDark
        ? 'bg-gradient-to-b from-stone-950 via-emerald-950 to-stone-900 text-stone-100 border-amber-600/30'
        : 'bg-gradient-to-b from-amber-50/60 via-emerald-950/90 to-stone-950 text-stone-100 border-amber-500/30'
    }`}>
      
      {/* Background Islamic Arabesque Geometric Accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1.5px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Quranic Calligraphy Header Banner */}
        <div className="text-center mb-8 sm:mb-14">
          
          {/* Bismillah */}
          <div className="inline-block px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-2 border-amber-400/60 shadow-2xl shadow-amber-900/20 mb-3 sm:mb-5 relative group">
            <div className="absolute inset-0 bg-amber-400/10 rounded-3xl blur-md -z-10 group-hover:bg-amber-400/20 transition-all" />
            <p className="font-amiri text-2xl sm:text-4xl lg:text-5xl text-amber-300 font-extrabold tracking-wider leading-relaxed drop-shadow-lg select-none" dir="rtl">
              {t.bismillah}
            </p>
          </div>

          {/* Ayah callout */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-amber-300 my-1 sm:my-2 px-2">
            <span className="w-10 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-amber-500 hidden xs:inline" />
            <span className="font-amiri text-2xl sm:text-3xl lg:text-4xl text-amber-200 font-extrabold leading-relaxed tracking-wide drop-shadow" dir="rtl">
              {t.quranVerse}
            </span>
            <span className="w-10 sm:w-20 h-0.5 bg-gradient-to-l from-transparent via-amber-400 to-amber-500 hidden xs:inline" />
          </div>
          <p className="text-xs sm:text-sm text-amber-300/90 font-medium tracking-wide">
            {t.verseRef} &bull; "And say: My Lord, increase me in knowledge"
          </p>
        </div>

        {/* Main Grid: Academy Hero Text + Founder Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (7 cols): Title, Subtitle, CTAs, Stats */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>International Online Islamic Education Portal</span>
            </div>

            {/* Academy Title with enhanced Urdu/Arabic font clarity */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-100 tracking-normal leading-[1.6] sm:leading-[1.7] font-kufi">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400 drop-shadow-md">
                {settings.siteTitle[lang] || settings.siteTitle.en}
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-sm sm:text-base lg:text-lg text-stone-300 leading-[1.9] max-w-2xl mx-auto lg:mx-0 font-medium">
              {settings.tagline[lang] || settings.tagline.en}
            </p>

            {/* CTAs - Mobile Friendly Stacking */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 pt-2">
              <button
                onClick={() => onOpenEnrollment()}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 shadow-xl shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all text-sm sm:text-base flex items-center justify-center gap-2 active:scale-95 touch-target cursor-pointer font-kufi"
              >
                <span>{t.ctaEnroll[lang]}</span>
                {isRtl ? <ArrowLeft className="w-5 h-5 shrink-0" /> : <ArrowRight className="w-5 h-5 shrink-0" />}
              </button>

              <button
                onClick={scrollToCourses}
                className="w-full sm:w-auto px-5 py-3.5 sm:py-4 rounded-2xl font-semibold bg-emerald-900/80 hover:bg-emerald-800 text-amber-200 border border-amber-500/40 shadow-md transition-all text-sm sm:text-base flex items-center justify-center gap-2 touch-target cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.ctaExplore[lang]}</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('student-portal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-3.5 sm:py-4 rounded-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/50 text-sm transition-all flex items-center justify-center gap-2 touch-target cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{lang === 'ur' ? 'داخلہ اسٹیٹس و سند' : lang === 'ar' ? 'استعلام القيد والشهادة' : 'Check Admission & Sanad'}</span>
              </button>

              <button
                onClick={scrollToStore}
                className="w-full sm:w-auto px-4 py-3.5 sm:py-4 rounded-2xl font-medium bg-stone-850 hover:bg-stone-750 text-stone-200 border border-stone-700 text-sm transition-all flex items-center justify-center gap-2 touch-target cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.ctaStore[lang]}</span>
              </button>
            </div>

            {/* Stats Counter Bar - Mobile 2x2 grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 border-t border-stone-800/80">
              <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800 text-center sm:text-left">
                <Users className="w-4 h-4 text-amber-400 mb-1 mx-auto sm:mx-0" />
                <p className="text-xs sm:text-sm font-bold text-stone-100 leading-snug">{t.stats.students[lang]}</p>
              </div>
              <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800 text-center sm:text-left">
                <Globe2 className="w-4 h-4 text-emerald-400 mb-1 mx-auto sm:mx-0" />
                <p className="text-xs sm:text-sm font-bold text-stone-100 leading-snug">{t.stats.countries[lang]}</p>
              </div>
              <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800 text-center sm:text-left">
                <Award className="w-4 h-4 text-amber-400 mb-1 mx-auto sm:mx-0" />
                <p className="text-xs sm:text-sm font-bold text-stone-100 leading-snug">{t.stats.satisfaction[lang]}</p>
              </div>
              <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800 text-center sm:text-left">
                <Video className="w-4 h-4 text-emerald-400 mb-1 mx-auto sm:mx-0" />
                <p className="text-xs sm:text-sm font-bold text-stone-100 leading-snug">{t.stats.liveClasses[lang]}</p>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Founder Profile Summary Card */}
          <div className="lg:col-span-5" id="founder">
            <div className="relative bg-gradient-to-b from-stone-900 via-stone-900 to-emerald-950/80 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden hover:border-amber-400/70 transition-all">
              
              {/* Gold Top Badge */}
              <div className="flex justify-end mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-950" />
                  Verified Scholar
                </span>
              </div>

              {/* Scholar Avatar & Decorative Aura */}
              <div className="flex items-center gap-3.5 sm:gap-4 mb-4">
                <div className="relative shrink-0">
                  <img 
                    src={resolveAssetUrl(settings.founderImage || '/assets/aistudio/founder.jpg_450b2eb5.jpeg')} 
                    alt={settings.founderName[lang] || settings.founderName.en}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-amber-400 shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 p-1 rounded-full shadow">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-amber-300 font-kufi leading-snug">
                    {settings.founderName[lang] || settings.founderName.en}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1 font-medium leading-relaxed">
                    {settings.founderTitle[lang] || settings.founderTitle.en}
                  </p>
                  <p className="text-xs text-amber-400/90 font-semibold mt-1">
                    {settings.founderExperience?.[lang] || settings.founderExperience?.en || "12+ Years Teaching Tajweed, Nahw & Fiqh"}
                  </p>
                </div>
              </div>

              {/* Scholar Quote / Summary snippet */}
              <div className="bg-stone-950/80 p-3.5 sm:p-4 rounded-2xl border border-stone-800 mb-4 text-xs sm:text-sm text-stone-300 leading-[1.8] italic">
                "{settings.founderBio[lang]?.slice(0, 220) || settings.founderBio.en?.slice(0, 220)}..."
              </div>

              {/* Credentials Pills */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 text-xs">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-medium">
                  ✓ Dars-e-Nizami (MA)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-medium">
                  ✓ Takhasus fil-Ifta (Mufti)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 font-medium">
                  ✓ Ijazah Tajweed Mutqan
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setBioModalOpen(true)}
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 touch-target cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{UI_TEXT.founder.viewBioBtn[lang]}</span>
              </button>

            </div>
          </div>

        </div>

      </div>

      {/* Founder Biography Modal */}
      <FounderBioModal
        isOpen={bioModalOpen}
        onClose={() => setBioModalOpen(false)}
        settings={settings}
        lang={lang}
      />
    </section>
  );
};
