import { Course, StoreItem, LiveClassLink, EnrollmentOrder, CertificateRecord, PaymentGateways, PublicationItem, MediaAdItem, ScholarApp, SiteSettings, NoticeBanner } from '../types';

export const INITIAL_POLICIES = {
  refund: {
    en: "30-Day Tuition Satisfaction Guarantee: At Al-Danish Online Islamic Academy, our mission is pure Islamic education with barakah. If any student or parent is dissatisfied with their initial 1-on-1 classes within the first 7 days (or first 3 lessons), they are entitled to a 100% full money-back refund without hassle.\n\n• Refund requests are processed via original gateway (EasyPaisa, JazzCash, Wise, PayPal) within 48 hours.\n• Digital downloadable packages (PDFs and audio files already opened) can be partially credited toward live classes.\n• Free make-up classes are offered if a session is missed due to power outage or teacher emergency.",
    ur: "30 روزہ اطمینان و فیس واپسی کی ضمانت: ادارہ دانش الاسلامی میں ہمارا نصب العین رضائے الٰہی اور معیاری دینی تعلیم ہے۔ اگر کوئی بھی طالب علم یا سرپرست پہلے 7 دنوں یا ابتدائی 3 اسباق کے دوران مطمئن نہ ہو، تو وہ بلا کسی کٹوتی کے اپنی 100 فیصد فیس واپسی کا مکمل حق رکھتا ہے۔\n\n• فیس واپسی کی درخواست 48 گھنٹوں کے اندر اسی اکاؤنٹ (ایزی پیسہ، جاز کیش، وائز یا پے پال) میں منتقل کر دی جاتی ہے۔\n• استاد کی علالت یا بجلی کی خرابی کی صورت میں متبادل کلاس بالکل مفت فراہم کی جاتی ہے۔",
    ar: "ضمان الرضا واسترجاع الرسوم خلال 30 يوماً: تهدف الأكاديمية إلى نشر العلم الشرعي ببركة وإخلاص. في حال عدم رغبة الطالب أو ولي أمره في الاستمرار خلال أول 7 أيام (أو أول 3 حصص)، يحق له استرداد كامل المبلغ المدفوع بنسبة 100% دون أي خصم.\n\n• تتم معالجة طلبات الاسترجاع خلال 48 ساعة عبر وسيلة الدفع الأصلية (وايز، باي بال، أو الحسابات المعتمدة).\n• تعويض أي حصة تعذر حضورها بسبب عطل تقني أو طارئ لدى المعلم مجاناً."
  },
  privacy: {
    en: "Privacy & Female Modesty Safeguards: Complete privacy for sisters and young learners. Classes for female students are strictly conducted by certified female scholars (Alimat/Qariyat) with audio-only or fully observed screen-sharing options.\n\n• Student contact numbers and recordings are encrypted and never shared with third parties.\n• Strict ethical Islamic supervision under Mufti Danish Kaleem.",
    ur: "حجاب و شرعی پردے کے خصوصی ضوابط: طالبات اور خواتین کے لیے مستند باحجاب معلمات اور قاریات کی زیرِ نگرانی خصوصی کلاسز کا انتظام ہے۔ ویڈیو آن کرنا لازمی نہیں، آڈیو یا اسکرین شیئر کے ذریعے مکمل رازداری کے ساتھ تدریس کی جاتی ہے۔\n\n• کسی بھی طالب علم کا ڈیٹا یا واٹس ایپ نمبر کسی غیر متعلقہ فرد کو نہیں دیا جاتا۔",
    ar: "سياسة الخصوصية والستر الشرعي: توفير معلمات مجازات للأخوات والفتيات الصغيرات مع الالتزام التام بآداب الحجاب الشرعي، والتعليم الصوتي أو عبر الشاشة المشتركة دون إلزام بفتح الكاميرا.\n\n• بيانات الطلاب وأرقام التواصل مشفرة ومحفوظة بسرية تامة تحت إشراف المشرف العام المفتي دانش كليم."
  },
  payment: {
    en: "Tuition & Fee Policy: Monthly fees are due on the 5th of each calendar month. We accept EasyPaisa, JazzCash, SadaPay, Bank Transfer, and Overseas payments via Wise, PayPal, and Debit/Credit Cards. Installment arrangements and need-based scholarships are available for deserving students.",
    ur: "ماہانہ تعلیمی فیس و ادائیگی ضوابط: ماہانہ فیس ہر ماہ کی 5 تاریخ تک ادا کی جاتی ہے۔ فیس کی منتقلی ایزی پیسہ، جاز کیش، سادا پے، بینک یا بیرونِ ملک سے وائز، پے پال اور کارڈ کے ذریعے ممکن ہے۔ مستحق طلبہ کے لیے خصوصی رعایت اور وظائف کی سہولت بھی موجود ہے۔",
    ar: "ضوابط الرسوم الدراسية وأوقات السداد: تستحق الرسوم الشهرية في الخامس من كل شهر ميلادي. تقبل الأكاديمية التحويل عبر إيزي بيزا، وجاز كاش، والتحويلات الدولية عبر وايز، وباي بال، والبطاقات الائتمانية مع توفر منح دراسية للمتعثرين."
  },
  terms: {
    en: "Terms of Service & Code of Conduct: Mutual respect, punctual attendance, and dedication to the Holy Quran and sacred sciences are expected from every enrolled student. Students should join the Zoom session 5 minutes prior to class time with required textbooks.",
    ur: "قواعد و ضوابطِ داخلہ: کلاس کے مقررہ وقت کی پابندی، استاد کا احترام اور کتب کا پیشگی مطالعہ ضروری ہے۔ طالب علم کو کلاس شروع ہونے سے 5 منٹ قبل زوم روم میں داخل ہونا چاہیے۔",
    ar: "شروط الخدمة والميثاق الأخلاقي: الالتزام بآداب طلب العلم الشرعي وتوقير المعلمين والمحافظة على مواعيد الحصص المباشرة عبر الزوم، والتواجد قبل بدء الحصة بخمس دقائق."
  }
};

