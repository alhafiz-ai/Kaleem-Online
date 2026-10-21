import { SiteSettings, NoticeBanner, Course, StoreItem, LiveClassLink, EnrollmentOrder, CertificateRecord, PaymentGateways, MediaAdItem, PublicationItem, ThemeMode } from '../types';
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
  INITIAL_PUBLICATIONS
} from '../data/initialData';

const KEYS = {
  SETTINGS: 'aldanish_settings_v1',
  NOTICE: 'aldanish_notice_v1',
  COURSES: 'aldanish_courses_v1',
  STORE_ITEMS: 'aldanish_store_items_v1',
  PUBLICATIONS: 'aldanish_publications_v1',
  LIVE_CLASS: 'aldanish_live_class_v1',
  ORDERS: 'aldanish_orders_v1',
  CERTIFICATES: 'aldanish_certificates_v1',
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

export const storage = {
  // Settings
  getSettings: (): SiteSettings => {
    const s = getStoredItem(KEYS.SETTINGS, INITIAL_SETTINGS);
    if (s && s.siteTitle) {
      if (s.siteTitle.ur === "ادارہ دانش الاسلامی و اللغات العربیہ") {
        s.siteTitle.ur = "ادارہ دانش برائے تعلیماتِ اسلامیہ و علومِ عربیہ";
      }
      if (!s.siteTitle.ar || s.siteTitle.ar.includes("و اللغات العربیہ")) {
        s.siteTitle.ar = "أكاديمية الدانش العالمية للعلوم الإسلامية واللغة العربية";
      }
    }
    if (s && !s.founderImage) {
      s.founderImage = "/assets/aistudio/founder.jpg_450b2eb5.jpeg";
    }
    return s;
  },
  saveSettings: (settings: SiteSettings) => setStoredItem(KEYS.SETTINGS, settings),

  // Notice Banner
  getNotice: (): NoticeBanner => getStoredItem(KEYS.NOTICE, INITIAL_NOTICE),
  saveNotice: (notice: NoticeBanner) => setStoredItem(KEYS.NOTICE, notice),

  // Courses
  getCourses: (): Course[] => getStoredItem(KEYS.COURSES, INITIAL_COURSES),
  saveCourses: (courses: Course[]) => setStoredItem(KEYS.COURSES, courses),
  addCourse: (course: Course) => {
    const courses = storage.getCourses();
    const updated = [course, ...courses];
    storage.saveCourses(updated);
    return course;
  },
  updateCourse: (course: Course) => {
    const courses = storage.getCourses();
    const updated = courses.map(c => c.id === course.id ? course : c);
    storage.saveCourses(updated);
  },
  deleteCourse: (id: string) => {
    const courses = storage.getCourses();
    const updated = courses.filter(c => c.id !== id);
    storage.saveCourses(updated);
  },

  // Store Items (Digital Products, PDFs, Video lessons)
  getStoreItems: (): StoreItem[] => getStoredItem(KEYS.STORE_ITEMS, INITIAL_STORE_ITEMS),
  saveStoreItems: (items: StoreItem[]) => setStoredItem(KEYS.STORE_ITEMS, items),
  addStoreItem: (item: StoreItem) => {
    const items = storage.getStoreItems();
    const updated = [item, ...items];
    storage.saveStoreItems(updated);
    return item;
  },
  updateStoreItem: (item: StoreItem) => {
    const items = storage.getStoreItems();
    const updated = items.map(i => i.id === item.id ? item : i);
    storage.saveStoreItems(updated);
  },
  deleteStoreItem: (id: string) => {
    const items = storage.getStoreItems();
    const updated = items.filter(i => i.id !== id);
    storage.saveStoreItems(updated);
  },

  // Publications & Research PDFs
  getPublications: (): PublicationItem[] => getStoredItem(KEYS.PUBLICATIONS, INITIAL_PUBLICATIONS),
  savePublications: (pubs: PublicationItem[]) => setStoredItem(KEYS.PUBLICATIONS, pubs),
  addPublication: (pub: PublicationItem) => {
    const pubs = storage.getPublications();
    const updated = [pub, ...pubs];
    storage.savePublications(updated);
    return pub;
  },
  deletePublication: (id: string) => {
    const pubs = storage.getPublications();
    const updated = pubs.filter(p => p.id !== id);
    storage.savePublications(updated);
  },

  // Live Class Link
  getLiveClass: (): LiveClassLink => getStoredItem(KEYS.LIVE_CLASS, INITIAL_LIVE_CLASS),
  saveLiveClass: (liveClass: LiveClassLink) => setStoredItem(KEYS.LIVE_CLASS, liveClass),

  // Orders / Enrollments
  getOrders: (): EnrollmentOrder[] => getStoredItem(KEYS.ORDERS, INITIAL_ORDERS),
  saveOrders: (orders: EnrollmentOrder[]) => setStoredItem(KEYS.ORDERS, orders),
  addOrder: (order: EnrollmentOrder) => {
    const orders = storage.getOrders();
    const updated = [order, ...orders];
    storage.saveOrders(updated);
    return order;
  },
  updateOrderStatus: (orderId: string, status: 'Pending' | 'Approved' | 'Declined') => {
    const orders = storage.getOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o);
    storage.saveOrders(updated);
  },
  deleteOrder: (orderId: string) => {
    const orders = storage.getOrders();
    const updated = orders.filter(o => o.id !== orderId);
    storage.saveOrders(updated);
  },

  // Certificates
  getCertificates: (): CertificateRecord[] => getStoredItem(KEYS.CERTIFICATES, INITIAL_CERTIFICATES),
  saveCertificates: (certs: CertificateRecord[]) => setStoredItem(KEYS.CERTIFICATES, certs),
  addCertificate: (cert: CertificateRecord) => {
    const certs = storage.getCertificates();
    const updated = [cert, ...certs];
    storage.saveCertificates(updated);
    return cert;
  },

  // Payments
  getPayments: (): PaymentGateways => getStoredItem(KEYS.PAYMENTS, INITIAL_PAYMENTS),
  savePayments: (payments: PaymentGateways) => setStoredItem(KEYS.PAYMENTS, payments),

  // Media Ads & Video/Pics Gallery
  getMediaAds: (): MediaAdItem[] => getStoredItem(KEYS.MEDIA_ADS, INITIAL_MEDIA_ADS),
  saveMediaAds: (ads: MediaAdItem[]) => setStoredItem(KEYS.MEDIA_ADS, ads),
  addMediaAd: (ad: MediaAdItem) => {
    const ads = storage.getMediaAds();
    const updated = [ad, ...ads];
    storage.saveMediaAds(updated);
    return ad;
  },
  updateMediaAd: (ad: MediaAdItem) => {
    const ads = storage.getMediaAds();
    const updated = ads.map(a => a.id === ad.id ? ad : a);
    storage.saveMediaAds(updated);
  },
  deleteMediaAd: (id: string) => {
    const ads = storage.getMediaAds();
    const updated = ads.filter(a => a.id !== id);
    storage.saveMediaAds(updated);
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
    localStorage.removeItem(KEYS.PAYMENTS);
    localStorage.removeItem(KEYS.MEDIA_ADS);
    notifyUpdate();
  }
};
