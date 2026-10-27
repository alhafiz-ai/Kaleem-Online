import React, { useState, useEffect, useCallback } from 'react';
import { TestimonialItem, Language, ThemeMode, SiteSettings } from '../types';
import { UI_TEXT } from '../utils/translations';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Pause,
  Play,
  Award,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
  lang: Language;
  theme: ThemeMode;
  settings: SiteSettings;
  onVerifySanad: (certNumber: string) => void;
  onOpenEnrollment: (courseTitle?: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  lang,
  theme,
  onVerifySanad,
  onOpenEnrollment
}) => {
  const visibleItems = testimonials.filter((t) => t.isVisible);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const isDark = theme === 'dark';
  const isRtl = lang === 'ur' || lang === 'ar';
  const total = visibleItems.length;

  useEffect(() => {
    if (activeIndex >= total && total > 0) {
      setActiveIndex(0);
    }
  }, [total, activeIndex]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!isAutoPlaying || total <= 1) return;
    const timer = window.setInterval(goNext, 6500);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying, total, goNext]);

  if (total === 0) return null;

  const safeIndex = activeIndex < total ? activeIndex : 0;
  const current = visibleItems[safeIndex];
  const nextIdx = (safeIndex + 1) % total;
  const secondary = total > 1 ? visibleItems[nextIdx] : null;

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'K';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      isRtl ? goPrev() : goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      isRtl ? goNext() : goPrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        isRtl ? goPrev() : goNext();
      } else {
        isRtl ? goNext() : goPrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <section
      id="testimonials"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={UI_TEXT.testimonials.sectionTitle[lang]}
      className={`py-16 sm:py-20 border-t transition-colors duration-200 focus:outline-none ${
        isDark
          ? 'bg-stone-950/80 border-stone-800/80 text-stone-100'
          : 'bg-stone-50/90 border-stone-200/80 text-stone-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Carousel Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p
              className={`text-xs font-semibold mb-2 ${
                isDark ? 'text-amber-400' : 'text-emerald-800'
              }`}
            >
              {lang === 'ur'
                ? 'مصدقہ فارغ التحصیل طلبہ · 25+ ممالک'
                : lang === 'ar'
                ? 'خريجون موثقون · أكثر من 25 دولة'
                : 'Verified Graduate Outcomes · 25+ Countries'}
            </p>
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight [text-wrap:balance] ${
                isDark ? 'text-white' : 'text-stone-900'
              }`}
            >
              {UI_TEXT.testimonials.sectionTitle[lang]}
            </h2>
            <p
              className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
                isDark ? 'text-stone-400' : 'text-stone-600'
              }`}
            >
              {UI_TEXT.testimonials.sectionSubtitle[lang]}
            </p>
          </div>

          {/* Playback & Slide Navigation */}
          {total > 1 && (
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <span
                className={`text-xs font-mono tabular-nums px-2 ${
                  isDark ? 'text-stone-400' : 'text-stone-600'
                }`}
              >
                {String(safeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={() => setIsAutoPlaying((p) => !p)}
                aria-label={isAutoPlaying ? 'Pause testimonial slider' : 'Play testimonial slider'}
                title={isAutoPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
                className={`p-2.5 rounded-xl border transition-colors touch-target flex items-center justify-center ${
                  isDark
                    ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-500/40'
                    : 'bg-white border-stone-200 text-stone-700 hover:text-emerald-800 hover:border-emerald-300'
                }`}
              >
                {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={isRtl ? goNext : goPrev}
                aria-label="Previous student story"
                className={`p-2.5 rounded-xl border transition-colors touch-target flex items-center justify-center ${
                  isDark
                    ? 'bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800 hover:border-amber-500/40'
                    : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-100 hover:border-emerald-300'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={isRtl ? goPrev : goNext}
                aria-label="Next student story"
                className={`p-2.5 rounded-xl border transition-colors touch-target flex items-center justify-center ${
                  isDark
                    ? 'bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800 hover:border-amber-500/40'
                    : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-100 hover:border-emerald-300'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Interactive Slider Stage */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* Featured Active Story (8 cols on desktop) */}
          <article
            className={`${
              secondary ? 'lg:col-span-8' : 'lg:col-span-12'
            } rounded-2xl border p-6 sm:p-8 md:p-10 flex flex-col justify-between transition-opacity duration-200 ${
              isDark
                ? 'bg-stone-900 border-stone-800'
                : 'bg-white border-stone-200 shadow-sm'
            }`}
          >
            <div>
              {/* Top Row: Star Rating + Unboxed Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-200/70 dark:border-stone-800">
                <div className="flex items-center gap-1" aria-label={`${current.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < current.rating
                          ? 'text-amber-500 fill-amber-500'
                          : isDark
                          ? 'text-stone-700'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span
                    className={`ms-2 text-xs font-mono tabular-nums ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}
                  >
                    {current.rating.toFixed(1)}
                  </span>
                </div>

                {/* Clean Unboxed Metadata per Anti-Slop Discipline */}
                <div
                  className={`flex flex-wrap items-center gap-2 text-xs ${
                    isDark ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  <span>{current.courseCompleted[lang]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{current.completionDate}</span>
                </div>
              </div>

              {/* Main Student Reflection Quote */}
              <blockquote
                className={`mt-6 text-base sm:text-lg md:text-xl leading-relaxed font-normal ${
                  isDark ? 'text-stone-100' : 'text-stone-800'
                }`}
              >
                “{current.quote[lang]}”
              </blockquote>

              {/* Documented Learning Outcome */}
              <div
                className={`mt-6 pt-5 border-t ${
                  isDark ? 'border-stone-800/90' : 'border-stone-100'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 mt-1 shrink-0 ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  />
                  <div className="text-sm leading-relaxed">
                    <span
                      className={`font-semibold me-1.5 ${
                        isDark ? 'text-amber-400' : 'text-emerald-900'
                      }`}
                    >
                      {UI_TEXT.testimonials.outcomeLabel[lang]}
                    </span>
                    <span className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                      {current.outcome[lang]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attribution Footer & Verifiable Sanad Action */}
            <div className="mt-8 pt-5 border-t border-stone-200/70 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                    isDark
                      ? 'bg-emerald-950 text-amber-300 border-emerald-800'
                      : 'bg-emerald-900 text-amber-200 border-emerald-800'
                  }`}
                >
                  {getInitials(current.studentName.en || current.studentName[lang])}
                </div>
                <div>
                  <h3
                    className={`font-bold text-sm sm:text-base font-clear-title ${
                      isDark ? 'text-white' : 'text-stone-900'
                    }`}
                  >
                    {current.studentName[lang]}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    <span>{current.location[lang]}</span>
                    {current.certNumber && (
                      <>
                        <span aria-hidden="true" className="mx-1.5">
                          ·
                        </span>
                        <span className="font-mono">{current.certNumber}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {current.certNumber && (
                  <button
                    type="button"
                    onClick={() => onVerifySanad(current.certNumber!)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                      isDark
                        ? 'bg-stone-950 hover:bg-stone-800 text-amber-300 border-amber-500/30'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{UI_TEXT.testimonials.verifyBtn[lang]}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onOpenEnrollment(current.courseCompleted[lang])}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{UI_TEXT.testimonials.enrollCta[lang]}</span>
                </button>
              </div>
            </div>
          </article>

          {/* Secondary Preview Card & Quick Selector List (4 cols on desktop) */}
          {secondary && (
            <div className="lg:col-span-4 flex flex-col justify-between gap-4">
              <div
                onClick={goNext}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goNext();
                  }
                }}
                className={`flex-1 rounded-2xl border p-6 flex flex-col justify-between cursor-pointer transition-colors ${
                  isDark
                    ? 'bg-stone-900/60 hover:bg-stone-900 border-stone-800/90'
                    : 'bg-stone-100/70 hover:bg-white border-stone-200/90'
                }`}
              >
                <div>
                  <p
                    className={`text-xs font-medium mb-3 ${
                      isDark ? 'text-amber-400/90' : 'text-emerald-800'
                    }`}
                  >
                    {lang === 'ur'
                      ? 'اگلی کامیابی کی داستان'
                      : lang === 'ar'
                      ? 'الشهادة التالية'
                      : 'Up Next'}
                  </p>
                  <p
                    className={`text-sm leading-relaxed line-clamp-4 ${
                      isDark ? 'text-stone-300' : 'text-stone-700'
                    }`}
                  >
                    “{secondary.quote[lang]}”
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between gap-2">
                  <div>
                    <p
                      className={`text-sm font-bold font-clear-title ${
                        isDark ? 'text-stone-100' : 'text-stone-900'
                      }`}
                    >
                      {secondary.studentName[lang]}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {secondary.location[lang]} · {secondary.completionDate}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 ${
                      isRtl ? 'rotate-180' : ''
                    } ${isDark ? 'text-amber-400' : 'text-emerald-700'}`}
                  />
                </div>
              </div>

              {/* Accessible Slide Selector Strip */}
              <div
                className={`rounded-2xl border p-4 ${
                  isDark ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`text-xs font-medium ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}
                  >
                    {lang === 'ur'
                      ? 'تمام فارغ التحصیل طلبہ'
                      : lang === 'ar'
                      ? 'جميع قصص النجاح'
                      : 'Select Graduate Story'}
                  </span>
                  <span
                    className={`text-xs font-mono tabular-nums ${
                      isDark ? 'text-stone-500' : 'text-stone-400'
                    }`}
                  >
                    {total} {lang === 'ur' ? 'شہادات' : lang === 'ar' ? 'شهادات' : 'stories'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {visibleItems.map((item, idx) => {
                    const isActive = idx === safeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveIndex(idx);
                          setIsAutoPlaying(false);
                        }}
                        aria-label={`View testimonial from ${item.studentName.en}`}
                        aria-current={isActive ? 'true' : undefined}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors truncate max-w-[150px] ${
                          isActive
                            ? isDark
                              ? 'bg-amber-600 text-stone-950 font-bold'
                              : 'bg-emerald-800 text-white font-semibold'
                            : isDark
                            ? 'bg-stone-800/80 text-stone-300 hover:bg-stone-800'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {item.studentName[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