export const INITIAL_SETTINGS: SiteSettings = {
  siteTitle: {
    ur: "ادارہ دانش برائے تعلیماتِ اسلامیہ و علومِ عربیہ",
    en: "Al-Danish Online Islamic & Arabic Academy",
    ar: "أكاديمية الدانش العالمية للعلوم الإسلامية واللغة العربية"
  },
  tagline: {
    ur: "مستند علمائے کرام کے زیرِ سرپرستی تجوید، عربی گرائمر، حدیث و فقہ کی مستند 1-on-1 آن لائن تدریس",
    en: "Authentic 1-on-1 Online Islamic & Arabic Learning guided by Certified Scholars",
    ar: "تعليم فردي مباشر في التجويد، والنحو والصرف، والحديث الشريف والفقه الإسلامي بأيدي علماء معتمدين"
  },
  founderName: {
    ur: "مفتی دانش کلیم صاحب (حفظہ اللہ)",
    en: "Mufti Danish Kaleem (Hafizahullah)",
    ar: "المفتي دانش كليم (حفظه الله تعالى)"
  },
  founderTitle: {
    ur: "فاضل درسِ نظامی، مفتی و محقق، استادِ علومِ عربیہ و فقہ",
    en: "Graduate of Dars-e-Nizami, Certified Mufti & Researcher in Islamic Jurisprudence & Classical Arabic",
    ar: "خريج الدرس النظامي، مفتٍ وباحث إسلامي، أستاذ العلوم الشرعية واللغة العربية"
  },
  founderBio: {
    ur: "مفتی دانش کلیم صاحب نے ممتاز دینی جامعات سے عالمیہ (مساوی ایم اے اسلامیات و عربی) اور تخصص فی الفقہ والافتاء کی تکمیل کی۔ گذشتہ 12 سال سے ملکی و غیر ملکی طلبہ کو تجوید، نحو، صرف، اور فقہ کے متون پڑھا رہے ہیں۔ آپ کا مشن مستند اسلامی علوم کو جدید طریقہ تدریس اور بین الاقوامی معیار کے مطابق گھر گھر پہنچانا ہے۔",
    en: "Mufti Danish Kaleem holds Shahadat-ul-Alimiyyah (MA Islamic Studies & Arabic equivalent) and a formal specialization in Islamic Jurisprudence & Ifta. For over 12 years, he has mentored hundreds of students worldwide in Quranic phonetics (Tajweed), Classical Arabic syntax (Nahw & Sarf), and Islamic law.",
    ar: "تخرج المفتي دانش كليم في كبريات الجامعات الإسلامية، وحصل على الشهادة العالِمية والتخصص في الفقه والإفتاء. قضى أكثر من 12 عاماً في تدريس القرآن الكريم وعلوم النحو والصرف والفقه لطلاب العلم حول العالم بأسلوب منهجي موثق."
  },
  founderImage: "/assets/aistudio/founder.jpg_450b2eb5.jpeg",
  founderExperience: {
    ur: "12+ سالہ تدریسی تجربہ (تجوید، نحو و فقہ)",
    en: "12+ Years Teaching Tajweed, Nahw & Fiqh",
    ar: "أكثر من 12 عاماً من التدريس الشرعي واللغوي"
  },
  primaryColor: "#064e3b",
  accentColor: "#d97706",
  adminPassword: "admin123",
  whatsappNumber: "+923001234567",
  contactEmail: "info@aldanish-academy.edu",
  // Advanced Theme & Background Controls
  navbarBg: "#064e3b",
  pageBg: "#0c0a09",
  cardBg: "#1c1917",
  cardBorder: "#d97706",
  textColor: "#f5f5f4",
  policies: INITIAL_POLICIES,
  activeSections: {
    hero: true,
    founder: true,
    courses: true,
    store: true,
    publications: true,
    mediaAds: true,
    scholarApps: true,
    payments: true,
    policies: true
  }
};

export const INITIAL_NOTICE: NoticeBanner = {
  enabled: true,
  urgentLevel: "urgent",
  badge: {
    ur: "اہم اعلانیہ",
    en: "Special Notice",
    ar: "إعلان عاجل"
  },
  text: {
    ur: "رمضان المبارک اور نئے سمسٹر کے لیے ون آن ون تجوید اور عربی گرائمر کلاسز کے داخلے جاری ہیں! محدود نشستیں دستیاب ہیں۔",
    en: "Admissions open for 1-on-1 Live Tajweed & Classical Arabic Grammar for the new semester! Limited slots available.",
    ar: "فتح باب التسجيل للحلقات الفردية المباشرة في التجويد المتقن وقواعد اللغة العربية للفصل الجديد!"
  },
  linkText: {
    ur: "ابھی سیٹ بک کریں",
    en: "Book Slot Now",
    ar: "احجز مقعدك الآن"
  },
  linkUrl: "#courses"
};

