import {
  SiteSettings,
  NoticeBanner,
  Course,
  StoreItem,
  LiveClassLink,
  EnrollmentOrder,
  CertificateRecord,
  PaymentGateways,
  MediaAdItem,
  PublicationItem,
  TestimonialItem,
  ThemeMode,
  LocalizedString
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_NOTICE,
  INITIAL_COURSES,
  INITIAL_STORE_ITEMS,
  INITIAL_LIVE_CLASS,
  INITIAL_ORDERS,
  INITIAL_CERTIFICATES,
  INITIAL_PAYMENTS,
  INITIAL_MEDIA_ADS,
  INITIAL_PUBLICATIONS,
  INITIAL_POLICIES,
  INITIAL_TESTIMONIALS
} from '../data/initialData';
import {
  db,
  auth,
  onAuthStateChanged,
  isPrimaryAdminUser,
  handleFirestoreError,
  OperationType
} from '../firebase';
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';

const KEYS = {
  SETTINGS: 'aldanish_settings_v1',
  NOTICE: 'aldanish_notice_v1',
  COURSES: 'aldanish_courses_v1',
  STORE_ITEMS: 'aldanish_store_items_v1',
  PUBLICATIONS: 'aldanish_publications_v1',
  LIVE_CLASS: 'aldanish_live_class_v1',
  ORDERS: 'aldanish_orders_v1',
  CERTIFICATES: 'aldanish_certificates_v1',
  TESTIMONIALS: 'aldanish_testimonials_v1',
  PAYMENTS: 'aldanish_payments_v1',
  MEDIA_ADS: 'aldanish_media_ads_v1',
  LANGUAGE: 'aldanish_lang_v1',
  LANG_MODAL_SHOWN: 'aldanish_lang_modal_shown_v1',
  THEME: 'aldanish_theme_v1'
};

const notifyUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('aldanish_storage_update'));
  }
};

export const getStoredItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
};

export const setStoredItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyUpdate();
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

// --- Automatic Migration from Legacy Al-Danish Academy Branding to Kaleem Online Academy ---

function migrateLegacyBranding(raw: SiteSettings): SiteSettings {
  const s: SiteSettings = {
    ...INITIAL_SETTINGS,
    ...raw,
    activeSections: {
      ...INITIAL_SETTINGS.activeSections,
      ...(raw?.activeSections || {}),
      testimonials:
        typeof raw?.activeSections?.testimonials === 'boolean'
          ? raw.activeSections.testimonials
          : true
    }
  };

  if (s.siteTitle) {
    const enTitle = String(s.siteTitle.en || '');
    const urTitle = String(s.siteTitle.ur || '');
    const arTitle = String(s.siteTitle.ar || '');

    if (!enTitle || /al-?danish/i.test(enTitle)) {
      s.siteTitle = {
        ...s.siteTitle,
        en: 'Kaleem Online Academy'
      };
    }
    if (!urTitle || urTitle.includes('ادارہ دانش')) {
      s.siteTitle = {
        ...s.siteTitle,
        ur: 'کلیم آن لائن اکیڈمی'
      };
    }
    if (!arTitle || arTitle.includes('الدانش') || arTitle.includes('و اللغات العربیہ')) {
      s.siteTitle = {
        ...s.siteTitle,
        ar: 'أكاديمية كليم العالمية للتعليم الإلكتروني'
      };
    }
  }

  if (!s.contactEmail || /aldanish/i.test(s.contactEmail)) {
    s.contactEmail = 'info@kaleem-academy.edu';
  }

  if (!s.founderImage) {
    s.founderImage = '/assets/aistudio/founder.jpg_450b2eb5.jpeg';
  }

  if (s.policies?.refund?.en && /al-?danish/i.test(s.policies.refund.en)) {
    s.policies = {
      ...s.policies,
      refund: {
        en: s.policies.refund.en.replace(/Al-Danish Online Islamic Academy|Al-Danish Islamic Academy/gi, 'Kaleem Online Academy'),
        ur: (s.policies.refund.ur || '').replace(/ادارہ دانش الاسلامی/g, 'کلیم آن لائن اکیڈمی'),
        ar: s.policies.refund.ar || INITIAL_POLICIES.refund.ar
      }
    };
  }

  return s;
}

function migrateLegacyPayments(raw: PaymentGateways): PaymentGateways {
  const p: PaymentGateways = {
    ...INITIAL_PAYMENTS,
    ...raw,
    bank: {
      ...INITIAL_PAYMENTS.bank,
      ...(raw?.bank || {})
    },
    overseas: {
      ...INITIAL_PAYMENTS.overseas,
      ...(raw?.overseas || {})
    }
  };

  if (/al-?danish/i.test(p.bank.accountTitle || '')) {
    p.bank.accountTitle = 'Kaleem Online Academy';
  }
  if (/danish\.academy@wise-pay\.com/i.test(p.overseas.wiseEmail || '')) {
    p.overseas.wiseEmail = 'kaleem.academy@wise-pay.com';
  }
  if (/aldanish/i.test(p.overseas.paypalEmail || '')) {
    p.overseas.paypalEmail = 'payments@kaleem-academy.edu';
  }
  if (p.overseas.paypalMeLink && /aldanish/i.test(p.overseas.paypalMeLink)) {
    p.overseas.paypalMeLink = 'https://paypal.me/kaleemacademy';
  }
  if (p.overseas.cardPortalUrl && /aldanish/i.test(p.overseas.cardPortalUrl)) {
    p.overseas.cardPortalUrl = 'https://buy.stripe.com/kaleem_academy_portal';
  }

  return p;
}

function migrateLegacyNotice(raw: NoticeBanner): NoticeBanner {
  if (!raw) return INITIAL_NOTICE;
  const n = { ...INITIAL_NOTICE, ...raw };
  if (n.text?.en && /al-?danish/i.test(n.text.en)) {
    n.text = {
      ...n.text,
      en: n.text.en.replace(/Al-Danish[^!.,]*/gi, 'Kaleem Online Academy')
    };
  }
  return n;
}

function migrateLegacyLiveClass(raw: LiveClassLink): LiveClassLink {
  if (!raw) return INITIAL_LIVE_CLASS;
  const lc = { ...INITIAL_LIVE_CLASS, ...raw };
  if (lc.passcode === 'DANISH786') {
    lc.passcode = 'KALEEM786';
  }
  return lc;
}

// --- Defensive Payload Sanitization & Blueprint Boundary Guards ---

function stripUndefinedDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input
      .filter((v) => v !== undefined)
      .map((v) => stripUndefinedDeep(v)) as unknown as T;
  }
  if (input !== null && typeof input === 'object') {
    // Preserve Firestore FieldValue sentinels (e.g. serverTimestamp())
    const proto = Object.getPrototypeOf(input);
    if (proto !== Object.prototype && proto !== null) {
      return input;
    }
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      if (v !== undefined) {
        clean[k] = stripUndefinedDeep(v);
      }
    }
    return clean as T;
  }
  return input;
}

function truncStr(val: unknown, maxLen: number, fallback = ''): string {
  const s = typeof val === 'string' ? val.trim() : '';
  const effective = s.length > 0 ? s : fallback;
  return effective.slice(0, maxLen);
}

function sanitizeId(rawId: unknown, fallbackPrefix = 'item'): string {
  const str = typeof rawId === 'string' ? rawId.trim() : '';
  const cleaned = str.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  return cleaned.length > 0 ? cleaned : `${fallbackPrefix}-${Date.now()}`;
}

function sanitizeLocalized(loc: Partial<LocalizedString> | undefined, maxLen: number, fallback = '-'): LocalizedString {
  const en = truncStr(loc?.en, maxLen, truncStr(loc?.ur, maxLen, fallback));
  const ur = truncStr(loc?.ur, maxLen, en);
  const ar = truncStr(loc?.ar, maxLen, ur);
  return { ur, en, ar };
}

