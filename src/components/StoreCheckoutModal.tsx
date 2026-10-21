import React, { useState } from 'react';
import { StoreItem, Language, SiteSettings, EnrollmentOrder } from '../types';
import { storage } from '../utils/storage';
import { X, CheckCircle, Download, Printer, Phone, ShieldCheck, ShoppingCart, Sparkles, Award } from 'lucide-react';

interface StoreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: StoreItem[];
  lang: Language;
  settings: SiteSettings;
  onOrderSuccess: () => void;
}

export const StoreCheckoutModal: React.FC<StoreCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  lang,
  settings,
  onOrderSuccess
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [countryCity, setCountryCity] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'easypaisa' | 'jazzcash' | 'sadapay' | 'bank' | 'wise_paypal'>('easypaisa');
  const [completedOrder, setCompletedOrder] = useState<EnrollmentOrder | null>(null);

  if (!isOpen) return null;

  const isRtl = lang === 'ur' || lang === 'ar';
  const totalAmount = selectedItems.reduce((acc, item) => acc + item.pricePKR, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !whatsapp.trim() || !fatherName.trim()) {
      alert(
        lang === 'ur' 
          ? "براہِ کرم طالب علم کا نام، والد کا نام اور واٹس ایپ نمبر درج فرمائیں۔"
          : lang === 'ar'
          ? "يرجى كتابة اسم الطالب، واسم الوالد، ورقم الواتساب."
          : "Please fill in Student Name, Father's Name, and WhatsApp number."
      );
      return;
    }

    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = selectedItems.map(i => ({
      id: i.id,
      title: i.title[lang] || i.title.en,
      pricePKR: i.pricePKR
    }));

    const order: EnrollmentOrder = {
      id: orderId,
      studentName: buyerName.trim(),
      fatherName: fatherName.trim(),
      countryCity: countryCity.trim() || (lang === 'ur' ? "آن لائن پورٹل" : lang === 'ar' ? "البوابة الرقمية" : "Online Portal"),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      type: 'store_purchase',
      courseOrItemTitle: selectedItems.map(i => i.title[lang] || i.title.en).join(' + '),
      selectedStoreItems: itemsSummary,
      preferredTime: 'evening',
      totalAmountPKR: totalAmount,
      paymentMethod,
      paymentStatus: 'Pending',
      createdAt: new Date().toLocaleString(lang === 'ur' ? 'ur-PK' : lang === 'ar' ? 'ar-SA' : 'en-US')
    };

    storage.addOrder(order);
    setCompletedOrder(order);
    onOrderSuccess();
  };

  const getWhatsAppMessage = (order: EnrollmentOrder) => {
    if (lang === 'ur') {
      const itemsList = selectedItems.map((item, idx) => `  ${idx + 1}. ${item.title.ur || item.title.en} (PKR ${item.pricePKR})`).join('\n');
      const text = `السلام علیکم مفتی دانش کلیم صاحب،\n\nمیں نے ادارہ دانش ڈیجیٹل بک اسٹور سے مطالعہ کتب و مواد کا آرڈر بک کیا ہے۔\n\n*رسیدِ خریداری تفصیلات:*\n- رسید نمبر: ${order.id}\n- طالب علم: ${order.studentName}\n- والد کا نام: ${order.fatherName}\n- منتخب کتب و فائلز:\n${itemsList}\n\n*کل قابلِ ادا رقم: PKR ${order.totalAmountPKR}*\n- ادائیگی کا ذریعہ: ${order.paymentMethod.toUpperCase()}\n- واٹس ایپ: ${order.whatsapp}\n\nمیں نے فیس کی منتقلی کی رسید منسلک کر دی ہے۔ براہِ کرم تصدیق فرما کر ڈاؤنلوڈ لنک اور مواد فراہم فرما دیں۔ جزاکم اللہ خیرا!`;
      return encodeURIComponent(text);
    } else if (lang === 'ar') {
      const itemsList = selectedItems.map((item, idx) => `  ${idx + 1}. ${item.title.ar || item.title.en} (PKR ${item.pricePKR})`).join('\n');
      const text = `السلام عليكم ورحمة الله فضيلة المفتي دانش كليم،\n\nقمت بطلب شراء مطبوعات وملفات رقمية من متجر أكاديمية الدانش.\n\n*بيانات فاتورة الشراء:*\n- رقم الفاتورة: ${order.id}\n- اسم الطالب: ${order.studentName}\n- اسم الوالد: ${order.fatherName}\n- المواد والكتب المطلوبة:\n${itemsList}\n\n*المبلغ الإجمالي: PKR ${order.totalAmountPKR}*\n- طريقة السداد: ${order.paymentMethod.toUpperCase()}\n- رقم الواتساب: ${order.whatsapp}\n\nمرفق لكم إشعار التحويل البنكي، يرجى تزويدي بروابط التحميل المباشرة. بارك الله فيكم وجزاكم خيراً!`;
      return encodeURIComponent(text);
    } else {
      const itemsList = selectedItems.map((item, idx) => `  ${idx + 1}. ${item.title.en} (PKR ${item.pricePKR})`).join('\n');
      const text = `Assalamu Alaikum Mufti Danish Kaleem Sahib,\n\nI have placed an order for study materials on Al-Danish Digital Bookstore.\n\n*Official Invoice Details:*\n- Invoice #: ${order.id}\n- Student Name: ${order.studentName}\n- Father's Name: ${order.fatherName}\n- Purchased Items:\n${itemsList}\n\n*Total Payable: PKR ${order.totalAmountPKR}*\n- Gateway: ${order.paymentMethod.toUpperCase()}\n- WhatsApp: ${order.whatsapp}\n\nI am attaching my payment transaction screenshot. Please confirm my digital downloads and access credentials!`;
      return encodeURIComponent(text);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-200"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Pinned Modal Header with Prominent Cancel Button */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-800 bg-stone-900/95 backdrop-blur flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-xl font-bold font-kufi text-amber-300 truncate">
                {lang === 'ur' ? 'آرڈر و سرکاری رسید جنریٹر' : lang === 'ar' ? 'إتمام الشراء والفاتورة الرسمية' : 'Checkout & Official Invoice'}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">
                {lang === 'ur' 
                  ? 'منتخب کردہ ڈیجیٹل کتب و اسباق کی سرکاری رسید'
                  : lang === 'ar'
                  ? 'إصدار الفاتورة المعتمدة فوراً'
                  : 'Auto-Generated Official Invoice'}
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
        {!completedOrder ? (
          <div>

            {/* Selected Items Summary */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 mb-6 space-y-2.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                {lang === 'ur' ? 'منتخب شدہ کتب و کورسز:' : lang === 'ar' ? 'المواد والمطبوعات المحددة:' : 'Selected Resources:'}
              </span>
              <div className="space-y-1.5 divide-y divide-stone-800/60 max-h-40 overflow-y-auto pr-1">
                {selectedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pt-1.5">
                    <span className="text-stone-200">
                      {idx + 1}. {item.title[lang] || item.title.en}
                      <span className="text-[10px] text-amber-400/80 mx-1.5 font-mono">({item.formatBadge})</span>
                    </span>
                    <strong className="text-amber-300 font-mono">PKR {item.pricePKR.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-stone-800 flex justify-between items-center text-sm font-bold">
                <span className="text-stone-300">
                  {lang === 'ur' ? 'کل قابلِ ادا رقم:' : lang === 'ar' ? 'المبلغ الإجمالي المطلوب:' : 'Total Payable Amount:'}
                </span>
                <span className="text-amber-400 text-lg font-mono">PKR {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleCheckout} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    {lang === 'ur' ? 'طالب علم کا مکمل نام *' : lang === 'ar' ? 'اسم الطالب الكامل *' : 'Student Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ur' ? 'مثال: حافظ محمد اویس' : lang === 'ar' ? 'مثال: محمد أحمد' : 'e.g. Muhammad Owais'}
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    {lang === 'ur' ? 'والد کا نام *' : lang === 'ar' ? 'اسم الوالد *' : "Father's Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ur' ? 'والد / سرپرست کا نام' : lang === 'ar' ? 'اسم ولي الأمر' : 'Father / Guardian Name'}
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    {lang === 'ur' ? 'واٹس ایپ نمبر (ڈاؤنلوڈ لنکس کے لیے) *' : lang === 'ar' ? 'رقم الواتساب (لتلقي الملفات) *' : 'WhatsApp Number (for downloads) *'}
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

                <div>
                  <label className="block font-semibold text-stone-300 mb-1.5">
                    {lang === 'ur' ? 'شہر و ملک' : lang === 'ar' ? 'المدينة والدولة' : 'City & Country'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'ur' ? 'لاہور، پاکستان / لندن، برطانیہ' : lang === 'ar' ? 'الرياض، السعودية / دبي' : 'e.g. Lahore / London / Dubai'}
                    value={countryCity}
                    onChange={(e) => setCountryCity(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1.5">
                  {lang === 'ur' ? 'طریقہ ادائیگی منتخب کریں' : lang === 'ar' ? 'اختر طريقة السداد' : 'Select Payment Gateway'}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 text-sm outline-none"
                >
                  <option value="easypaisa">EasyPaisa (Account: 0300-1234567)</option>
                  <option value="jazzcash">JazzCash (Account: 0301-7654321)</option>
                  <option value="sadapay">SadaPay (PK72SADA...)</option>
                  <option value="bank">Meezan Islamic Bank Transfer</option>
                  <option value="wise_paypal">Overseas Card / Wise / PayPal</option>
                </select>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 sm:py-3.5 px-6 rounded-2xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-stone-950 shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base font-kufi"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {lang === 'ur' 
                      ? 'سرکاری رسید تیار کریں اور آرڈر مکمل کریں'
                      : lang === 'ar'
                      ? 'إصدار الفاتورة الرسمية وتأكيد الطلب'
                      : 'Generate Official Invoice & Complete Order'}
                  </span>
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
          /* Auto-Generated Official Invoice Screen (100% Multilingual: Urdu, Arabic, English) */
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/40 mb-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-kufi text-amber-300">
                {lang === 'ur' 
                  ? 'سرکاری رسید کامیابی سے جاری کر دی گئی'
                  : lang === 'ar'
                  ? 'تم إصدار الفاتورة الرسمية المعتمدة بنجاح'
                  : 'Official Receipt / Invoice Generated'}
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                {lang === 'ur'
                  ? 'رسید تیار ہے۔ فوری ڈاؤنلوڈ لنک اور تصدیق کے لیے واٹس ایپ پر ارسال فرمائیں۔'
                  : lang === 'ar'
                  ? 'الفاتورة جاهزة، يرجى إرسالها عبر الواتساب لتفعيل روابط التحميل فوراً.'
                  : 'Receipt is generated. Please share via WhatsApp for instant digital link activation.'}
              </p>
            </div>

            {/* Official Printable Invoice Box */}
            <div
              id="printable-invoice"
              className="bg-white text-stone-900 rounded-2xl p-5 sm:p-7 shadow-2xl border-4 border-amber-500/50 text-xs sm:text-sm font-sans"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-stone-800 pb-4 mb-4 gap-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold font-kufi text-emerald-950">
                    {settings.siteTitle[lang] || settings.siteTitle.en}
                  </h4>
                  <p className="text-xs text-stone-600 font-medium">
                    {lang === 'ur' 
                      ? 'دار العلوم و اللغات الإسلامية — سرکاری رسیدِ خریداری ڈیجیٹل کتب و مواد'
                      : lang === 'ar'
                      ? 'دار العلوم واللغات — فاتورة الشراء المعتمدة للمطبوعات والمواد الرقمية'
                      : 'Digital Bookstore & Educational Resources Official Invoice'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'ur'
                      ? 'نگرانِ علمی: مفتی دانش کلیم صاحب (حفظہ اللہ)'
                      : lang === 'ar'
                      ? 'المشرف العام: فضيلة المفتي دانش كليم (حفظه الله تعالى)'
                      : `Academic Director: ${settings.founderName.en}`}
                  </p>
                </div>
                <div className={`${isRtl ? 'sm:text-left' : 'sm:text-right'}`}>
                  <span className="font-mono text-sm font-bold bg-amber-100 text-stone-950 px-3 py-1 rounded-md border border-amber-300 inline-block">
                    {completedOrder.id}
                  </span>
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    {completedOrder.createdAt}
                  </span>
                </div>
              </div>

              {/* Student & Bill To Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs text-stone-700 bg-stone-50 p-3 sm:p-4 rounded-xl border border-stone-200">
                <div>
                  <span className="font-semibold text-stone-500 block">
                    {lang === 'ur' ? 'بل بنام (طالب علم):' : lang === 'ar' ? 'فاتورة إلى (الطالب):' : 'Billed To (Student):'}
                  </span>
                  <strong className="text-sm text-stone-900 block">{completedOrder.studentName}</strong>
                  <p>
                    <span className="text-stone-500">{lang === 'ur' ? 'ولدیت / سرپرست: ' : lang === 'ar' ? 'اسم الوالد: ' : "Father's Name: "}</span>
                    <strong>{completedOrder.fatherName}</strong>
                  </p>
                  <p>
                    <span className="text-stone-500">{lang === 'ur' ? 'شہر و ملک: ' : lang === 'ar' ? 'المدينة والدولة: ' : 'City & Country: '}</span>
                    {completedOrder.countryCity}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-stone-500 block">
                    {lang === 'ur' ? 'آرڈر کی تفصیلات:' : lang === 'ar' ? 'بيانات السداد:' : 'Order Specs:'}
                  </span>
                  <p>
                    <span className="text-stone-500">{lang === 'ur' ? 'واٹس ایپ: ' : lang === 'ar' ? 'الواتساب: ' : 'WhatsApp: '}</span>
                    <strong className="font-mono" dir="ltr">{completedOrder.whatsapp}</strong>
                  </p>
                  <p>
                    <span className="text-stone-500">{lang === 'ur' ? 'طریقہ ادائیگی: ' : lang === 'ar' ? 'وسيلة الدفع: ' : 'Payment Gateway: '}</span>
                    <strong className="uppercase">{completedOrder.paymentMethod}</strong>
                  </p>
                  <p>
                    <span className="text-stone-500">{lang === 'ur' ? 'حالتِ تصدیق: ' : lang === 'ar' ? 'حالة الاعتماد: ' : 'Status: '}</span>
                    <span className="text-amber-800 font-bold">
                      {lang === 'ur' ? 'زیرِ کارروائی (تصدیق درکار)' : lang === 'ar' ? 'قيد المراجعة (بانتظار الإشعار)' : 'Pending Payment Proof'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto -mx-1 px-1">
                <table className={`w-full text-xs mb-4 min-w-[280px] ${isRtl ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr className="border-b-2 border-stone-300 text-stone-700">
                      <th className="py-2">
                        {lang === 'ur' ? 'تفصیلاتِ کتب و مواد' : lang === 'ar' ? 'بيان الكتب والمواد الرقمية' : 'Item Description'}
                      </th>
                      <th className={`py-2 ${isRtl ? 'text-left' : 'text-right'}`}>
                        {lang === 'ur' ? 'قیمت (روپے)' : lang === 'ar' ? 'الرسوم (PKR)' : 'Price'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {selectedItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 font-medium text-stone-800">
                          {item.title[lang] || item.title.en}
                          <span className="block text-[10px] text-stone-500">
                            {item.formatBadge}
                          </span>
                        </td>
                        <td className={`py-2.5 font-mono font-bold text-stone-900 ${isRtl ? 'text-left' : 'text-right'}`}>
                          PKR {item.pricePKR.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-stone-800 font-bold text-sm">
                      <td className="py-2.5 text-stone-900">
                        {lang === 'ur' ? 'کل میزان / رقم:' : lang === 'ar' ? 'المجموع الإجمالي:' : 'Grand Total:'}
                      </td>
                      <td className={`py-2.5 font-mono text-emerald-900 text-lg ${isRtl ? 'text-left' : 'text-right'}`}>
                        PKR {totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Seal & Footer Note */}
              <div className="border-t border-stone-200 pt-3 text-[11px] text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-center sm:text-right">
                  <p>
                    {lang === 'ur'
                      ? 'واٹس ایپ پر ادائیگی کی رسید بھیجتے ہی ڈاؤنلوڈ لنکس فوری فعال کر دیے جائیں گے۔'
                      : lang === 'ar'
                      ? 'يتم تفعيل روابط التحميل المباشرة وإرسال المستندات فور تأكيد العملية عبر الواتساب.'
                      : 'Digital download links & credentials will be dispatched upon payment proof via WhatsApp.'}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">
                    {settings.whatsappNumber} | {settings.contactEmail}
                  </p>
                </div>

                <div className="flex items-center gap-2 border border-amber-300 bg-amber-50/80 px-3 py-1.5 rounded-xl shrink-0">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-bold text-stone-800">
                    {lang === 'ur' ? 'مہر و تصدیق: ادارہ دانش الاسلامی' : lang === 'ar' ? 'ختم الاعتماد: إدارة الأكاديمية' : 'Official Academy Seal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${getWhatsAppMessage(completedOrder)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all font-kufi"
              >
                <Phone className="w-5 h-5 fill-white text-white" />
                <span>
                  {lang === 'ur'
                    ? 'فوری ڈاؤنلوڈ کے لیے رسید واٹس ایپ پر ارسال فرمائیں'
                    : lang === 'ar'
                    ? 'إرسال الفاتورة عبر الواتساب للاستلام الفوري'
                    : 'Submit Payment Receipt to WhatsApp for Instant Download'}
                </span>
              </a>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 border border-stone-700 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>
                    {lang === 'ur' ? 'رسید پرنٹ یا محفوظ کریں' : lang === 'ar' ? 'طباعة / حفظ الفاتورة' : 'Print / Save Receipt'}
                  </span>
                </button>
                <button
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