export const INITIAL_COURSES: Course[] = [
  {
    id: "tajweed-basics-adv",
    title: {
      ur: "جامع کورس تجوید و ترتیل القرآن (مبتدی تا متقدم)",
      en: "Comprehensive Tajweed & Quranic Phonetics (Beginner to Advanced)",
      ar: "دورة تجويد وترتيل القرآن الكريم من الصفر إلى الإتقان"
    },
    category: "tajweed",
    description: {
      ur: "مخارج الحروف، صفاتِ لازمہ و عارضہ، احکامِ نون ساکن و تنوین، مدود اور وقف و ابتدا کی مکمل عملی مشق مع انفرادی اصلاح۔",
      en: "Master Quranic articulation points (Makharij), phonetic attributes (Sifat), rules of Nun Sakinah, Madd, and Waqf with personal live 1-on-1 correction.",
      ar: "دراسة مخارج الحروف وصفاتها وأحكام النون والميم الساكنتين والمدود مع التطبيق العملي والمتابعة الفردية الدقيقة."
    },
    feeMonthlyPKR: 4500,
    feeUSD: 35,
    duration: {
      ur: "3 ماہ (36 انفرادی اسباق)",
      en: "3 Months (36 Live 1-on-1 Lessons)",
      ar: "3 أشهر (36 حصة فردية)"
    },
    classesPerWeek: 3,
    instructor: {
      ur: "مفتی دانش کلیم مع قراء کرام",
      en: "Mufti Danish Kaleem & Certified Qari",
      ar: "المفتي دانش كليم ونخبة من المقرئين"
    },
    level: "All Levels",
    features: [
      "1-on-1 Private Live Lessons on Zoom",
      "Flexible Timing (Morning/Evening)",
      "Daily Pronunciation Audio Review",
      "Official Verified Completion Certificate"
    ],
    isVisible: true,
    isPopular: true
  },
  {
    id: "arabic-nahw-sarf",
    title: {
      ur: "کلاسیکی و قرآنی عربی گرائمر (نحو و صرف کا مکمل نصاب)",
      en: "Classical & Quranic Arabic Grammar (Nahw & Sarf Mastery)",
      ar: "دورة النحو والصرف لفهم القرآن الكريم والكتب التراثية"
    },
    category: "arabic",
    description: {
      ur: "قرآنِ کریم اور احادیث کے الفاظ کا گہرائی سے مفہوم سمجھنے کے لیے آسان نحو، ترکیب اور گردانوں کی عملی مشق۔",
      en: "Learn Arabic syntax (Nahw) and morphological inflections (Sarf) using Quranic ayaat examples to understand the divine text directly without translation.",
      ar: "تأسيس راسخ في قواعد النحو وتصريف الأفعال مع التطبيق المباشر على الآيات القرآنية والأحاديث النبوية."
    },
    feeMonthlyPKR: 5000,
    feeUSD: 40,
    duration: {
      ur: "4 ماہ (48 انفرادی اسباق)",
      en: "4 Months (48 Sessions)",
      ar: "4 أشهر (48 حصة)"
    },
    classesPerWeek: 3,
    instructor: {
      ur: "مفتی دانش کلیم صاحب",
      en: "Mufti Danish Kaleem",
      ar: "المفتي دانش كليم"
    },
    level: "Intermediate",
    features: [
      "Direct grammatical analysis of Surahs",
      "Custom Printable Cheat Sheets & Tables",
      "Weekly Syntax Quizzes & Assignments",
      "Permanent Session Recordings"
    ],
    isVisible: true,
    isPopular: true
  },
  {
    id: "hadith-fiqh-essentials",
    title: {
      ur: "فقہ و حدیث کورس (طہارت، نماز، زکوۃ، تجارت و روزمرہ مسائل)",
      en: "Hadith & Fiqh Essentials (Taharah, Salah, Zakat & Daily Rulings)",
      ar: "دورة الفقه الإسلامي ومعالم السنة النبوية المطهرة"
    },
    category: "hadith_fiqh",
    description: {
      ur: "اربعین نووی اور نور الایضاح / قدوری کے اہم ابواب کی تدریس مع دورِ حاضر کے جدید فقہی مسائل اور فتاویٰ کے اصول۔",
      en: "Study classical legal texts along with 40 Hadith Nawawi, addressing contemporary issues: halal transactions, digital finance, medical fiqh, and worship.",
      ar: "شرح أصول العبادات والمعاملات المالية المعاصرة ومسائل الطهارة والصلاة مع أدلتها من الكتاب والسنة."
    },
    feeMonthlyPKR: 4000,
    feeUSD: 30,
    duration: {
      ur: "3 ماہ (24 اسباق)",
      en: "3 Months (24 Lessons)",
      ar: "3 أشهر (24 حصة)"
    },
    classesPerWeek: 2,
    instructor: {
      ur: "مفتی دانش کلیم صاحب",
      en: "Mufti Danish Kaleem",
      ar: "المفتي دانش كليم"
    },
    level: "All Levels",
    features: [
      "Contemporary Case Studies & Fatawa",
      "Direct Question & Answer Session",
      "PDF Summary Notes in Urdu & English",
      "Ijazah Certificate upon Exam"
    ],
    isVisible: true
  },
  {
    id: "tafseer-tadabbur",
    title: {
      ur: "فہمِ قرآن و تدبر کورس (لفظی و بامحاورہ ترجمہ مع شانِ نزول)",
      en: "Tafseer & Quranic Contemplation (Word-by-word & Exegesis)",
      ar: "دورة التفسير وتدبر معاني القرآن الكريم وأسباب النزول"
    },
    category: "tafseer",
    description: {
      ur: "منتخب سورتوں کا فصیح لفظی ترجمہ، شانِ نزول، اور عصرِ حاضر میں قرآنی ہدایات پر عمل کا لائحہ عمل۔",
      en: "In-depth study of selected chapters, context of revelation (Asbab al-Nuzul), thematic coherence, and spiritual takeaways.",
      ar: "دراسة بيانية وتدبرية لآيات التنزيل مع استخلاص الهدايات الإيمانية والأخلاقية للحياة المعاصرة."
    },
    feeMonthlyPKR: 4200,
    feeUSD: 32,
    duration: {
      ur: "3 ماہ (36 اسباق)",
      en: "3 Months (36 Sessions)",
      ar: "3 أشهر (36 حصة)"
    },
    classesPerWeek: 3,
    instructor: {
      ur: "مفتی دانش کلیم مع اساتذہ",
      en: "Mufti Danish Kaleem & Faculty",
      ar: "المفتي دانش كليم وهيئة التدريس"
    },
    level: "Beginner",
    features: [
      "Word-by-word root meaning charts",
      "Audio recitation with translation",
      "Dedicated doubt-clearing sessions"
    ],
    isVisible: true
  },
  {
    id: "hifz-quran-revision",
    title: {
      ur: "حفظ القرآن الکریم مع دَور و تکرار (انفرادی رہنمائی)",
      en: "Quran Hifz (Memorization) & Daily Muraja'ah Mentorship",
      ar: "برنامج حفظ القرآن الكريم والمراجعة الفردية اليومية المكثفة"
    },
    category: "hifz",
    description: {
      ur: "سبق، سبقی اور منزل کی روزانہ مستند حافظ و قاری کو سنانے کا جامع انفرادی نظام مع حفظ کے نفسیاتی و عملی اصول۔",
      en: "Personalized 1-on-1 daily recitation schedule (Sabaq, Sabqi, Manzil) with certified Huffaz and memory retention drills.",
      ar: "منهج فردي متقن لحفظ كتاب الله ومراجعته اليومية مع الضبط المتقن والمتشابهات اللفظية."
    },
    feeMonthlyPKR: 5500,
    feeUSD: 42,
    duration: {
      ur: "جاری نصاب (ماہانہ شیڈول)",
      en: "Ongoing Monthly Mentorship (5 Days/Week)",
      ar: "برنامج مستمر (5 أيام في الأسبوع)"
    },
    classesPerWeek: 5,
    instructor: {
      ur: "مفتی دانش کلیم و حفاظ کرام",
      en: "Mufti Danish Kaleem & Senior Huffaz",
      ar: "المفتي دانش كليم ونخبة من الحفاظ المتقنين"
    },
    level: "All Levels",
    features: [
      "Daily 30-minute 1-on-1 dedicated session",
      "Weekly Manzil Revision Exams",
      "Mutashabihat (Similar Verses) Mastery",
      "Monthly Parent Progress Report Card"
    ],
    isVisible: true,
    isPopular: true
  },
  {
    id: "qirat-sabaa-sanad",
    title: {
      ur: "قراءاتِ سبعہ و عشرہ صغریٰ مع اجازہ و سندِ متصل",
      en: "The Seven Qira'at & Classical Quranic Recitation Styles",
      ar: "دورة القراءات السبع المتواترة والإجازة بالسند المتصل"
    },
    category: "qirat",
    description: {
      ur: "روایتِ حفص، ورش، قالون، اور دوری کے اصول و فرش الحروف کا تقابلی مطالعہ مع سندِ متصل کی تیاری۔",
      en: "Comparative study of Hafs, Warsh, Qalun, and Ad-Duri riwayahs with authentic connected chains of transmission (Sanad).",
      ar: "دراسة روايات حفص وورش وقالون والدوري مع الأصول والفرش وإمكانية نيل السند المتصل."
    },
    feeMonthlyPKR: 6000,
    feeUSD: 48,
    duration: {
      ur: "6 ماہ (72 اسباق)",
      en: "6 Months (72 Lessons)",
      ar: "6 أشهر (72 حصة)"
    },
    classesPerWeek: 3,
    instructor: {
      ur: "مفتی دانش کلیم مع قراءِ سبعہ",
      en: "Mufti Danish Kaleem & Master Qari",
      ar: "المفتي دانش كليم وشيوخ الإقراء"
    },
    level: "Advanced",
    features: [
      "Authentic Matn ash-Shatibiyyah Analysis",
      "Comparative Recitation Rules Drill",
      "Oral Exam & Sanad Certification"
    ],
    isVisible: true
  }
];

