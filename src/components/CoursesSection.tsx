import React, { useState } from 'react';
import { Course, Language, SiteSettings, ThemeMode } from '../types';
import { UI_TEXT } from '../utils/translations';
import { CourseDetailsModal } from './CourseDetailsModal';
import { 
  BookOpen, 
  Clock, 
  Check, 
  Award, 
  Sparkles, 
  Video, 
  ArrowRight, 
  ArrowLeft,
  UserCheck,
  Eye,
  Info
} from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
  lang: Language;
  settings: SiteSettings;
  theme?: ThemeMode;
  onOpenEnrollment: (courseTitle?: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  lang,
  settings,
  theme = 'dark',
  onOpenEnrollment
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalCourse, setModalCourse] = useState<Course | null>(null);
  const t = UI_TEXT.courses;
  const isRtl = lang === 'ur' || lang === 'ar';
  const isDark = theme === 'dark';

  const visibleCourses = courses.filter(c => c.isVisible);
  const filteredCourses = selectedCategory === 'all' 
    ? visibleCourses 
    : visibleCourses.filter(c => c.category === selectedCategory);

  return (
    <section 
      id="courses" 
      className={`py-14 sm:py-20 relative border-b transition-colors duration-200 ${
        isDark 
          ? 'bg-stone-900/95 text-stone-100 border-stone-800' 
          : 'bg-[#fbf9f5] text-stone-900 border-amber-600/20'
      }`}
    >
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
            isDark 
              ? 'bg-emerald-950 border-emerald-700/40 text-emerald-300' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Curricula & Live Mentorship</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-kufi leading-snug ${
            isDark ? 'text-amber-300' : 'text-emerald-950'
          }`}>
            {t.sectionTitle[lang]}
          </h2>
          <p className={`mt-2 sm:mt-3 text-xs sm:text-base leading-[1.8] ${
            isDark ? 'text-stone-300' : 'text-stone-600'
          }`}>
            {t.sectionSubtitle[lang]}
          </p>

          {/* Category Tabs - Fully responsive with all academic disciplines */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
            {[
              { id: 'all', label: `All Courses (${visibleCourses.length})` },
              { id: 'tajweed', label: 'Tajweed & Tarteel' },
              { id: 'arabic', label: 'Arabic Grammar' },
              { id: 'hadith_fiqh', label: 'Hadith & Fiqh' },
              { id: 'tafseer', label: 'Tafseer & Tadabbur' },
              { id: 'hifz', label: 'Quran Hifz' },
              { id: 'qirat', label: 'Qira\'at & Sanad' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all touch-target cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : isDark 
                      ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' 
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-amber-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid - Responsive Adaptive Grid (1 col on mobile, 2 cols on tablet, 3 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filteredCourses.map((course) => {
            const cardBgStyle = isDark
              ? (settings.cardBg || undefined)
              : (settings.cardBg && settings.cardBg !== '#1c1917' ? settings.cardBg : '#ffffff');
            const cardBorderStyle = settings.cardBorder && settings.cardBorder !== '#d97706'
              ? `${settings.cardBorder}66`
              : undefined;

            return (
              <div
                key={course.id}
                style={{
                  backgroundColor: cardBgStyle,
                  borderColor: cardBorderStyle
                }}
                className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col h-full justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full ${
                  isDark
                    ? 'bg-stone-850/90 border border-stone-700/80 hover:border-amber-400/90 text-stone-100'
                    : 'bg-white border-2 border-amber-200/90 hover:border-amber-400 shadow-md text-stone-900'
                } ${
                  course.isPopular
                    ? isDark 
                      ? 'border-amber-500/70 shadow-lg ring-1 ring-amber-400/30' 
                      : 'border-amber-400 shadow-lg ring-1 ring-amber-400/50'
                    : ''
                }`}
              >
                {/* Popular Badge */}
                {course.isPopular && (
                  <div className="absolute -top-3 right-4 sm:right-5">
                    <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-md uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-stone-950 shrink-0" />
                      <span>Popular / ممتاز</span>
                    </span>
                  </div>
                )}

                {/* Course Main Content (flex-1 ensures all cards align the bottom section consistently) */}
                <div className="flex-1 flex flex-col">
                  {/* Category & Level Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-2.5">
                    <span className={`px-2 sm:px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border truncate ${
                      isDark
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}>
                      {course.category.replace('_', ' & ')}
                    </span>
                    <span className={`text-[11px] sm:text-xs font-semibold flex items-center gap-1 shrink-0 ${
                      isDark ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{course.level}</span>
                    </span>
                  </div>

                  {/* Course Title - Fixed min-height for uniform row alignment */}
                  <h3 className={`text-base sm:text-lg lg:text-xl font-bold mb-2 font-clear-title leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[2.85rem] ${
                    isDark ? 'text-stone-100 hover:text-amber-300' : 'text-emerald-950'
                  }`}>
                    {course.title[lang] || course.title.en}
                  </h3>

                  {/* Concise Description with 2-line clamp */}
                  <p className={`text-xs sm:text-[13px] leading-relaxed mb-3 sm:mb-4 line-clamp-2 ${
                    isDark ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {course.description[lang] || course.description.en}
                  </p>

                  {/* Compact Info Pill Strip (pinned cleanly before footer) */}
                  <div className={`mt-auto grid grid-cols-2 gap-2 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border text-xs mb-3.5 ${
                    isDark
                      ? 'bg-stone-900/90 border-stone-800'
                      : 'bg-stone-50 border-stone-200'
                  }`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className={`truncate text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        {course.duration[lang] || course.duration.en}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className={`truncate text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                        {course.instructor[lang] || course.instructor.en}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Balanced Action Buttons (Strictly aligned across all sibling cards) */}
                <div className={`mt-auto pt-3 border-t space-y-2.5 sm:space-y-3 ${
                  isDark ? 'border-stone-800' : 'border-stone-200'
                }`}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-[11px] font-medium shrink-0 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {t.monthlyFee[lang]}
                    </span>
                    <div className="flex items-baseline gap-1.5 shrink-0">
                      <span className={`text-base sm:text-xl font-extrabold font-mono ${
                        isDark ? 'text-amber-400' : 'text-emerald-900'
                      }`}>
                        PKR {course.feeMonthlyPKR.toLocaleString()}
                      </span>
                      <span className={`text-[10px] sm:text-[11px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        (~${course.feeUSD})
                      </span>
                    </div>
                  </div>

                  {/* Dual Action Buttons: View Details & Enroll Now */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setModalCourse(course)}
                      className={`w-full py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-all cursor-pointer touch-target ${
                        isDark 
                          ? 'bg-stone-800/80 hover:bg-stone-700 text-stone-200 border-stone-700' 
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                      }`}
                      title="View Full Curriculum Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">
                        {lang === 'ur' ? 'تفصیلات دیکھیں' : lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      </span>
                    </button>

                    <button
                      onClick={() => onOpenEnrollment(course.title.en)}
                      className="w-full py-2.5 px-2 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md transition-all flex items-center justify-center gap-1 text-xs active:scale-95 cursor-pointer font-clear-title touch-target"
                      title="Enroll in 1-on-1 Class"
                    >
                      <Video className="w-3.5 h-3.5 text-stone-950 shrink-0" />
                      <span className="truncate">
                        {lang === 'ur' ? 'داخلہ لیں' : lang === 'ar' ? 'تسجيل فوري' : 'Enroll Now'}
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Comprehensive Course Details & Curriculum Modal */}
      <CourseDetailsModal
        course={modalCourse}
        isOpen={!!modalCourse}
        onClose={() => setModalCourse(null)}
        lang={lang}
        theme={theme}
        settings={settings}
        onOpenEnrollment={onOpenEnrollment}
      />
    </section>
  );
};