function sanitizeSettingsForCloud(s: SiteSettings): Record<string, unknown> {
  const migrated = migrateLegacyBranding(s);
  const safeFounderImage =
    migrated.founderImage && migrated.founderImage.length <= 450000
      ? migrated.founderImage
      : '/assets/aistudio/founder.jpg_450b2eb5.jpeg';

  const payload: Record<string, unknown> = {
    siteTitle: sanitizeLocalized(migrated.siteTitle, 300, INITIAL_SETTINGS.siteTitle.en),
    tagline: sanitizeLocalized(migrated.tagline, 600, INITIAL_SETTINGS.tagline.en),
    founderName: sanitizeLocalized(migrated.founderName, 200, INITIAL_SETTINGS.founderName.en),
    founderTitle: sanitizeLocalized(migrated.founderTitle, 300, INITIAL_SETTINGS.founderTitle.en),
    founderBio: sanitizeLocalized(migrated.founderBio, 4000, INITIAL_SETTINGS.founderBio.en),
    founderImage: safeFounderImage,
    primaryColor: truncStr(migrated.primaryColor, 30, '#064e3b'),
    accentColor: truncStr(migrated.accentColor, 30, '#d97706'),
    whatsappNumber: truncStr(migrated.whatsappNumber, 40, '+923001234567'),
    contactEmail: truncStr(migrated.contactEmail, 200, 'info@kaleem-academy.edu'),
    activeSections: {
      hero: Boolean(migrated.activeSections?.hero ?? true),
      founder: Boolean(migrated.activeSections?.founder ?? true),
      courses: Boolean(migrated.activeSections?.courses ?? true),
      testimonials: Boolean(migrated.activeSections?.testimonials ?? true),
      store: Boolean(migrated.activeSections?.store ?? true),
      publications: Boolean(migrated.activeSections?.publications ?? true),
      mediaAds: Boolean(migrated.activeSections?.mediaAds ?? true),
      scholarApps: Boolean(migrated.activeSections?.scholarApps ?? true),
      payments: Boolean(migrated.activeSections?.payments ?? true),
      policies: Boolean(migrated.activeSections?.policies ?? true)
    }
  };

  if (migrated.founderDegrees && Array.isArray(migrated.founderDegrees)) {
    payload.founderDegrees = migrated.founderDegrees.slice(0, 15).map((d) => sanitizeLocalized(d, 300));
  }
  if (migrated.founderExperience) {
    payload.founderExperience = sanitizeLocalized(migrated.founderExperience, 300);
  }
  if (migrated.navbarBg) payload.navbarBg = truncStr(migrated.navbarBg, 30);
  if (migrated.pageBg) payload.pageBg = truncStr(migrated.pageBg, 30);
  if (migrated.cardBg) payload.cardBg = truncStr(migrated.cardBg, 30);
  if (migrated.cardBorder) payload.cardBorder = truncStr(migrated.cardBorder, 30);
  if (migrated.textColor) payload.textColor = truncStr(migrated.textColor, 30);

  const pol = migrated.policies || INITIAL_POLICIES;
  payload.policies = {
    refund: sanitizeLocalized(pol.refund, 5000, INITIAL_POLICIES.refund.en),
    privacy: sanitizeLocalized(pol.privacy, 5000, INITIAL_POLICIES.privacy.en),
    payment: sanitizeLocalized(pol.payment, 5000, INITIAL_POLICIES.payment.en),
    terms: sanitizeLocalized(pol.terms, 5000, INITIAL_POLICIES.terms.en)
  };

  return stripUndefinedDeep(payload);
}

function sanitizeNoticeForCloud(n: NoticeBanner): Record<string, unknown> {
  const validLevels = ['info', 'urgent', 'announcement'];
  const payload: Record<string, unknown> = {
    enabled: Boolean(n.enabled),
    text: sanitizeLocalized(n.text, 1000, INITIAL_NOTICE.text.en),
    badge: sanitizeLocalized(n.badge, 150, INITIAL_NOTICE.badge.en),
    urgentLevel: validLevels.includes(n.urgentLevel) ? n.urgentLevel : 'urgent'
  };
  if (n.linkText) payload.linkText = sanitizeLocalized(n.linkText, 150);
  if (n.linkUrl) payload.linkUrl = truncStr(n.linkUrl, 500);
  return stripUndefinedDeep(payload);
}

function sanitizeLiveClassForCloud(lc: LiveClassLink): Record<string, unknown> {
  const validPlatforms = ['Zoom', 'Google Meet', 'Microsoft Teams'];
  const validAccess = ['public', 'enrolled_only', 'direct_share'];
  return stripUndefinedDeep({
    platform: validPlatforms.includes(lc.platform) ? lc.platform : 'Zoom',
    meetingUrl: truncStr(lc.meetingUrl, 1000, 'https://zoom.us'),
    meetingId: truncStr(lc.meetingId, 100, '000 000 0000'),
    passcode: truncStr(lc.passcode, 100, 'KALEEM786'),
    scheduleText: sanitizeLocalized(lc.scheduleText, 500, INITIAL_LIVE_CLASS.scheduleText.en),
    accessRestriction: validAccess.includes(lc.accessRestriction) ? lc.accessRestriction : 'enrolled_only',
    lastUpdated: truncStr(lc.lastUpdated, 100, 'Updated recently')
  });
}

function sanitizePaymentsForCloud(raw: PaymentGateways): Record<string, unknown> {
  const p = migrateLegacyPayments(raw);
  return stripUndefinedDeep({
    easypaisa: {
      accountTitle: truncStr(p.easypaisa?.accountTitle, 150, INITIAL_PAYMENTS.easypaisa.accountTitle),
      accountNumber: truncStr(p.easypaisa?.accountNumber, 80, INITIAL_PAYMENTS.easypaisa.accountNumber),
      instructions: sanitizeLocalized(p.easypaisa?.instructions, 1000, INITIAL_PAYMENTS.easypaisa.instructions.en)
    },
    jazzcash: {
      accountTitle: truncStr(p.jazzcash?.accountTitle, 150, INITIAL_PAYMENTS.jazzcash.accountTitle),
      accountNumber: truncStr(p.jazzcash?.accountNumber, 80, INITIAL_PAYMENTS.jazzcash.accountNumber),
      instructions: sanitizeLocalized(p.jazzcash?.instructions, 1000, INITIAL_PAYMENTS.jazzcash.instructions.en)
    },
    sadapay: {
      accountTitle: truncStr(p.sadapay?.accountTitle, 150, INITIAL_PAYMENTS.sadapay.accountTitle),
      accountNumber: truncStr(p.sadapay?.accountNumber, 80, INITIAL_PAYMENTS.sadapay.accountNumber),
      iban: truncStr(p.sadapay?.iban, 80, INITIAL_PAYMENTS.sadapay.iban)
    },
    bank: {
      bankName: truncStr(p.bank?.bankName, 150, INITIAL_PAYMENTS.bank.bankName),
      accountTitle: truncStr(p.bank?.accountTitle, 150, INITIAL_PAYMENTS.bank.accountTitle),
      accountNumber: truncStr(p.bank?.accountNumber, 80, INITIAL_PAYMENTS.bank.accountNumber),
      iban: truncStr(p.bank?.iban, 80, INITIAL_PAYMENTS.bank.iban),
      branchCode: truncStr(p.bank?.branchCode, 100, INITIAL_PAYMENTS.bank.branchCode)
    },
    overseas: {
      wiseEmail: truncStr(p.overseas?.wiseEmail, 200, INITIAL_PAYMENTS.overseas.wiseEmail),
      ...(p.overseas?.wiseAccountTitle ? { wiseAccountTitle: truncStr(p.overseas.wiseAccountTitle, 150) } : {}),
      paypalEmail: truncStr(p.overseas?.paypalEmail, 200, INITIAL_PAYMENTS.overseas.paypalEmail),
      ...(p.overseas?.paypalMeLink ? { paypalMeLink: truncStr(p.overseas.paypalMeLink, 300) } : {}),
      westernUnionName: truncStr(p.overseas?.westernUnionName, 250, INITIAL_PAYMENTS.overseas.westernUnionName),
      ...(p.overseas?.bankSwift ? { bankSwift: truncStr(p.overseas.bankSwift, 80) } : {}),
      ...(p.overseas?.internationalIban ? { internationalIban: truncStr(p.overseas.internationalIban, 80) } : {}),
      ...(p.overseas?.cardPortalUrl ? { cardPortalUrl: truncStr(p.overseas.cardPortalUrl, 500) } : {}),
      instructions: sanitizeLocalized(p.overseas?.instructions, 1500, INITIAL_PAYMENTS.overseas.instructions.en)
    }
  });
}