export const INITIAL_STORE_ITEMS: StoreItem[] = [
  {
    id: "full-academy-package",
    title: {
      ur: "مکمل ریکارڈڈ کورس پیکج مع لائف ٹائم ایکسیس",
      en: "Full Recorded Course Package (Lifetime Access)",
      ar: "الحزمة الشاملة للدورات المسجلة مدى الحياة"
    },
    category: "package",
    pricePKR: 2500,
    priceUSD: 18,
    description: {
      ur: "تمام ویڈیو اسباق، تمام کتب پی ڈی ایف، حل شدہ امتحانات، اور آڈیو ڈرلز کا مکمل ڈیجیٹل مجموعہ۔",
      en: "Complete bundle including 45+ HD video modules, all PDF student workbooks, audio drills, and revision sheets.",
      ar: "الحقيبة التعليمية الكاملة: جميع المقاطع المرئية عالية الدقة، والكتب المنهجية، والتسجيلات الصوتية."
    },
    includes: [
      "45+ HD Video Lessons (Tajweed & Nahw)",
      "Complete 5 E-Books (PDF)",
      "Audio Pronunciation Master Bank",
      "Direct Support Ticket in Portal"
    ],
    formatBadge: "Full Digital Bundle",
    badgeColor: "bg-amber-600 text-white",
    isVisible: true
  },
  {
    id: "single-video-lesson-module",
    title: {
      ur: "سنگل ویڈیو سبق ماڈیول (مخصوص موضوعی لیکچر)",
      en: "Single Specialized Video Lesson Module",
      ar: "محاضرة مرئية تخصصية مفردة عالية الدقة"
    },
    category: "video",
    pricePKR: 500,
    priceUSD: 4,
    description: {
      ur: "مخصوص پیچیدہ قواعد جیسے مخارج، صفات، یا نحوی ترکیبات پر مفصل ویڈیو لیکچر۔",
      en: "Focused deep-dive lesson on specific topics such as advanced Makharij, I'rab analysis, or Zakat calculation.",
      ar: "درس مرئي مخصص يركز على مسألة بعينها كالمخارج أو الإعراب التفصيلي مع تمارين عملية."
    },
    includes: [
      "1x High-Resolution 60-min Lecture",
      "Topic Cheat Sheet & Exercise Sheet",
      "Self-Assessment Quiz"
    ],
    formatBadge: "HD Video + Quiz",
    badgeColor: "bg-emerald-600 text-white",
    isVisible: true
  },
  {
    id: "pdf-handwritten-notes",
    title: {
      ur: "مفتی صاحب کے دستخط شدہ کتب و نوٹس پی ڈی ایف",
      en: "Illustrated PDF Workbooks & Handwritten Scholar Notes",
      ar: "حقيبة المذكرات المكتوبة والكتب المنهجية PDF"
    },
    category: "pdf",
    pricePKR: 800,
    priceUSD: 6,
    description: {
      ur: "نحو، صرف اور تجوید کی دلکش رنگین ڈایاگرامز، کلر کوڈڈ رولز اور خلاصہ جات پر مشتمل 180 صفحات کی ای بک۔",
      en: "180+ page color-coded study guide with syntax diagrams, inflection matrices, and Tajweed visual charts.",
      ar: "كتاب منهجي ملون ومنسق بدقة يشمل جداول الإعراب ومخططات التجويد في 180 صفحة قابلة للطباعة."
    },
    includes: [
      "High-Res Printable PDF (180 pages)",
      "Color-Coded Tajweed Maps",
      "Arabic Inflection Tables (Tasreef)"
    ],
    formatBadge: "Printable E-Book",
    badgeColor: "bg-teal-700 text-white",
    isVisible: true
  },
  {
    id: "audio-drills-makharij",
    title: {
      ur: "عملی آڈیو مشقیں و صوتی تراکیب (مخارج و صفات)",
      en: "High-Fidelity Audio Pronunciation Master Collection",
      ar: "التسجيلات الصوتية النموذجية لتدريب المخارج والنطق"
    },
    category: "audio",
    pricePKR: 400,
    priceUSD: 3,
    description: {
      ur: "ہر ہر حرف کی صحیح ادائیگی اور باریک اور پر حروف کے موازنے کی اسٹوڈیو ریکارڈ شدہ 100+ آڈیو کلپس۔",
      en: "Over 100 studio-recorded audio clips breaking down difficult Arabic sounds (ع, ح, ص, ض, ط, ظ) with repetition gaps.",
      ar: "أكثر من 100 تسجيل صوتي نقي لتدريب اللسان على مخارج الحروف الصحيحة مع فواصل للمحاكاة."
    },
    includes: [
      "100+ Studio MP3 Audio Tracks",
      "Comparison Drills (Light vs Heavy letters)",
      "Mobile Friendly Playback"
    ],
    formatBadge: "Studio Audio Pack",
    badgeColor: "bg-indigo-700 text-white",
    isVisible: true
  },
  {
    id: "scholar-1on1-consultation",
    title: {
      ur: "مفتی دانش کلیم کے ساتھ 1-on-1 مشاورتی و اصلاحی سیشن",
      en: "1-on-1 Scholar Mentorship & Evaluation Session (45 min)",
      ar: "جلسة إرشاد واختبار فردي مع المفتي دانش كليم (45 دقيقة)"
    },
    category: "session",
    pricePKR: 1200,
    priceUSD: 10,
    description: {
      ur: "براہِ راست مفتی صاحب کے روبرو تلاوت سنانا، سوال و جواب یا ذاتی مطالعاتی رہنمائی حاصل کرنا۔",
      en: "Direct private video call with Mufti Danish Kaleem for Quranic recitation evaluation, personal study plan, or fiqh query.",
      ar: "جلسة افتراضية خاصة لتقييم التلاوة وتقديم خطة تعليمية مخصصة أو الإجابة على الاستفسارات الفقهية."
    },
    includes: [
      "45-minute Private Live Zoom Call",
      "Personalized Recitation Diagnostic Report",
      "Direct Scholarly Answers to 3 Personal Questions"
    ],
    formatBadge: "Live 1-on-1 Call",
    badgeColor: "bg-rose-700 text-white",
    isVisible: true
  }
];

