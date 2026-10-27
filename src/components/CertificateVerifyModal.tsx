import React, { useState, useEffect } from 'react';
import { CertificateRecord, EnrollmentOrder, Language, SiteSettings } from '../types';
import { storage } from '../utils/storage';
import { downloadPrintableElement } from '../utils/printHelper';
import {
  X,
  Search,
  GraduationCap,
  CheckCircle2,
  Printer,
  Download,
  Clock,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface CertificateVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialQuery?: string;
  settings?: SiteSettings;
}

export const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialQuery,
  settings
}) => {
  const academySettings = settings || storage.getSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedCert, setMatchedCert] = useState<CertificateRecord | null>(null);
  const [matchedOrder, setMatchedOrder] = useState<EnrollmentOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const isRtl = lang === 'ur' || lang === 'ar';

  const performSearch = async (q: string) => {
    const raw = q.trim();
    if (!raw) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const { cert, order } = await storage.verifyCertificateAndOrder(raw);
      setMatchedCert(cert);
      setMatchedOrder(order);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialQuery && initialQuery.trim()) {
        setSearchQuery(initialQuery.trim());
        performSearch(initialQuery.trim());
      } else {
        setSearchQuery('');
        setMatchedCert(null);
        setMatchedOrder(null);
        setHasSearched(false);
        setIsSearching(false);
      }
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleQuickSample = (sampleId: string) => {
    setSearchQuery(sampleId);
    performSearch(sampleId);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-24 sm:pt-28 md:pt-32 pb-6 px-3 sm:px-5 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div
        className="relative w-full max-w-3xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8.5rem)] my-auto sm:my-0 text-stone-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Pinned Modal Header with Prominent Close Button */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-800 bg-stone-900/95 backdrop-blur flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl font-bold font-kufi text-amber-300 truncate">
                {lang === 'ur'
                  ? 'مستند تعلیمی سند و تصدیقِ اسناد پورٹل'
                  : lang === 'ar'
                  ? 'بوابة تصديق الشهادات الرسمية'
                  : 'Official Sanad & Certificate Verification'}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">
                {lang === 'ur'
                  ? 'کلیم آن لائن اکیڈمی — داخلہ نمبر یا سند نمبر سے براہِ راست تصدیق'
                  : lang === 'ar'
                  ? 'أكاديمية كليم العالمية — التحقق الفوري من الشهادات وحالة القيد'
                  : 'Kaleem Online Academy — Live Cloud Registry Authentication'}
              </p>
            </div>
          </div>

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

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Search Input Form */}
          <form onSubmit={handleFormSubmit} className="flex flex-col xs:flex-row gap-2 mb-3">
            <input
              type="text"
              required
              placeholder={
                lang === 'ur'
                  ? 'سند نمبر، داخلہ نمبر یا واٹس ایپ درج کریں (مثال: KOA-CERT-2026-8841 یا ENR-2026-1082)'
                  : lang === 'ar'
                  ? 'أدخل رقم الشهادة أو رقم القيد (مثال: KOA-CERT-2026-8841)'
                  : 'Enter Cert #, Enrollment # or Name (e.g. KOA-CERT-2026-8841, ENR-2026-1082)'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 text-xs sm:text-sm outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-950 text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 font-kufi"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>
                {lang === 'ur' ? 'تصدیق کریں' : lang === 'ar' ? 'تحقق الآن' : 'Verify Sanad'}
              </span>
            </button>
          </form>

          {/* Quick-Verify Sample IDs */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-stone-400">
            <span>{lang === 'ur' ? 'تجرباتی نمبرز:' : lang === 'ar' ? 'أرقام تجريبية:' : 'Sample Registry IDs:'}</span>
            <button
              type="button"
              onClick={() => handleQuickSample('KOA-CERT-2026-8841')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 font-mono transition-colors cursor-pointer border border-stone-700"
            >
              KOA-CERT-2026-8841
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample('ENR-2026-1082')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-emerald-300 font-mono transition-colors cursor-pointer border border-stone-700"
            >
              ENR-2026-1082
            </button>
            <button
              type="button"
              onClick={() => handleQuickSample('ORD-2026-1083')}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 font-mono transition-colors cursor-pointer border border-stone-700"
            >
              ORD-2026-1083 (Pending)
            </button>
          </div>

          {/* Initial Guidance Prompt when not searched yet */}
          {!hasSearched && !isSearching && (
            <div className="p-6 text-center bg-stone-950/70 rounded-2xl border border-stone-800 space-y-2">
              <GraduationCap className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-sm font-semibold text-stone-200">
                {lang === 'ur'
                  ? 'تصدیق کے لیے اپنا سند نمبر، داخلہ نمبر یا رجسٹرڈ نام اوپر درج کریں'
                  : lang === 'ar'
                  ? 'أدخل رقم الشهادة أو رقم القيد أو اسم الطالب للتحقق المباشر من السجل السحابي'
                  : 'Enter a Certificate Number, Enrollment ID, Verification Code, or Student Name above'}
              </p>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                {lang === 'ur'
                  ? 'کلیم آن لائن اکیڈمی کی تمام اسناد کلاؤڈ ڈیٹابیس سے منسلک اور آن لائن قابلِ تصدیق ہیں۔'
                  : lang === 'ar'
                  ? 'جميع الشهادات الصادرة عن أكاديمية كليم العالمية موثقة ومربوطة بقاعدة البيانات الرسمية.'
                  : 'All certificates issued by Kaleem Online Academy are synced live with our official registry.'}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isSearching && (
            <div className="p-8 text-center bg-stone-950/70 rounded-2xl border border-stone-800 space-y-2">
              <Loader2 className="w-7 h-7 text-amber-400 animate-spin mx-auto" />
              <p className="text-xs sm:text-sm text-stone-300 font-medium">
                {lang === 'ur'
                  ? 'سرکاری ریکارڈ اور کلاؤڈ رجسٹری میں تلاش جاری ہے...'
                  : lang === 'ar'
                  ? 'جاري البحث في السجل الأكاديمي الرسمي...'
                  : 'Checking Kaleem Online Academy official registry...'}
              </p>
            </div>
          )}

          {/* Result Area */}
          {hasSearched && !isSearching && (
            matchedCert ? (
              <div className="space-y-5">
                {/* Verification Stamp */}
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-2xl flex items-center gap-3 text-emerald-300 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="leading-snug">
                    <strong className="block text-emerald-200">
                      {lang === 'ur'
                        ? 'مستند و باضابطہ سندِ فراغت تصدیق شدہ!'
                        : lang === 'ar'
                        ? 'سند رسمي معتمد وموثق في السجل العام!'
                        : 'Authentic & Verified Certificate Found in Official Registry!'}
                    </strong>
                    <span className="text-[11px] sm:text-xs text-emerald-400/90">
                      {lang === 'ur'
                        ? 'یہ سند کلیم آن لائن اکیڈمی کے سرکاری ریکارڈ اور مفتی دانش کلیم صاحب کی مہر سے جاری شدہ ہے۔'
                        : lang === 'ar'
                        ? 'هذه الشهادة صادرة ومختومة من أكاديمية كليم العالمية بتوقيع المفتي دانش كليم.'
                        : 'Issued and signed by Mufti Danish Kaleem under Kaleem Online Academy official records.'}
                    </span>
                  </div>
                </div>

                {/* Printable Certificate Template with Gold Ornamental Border */}
                <div
                  id="printable-certificate"
                  className="relative bg-gradient-to-b from-amber-50 via-amber-100/95 to-amber-50 text-stone-900 rounded-2xl sm:rounded-3xl p-5 sm:p-10 border-4 sm:border-8 border-amber-600/70 shadow-2xl text-center font-serif overflow-hidden select-text"
                >
                  {/* Islamic Corner Rosettes */}
                  <div className="absolute top-2 left-2 text-amber-700/60 text-lg sm:text-2xl font-serif">❖</div>
                  <div className="absolute top-2 right-2 text-amber-700/60 text-lg sm:text-2xl font-serif">❖</div>
                  <div className="absolute bottom-2 left-2 text-amber-700/60 text-lg sm:text-2xl font-serif">❖</div>
                  <div className="absolute bottom-2 right-2 text-amber-700/60 text-lg sm:text-2xl font-serif">❖</div>

                  {/* Bismillah Header */}
                  <p className="font-amiri text-2xl sm:text-3xl text-emerald-950 font-bold mb-2 tracking-wide" dir="rtl">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>

                  <h4 className="text-base sm:text-2xl font-bold font-serif text-emerald-900 uppercase tracking-widest">
                    {academySettings.siteTitle.en || 'Kaleem Online Academy'}
                  </h4>
                  <p className="font-amiri text-sm sm:text-base text-amber-900 font-bold mb-1">
                    {academySettings.siteTitle.ur || 'کلیم آن لائن اکیڈمی'} — سندِ فراغت و اہلیت
                  </p>
                  <p className="text-[10px] sm:text-xs text-stone-600 tracking-wider uppercase mb-4 sm:mb-6">
                    Certificate of Course Completion & Scholarly Competence
                  </p>

                  <p className="text-xs text-stone-600 italic">
                    This is to officially certify that
                  </p>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-stone-900 my-2 font-kufi border-b-2 border-amber-600/40 inline-block px-4 sm:px-8 pb-1">
                    {matchedCert.studentName}
                  </h3>
                  {matchedCert.fatherName && (
                    <p className="text-xs text-stone-600 mt-1">
                      Son / Daughter of <strong>{matchedCert.fatherName}</strong>
                    </p>
                  )}

                  <p className="text-xs text-stone-700 mt-3 sm:mt-4 max-w-lg mx-auto leading-relaxed">
                    has successfully completed all lectures, vocal recitations, and formal assessments in:
                  </p>
                  <h4 className="text-sm sm:text-xl font-bold text-emerald-900 my-2 font-kufi">
                    "{matchedCert.courseName}"
                  </h4>

                  <div className="inline-block px-3 sm:px-4 py-1 rounded-lg bg-amber-500/20 text-amber-900 border border-amber-600/40 text-xs font-bold my-2">
                    Grade / Evaluation: {matchedCert.grade}
                  </div>

                  {/* Footer Details: Enrollment No, Date, Seal & Signature */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 border-t border-amber-700/30 text-xs text-stone-700 items-end">
                    {/* Left: Cert ID & Enrollment */}
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] text-stone-500">Certificate ID:</p>
                      <strong className="font-mono text-xs tabular-nums">{matchedCert.certNumber}</strong>
                      {matchedCert.enrollmentNo && (
                        <p className="font-mono text-[10px] text-amber-900 font-bold mt-0.5 tabular-nums">
                          Enrollment: {matchedCert.enrollmentNo}
                        </p>
                      )}
                      <p className="text-[10px] text-stone-500 mt-0.5">Date: {matchedCert.issueDate}</p>
                    </div>

                    {/* Middle: Official Embossed Stamp */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-700/60 bg-amber-100 flex flex-col items-center justify-center p-1 shadow-inner text-center">
                        <span className="font-amiri text-[10px] sm:text-xs font-bold text-emerald-950 leading-tight">کلیم اکیڈمی</span>
                        <span className="text-[8px] font-bold text-amber-800 tracking-tighter uppercase">OFFICIAL SEAL</span>
                        <span className="text-[7px] text-stone-500 font-mono">VERIFIED</span>
                      </div>
                    </div>

                    {/* Right: Signature */}
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] text-stone-500">Director of Academic Affairs:</p>
                      <strong className="text-emerald-950 font-amiri text-base block">{matchedCert.issuedBy}</strong>
                      <span className="text-[10px] text-amber-800 font-bold italic">Official Seal & Signature</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-stone-400">
                    Verification Code: <code className="text-amber-400 font-mono font-bold">{matchedCert.verificationCode}</code>
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        downloadPrintableElement(
                          'printable-certificate',
                          `${matchedCert.certNumber}.html`,
                          `${matchedCert.studentName} — Official Sanad`
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {lang === 'ur' ? 'ڈاؤنلوڈ (.html)' : lang === 'ar' ? 'تحميل الشهادة' : 'Download (.html)'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors font-kufi"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{lang === 'ur' ? 'سند پرنٹ کریں' : lang === 'ar' ? 'طباعة الشهادة' : 'Print Certificate'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : matchedOrder ? (
              /* Order Found but Pending or Declined — Show accurate Admission Status Card instead of "Not found" */
              <div className="p-5 sm:p-6 bg-stone-950/90 rounded-2xl border border-amber-500/40 space-y-4">
                <div className="flex items-start gap-3">
                  {matchedOrder.paymentStatus === 'Declined' ? (
                    <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-amber-300">
                      {matchedOrder.paymentStatus === 'Declined'
                        ? lang === 'ur'
                          ? 'درخواست مسترد / غیر فعال ہے — سند جاری نہیں ہوئی'
                          : lang === 'ar'
                          ? 'الطلب غير مفعل حالياً — لم تصدر شهادة بعد'
                          : 'Admission Declined / On Hold — Certificate Not Issued'
                        : lang === 'ur'
                        ? 'داخلہ زیرِ تصدیق ہے — سند منظوری کے بعد جاری ہوگی'
                        : lang === 'ar'
                        ? 'القيد قيد المراجعة — تصدر الشهادة بعد الاعتماد وإتمام المقرر'
                        : 'Admission Record Found (Pending Verification)'}
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {matchedOrder.paymentStatus === 'Declined'
                        ? lang === 'ur'
                          ? 'اس داخلہ نمبر کے لیے فیس یا کوائف کی تصدیق مکمل نہیں ہو سکی۔ براہِ کرم اکیڈمی رجسٹرار سے واٹس ایپ پر رابطہ فرمائیں۔'
                          : 'Payment or enrollment details could not be verified. Please contact the Kaleem Online Academy registrar via WhatsApp.'
                        : lang === 'ur'
                        ? 'آپ کا داخلہ ریکارڈ موجود ہے مگر ابھی فیس کی تصدیق یا کورس کی تکمیل باقی ہے۔ ایڈمن کی منظوری کے فوراً بعد آپ کی سند یہاں دستیاب ہو جائے گی۔'
                        : 'Your enrollment record exists in Kaleem Online Academy, and is currently awaiting payment/coursework verification. Once approved by the Registrar, your official Sanad will appear here automatically.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[11px]">Enrollment / Order ID</span>
                    <strong className="font-mono text-amber-300 tabular-nums">{matchedOrder.id}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[11px]">Student Name</span>
                    <strong className="text-stone-100">{matchedOrder.studentName}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                    <span className="text-stone-400 block text-[11px]">Current Status</span>
                    <strong className={matchedOrder.paymentStatus === 'Declined' ? 'text-rose-400' : 'text-amber-400'}>
                      {matchedOrder.paymentStatus}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2">
                <p className="text-rose-400 font-semibold text-sm">
                  {lang === 'ur'
                    ? `داخلہ / سند نمبر "${searchQuery}" کے تحت کوئی ریکارڈ دستیاب نہیں ہوا۔`
                    : lang === 'ar'
                    ? `لم يتم العثور على شهادة أو قيد بالرقم "${searchQuery}"`
                    : `No certificate or enrollment found matching "${searchQuery}"`}
                </p>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  {lang === 'ur'
                    ? 'برائے مہربانی سند نمبر (مثلاً KOA-CERT-2026-8841) یا داخلہ نمبر چیک کریں یا رجسٹرار سے رابطہ فرمائیں۔'
                    : 'Please double-check your Certificate ID (e.g. KOA-CERT-2026-8841) or Enrollment ID, or contact the Kaleem Online Academy registrar.'}
                </p>
              </div>
            )
          )}
        </div>

        {/* Modal Footer with Dismiss */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-stone-800 bg-stone-950/80 flex justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer border border-stone-700 transition-colors"
          >
            {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