function sanitizeCourseForCloud(c: Course, uid: string): Record<string, unknown> {
  const validCats = ['tajweed', 'arabic', 'hadith_fiqh', 'tafseer', 'fatawa', 'hifz', 'qirat'];
  const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
  const id = sanitizeId(c.id, 'course');
  const payload: Record<string, unknown> = {
    id,
    title: sanitizeLocalized(c.title, 300, 'Islamic Course'),
    category: validCats.includes(c.category) ? c.category : 'tajweed',
    description: sanitizeLocalized(c.description, 4000, '1-on-1 Live Online Course'),
    feeMonthlyPKR: Math.min(1000000, Math.max(0, Number(c.feeMonthlyPKR) || 0)),
    feeUSD: Math.min(50000, Math.max(0, Number(c.feeUSD) || 0)),
    duration: sanitizeLocalized(c.duration, 200, '3 Months'),
    classesPerWeek: Math.min(7, Math.max(1, Math.round(Number(c.classesPerWeek) || 3))),
    instructor: sanitizeLocalized(c.instructor, 200, 'Mufti Danish Kaleem'),
    level: validLevels.includes(c.level) ? c.level : 'All Levels',
    features: (Array.isArray(c.features) ? c.features : [])
      .slice(0, 30)
      .map((f) => truncStr(String(f), 500, 'Live 1-on-1 Lesson')),
    isVisible: Boolean(c.isVisible),
    updatedBy: uid,
    updatedAt: serverTimestamp()
  };
  if (c.timing) payload.timing = sanitizeLocalized(c.timing, 300);
  if (typeof c.isPopular === 'boolean') payload.isPopular = c.isPopular;
  return stripUndefinedDeep(payload);
}

function sanitizeStoreItemForCloud(item: StoreItem, uid: string): Record<string, unknown> {
  const validCats = ['package', 'video', 'pdf', 'audio', 'session'];
  const id = sanitizeId(item.id, 'store');
  const payload: Record<string, unknown> = {
    id,
    title: sanitizeLocalized(item.title, 300, 'Digital Resource'),
    category: validCats.includes(item.category) ? item.category : 'pdf',
    pricePKR: Math.min(5000000, Math.max(0, Number(item.pricePKR) || 0)),
    priceUSD: Math.min(50000, Math.max(0, Number(item.priceUSD) || 0)),
    description: sanitizeLocalized(item.description, 4000, 'Digital Study Material'),
    includes: (Array.isArray(item.includes) ? item.includes : [])
      .slice(0, 30)
      .map((inc) => truncStr(String(inc), 500, 'Digital Download')),
    formatBadge: truncStr(item.formatBadge, 100, 'PDF Book'),
    isVisible: Boolean(item.isVisible),
    updatedBy: uid,
    updatedAt: serverTimestamp()
  };
  if (item.badgeColor) payload.badgeColor = truncStr(item.badgeColor, 100);
  if (item.fileName) payload.fileName = truncStr(item.fileName, 200);
  if (item.fileSize) payload.fileSize = truncStr(item.fileSize, 50);
  if (item.fileData && item.fileData.length <= 740000) {
    payload.fileData = item.fileData;
  }
  return stripUndefinedDeep(payload);
}

function sanitizePublicationForCloud(pub: PublicationItem, uid: string): Record<string, unknown> {
  const id = sanitizeId(pub.id, 'pub');
  const payload: Record<string, unknown> = {
    id,
    title: sanitizeLocalized(pub.title, 300, 'Scholarly Publication'),
    category: sanitizeLocalized(pub.category, 200, 'Islamic Research'),
    author: sanitizeLocalized(pub.author, 200, 'Mufti Danish Kaleem'),
    pages: Math.min(50000, Math.max(1, Math.round(Number(pub.pages) || 1))),
    summary: sanitizeLocalized(pub.summary, 5000, 'Authenticated Islamic Treatise'),
    fullExcerpt: truncStr(pub.fullExcerpt, 20000, 'بسم الله الرحمن الرحيم'),
    downloadFilename: truncStr(pub.downloadFilename, 200, 'publication.pdf'),
    isVisible: pub.isVisible !== false,
    updatedBy: uid,
    updatedAt: serverTimestamp()
  };
  if (typeof pub.isFatawa === 'boolean') payload.isFatawa = pub.isFatawa;
  if (pub.fileSize) payload.fileSize = truncStr(pub.fileSize, 50);
  if (pub.fileData && pub.fileData.length <= 740000) {
    payload.fileData = pub.fileData;
  }
  return stripUndefinedDeep(payload);
}

function sanitizeMediaAdForCloud(ad: MediaAdItem, uid: string): Record<string, unknown> {
  const validTypes = ['poster', 'video', 'announcement'];
  const id = sanitizeId(ad.id, 'ad');
  const safeMediaUrl =
    ad.mediaUrl && ad.mediaUrl.length >= 1 && ad.mediaUrl.length <= 740000
      ? ad.mediaUrl
      : 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80';
  const payload: Record<string, unknown> = {
    id,
    title: sanitizeLocalized(ad.title, 300, 'Academy Announcement'),
    type: validTypes.includes(ad.type) ? ad.type : 'poster',
    mediaUrl: safeMediaUrl,
    badge: sanitizeLocalized(ad.badge, 150, 'Featured'),
    description: sanitizeLocalized(ad.description, 3000, 'Kaleem Online Academy'),
    isVisible: Boolean(ad.isVisible),
    updatedBy: uid,
    updatedAt: serverTimestamp()
  };
  if (ad.thumbnailUrl && ad.thumbnailUrl.length <= 740000) {
    payload.thumbnailUrl = ad.thumbnailUrl;
  }
  if (ad.ctaText) payload.ctaText = sanitizeLocalized(ad.ctaText, 150);
  if (ad.ctaLink) payload.ctaLink = truncStr(ad.ctaLink, 1000);
  return stripUndefinedDeep(payload);
}

function sanitizeCertificateForCloud(cert: CertificateRecord, uid: string): Record<string, unknown> {
  const id = sanitizeId(cert.id, 'cert');
  const payload: Record<string, unknown> = {
    id,
    certNumber: truncStr(cert.certNumber, 100, `KOA-CERT-${Date.now()}`),
    studentName: truncStr(cert.studentName, 150, 'Student'),
    fatherName: truncStr(cert.fatherName, 150, 'Father'),
    courseName: truncStr(cert.courseName, 250, 'Islamic Studies'),
    grade: truncStr(cert.grade, 100, 'Mumtaz'),
    issueDate: truncStr(cert.issueDate, 100, new Date().toLocaleDateString('en-US')),
    issuedBy: truncStr(cert.issuedBy, 150, 'Mufti Danish Kaleem'),
    verificationCode: truncStr(cert.verificationCode, 100, `VER-KOA-${Date.now()}`),
    isPublic: true,
    updatedBy: uid,
    updatedAt: serverTimestamp()
  };
  if (cert.enrollmentNo && cert.enrollmentNo.trim()) {
    payload.enrollmentNo = truncStr(cert.enrollmentNo, 100);
  }
  return stripUndefinedDeep(payload);
}