export const INITIAL_LIVE_CLASS: LiveClassLink = {
  platform: "Zoom",
  meetingUrl: "https://zoom.us/j/8492048192?pwd=Q0FESTFBU2NlT2xhRElQMWV4UT09",
  meetingId: "849 204 8192",
  passcode: "DANISH786",
  scheduleText: {
    ur: "روزانہ شام 07:00 بجے تا 08:30 بجے (پاکستانی وقت) - برائے رجسٹرڈ طلبہ",
    en: "Daily 07:00 PM - 08:30 PM PKT (Pakistan Standard Time) - Registered Students",
    ar: "يومياً من الساعة 07:00 مساءً حتى 08:30 مساءً بتوقيت مكة المكرمة"
  },
  accessRestriction: "enrolled_only",
  lastUpdated: "Today at 06:15 PM"
};

export const INITIAL_ORDERS: EnrollmentOrder[] = [
  {
    id: "ENR-2026-1082",
    studentName: "Muhammad Abdullah",
    fatherName: "Tariq Mahmood",
    countryCity: "Lahore, Pakistan",
    whatsapp: "+923214567890",
    email: "abdullah.tariq@gmail.com",
    type: "live_course",
    courseOrItemTitle: "Comprehensive Tajweed & Quranic Phonetics",
    preferredTime: "evening",
    classFrequency: "3 days / week",
    knowledgeLevel: "Beginner",
    totalAmountPKR: 4500,
    paymentMethod: "easypaisa",
    paymentStatus: "Approved",
    transactionId: "EP-8924194021",
    createdAt: "2026-10-18 14:30"
  },
  {
    id: "ORD-2026-1083",
    studentName: "Fatima Zahra",
    fatherName: "Abdul Rasheed",
    countryCity: "Karachi, Pakistan",
    whatsapp: "+923009876543",
    email: "fatima.z@outlook.com",
    type: "store_purchase",
    courseOrItemTitle: "Full Recorded Course Package + PDF Notes",
    selectedStoreItems: [
      { id: "full-academy-package", title: "Full Recorded Course Package", pricePKR: 2500 },
      { id: "pdf-handwritten-notes", title: "Illustrated PDF Workbooks", pricePKR: 800 }
    ],
    preferredTime: "morning",
    totalAmountPKR: 3300,
    paymentMethod: "jazzcash",
    paymentStatus: "Pending",
    transactionId: "JC-4029104",
    createdAt: "2026-10-18 16:10"
  },
  {
    id: "ENR-2026-1084",
    studentName: "Bilal Ahmad",
    fatherName: "Nazeer Ahmad",
    countryCity: "Birmingham, United Kingdom",
    whatsapp: "+447911123456",
    email: "bilal.ahmad@ukmail.co.uk",
    type: "live_course",
    courseOrItemTitle: "Classical & Quranic Arabic Grammar (Nahw & Sarf)",
    preferredTime: "evening",
    classFrequency: "Weekend intensive",
    knowledgeLevel: "Intermediate",
    totalAmountPKR: 5000,
    paymentMethod: "wise_paypal",
    paymentStatus: "Approved",
    transactionId: "WISE-UK-88412",
    createdAt: "2026-10-18 17:45"
  }
];

