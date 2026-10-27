import React, { useState } from 'react';
import { Language, EnrollmentOrder, CertificateRecord, ThemeMode, SiteSettings } from '../types';
import { storage } from '../utils/storage';
import { downloadPrintableElement, openExternalSafe } from '../utils/printHelper';
import { 
  Search, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Download,
  Award, 
  MessageCircle, 
  Loader2
} from 'lucide-react';

interface StudentPortalSectionProps {
  lang: Language;
  theme?: ThemeMode;
  settings: SiteSettings;
  onOpenSanadModal?: (enrollmentOrCertNo?: string) => void;
  onOpenEnrollment?: () => void;
}

export const StudentPortalSection: React.FC<StudentPortalSectionProps> = ({
  lang,
  theme = 'light',
  settings,
  onOpenSanadModal,
  onOpenEnrollment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<EnrollmentOrder | null>(null);
  const [matchedCert, setMatchedCert] = useState<CertificateRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const isDark = theme === 'dark';
  const isRtl = lang === 'ur' || lang === 'ar';

  const handleSearch = async (queryOverride?: string) => {
    const raw = (queryOverride !== undefined ? queryOverride : searchQuery).trim();
    if (!raw) return;

    if (queryOverride !== undefined) {
      setSearchQuery(queryOverride);
    }
    setHasSearched(true);
    setIsSearching(true);

    try {
      const { cert, order } = await storage.verifyCertificateAndOrder(raw);
      setMatchedOrder(order);
      setMatchedCert(cert);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const handleDownloadSlip = () => {
    const idLabel = matchedOrder?.id || matchedCert?.certNumber || 'student-slip';
    const nameLabel = matchedOrder?.studentName || matchedCert?.studentName || 'Student';
    downloadPrintableElement('printable-student-slip', `${idLabel}.html`, `${nameLabel} — Kaleem Online Academy Slip`);
  };

  const handleWhatsAppInquiry = (orderId?: string) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = lang === 'ur'
      ? `السلام علیکم مفتی صاحب! میں کلیم آن لائن اکیڈمی میں اپنے داخلہ نمبر (${orderId || searchQuery}) کے متعلق معلومات اور کلاس کا لنک حاصل کرنا چاہتا ہوں۔`
      : lang === 'ar'
      ? `السلام عليكم يا فضيلة المفتي، أستفسر عن حالة التسجيل ورقم القيد في أكاديمية كليم العالمية: (${orderId || searchQuery}).`
      : `Assalamu Alaikum Mufti Danish, I am inquiring about my Kaleem Online Academy enrollment status for ID: (${orderId || searchQuery}).`;
    openExternalSafe(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`);
  };

  return (
    <section 
      id="student-portal" 
      className={`py-10 sm:py-20 border-b transition-colors relative overflow-hidden w-full ${
        isDark 
          ? 'bg-stone-900/90 text-stone-100 border-stone-800' 
          : 'bg-stone-50 text-stone-900 border-amber-200/60'
      }`}
    >
      {/* Background Islamic ambient glow */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 w-full overflow-hidden">
        
        {/* Section Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-12">
          
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 mb-2.5 sm:mb-3 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span>
              {lang === 'ur' ? 'طلبہ پورٹل و تصدیقِ داخلہ' : lang === 'ar' ? 'بوابة الطلاب والاستعلام عن القيد' : 'Student Admission & Sanad Portal'}
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold font-clear-title tracking-tight mb-2 sm:mb-3 leading-snug">
            <span className="text-emerald-750 dark:text-amber-300">
              {lang === 'ur' 
                ? 'اپنے داخلہ نمبر سے اسٹیٹس و سند معلوم کریں' 
                : lang === 'ar' 
                ? 'استعلم عن حالة التسجيل واستلم شهادتك برقم القيد' 
                : 'Search Enrollment Status & Receive Your Official Sanad'}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-medium leading-relaxed px-1">
            {lang === 'ur'
              ? 'اپنا داخلہ / رول نمبر درج کر کے اپنے کورس کا اسٹیٹس، فیس کی تصدیق، کلاس ٹائمنگ اور جاری شدہ مستند سندِ فراغت فوری حاصل کریں۔'
              : lang === 'ar'
              ? 'أدخل رقم القيد أو رقم الواتساب لمعرفة حالة القبول، مواعيد الدروس المباشرة، وتحميل الشهادة المعتمدة فوراً.'
              : 'Enter your Enrollment ID or registered WhatsApp to check admission verification, class schedule, and download your authentic Sanad.'}
          </p>

        </div>

        {/* Search Bar Card - 100% Mobile Fluid Fit */}
        <div className={`p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-xl transition-all mb-6 sm:mb-8 w-full overflow-hidden ${
          isDark 
            ? 'bg-stone-950 border-amber-500/30 shadow-stone-950/80' 
            : 'bg-white border-amber-300 shadow-amber-900/5'
        }`}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
            className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full"
          >
            <div className="relative flex-1 w-full min-w-0">
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'ur' 
                    ? 'داخلہ نمبر یا واٹس ایپ (مثال: ENR-2026-1082)' 
                    : lang === 'ar' 
                    ? 'أدخل رقم القيد أو الواتساب (مثال: ENR-2026-1082)' 
                    : 'Enter Enrollment No or WhatsApp (e.g. ENR-2026-1082)'
                }
                className={`w-full px-3.5 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm outline-none border transition-all ${
                  isRtl ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3 text-left'
                } ${
                  isDark 
                    ? 'bg-stone-900 border-stone-700 text-stone-100 focus:border-amber-400' 
                    : 'bg-stone-50 border-stone-300 text-stone-900 focus:border-emerald-600'
                }`}
              />
              <Search className={`w-4 h-4 sm:w-5 sm:h-5 text-amber-500 absolute top-3.5 sm:top-4 ${
                isRtl ? 'right-3.5' : 'left-3.5'
              }`} />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full sm:w-auto px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold font-clear-title text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 disabled:opacity-60 text-stone-950 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isSearching ? <Loader2 className="w-4 h-4 text-stone-950 animate-spin" /> : <Search className="w-4 h-4 text-stone-950" />}
              <span>{lang === 'ur' ? 'اسٹیٹس تلاش کریں' : lang === 'ar' ? 'بحث عن القيد' : 'Search Status'}</span>
            </button>
          </form>

          {/* Quick Demo Test Chips - Mobile Wrap Cleanly */}
          <div className="mt-3.5 pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
            <span className="text-stone-500 dark:text-stone-400 font-semibold shrink-0">
              {lang === 'ur' ? 'تجرباتی داخلہ و سند نمبرز:' : lang === 'ar' ? 'أرقام قيد وشهادات تجريبية:' : 'Try Sample IDs:'}
            </span>
            <button
              type="button"
              onClick={() => handleQuickSearch('KOA-CERT-2026-8841')}
              className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800 font-mono text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer"
            >
              KOA-CERT-2026-8841
            </button>
            <button
              type="button"
              onClick={() => handleQuickSearch('ENR-2026-1082')}
              className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800 font-mono text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer"
            >
              ENR-2026-1082
            </button>
            <button
              type="button"
              onClick={() => handleQuickSearch('ORD-2026-1083')}
              className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300 dark:border dark:border-stone-700 font-mono text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer"
            >
              ORD-2026-1083 (Pending)
            </button>
            <button
              type="button"
              onClick={() => handleQuickSearch('ENR-2026-1084')}
              className="px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 dark:border dark:border-blue-800 font-mono text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer"
            >
              ENR-2026-1084 (UK)
            </button>
          </div>
        </div>

        {/* Search Results Display - Mobile Fluid Architecture */}
        {hasSearched && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-2 w-full">
            
            {matchedOrder || matchedCert ? (
              <div
                id="printable-student-slip"
                className={`rounded-2xl sm:rounded-3xl border-2 p-3.5 sm:p-7 shadow-2xl relative w-full overflow-hidden ${
                isDark 
                  ? 'bg-stone-950 border-amber-500/40' 
                  : 'bg-white border-amber-300'
              }`}>
                
                {/* Header Status Bar - Stacks naturally on small screens */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-stone-200 dark:border-stone-800 w-full">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-900 text-amber-300 border border-amber-400 flex items-center justify-center font-amiri text-xl sm:text-2xl font-bold shadow-inner shrink-0">
                      ك
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-amber-500 font-bold block truncate tabular-nums">
                        {matchedCert ? 'Sanad & Enrollment' : 'Enrollment'} &bull; {matchedOrder?.id || matchedCert?.enrollmentNo || matchedCert?.certNumber}
                      </span>
                      <h3 className="text-base sm:text-2xl font-extrabold font-clear-title text-stone-900 dark:text-stone-100 truncate">
                        {matchedOrder?.studentName || matchedCert?.studentName}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="self-start sm:self-auto shrink-0">
                    {matchedOrder?.paymentStatus === 'Approved' || matchedCert ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-500 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>
                          {lang === 'ur' ? 'داخلہ معتمد و منظور شدہ' : lang === 'ar' ? 'القيد معتمد ومؤكد رسمياً' : 'Admission Confirmed'}
                        </span>
                      </span>
                    ) : matchedOrder?.paymentStatus === 'Declined' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-500 shadow-sm">
                        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>
                          {lang === 'ur' ? 'غیر فعال / رجسٹرار سے رابطہ کریں' : lang === 'ar' ? 'غير مفعل — راجع الإدارة' : 'Declined / Contact Registrar'}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-500 shadow-sm">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>
                          {lang === 'ur' ? 'زیرِ غور — فیس کی تصدیق جاری' : lang === 'ar' ? 'قيد المراجعة والتحقق' : 'Under Review'}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid - Full Mobile Responsive with Clean Line Wrapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 py-4 sm:py-5 text-xs sm:text-sm w-full">
                  
                  {/* Left Column Rows */}
                  <div className="space-y-2 sm:space-y-2.5 w-full">
                    
                    {/* Student Name */}
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 gap-1 sm:gap-2">
                      <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs shrink-0">
                        {lang === 'ur' ? 'طالب علم کا نام:' : lang === 'ar' ? 'اسم الطالب:' : 'Student Name:'}
                      </span>
                      <strong className="text-stone-900 dark:text-stone-100 font-bold break-words text-left xs:text-right max-w-full">
                        {matchedOrder?.studentName || matchedCert?.studentName}
                      </strong>
                    </div>

                    {/* Father's Name */}
                    {(matchedOrder?.fatherName || matchedCert?.fatherName) && (
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 gap-1 sm:gap-2">
                        <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs shrink-0">
                          {lang === 'ur' ? 'والد کا نام:' : lang === 'ar' ? 'اسم الوالد:' : "Father's Name:"}
                        </span>
                        <strong className="text-stone-900 dark:text-stone-100 font-bold break-words text-left xs:text-right max-w-full">
                          {matchedOrder?.fatherName || matchedCert?.fatherName}
                        </strong>
                      </div>
                    )}

                    {/* Enrolled Course */}
                    <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 gap-1 sm:gap-2">
                      <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs shrink-0">
                        {lang === 'ur' ? 'منتخب کورس:' : lang === 'ar' ? 'الدورة / المادة المسجلة:' : 'Enrolled Course:'}
                      </span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold text-left xs:text-right break-words max-w-full">
                        {matchedOrder?.courseOrItemTitle || matchedCert?.courseName}
                      </strong>
                    </div>

                    {/* Country & City */}
                    {matchedOrder?.countryCity && (
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 gap-1 sm:gap-2">
                        <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs shrink-0">
                          {lang === 'ur' ? 'شہر و ملک:' : lang === 'ar' ? 'المدينة والدولة:' : 'City & Country:'}
                        </span>
                        <strong className="text-stone-900 dark:text-stone-100 font-bold break-words text-left xs:text-right max-w-full">
                          {matchedOrder.countryCity}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* Right Column Rows */}
                  <div className="space-y-2 sm:space-y-2.5 w-full">
                    
                    {/* Class Schedule */}
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 gap-1 sm:gap-2">
                      <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs shrink-0">
                        {lang === 'ur' ? 'کلاس ٹائمنگ:' : lang === 'ar' ? 'أوقات المحاضرات:' : 'Class Schedule:'}
                      </span>
                      <strong className="text-stone-900 dark:text-stone-100 font-bold capitalize break-words text-left xs:text-right max-w-full">
                        {matchedOrder?.preferredTime || 'Evening (مغرب / عشاء)'} {matchedOrder?.classFrequency ? `• ${matchedOrder.classFrequency}` : ''}
                      </strong>
                    </div>

                    {/* Assigned Mentor */}
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 gap-1 sm:gap-2">
                      <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs shrink-0">
                        {lang === 'ur' ? 'استاد محترم:' : lang === 'ar' ? 'المشرف والأستاذ:' : 'Assigned Mentor:'}
                      </span>
                      <strong className="text-amber-600 dark:text-amber-400 font-bold break-words text-left xs:text-right max-w-full">
                        {settings.founderName[lang] || settings.founderName.en}
                      </strong>
                    </div>

                    {/* Tuition & Payment */}
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 gap-1 sm:gap-2">
                      <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs shrink-0">
                        {lang === 'ur' ? 'فیس ادائیگی:' : lang === 'ar' ? 'المبلغ وطريقة السداد:' : 'Tuition & Payment:'}
                      </span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-mono font-bold break-words text-left xs:text-right max-w-full">
                        {matchedOrder ? `PKR ${matchedOrder.totalAmountPKR.toLocaleString()} (${matchedOrder.paymentMethod})` : 'Verified & Cleared'}
                      </strong>
                    </div>

                    {/* Transaction ID */}
                    {matchedOrder?.transactionId && (
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 gap-1 sm:gap-2">
                        <span className="text-stone-500 dark:text-stone-400 text-[11px] sm:text-xs shrink-0">
                          {lang === 'ur' ? 'ٹرانزیکشن ID:' : lang === 'ar' ? 'رمز المعاملة:' : 'Transaction ID:'}
                        </span>
                        <code className="text-stone-700 dark:text-stone-300 font-mono font-bold text-[11px] sm:text-xs break-all text-left xs:text-right max-w-full">
                          {matchedOrder.transactionId}
                        </code>
                      </div>
                    )}
                  </div>

                </div>

                {/* Important Status Guidance Box */}
                <div className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border mb-4 sm:mb-6 text-xs leading-relaxed ${
                  matchedOrder?.paymentStatus === 'Approved' || matchedCert
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-950 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800'
                }`}>
                  {matchedOrder?.paymentStatus === 'Approved' || matchedCert ? (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">
                          {lang === 'ur' 
                            ? 'مبارک ہو! آپ کا داخلہ بحمد اللہ باضابطہ طور پر منظور ہو چکا ہے۔' 
                            : lang === 'ar' 
                            ? 'تهانينا! تم اعتماد قيدك رسمياً وتأكيد مقعدك في الدورة.' 
                            : 'Congratulations! Your admission is officially approved.'}
                        </strong>
                        <span className="opacity-90">
                          {lang === 'ur'
                            ? 'آپ کو کلاس زوم/گوگل میٹ لنک بذریعہ واٹس ایپ موصول ہو گا۔ آپ اپنی مستند سندِ فراغت نیچے دیے گئے بٹن پر کلک کر کے فوری حاصل کر سکتے ہیں۔'
                            : lang === 'ar'
                            ? 'ستصلك روابط الدروس عبر الواتساب. يمكنك الآن استلام وتحميل شهادتك الرسمية فوراً عبر الزر أدناه.'
                            : 'You will receive classroom links on WhatsApp. You can also view and print your official certificate directly below.'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">
                          {lang === 'ur' 
                            ? 'آپ کی درخواست موصول ہے، فیس و رسید کی توثیق جاری ہے۔' 
                            : lang === 'ar' 
                            ? 'طلبك قيد المعالجة والتحقق من إشعار السداد.' 
                            : 'Application received, transaction verification in progress.'}
                        </strong>
                        <span className="opacity-90">
                          {lang === 'ur'
                            ? 'اگر آپ نے ابھی تک فیس رسید واٹس ایپ نہیں کی تو برائے مہربانی رسید کا سکرین شاٹ بھیجیں تاکہ داخلہ فورا منظور کیا جا سکے۔'
                            : lang === 'ar'
                            ? 'يرجى إرسال صورة إيصال السداد عبر الواتساب لتسريع تفعيل حسابك.'
                            : 'Please ensure payment screenshot is shared with the registrar on WhatsApp for instant confirmation.'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons - 100% Mobile Stacking & Touch Target */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-2 w-full">
                  
                  {/* Left Actions: Sanad & Print Slip */}
                  <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
                    
                    {/* RECEIVE SANAD / CERTIFICATE BUTTON */}
                    {(matchedOrder?.paymentStatus === 'Approved' || matchedCert) && (
                      <button
                        onClick={() => {
                          if (onOpenSanadModal) {
                            onOpenSanadModal(matchedOrder?.id || matchedCert?.enrollmentNo || matchedCert?.certNumber);
                          }
                        }}
                        className="w-full xs:w-auto px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-stone-950 font-bold font-clear-title text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer transition-all"
                      >
                        <Award className="w-4 h-4 text-stone-950 shrink-0" />
                        <span>
                          {lang === 'ur' ? 'سندِ فراغت وصول کریں (Sanad)' : lang === 'ar' ? 'استلام الشهادة الرسمية' : 'Receive Official Sanad'}
                        </span>
                      </button>
                    )}

                    {/* Print Admission Card */}
                    <button
                      onClick={handlePrintSlip}
                      className="w-full xs:w-auto px-3.5 sm:px-4 py-3 rounded-xl sm:rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{lang === 'ur' ? 'داخلہ رسید پرنٹ کریں' : lang === 'ar' ? 'طباعة بطاقة القبول' : 'Print Slip'}</span>
                    </button>

                    {/* Download HTML Slip */}
                    <button
                      type="button"
                      onClick={handleDownloadSlip}
                      className="w-full xs:w-auto px-3.5 sm:px-4 py-3 rounded-xl sm:rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-stone-300 dark:border-stone-700 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{lang === 'ur' ? 'ڈاؤنلوڈ (.html)' : lang === 'ar' ? 'تحميل البطاقة' : 'Download (.html)'}</span>
                    </button>
                  </div>

                  {/* Right Action: WhatsApp Registrar Support */}
                  <button
                    onClick={() => handleWhatsAppInquiry(matchedOrder?.id || matchedCert?.enrollmentNo)}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl sm:rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>{lang === 'ur' ? 'رجسٹرار واٹس ایپ رابطہ' : lang === 'ar' ? 'تواصل مع شؤون الطلاب' : 'Registrar WhatsApp'}</span>
                  </button>

                </div>

              </div>
            ) : (
              <div className={`p-6 sm:p-12 text-center rounded-2xl sm:rounded-3xl border-2 space-y-3 sm:space-y-4 w-full overflow-hidden ${
                isDark ? 'bg-stone-950 border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center text-xl sm:text-2xl">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                
                <div>
                  <h3 className="text-base sm:text-xl font-bold font-kufi text-stone-900 dark:text-stone-100 break-words">
                    {lang === 'ur' 
                      ? `داخلہ نمبر "${searchQuery}" کا کوئی ریکارڈ نہیں ملا` 
                      : lang === 'ar' 
                      ? `لم يتم العثور على سجل بالرقم "${searchQuery}"` 
                      : `No record found for ID "${searchQuery}"`}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto mt-1 leading-relaxed">
                    {lang === 'ur'
                      ? 'برائے مہربانی اپنے داخلہ نمبر کی درستگی چیک کریں۔ اگر آپ نے نیا داخلہ لینا ہے تو نیچے بٹن پر کلک کریں۔'
                      : lang === 'ar'
                      ? 'يرجى التأكد من صحة رقم القيد المدخل أو التواصل مع إدارة الأكاديمية.'
                      : 'Please verify the enrollment ID or phone number. If you have not enrolled yet, apply online now.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                  {onOpenEnrollment && (
                    <button
                      onClick={onOpenEnrollment}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm shadow cursor-pointer font-kufi"
                    >
                      {lang === 'ur' ? 'آن لائن داخلہ فارم پر کریں' : lang === 'ar' ? 'تقديم طلب التحاق جديد' : 'Apply for Online Admission'}
                    </button>
                  )}
                  <button
                    onClick={() => handleWhatsAppInquiry(searchQuery)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 text-xs sm:text-sm cursor-pointer"
                  >
                    {lang === 'ur' ? 'واٹس ایپ پر رابطہ کریں' : lang === 'ar' ? 'الاستفسار عبر واتساب' : 'Inquire on WhatsApp'}
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
