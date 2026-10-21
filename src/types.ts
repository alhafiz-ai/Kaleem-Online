export type Language = 'ur' | 'en' | 'ar';
export type ThemeMode = 'dark' | 'light';

export interface LocalizedString {
  ur: string;
  en: string;
  ar: string;
}

export interface NoticeBanner {
  enabled: boolean;
  text: LocalizedString;
  badge: LocalizedString;
  linkText?: LocalizedString;
  linkUrl?: string;
  urgentLevel: 'info' | 'urgent' | 'announcement';
}

export interface SiteSettings {
  siteTitle: LocalizedString;
  tagline: LocalizedString;
  founderName: LocalizedString;
  founderTitle: LocalizedString;
  founderBio: LocalizedString;
  founderImage?: string; // Portrait picture URL or path (e.g. /assets/aistudio/founder.jpg_450b2eb5.jpeg)
  founderDegrees?: LocalizedString[];
  founderExperience?: LocalizedString;
  primaryColor: string; // e.g. #064e3b
  accentColor: string; // e.g. #d97706
  adminPassword: string; // Default: 'admin123'
  whatsappNumber: string; // e.g. '+923001234567'
  contactEmail: string;
  activeSections: {
    hero: boolean;
    founder: boolean;
    courses: boolean;
    store: boolean;
    publications: boolean;
    mediaAds: boolean;
    scholarApps: boolean;
    payments: boolean;
    policies: boolean;
  };
  // Advanced Theme & Background Controls
  navbarBg?: string; // Upper banner / navbar background
  pageBg?: string;   // Page / beneath body background
  cardBg?: string;   // Cards background
  cardBorder?: string; // Cards border color
  textColor?: string;  // Text color override
  // Academy Policies (Editable in Admin)
  policies?: {
    refund: LocalizedString;
    privacy: LocalizedString;
    payment: LocalizedString;
    terms: LocalizedString;
  };
}

export interface Course {
  id: string;
  title: LocalizedString;
  category: 'tajweed' | 'arabic' | 'hadith_fiqh' | 'tafseer' | 'fatawa' | 'hifz' | 'qirat';
  description: LocalizedString;
  feeMonthlyPKR: number;
  feeUSD: number;
  duration: LocalizedString;
  classesPerWeek: number;
  instructor: LocalizedString;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  features: string[]; // Curriculum & Syllabus modules
  timing?: LocalizedString;
  isVisible: boolean;
  isPopular?: boolean;
}

export interface StoreItem {
  id: string;
  title: LocalizedString;
  category: 'package' | 'video' | 'pdf' | 'audio' | 'session';
  pricePKR: number;
  priceUSD: number;
  description: LocalizedString;
  includes: string[];
  formatBadge: string;
  badgeColor?: string;
  isVisible: boolean;
  fileName?: string;
  fileSize?: string;
  fileData?: string;
}

export interface LiveClassLink {
  platform: 'Zoom' | 'Google Meet' | 'Microsoft Teams';
  meetingUrl: string;
  meetingId: string;
  passcode: string;
  scheduleText: LocalizedString;
  accessRestriction: 'public' | 'enrolled_only' | 'direct_share';
  lastUpdated: string;
}

export interface EnrollmentOrder {
  id: string;
  studentName: string;
  fatherName: string;
  countryCity: string;
  whatsapp: string;
  email?: string;
  type: 'live_course' | 'store_purchase';
  courseOrItemTitle: string;
  selectedStoreItems?: { id: string; title: string; pricePKR: number }[];
  preferredTime: 'morning' | 'afternoon' | 'evening';
  classFrequency?: string;
  knowledgeLevel?: string;
  totalAmountPKR: number;
  paymentMethod: 'easypaisa' | 'jazzcash' | 'sadapay' | 'bank' | 'card_overseas' | 'wise_paypal';
  paymentStatus: 'Pending' | 'Approved' | 'Declined';
  transactionId?: string;
  notes?: string;
  createdAt: string;
}

export interface CertificateRecord {
  id: string;
  certNumber: string;
  enrollmentNo?: string;
  studentName: string;
  fatherName: string;
  courseName: string;
  grade: string;
  issueDate: string;
  issuedBy: string;
  verificationCode: string;
}

export interface PaymentGateways {
  easypaisa: {
    accountTitle: string;
    accountNumber: string;
    instructions: LocalizedString;
  };
  jazzcash: {
    accountTitle: string;
    accountNumber: string;
    instructions: LocalizedString;
  };
  sadapay: {
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  bank: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCode: string;
  };
  overseas: {
    wiseEmail: string;
    wiseAccountTitle?: string;
    paypalEmail: string;
    paypalMeLink?: string;
    westernUnionName: string;
    bankSwift?: string;
    internationalIban?: string;
    cardPortalUrl?: string;
    instructions: LocalizedString;
  };
}

export interface PublicationItem {
  id: string;
  title: LocalizedString;
  category: LocalizedString;
  author: LocalizedString;
  pages: number;
  summary: LocalizedString;
  fullExcerpt: string;
  downloadFilename: string;
  isFatawa?: boolean;
  fileData?: string;
  fileSize?: string;
  isVisible?: boolean;
}

export interface MediaAdItem {
  id: string;
  title: LocalizedString;
  type: 'poster' | 'video' | 'announcement';
  mediaUrl: string;
  thumbnailUrl?: string;
  badge: LocalizedString;
  description: LocalizedString;
  ctaText?: LocalizedString;
  ctaLink?: string;
  isVisible: boolean;
}

export interface ScholarApp {
  id: string;
  name: LocalizedString;
  arabicName: string;
  description: LocalizedString;
  url: string;
  badge: string;
  tags: string[];
}