export const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: "cert-001",
    certNumber: "AD-CERT-2026-8841",
    enrollmentNo: "ENR-2026-1082",
    studentName: "Muhammad Abdullah",
    fatherName: "Tariq Mahmood",
    courseName: "Comprehensive Tajweed & Quranic Phonetics",
    grade: "Mumtaz (Distinction - 96%)",
    issueDate: "October 10, 2026",
    issuedBy: "Mufti Danish Kaleem",
    verificationCode: "VER-AD-8841"
  },
  {
    id: "cert-002",
    certNumber: "AD-CERT-2026-8842",
    enrollmentNo: "ENR-2026-1084",
    studentName: "Bilal Ahmad",
    fatherName: "Nazeer Ahmad",
    courseName: "Classical & Quranic Arabic Grammar (Nahw & Sarf)",
    grade: "Jayyid Jiddan (Very Good - 92%)",
    issueDate: "October 14, 2026",
    issuedBy: "Mufti Danish Kaleem",
    verificationCode: "VER-AD-8842"
  },
  {
    id: "cert-003",
    certNumber: "AD-CERT-2026-8843",
    enrollmentNo: "AD-ENR-2026-8841",
    studentName: "Zainab Bint Khalid",
    fatherName: "Khalid Mansoor",
    courseName: "Classical Arabic Grammar (Nahw & Sarf Level 1)",
    grade: "Mumtaz (Distinction - 94%)",
    issueDate: "October 16, 2026",
    issuedBy: "Mufti Danish Kaleem",
    verificationCode: "VER-AD-8843"
  }
];

export const INITIAL_PAYMENTS: PaymentGateways = {
  easypaisa: {
    accountTitle: "Danish Kaleem",
    accountNumber: "0300-1234567",
    instructions: {
      ur: "ایزی پیسہ ایپ کھولیں -> ایزی پیسہ ٹرانسفر -> موبائل نمبر درج کریں -> ٹرانزیکشن رسید کا سکرین شاٹ واٹس ایپ کریں۔",
      en: "Open EasyPaisa App -> EasyPaisa Transfer -> Enter mobile number -> Share screenshot on WhatsApp.",
      ar: "قم بالتحويل عبر تطبيق إيزي بيزا وأرسل صورة الإشعار عبر الواتساب."
    }
  },
  jazzcash: {
    accountTitle: "Danish Kaleem",
    accountNumber: "0301-7654321",
    instructions: {
      ur: "جاز کیش ایپ یا *786# ملائیں -> اکاؤنٹ ٹو اکاؤنٹ ٹرانسفر کریں -> رسید محفوظ رکھیں۔",
      en: "Open JazzCash App or dial *786# -> Transfer to Mobile Account -> Save transaction ID.",
      ar: "التحويل المباشر عبر حساب جاز كاش وإرسال رمز العملية."
    }
  },
  sadapay: {
    accountTitle: "Mufti Danish Kaleem",
    accountNumber: "0300-1234567",
    iban: "PK72SADA0000001234567890"
  },
  bank: {
    bankName: "Meezan Islamic Bank Ltd.",
    accountTitle: "Al-Danish Islamic Academy",
    accountNumber: "0102030405060708",
    iban: "PK36MEZN0001020304050608",
    branchCode: "0102 (Gulberg Lahore Branch)"
  },
  overseas: {
    wiseEmail: "danish.academy@wise-pay.com",
    wiseAccountTitle: "Mufti Danish Kaleem",
    paypalEmail: "payments@aldanish-academy.edu",
    paypalMeLink: "https://paypal.me/aldanishacademy",
    westernUnionName: "Mufti Danish Kaleem (CNIC/Passport: 35201-XXXXXXX-X, Lahore, Pakistan)",
    bankSwift: "MEZNPKKAXXX",
    internationalIban: "PK36MEZN0001020304050608",
    cardPortalUrl: "https://buy.stripe.com/aldanish_academy_portal",
    instructions: {
      ur: "بین الاقوامی طلبہ ویزا/ماسٹر کارڈ، Wise (کم ترین ٹرانسفر فیس)، یا پے پال کے ذریعے فوری ادائیگی کر سکتے ہیں۔ ادائیگی کے بعد رسید کا اسکرین شاٹ واٹس ایپ پر ارسال فرمائیں۔",
      en: "International students can pay seamlessly via Wise (lowest conversion fee), PayPal, Debit/Credit Card (Stripe), or Western Union. An official receipt is automatically generated upon transfer.",
      ar: "يمكن للطلاب المغتربين والمسجلين من الخارج السداد الفوري عبر وايز، أو باي بال، أو بطاقات فيزا/ماستركارد، أو ويسترن يونيون مع توثيق الفاتورة فوراً."
    }
  }
};