function sanitizeTestimonialForCloud(t: TestimonialItem, uid: string): Record<string, unknown> {
  const id = sanitizeId(t.id, 'test');
  const safeRating = Math.min(5, Math.max(1, Math.round(Number(t.rating) || 5)));
  const payload: Record<string, unknown> = {
    id,
    studentName: sanitizeLocalized(t.studentName, 150, 'Graduate Student'),
    location: sanitizeLocalized(t.location, 150, 'Online'),
    courseCompleted: sanitizeLocalized(t.courseCompleted, 250, '1-on-1 Live Course'),
    quote: sanitizeLocalized(t.quote, 2000, 'Alhamdulillah, an exceptional 1-on-1 learning experience.'),
    outcome: sanitizeLocalized(t.outcome, 500, 'Completed certified curriculum with distinction.'),
    rating: safeRating,
    completionDate: truncStr(t.completionDate, 100, 'October 2026'),
    isVisible: Boolean(t.isVisible),
    updatedBy: uid,
    updatedAt: serverTimestamp()
  };
  if (t.certNumber && t.certNumber.trim()) {
    payload.certNumber = truncStr(t.certNumber, 100);
  }
  return stripUndefinedDeep(payload);
}

function sanitizeOrderPairForCloud(order: EnrollmentOrder): {
  id: string;
  privateData: Record<string, unknown>;
  statusData: Record<string, unknown>;
} {
  const id = sanitizeId(order.id, 'ENR');
  const validTypes = ['live_course', 'store_purchase', 'digital_store'];
  const validTimes = ['morning', 'afternoon', 'evening'];
  const validMethods = ['easypaisa', 'jazzcash', 'sadapay', 'bank', 'card_overseas', 'wise_paypal'];
  const validStatuses = ['Pending', 'Approved', 'Declined'];

  const safeType = validTypes.includes(order.type) ? order.type : 'live_course';
  const safeMethod = validMethods.includes(order.paymentMethod) ? order.paymentMethod : 'easypaisa';
  const safeStatus = validStatuses.includes(order.paymentStatus) ? order.paymentStatus : 'Pending';
  const safeWhatsappRaw = truncStr(order.whatsapp, 40, '03000000000');
  const safeWhatsapp = safeWhatsappRaw.length >= 3 ? safeWhatsappRaw : '03000000000';
  const safeCreatedAt = truncStr(order.createdAt, 100, new Date().toISOString());
  const safeStudent = truncStr(order.studentName, 150, 'Student');
  const safeFather = truncStr(order.fatherName, 150, 'Guardian');
  const safeTitle = truncStr(order.courseOrItemTitle, 500, 'Academy Enrollment');
  const safeAmount = Math.min(10000000, Math.max(0, Number(order.totalAmountPKR) || 0));

  const legacyItems = (order as unknown as { items?: { id: string; title: string; pricePKR: number }[] }).items;
  const rawStoreItems = order.selectedStoreItems || legacyItems;

  const privateData: Record<string, unknown> = {
    id,
    studentName: safeStudent,
    fatherName: safeFather,
    countryCity: truncStr(order.countryCity, 150, 'Online'),
    whatsapp: safeWhatsapp,
    type: safeType,
    courseOrItemTitle: safeTitle,
    totalAmountPKR: safeAmount,
    paymentMethod: safeMethod,
    paymentStatus: safeStatus,
    createdAt: safeCreatedAt,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp()
  };

  if (order.email && order.email.trim()) {
    privateData.email = truncStr(order.email, 200);
  }
  if (Array.isArray(rawStoreItems) && rawStoreItems.length > 0) {
    privateData.selectedStoreItems = rawStoreItems.slice(0, 30).map((it) => ({
      id: truncStr(it.id, 128, 'item'),
      title: truncStr(it.title, 300, 'Resource'),
      pricePKR: Math.max(0, Number(it.pricePKR) || 0)
    }));
  }
  if (order.preferredTime && validTimes.includes(order.preferredTime)) {
    privateData.preferredTime = order.preferredTime;
  }
  if (order.classFrequency) {
    privateData.classFrequency = truncStr(order.classFrequency, 120);
  }
  if (order.knowledgeLevel) {
    privateData.knowledgeLevel = truncStr(order.knowledgeLevel, 120);
  }
  if (order.transactionId) {
    privateData.transactionId = truncStr(order.transactionId, 150);
  }
  if (order.notes) {
    privateData.notes = truncStr(order.notes, 1000);
  }

  const statusData: Record<string, unknown> = {
    id,
    studentName: safeStudent,
    fatherName: safeFather,
    type: safeType,
    courseOrItemTitle: safeTitle,
    totalAmountPKR: safeAmount,
    paymentMethod: safeMethod,
    paymentStatus: safeStatus,
    createdAt: safeCreatedAt,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp()
  };

  return {
    id,
    privateData: stripUndefinedDeep(privateData),
    statusData: stripUndefinedDeep(statusData)
  };
}

function stripCloudMeta<T>(docData: Record<string, unknown>): T {
  const clone = { ...docData };
  delete clone.updatedBy;
  delete clone.updatedAt;
  delete clone.createdAtServer;
  delete clone.updatedAtServer;
  delete clone.isPublic;
  return clone as unknown as T;
}

// --- Normalize Certificate / Verification Codes (supports both KOA-CERT-... and legacy AD-CERT-...) ---

function normalizeCertIdentifier(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/^(koa|ad)-cert-/, 'cert-')
    .replace(/^ver-(koa|ad)-/, 'ver-')
    .replace(/^(koa|ad)-enr-/, 'enr-');
}

// --- Cloud Push Helpers ---

async function pushSiteConfigToCloud(overrides?: {
  settings?: SiteSettings;
  notice?: NoticeBanner;
  liveClass?: LiveClassLink;
  payments?: PaymentGateways;
}): Promise<void> {
  const user = auth.currentUser;
  if (!isPrimaryAdminUser(user) || !user) return;

  const currentSettings = overrides?.settings || storage.getSettings();
  const currentNotice = overrides?.notice || storage.getNotice();
  const currentLiveClass = overrides?.liveClass || storage.getLiveClass();
  const currentPayments = overrides?.payments || storage.getPayments();

  const payload = {
    settings: sanitizeSettingsForCloud(currentSettings),
    notice: sanitizeNoticeForCloud(currentNotice),
    liveClass: sanitizeLiveClassForCloud(currentLiveClass),
    payments: sanitizePaymentsForCloud(currentPayments),
    updatedBy: user.uid,
    updatedAt: serverTimestamp()
  };

  try {
    await setDoc(doc(db, 'site_config', 'main'), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'site_config/main');
  }
}

// --- Real-Time Cloud Sync Engine ---

let cloudConfigExists = false;
let activeListeners: Unsubscribe[] = [];
let singletonConfigUnsub: Unsubscribe | null = null;
let syncInitialized = false;
let autoSeedingInProgress = false;

async function ensureInitialCloudSeedIfNeeded(): Promise<void> {
  const user = auth.currentUser;
  if (!isPrimaryAdminUser(user) || !user || autoSeedingInProgress) return;

  autoSeedingInProgress = true;
  try {
    let configSnap;
    try {
      configSnap = await getDoc(doc(db, 'site_config', 'main'));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'site_config/main');
    }

    if (!configSnap?.exists()) {
      await syncAllLocalToCloudInternal();
    } else {
      // Ensure testimonials collection is also seeded if empty
      const testSnap = await getDocs(collection(db, 'testimonials')).catch(() => null);
      if (testSnap && testSnap.empty) {
        const testimonials = storage.getTestimonials();
        for (const t of testimonials) {
          const data = sanitizeTestimonialForCloud(t, user.uid);
          await setDoc(doc(db, 'testimonials', String(data.id)), data).catch(() => {});
        }
      }
      // If cloud still holds legacy Al-Danish academy title, push migrated Kaleem Online Academy branding
      const cloudSettings = configSnap.data()?.settings as Partial<SiteSettings> | undefined;
      if (cloudSettings?.siteTitle?.en && /al-?danish/i.test(cloudSettings.siteTitle.en)) {
        await pushSiteConfigToCloud();
      }
    }
  } finally {
    autoSeedingInProgress = false;
  }
}

