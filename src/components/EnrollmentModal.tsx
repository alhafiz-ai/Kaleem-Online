import React, { useState } from 'react';
import { Language, Course, EnrollmentOrder, SiteSettings } from '../types';
import { UI_TEXT } from '../utils/translations';
import { storage } from '../utils/storage';
import { downloadPrintableElement } from '../utils/printHelper';
import { 
  X, 
  CheckCircle, 
  Send, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  ShieldCheck, 
  Download, 
  Share2,
  Sparkles,
  Printer,
  Award
} from 'lucide-react';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourseTitle?: string;
  courses: Course[];
  settings: SiteSettings;
  lang: Language;
}

export const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  selectedCourseTitle,
  courses,
  settings,
  lang
}) => {
  const [studentName, setStudentName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [countryCity, setCountryCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [preferredCourse, setPreferredCourse] = useState(
    selectedCourseTitle || (courses[0] ? courses[0].title.en : 'Tajweed & Tarteel ul-Quran')
  );
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'evening'>('evening');
  const [classFrequency, setClassFrequency] = useState('3 days / week (Mon, Wed, Fri)');
  const [knowledgeLevel, setKnowledgeLevel] = useState('Beginner');
  const [paymentMethod, setPaymentMethod] = useState<'easypaisa' | 'jazzcash' | 'sadapay' | 'bank' | 'wise_paypal'>('easypaisa');
  const [notes, setNotes] = useState('');
  
  const [submittedOrder, setSubmittedOrder] = useState<EnrollmentOrder | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = UI_TEXT.enrollModal;
  const isRtl = lang === 'ur' || lang === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!studentName.trim() || !whatsapp.trim() || !fatherName.trim()) {
      setFormError(
        lang === 'ur'
          ? "براہِ کرم طالب علم کا نام، والد کا نام اور واٹس ایپ نمبر درج فرمائیں۔"
          : lang === 'ar'
          ? "يرجى كتابة اسم الطالب الكامل، واسم الوالد، ورقم الواتساب."
          : "Please fill in Student Name, Father's Name, and WhatsApp number."
      );
      return;
    }

    const orderId = `ENR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const matchingCourse = courses.find(c => c.title.en === preferredCourse || c.title.ur === preferredCourse);
    const amount = matchingCourse ? matchingCourse.feeMonthlyPKR : 4500;

    const newOrder: EnrollmentOrder = {
      id: orderId,
      studentName: studentName.trim(),
      fatherName: fatherName.trim(),
      countryCity: countryCity.trim() || (lang === 'ur' ? "آن لائن" : lang === 'ar' ? "عبر الإنترنت" : "Online"),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      type: 'live_course',
      courseOrItemTitle: preferredCourse,
      preferredTime,
      classFrequency,
      knowledgeLevel,
      totalAmountPKR: amount,
      paymentMethod,
      paymentStatus: 'Pending',
      notes: notes.trim() || undefined,
      createdAt: new Date().toLocaleString(lang === 'ur' ? 'ur-PK' : lang === 'ar' ? 'ar-SA' : 'en-US')
    };

    storage.addOrder(newOrder);
    setSubmittedOrder(newOrder);
  };

  const getWhatsAppMessage = (order: EnrollmentOrder) => {
    if (lang === 'ur') {
      const timingUr = order.preferredTime === 'morning' ? 'صبح' : order.preferredTime === 'afternoon' ? 'دوپہر' : 'شام / رات';
      const text = `السلام علیکم مفتی دانش کلیم صاحب،\n\nمیں نے کلیم آن لائن اکیڈمی میں 1-on-1 آن لائن کلاس کا باضابطہ داخلہ فارم جمع کر دیا ہے۔\n\n*سرکاری داخلہ سلپ تفصیلات:*\n- رجسٹریشن نمبر: ${order.id}\n- طالب علم کا نام: ${order.studentName}\n- والد کا نام: ${order.fatherName}\n- مطلوبہ کورس: ${order.courseOrItemTitle}\n- کلاس کا وقت: ${timingUr}\n- شہر و ملک: ${order.countryCity}\n- واٹس ایپ نمبر: ${order.whatsapp}\n- ماہانہ تعلیمی فیس: PKR ${order.totalAmountPKR}\n- طریقہ ادائیگی: ${order.paymentMethod.toUpperCase()}\n\nبراہِ کرم درخواست ملاحظہ فرما کر کلاس کا شیڈول اور زوم لنک جاری فرما دیں۔ جزاکم اللہ خیرا!`;
      return encodeURIComponent(text);
    } else if (lang === 'ar') {
      const timingAr = order.preferredTime === 'morning' ? 'صباحاً' : order.preferredTime === 'afternoon' ? 'ظهراً' : 'مساءً';
      const text = `السلام عليكم ورحمة الله فضيلة المفتي دانش كليم،\n\nقمت بتقديم طلب التسجيل في الحلقات الفردية المباشرة بأكاديمية كليم العالمية للتعليم الإلكتروني.\n\n*بيانات إيصال القيد والتسجيل:*\n- رقم القيد: ${order.id}\n- اسم الطالب: ${order.studentName}\n- اسم الوالد: ${order.fatherName}\n- المقرر الدراسي: ${order.courseOrItemTitle}\n- توقيت الحصص: ${timingAr}\n- الدولة والمدينة: ${order.countryCity}\n- رقم الواتساب: ${order.whatsapp}\n- الرسوم الشهرية: PKR ${order.totalAmountPKR}\n- وسيلة الدفع: ${order.paymentMethod.toUpperCase()}\n\nيرجى التكرم باعتماد القيد وإرسال رابط الزوم وموعد الحصص المباشرة. جزاكم الله خيراً!`;
      return encodeURIComponent(text);
    } else {
      const text = `Assalamu Alaikum Mufti Danish Kaleem Sahib,\n\nI have submitted my 1-on-1 Class Enrollment at Kaleem Online Academy.\n\n*Registration Slip:* \n- Reg ID: ${order.id}\n- Student Name: ${order.studentName}\n- Father's Name: ${order.fatherName}\n- Course: ${order.courseOrItemTitle}\n- Preferred Time: ${order.preferredTime.toUpperCase()}\n- Country/City: ${order.countryCity}\n- WhatsApp: ${order.whatsapp}\n- Fee Amount: PKR ${order.totalAmountPKR}\n- Payment Method: ${order.paymentMethod.toUpperCase()}\n\nPlease verify my application and share the schedule and Zoom link. JazakAllah Khair!`;
      return encodeURIComponent(text);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-24 sm:pt-28 md:pt-32 pb-6 px-3 sm:px-5 bg-stone-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8.5rem)] my-auto sm:my-0 text-stone-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Pinned Modal Header with Prominent Cancel Button */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-800 bg-stone-900/95 backdrop-blur flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-950 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-lg sm:text-xl shrink-0">
              اقرأ
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl font-bold font-kufi text-amber-300 truncate">
                {t.title[lang]}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">
                {lang === 'ur'
                  ? 'مفتی دانش کلیم صاحب کے زیرِ نگرانی مستند 1-on-1 کلاسز'
                  : lang === 'ar'
                  ? 'تعليم فردي مباشر وموثق مع المفتي دانش كليم'
                  : 'Certified 1-on-1 Mentorship with Mufti Danish Kaleem'}
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
              {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إلغاء' : 'Close'}
            </span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {!submittedOrder ? (
          <div>

            {/* Validation Error Message */}
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* Select Course */}
              <div>
                <label className="block font-semibold text-xs text-amber-300 uppercase tracking-wider mb-1.5">
                  {lang === 'ur' ? 'مطلوبہ کورس منتخب کریں *' : lang === 'ar' ? 'اختر المقرر الدراسي *' : 'Select Course *'}
                </label>
                <select
                  value={preferredCourse}
                  onChange={(e) => setPreferredCourse(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none transition-colors"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.title.en}>
                      {c.title[lang] || c.title.en} (PKR {c.feeMonthlyPKR} / month)
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Name & Father Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    {t.fullName[lang]}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ur' ? 'طالب علم کا نام' : lang === 'ar' ? 'اسم الطالب الكامل' : 'Student Full Name'}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    {t.fatherName[lang]}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ur' ? 'والد یا سرپرست کا نام' : lang === 'ar' ? 'اسم ولي الأمر' : "Father's Name"}
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Country/City & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    {t.countryCity[lang]}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ur' ? 'لاہور، پاکستان / ریاض / لندن' : lang === 'ar' ? 'المدينة والدولة' : 'e.g. Lahore, Pakistan'}
                    value={countryCity}
                    onChange={(e) => setCountryCity(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    {t.whatsapp[lang]}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Timing Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label 
                  onClick={() => setPreferredTime('morning')}
                  className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                    preferredTime === 'morning' 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' 
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="block text-xs">{t.timeMorning[lang]}</span>
                </label>

                <label 
                  onClick={() => setPreferredTime('afternoon')}
                  className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                    preferredTime === 'afternoon' 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' 
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="block text-xs">{t.timeAfternoon[lang]}</span>
                </label>

                <label 
                  onClick={() => setPreferredTime('evening')}
                  className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                    preferredTime === 'evening' 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold' 
                      : 'bg-stone-800 border-stone-700 text-stone-300'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                  <span className="block text-xs">{t.timeEvening[lang]}</span>
                </label>
              </div>

              {/* Payment Gateway */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-xs text-stone-300 mb-1.5">
                    {lang === 'ur' ? 'طریقہ ادائیگی' : lang === 'ar' ? 'طريقة السداد' : 'Payment Gateway'}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                  >
                    <option value="easypaisa">EasyPaisa (0300-1234567)</option>
                    <option value="jazzcash">JazzCash (0301-7654321)</option>
                    <option value="sadapay">SadaPay (PK72SADA...)</option>
                    <option value="bank">Meezan Islamic Bank Transfer</option>
                    <option value="wise_paypal">Overseas Card / Wise / PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-xs text-stone-300 mb-1.5">
                    {t.notes[lang]}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'ur' ? 'کوئی خاص وقت یا سوال...' : lang === 'ar' ? 'أي ملاحظات خاصة...' : 'Special notes...'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 sm:py-3.5 px-6 rounded-2xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-stone-950 shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer font-kufi"
                >
                  <Sparkles className="w-5 h-5 text-stone-950" />
                  <span>{t.submitBtn[lang]}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-2xl font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                >
                  <X className="w-4 h-4 text-stone-400" />
                  <span>{lang === 'ur' ? 'منسوخ / بند کریں' : lang === 'ar' ? 'إلغاء الأمر' : 'Cancel'}</span>
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Confirmation Slip & WhatsApp Share Screen (100% Multilingual: Urdu, Arabic, English) */
          <div className="text-center py-2 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-kufi text-amber-300">
                {lang === 'ur'
                  ? 'داخلہ فارم کامیابی سے موصول ہو گیا'
                  : lang === 'ar'
                  ? 'تم تسجيل طلب الالتحاق بنجاح'
                  : 'Enrollment Submitted Successfully!'}
              </h3>
              <p className="text-sm text-stone-300 mt-1">
                {lang === 'ur'
                  ? 'آپ کی تصدیقی داخلہ سلپ تیار ہے۔ فوری منظوری اور زوم لنک کے لیے واٹس ایپ پر بھیجیں۔'
                  : lang === 'ar'
                  ? 'استمارة التسجيل جاهزة، يرجى إرسالها عبر الواتساب لاعتماد الحصة ورابط الزوم فوراً.'
                  : 'Your registration slip is ready. Please share via WhatsApp for instant schedule approval.'}
              </p>
            </div>

            {/* Printable Registration Slip Box */}
            <div 
              id="printable-invoice" 
              className={`bg-white text-stone-900 border-4 border-amber-500/50 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm space-y-3 max-w-xl mx-auto shadow-2xl ${
                isRtl ? 'text-right' : 'text-left'
              }`}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Slip Header */}
              <div className="flex items-center justify-between border-b-2 border-stone-800 pb-3">
                <div>
                  <h4 className="font-bold text-emerald-950 text-base sm:text-lg font-kufi">
                    {settings.siteTitle[lang] || settings.siteTitle.en}
                  </h4>
                  <p className="text-[11px] text-stone-600 font-medium">
                    {lang === 'ur' 
                      ? 'دار العلوم و اللغات الإسلامية — سرکاری داخلہ سلپ و رجسٹریشن تصدیق نامہ'
                      : lang === 'ar'
                      ? 'دار العلوم واللغات — استمارة القيد والتسجيل للحلقات الفردية'
                      : 'Official 1-on-1 Mentorship Enrollment Slip'}
                  </p>
                </div>
                <div className={`${isRtl ? 'text-left' : 'text-right'}`}>
                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-100 text-stone-950 font-bold border border-amber-300 inline-block">
                    {submittedOrder.id}
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-0.5">
                    {submittedOrder.createdAt}
                  </span>
                </div>
              </div>

              {/* Grid of Registration Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-800 bg-stone-50 p-3 sm:p-4 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block text-[11px]">
                    {lang === 'ur' ? 'طالب علم کا نام:' : lang === 'ar' ? 'اسم الطالب:' : 'Student Name:'}
                  </span>
                  <strong className="text-stone-950 text-sm block">{submittedOrder.studentName}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">
                    {lang === 'ur' ? 'ولدیت / سرپرست:' : lang === 'ar' ? 'اسم الوالد / ولي الأمر:' : "Father's Name:"}
                  </span>
                  <strong className="text-stone-950 text-sm block">{submittedOrder.fatherName}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">
                    {lang === 'ur' ? 'منتخب کردہ کورس:' : lang === 'ar' ? 'المقرر الدراسي:' : 'Course:'}
                  </span>
                  <strong className="text-emerald-900 block">{submittedOrder.courseOrItemTitle}</strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">
                    {lang === 'ur' ? 'کلاس کا ترجیحی وقت:' : lang === 'ar' ? 'توقيت الحصص المفضل:' : 'Preferred Timing:'}
                  </span>
                  <strong className="text-amber-800 uppercase block">
                    {submittedOrder.preferredTime === 'morning' 
                      ? (lang === 'ur' ? 'صبح کا وقت' : lang === 'ar' ? 'الفترة الصباحية' : 'Morning')
                      : submittedOrder.preferredTime === 'afternoon'
                      ? (lang === 'ur' ? 'دوپہر کا وقت' : lang === 'ar' ? 'فترة الظهيرة' : 'Afternoon')
                      : (lang === 'ur' ? 'شام / رات کا وقت' : lang === 'ar' ? 'الفترة المسائية' : 'Evening')}
                  </strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">
                    {lang === 'ur' ? 'شہر و ملک:' : lang === 'ar' ? 'المدينة والدولة:' : 'City & Country:'}
                  </span>
                  <span className="text-stone-800 font-medium">{submittedOrder.countryCity}</span>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">
                    {lang === 'ur' ? 'واٹس ایپ نمبر:' : lang === 'ar' ? 'رقم الواتساب:' : 'WhatsApp:'}
                  </span>
                  <span className="text-stone-800 font-mono font-bold" dir="ltr">{submittedOrder.whatsapp}</span>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">
                    {lang === 'ur' ? 'ماہانہ تعلیمی فیس:' : lang === 'ar' ? 'الرسوم الشهرية:' : 'Monthly Fee:'}
                  </span>
                  <strong className="text-emerald-900 font-bold text-sm font-mono">
                    PKR {submittedOrder.totalAmountPKR.toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span className="text-stone-500 block text-[11px]">
                    {lang === 'ur' ? 'اسٹیٹس / حالت:' : lang === 'ar' ? 'حالة القيد:' : 'Status:'}
                  </span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    {lang === 'ur' ? 'زیرِ کارروائی و تصدیق' : lang === 'ar' ? 'قيد المراجعة والاعتماد' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              {/* Seal & Note */}
              <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-right">
                  <p>
                    {lang === 'ur'
                      ? 'براہِ کرم فیس کی رسید واٹس ایپ پر ارسال فرمائیں تاکہ ٹائم ٹیبل اور زوم لنک جاری کیا جا سکے۔'
                      : lang === 'ar'
                      ? 'يرجى إرسال إشعار السداد عبر الواتساب لتأكيد جدول الحصص ورابط القاعة المباشرة.'
                      : 'Submit payment proof via WhatsApp to receive your official schedule & live link.'}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {settings.whatsappNumber} | {settings.contactEmail}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 border border-amber-300 bg-amber-50/80 px-3 py-1 rounded-xl shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] font-bold text-stone-800">
                    {lang === 'ur' ? 'مفتی دانش کلیم (مہتمم)' : lang === 'ar' ? 'المفتي دانش كليم' : 'Mufti Danish Kaleem'}
                  </span>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp Confirmation Button */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${getWhatsAppMessage(submittedOrder)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all font-kufi cursor-pointer"
              >
                <Phone className="w-5 h-5 fill-white text-white" />
                <span>
                  {lang === 'ur'
                    ? 'فوری منظوری کے لیے داخلہ سلپ واٹس ایپ پر ارسال فرمائیں'
                    : lang === 'ar'
                    ? 'إرسال الاستمارة عبر الواتساب للاعتماد الفوري'
                    : 'Send Slip via WhatsApp for Instant Approval'}
                </span>
              </a>

              <div className="flex flex-wrap gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={() => downloadPrintableElement('printable-invoice', `${submittedOrder.id}.html`, `${submittedOrder.studentName} — Enrollment Slip`)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold flex items-center gap-2 border border-amber-500/40 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'ڈاؤنلوڈ (.html)' : lang === 'ar' ? 'تحميل الاستمارة' : 'Download (.html)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 border border-stone-700 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>
                    {lang === 'ur' ? 'داخلہ سلپ پرنٹ کریں' : lang === 'ar' ? 'طباعة استمارة التسجيل' : 'Print Slip'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer font-kufi"
                >
                  {lang === 'ur' ? 'مکمل / بند کریں' : lang === 'ar' ? 'تم / إغلاق' : 'Done'}
                </button>
              </div>
            </div>

          </div>
        )}
        </div>

      </div>
    </div>
  );
};