export const INITIAL_PUBLICATIONS: PublicationItem[] = [
  {
    id: "pub-01",
    title: {
      ur: "احکامِ تجوید کا خلاصہ و عملی رہنما (مخارج و صفات کا تقابلی جائزہ)",
      en: "Concise Compendium of Quranic Phonetics & Tajweed Rules",
      ar: "خلاصة أحكام التجويد ودليل التدريب العملي على المخارج والصفات"
    },
    category: {
      ur: "علوم القرآن و تجوید",
      en: "Quranic Sciences & Tajweed",
      ar: "علوم القرآن والتجويد"
    },
    author: {
      ur: "تحقیق: مفتی دانش کلیم",
      en: "Authored by: Mufti Danish Kaleem",
      ar: "تأليف وبحث: المفتي دانش كليم"
    },
    pages: 48,
    summary: {
      ur: "ایک جامع تحقیقی رسالہ جس میں نون ساکن و تنوین کے چاروں احکام، مخارجِ حروف کی تشریحی ڈایاگرامز اور عموماً ہونے والی غلطیوں کی نشان دہی کی گئی ہے۔",
      en: "An accessible scholarly treatise covering articulatory points of the tongue, rules of Idgham, Ikhfa, and common recitation pitfalls.",
      ar: "رسالة بحثية ميسرة تشرح بدقة أحكام النون الساكنة والتنوين مع مخططات دقيقة للمخارج والصفات ومواضع اللحن الخفي."
    },
    fullExcerpt: "بسم الله الرحمن الرحيم. إن علم التجويد من أشرف العلوم الشرعية لتعلقه بكتاب الله تعالى...",
    downloadFilename: "Ahkam-e-Tajweed-Danish-Kaleem.pdf"
  },
  {
    id: "pub-02",
    title: {
      ur: "تسہیل النحو و اعراب القرآن (قرآنی مثالوں سے نحو سیکھیں)",
      en: "Facilitating Arabic Syntax Through Quranic Verses",
      ar: "تسهيل النحو وإعراب الآيات القرآنية للمبتدئين"
    },
    category: {
      ur: "لسانیات و عربی گرائمر",
      en: "Arabic Linguistics & Grammar",
      ar: "النحو واللغة العربية"
    },
    author: {
      ur: "مفتی دانش کلیم",
      en: "Mufti Danish Kaleem",
      ar: "المفتي دانش كليم"
    },
    pages: 92,
    summary: {
      ur: "مبتدی طلبہ کے لیے نحو کے پیچیدہ مسائل کو آسان انداز میں قرآنی آیات کی ترکیبی مشقوں کے ساتھ مرتب کیا گیا ہے۔",
      en: "Step-by-step workbook demystifying grammatical cases (Marfoo'at, Mansubat, Majroorat) using direct Quranic sentences.",
      ar: "كتاب منهجي يعالج قواعد الإعراب الصعبة بأسلوب مبسط تطبيقي على آيات الذكر الحكيم."
    },
    fullExcerpt: "الكلام في اصطلاح النحويين هو اللفظ المركب المفيد بالوضع، وأقسامه ثلاثة: اسم وفعل وحرف...",
    downloadFilename: "Tasheel-un-Nahw-Quranic-Method.pdf"
  },
  {
    id: "pub-03",
    title: {
      ur: "دورِ حاضر میں ڈیجیٹل کرنسی، کرپٹو اور آن لائن ٹریڈنگ کی شرعی حیثیت",
      en: "Islamic Legal Rulings on Digital Currencies & Online Forex Trading",
      ar: "الحكم الشرعي في العملات الرقمية والتداول الإلكتروني المعاصر"
    },
    category: {
      ur: "جدید فقہی مسائل و فتاویٰ",
      en: "Contemporary Fiqh & Fatawa",
      ar: "الفقه المعاصر وفتاوى المعاملات"
    },
    author: {
      ur: "دار الافتاء: مفتی دانش کلیم",
      en: "Dar-ul-Ifta: Mufti Danish Kaleem",
      ar: "دار الإفتاء: المفتي دانش كليم"
    },
    pages: 36,
    summary: {
      ur: "جدید معاشی معاملات، فیوچر ٹریڈنگ، فاریکس، اور ڈیجیٹل کوائنز کے بارے میں قرآن و سنت اور فقہائے احناف کے اقوال کی روشنی میں تفصیلی فتویٰ۔",
      en: "Detailed jurisprudential analysis examining decentralized tokens, leverage trading, and conditions for valid spot transactions in Islamic law.",
      ar: "دراسة فقهية مقارنة تبحث في شروط القبض الشرعي والربا والغرر في المعاملات المالية الحديثة."
    },
    fullExcerpt: "الحمد لله رب العالمين، والصلاة والسلام على خاتم النبيين. أما بعد: فقد ورد إلى دار الإفتاء أسئلة عديدة بخصوص العملات المشفرة...",
    downloadFilename: "Digital-Currency-Shariah-Ruling-Mufti-Danish.pdf",
    isFatawa: true
  }
];

