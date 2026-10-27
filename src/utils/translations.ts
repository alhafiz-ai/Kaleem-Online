import { Language } from '../types';

export const UI_TEXT = {
  // Navigation
  nav: {
    home: { ur: "صفحۂ اول", en: "Home", ar: "الرئيسية" },
    founder: { ur: "تعارفِ بانی", en: "Founder Profile", ar: "سيرة المؤسس" },
    courses: { ur: "کورسز و داخلہ", en: "Courses", ar: "الدورات" },
    testimonials: { ur: "آرائے طلبہ", en: "Testimonials", ar: "آراء الطلاب" },
    store: { ur: "ڈیجیٹل بک اسٹور", en: "Digital Store", ar: "المتجر الرقمي" },
    publications: { ur: "کتب و مقالات", en: "Publications", ar: "المؤلفات والبحوث" },
    mediaAds: { ur: "اعلانات و میڈیا", en: "Media & Announcements", ar: "الإعلانات والميديا" },
    scholarApps: { ur: "تحقیقی ایپس", en: "Scholar Tools", ar: "أدوات الباحث" },
    payments: { ur: "طریقۂ ادائیگی", en: "Payments & Fees", ar: "طرق الدفع" },
    policies: { ur: "قوانین و ضوابط", en: "Policies", ar: "السياسات والضوابط" },
    verifySanad: { ur: "تصدیقِ سند", en: "Verify Sanad", ar: "التحقق من السند" },
    adminPortal: { ur: "ایڈمن پینل 🔐", en: "Admin Panel 🔐", ar: "لوحة التحكم 🔐" },
    liveClassBadge: { ur: "لائیو زوم کلاس", en: "Live Zoom Class", ar: "الحصة المباشرة" },
    switchLang: { ur: "زبان تبدیل کریں", en: "Language", ar: "اللغة" }
  },

  // Hero Section
  hero: {
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    quranVerse: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    verseRef: "سورۃ طہٰ: 114",
    ctaExplore: { ur: "کورسز دریافت کریں", en: "Explore Courses", ar: "تصفح الدورات" },
    ctaEnroll: { ur: "ون آن ون لائیو کلاس میں داخلہ لیں", en: "Enroll 1-on-1 Class", ar: "التسجيل الفردي المباشر" },
    ctaStore: { ur: "ڈیجیٹل اسٹور وزٹ کریں", en: "Visit Digital Store", ar: "زيارة المتجر الرقمي" },
    stats: {
      students: { ur: "1500+ فارغ التحصیل طلبہ", en: "1500+ Graduated Students", ar: "1500+ طالب علم متخرج" },
      countries: { ur: "25+ ممالک میں طلبہ", en: "Students in 25+ Countries", ar: "طلاب في 25+ دولة" },
      satisfaction: { ur: "100% مستند و مصدقہ اسناد", en: "100% Certified Curriculum", ar: "100% مناهج موثقة ومعتمدة" },
      liveClasses: { ur: "روزانہ لائیو انفرادی کلاسز", en: "Daily 1-on-1 Sessions", ar: "حلقات فردية مباشرة يومياً" }
    }
  },

  // Founder Card
  founder: {
    sectionTitle: { ur: "تعارفِ بانی و نگرانِ اعلیٰ", en: "Founder & Academic Director", ar: "المشرف العام ومؤسس الأكاديمية" },
    sectionSubtitle: { ur: "سلسلہ تدریس و تحقیق اور اجازہ", en: "Scholarly Lineage, Research & Credentials", ar: "السند العلمي والإجازات والمؤلفات" },
    viewBioBtn: { ur: "مکمل تعارف و اسناد دیکھیں", en: "View Full Credentials & Ijazah", ar: "عرض السيرة العلمية والإجازات" },
    verifiedBadge: { ur: "مستند عالم و مفتی", en: "Certified Islamic Scholar", ar: "عالم ومفتٍ مجاز" },
    specialization: { ur: "تخصص: تجوید، علم النحو والصرف، فقہ و افتاء", en: "Specialization: Tajweed, Arabic Syntax & Morphology, Islamic Jurisprudence", ar: "التخصص: التجويد، النحو والصرف، الفقه وأصول الإفتاء" },
    yearsExp: { ur: "12+ سال کا تدریسی تجربہ", en: "12+ Years Teaching Experience", ar: "12+ عاماً من الخبرة التدريسية" }
  },

  // Courses
  courses: {
    sectionTitle: { ur: "آن لائن خصوصی تعلیمی کورسز", en: "Featured Online Academic Courses", ar: "الدورات التعليمية المعتمدة" },
    sectionSubtitle: { ur: "ون آن ون براہِ راست کلاسز، اپنی سہولت کے مطابق وقت اور انفرادی توجہ", en: "1-on-1 Private Live Mentorship, Flexible Scheduling & Personalized Focus", ar: "حلقات فردية مباشرة مع الشيخ، أوقات مرنة ومتابعة شخصية مستمرة" },
    monthlyFee: { ur: "ماہانہ فیس:", en: "Monthly Fee:", ar: "الرسوم الشهرية:" },
    enrollBtn: { ur: "داخلہ لیں (1-on-1 لائیو کلاس)", en: "Enroll Now (1-on-1 Live Class)", ar: "سجل الآن (حصة فردية مباشرة)" },
    perMonth: { ur: "ماہانہ", en: "/month", ar: "/شهرياً" },
    featuresLabel: { ur: "کورس کی خصوصیات:", en: "Course Highlights:", ar: "مميزات الدورة:" },
    durationLabel: { ur: "مدت:", en: "Duration:", ar: "المدة:" },
    instructorLabel: { ur: "استاد:", en: "Instructor:", ar: "المدرس:" }
  },

  // Student Testimonials
  testimonials: {
    sectionTitle: { ur: "طلبہ کی کامیابی کی داستانیں و تاثرات", en: "Student Testimonials & Success Stories", ar: "قصص نجاح الطلاب وشهاداتهم" },
    sectionSubtitle: { ur: "کلیم آن لائن اکیڈمی کے فارغ التحصیل ملکی و بین الاقوامی طلبہ کے مستند تاثرات اور تعلیمی نتائج", en: "Verified learning outcomes from Kaleem Online Academy graduates across 25+ countries", ar: "تجارب موثقة ونتائج ملموسة لخريجي أكاديمية كليم العالمية للتعليم الإلكتروني حول العالم" },
    outcomeLabel: { ur: "حاصل شدہ تعلیمی نتیجہ:", en: "Documented Learning Outcome:", ar: "النتيجة العلمية المحققة:" },
    verifyBtn: { ur: "سند کی تصدیق کریں", en: "Verify Sanad", ar: "تحقق من السند" },
    enrollCta: { ur: "اپنی ون آن ون کلاس بُک کریں", en: "Start Your 1-on-1 Journey", ar: "ابدأ رحلتك التعليمية الآن" }
  },

  // Store
  store: {
    sectionTitle: { ur: "ڈیجیٹل بک اسٹور و تعلیمی پیکجز", en: "Interactive Digital Bookstore & Course Packs", ar: "المتجر الرقمي والحقائب التعليمية" },
    sectionSubtitle: { ur: "اپنی ضرورت کے مطابق مواد منتخب کریں، فوری بل بنوائیں اور ڈاؤن لوڈ کریں", en: "Select itemized study materials, get real-time invoice calculation & instant checkout", ar: "اختر ما يناسبك من المواد التعليمية بحرية مع حساب فوري للفاتورة" },
    selectItemsPrompt: { ur: "مطلوبہ مضامین / کتب پر نشان لگائیں (Checkboxes):", en: "Select items to purchase via checkboxes:", ar: "حدد المواد المطلوبة للشراء عبر المربعات:" },
    selectedTotal: { ur: "کل منتخب رقم:", en: "Selected Total Amount:", ar: "إجمالي المبلغ المحدد:" },
    itemCount: { ur: "منتخب اشیاء:", en: "Selected Items:", ar: "العناصر المحددة:" },
    buyNowBtn: { ur: "فوری خریداری و رسید بنائیں (Checkout)", en: "Buy Now & Generate Invoice", ar: "شراء الآن وإصدار الفاتورة" },
    clearSelection: { ur: "انتخاب ختم کریں", en: "Clear Selection", ar: "إلغاء التحديد" },
    includedLabel: { ur: "پیکج میں شامل ہے:", en: "Includes:", ar: "يشمل ما يلي:" }
  },

  // Publications
  publications: {
    sectionTitle: { ur: "تحقیقی مقالات، کتب و فتاویٰ", en: "Scholarly Publications, E-Books & Fatawa", ar: "البحوث العلمية والكتب والفتاوى" },
    sectionSubtitle: { ur: "مفتی دانش کلیم کے قلم سے مفت علمی رسائل اور تفصیلی فتاویٰ کا مجموعہ", en: "Free scholarly treatises, practical Tajweed charts, and formal legal verdicts", ar: "مؤلفات وبحوث وفتاوى شرعية موثقة متاحة للقراءة والتحميل مجاناً" },
    readOnline: { ur: "آن لائن مطالعہ کریں", en: "Read Online", ar: "قراءة أونلاين" },
    downloadPdf: { ur: "پی ڈی ایف ڈاؤن لوڈ (مفت)", en: "Download PDF (Free)", ar: "تحميل PDF (مجاناً)" },
    pagesLabel: { ur: "صفحات", en: "pages", ar: "صفحة" }
  },

  // Scholar Apps
  scholarApps: {
    sectionTitle: { ur: "محققین و علماء کے لیے مفید ریسرچ ٹولز", en: "Digital Scholar Research Tools & Lexicons", ar: "المحركات البحثية التراثية والمعاجم" },
    sectionSubtitle: { ur: "تخریجِ حدیث، امہات الکتب اور قرآنی اعراب کے مستند آن لائن مراکز", en: "Curated research portals for Hadith verification, classic manuscripts & syntax", ar: "دليل المواقع المعتمدة لتخريج الأحاديث وقراءة كتب التراث وإعراب القرآن" },
    openToolBtn: { ur: "ویب سائٹ کھولیں ↗", en: "Open Research Tool ↗", ar: "فتح الأداة البحثية ↗" }
  },

  // Payments
  payments: {
    sectionTitle: { ur: "فیس و ادائیگیاں (ملکی و بین الاقوامی)", en: "Tuition & Payment Gateways (Local & Overseas)", ar: "بوابات الدفع (المحلي والدولي)" },
    sectionSubtitle: { ur: "پاکستان کے اندر ایزی پیسہ، جاز کیش، سادہ پے، اور بیرونِ ملک طلبہ کے لیے کارڈ و وائز", en: "Domestic payments via EasyPaisa, JazzCash, SadaPay & Overseas via Cards/Wise", ar: "طرق دفع آمنة وسهلة داخل باكستان وللطلاب المغتربين حول العالم" },
    localTitle: { ur: "پاکستان کے اندر ادائیگیاں (Local Gateways)", en: "Domestic Gateways (Pakistan)", ar: "وسائل الدفع المحلية (باكستان)" },
    overseasTitle: { ur: "بیرونِ ملک طلبہ کے لیے (Overseas Students)", en: "Overseas & International Portal", ar: "الطلاب في الخارج والدولي" },
    copyBtn: { ur: "نمبر کاپی کریں", en: "Copy Number", ar: "نسخ الرقم" },
    copiedToast: { ur: "نمبر کامیابی سے کاپی ہو گیا!", en: "Copied to clipboard!", ar: "تم النسخ بنجاح!" },
    submitProofBtn: { ur: "ادائیگی کی رسید واٹس ایپ پر بھیجیں", en: "Send Payment Proof on WhatsApp", ar: "إرسال إشعار السداد عبر واتساب" }
  },

  // Modals & Enrollment
  enrollModal: {
    title: { ur: "داخلہ فارم (ون آن ون لائیو کلاس)", en: "Enrollment Form (1-on-1 Live Class)", ar: "استمارة التسجيل للحلقات الفردية" },
    fullName: { ur: "طالب علم کا مکمل نام *", en: "Student Full Name *", ar: "الاسم الكامل للطالب *" },
    fatherName: { ur: "والد کا نام *", en: "Father's Name *", ar: "اسم الوالد *" },
    countryCity: { ur: "ملک و شہر *", en: "Country & City *", ar: "الدولة والمدينة *" },
    whatsapp: { ur: "واٹس ایپ نمبر (مع ملکی کوڈ) *", en: "WhatsApp Number (with country code) *", ar: "رقم الواتساب (مع رمز الدولة) *" },
    email: { ur: "ای میل ایڈریس (اختیاری)", en: "Email Address (Optional)", ar: "البريد الإلكتروني (اختياري)" },
    preferredTime: { ur: "کلاس کا ترجیحی وقت *", en: "Preferred Class Timing *", ar: "الوقت المفضل للحصة *" },
    timeMorning: { ur: "صبح کا وقت (08:00 AM - 12:00 PM)", en: "Morning (08:00 AM - 12:00 PM)", ar: "صباحاً (08:00 ص - 12:00 م)" },
    timeAfternoon: { ur: "دوپہر کا وقت (01:00 PM - 05:00 PM)", en: "Afternoon (01:00 PM - 05:00 PM)", ar: "ظهراً (01:00 م - 05:00 م)" },
    timeEvening: { ur: "شام / رات کا وقت (06:00 PM - 10:30 PM)", en: "Evening / Night (06:00 PM - 10:30 PM)", ar: "مساءً (06:00 م - 10:30 م)" },
    frequency: { ur: "ہفتہ وار کلاسز", en: "Class Frequency", ar: "عدد الحصص الأسبوعية" },
    level: { ur: "سابقہ تعلیمی معیار", en: "Prior Knowledge Level", ar: "المستوى العلمي السابق" },
    notes: { ur: "کوئی خاص سوال یا پیغام", en: "Special Requests / Notes", ar: "ملاحظات أو طلبات خاصة" },
    submitBtn: { ur: "درخواست جمع کروائیں اور واٹس ایپ تصدیق حاصل کریں", en: "Submit Enrollment & Get WhatsApp Confirmation", ar: "إرسال طلب التسجيل وتأكيد الواتساب" },
    cancelBtn: { ur: "منسوخ کریں", en: "Cancel", ar: "إلغاء" }
  },

  // Live Class Box
  liveClassBanner: {
    title: { ur: "روزانہ کی لائیو کلاس لنک", en: "Daily Live Class Room", ar: "رابط الحصة المباشرة اليومية" },
    joinBtn: { ur: "کلاس روم میں داخل ہوں 🎥", en: "Enter Classroom 🎥", ar: "الدخول إلى القاعة 🎥" },
    passcodeLabel: { ur: "پاس کوڈ:", en: "Passcode:", ar: "رمز المرور:" },
    idLabel: { ur: "میٹنگ آئی ڈی:", en: "Meeting ID:", ar: "معرف الاجتماع:" }
  },

  // Footer & Policies
  footer: {
    rights: { ur: "تمام حقوق کلیم آن لائن اکیڈمی کے پاس محفوظ ہیں © 2026", en: "All Rights Reserved © 2026 Kaleem Online Academy", ar: "جميع الحقوق محفوظة لأكاديمية كليم العالمية للتعليم الإلكتروني © 2026" },
    terms: { ur: "شرائط و ضوابط", en: "Terms of Service", ar: "الشروط والأحكام" },
    privacy: { ur: "رازداری کی پالیسی", en: "Privacy Policy", ar: "سياسة الخصوصية" },
    refund: { ur: "واپسی کی پالیسی (Refund Policy)", en: "Refund Policy", ar: "سياسة الاسترجاع" },
    whatsappChat: { ur: "مفتی صاحب سے واٹس ایپ پر رابطہ کریں", en: "Chat with Mufti on WhatsApp", ar: "تواصل مع المفتي عبر الواتساب" }
  }
};