async function syncAllLocalToCloudInternal(): Promise<void> {
  const user = auth.currentUser;
  if (!isPrimaryAdminUser(user) || !user) {
    throw new Error('Director Google Sign-In (kaleemhafiz47@gmail.com) is required to sync to Cloud.');
  }

  // 1. Push singleton Academy configuration
  await pushSiteConfigToCloud();

  // 2. Push Courses, Store Items, Publications, Media Ads, Certificates, and Testimonials
  const courses = storage.getCourses();
  for (const c of courses) {
    const data = sanitizeCourseForCloud(c, user.uid);
    try {
      await setDoc(doc(db, 'courses', String(data.id)), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `courses/${String(data.id)}`);
    }
  }

  const storeItems = storage.getStoreItems();
  for (const item of storeItems) {
    const data = sanitizeStoreItemForCloud(item, user.uid);
    try {
      await setDoc(doc(db, 'store_items', String(data.id)), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `store_items/${String(data.id)}`);
    }
  }

  const pubs = storage.getPublications();
  for (const pub of pubs) {
    const data = sanitizePublicationForCloud(pub, user.uid);
    try {
      await setDoc(doc(db, 'publications', String(data.id)), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `publications/${String(data.id)}`);
    }
  }

  const ads = storage.getMediaAds();
  for (const ad of ads) {
    const data = sanitizeMediaAdForCloud(ad, user.uid);
    try {
      await setDoc(doc(db, 'media_ads', String(data.id)), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `media_ads/${String(data.id)}`);
    }
  }

  const certs = storage.getCertificates();
  for (const cert of certs) {
    const data = sanitizeCertificateForCloud(cert, user.uid);
    try {
      await setDoc(doc(db, 'certificates', String(data.id)), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `certificates/${String(data.id)}`);
    }
  }

  const testimonials = storage.getTestimonials();
  for (const t of testimonials) {
    const data = sanitizeTestimonialForCloud(t, user.uid);
    try {
      await setDoc(doc(db, 'testimonials', String(data.id)), data);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `testimonials/${String(data.id)}`);
    }
  }

  // 3. Push any local Orders that don't yet exist in Firestore
  const orders = storage.getOrders();
  for (const order of orders) {
    const { id, privateData, statusData } = sanitizeOrderPairForCloud(order);
    try {
      const existingSnap = await getDoc(doc(db, 'orders_private', id));
      if (!existingSnap.exists()) {
        const batch = writeBatch(db);
        batch.set(doc(db, 'orders_private', id), privateData);
        batch.set(doc(db, 'order_status', id), statusData);
        await batch.commit();
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `orders_private/${id}`);
    }
  }
}

function attachCollectionListeners(isAdminMode: boolean): void {
  activeListeners.forEach((unsub) => unsub());
  activeListeners = [];

  // 1. Courses Listener
  const coursesRef = isAdminMode
    ? collection(db, 'courses')
    : query(collection(db, 'courses'), where('isVisible', '==', true));

  activeListeners.push(
    onSnapshot(
      coursesRef,
      (snap) => {
        if (snap.empty && !cloudConfigExists) return;
        const list = snap.docs.map((d) => stripCloudMeta<Course>(d.data() as Record<string, unknown>));
        setStoredItem(KEYS.COURSES, list);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'courses');
        } catch {}
      }
    )
  );

  // 2. Store Items Listener
  const storeRef = isAdminMode
    ? collection(db, 'store_items')
    : query(collection(db, 'store_items'), where('isVisible', '==', true));

  activeListeners.push(
    onSnapshot(
      storeRef,
      (snap) => {
        if (snap.empty && !cloudConfigExists) return;
        const list = snap.docs.map((d) => stripCloudMeta<StoreItem>(d.data() as Record<string, unknown>));
        setStoredItem(KEYS.STORE_ITEMS, list);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'store_items');
        } catch {}
      }
    )
  );

  // 3. Publications Listener
  const pubsRef = isAdminMode
    ? collection(db, 'publications')
    : query(collection(db, 'publications'), where('isVisible', '==', true));

  activeListeners.push(
    onSnapshot(
      pubsRef,
      (snap) => {
        if (snap.empty && !cloudConfigExists) return;
        const list = snap.docs.map((d) => stripCloudMeta<PublicationItem>(d.data() as Record<string, unknown>));
        setStoredItem(KEYS.PUBLICATIONS, list);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'publications');
        } catch {}
      }
    )
  );

  // 4. Media Ads Listener
  const adsRef = isAdminMode
    ? collection(db, 'media_ads')
    : query(collection(db, 'media_ads'), where('isVisible', '==', true));

  activeListeners.push(
    onSnapshot(
      adsRef,
      (snap) => {
        if (snap.empty && !cloudConfigExists) return;
        const list = snap.docs.map((d) => stripCloudMeta<MediaAdItem>(d.data() as Record<string, unknown>));
        setStoredItem(KEYS.MEDIA_ADS, list);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'media_ads');
        } catch {}
      }
    )
  );

  // 5. Certificates Registry Listener
  const certsRef = isAdminMode
    ? collection(db, 'certificates')
    : query(collection(db, 'certificates'), where('isPublic', '==', true));

  activeListeners.push(
    onSnapshot(
      certsRef,
      (snap) => {
        if (snap.empty && !cloudConfigExists) return;
        const list = snap.docs.map((d) => stripCloudMeta<CertificateRecord>(d.data() as Record<string, unknown>));
        if (list.length > 0 || isAdminMode) {
          setStoredItem(KEYS.CERTIFICATES, list);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'certificates');
        } catch {}
      }
    )
  );

  // 6. Student Testimonials Listener
  const testimonialsRef = isAdminMode
    ? collection(db, 'testimonials')
    : query(collection(db, 'testimonials'), where('isVisible', '==', true));

  activeListeners.push(
    onSnapshot(
      testimonialsRef,
      (snap) => {
        if (snap.empty && !cloudConfigExists) return;
        const list = snap.docs.map((d) => stripCloudMeta<TestimonialItem>(d.data() as Record<string, unknown>));
        if (list.length > 0 || isAdminMode) {
          setStoredItem(KEYS.TESTIMONIALS, list);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, 'testimonials');
        } catch {}
      }
    )
  );

  // 7. Private Orders Listener (Primary Admin Only)
  if (isAdminMode) {
    activeListeners.push(
      onSnapshot(
        collection(db, 'orders_private'),
        (snap) => {
          if (snap.empty && !cloudConfigExists) return;
          const list = snap.docs
            .map((d) => stripCloudMeta<EnrollmentOrder>(d.data() as Record<string, unknown>))
            .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
          setStoredItem(KEYS.ORDERS, list);
        },
        (error) => {
          try {
            handleFirestoreError(error, OperationType.LIST, 'orders_private');
          } catch {}
        }
      )
    );
  }
}