export const INITIAL_MEDIA_ADS: MediaAdItem[] = [
  {
    id: "ad-01",
    title: {
      ur: "نئے آن لائن بیچ کا آغاز: ون آن ون تجوید کلاسز",
      en: "New Batch Announcement: 1-on-1 Quran Tajweed Live Sessions",
      ar: "إعلان انطلاق الدفعة الجديدة: حلقات الإتقان الفردية المباشرة"
    },
    type: "poster",
    mediaUrl: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
    badge: {
      ur: "داخلے کھلے ہیں",
      en: "Admissions Open",
      ar: "التسجيل متاح الآن"
    },
    description: {
      ur: "ہر عمر کے افراد (بچوں اور بڑوں) کے لیے خصوصی انفرادی اوقات۔ مکمل رازداری کے ساتھ خواتین کے لیے باحجاب معلمات کی سہولت۔",
      en: "Custom scheduling for kids, professionals, and adults. Qualified female teachers available for sisters in strict accordance with Islamic modesty.",
      ar: "أوقات مرنة تناسب الجميع مع توفر معلمات مجازات للأخوات في بيئة تعليمية خاصة ومحافظة."
    },
    ctaText: {
      ur: "سیٹ محفوظ کریں",
      en: "Reserve Seat",
      ar: "احجز مقعدك"
    },
    ctaLink: "#courses",
    isVisible: true
  },
  {
    id: "ad-02",
    title: {
      ur: "خصوصی تعارفی ویڈیو: قرآن فہمی کے لیے عربی گرامر کی اہمیت",
      en: "Video Lecture: Why Arabic Grammar is Essential to Understand the Quran",
      ar: "محاضرة مرئية: أثر علم النحو في تذوق بلاغة القرآن الكريم"
    },
    type: "video",
    mediaUrl: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=80",
    badge: {
      ur: "ویڈیو کلپ",
      en: "Featured Video",
      ar: "فيديو توضيحي"
    },
    description: {
      ur: "مفتی دانش کلیم صاحب کا خصوصی بیان کہ کیسے صرف 3 ماہ کی مشق سے ایک طالب علم قرآنِ مجید کے 80 فیصد الفاظ کا ترجمہ سمجھ سکتا ہے۔",
      en: "Special lecture by Mufti Danish Kaleem outlining the methodology to decode over 80% of Quranic vocabulary in just 90 days.",
      ar: "شرح وافٍ من المفتي دانش كليم حول كيفية فهم 80% من ألفاظ القرآن من خلال دراسة الأسس الصرفية والنحوية."
    },
    ctaText: {
      ur: "ابھی دیکھیں",
      en: "Watch Lecture",
      ar: "مشاهدة المقطع"
    },
    ctaLink: "#store",
    isVisible: true
  }
];

export const SCHOLAR_APPS: ScholarApp[] = [
  {
    id: "hadith-search",
    name: {
      ur: "الباحث الحدیثی (تخریج و تحقیقِ احادیث)",
      en: "Al-Bahith Al-Hadithii (Hadith Verification)",
      ar: "الباحث الحديثي (المحرك المتقدم لتخريج الأحاديث)"
    },
    arabicName: "الباحث الحديثي",
    description: {
      ur: "احادیث کے الفاظ، اسانید، صحت و سقم اور تخریجِ احادیث کی تحقیق کے لیے دنیا کا سب سے معتبر اور تیز ترین ریسرچ انجن۔",
      en: "The world's premier Hadith search engine to authenticate chains of narration, source books, and grading of narrations.",
      ar: "محرك البحث الأسرع للتحقق من صحة الأحاديث وتخريجها والحكم عليها من أقوال أئمة الجرح والتعديل."
    },
    url: "https://dorar.net/hadith",
    badge: "Hadith Verification",
    tags: ["Authentic Hadith", "Isnad", "Takhreej"]
  },
  {
    id: "maktaba-shamela",
    name: {
      ur: "المکتبۃ الشاملۃ (ڈیجیٹل اسلامی لائبریری)",
      en: "Al-Maktaba Al-Shamela (The Islamic Encyclopedia)",
      ar: "المكتبة الشاملة (أكبر مستودع رقمي لكتب التراث)"
    },
    arabicName: "المكتبة الشاملة",
    description: {
      ur: "7000 سے زائد امہات الکتب، تفاسیر، فقہِ اربعہ، اصول اور لغاتِ عربیہ کی تلاش اور مطالعے کا سب سے بڑا ڈیجیٹل مرکز۔",
      en: "Over 7,000 classical Islamic manuscripts and reference books spanning Tafseer, Hadith commentaries, and comparative Fiqh.",
      ar: "موسوعة إلكترونية ضخمة تضم آلاف المجلدات التراثية في التفسير والفقه والعقيدة وعلوم اللسان."
    },
    url: "https://shamela.ws",
    badge: "7,000+ Classic Books",
    tags: ["Tafseer", "Fiqh", "Manuscripts"]
  },
  {
    id: "almaany-dict",
    name: {
      ur: "قاموس المعانی (عربی، اردو، انگریزی ڈکشنری)",
      en: "Almaany Comprehensive Arabic-Urdu-English Lexicon",
      ar: "قاموس المعاني (معجم لغوي شامل وفوري)"
    },
    arabicName: "قاموس المعاني",
    description: {
      ur: "قرآنی مفردات، لسان العرب، القاموس المحیط اور معاصر اصطلاحات کا بااعتماد سہ لسانی لغت۔",
      en: "Instant multi-lingual dictionary providing root words, synonyms, contextual Quranic definitions, and verb conjugations.",
      ar: "معجم إلكتروني شامل للبحث في جذور الكلمات ومترادفاتها وتراكيبها في لسان العرب والمعاجم الحديثة."
    },
    url: "https://www.almaany.com",
    badge: "Trilingual Dictionary",
    tags: ["Root Words", "Vocabulary", "Translations"]
  },
  {
    id: "quranic-corpus",
    name: {
      ur: "قرآنک کارپس (قرآنی اعراب و لغوی تجزیہ)",
      en: "The Quranic Arabic Corpus (Grammar & Syntax)",
      ar: "مدونة القرآن اللغوية (الإعراب والتحليل الصرفي)"
    },
    arabicName: "مدونة القرآن اللغوية",
    description: {
      ur: "قرآنِ پاک کے ہر ہر لفظ کا مکمل اعراب، نحو، صرفی تجزیہ اور گرائمر کا مفصل بین الاقوامی ڈیٹا بیس۔",
      en: "Annotated linguistic resource mapping every word of the Holy Quran with morphological breakdown and syntactic treebanks.",
      ar: "مشروع أكاديمي يقدم تحليلاً صرفياً ونحوياً دقيقاً لكل كلمة من كلمات الذكر الحكيم مع شجرة الإعراب."
    },
    url: "https://corpus.quran.com",
    badge: "Word-by-Word Syntax",
    tags: ["I'rab", "Morphology", "Treebank"]
  }
];
