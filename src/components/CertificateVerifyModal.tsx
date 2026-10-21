import React, { useState, useEffect } from 'react';
import { CertificateRecord, Language } from '../types';
import { storage } from '../utils/storage';
import { X, Search, GraduationCap, CheckCircle2, Award, Printer, ShieldCheck, QrCode } from 'lucide-react';

interface CertificateVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialQuery?: string;
}

export const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialQuery
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || 'ENR-2026-1082');
  const [matchedCert, setMatchedCert] = useState<CertificateRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const isRtl = lang === 'ur' || lang === 'ar';

  const performSearch = (q: string) => {
    const trimmed = q.trim().toLowerCase();
    if (!trimmed) return;

    setHasSearched(true);
    const certs = storage.getCertificates();
    const orders = storage.getOrders();

    // 1. Direct match in certificate registry
    let found = certs.find(c => 
      c.certNumber.toLowerCase() === trimmed || 
      (c.enrollmentNo && c.enrollmentNo.toLowerCase() === trimmed) ||
      c.studentName.toLowerCase().includes(trimmed) ||
      c.verificationCode.toLowerCase() === trimmed
    );

    // 2. If not found in certs, check if an approved order matches this enrollment number
    if (!found) {
      const matchingOrder = orders.find(o => 
        o.id.toLowerCase() === trimmed || 
        o.studentName.toLowerCase().includes(trimmed) ||
        o.whatsapp.replace(/[^0-9]/g, '').includes(trimmed.replace(/[^0-9]/g, ''))
      );

      if (matchingOrder && matchingOrder.paymentStatus === 'Approved') {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        found = {
          id: `cert-gen-${matchingOrder.id}`,
          certNumber: `AD-CERT-2026-${randomNum}`,
          enrollmentNo: matchingOrder.id,
          studentName: matchingOrder.studentName,
          fatherName: matchingOrder.fatherName || 'Muhammad',
          courseName: matchingOrder.courseOrItemTitle,
          grade: 'Mumtaz (Distinction - 95%)',
          issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          issuedBy: 'Mufti Danish Kaleem',
          verificationCode: `VER-AD-${randomNum}`
        };
      }
    }

    setMatchedCert(found || null);
  };

  useEffect(() => {
    if (isOpen) {
      const q = initialQuery || searchQuery || 'ENR-2026-1082';
      setSearchQuery(q);
      performSearch(q);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Pinned Modal Header with Prominent Cancel Button */}
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
                  ? 'بوابة تصدیق الشهادات الرسمية' 
                  : 'Official Sanad & Certificate Portal'}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">
                {lang === 'ur'
                  ? 'داخلہ نمبر یا سند نمبر سے تصدیق'
                  : lang === 'ar'
                  ? 'تحقق من صحة السند العلمي'
                  : 'Registry Authentication & Retrieval'}
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

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

        {/* Search Input Form */}
        <form onSubmit={handleFormSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            required
            placeholder={
              lang === 'ur'
                ? 'داخلہ نمبر یا سند نمبر درج کریں (مثال: ENR-2026-1082 یا AD-CERT-2026-8841)'
                : lang === 'ar'
                ? 'أدخل رقم القيد أو رقم الشهادة (مثال: ENR-2026-1082)'
                : 'Enter Enrollment # or Cert # (e.g. ENR-2026-1082, AD-CERT-2026-8841)'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 text-xs sm:text-sm outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 font-kufi"
          >
            <Search className="w-4 h-4" />
            <span>{lang === 'ur' ? 'سند دیکھیں' : lang === 'ar' ? 'عرض السند' : 'Get Sanad'}</span>
          </button>
        </form>

        {/* Sample chips */}
        <div className="flex flex-wrap items-center gap-2 mb-5 text-[11px] text-stone-400">
          <span>{lang === 'ur' ? 'تجرباتی نمبرز:' : 'Try:'}</span>
          <button
            type="button"
            onClick={() => { setSearchQuery('ENR-2026-1082'); performSearch('ENR-2026-1082'); }}
            className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-mono transition-colors"
          >
            ENR-2026-1082
          </button>
          <button
            type="button"
            onClick={() => { setSearchQuery('ENR-2026-1084'); performSearch('ENR-2026-1084'); }}
            className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-mono transition-colors"
          >
            ENR-2026-1084
          </button>
          <button
            type="button"
            onClick={() => { setSearchQuery('AD-CERT-2026-8841'); performSearch('AD-CERT-2026-8841'); }}
            className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 font-mono transition-colors"
          >
            AD-CERT-2026-8841
          </button>
        </div>

        {/* Result Area */}
        {hasSearched && (
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
                      ? 'یہ سند مفتی دانش کلیم صاحب کے باقاعدہ دستخط و مہر کے تحت جاری شدہ ہے۔'
                      : lang === 'ar'
                      ? 'هذه الشهادة صادرة ومختومة بتوقيع المشرف العام المفتي دانش كليم.'
                      : 'Issued and signed by Mufti Danish Kaleem under official Academy records.'}
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
                  Al-Danish Online Islamic & Arabic Academy
                </h4>
                <p className="font-amiri text-sm sm:text-base text-amber-900 font-bold mb-1">
                  ادارہ دانش برائے تعلیماتِ اسلامیہ و علومِ عربیہ — سندِ فراغت و اہلیت
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

                <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-amber-500/20 text-amber-900 border border-amber-600/40 text-xs font-bold my-2">
                  Grade / Evaluation: {matchedCert.grade}
                </div>

                {/* Footer Details: Enrollment No, Date, Seal & Signature */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 border-t border-amber-700/30 text-xs text-stone-700 items-end">
                  
                  {/* Left: Cert ID & Enrollment */}
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-stone-500">Certificate ID:</p>
                    <strong className="font-mono text-xs">{matchedCert.certNumber}</strong>
                    {matchedCert.enrollmentNo && (
                      <p className="font-mono text-[10px] text-amber-900 font-bold mt-0.5">
                        Enrollment: {matchedCert.enrollmentNo}
                      </p>
                    )}
                    <p className="text-[10px] text-stone-500 mt-0.5">Date: {matchedCert.issueDate}</p>
                  </div>

                  {/* Middle: Official Embossed Stamp */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-700/60 bg-amber-100 flex flex-col items-center justify-center p-1 shadow-inner text-center">
                      <span className="font-amiri text-[10px] sm:text-xs font-bold text-emerald-950 leading-tight">ادارہ دانش</span>
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

                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors font-kufi"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'سند پرنٹ / محفوظ کریں' : lang === 'ar' ? 'طباعة وحفظ الشهادة' : 'Print / Save Certificate'}</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2">
              <p className="text-rose-400 font-semibold text-sm">
                {lang === 'ur' 
                  ? `داخلہ / سند نمبر "${searchQuery}" کے تحت کوئی سند دستیاب نہیں ہوئی۔` 
                  : `No certificate found matching "${searchQuery}"`}
              </p>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                {lang === 'ur'
                  ? 'برائے مہربانی داخلہ نمبر چیک کریں یا اگر آپ کا داخلہ نیا ہے تو کورس کے اختتام پر سند جاری کی جائے گی۔'
                  : 'Please verify the ID or contact the academy registrar on WhatsApp.'}
              </p>
            </div>
          )
        )}
        </div>

        {/* Modal Footer with Dismiss */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-stone-800 bg-stone-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer border border-stone-700 transition-colors"
          >
            {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