export function initRealtimeSync(): void {
  if (typeof window === 'undefined' || syncInitialized) return;
  syncInitialized = true;

  // Listen to singleton /site_config/main for all visitors worldwide
  singletonConfigUnsub = onSnapshot(
    doc(db, 'site_config', 'main'),
    (snap) => {
      if (!snap.exists()) return;
      cloudConfigExists = true;
      const data = snap.data();

      if (data.settings) {
        const localSettings = getStoredItem(KEYS.SETTINGS, INITIAL_SETTINGS);
        const mergedSettings = migrateLegacyBranding({
          ...INITIAL_SETTINGS,
          ...(data.settings as Partial<SiteSettings>),
          adminPassword: localSettings.adminPassword || INITIAL_SETTINGS.adminPassword
        });
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(mergedSettings));
      }
      if (data.notice) {
        localStorage.setItem(KEYS.NOTICE, JSON.stringify(migrateLegacyNotice(data.notice as NoticeBanner)));
      }
      if (data.liveClass) {
        localStorage.setItem(KEYS.LIVE_CLASS, JSON.stringify(migrateLegacyLiveClass(data.liveClass as LiveClassLink)));
      }
      if (data.payments) {
        localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(migrateLegacyPayments(data.payments as PaymentGateways)));
      }
      notifyUpdate();
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'site_config/main');
      } catch {}
    }
  );

  // Switch collection queries dynamically based on Auth state
  onAuthStateChanged(auth, (user) => {
    const adminActive = isPrimaryAdminUser(user);
    attachCollectionListeners(adminActive);
    if (adminActive) {
      ensureInitialCloudSeedIfNeeded().catch((err) => {
        console.error('Initial cloud seed error:', err);
      });
    }
  });
}

// Start real-time listeners immediately in browser environment
if (typeof window !== 'undefined') {
  initRealtimeSync();
}

