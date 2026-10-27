import React from 'react';
import { Course, Language, ThemeMode, SiteSettings } from '../types';
import { openExternalSafe } from '../utils/printHelper';
import { 
  X, 
  BookOpen, 
  Clock, 
  Award, 
  UserCheck, 
  CheckCircle2, 
  Video, 
  MessageCircle, 
  Calendar, 
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  theme?: ThemeMode;
  settings: SiteSettings;
  onOpenEnrollment: (courseTitle?: string) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  lang,
  theme = 'light',
  settings,
  onOpenEnrollment
}) => {
  if (!isOpen || !course) return null;

  const isDark = theme === 'dark';
  const isRtl = lang === 'ur' || lang === 'ar';

  const handleWhatsAppInquiry = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const courseTitle = course.title[lang] || course.title.en;
    const msg = lang === 'ur'
      ? `السلام علیکم ورحمۃ اللہ مفتی صاحب، میں کورس "${courseTitle}" کے نصاب اور ون آن ون کلاسز کے اوقات کے متعلق معلومات حاصل کرنا چاہتا ہوں۔`
      : lang === 'ar'
      ? `السلام عليكم ورحمة الله يا فضيلة المفتي، أود الاستفسار عن تفاصيل دورة "${courseTitle}" ومواعيد الحصص الفردية المباشرة.`
      : `Assalamu Alaikum Mufti Danish, I would like to inquire about the syllabus and 1-on-1 schedule for the course: "${courseTitle}".`;
    openExternalSafe(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`);
  };

  const categoryLabels: Record<string, { ur: string; ar: string; en: string }> = {
    tajweed: { ur: 'تجوید و قراءت', ar: 'التجويد والقراءات', en: 'Tajweed & Phonetics' },
    arabic: { ur: 'عربی گرائمر و ادب', ar: 'النحو والصرف والبلاغة', en: 'Classical Arabic' },
    hadith_fiqh: { ur: 'حدیث و فقہِ اسلامی', ar: 'الحديث الشريف والفقه', en: 'Hadith & Fiqh' },
    tafseer: { ur: 'تفسیر و تدبرِ قرآن', ar: 'التفسير وعلوم القرآن', en: 'Quranic Exegesis' },
    hifz: { ur: 'حفظِ قرآن مع تجوید', ar: 'تحفيظ القرآن الكريم', en: 'Quran Memorization' },
    qirat: { ur: 'قراءاتِ سبعہ و عشرہ', ar: 'القراءات السبع والعشر', en: 'Seven Qiraat' },
  };

  const catLabel = categoryLabels[course.category]?.[lang] || course.category.replace('_', ' & ');

  return (
    <div 
      className="fixed inset-0 z-[90] flex items-start justify-center pt-24 sm:pt-28 md:pt-32 pb-6 px-3 sm:px-5 bg-stone-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-2xl max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8.5rem)] my-auto sm:my-0 flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden transition-all duration-300 ${
          isDark 
            ? 'bg-stone-900 border-amber-500/50 text-stone-100' 
            : 'bg-white border-amber-400 text-stone-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between gap-4 ${
          isDark 
            ? 'bg-stone-950/80 border-stone-800' 
            : 'bg-gradient-to-r from-amber-50/80 to-emerald-50/50 border-amber-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-amber-400/80 flex items-center justify-center text-amber-300 shadow shrink-0">
              <BookOpen className="w-6 h-6 drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-stone-950 shadow-sm">
                  {catLabel}
                </span>
                <span className={`text-xs font-semibold flex items-center gap-1 ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {course.level}
                </span>
              </div>
              <span className={`text-[11px] font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
                {lang === 'ur' ? 'تفصیلی نصاب و معلومات' : lang === 'ar' ? 'المنهج الدراسي والتفاصيل' : 'Curriculum & Details'}
              </span>
            </div>
          </div>

          {/* Prominent High-Visibility Cancel / Close Button */}
          <button
            onClick={onClose}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition-all shadow-sm cursor-pointer active:scale-95 shrink-0 ${
              isDark 
                ? 'bg-stone-800 hover:bg-rose-950/70 border-stone-700 hover:border-rose-500/50 text-stone-200 hover:text-rose-200' 
                : 'bg-stone-100 hover:bg-rose-50 border-stone-300 hover:border-rose-300 text-stone-700 hover:text-rose-700'
            }`}
            title="بند کریں / Close"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="text-xs font-semibold">
              {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-sm">
          
          {/* Title in Ultra-Clear Font */}
          <div>
            <h3 className={`text-xl sm:text-2xl font-bold font-clear-title leading-snug mb-2 ${
              isDark ? 'text-amber-300' : 'text-emerald-950'
            }`}>
              {course.title[lang] || course.title.en}
            </h3>
            
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-stone-300' : 'text-stone-600'
            }`}>
              {course.description[lang] || course.description.en}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3.5 rounded-2xl border text-xs ${
            isDark 
              ? 'bg-stone-950/70 border-stone-800' 
              : 'bg-stone-50 border-stone-200'
          }`}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className={`block text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {lang === 'ur' ? 'کورس کی مدت:' : lang === 'ar' ? 'مدة الدورة:' : 'Duration:'}
                </span>
                <strong className={isDark ? 'text-stone-200' : 'text-stone-800'}>
                  {course.duration[lang] || course.duration.en}
                </strong>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className={`block text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {lang === 'ur' ? 'استادِ محترم:' : lang === 'ar' ? 'المعلم المشرف:' : 'Instructor:'}
                </span>
                <strong className={`truncate block max-w-[130px] ${isDark ? 'text-stone-200' : 'text-stone-800'}`}>
                  {course.instructor[lang] || course.instructor.en}
                </strong>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
              <div>
                <span className={`block text-[10px] ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {lang === 'ur' ? 'ہفتہ وار کلاسز:' : lang === 'ar' ? 'الحصص الأسبوعية:' : 'Sessions:'}
                </span>
                <strong className={isDark ? 'text-stone-200' : 'text-stone-800'}>
                  {course.classesPerWeek || 3} {lang === 'ur' ? 'کلاسز فی ہفتہ' : lang === 'ar' ? 'حصص في الأسبوع' : 'classes/week'}
                </strong>
              </div>
            </div>
          </div>

          {/* Curriculum Modules & Highlights */}
          <div>
            <h4 className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${
              isDark ? 'text-amber-400' : 'text-emerald-900'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                {lang === 'ur' 
                  ? 'تفصیلی نصاب اور اہم موضوعات:' 
                  : lang === 'ar' 
                  ? 'مفردات المنهج ومحاور الدراسة:' 
                  : 'Course Modules & Curriculum Highlights:'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.features.map((feat, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm ${
                    isDark 
                      ? 'bg-stone-950/50 border-stone-800 text-stone-200' 
                      : 'bg-emerald-50/40 border-emerald-100 text-stone-800'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Academy Guarantees & Features */}
          <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
            isDark 
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' 
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-center gap-2 font-bold text-amber-500">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {lang === 'ur' 
                  ? 'کلیم آن لائن اکیڈمی کی تعلیمی خصوصیات و ضمانتیں:' 
                  : lang === 'ar' 
                  ? 'مزايا وضمانات أكاديمية كليم العالمية:' 
                  : 'Kaleem Online Academy Guarantees & Features:'}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs leading-relaxed opacity-90">
              <li>{lang === 'ur' ? 'خواتین اور بچیوں کے لیے مستند باحجاب معلمات کی زیرِ نگرانی تدریس۔' : lang === 'ar' ? 'معلمات مجازات لتعليم الأخوات والفتيات الصغيرات.' : 'Certified female instructors available for sisters.'}</li>
              <li>{lang === 'ur' ? 'انفرادی توجہ (1-on-1) - طالب علم اپنی رفتار سے سیکھتا ہے۔' : lang === 'ar' ? 'تعليم فردي مباشر (طالب واحد للمعلم) لتحقيق أعلى فائدة.' : '1-on-1 private attention at student\'s comfortable pace.'}</li>
              <li>{lang === 'ur' ? 'کورس مکمل ہونے پر باقاعدہ تصدیق شدہ سندِ فراغت و اعجاز۔' : lang === 'ar' ? 'منح شهادة وإجازة علمية معتمدة عند إتمام المقرر بنجاح.' : 'Verifiable Sanad & completion certificate issued with unique serial.'}</li>
              <li>{lang === 'ur' ? '7 روزہ فیس واپسی کی ضمانت (اگر آپ مطمئن نہ ہوں)۔' : lang === 'ar' ? 'ضمان استرجاع الرسوم خلال 7 أيام في حال عدم الرضا.' : '7-day tuition satisfaction guarantee.'}</li>
            </ul>
          </div>

          {/* Pricing Details */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'
          }`}>
            <div>
              <span className={`text-[11px] block font-semibold ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {lang === 'ur' ? 'ماہانہ تعلیمی فیس (انفرادی لائیو کلاسز):' : lang === 'ar' ? 'الرسوم الشهرية للدراسة الفردية:' : 'Monthly Tuition Fee (1-on-1):'}
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
                  isDark ? 'text-amber-400' : 'text-emerald-900'
                }`}>
                  PKR {course.feeMonthlyPKR.toLocaleString()}
                </span>
                <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {lang === 'ur' ? 'ماہانہ' : lang === 'ar' ? '/شهرياً' : '/month'}
                </span>
                <span className="text-xs text-stone-500 ml-1">
                  (~${course.feeUSD} USD)
                </span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500">
              {lang === 'ur' 
                ? 'کوئی پیشگی رجسٹریشن فیس نہیں۔ صرف ماہانہ تعلیمی فیس لاگو ہے۔' 
                : lang === 'ar' 
                ? 'لا توجد رسوم تسجيل إضافية، السداد شهري فقط.' 
                : 'No registration fees. Simple transparent monthly tuition.'}
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className={`p-4 sm:p-5 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 ${
          isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-100/80 border-stone-200'
        }`}>
          <button
            onClick={handleWhatsAppInquiry}
            className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold border flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark 
                ? 'bg-stone-800 border-stone-700 hover:bg-stone-700 text-stone-200' 
                : 'bg-white border-stone-300 hover:bg-stone-50 text-stone-800'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{lang === 'ur' ? 'واٹس ایپ پر پوچھیں' : lang === 'ar' ? 'استفسار عبر واتساب' : 'Inquire via WhatsApp'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700' 
                  : 'bg-stone-200 border-stone-300 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenEnrollment(course.title.en);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer font-clear-title"
            >
              <Video className="w-4 h-4 text-stone-950 shrink-0" />
              <span>{lang === 'ur' ? 'اس کورس میں داخلہ لیں' : lang === 'ar' ? 'التسجيل في هذه الدورة' : 'Enroll in Course'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