export const storage = {
  // Settings
  getSettings: (): SiteSettings => {
    const s = getStoredItem(KEYS.SETTINGS, INITIAL_SETTINGS);
    return migrateLegacyBranding(s);
  },
  saveSettings: (settings: SiteSettings) => {
    const migrated = migrateLegacyBranding(settings);
    setStoredItem(KEYS.SETTINGS, migrated);
    pushSiteConfigToCloud({ settings: migrated }).catch(() => {});
  },

  // Notice Banner
  getNotice: (): NoticeBanner => migrateLegacyNotice(getStoredItem(KEYS.NOTICE, INITIAL_NOTICE)),
  saveNotice: (notice: NoticeBanner) => {
    setStoredItem(KEYS.NOTICE, notice);
    pushSiteConfigToCloud({ notice }).catch(() => {});
  },

  // Courses
  getCourses: (): Course[] => getStoredItem(KEYS.COURSES, INITIAL_COURSES),
  saveCourses: (courses: Course[]) => {
    setStoredItem(KEYS.COURSES, courses);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      courses.forEach((c) => {
        const data = sanitizeCourseForCloud(c, user.uid);
        setDoc(doc(db, 'courses', String(data.id)), data).catch((err) => {
          try {
            handleFirestoreError(err, OperationType.WRITE, `courses/${String(data.id)}`);
          } catch {}
        });
      });
    }
  },
  addCourse: (course: Course) => {
    const courses = storage.getCourses();
    const updated = [course, ...courses];
    setStoredItem(KEYS.COURSES, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeCourseForCloud(course, user.uid);
      setDoc(doc(db, 'courses', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.CREATE, `courses/${String(data.id)}`);
        } catch {}
      });
    }
    return course;
  },
  updateCourse: (course: Course) => {
    const courses = storage.getCourses();
    const updated = courses.map((c) => (c.id === course.id ? course : c));
    setStoredItem(KEYS.COURSES, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeCourseForCloud(course, user.uid);
      setDoc(doc(db, 'courses', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `courses/${String(data.id)}`);
        } catch {}
      });
    }
  },
  deleteCourse: (id: string) => {
    const courses = storage.getCourses();
    const updated = courses.filter((c) => c.id !== id);
    setStoredItem(KEYS.COURSES, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const cleanId = sanitizeId(id, 'course');
      deleteDoc(doc(db, 'courses', cleanId)).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.DELETE, `courses/${cleanId}`);
        } catch {}
      });
    }
  },

  // Store Items (Digital Products, PDFs, Video lessons)
  getStoreItems: (): StoreItem[] => getStoredItem(KEYS.STORE_ITEMS, INITIAL_STORE_ITEMS),
  saveStoreItems: (items: StoreItem[]) => {
    setStoredItem(KEYS.STORE_ITEMS, items);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      items.forEach((item) => {
        const data = sanitizeStoreItemForCloud(item, user.uid);
        setDoc(doc(db, 'store_items', String(data.id)), data).catch((err) => {
          try {
            handleFirestoreError(err, OperationType.WRITE, `store_items/${String(data.id)}`);
          } catch {}
        });
      });
    }
  },
  addStoreItem: (item: StoreItem) => {
    const items = storage.getStoreItems();
    const updated = [item, ...items];
    setStoredItem(KEYS.STORE_ITEMS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeStoreItemForCloud(item, user.uid);
      setDoc(doc(db, 'store_items', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.CREATE, `store_items/${String(data.id)}`);
        } catch {}
      });
    }
    return item;
  },
  updateStoreItem: (item: StoreItem) => {
    const items = storage.getStoreItems();
    const updated = items.map((i) => (i.id === item.id ? item : i));
    setStoredItem(KEYS.STORE_ITEMS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeStoreItemForCloud(item, user.uid);
      setDoc(doc(db, 'store_items', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `store_items/${String(data.id)}`);
        } catch {}
      });
    }
  },
  deleteStoreItem: (id: string) => {
    const items = storage.getStoreItems();
    const updated = items.filter((i) => i.id !== id);
    setStoredItem(KEYS.STORE_ITEMS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const cleanId = sanitizeId(id, 'store');
      deleteDoc(doc(db, 'store_items', cleanId)).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.DELETE, `store_items/${cleanId}`);
        } catch {}
      });
    }
  },

  // Publications & Research PDFs
  getPublications: (): PublicationItem[] => getStoredItem(KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS),
  savePublications: (pubs: PublicationItem[]) => {
    setStoredItem(KEYS.PUBLICATIONS, pubs);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      pubs.forEach((pub) => {
        const data = sanitizePublicationForCloud(pub, user.uid);
        setDoc(doc(db, 'publications', String(data.id)), data).catch((err) => {
          try {
            handleFirestoreError(err, OperationType.WRITE, `publications/${String(data.id)}`);
          } catch {}
        });
      });
    }
  },
  addPublication: (pub: PublicationItem) => {
    const pubs = storage.getPublications();
    const updated = [pub, ...pubs];
    setStoredItem(KEYS.PUBLICATIONS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizePublicationForCloud(pub, user.uid);
      setDoc(doc(db, 'publications', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.CREATE, `publications/${String(data.id)}`);
        } catch {}
      });
    }
    return pub;
  },
  deletePublication: (id: string) => {
    const pubs = storage.getPublications();
    const updated = pubs.filter((p) => p.id !== id);
    setStoredItem(KEYS.PUBLICATIONS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const cleanId = sanitizeId(id, 'pub');
      deleteDoc(doc(db, 'publications', cleanId)).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.DELETE, `publications/${cleanId}`);
        } catch {}
      });
    }
  },

  // Live Class Link
  getLiveClass: (): LiveClassLink => migrateLegacyLiveClass(getStoredItem(KEYS.LIVE_CLASS, INITIAL_LIVE_CLASS)),
  saveLiveClass: (liveClass: LiveClassLink) => {
    setStoredItem(KEYS.LIVE_CLASS, liveClass);
    pushSiteConfigToCloud({ liveClass }).catch(() => {});
  },

  // Orders / Enrollments (Public Atomic Submission + Admin Status/Delete)
  getOrders: (): EnrollmentOrder[] => getStoredItem(KEYS.ORDERS, INITIAL_ORDERS),
  saveOrders: (orders: EnrollmentOrder[]) => setStoredItem(KEYS.ORDERS, orders),
  addOrder: (order: EnrollmentOrder) => {
    const orders = storage.getOrders();
    const updated = [order, ...orders];
    setStoredItem(KEYS.ORDERS, updated);

    const { id, privateData, statusData } = sanitizeOrderPairForCloud(order);
    const batch = writeBatch(db);
    batch.set(doc(db, 'orders_private', id), privateData);
    batch.set(doc(db, 'order_status', id), statusData);
    batch.commit().catch((err) => {
      try {
        handleFirestoreError(err, OperationType.CREATE, `orders_private/${id}`);
      } catch {}
    });

    return order;
  },
  updateOrderStatus: (orderId: string, status: 'Pending' | 'Approved' | 'Declined') => {
    const orders = storage.getOrders();
    const targetOrder = orders.find((o) => o.id === orderId);
    const updated = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o));
    setStoredItem(KEYS.ORDERS, updated);

    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const cleanId = sanitizeId(orderId, 'ENR');
      (async () => {
        try {
          const existingSnap = await getDoc(doc(db, 'orders_private', cleanId));
          const batch = writeBatch(db);
          if (existingSnap.exists()) {
            batch.update(doc(db, 'orders_private', cleanId), {
              paymentStatus: status,
              updatedAtServer: serverTimestamp()
            });
            batch.update(doc(db, 'order_status', cleanId), {
              paymentStatus: status,
              updatedAtServer: serverTimestamp()
            });
          } else if (targetOrder) {
            const { privateData, statusData } = sanitizeOrderPairForCloud({
              ...targetOrder,
              paymentStatus: status
            });
            batch.set(doc(db, 'orders_private', cleanId), privateData);
            batch.set(doc(db, 'order_status', cleanId), statusData);
          }
          await batch.commit();
        } catch (err) {
          try {
            handleFirestoreError(err, OperationType.UPDATE, `orders_private/${cleanId}`);
          } catch {}
        }
      })();
    }
  },
  deleteOrder: (orderId: string) => {
    const orders = storage.getOrders();
    const updated = orders.filter((o) => o.id !== orderId);
    setStoredItem(KEYS.ORDERS, updated);

    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const cleanId = sanitizeId(orderId, 'ENR');
      const batch = writeBatch(db);
      batch.delete(doc(db, 'orders_private', cleanId));
      batch.delete(doc(db, 'order_status', cleanId));
      batch.commit().catch((err) => {
        try {
          handleFirestoreError(err, OperationType.DELETE, `orders_private/${cleanId}`);
        } catch {}
      });
    }
  },

  // Cross-Device PII-Free Order Status Lookup by Exact ID
  fetchOrderStatusFromCloud: async (rawQuery: string): Promise<EnrollmentOrder | null> => {
    const trimmed = rawQuery.trim().toUpperCase();
    if (!trimmed || !/^[A-Z0-9_-]{1,128}$/.test(trimmed)) {
      return null;
    }
    try {
      const snap = await getDoc(doc(db, 'order_status', trimmed));
      if (!snap.exists()) return null;
      const d = snap.data();
      return {
        id: String(d.id || trimmed),
        studentName: String(d.studentName || ''),
        fatherName: String(d.fatherName || ''),
        countryCity: 'Verified Online Enrollment',
        whatsapp: 'Protected',
        type: d.type === 'store_purchase' ? 'store_purchase' : 'live_course',
        courseOrItemTitle: String(d.courseOrItemTitle || ''),
        preferredTime: 'evening',
        totalAmountPKR: Number(d.totalAmountPKR) || 0,
        paymentMethod: d.paymentMethod || 'easypaisa',
        paymentStatus: d.paymentStatus || 'Pending',
        createdAt: String(d.createdAt || '')
      };
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.GET, `order_status/${trimmed}`);
      } catch {}
      return null;
    }
  },

  // Certificates
  getCertificates: (): CertificateRecord[] => {
    const stored = getStoredItem(KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    return Array.isArray(stored) && stored.length > 0 ? stored : INITIAL_CERTIFICATES;
  },
  saveCertificates: (certs: CertificateRecord[]) => {
    setStoredItem(KEYS.CERTIFICATES, certs);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      certs.forEach((cert) => {
        const data = sanitizeCertificateForCloud(cert, user.uid);
        setDoc(doc(db, 'certificates', String(data.id)), data).catch((err) => {
          try {
            handleFirestoreError(err, OperationType.WRITE, `certificates/${String(data.id)}`);
          } catch {}
        });
      });
    }
  },
  addCertificate: (cert: CertificateRecord) => {
    const certs = storage.getCertificates();
    const updated = [cert, ...certs];
    setStoredItem(KEYS.CERTIFICATES, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeCertificateForCloud(cert, user.uid);
      setDoc(doc(db, 'certificates', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.CREATE, `certificates/${String(data.id)}`);
        } catch {}
      });
    }
    return cert;
  },
  deleteCertificate: (id: string) => {
    const certs = storage.getCertificates();
    const updated = certs.filter((c) => c.id !== id);
    setStoredItem(KEYS.CERTIFICATES, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const cleanId = sanitizeId(id, 'cert');
      deleteDoc(doc(db, 'certificates', cleanId)).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.DELETE, `certificates/${cleanId}`);
        } catch {}
      });
    }
  },

  // Unified Live Cloud + Local Sanad & Enrollment Verification
  verifyCertificateAndOrder: async (
    rawQuery: string
  ): Promise<{ cert: CertificateRecord | null; order: EnrollmentOrder | null }> => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return { cert: null, order: null };

    const qLower = trimmed.toLowerCase();
    const qNorm = normalizeCertIdentifier(trimmed);
    const qDigits = trimmed.replace(/\D/g, '');

    // 1. Gather local + initial + live Cloud public certificates
    let cloudCerts: CertificateRecord[] = [];
    try {
      const snap = await getDocs(query(collection(db, 'certificates'), where('isPublic', '==', true)));
      cloudCerts = snap.docs.map((d) => stripCloudMeta<CertificateRecord>(d.data() as Record<string, unknown>));
      if (cloudCerts.length > 0) {
        const mergedMap = new Map<string, CertificateRecord>();
        for (const c of [...cloudCerts, ...storage.getCertificates()]) {
          mergedMap.set(c.id || c.certNumber, c);
        }
        setStoredItem(KEYS.CERTIFICATES, Array.from(mergedMap.values()));
      }
    } catch {
      // Fallback to local certificates if offline
    }

    const allCertsMap = new Map<string, CertificateRecord>();
    for (const c of [...cloudCerts, ...storage.getCertificates(), ...INITIAL_CERTIFICATES]) {
      allCertsMap.set(c.certNumber || c.id, c);
    }
    const allCerts = Array.from(allCertsMap.values());

    // 2. Match Certificate by certNumber (KOA-CERT or AD-CERT), verificationCode, enrollmentNo, or Student Name
    let foundCert =
      allCerts.find(
        (c) =>
          c.certNumber.toLowerCase() === qLower ||
          normalizeCertIdentifier(c.certNumber) === qNorm ||
          c.verificationCode.toLowerCase() === qLower ||
          normalizeCertIdentifier(c.verificationCode) === qNorm ||
          (c.enrollmentNo &&
            (c.enrollmentNo.toLowerCase() === qLower ||
              normalizeCertIdentifier(c.enrollmentNo) === qNorm))
      ) || null;

    if (!foundCert && qLower.length >= 3) {
      foundCert =
        allCerts.find((c) => c.studentName.toLowerCase().includes(qLower)) || null;
    }

    // 3. Match Enrollment / Store Order (Local + Cloud /order_status/{id})
    const localOrders = [...storage.getOrders(), ...INITIAL_ORDERS];
    let foundOrder =
      localOrders.find(
        (o) =>
          o.id.toLowerCase() === qLower ||
          normalizeCertIdentifier(o.id) === qNorm ||
          (qDigits.length >= 7 && o.whatsapp.replace(/\D/g, '').includes(qDigits)) ||
          (qLower.length >= 3 && o.studentName.toLowerCase().includes(qLower))
      ) || null;

    if (!foundOrder) {
      const cloudOrder = await storage.fetchOrderStatusFromCloud(trimmed);
      if (cloudOrder) {
        foundOrder = cloudOrder;
      }
    }

    // If certificate matched an enrollmentNo, also attach its order if available
    if (foundCert?.enrollmentNo && !foundOrder) {
      foundOrder =
        localOrders.find((o) => o.id.toLowerCase() === foundCert!.enrollmentNo!.toLowerCase()) ||
        (await storage.fetchOrderStatusFromCloud(foundCert.enrollmentNo));
    }

    // If order matched and has an explicit certificate linked to order.id, attach it
    if (foundOrder && !foundCert) {
      foundCert =
        allCerts.find(
          (c) =>
            (c.enrollmentNo && c.enrollmentNo.toLowerCase() === foundOrder!.id.toLowerCase()) ||
            c.studentName.toLowerCase() === foundOrder!.studentName.toLowerCase()
        ) || null;
    }

    // 4. If Approved Enrollment has no explicit certificate record yet, synthesize verified Sanad
    if (!foundCert && foundOrder && foundOrder.paymentStatus === 'Approved') {
      const suffix = foundOrder.id.split('-').pop() || '1001';
      const settings = storage.getSettings();
      foundCert = {
        id: `auto-${foundOrder.id}`,
        certNumber: `KOA-CERT-2026-${suffix}`,
        enrollmentNo: foundOrder.id,
        studentName: foundOrder.studentName,
        fatherName: foundOrder.fatherName,
        courseName: foundOrder.courseOrItemTitle,
        grade: 'Verified Graduate (Mumtaz)',
        issueDate: foundOrder.createdAt.split(' ')[0] || '2026',
        issuedBy: settings.founderName?.en || 'Mufti Danish Kaleem',
        verificationCode: `VER-KOA-${suffix}`
      };
    }

    return { cert: foundCert, order: foundOrder };
  },

  // Student Testimonials
  getTestimonials: (): TestimonialItem[] => {
    const stored = getStoredItem(KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    return Array.isArray(stored) ? stored : INITIAL_TESTIMONIALS;
  },
  saveTestimonials: (items: TestimonialItem[]) => {
    setStoredItem(KEYS.TESTIMONIALS, items);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      items.forEach((t) => {
        const data = sanitizeTestimonialForCloud(t, user.uid);
        setDoc(doc(db, 'testimonials', String(data.id)), data).catch((err) => {
          try {
            handleFirestoreError(err, OperationType.WRITE, `testimonials/${String(data.id)}`);
          } catch {}
        });
      });
    }
  },
  addTestimonial: (item: TestimonialItem) => {
    const items = storage.getTestimonials();
    const updated = [item, ...items];
    setStoredItem(KEYS.TESTIMONIALS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeTestimonialForCloud(item, user.uid);
      setDoc(doc(db, 'testimonials', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.CREATE, `testimonials/${String(data.id)}`);
        } catch {}
      });
    }
    return item;
  },
  updateTestimonial: (item: TestimonialItem) => {
    const items = storage.getTestimonials();
    const updated = items.map((t) => (t.id === item.id ? item : t));
    setStoredItem(KEYS.TESTIMONIALS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeTestimonialForCloud(item, user.uid);
      setDoc(doc(db, 'testimonials', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `testimonials/${String(data.id)}`);
        } catch {}
      });
    }
  },
  deleteTestimonial: (id: string) => {
    const items = storage.getTestimonials();
    const updated = items.filter((t) => t.id !== id);
    setStoredItem(KEYS.TESTIMONIALS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const cleanId = sanitizeId(id, 'test');
      deleteDoc(doc(db, 'testimonials', cleanId)).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.DELETE, `testimonials/${cleanId}`);
        } catch {}
      });
    }
  },

  // Payments
  getPayments: (): PaymentGateways => migrateLegacyPayments(getStoredItem(KEYS.PAYMENTS, INITIAL_PAYMENTS)),
  savePayments: (payments: PaymentGateways) => {
    const migrated = migrateLegacyPayments(payments);
    setStoredItem(KEYS.PAYMENTS, migrated);
    pushSiteConfigToCloud({ payments: migrated }).catch(() => {});
  },
  saveNoticeAndPayments: (notice: NoticeBanner, payments: PaymentGateways) => {
    const migratedPayments = migrateLegacyPayments(payments);
    setStoredItem(KEYS.NOTICE, notice);
    setStoredItem(KEYS.PAYMENTS, migratedPayments);
    pushSiteConfigToCloud({ notice, payments: migratedPayments }).catch(() => {});
  },

  // Media Ads & Video/Pics Gallery
  getMediaAds: (): MediaAdItem[] => getStoredItem(KEYS.MEDIA_ADS, INITIAL_MEDIA_ADS),
  saveMediaAds: (ads: MediaAdItem[]) => {
    setStoredItem(KEYS.MEDIA_ADS, ads);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      ads.forEach((ad) => {
        const data = sanitizeMediaAdForCloud(ad, user.uid);
        setDoc(doc(db, 'media_ads', String(data.id)), data).catch((err) => {
          try {
            handleFirestoreError(err, OperationType.WRITE, `media_ads/${String(data.id)}`);
          } catch {}
        });
      });
    }
  },
  addMediaAd: (ad: MediaAdItem) => {
    const ads = storage.getMediaAds();
    const updated = [ad, ...ads];
    setStoredItem(KEYS.MEDIA_ADS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeMediaAdForCloud(ad, user.uid);
      setDoc(doc(db, 'media_ads', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.CREATE, `media_ads/${String(data.id)}`);
        } catch {}
      });
    }
    return ad;
  },
  updateMediaAd: (ad: MediaAdItem) => {
    const ads = storage.getMediaAds();
    const updated = ads.map((a) => (a.id === ad.id ? ad : a));
    setStoredItem(KEYS.MEDIA_ADS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const data = sanitizeMediaAdForCloud(ad, user.uid);
      setDoc(doc(db, 'media_ads', String(data.id)), data).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.UPDATE, `media_ads/${String(data.id)}`);
        } catch {}
      });
    }
  },
  deleteMediaAd: (id: string) => {
    const ads = storage.getMediaAds();
    const updated = ads.filter((a) => a.id !== id);
    setStoredItem(KEYS.MEDIA_ADS, updated);
    const user = auth.currentUser;
    if (isPrimaryAdminUser(user) && user) {
      const cleanId = sanitizeId(id, 'ad');
      deleteDoc(doc(db, 'media_ads', cleanId)).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.DELETE, `media_ads/${cleanId}`);
        } catch {}
      });
    }
  },

  // Manual full push helper for Director
  syncAllLocalToCloud: async (): Promise<void> => {
    await syncAllLocalToCloudInternal();
  },

  // Language
  getSavedLanguage: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(KEYS.LANGUAGE);
  },
  saveLanguage: (lang: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.LANGUAGE, lang);
    notifyUpdate();
  },

  // Language Modal Shown
  hasShownLangModal: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(KEYS.LANG_MODAL_SHOWN) === 'true';
  },
  setLangModalShown: () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.LANG_MODAL_SHOWN, 'true');
  },

  // Theme (Dark / Light - Light mode default as requested)
  getTheme: (): ThemeMode => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem(KEYS.THEME) as ThemeMode) || 'light';
  },
  saveTheme: (theme: ThemeMode) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.THEME, theme);
    notifyUpdate();
  },

  // Reset to default
  resetAll: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.NOTICE);
    localStorage.removeItem(KEYS.COURSES);
    localStorage.removeItem(KEYS.STORE_ITEMS);
    localStorage.removeItem(KEYS.PUBLICATIONS);
    localStorage.removeItem(KEYS.LIVE_CLASS);
    localStorage.removeItem(KEYS.ORDERS);
    localStorage.removeItem(KEYS.CERTIFICATES);
    localStorage.removeItem(KEYS.TESTIMONIALS);
    localStorage.removeItem(KEYS.PAYMENTS);
    localStorage.removeItem(KEYS.MEDIA_ADS);
    notifyUpdate();
  },

  // Cleanup helper if ever needed
  disposeListeners: () => {
    activeListeners.forEach((u) => u());
    activeListeners = [];
    if (singletonConfigUnsub) {
      singletonConfigUnsub();
      singletonConfigUnsub = null;
    }
    syncInitialized = false;
  }
};
