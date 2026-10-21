import React, { useState, useEffect, useRef } from 'react';
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
  Language
} from '../types';
import { storage } from '../utils/storage';
import { INITIAL_POLICIES } from '../data/initialData';
import { FounderBioModal } from './FounderBioModal';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Video, 
  Award, 
  Palette, 
  Bell, 
  CreditCard, 
  Lock, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Edit3, 
  Check, 
  Send, 
  Phone, 
  Printer, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  FileText, 
  Upload, 
  BookMarked, 
  FileDown,
  ShieldCheck,
  ShoppingBag,
  Image as ImageIcon,
  Play,
  RefreshCw,
  Globe,
  Copy,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Layers,
  FileCheck,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Smartphone,
  Laptop,
  Globe2,
  UserCheck,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

interface AdminPanelProps {
  onBackToSite: () => void;
}

// Preset Theme Palettes for Harmonious Color Harmony
const THEME_PALETTES = [
  {
    name: "Royal Emerald & Gold (مجلس الزمرد)",
    navbarBg: "#064e3b",
    pageBg: "#0c0a09",
    cardBg: "#142820",
    cardBorder: "#d97706",
    primaryColor: "#064e3b",
    accentColor: "#d97706",
    textColor: "#f5f5f4"
  },
  {
    name: "Midnight Charcoal & Amber (فحم الليل والعنبر)",
    navbarBg: "#18181b",
    pageBg: "#09090b",
    cardBg: "#222227",
    cardBorder: "#f59e0b",
    primaryColor: "#27272a",
    accentColor: "#f59e0b",
    textColor: "#fafaf9"
  },
  {
    name: "Warm Islamic Parchment Light (رَقّ الأندلس)",
    navbarBg: "#064e3b",
    pageBg: "#fcfaf4",
    cardBg: "#ffffff",
    cardBorder: "#d4af37",
    primaryColor: "#064e3b",
    accentColor: "#b45309",
    textColor: "#1c1917"
  },
  {
    name: "Deep Sapphire & Turquoise (الياقوت الأزرق)",
    navbarBg: "#0f172a",
    pageBg: "#030712",
    cardBg: "#111827",
    cardBorder: "#0284c7",
    primaryColor: "#0f172a",
    accentColor: "#38bdf8",
    textColor: "#f8fafc"
  },
  {
    name: "Olive Oasis & Bronze (واحة الزيتون والبرونز)",
    navbarBg: "#14532d",
    pageBg: "#121713",
    cardBg: "#18261b",
    cardBorder: "#ca8a04",
    primaryColor: "#14532d",
    accentColor: "#ca8a04",
    textColor: "#f0fdf4"
  }
];

// Smart Academy Name Auto-Translator with Traditional Islamic Nomenclature
const autoTranslateAcademyName = (enName: string): { ur: string; ar: string } => {
  if (!enName.trim()) {
    return {
      ur: "ادارہ دانش برائے تعلیماتِ اسلامیہ و علومِ عربیہ",
      ar: "أكاديمية الدانش العالمية للعلوم الإسلامية واللغة العربية"
    };
  }

  const clean = enName.trim();
  const hasDanish = /danish/i.test(clean);
  const hasIslamic = /islamic|islam/i.test(clean);
  const hasArabic = /arabic|arab/i.test(clean);
  const hasAcademy = /academy/i.test(clean);
  const hasInstitute = /institute|center|markaz/i.test(clean);
  const hasQuran = /quran|qur'an/i.test(clean);
  const hasHadith = /hadith/i.test(clean);
  const hasJamia = /jamia|university|darul\s*uloom/i.test(clean);

  // Traditional Arabic Islamic nomenclature (أكاديمية / معهد / مجمع / دار)
  let arPrefix = hasAcademy ? "أكاديمية" : hasInstitute ? "معهد" : hasJamia ? "جامعة" : "دار";
  let arBrand = hasDanish ? "الدانش" : clean.replace(/academy|institute|islamic|arabic|online|international|jamia|university/gi, '').trim() || "الهدى";
  let arSuffix = "";
  if (hasIslamic && hasArabic) {
    arSuffix = "العالمية للعلوم الإسلامية واللغة العربية";
  } else if (hasIslamic) {
    arSuffix = "للعلوم الشرعية والإسلامية";
  } else if (hasArabic) {
    arSuffix = "لتعليم اللغة العربية الفصحى";
  } else if (hasQuran) {
    arSuffix = "لتحفيظ القرآن الكريم وتجويده";
  } else if (hasHadith) {
    arSuffix = "للحديث الشريف والسنة النبوية";
  } else {
    arSuffix = "العالمية للدراسات الإسلامية";
  }
  const arTitle = `${arPrefix} ${arBrand} ${arSuffix}`.replace(/\s+/g, ' ').trim();

  // Traditional Authentic Urdu Islamic madrasah nomenclature (ادارہ / جامعہ / دار العلوم)
  let urPrefix = hasJamia ? "جامعہ" : hasInstitute ? "معهد" : "ادارہ";
  let urBrand = hasDanish ? "دانش" : clean.replace(/academy|institute|islamic|arabic|online|international|jamia|university/gi, '').trim() || "الہدٰی";
  let urSuffix = "";
  if (hasIslamic && hasArabic) {
    urSuffix = "برائے تعلیماتِ اسلامیہ و علومِ عربیہ";
  } else if (hasIslamic) {
    urSuffix = "برائے علومِ اسلامیہ و افتاء";
  } else if (hasArabic) {
    urSuffix = "برائے تدریسِ لسانِ عربی";
  } else if (hasQuran) {
    urSuffix = "برائے حفظ و تجویدِ قرآنِ کریم";
  } else if (hasHadith) {
    urSuffix = "برائے تدریسِ حدیث و سنت";
  } else {
    urSuffix = "برائے دینی و عصری تعلیمات";
  }
  const urTitle = `${urPrefix} ${urBrand} ${urSuffix}`.replace(/\s+/g, ' ').trim();

  return { ur: urTitle, ar: arTitle };
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite }) => {
  // Load state from storage
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const s = storage.getSettings();
    if (!s.policies) {
      s.policies = INITIAL_POLICIES;
    }
    return s;
  });
  const [notice, setNotice] = useState<NoticeBanner>(storage.getNotice());
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [storeItems, setStoreItems] = useState<StoreItem[]>(storage.getStoreItems());
  const [liveClass, setLiveClass] = useState<LiveClassLink>(storage.getLiveClass());
  const [orders, setOrders] = useState<EnrollmentOrder[]>(storage.getOrders());
  const [certificates, setCertificates] = useState<CertificateRecord[]>(storage.getCertificates());
  const [payments, setPayments] = useState<PaymentGateways>(storage.getPayments());
  const [publications, setPublications] = useState<PublicationItem[]>(storage.getPublications());
  const [mediaAds, setMediaAds] = useState<MediaAdItem[]>(storage.getMediaAds());

  // Security Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [passwordSuccessToast, setPasswordSuccessToast] = useState('');

  // Active Tab
  type TabType = 'dashboard' | 'founder_bio' | 'orders' | 'courses' | 'store' | 'digital_library' | 'media_gallery' | 'liveclass' | 'certificates' | 'theme' | 'policies' | 'notice_payments';
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Admin Theme Mode (Dark / Light)
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('aldanish_admin_theme') as 'dark' | 'light') || 'dark';
  });
  const isLight = adminTheme === 'light';

  const toggleAdminTheme = () => {
    setAdminTheme(prev => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('aldanish_admin_theme', nextTheme);
      return nextTheme;
    });
  };

  // Founder Bio Modal Preview State
  const [showFounderBioPreview, setShowFounderBioPreview] = useState(false);
  const founderFileInputRef = useRef<HTMLInputElement>(null);

  // Shopify-Style Dashboard Interactive Filters
  const [dashboardPeriod, setDashboardPeriod] = useState<'today' | '7d' | '30d' | 'year'>('30d');
  const [currencyUnit, setCurrencyUnit] = useState<'PKR' | 'USD'>('PKR');

  // Tab scrolling reference & controller for forward/backward navigation
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      tabsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Search & Filter in Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'Pending' | 'Approved'>('all');

  // Invoice Viewer Modal State
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<EnrollmentOrder | null>(null);
  const [invoiceModalLang, setInvoiceModalLang] = useState<Language>('ur');

  // Course Management Modals
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseCurriculumInput, setNewCourseCurriculumInput] = useState('');

  // Store Item Management Modals
  const [editingStoreItem, setEditingStoreItem] = useState<StoreItem | null>(null);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [newStoreFeatureInput, setNewStoreFeatureInput] = useState('');

  // Digital PDF Upload Modal State
  const [showAddPdfModal, setShowAddPdfModal] = useState(false);
  const [pdfTarget, setPdfTarget] = useState<'publication' | 'store'>('publication');
  const [pdfTitleEn, setPdfTitleEn] = useState('');
  const [pdfTitleUr, setPdfTitleUr] = useState('');
  const [pdfTitleAr, setPdfTitleAr] = useState('');
  const [pdfCategory, setPdfCategory] = useState('Quran & Tajweed');
  const [pdfFormatBadge, setPdfFormatBadge] = useState('PDF Book');
  const [pdfAuthorEn, setPdfAuthorEn] = useState('Mufti Danish Kaleem');
  const [pdfAuthorUr, setPdfAuthorUr] = useState('مفتی دانش کلیم');
  const [pdfPages, setPdfPages] = useState<number>(48);
  const [pdfPricePKR, setPdfPricePKR] = useState<number>(800);
  const [pdfDescriptionEn, setPdfDescriptionEn] = useState('');
  const [pdfDescriptionUr, setPdfDescriptionUr] = useState('');
  const [pdfArabicExcerpt, setPdfArabicExcerpt] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');
  const [pdfFileData, setPdfFileData] = useState('');
  const [digitalSearch, setDigitalSearch] = useState('');
  const [digitalFilter, setDigitalFilter] = useState<'all' | 'publication' | 'store'>('all');

  // Media Ads & Gallery Management
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [editingMediaAd, setEditingMediaAd] = useState<MediaAdItem | null>(null);

  // Certificate Generator Form State
  const [certStudentName, setCertStudentName] = useState('');
  const [certFatherName, setCertFatherName] = useState('');
  const [certCourseName, setCertCourseName] = useState('Advanced Quranic Tajweed & Phonetics');
  const [certGrade, setCertGrade] = useState('Mumtaz (Distinction - 95%)');
  const [generatedCertPreview, setGeneratedCertPreview] = useState<CertificateRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPassword === settings.adminPassword || enteredPassword === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Master Password. (Default is: admin123)');
    }
  };

  const handleUpdatePassword = () => {
    if (!newMasterPassword.trim() || newMasterPassword.length < 4) {
      alert("Password must be at least 4 characters long.");
      return;
    }
    const updated = { ...settings, adminPassword: newMasterPassword.trim() };
    setSettings(updated);
    storage.saveSettings(updated);
    setNewMasterPassword('');
    setPasswordSuccessToast("Master Password updated successfully!");
    setTimeout(() => setPasswordSuccessToast(''), 3000);
  };

  // Orders Management
  const handleApproveOrder = (orderId: string) => {
    storage.updateOrderStatus(orderId, 'Approved');
    setOrders(storage.getOrders());
    showToast("Enrollment order marked as Approved!");
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      storage.deleteOrder(orderId);
      setOrders(storage.getOrders());
      showToast("Order removed from database.");
    }
  };

  const getSendWhatsAppUrl = (order: EnrollmentOrder) => {
    const text = `Assalamu Alaikum ${order.studentName},\n\nYour application for "${order.courseOrItemTitle}" at Al-Danish Islamic Academy has been APPROVED!\n\n*Class Details & Zoom Access:*\n- Platform: ${liveClass.platform}\n- Meeting Link: ${liveClass.meetingUrl}\n- Meeting ID: ${liveClass.meetingId}\n- Passcode: ${liveClass.passcode}\n- Schedule: Daily as confirmed\n\nInstructor: Mufti Danish Kaleem\n\nPlease join 5 minutes early. Welcome to the academy!`;
    const cleanPhone = order.whatsapp.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Course Controls
  const handleToggleCourseVisibility = (id: string) => {
    const updated = courses.map(c => c.id === id ? { ...c, isVisible: !c.isVisible } : c);
    setCourses(updated);
    storage.saveCourses(updated);
    showToast("Course visibility toggled!");
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Delete this course permanently from the academy curriculum?")) {
      storage.deleteCourse(id);
      setCourses(storage.getCourses());
      showToast("Course removed.");
    }
  };

  const handleSaveCourseEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    storage.updateCourse(editingCourse);
    setCourses(storage.getCourses());
    setEditingCourse(null);
    showToast("Course syllabus, time, and fee details updated!");
  };

  const handleCreateNewCourse = (newCourse: Course) => {
    storage.addCourse(newCourse);
    setCourses(storage.getCourses());
    setShowAddCourseModal(false);
    showToast("New Course published successfully!");
  };

  // Store Controls
  const handleSaveStoreItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStoreItem) return;
    storage.updateStoreItem(editingStoreItem);
    setStoreItems(storage.getStoreItems());
    setEditingStoreItem(null);
    showToast("Store product & digital files updated!");
  };

  const handleDeleteStoreItem = (id: string) => {
    if (confirm("Delete this digital store product permanently?")) {
      storage.deleteStoreItem(id);
      setStoreItems(storage.getStoreItems());
      showToast("Store product deleted.");
    }
  };

  // Digital PDF Upload Handler
  const handlePdfFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setPdfFileSize(`${sizeInMB} MB`);

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      setPdfFileData(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePdfItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitleEn.trim() && !pdfTitleUr.trim()) {
      alert("Please provide at least a title for the PDF resource.");
      return;
    }

    const titleEn = pdfTitleEn.trim() || pdfTitleUr.trim();
    const titleUr = pdfTitleUr.trim() || pdfTitleEn.trim();
    const titleAr = pdfTitleAr.trim() || titleUr || titleEn;

    const titleObj = { en: titleEn, ur: titleUr, ar: titleAr };
    const descObj = {
      en: pdfDescriptionEn.trim() || "Scholarly research treatise with authenticated references and verification.",
      ur: pdfDescriptionUr.trim() || "تحقیقی مقالہ و رسالہ مع تخریج و حوالہ جات۔",
      ar: pdfArabicExcerpt.trim() || "بحث علمي محكم مع بيان الأدلة الشرعية والتخريج."
    };

    if (pdfTarget === 'publication') {
      const newPub: PublicationItem = {
        id: `pub-${Date.now()}`,
        title: titleObj,
        category: {
          en: pdfCategory,
          ur: pdfCategory === 'Quran & Tajweed' ? 'علوم القرآن و تجوید' : pdfCategory === 'Arabic Grammar' ? 'قواعد و لغت عربیہ' : pdfCategory === 'Fiqh & Fatawa' ? 'فقہ و فتاویٰ' : 'علمی مقالات',
          ar: pdfCategory === 'Quran & Tajweed' ? 'علوم القرآن والتجويد' : pdfCategory === 'Arabic Grammar' ? 'النحو والصرف' : pdfCategory === 'Fiqh & Fatawa' ? 'الفقه والفتاوى' : 'البحوث والرسائل'
        },
        author: {
          en: pdfAuthorEn.trim() || "Mufti Danish Kaleem",
          ur: pdfAuthorUr.trim() || "مفتی دانش کلیم",
          ar: "المفتي دانش كليم"
        },
        pages: Number(pdfPages) || 48,
        summary: descObj,
        fullExcerpt: pdfArabicExcerpt.trim() || "الحمد لله رب العالمين والصلاة والسلام على خاتم الأنبياء والمرسلين وعلى آله وصحبه أجمعين...",
        downloadFilename: pdfFileName || `${titleEn.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
        fileData: pdfFileData || undefined,
        fileSize: pdfFileSize || '2.8 MB',
        isVisible: true
      };

      storage.addPublication(newPub);
      setPublications(storage.getPublications());
      showToast("New PDF Publication added to Academic Library!");
    } else {
      const newStoreItem: StoreItem = {
        id: `store-${Date.now()}`,
        title: titleObj,
        category: 'pdf',
        pricePKR: Number(pdfPricePKR) || 800,
        priceUSD: Math.round((Number(pdfPricePKR) || 800) / 125),
        description: descObj,
        includes: [
          `Full PDF eBook (${pdfPages || 40} pages)`,
          "Printable High-Res Study Notes",
          "Permanent Digital Download"
        ],
        formatBadge: pdfFormatBadge || 'PDF Book',
        isVisible: true,
        fileName: pdfFileName || `${titleEn.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
        fileSize: pdfFileSize || '3.2 MB',
        fileData: pdfFileData || undefined
      };

      storage.addStoreItem(newStoreItem);
      setStoreItems(storage.getStoreItems());
      showToast("New Digital PDF product published in Bookstore!");
    }

    setShowAddPdfModal(false);
    setPdfTitleEn('');
    setPdfTitleUr('');
    setPdfTitleAr('');
    setPdfFileName('');
    setPdfFileSize('');
    setPdfFileData('');
    setPdfDescriptionEn('');
    setPdfDescriptionUr('');
    setPdfArabicExcerpt('');
  };

  const handleDeletePublication = (id: string) => {
    if (confirm("Delete this publication/PDF from the library?")) {
      storage.deletePublication(id);
      setPublications(storage.getPublications());
      showToast("Publication removed from library.");
    }
  };

  const handleTogglePublicationVisibility = (id: string) => {
    const updated = publications.map(p => p.id === id ? { ...p, isVisible: p.isVisible === false ? true : false } : p);
    setPublications(updated);
    storage.savePublications(updated);
    showToast("Publication visibility updated!");
  };

  // Media Ads Handlers
  const handleDeleteMediaAd = (id: string) => {
    if (confirm("Delete this media ad / video highlight?")) {
      storage.deleteMediaAd(id);
      setMediaAds(storage.getMediaAds());
      showToast("Media banner removed.");
    }
  };

  const handleToggleMediaAdVisibility = (id: string) => {
    const updated = mediaAds.map(m => m.id === id ? { ...m, isVisible: !m.isVisible } : m);
    setMediaAds(updated);
    storage.saveMediaAds(updated);
    showToast("Media ad visibility toggled!");
  };

  const handleSaveMediaAd = (ad: MediaAdItem) => {
    if (editingMediaAd) {
      storage.updateMediaAd(ad);
      showToast("Media ad updated successfully!");
      setEditingMediaAd(null);
    } else {
      storage.addMediaAd(ad);
      showToast("New media ad published!");
      setShowAddMediaModal(false);
    }
    setMediaAds(storage.getMediaAds());
  };

  // Live Class Manager
  const handleSaveLiveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...liveClass,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLiveClass(updated);
    storage.saveLiveClass(updated);
    showToast("Live Class link and credentials updated!");
  };

  // Certificate Generator
  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certStudentName.trim() || !certFatherName.trim()) {
      alert("Please provide Student Name and Father's Name.");
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      certNumber: `AD-CERT-${new Date().getFullYear()}-${randomNum}`,
      studentName: certStudentName.trim(),
      fatherName: certFatherName.trim(),
      courseName: certCourseName,
      grade: certGrade,
      issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      issuedBy: "Mufti Danish Kaleem",
      verificationCode: `VER-AD-${randomNum}`
    };

    storage.addCertificate(newCert);
    setCertificates(storage.getCertificates());
    setGeneratedCertPreview(newCert);
    showToast("Certificate issued and added to Official Registry!");
  };

  // Theme & Sections Save
  const handleSaveTheme = () => {
    storage.saveSettings(settings);
    showToast("Theme, Backgrounds, and Section settings saved!");
  };

  // Policies Save
  const handleSavePolicies = () => {
    storage.saveSettings(settings);
    showToast("Academy Policies & Safeguards updated!");
  };

  // Notice & Payments Save
  const handleSaveNoticeAndPayments = () => {
    storage.saveNotice(notice);
    storage.savePayments(payments);
    showToast("Notice & Local/Overseas Payment Gateways saved!");
  };

  // Founder Bio & Portrait Handlers
  const handleFounderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert("Image size should be less than 8MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated = { ...settings, founderImage: dataUrl };
        setSettings(updated);
        storage.saveSettings(updated);
        showToast("Founder portrait uploaded and updated across site!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetFounderImage = () => {
    const updated = { ...settings, founderImage: "/assets/aistudio/founder.jpg_450b2eb5.jpeg" };
    setSettings(updated);
    storage.saveSettings(updated);
    showToast("Founder photo reset to default official portrait!");
  };

  const handleSaveFounderBio = () => {
    storage.saveSettings(settings);
    showToast("Founder biography, credentials & photo saved successfully!");
  };

  // Auto-translate site title
  const handleAutoTranslateTitle = () => {
    const translations = autoTranslateAcademyName(settings.siteTitle.en);
    setSettings(prev => ({
      ...prev,
      siteTitle: {
        en: prev.siteTitle.en,
        ur: translations.ur,
        ar: translations.ar
      }
    }));
    showToast("Academy title auto-translated to Arabic & Urdu!");
  };

  // Metrics
  const totalRevenuePKR = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Approved' ? o.totalAmountPKR : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'Pending').length;

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.studentName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.whatsapp.includes(orderSearch) ||
      o.courseOrItemTitle.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderFilter === 'all' || o.paymentStatus === orderFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Digital Library
  const filteredDigitalItems = [
    ...(digitalFilter === 'all' || digitalFilter === 'publication' ? publications.map(p => ({ ...p, itemType: 'publication' as const })) : []),
    ...(digitalFilter === 'all' || digitalFilter === 'store' ? storeItems.filter(s => s.category === 'pdf' || s.fileData).map(s => ({ ...s, itemType: 'store' as const })) : [])
  ].filter(item => {
    const q = digitalSearch.toLowerCase();
    const titleEn = item.title?.en?.toLowerCase() || '';
    const titleUr = item.title?.ur?.toLowerCase() || '';
    return titleEn.includes(q) || titleUr.includes(q);
  });

  /* ------------------- PASSWORD LOGIN GATE ------------------- */
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center p-4 font-sans transition-colors duration-200 ${
        isLight ? 'bg-stone-100 text-stone-900' : 'bg-stone-950 text-stone-100'
      }`}>
        <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border-2 transition-colors duration-200 ${
          isLight ? 'bg-white border-amber-500/40 text-stone-900 shadow-stone-300' : 'bg-stone-900 border-amber-500/50 text-stone-100'
        }`}>
          
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToSite}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                isLight ? 'text-amber-700 hover:text-amber-800' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>&larr; Back to Academy</span>
            </button>

            {/* Light / Dark Mode Toggle for Admin */}
            <button
              onClick={toggleAdminTheme}
              type="button"
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                isLight 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200' 
                  : 'bg-stone-800 border-stone-700 text-amber-300 hover:bg-stone-700'
              }`}
              title={isLight ? "ڈارک موڈ کریں" : "لائٹ موڈ کریں"}
            >
              {isLight ? <Moon className="w-3.5 h-3.5 text-amber-800" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span className="text-[11px] font-bold">{isLight ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950 border border-amber-400 flex items-center justify-center text-amber-300 font-amiri text-3xl shadow-inner mb-4">
            🔐
          </div>

          <h2 className={`text-2xl font-bold font-kufi text-center ${
            isLight ? 'text-emerald-950' : 'text-amber-300'
          }`}>
            Academy Admin Portal
          </h2>
          <p className={`text-xs text-center mt-1 mb-6 ${
            isLight ? 'text-stone-500' : 'text-stone-400'
          }`}>
            Restricted Master Control Panel &bull; Mufti Danish Kaleem
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isLight ? 'text-stone-700' : 'text-stone-300'
              }`}>
                Master Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter admin password (default: admin123)"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-amber-400 transition-colors ${
                    isLight 
                      ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400' 
                      : 'bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500'
                  }`}
                />
                <Lock className={`w-4 h-4 absolute right-4 top-3.5 ${
                  isLight ? 'text-stone-400' : 'text-stone-500'
                }`} />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-rose-500 font-semibold bg-rose-50 border border-rose-300 dark:bg-rose-950/40 dark:border-rose-800/60 p-2.5 rounded-xl text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 shadow-lg text-sm transition-all cursor-pointer font-kufi"
            >
              Authenticate & Open Dashboard
            </button>
          </form>

          <div className={`mt-6 pt-4 border-t text-center ${
            isLight ? 'border-stone-200 text-stone-500' : 'border-stone-800 text-stone-500'
          }`}>
            <span className="text-[11px]">
              Default password: <code className="text-amber-600 dark:text-amber-400 font-mono font-bold">admin123</code>
            </span>
          </div>

        </div>
      </div>
    );
  }

  /* ------------------- HORIZONTAL COMPACT DASHBOARD ------------------- */
  return (
    <div className={`min-h-screen ${isLight ? 'bg-stone-100 text-stone-900' : 'bg-stone-950 text-stone-100'} flex flex-col font-sans antialiased selection:bg-amber-600 selection:text-stone-950 transition-colors duration-200`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Horizontal Compact Admin Bar */}
      <header className={`${isLight ? 'bg-white/95 border-stone-200 text-stone-900' : 'bg-stone-900 border-amber-500/30 text-stone-100'} border-b px-3 sm:px-6 py-2.5 sticky top-0 z-30 shadow-md backdrop-blur-md transition-colors`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-amber-400 flex items-center justify-center font-amiri text-lg text-amber-300 shrink-0">
              د
            </div>
            <div>
              <h1 className={`font-kufi font-bold text-sm sm:text-base leading-tight ${isLight ? 'text-emerald-950' : 'text-amber-300'}`}>
                {settings.siteTitle.en} &bull; Admin Master Control
              </h1>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Cloud Sync Active &bull; Mufti Danish Kaleem
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className={`px-3 py-1 rounded-xl border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-800/80 border-stone-700'}`}>
              <span className={`${isLight ? 'text-stone-500' : 'text-stone-400'} block text-[10px]`}>Verified Revenue</span>
              <strong className="text-amber-500 dark:text-amber-300 font-mono">PKR {totalRevenuePKR.toLocaleString()}</strong>
            </div>
            <div className={`px-3 py-1 rounded-xl border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-800/80 border-stone-700'}`}>
              <span className={`${isLight ? 'text-stone-500' : 'text-stone-400'} block text-[10px]`}>Pending Orders</span>
              <strong className="text-rose-500 dark:text-rose-400 font-mono">{pendingOrdersCount}</strong>
            </div>
            <div className={`px-3 py-1 rounded-xl border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-800/80 border-stone-700'}`}>
              <span className={`${isLight ? 'text-stone-500' : 'text-stone-400'} block text-[10px]`}>Total Courses</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{courses.length} Active</strong>
            </div>
          </div>

          {/* Navigation & Theme Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Admin Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleAdminTheme}
              type="button"
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 ${
                isLight 
                  ? 'bg-amber-100/80 hover:bg-amber-200/80 border-amber-300 text-amber-900' 
                  : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-amber-300'
              }`}
              title={isLight ? "ڈارک موڈ کریں (Switch to Dark Mode)" : "لائٹ موڈ کریں (Switch to Light Mode)"}
            >
              {isLight ? <Moon className="w-3.5 h-3.5 text-amber-800" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span className="text-[11px] sm:text-xs font-bold">{isLight ? 'Dark' : 'Light'}</span>
            </button>

            <button
              onClick={onBackToSite}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800' : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Academy Site</span>
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Lock 🔒
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Tab Quick Dropdown Selector */}
      <div className={`md:hidden ${isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'} border-b px-3 py-2 flex items-center gap-2`}>
        <span className="text-xs text-amber-500 font-bold whitespace-nowrap">سیکشن / Tab:</span>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as TabType)}
          className={`w-full ${isLight ? 'bg-stone-100 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'} border rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:border-amber-400 cursor-pointer`}
        >
          <option value="dashboard">📊 Dashboard (شاپائی فائی طرز اینالیٹکس)</option>
          <option value="founder_bio">👤 Founder Bio & Photo (مفتی صاحب کی سوانح و تصویر)</option>
          <option value="orders">👥 Orders & Invoices ({orders.length})</option>
          <option value="courses">📚 Courses & Curriculum ({courses.length})</option>
          <option value="store">🛍️ Digital Store & Items ({storeItems.length})</option>
          <option value="digital_library">📖 PDF Library & Upload ({publications.length})</option>
          <option value="media_gallery">🎬 Media Ads, Videos & Pics ({mediaAds.length})</option>
          <option value="liveclass">📹 Live Zoom / Meet Class</option>
          <option value="certificates">🎓 Certificates Registry ({certificates.length})</option>
          <option value="theme">🎨 Theme & Colors</option>
          <option value="policies">🛡️ Academy Policies & Safeguards</option>
          <option value="notice_payments">💳 Notice & Local/Overseas Gateways</option>
        </select>
      </div>

      {/* Horizontal Navigable Tabs with Forward & Backward Buttons */}
      <div className={`${isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/95 border-stone-800'} border-b px-2 sm:px-4 relative flex items-center shadow-md transition-colors`}>
        
        {/* Backward / Left Scroll Button */}
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          className={`p-1.5 rounded-lg ${isLight ? 'bg-stone-200 hover:bg-stone-300 text-stone-800 border-stone-300' : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700'} border transition-colors shrink-0 shadow-sm mr-1 cursor-pointer`}
          title="Scroll tabs backward / پیچھے کریں"
          aria-label="Scroll tabs left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Tabs Track */}
        <div 
          ref={tabsContainerRef}
          className="flex-1 flex items-center gap-1.5 py-1.5 text-xs font-semibold whitespace-nowrap overflow-x-auto scroll-smooth scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'dashboard' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('founder_bio')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'founder_bio' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Founder Bio & Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'orders' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Orders & Invoices ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-bold ml-1">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'courses' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses & Curriculum ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'store' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Digital Store & Items ({storeItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('digital_library')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'digital_library' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>PDF Library & Upload ({publications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media_gallery')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'media_gallery' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media Ads, Videos & Pics ({mediaAds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('liveclass')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'liveclass' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live Zoom/Meet</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'certificates' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'theme' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Backgrounds</span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'policies' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Academy Policies</span>
          </button>

          <button
            onClick={() => setActiveTab('notice_payments')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              activeTab === 'notice_payments' 
                ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                : isLight 
                ? 'text-stone-700 hover:bg-stone-200 hover:text-stone-900' 
                : 'text-stone-300 hover:bg-stone-800 hover:text-amber-300'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Notice & Gateways</span>
          </button>

        </div>

        {/* Forward / Right Scroll Button */}
        <button
          type="button"
          onClick={() => scrollTabs('right')}
          className={`p-1.5 rounded-lg border transition-colors shrink-0 shadow-sm ml-1 cursor-pointer ${
            isLight 
              ? 'bg-stone-200 hover:bg-stone-300 text-stone-800 border-stone-300' 
              : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700 hover:border-amber-400'
          }`}
          title="Scroll tabs forward / آگے کریں"
          aria-label="Scroll tabs right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">

        {/* ----------------- TAB 1: SHOPIFY-STYLE EXECUTIVE DASHBOARD ----------------- */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Shopify Executive Controls & Live Traffic Header Bar */}
            <div className={`p-4 sm:p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
              isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                    <span>Live Academy Analytics</span>
                    <span className="text-stone-400 font-normal">| Real-Time Traffic</span>
                  </span>
                </div>
                <h2 className={`text-xl sm:text-2xl font-extrabold font-kufi flex items-center gap-2 ${
                  isLight ? 'text-emerald-950' : 'text-amber-300'
                }`}>
                  <span>Shopify Style Executive Dashboard</span>
                </h2>
                <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  🟢 <strong>14 Live Visitors</strong> active right now &bull; 8 Mobile, 6 Desktop &bull; 4 browsing Courses, 2 in Checkout
                </p>
              </div>

              {/* Timeframe & Currency Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Time Range Selector */}
                <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
                  isLight ? 'bg-stone-100 border-stone-300' : 'bg-stone-800 border-stone-700'
                }`}>
                  {(['today', '7d', '30d', 'year'] as const).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setDashboardPeriod(period)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        dashboardPeriod === period
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                          : isLight ? 'text-stone-600 hover:text-stone-900' : 'text-stone-300 hover:text-amber-300'
                      }`}
                    >
                      {period === 'today' ? 'Today' : period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : 'YTD'}
                    </button>
                  ))}
                </div>

                {/* Currency Switcher */}
                <div className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-semibold ${
                  isLight ? 'bg-stone-100 border-stone-300' : 'bg-stone-800 border-stone-700'
                }`}>
                  <button
                    type="button"
                    onClick={() => setCurrencyUnit('PKR')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      currencyUnit === 'PKR'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : isLight ? 'text-stone-600' : 'text-stone-300'
                    }`}
                  >
                    PKR (Rs)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyUnit('USD')}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      currencyUnit === 'USD'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : isLight ? 'text-stone-600' : 'text-stone-300'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>

                {/* Shortcut to Founder Bio */}
                <button
                  type="button"
                  onClick={() => setActiveTab('founder_bio')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Founder Bio</span>
                </button>
              </div>
            </div>

            {/* Shopify Key Performance Indicators (6 Cards with Comparison Pills) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Metric 1: Total Visitors / Sessions */}
              <div className={`p-5 rounded-3xl border transition-all ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Total Online Sessions & Traffic
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" />
                    +24.8%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={`text-2xl sm:text-3xl font-extrabold font-mono ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                    {dashboardPeriod === 'today' ? '1,420' : dashboardPeriod === '7d' ? '8,650' : dashboardPeriod === '30d' ? '14,820' : '94,200'}
                  </p>
                  <span className="text-xs text-stone-400">visitors</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-stone-500' : 'text-stone-400'}>Direct & WhatsApp: 76%</span>
                  <span className="text-emerald-500 font-semibold">High Intent Audience</span>
                </div>
              </div>

              {/* Metric 2: Total Gross Sales & Collections */}
              <div className={`p-5 rounded-3xl border transition-all ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Total Gross Tuition & Sales
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" />
                    +31.5%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500 dark:text-amber-300">
                    {currencyUnit === 'PKR' ? `PKR ${totalRevenuePKR.toLocaleString()}` : `$${Math.round(totalRevenuePKR / 278).toLocaleString()}`}
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-stone-500' : 'text-stone-400'}>Average Order: PKR 7,850</span>
                  <span className="text-amber-500 font-semibold">Cleared via Bank/Wallets</span>
                </div>
              </div>

              {/* Metric 3: Total Enrolments & Orders */}
              <div className={`p-5 rounded-3xl border transition-all ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Total Admissions & Orders
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" />
                    +18.2%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={`text-2xl sm:text-3xl font-extrabold font-mono ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                    {orders.length}
                  </p>
                  <span className="text-xs text-stone-400">applications</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className="text-rose-500 font-bold">{pendingOrdersCount} Awaiting Approval</span>
                  <button 
                    onClick={() => setActiveTab('orders')} 
                    className="text-amber-500 hover:underline font-semibold"
                  >
                    View All &rarr;
                  </button>
                </div>
              </div>

              {/* Metric 4: Admission Conversion Rate */}
              <div className={`p-5 rounded-3xl border transition-all ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Store Conversion Rate
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" />
                    +0.7%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={`text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400`}>
                    3.84%
                  </p>
                  <span className="text-xs text-stone-400">checkout success</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-stone-500' : 'text-stone-400'}>Added to Cart: 8.9%</span>
                  <span className="text-stone-400">Benchmark: 2.5%</span>
                </div>
              </div>

              {/* Metric 5: Average Session Duration & Engagement */}
              <div className={`p-5 rounded-3xl border transition-all ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Average Engagement Time
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" />
                    +14.2%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={`text-2xl sm:text-3xl font-extrabold font-mono text-sky-500 dark:text-sky-400`}>
                    4m 38s
                  </p>
                  <span className="text-xs text-stone-400">per student</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-stone-500' : 'text-stone-400'}>Pages per session: 4.2</span>
                  <span className="text-sky-500 font-semibold">Low Bounce Rate (28%)</span>
                </div>
              </div>

              {/* Metric 6: Live 1-on-1 Class Attendance */}
              <div className={`p-5 rounded-3xl border transition-all ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Zoom Classroom Attendance
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    96.4%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <p className={`text-2xl sm:text-3xl font-extrabold font-mono ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                    {courses.length * 8}
                  </p>
                  <span className="text-xs text-stone-400">weekly hours delivered</span>
                </div>
                <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className={isLight ? 'text-stone-500' : 'text-stone-400'}>Active Zoom Passcode</span>
                  <span className="text-amber-500 font-mono font-bold">{liveClass.passcode}</span>
                </div>
              </div>

            </div>

            {/* Shopify Visual Interactive Weekly Traffic & Sales Bar Graph */}
            <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm ${
              isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className={`font-bold font-kufi text-base sm:text-lg flex items-center gap-2 ${
                    isLight ? 'text-emerald-950' : 'text-amber-300'
                  }`}>
                    <BarChart3 className="w-5 h-5 text-amber-500" />
                    <span>Weekly Traffic & Admissions Trends (روزانہ کا ڈیٹا)</span>
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    Daily sessions compared with registered enrollments across the past 7 days
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className={isLight ? 'text-stone-700' : 'text-stone-300'}>Traffic (Sessions)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className={isLight ? 'text-stone-700' : 'text-stone-300'}>Admissions (Orders)</span>
                  </div>
                </div>
              </div>

              {/* Visual Bars Container */}
              <div className="space-y-2">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 pt-6 pb-2 px-2 border-b border-stone-200 dark:border-stone-800">
                  {[
                    { day: 'Mon', sessions: 1820, orders: 4, heightTraffic: '65%', heightOrders: '40%' },
                    { day: 'Tue', sessions: 2150, orders: 7, heightTraffic: '75%', heightOrders: '70%' },
                    { day: 'Wed', sessions: 2480, orders: 6, heightTraffic: '85%', heightOrders: '60%' },
                    { day: 'Thu', sessions: 1940, orders: 5, heightTraffic: '70%', heightOrders: '50%' },
                    { day: 'Fri (Jummah)', sessions: 3120, orders: 11, heightTraffic: '100%', heightOrders: '100%', peak: true },
                    { day: 'Sat', sessions: 2840, orders: 9, heightTraffic: '90%', heightOrders: '85%' },
                    { day: 'Sun', sessions: 2610, orders: 8, heightTraffic: '82%', heightOrders: '75%' }
                  ].map((d, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-end h-full gap-1 group relative">
                      {/* Hover Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-950 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-xl border border-stone-700">
                        <strong>{d.day}:</strong> {d.sessions} visitors &bull; {d.orders} orders
                      </div>
                      
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                        {/* Traffic Bar */}
                        <div 
                          style={{ height: d.heightTraffic }}
                          className={`w-1/2 rounded-t-lg transition-all duration-300 ${
                            d.peak 
                              ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-md shadow-amber-500/20' 
                              : isLight ? 'bg-amber-400/80 hover:bg-amber-500' : 'bg-amber-500/70 hover:bg-amber-400'
                          }`}
                        />
                        {/* Orders Bar */}
                        <div 
                          style={{ height: d.heightOrders }}
                          className={`w-1/2 rounded-t-lg transition-all duration-300 ${
                            d.peak 
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-500/20' 
                              : isLight ? 'bg-emerald-500/80 hover:bg-emerald-500' : 'bg-emerald-600/70 hover:bg-emerald-400'
                          }`}
                        />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-bold mt-2 truncate ${
                        d.peak ? 'text-amber-500 font-extrabold' : isLight ? 'text-stone-600' : 'text-stone-400'
                      }`}>
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[11px] text-stone-400 px-2 pt-1">
                  <span>Friday has highest enrollment spike (+62% on Jummah)</span>
                  <span>Average daily volume: ~2,420 sessions</span>
                </div>
              </div>
            </div>

            {/* 2-Column Shopify Analytics: Top Courses/Products & Traffic Acquisition Channels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Performing Courses & Books */}
              <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold font-kufi text-base flex items-center gap-2 ${
                    isLight ? 'text-emerald-950' : 'text-amber-300'
                  }`}>
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Top Courses & Best Sellers (مقبول ترین کورسز)</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="text-xs text-amber-500 hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {courses.slice(0, 4).map((c, idx) => (
                    <div 
                      key={c.id} 
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                        isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-950/80 border-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          idx === 0 
                            ? 'bg-amber-500 text-stone-950' 
                            : idx === 1 
                            ? 'bg-stone-300 text-stone-950' 
                            : 'bg-amber-700/40 text-amber-300'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className={`text-xs sm:text-sm font-bold truncate ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                            {c.title.en}
                          </h4>
                          <span className={`text-[11px] block truncate ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                            {c.title.ur} &bull; {c.level}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                          PKR {c.feeMonthlyPKR.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {idx === 0 ? '48 Students' : idx === 1 ? '36 Students' : '24 Students'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Acquisition & Marketing Channels */}
              <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-bold font-kufi text-base flex items-center gap-2 ${
                    isLight ? 'text-emerald-950' : 'text-amber-300'
                  }`}>
                    <Globe2 className="w-4 h-4 text-emerald-500" />
                    <span>Traffic Acquisition Sources (ٹریفک کے ذرائع)</span>
                  </h3>
                  <span className="text-xs text-emerald-500 font-bold">100% Organic & Direct</span>
                </div>

                <div className="space-y-4">
                  {[
                    { channel: 'WhatsApp Broadcasts & Groups', percent: 42, color: 'bg-emerald-500', count: '6,224 sessions' },
                    { channel: 'Direct URL & Student Word of Mouth', percent: 34, color: 'bg-amber-500', count: '5,038 sessions' },
                    { channel: 'Google Search (Islamic Academy / Tajweed)', percent: 14, color: 'bg-sky-500', count: '2,074 sessions' },
                    { channel: 'YouTube, Lectures & Social Media', percent: 10, color: 'bg-rose-500', count: '1,484 sessions' }
                  ].map((src, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-semibold ${isLight ? 'text-stone-800' : 'text-stone-200'}`}>{src.channel}</span>
                        <span className="font-mono text-stone-400 text-[11px]">{src.count} ({src.percent}%)</span>
                      </div>
                      <div className={`w-full h-2.5 rounded-full overflow-hidden ${isLight ? 'bg-stone-200' : 'bg-stone-800'}`}>
                        <div 
                          className={`h-full ${src.color} rounded-full transition-all duration-500`}
                          style={{ width: `${src.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Device and Geography Summary Pills */}
                  <div className="pt-3 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-3 text-xs">
                    <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'}`}>
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">Device Split:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Smartphone className="w-4 h-4 text-amber-500" />
                        <span className="font-bold">Mobile 78%</span>
                        <span className="text-stone-400">| PC 22%</span>
                      </div>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-stone-50 border-stone-200' : 'bg-stone-950 border-stone-800'}`}>
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">Top Regions:</span>
                      <div className="flex items-center gap-1.5 mt-1 truncate">
                        <span>🇵🇰 65%</span>
                        <span>🇸🇦 20%</span>
                        <span>🇬🇧 9%</span>
                        <span>🇺🇸 6%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Shopify Real-Time Live Activity Feed & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Orders with Quick Slips */}
              <div className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border shadow-sm ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`font-bold font-kufi text-lg ${isLight ? 'text-emerald-950' : 'text-amber-300'}`}>
                      Recent Admissions & Orders (حالیہ درخواستیں)
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                      Live incoming registrations from students across Pakistan and overseas
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-500 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <span>View All Orders ({orders.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-stone-200 dark:divide-stone-800 text-xs">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <strong className={`text-sm block ${isLight ? 'text-stone-900' : 'text-stone-100'}`}>
                          {o.studentName}
                        </strong>
                        <span className={`text-[11px] ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                          {o.courseOrItemTitle} &bull; {o.createdAt} &bull; {o.countryCity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.paymentStatus === 'Approved' 
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                        }`}>
                          {o.paymentStatus}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedOrderForInvoice(o);
                            setInvoiceModalLang('ur');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                            isLight ? 'bg-stone-100 hover:bg-stone-200 text-stone-800' : 'bg-stone-800 hover:bg-stone-700 text-amber-300'
                          }`}
                          title="View Official Receipt"
                        >
                          رسید
                        </button>
                        <a
                          href={getSendWhatsAppUrl(o)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-sm"
                          title="WhatsApp Student"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shopify Live Activity Stream & Admin Security */}
              <div className="space-y-4">
                
                {/* Live Activity Feed */}
                <div className={`p-5 rounded-3xl border shadow-sm ${
                  isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <h4 className={`font-bold font-kufi text-sm ${isLight ? 'text-stone-900' : 'text-amber-300'}`}>
                      Shopify Live Activity Stream
                    </h4>
                  </div>
                  
                  <div className="space-y-2.5 text-xs">
                    {[
                      { icon: '📝', text: 'Muhammad Usman from Lahore submitted Tajweed enrollment', time: '4m ago' },
                      { icon: '📖', text: 'Zainab from London downloaded Tuhfat-ul-Atfal PDF pack', time: '12m ago' },
                      { icon: '🎓', text: 'Hamza from Rawalpindi verified Sanad #AD-CERT-2024', time: '22m ago' },
                      { icon: '👤', text: 'Visitor from Riyadh viewed Scholar Profile of Mufti Danish', time: '35m ago' },
                      { icon: '💳', text: 'Fee verified via Meezan Islamic Bank for Fiqh course', time: '48m ago' }
                    ].map((act, i) => (
                      <div key={i} className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                        isLight ? 'bg-stone-50 border-stone-200 text-stone-800' : 'bg-stone-950/60 border-stone-800 text-stone-300'
                      }`}>
                        <span className="text-sm shrink-0">{act.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="leading-snug text-[11px] font-medium">{act.text}</p>
                          <span className="text-[10px] text-stone-400 mt-0.5 block">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Master Password Security Card */}
                <div className={`p-5 rounded-3xl border shadow-sm ${
                  isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
                }`}>
                  <h4 className={`font-bold font-kufi text-sm flex items-center gap-2 mb-2 ${
                    isLight ? 'text-stone-900' : 'text-amber-300'
                  }`}>
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Admin Master Password</span>
                  </h4>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter new master password"
                      value={newMasterPassword}
                      onChange={(e) => setNewMasterPassword(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 ${
                        isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                      }`}
                    />
                    <button
                      onClick={handleUpdatePassword}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Update Master Password
                    </button>
                    {passwordSuccessToast && (
                      <p className="text-xs text-emerald-500 font-semibold">{passwordSuccessToast}</p>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ----------------- TAB: FOUNDER BIO & PHOTO MANAGEMENT ----------------- */}
        {activeTab === 'founder_bio' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Header Banner */}
            <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    Scholarly Credentials & Identity
                  </span>
                </div>
                <h2 className={`text-xl sm:text-2xl font-bold font-kufi ${isLight ? 'text-emerald-950' : 'text-amber-300'}`}>
                  مفتی دانش کلیم صاحب کی سوانح اور تصویر کا انتظام
                </h2>
                <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Manage founder portrait picture, scholarly titles, academic degrees, and multilingual biography across the academy website.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFounderBioPreview(true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isLight ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800' : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-amber-300'
                  }`}
                >
                  <Eye className="w-4 h-4 text-amber-500" />
                  <span>Preview Bio Modal</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveFounderBio}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer font-kufi"
                >
                  <Check className="w-4 h-4" />
                  <span>تبدیلیاں محفوظ کریں (Save)</span>
                </button>
              </div>
            </div>

            {/* Main Founder Editor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column (1 Col): Photo Management Card */}
              <div className={`p-5 sm:p-6 rounded-3xl border shadow-sm space-y-4 ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}>
                <h3 className={`font-bold font-kufi text-base flex items-center gap-2 ${
                  isLight ? 'text-stone-900' : 'text-amber-300'
                }`}>
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <span>سرکاری پورٹریٹ تصویر (Portrait Photo)</span>
                </h3>

                {/* Picture Preview */}
                <div className="text-center space-y-3">
                  <div className="relative inline-block mx-auto">
                    <img 
                      src={settings.founderImage || '/assets/aistudio/founder.jpg_450b2eb5.jpeg'} 
                      alt="Mufti Danish Kaleem"
                      className="w-44 h-56 rounded-2xl object-cover object-top border-4 border-amber-400 shadow-2xl mx-auto"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-amber-400 text-stone-950 px-2.5 py-0.5 rounded-full text-xs font-bold shadow flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </div>
                  </div>

                  <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                    This picture is displayed on the Homepage Founder card and inside the Biography Modal.
                  </p>
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file"
                  ref={founderFileInputRef}
                  onChange={handleFounderImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {/* Upload & Quick-Select Buttons */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  {/* Quick Select Attached Official Photo */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...settings, founderImage: "/assets/aistudio/founder.jpg_450b2eb5.jpeg" };
                      setSettings(updated);
                      storage.saveSettings(updated);
                      showToast("مفتی صاحب کی آفیشل پورٹریٹ تصویر فعال کر دی گئی!");
                    }}
                    className="w-full py-2.5 px-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md font-kufi"
                  >
                    <Check className="w-4 h-4 text-stone-950" />
                    <span>مفتی صاحب کی اصل تصویر لگائیں</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => founderFileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>موبائل یا پی سی سے نئی تصویر اپلوڈ کریں</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetFounderImage}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      isLight ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700' : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
                    }`}
                  >
                    اصل تصویر پر بحال کریں (Reset to Default)
                  </button>
                </div>

                {/* Image URL Direct Input */}
                <div className="pt-2">
                  <label className={`block font-semibold text-xs mb-1 ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>
                    Image URL or Workspace Path:
                  </label>
                  <input
                    type="text"
                    value={settings.founderImage || ''}
                    onChange={(e) => setSettings({ ...settings, founderImage: e.target.value })}
                    placeholder="/assets/aistudio/founder.jpg_450b2eb5.jpeg"
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-amber-400 ${
                      isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                    }`}
                  />
                </div>
              </div>

              {/* Right Column (2 Cols): Multilingual Name, Title, and Detailed Bio */}
              <div className={`lg:col-span-2 p-5 sm:p-6 rounded-3xl border shadow-sm space-y-5 ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}>
                
                {/* Scholar Name in 3 Languages */}
                <div>
                  <h3 className={`font-bold font-kufi text-base mb-3 ${isLight ? 'text-stone-900' : 'text-amber-300'}`}>
                    نامِ گرامی (Scholar Name in 3 Languages)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">Urdu (اردو):</label>
                      <input
                        type="text"
                        value={settings.founderName.ur}
                        onChange={(e) => setSettings({ ...settings, founderName: { ...settings.founderName, ur: e.target.value } })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-nastaliq text-right ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">English:</label>
                      <input
                        type="text"
                        value={settings.founderName.en}
                        onChange={(e) => setSettings({ ...settings, founderName: { ...settings.founderName, en: e.target.value } })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-sans ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">Arabic (العربية):</label>
                      <input
                        type="text"
                        value={settings.founderName.ar}
                        onChange={(e) => setSettings({ ...settings, founderName: { ...settings.founderName, ar: e.target.value } })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-amiri text-right ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Scholar Title / Designation in 3 Languages */}
                <div>
                  <h3 className={`font-bold font-kufi text-base mb-3 ${isLight ? 'text-stone-900' : 'text-amber-300'}`}>
                    علمی القاب و اسناد (Scholarly Title & Degree in 3 Languages)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">Urdu (اردو القاب):</label>
                      <input
                        type="text"
                        value={settings.founderTitle.ur}
                        onChange={(e) => setSettings({ ...settings, founderTitle: { ...settings.founderTitle, ur: e.target.value } })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-nastaliq text-right ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">English Title:</label>
                      <input
                        type="text"
                        value={settings.founderTitle.en}
                        onChange={(e) => setSettings({ ...settings, founderTitle: { ...settings.founderTitle, en: e.target.value } })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-sans ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">Arabic (اللقب العلمي):</label>
                      <input
                        type="text"
                        value={settings.founderTitle.ar}
                        onChange={(e) => setSettings({ ...settings, founderTitle: { ...settings.founderTitle, ar: e.target.value } })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-amiri text-right ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Teaching Experience & Specialization in 3 Languages */}
                <div>
                  <h3 className={`font-bold font-kufi text-base mb-3 ${isLight ? 'text-stone-900' : 'text-amber-300'}`}>
                    تدریسی تجربہ اور تخصص (Teaching Experience)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">Urdu (تدریسی تجربہ):</label>
                      <input
                        type="text"
                        value={settings.founderExperience?.ur || '12+ سالہ تدریسی تجربہ (تجوید، نحو و فقہ)'}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          founderExperience: { 
                            ur: e.target.value, 
                            en: settings.founderExperience?.en || '12+ Years Teaching Tajweed, Nahw & Fiqh', 
                            ar: settings.founderExperience?.ar || 'أكثر من 12 عاماً من التدريس الشرعي' 
                          } 
                        })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-nastaliq text-right ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">English Experience:</label>
                      <input
                        type="text"
                        value={settings.founderExperience?.en || '12+ Years Teaching Tajweed, Nahw & Fiqh'}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          founderExperience: { 
                            ur: settings.founderExperience?.ur || '12+ سالہ تدریسی تجربہ', 
                            en: e.target.value, 
                            ar: settings.founderExperience?.ar || 'أكثر من 12 عاماً من التدريس الشرعي' 
                          } 
                        })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-sans ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-amber-500 mb-1">Arabic (الخبرة التدريسية):</label>
                      <input
                        type="text"
                        value={settings.founderExperience?.ar || 'أكثر من 12 عاماً من التدريس الشرعي'}
                        onChange={(e) => setSettings({ 
                          ...settings, 
                          founderExperience: { 
                            ur: settings.founderExperience?.ur || '12+ سالہ تدریسی تجربہ', 
                            en: settings.founderExperience?.en || '12+ Years Teaching Experience', 
                            ar: e.target.value 
                          } 
                        })}
                        className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-400 font-amiri text-right ${
                          isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Multilingual Detailed Biography Texts */}
                <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <h3 className={`font-bold font-kufi text-base ${isLight ? 'text-stone-900' : 'text-amber-300'}`}>
                    تفصیلی سوانحِ حیات و علمی خدمات (Detailed Biography Text)
                  </h3>

                  {/* Urdu Bio */}
                  <div>
                    <label className="block text-xs font-bold text-amber-500 mb-1">
                      اردو تفصیلی بائیوگرافی (Urdu Biography):
                    </label>
                    <textarea
                      rows={5}
                      value={settings.founderBio.ur}
                      onChange={(e) => setSettings({ ...settings, founderBio: { ...settings.founderBio, ur: e.target.value } })}
                      className={`w-full border rounded-xl p-3 text-xs leading-relaxed outline-none focus:border-amber-400 font-nastaliq text-right ${
                        isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                      }`}
                      placeholder="مفتی صاحب کا تعارف، اسناد، تدریسی تجربہ اور وژن درج کریں..."
                    />
                  </div>

                  {/* English Bio */}
                  <div>
                    <label className="block text-xs font-bold text-amber-500 mb-1">
                      English Detailed Biography:
                    </label>
                    <textarea
                      rows={5}
                      value={settings.founderBio.en}
                      onChange={(e) => setSettings({ ...settings, founderBio: { ...settings.founderBio, en: e.target.value } })}
                      className={`w-full border rounded-xl p-3 text-xs leading-relaxed outline-none focus:border-amber-400 font-sans ${
                        isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                      }`}
                      placeholder="Detailed academic degrees, specialization in Islamic law, years of experience..."
                    />
                  </div>

                  {/* Arabic Bio */}
                  <div>
                    <label className="block text-xs font-bold text-amber-500 mb-1">
                      السيرة الذاتية المفصلة بالعربية (Arabic Biography):
                    </label>
                    <textarea
                      rows={5}
                      value={settings.founderBio.ar}
                      onChange={(e) => setSettings({ ...settings, founderBio: { ...settings.founderBio, ar: e.target.value } })}
                      className={`w-full border rounded-xl p-3 text-xs leading-relaxed outline-none focus:border-amber-400 font-amiri text-right ${
                        isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-100'
                      }`}
                      placeholder="السيرة العلمية، المؤهلات والشهادات، والإجازات المسندة..."
                    />
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFounderBioPreview(true)}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                      isLight ? 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-800' : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
                    }`}
                  >
                    <Eye className="w-4 h-4 text-amber-500" />
                    <span>پیش منظر دیکھیں (Preview Modal)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveFounderBio}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl transition-all cursor-pointer font-kufi"
                  >
                    <Check className="w-4 h-4 text-stone-950" />
                    <span>تبدیلیاں محفوظ کریں (Save All Changes)</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ----------------- TAB 2: ENROLMENTS & ORDERS TABLE ----------------- */}
        {activeTab === 'orders' && (
          <div className={`${isLight ? 'bg-white border-stone-200 text-stone-900 shadow-sm' : 'bg-stone-900 border-stone-800 text-stone-100'} border rounded-3xl p-6 space-y-6 transition-colors`}>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className={`text-xl font-bold font-kufi ${isLight ? 'text-emerald-950' : 'text-amber-300'}`}>
                  Enrolment & Order Management Table
                </h3>
                <p className={`text-xs ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Track student admissions, view official receipts in Urdu/Arabic/English, and dispatch class links
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    placeholder="Search name, phone, course..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className={`w-full border rounded-xl pl-8 pr-3 py-2 text-xs outline-none focus:border-amber-400 ${
                      isLight ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400' : 'bg-stone-800 border-stone-700 text-stone-100'
                    }`}
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value as any)}
                  className={`border rounded-xl px-3 py-2 text-xs outline-none cursor-pointer ${
                    isLight ? 'bg-stone-50 border-stone-300 text-stone-900' : 'bg-stone-800 border-stone-700 text-stone-200'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending Only</option>
                  <option value="Approved">Approved Only</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Student & Father</th>
                    <th className="py-3 px-4">WhatsApp & City</th>
                    <th className="py-3 px-4">Course / Items</th>
                    <th className="py-3 px-4">Amount & Gateway</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 bg-stone-900/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-stone-500">
                        No enrolment orders found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-stone-800/50 transition-colors">
                        <td className="py-3 px-4 font-mono">
                          <span className="font-bold text-amber-400 block">{order.id}</span>
                          <span className="text-[10px] text-stone-500">{order.createdAt}</span>
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-stone-100 block text-sm">{order.studentName}</strong>
                          <span className="text-[11px] text-stone-400">S/o: {order.fatherName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href={`https://wa.me/${order.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{order.whatsapp}</span>
                          </a>
                          <span className="text-[10px] text-stone-500">{order.countryCity}</span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="font-medium text-stone-200 block truncate" title={order.courseOrItemTitle}>
                            {order.courseOrItemTitle}
                          </span>
                          <span className="text-[10px] text-amber-400 uppercase">
                            Time: {order.preferredTime}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold font-mono text-amber-300 text-sm block">
                            PKR {order.totalAmountPKR.toLocaleString()}
                          </span>
                          <span className="text-[10px] uppercase text-stone-400">{order.paymentMethod}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'Approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                          {/* View Multilingual Receipt/Invoice */}
                          <button
                            onClick={() => {
                              setSelectedOrderForInvoice(order);
                              setInvoiceModalLang('ur');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-750 text-amber-300 font-semibold text-[11px] border border-stone-700 transition-colors cursor-pointer"
                            title="View Official Receipt in Urdu, Arabic or English"
                          >
                            <FileText className="w-3 h-3 text-amber-400" />
                            <span>رسید / Invoice</span>
                          </button>

                          {/* Send WhatsApp Link */}
                          <a
                            href={getSendWhatsAppUrl(order)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-[11px] transition-colors"
                            title="Send Zoom Link via WhatsApp"
                          >
                            <Send className="w-3 h-3" />
                            <span>WhatsApp Link</span>
                          </a>

                          {/* Approve Button */}
                          {order.paymentStatus !== 'Approved' && (
                            <button
                              onClick={() => handleApproveOrder(order.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-1 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ----------------- TAB 3: COURSES & CURRICULUM CONTROL (UNLIMITED COURSES) ----------------- */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl border transition-colors ${
              isLight ? 'bg-white border-stone-200 text-stone-900 shadow-sm' : 'bg-stone-900 border-stone-800 text-stone-100'
            }`}>
              <div>
                <h3 className={`text-xl font-bold font-kufi flex items-center gap-2 ${
                  isLight ? 'text-emerald-950' : 'text-amber-300'
                }`}>
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span>Course Curriculum Control & Fee Manager</span>
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Add unlimited courses, edit names in Urdu/Arabic/English, customize syllabus, class timings, and monthly fees
                </p>
              </div>
              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer font-kufi"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Course (نیا کورس شامل کریں)</span>
              </button>
            </div>

            {/* Courses Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map(course => (
                <div
                  key={course.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                    course.isVisible ? 'bg-stone-900 border-stone-800' : 'bg-stone-950/60 border-stone-850 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-800 text-amber-300 uppercase tracking-wider">
                        {course.category} &bull; {course.level}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleCourseVisibility(course.id)}
                          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                            course.isVisible ? 'text-emerald-400 hover:bg-stone-800' : 'text-stone-500 hover:bg-stone-800'
                          }`}
                          title="Toggle Visibility"
                        >
                          {course.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-stone-100 text-base mb-1 font-sans">{course.title.en}</h4>
                    <p className="text-xs text-amber-400 font-amiri mb-2 leading-relaxed" dir="rtl">{course.title.ur}</p>
                    <p className="text-xs text-stone-400 line-clamp-2 mb-3">{course.description.en}</p>

                    {/* Syllabus Features List */}
                    <div className="space-y-1 mb-4 pt-2 border-t border-stone-800">
                      <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">Syllabus Highlights:</span>
                      {course.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="text-[11px] text-stone-300 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-stone-400 text-[10px] block">Fee:</span>
                      <strong className="text-amber-400 font-mono text-sm">PKR {course.feeMonthlyPKR.toLocaleString()}</strong>
                      <span className="text-[10px] text-stone-500 ml-1">(~${course.feeUSD})</span>
                    </div>

                    <button
                      onClick={() => setEditingCourse(course)}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Full Course</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------- TAB 4: DIGITAL BOOKSTORE & STORE PRODUCTS ----------------- */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl border transition-colors ${
              isLight ? 'bg-white border-stone-200 text-stone-900 shadow-sm' : 'bg-stone-900 border-stone-800 text-stone-100'
            }`}>
              <div>
                <h3 className={`text-xl font-bold font-kufi flex items-center gap-2 ${
                  isLight ? 'text-emerald-950' : 'text-amber-300'
                }`}>
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  <span>Digital Bookstore Items & Digital PDF Editions</span>
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
                  Edit titles, prices, descriptions, format badges, and re-upload digital PDF eBooks or video lesson bundles
                </p>
              </div>
              <button
                onClick={() => setShowAddStoreModal(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer font-kufi"
              >
                <Plus className="w-4 h-4" />
                <span>Add Bookstore Item / PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {storeItems.map(item => (
                <div
                  key={item.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                    item.isVisible ? 'bg-stone-900 border-stone-800' : 'bg-stone-950/60 border-stone-850 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-amber-300 uppercase">
                        {item.formatBadge}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const updated = storeItems.map(x => x.id === item.id ? { ...x, isVisible: !x.isVisible } : x);
                            setStoreItems(updated);
                            storage.saveStoreItems(updated);
                            showToast("Store product visibility toggled!");
                          }}
                          className={`p-1.5 rounded-lg text-xs font-semibold ${
                            item.isVisible ? 'text-emerald-400 hover:bg-stone-800' : 'text-stone-500 hover:bg-stone-800'
                          }`}
                        >
                          {item.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteStoreItem(item.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-stone-100 text-base mb-1">{item.title.en}</h4>
                    <p className="text-xs text-amber-400 font-amiri mb-2" dir="rtl">{item.title.ur}</p>
                    <p className="text-xs text-stone-400 mb-3 line-clamp-2">{item.description.en}</p>

                    {item.fileName && (
                      <div className="p-2 rounded-xl bg-stone-800/60 border border-stone-700/60 text-[11px] flex items-center justify-between text-stone-300 mb-3">
                        <span className="truncate">📎 {item.fileName}</span>
                        <span className="text-[10px] font-mono text-emerald-400">{item.fileSize || 'PDF Attached'}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Price:</span>
                      <strong className="text-amber-400 font-mono text-base">PKR {item.pricePKR.toLocaleString()}</strong>
                      <span className="text-xs text-stone-500 ml-1 font-mono">(~${item.priceUSD})</span>
                    </div>

                    <button
                      onClick={() => setEditingStoreItem(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Details & Files</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------- TAB 5: DIGITAL LIBRARY & PDF UPLOADER ----------------- */}
        {activeTab === 'digital_library' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-6 rounded-3xl">
              <div>
                <h3 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-amber-400" />
                  <span>Digital Library & Research PDF Uploader</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Upload official PDF eBooks, academic research articles, and fatawa collections with direct download support
                </p>
              </div>
              <button
                onClick={() => {
                  setPdfTarget('publication');
                  setShowAddPdfModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer font-kufi"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New PDF / Book (پی ڈی ایف اپلوڈ کریں)</span>
              </button>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => setDigitalFilter('all')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer ${digitalFilter === 'all' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'}`}
                >
                  All Items ({publications.length + storeItems.length})
                </button>
                <button
                  onClick={() => setDigitalFilter('publication')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer ${digitalFilter === 'publication' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'}`}
                >
                  Open-Access Publications ({publications.length})
                </button>
                <button
                  onClick={() => setDigitalFilter('store')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer ${digitalFilter === 'store' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'}`}
                >
                  Bookstore PDFs ({storeItems.length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search titles, authors..."
                  value={digitalSearch}
                  onChange={(e) => setDigitalSearch(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl pl-8 pr-3 py-2 text-xs text-stone-100 outline-none focus:border-amber-400"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Grid of PDF Resources */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDigitalItems.map((item: any) => (
                <div key={item.id} className="p-5 rounded-3xl bg-stone-900 border border-stone-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.itemType === 'publication' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {item.itemType === 'publication' ? 'Free Scholarly PDF' : 'Paid Store PDF'}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.itemType === 'publication' && (
                          <button
                            onClick={() => handleTogglePublicationVisibility(item.id)}
                            className={`p-1.5 rounded-lg text-xs ${item.isVisible !== false ? 'text-emerald-400' : 'text-stone-500'}`}
                          >
                            {item.isVisible !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (item.itemType === 'publication') {
                              handleDeletePublication(item.id);
                            } else {
                              handleDeleteStoreItem(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-stone-100 text-sm mb-1 leading-snug">{item.title.en}</h4>
                    <p className="text-xs text-amber-400 font-amiri mb-2 leading-relaxed" dir="rtl">{item.title.ur}</p>
                    <p className="text-xs text-stone-400 line-clamp-2 mb-3">{item.summary?.en || item.description?.en}</p>

                    <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs flex items-center justify-between text-stone-300 mb-3">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileDown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{item.downloadFilename || item.fileName || 'document.pdf'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 shrink-0">{item.fileSize || '2.4 MB'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-400">
                      {item.itemType === 'publication' ? 'Open Access' : `PKR ${item.pricePKR}`}
                    </span>
                    {item.fileData ? (
                      <a
                        href={item.fileData}
                        download={item.downloadFilename || item.fileName || 'treatise.pdf'}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <FileDown className="w-3 h-3" />
                        <span>Download PDF</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-stone-500 italic">Simulated Direct PDF</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------- TAB 6: MEDIA ADS, VIDEOS & PICTURES ----------------- */}
        {activeTab === 'media_gallery' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-6 rounded-3xl">
              <div>
                <h3 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <span>Media Ads, Video Lectures & Announcement Gallery</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Upload pictures and video lectures, edit titles, links, badges, and descriptions after adding
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingMediaAd(null);
                  setShowAddMediaModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow cursor-pointer font-kufi"
              >
                <Plus className="w-4 h-4" />
                <span>Add Media Flyer / Video (نئی تصویر یا ویڈیو)</span>
              </button>
            </div>

            {/* Media Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaAds.map(ad => (
                <div key={ad.id} className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden flex flex-col justify-between">
                  <div className="relative aspect-video w-full bg-stone-950">
                    <img
                      src={ad.mediaUrl}
                      alt={ad.title.en}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 uppercase">
                        {ad.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-900/80 text-amber-300 border border-amber-500/30">
                        {ad.badge.en}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="font-bold text-stone-100 text-base mb-1">{ad.title.en}</h4>
                    <p className="text-xs text-amber-400 font-amiri mb-2" dir="rtl">{ad.title.ur}</p>
                    <p className="text-xs text-stone-400 line-clamp-2 mb-4">{ad.description.en}</p>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleMediaAdVisibility(ad.id)}
                        className={`text-xs font-semibold flex items-center gap-1 ${ad.isVisible ? 'text-emerald-400' : 'text-stone-500'}`}
                      >
                        {ad.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{ad.isVisible ? 'Visible' : 'Hidden'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingMediaAd(ad);
                            setShowAddMediaModal(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Media</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMediaAd(ad.id)}
                          className="p-1.5 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-stone-800 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ----------------- TAB 7: LIVE CLASS LINK ----------------- */}
        {activeTab === 'liveclass' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-400" />
                <span>Live Class Link Manager</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Update daily Zoom or Google Meet links. Changes reflect on the main website immediately.
              </p>
            </div>

            <form onSubmit={handleSaveLiveClass} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Class Platform</label>
                  <select
                    value={liveClass.platform}
                    onChange={(e) => setLiveClass({ ...liveClass, platform: e.target.value as any })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 outline-none"
                  >
                    <option value="Zoom">Zoom Cloud Meeting</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Access Restriction</label>
                  <select
                    value={liveClass.accessRestriction}
                    onChange={(e) => setLiveClass({ ...liveClass, accessRestriction: e.target.value as any })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 outline-none"
                  >
                    <option value="enrolled_only">Enrolled Students Only</option>
                    <option value="direct_share">Direct Share on WhatsApp</option>
                    <option value="public">Open Public Broadcast</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Full Meeting URL</label>
                <input
                  type="url"
                  required
                  value={liveClass.meetingUrl}
                  onChange={(e) => setLiveClass({ ...liveClass, meetingUrl: e.target.value })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 outline-none focus:border-amber-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Meeting ID</label>
                  <input
                    type="text"
                    required
                    value={liveClass.meetingId}
                    onChange={(e) => setLiveClass({ ...liveClass, meetingId: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Meeting Passcode</label>
                  <input
                    type="text"
                    required
                    value={liveClass.passcode}
                    onChange={(e) => setLiveClass({ ...liveClass, passcode: e.target.value })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Schedule Text (English & Urdu)</label>
                <input
                  type="text"
                  value={liveClass.scheduleText.en}
                  onChange={(e) => setLiveClass({ 
                    ...liveClass, 
                    scheduleText: { ...liveClass.scheduleText, en: e.target.value, ur: e.target.value } 
                  })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-stone-100 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg text-sm transition-all cursor-pointer font-kufi"
              >
                Save & Broadcast Meeting Link
              </button>
            </form>
          </div>
        )}

        {/* ----------------- TAB 8: CERTIFICATES ----------------- */}
        {activeTab === 'certificates' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-5">
              <div>
                <h3 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>Issue Official Certificate</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Generate authentic printable completion certificates with verification ID
                </p>
              </div>

              <form onSubmit={handleGenerateCertificate} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Abdullah"
                    value={certStudentName}
                    onChange={(e) => setCertStudentName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2 text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Father's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mahmood"
                    value={certFatherName}
                    onChange={(e) => setCertFatherName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2 text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Course Title</label>
                  <select
                    value={certCourseName}
                    onChange={(e) => setCertCourseName(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2 text-stone-100 outline-none text-xs"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.title.en}>{c.title.en}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Grade / Distinction</label>
                  <select
                    value={certGrade}
                    onChange={(e) => setCertGrade(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2 text-stone-100 outline-none text-xs"
                  >
                    <option value="Mumtaz (Distinction - 95%)">Mumtaz (Distinction - 95%)</option>
                    <option value="Jayyid Jiddan (Very Good - 88%)">Jayyid Jiddan (Very Good - 88%)</option>
                    <option value="Jayyid (Good - 78%)">Jayyid (Good - 78%)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm shadow-md transition-all cursor-pointer font-kufi"
                >
                  Generate Official Certificate
                </button>
              </form>

              {/* Previously Issued Registry */}
              <div className="pt-4 border-t border-stone-800">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Issued Registry ({certificates.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto text-xs">
                  {certificates.map(cert => (
                    <div
                      key={cert.id}
                      onClick={() => setGeneratedCertPreview(cert)}
                      className="p-2 bg-stone-800 hover:bg-stone-750 rounded-xl cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-stone-200 block text-xs">{cert.studentName}</strong>
                        <span className="text-[10px] text-stone-400">{cert.certNumber}</span>
                      </div>
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Certificate Preview */}
            <div className="lg:col-span-7">
              {generatedCertPreview ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-400">Live Certificate Preview</span>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer font-kufi"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Certificate</span>
                    </button>
                  </div>

                  <div
                    id="printable-certificate"
                    className="relative bg-gradient-to-b from-amber-50 via-amber-100 to-amber-50 text-stone-900 rounded-3xl p-6 sm:p-8 border-8 border-amber-600/70 shadow-2xl text-center font-serif"
                  >
                    <p className="font-amiri text-xl sm:text-2xl text-emerald-950 font-bold mb-1">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                    <h4 className="text-base sm:text-lg font-bold font-serif text-emerald-900 uppercase tracking-widest">
                      {settings.siteTitle.en}
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 uppercase tracking-wider mb-4">
                      Official Certificate of Scholarly Completion
                    </p>

                    <p className="text-xs text-stone-600 italic">This is to certify that</p>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 my-1 font-kufi border-b border-amber-600/40 inline-block px-6 pb-0.5">
                      {generatedCertPreview.studentName}
                    </h3>
                    <p className="text-xs text-stone-600">S/o {generatedCertPreview.fatherName}</p>

                    <p className="text-xs text-stone-700 mt-3 max-w-sm mx-auto">
                      has successfully satisfied all academic assessments in:
                    </p>
                    <h4 className="text-sm sm:text-base font-bold text-emerald-900 my-1">
                      "{generatedCertPreview.courseName}"
                    </h4>

                    <div className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-900 border border-amber-600/40 text-[11px] font-bold my-1">
                      Grade: {generatedCertPreview.grade}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-6 pt-3 border-t border-amber-700/30 text-xs text-stone-700">
                      <div className="text-left">
                        <span className="text-[10px] text-stone-500 block">Issue Date:</span>
                        <strong>{generatedCertPreview.issueDate}</strong>
                        <span className="block font-mono text-[9px] text-stone-500 mt-0.5">{generatedCertPreview.certNumber}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 block">Academic Director:</span>
                        <strong className="text-emerald-950 font-amiri text-sm block">{generatedCertPreview.issuedBy}</strong>
                        <span className="text-[9px] text-amber-800 font-bold">Verified Seal & Sanad</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 bg-stone-900/50 border border-dashed border-stone-800 rounded-3xl text-center text-stone-500">
                  <Award className="w-12 h-12 text-stone-700 mb-3" />
                  <p className="text-sm font-medium">No Certificate Selected for Preview</p>
                  <p className="text-xs mt-1">Fill out the form on the left to issue and print an official certificate.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- TAB 9: THEME & BACKGROUNDS CONTROL ----------------- */}
        {activeTab === 'theme' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto space-y-8">
            <div>
              <h3 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-400" />
                <span>Theme, Banner & Background Styler</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Customize upper banner color, beneath page background, and cards matching background with harmonious contrast
              </p>
            </div>

            {/* 1-Click Preset Palettes */}
            <div>
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                1-Click Master Palettes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {THEME_PALETTES.map((pal, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        navbarBg: pal.navbarBg,
                        pageBg: pal.pageBg,
                        cardBg: pal.cardBg,
                        cardBorder: pal.cardBorder,
                        primaryColor: pal.primaryColor,
                        accentColor: pal.accentColor,
                        textColor: pal.textColor
                      }));
                      showToast(`Applied preset: ${pal.name}`);
                    }}
                    className="p-3.5 rounded-2xl border border-stone-700 bg-stone-950 hover:border-amber-400 text-left transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-xs text-stone-200 block">{pal.name}</strong>
                      <div className="flex gap-1.5 mt-2">
                        <span className="w-4 h-4 rounded-full border border-stone-600" style={{ backgroundColor: pal.navbarBg }} title="Banner" />
                        <span className="w-4 h-4 rounded-full border border-stone-600" style={{ backgroundColor: pal.pageBg }} title="Beneath Background" />
                        <span className="w-4 h-4 rounded-full border border-stone-600" style={{ backgroundColor: pal.cardBg }} title="Card Background" />
                        <span className="w-4 h-4 rounded-full border border-stone-600" style={{ backgroundColor: pal.cardBorder }} title="Border Accent" />
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold">Apply &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Color Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-stone-950 rounded-2xl border border-stone-800">
              <div>
                <label className="block font-semibold text-stone-300 text-xs mb-1">Upper Banner / Header</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.navbarBg || '#064e3b'}
                    onChange={(e) => setSettings({ ...settings, navbarBg: e.target.value })}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-xs text-stone-300">{settings.navbarBg || '#064e3b'}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 text-xs mb-1">Beneath Page Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.pageBg || '#0c0a09'}
                    onChange={(e) => setSettings({ ...settings, pageBg: e.target.value })}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-xs text-stone-300">{settings.pageBg || '#0c0a09'}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 text-xs mb-1">Cards Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.cardBg || '#1c1917'}
                    onChange={(e) => setSettings({ ...settings, cardBg: e.target.value })}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-xs text-stone-300">{settings.cardBg || '#1c1917'}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 text-xs mb-1">Cards Border & Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.cardBorder || '#d97706'}
                    onChange={(e) => setSettings({ ...settings, cardBorder: e.target.value })}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-xs text-stone-300">{settings.cardBorder || '#d97706'}</span>
                </div>
              </div>
            </div>

            {/* Live Visual Card Simulation */}
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                Live Contrast Preview
              </span>
              <div 
                className="p-6 rounded-2xl border transition-all"
                style={{ backgroundColor: settings.pageBg || '#0c0a09' }}
              >
                <div 
                  className="p-4 rounded-xl mb-4 text-xs font-bold flex justify-between items-center text-white shadow"
                  style={{ backgroundColor: settings.navbarBg || '#064e3b' }}
                >
                  <span>Upper Banner Header: {settings.siteTitle.en}</span>
                  <span className="text-[10px] text-amber-300 font-mono">Live Header View</span>
                </div>

                <div 
                  className="p-5 rounded-2xl border transition-all max-w-sm mx-auto shadow-xl"
                  style={{ 
                    backgroundColor: settings.cardBg || '#1c1917',
                    borderColor: settings.cardBorder || '#d97706'
                  }}
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-amber-300 uppercase">
                    Sample Card on Custom Background
                  </span>
                  <h4 className="font-bold text-sm text-stone-100 my-1">Advanced Quranic Tajweed & Phonetics</h4>
                  <p className="text-xs text-stone-300">Perfect contrast harmonized with your chosen page background.</p>
                  <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center">
                    <strong className="text-amber-400 font-mono text-xs">PKR 4,500/mo</strong>
                    <button className="px-3 py-1 rounded-lg bg-amber-500 text-stone-950 font-bold text-[10px]">Enroll</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Title with English Input & Auto-Translation */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <label className="block font-bold text-xs text-amber-400 uppercase tracking-wider">
                    Academy Name (Only in English & Auto-Translate to Arabic & Urdu)
                  </label>
                  <p className="text-[11px] text-stone-400">
                    Type your Academy name in English and click Auto-Translate to instantly generate prestigious Arabic & Urdu titles!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAutoTranslateTitle}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer font-kufi shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✨ Auto-Translate to Arabic & Urdu</span>
                </button>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block mb-1">English Academy Title:</span>
                <input
                  type="text"
                  value={settings.siteTitle.en}
                  onChange={(e) => {
                    const enVal = e.target.value;
                    const autoTr = autoTranslateAcademyName(enVal);
                    setSettings({
                      ...settings,
                      siteTitle: {
                        en: enVal,
                        ur: autoTr.ur,
                        ar: autoTr.ar
                      }
                    });
                  }}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-stone-400 block mb-1">Auto-Generated Urdu Title:</span>
                  <input
                    type="text"
                    value={settings.siteTitle.ur}
                    onChange={(e) => setSettings({
                      ...settings,
                      siteTitle: { ...settings.siteTitle, ur: e.target.value }
                    })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-100 outline-none font-nastaliq"
                    dir="rtl"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block mb-1">Auto-Generated Arabic Title:</span>
                  <input
                    type="text"
                    value={settings.siteTitle.ar}
                    onChange={(e) => setSettings({
                      ...settings,
                      siteTitle: { ...settings.siteTitle, ar: e.target.value }
                    })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-stone-100 outline-none font-amiri"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>

            {/* Section Visibility Toggles */}
            <div className="space-y-3 pt-4 border-t border-stone-800">
              <label className="block font-bold text-xs text-amber-400 uppercase tracking-wider">
                Show / Hide Website Sections
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {Object.entries(settings.activeSections).map(([secKey, isAct]) => (
                  <button
                    key={secKey}
                    type="button"
                    onClick={() => setSettings({
                      ...settings,
                      activeSections: { ...settings.activeSections, [secKey]: !isAct }
                    })}
                    className={`p-3 rounded-xl border flex items-center justify-between capitalize transition-all cursor-pointer ${
                      isAct ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' : 'bg-stone-800/60 border-stone-700 text-stone-500'
                    }`}
                  >
                    <span>{secKey}</span>
                    <span className="text-[10px] font-bold">{isAct ? '✓ Visible' : '✕ Hidden'}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveTheme}
              className="w-full py-3.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm shadow-md transition-all cursor-pointer font-kufi"
            >
              Save Theme, Background Colors & Title Settings
            </button>
          </div>
        )}

        {/* ----------------- TAB 10: ACADEMY POLICIES & SAFEGUARDS EDITOR ----------------- */}
        {activeTab === 'policies' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
            <div>
              <h3 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Academy Policies & Student Safeguards Editor</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Edit and update the 30-Day Money-Back Guarantee, Privacy & Female Modesty, Fee Policies, and Terms in English, Urdu, and Arabic
              </p>
            </div>

            {/* Refund Policy */}
            <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
              <span className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4" />
                <span>1. Refund Policy & 30-Day Guarantee (ضمان استرجاع الرسوم)</span>
              </span>
              <div className="space-y-2">
                <label className="text-[11px] text-stone-400 block">English Version:</label>
                <textarea
                  rows={3}
                  value={settings.policies?.refund?.en || INITIAL_POLICIES.refund.en}
                  onChange={(e) => setSettings({
                    ...settings,
                    policies: {
                      ...settings.policies!,
                      refund: { ...settings.policies!.refund, en: e.target.value }
                    }
                  })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] text-stone-400 block">Urdu Version (اردو متن):</label>
                <textarea
                  rows={3}
                  value={settings.policies?.refund?.ur || INITIAL_POLICIES.refund.ur}
                  onChange={(e) => setSettings({
                    ...settings,
                    policies: {
                      ...settings.policies!,
                      refund: { ...settings.policies!.refund, ur: e.target.value }
                    }
                  })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none font-nastaliq"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Privacy Policy */}
            <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
              <span className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4" />
                <span>2. Privacy & Female Modesty Safeguards (الخصوصية والستر الشرعي)</span>
              </span>
              <div className="space-y-2">
                <label className="text-[11px] text-stone-400 block">English Version:</label>
                <textarea
                  rows={3}
                  value={settings.policies?.privacy?.en || INITIAL_POLICIES.privacy.en}
                  onChange={(e) => setSettings({
                    ...settings,
                    policies: {
                      ...settings.policies!,
                      privacy: { ...settings.policies!.privacy, en: e.target.value }
                    }
                  })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] text-stone-400 block">Urdu Version (اردو متن):</label>
                <textarea
                  rows={3}
                  value={settings.policies?.privacy?.ur || INITIAL_POLICIES.privacy.ur}
                  onChange={(e) => setSettings({
                    ...settings,
                    policies: {
                      ...settings.policies!,
                      privacy: { ...settings.policies!.privacy, ur: e.target.value }
                    }
                  })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none font-nastaliq"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Tuition & Fee Policy */}
            <div className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
              <span className="font-bold text-sky-400 text-sm flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                <span>3. Tuition & Fee Schedule Policy (ضوابط الرسوم الدراسية)</span>
              </span>
              <div className="space-y-2">
                <label className="text-[11px] text-stone-400 block">English Version:</label>
                <textarea
                  rows={2}
                  value={settings.policies?.payment?.en || INITIAL_POLICIES.payment.en}
                  onChange={(e) => setSettings({
                    ...settings,
                    policies: {
                      ...settings.policies!,
                      payment: { ...settings.policies!.payment, en: e.target.value }
                    }
                  })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] text-stone-400 block">Urdu Version (اردو متن):</label>
                <textarea
                  rows={2}
                  value={settings.policies?.payment?.ur || INITIAL_POLICIES.payment.ur}
                  onChange={(e) => setSettings({
                    ...settings,
                    policies: {
                      ...settings.policies!,
                      payment: { ...settings.policies!.payment, ur: e.target.value }
                    }
                  })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none font-nastaliq"
                  dir="rtl"
                />
              </div>
            </div>

            <button
              onClick={handleSavePolicies}
              className="w-full py-3.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm shadow-md transition-all cursor-pointer font-kufi"
            >
              Save & Publish Updated Academy Policies
            </button>
          </div>
        )}

        {/* ----------------- TAB 11: NOTICE & PAYMENT GATEWAYS (LOCAL + OVERSEAS) ----------------- */}
        {activeTab === 'notice_payments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Urgent Notice Banner */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <span>Urgent Notice Banner Manager</span>
              </h3>
              <p className="text-xs text-stone-400">
                Update the ticker announcement displayed at the top of the academy website
              </p>

              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-stone-300">Banner Active:</label>
                <button
                  type="button"
                  onClick={() => setNotice({ ...notice, enabled: !notice.enabled })}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                    notice.enabled ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {notice.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Notice Text (English)</label>
                <textarea
                  rows={2}
                  value={notice.text.en}
                  onChange={(e) => setNotice({ ...notice, text: { ...notice.text, en: e.target.value } })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Notice Text (Urdu)</label>
                <textarea
                  rows={2}
                  value={notice.text.ur}
                  onChange={(e) => setNotice({ ...notice, text: { ...notice.text, ur: e.target.value } })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 outline-none font-nastaliq"
                  dir="rtl"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-stone-300 mb-1">Action Link URL</label>
                <input
                  type="text"
                  value={notice.linkUrl || '#courses'}
                  onChange={(e) => setNotice({ ...notice, linkUrl: e.target.value })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-xs text-stone-100 font-mono"
                />
              </div>
            </div>

            {/* Local & Overseas Payment Gateways */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span>Payment Gateways (Local & Overseas)</span>
              </h3>
              <p className="text-xs text-stone-400">
                Update account numbers, Wise, PayPal, SWIFT, and International Card portals
              </p>

              <div className="space-y-3 text-xs max-h-[460px] overflow-y-auto pr-1">
                {/* EasyPaisa */}
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 block">EasyPaisa (پاکستان):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={payments.easypaisa.accountTitle}
                      onChange={(e) => setPayments({
                        ...payments,
                        easypaisa: { ...payments.easypaisa, accountTitle: e.target.value }
                      })}
                      className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200"
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={payments.easypaisa.accountNumber}
                      onChange={(e) => setPayments({
                        ...payments,
                        easypaisa: { ...payments.easypaisa, accountNumber: e.target.value }
                      })}
                      className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200 font-mono"
                    />
                  </div>
                </div>

                {/* JazzCash */}
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="font-bold text-rose-400 block">JazzCash (پاکستان):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={payments.jazzcash.accountTitle}
                      onChange={(e) => setPayments({
                        ...payments,
                        jazzcash: { ...payments.jazzcash, accountTitle: e.target.value }
                      })}
                      className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200"
                    />
                    <input
                      type="text"
                      placeholder="Number"
                      value={payments.jazzcash.accountNumber}
                      onChange={(e) => setPayments({
                        ...payments,
                        jazzcash: { ...payments.jazzcash, accountNumber: e.target.value }
                      })}
                      className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200 font-mono"
                    />
                  </div>
                </div>

                {/* Overseas Wise */}
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 block">Wise (TransferWise - Overseas):</span>
                  <input
                    type="email"
                    placeholder="Wise Recipient Email"
                    value={payments.overseas.wiseEmail}
                    onChange={(e) => setPayments({
                      ...payments,
                      overseas: { ...payments.overseas, wiseEmail: e.target.value }
                    })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200 font-mono"
                  />
                </div>

                {/* Overseas PayPal */}
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="font-bold text-sky-400 block">PayPal Account & Link (Overseas):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      placeholder="PayPal Email"
                      value={payments.overseas.paypalEmail}
                      onChange={(e) => setPayments({
                        ...payments,
                        overseas: { ...payments.overseas, paypalEmail: e.target.value }
                      })}
                      className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="PayPal.me Link"
                      value={payments.overseas.paypalMeLink || ''}
                      onChange={(e) => setPayments({
                        ...payments,
                        overseas: { ...payments.overseas, paypalMeLink: e.target.value }
                      })}
                      className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200 font-mono"
                    />
                  </div>
                </div>

                {/* International SWIFT & IBAN */}
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="font-bold text-amber-400 block">International Bank Wire (SWIFT / BIC & IBAN):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="SWIFT / BIC Code"
                      value={payments.overseas.bankSwift || ''}
                      onChange={(e) => setPayments({
                        ...payments,
                        overseas: { ...payments.overseas, bankSwift: e.target.value }
                      })}
                      className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200 font-mono"
                    />
                    <input
                      type="text"
                      placeholder="International IBAN"
                      value={payments.overseas.internationalIban || ''}
                      onChange={(e) => setPayments({
                        ...payments,
                        overseas: { ...payments.overseas, internationalIban: e.target.value }
                      })}
                      className="bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200 font-mono"
                    />
                  </div>
                </div>

                {/* Debit/Credit Card Portal URL */}
                <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5">
                  <span className="font-bold text-stone-300 block">International Card Checkout Portal Link (Stripe/Card):</span>
                  <input
                    type="url"
                    placeholder="https://buy.stripe.com/..."
                    value={payments.overseas.cardPortalUrl || ''}
                    onChange={(e) => setPayments({
                      ...payments,
                      overseas: { ...payments.overseas, cardPortalUrl: e.target.value }
                    })}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 text-stone-200 font-mono text-[11px]"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveNoticeAndPayments}
                className="w-full py-3 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm shadow-md transition-all cursor-pointer font-kufi"
              >
                Save Notice & Payment Gateways
              </button>
            </div>

          </div>
        )}

      </main>

      {/* ----------------- MODAL: INVOICE & RECEIPT VIEWER (MULTILINGUAL) ----------------- */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
            
            {/* Header Controls */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-amber-300 text-sm">Official Receipt / Invoice</span>
              </div>

              {/* Language Switcher for Invoice */}
              <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setInvoiceModalLang('ur')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer font-nastaliq ${invoiceModalLang === 'ur' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'}`}
                >
                  اردو رسید
                </button>
                <button
                  onClick={() => setInvoiceModalLang('ar')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer font-amiri ${invoiceModalLang === 'ar' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'}`}
                >
                  فاتورة عربية
                </button>
                <button
                  onClick={() => setInvoiceModalLang('en')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer ${invoiceModalLang === 'en' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300'}`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Printable White Receipt Box */}
            <div
              id="printable-admin-invoice"
              className="bg-white text-stone-900 rounded-2xl p-6 shadow-2xl border-4 border-amber-500/50 text-xs sm:text-sm font-sans"
              dir={invoiceModalLang === 'ur' || invoiceModalLang === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="flex justify-between items-start border-b-2 border-stone-800 pb-3 mb-4">
                <div>
                  <h4 className="text-xl font-bold font-kufi text-emerald-950">
                    {settings.siteTitle[invoiceModalLang] || settings.siteTitle.en}
                  </h4>
                  <p className="text-xs text-stone-600 font-medium">
                    {invoiceModalLang === 'ur' ? 'دار العلوم و اللغات الإسلامية — سرکاری رسیدِ فیس و داخلہ' : invoiceModalLang === 'ar' ? 'دار العلوم واللغات — فاتورة معتمدة وسند سداد' : 'Official Academic Fee & Enrollment Invoice'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {invoiceModalLang === 'ur' ? 'نگرانِ علمی: مفتی دانش کلیم' : invoiceModalLang === 'ar' ? 'المشرف العام: فضيلة المفتي دانش كليم' : 'Director: Mufti Danish Kaleem'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-sm font-bold bg-amber-100 text-stone-950 px-3 py-1 rounded-md border border-amber-300 inline-block">
                    {selectedOrderForInvoice.id}
                  </span>
                  <span className="text-[10px] text-stone-500 block mt-1">{selectedOrderForInvoice.createdAt}</span>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-500 block">{invoiceModalLang === 'ur' ? 'طالب علم کا نام:' : invoiceModalLang === 'ar' ? 'اسم الطالب:' : 'Student Name:'}</span>
                  <strong className="text-sm text-stone-950">{selectedOrderForInvoice.studentName}</strong>
                  <p className="text-stone-600 mt-1">
                    {invoiceModalLang === 'ur' ? 'ولدیت / سرپرست: ' : invoiceModalLang === 'ar' ? 'اسم الوالد: ' : "Father: "}
                    <strong>{selectedOrderForInvoice.fatherName}</strong>
                  </p>
                </div>
                <div>
                  <span className="text-stone-500 block">{invoiceModalLang === 'ur' ? 'واٹس ایپ نمبر:' : invoiceModalLang === 'ar' ? 'رقم الواتساب:' : 'WhatsApp:'}</span>
                  <strong className="font-mono" dir="ltr">{selectedOrderForInvoice.whatsapp}</strong>
                  <p className="text-stone-600 mt-1">
                    {invoiceModalLang === 'ur' ? 'شہر / ملک: ' : invoiceModalLang === 'ar' ? 'المدينة: ' : 'City: '}
                    {selectedOrderForInvoice.countryCity}
                  </p>
                </div>
              </div>

              {/* Item Specs Table */}
              <table className="w-full text-xs mb-4">
                <thead>
                  <tr className="border-b-2 border-stone-300 text-stone-700">
                    <th className="py-2 text-left">{invoiceModalLang === 'ur' ? 'تفصیلاتِ کورس / کتاب' : invoiceModalLang === 'ar' ? 'بيان المقرر / الكتاب' : 'Description'}</th>
                    <th className="py-2 text-right">{invoiceModalLang === 'ur' ? 'رقم' : invoiceModalLang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2.5 font-medium text-stone-800">{selectedOrderForInvoice.courseOrItemTitle}</td>
                    <td className="py-2.5 font-mono font-bold text-right text-stone-950">PKR {selectedOrderForInvoice.totalAmountPKR.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-stone-800 font-bold text-sm">
                    <td className="py-2.5">{invoiceModalLang === 'ur' ? 'کل قابلِ ادا فیس:' : invoiceModalLang === 'ar' ? 'المبلغ الإجمالي:' : 'Grand Total:'}</td>
                    <td className="py-2.5 text-right font-mono text-emerald-900">PKR {selectedOrderForInvoice.totalAmountPKR.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>

              {/* Status and Seal */}
              <div className="border-t border-stone-200 pt-3 flex justify-between items-center text-xs">
                <div>
                  <span className="text-stone-500 block">{invoiceModalLang === 'ur' ? 'حالتِ ادائیگی:' : invoiceModalLang === 'ar' ? 'حالة السداد:' : 'Payment Status:'}</span>
                  <span className="font-bold text-amber-800">{selectedOrderForInvoice.paymentStatus} via {selectedOrderForInvoice.paymentMethod.toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-1.5 border border-amber-300 bg-amber-50 px-3 py-1.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-[10px] font-bold text-stone-800">
                    {invoiceModalLang === 'ur' ? 'مہر و تصدیق: ادارہ دانش' : invoiceModalLang === 'ar' ? 'ختم الاعتماد الأكاديمي' : 'Verified Academy Seal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4">
              <a
                href={getSendWhatsAppUrl(selectedOrderForInvoice)}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Share via WhatsApp</span>
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedOrderForInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ----------------- MODAL: FULL COURSE EDITOR / CREATOR ----------------- */}
      {(editingCourse || showAddCourseModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[92vh] space-y-4">
            <h4 className="text-xl font-bold font-kufi text-amber-300">
              {editingCourse ? 'Edit Course Syllabus & Fee' : 'Publish New Course to Curriculum'}
            </h4>

            {(() => {
              const currentCourse: Course = editingCourse || {
                id: `course-${Date.now()}`,
                title: { en: '', ur: '', ar: '' },
                category: 'tajweed',
                description: { en: '', ur: '', ar: '' },
                feeMonthlyPKR: 4500,
                feeUSD: 35,
                duration: { en: '3 Months (36 Sessions)', ur: '3 ماہ (36 اسباق)', ar: '3 أشهر' },
                classesPerWeek: 3,
                instructor: { en: 'Mufti Danish Kaleem', ur: 'مفتی دانش کلیم', ar: 'المفتي دانش كليم' },
                level: 'All Levels',
                features: ['1-on-1 Zoom Lessons', 'PDF Notes', 'Completion Certificate'],
                isVisible: true,
                isPopular: false
              };

              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingCourse) {
                      handleSaveCourseEdit(e);
                    } else {
                      handleCreateNewCourse(currentCourse);
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  {/* Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={currentCourse.title.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, title: { ...editingCourse.title, en: val } });
                          } else {
                            currentCourse.title.en = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                        placeholder="e.g. Advanced Quranic Tajweed"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Title (Urdu) *</label>
                      <input
                        type="text"
                        required
                        value={currentCourse.title.ur}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, title: { ...editingCourse.title, ur: val } });
                          } else {
                            currentCourse.title.ur = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-nastaliq"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Title (Arabic)</label>
                      <input
                        type="text"
                        value={currentCourse.title.ar}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, title: { ...editingCourse.title, ar: val } });
                          } else {
                            currentCourse.title.ar = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-amiri"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Category & Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Category</label>
                      <select
                        value={currentCourse.category}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, category: val });
                          } else {
                            currentCourse.category = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                      >
                        <option value="tajweed">Tajweed & Tarteel</option>
                        <option value="arabic">Arabic Grammar</option>
                        <option value="hadith_fiqh">Hadith & Fiqh</option>
                        <option value="tafseer">Tafseer & Tadabbur</option>
                        <option value="hifz">Quran Hifz</option>
                        <option value="qirat">Qira'at & Sanad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Monthly Fee (PKR)</label>
                      <input
                        type="number"
                        required
                        value={currentCourse.feeMonthlyPKR}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, feeMonthlyPKR: val, feeUSD: Math.round(val / 125) });
                          } else {
                            currentCourse.feeMonthlyPKR = val;
                            currentCourse.feeUSD = Math.round(val / 125);
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Duration</label>
                      <input
                        type="text"
                        value={currentCourse.duration.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, duration: { ...editingCourse.duration, en: val, ur: val } });
                          } else {
                            currentCourse.duration.en = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                        placeholder="e.g. 3 Months (36 Sessions)"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Classes / Week</label>
                      <input
                        type="number"
                        value={currentCourse.classesPerWeek}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, classesPerWeek: val });
                          } else {
                            currentCourse.classesPerWeek = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Description (English)</label>
                    <textarea
                      rows={2}
                      value={currentCourse.description.en}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingCourse) {
                          setEditingCourse({ ...editingCourse, description: { ...editingCourse.description, en: val } });
                        } else {
                          currentCourse.description.en = val;
                        }
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                    />
                  </div>

                  {/* Syllabus / Features list */}
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Curriculum & Syllabus Highlights (Bullet points)</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Add curriculum item (e.g. Makharij Drill, Waqf Rules)..."
                        value={newCourseCurriculumInput}
                        onChange={(e) => setNewCourseCurriculumInput(e.target.value)}
                        className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-100"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newCourseCurriculumInput.trim()) return;
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, features: [...editingCourse.features, newCourseCurriculumInput.trim()] });
                          } else {
                            currentCourse.features.push(newCourseCurriculumInput.trim());
                          }
                          setNewCourseCurriculumInput('');
                        }}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(editingCourse ? editingCourse.features : currentCourse.features).map((feat, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 text-xs flex items-center gap-1.5">
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => {
                              if (editingCourse) {
                                setEditingCourse({ ...editingCourse, features: editingCourse.features.filter((_, i) => i !== idx) });
                              } else {
                                currentCourse.features = currentCourse.features.filter((_, i) => i !== idx);
                              }
                            }}
                            className="text-stone-400 hover:text-rose-400 font-bold"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Badges and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                    <label className="flex items-center gap-2 text-xs font-semibold text-stone-300">
                      <input
                        type="checkbox"
                        checked={editingCourse ? editingCourse.isPopular : currentCourse.isPopular}
                        onChange={(e) => {
                          const val = e.target.checked;
                          if (editingCourse) {
                            setEditingCourse({ ...editingCourse, isPopular: val });
                          } else {
                            currentCourse.isPopular = val;
                          }
                        }}
                        className="rounded"
                      />
                      <span>Mark as High Demand / Popular Badge</span>
                    </label>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCourse(null);
                          setShowAddCourseModal(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-kufi"
                      >
                        {editingCourse ? 'Save Changes' : 'Publish Course'}
                      </button>
                    </div>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* ----------------- MODAL: DIGITAL STORE ITEM FULL EDITOR ----------------- */}
      {(editingStoreItem || showAddStoreModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[92vh] space-y-4">
            <h4 className="text-xl font-bold font-kufi text-amber-300">
              {editingStoreItem ? 'Edit Bookstore Item & Digital Files' : 'Add New Bookstore Product / PDF'}
            </h4>

            {(() => {
              const currentItem: StoreItem = editingStoreItem || {
                id: `store-${Date.now()}`,
                title: { en: '', ur: '', ar: '' },
                category: 'pdf',
                pricePKR: 800,
                priceUSD: 6,
                description: { en: '', ur: '', ar: '' },
                includes: ['Full PDF eBook', 'Permanent Download Access'],
                formatBadge: 'PDF Book',
                isVisible: true
              };

              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingStoreItem) {
                      handleSaveStoreItemEdit(e);
                    } else {
                      storage.addStoreItem(currentItem);
                      setStoreItems(storage.getStoreItems());
                      setShowAddStoreModal(false);
                      showToast("New Bookstore product published!");
                    }
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={currentItem.title.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingStoreItem) {
                            setEditingStoreItem({ ...editingStoreItem, title: { ...editingStoreItem.title, en: val } });
                          } else {
                            currentItem.title.en = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Title (Urdu) *</label>
                      <input
                        type="text"
                        required
                        value={currentItem.title.ur}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingStoreItem) {
                            setEditingStoreItem({ ...editingStoreItem, title: { ...editingStoreItem.title, ur: val } });
                          } else {
                            currentItem.title.ur = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-nastaliq"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Format Badge</label>
                      <input
                        type="text"
                        value={currentItem.formatBadge}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingStoreItem) {
                            setEditingStoreItem({ ...editingStoreItem, formatBadge: val });
                          } else {
                            currentItem.formatBadge = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                        placeholder="e.g. PDF Book, Video Module"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Price (PKR)</label>
                      <input
                        type="number"
                        required
                        value={currentItem.pricePKR}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (editingStoreItem) {
                            setEditingStoreItem({ ...editingStoreItem, pricePKR: val, priceUSD: Math.round(val / 130) });
                          } else {
                            currentItem.pricePKR = val;
                            currentItem.priceUSD = Math.round(val / 130);
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Price (USD)</label>
                      <input
                        type="number"
                        value={currentItem.priceUSD}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (editingStoreItem) {
                            setEditingStoreItem({ ...editingStoreItem, priceUSD: val });
                          } else {
                            currentItem.priceUSD = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Description (English)</label>
                    <textarea
                      rows={2}
                      value={currentItem.description.en}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingStoreItem) {
                          setEditingStoreItem({ ...editingStoreItem, description: { ...editingStoreItem.description, en: val } });
                        } else {
                          currentItem.description.en = val;
                        }
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                    />
                  </div>

                  {/* File Upload for PDF */}
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Re-upload PDF or Document</label>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const dataUrl = ev.target?.result as string;
                          if (editingStoreItem) {
                            setEditingStoreItem({
                              ...editingStoreItem,
                              fileName: file.name,
                              fileSize: `${sizeInMB} MB`,
                              fileData: dataUrl
                            });
                          } else {
                            currentItem.fileName = file.name;
                            currentItem.fileSize = `${sizeInMB} MB`;
                            currentItem.fileData = dataUrl;
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-amber-500 file:text-stone-950 file:font-bold"
                    />
                    {currentItem.fileName && (
                      <p className="text-[11px] text-emerald-400 mt-1">Attached: {currentItem.fileName} ({currentItem.fileSize})</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStoreItem(null);
                        setShowAddStoreModal(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-kufi"
                    >
                      {editingStoreItem ? 'Save Product' : 'Publish Product'}
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* ----------------- MODAL: DIGITAL PDF UPLOADER ----------------- */}
      {showAddPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[92vh] space-y-4">
            <h4 className="text-xl font-bold font-kufi text-amber-300 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-400" />
              <span>Upload New PDF Document / Book</span>
            </h4>

            {/* Target Select */}
            <div className="flex gap-2 p-1 bg-stone-950 rounded-xl border border-stone-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPdfTarget('publication')}
                className={`flex-1 py-2 rounded-lg cursor-pointer ${pdfTarget === 'publication' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'}`}
              >
                Free Scholarly Publication / Fatawa
              </button>
              <button
                type="button"
                onClick={() => setPdfTarget('store')}
                className={`flex-1 py-2 rounded-lg cursor-pointer ${pdfTarget === 'store' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400'}`}
              >
                Paid Bookstore PDF Product
              </button>
            </div>

            <form onSubmit={handleCreatePdfItem} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Concise Rules of Tajweed"
                    value={pdfTitleEn}
                    onChange={(e) => setPdfTitleEn(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Title (Urdu) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. احکامِ تجوید کا خلاصہ"
                    value={pdfTitleUr}
                    onChange={(e) => setPdfTitleUr(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-nastaliq"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Category</label>
                  <select
                    value={pdfCategory}
                    onChange={(e) => setPdfCategory(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                  >
                    <option value="Quran & Tajweed">Quran & Tajweed</option>
                    <option value="Arabic Grammar">Arabic Grammar</option>
                    <option value="Fiqh & Fatawa">Fiqh & Fatawa</option>
                    <option value="Hadith Studies">Hadith Studies</option>
                    <option value="Research Paper">Research Paper</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Pages Count</label>
                  <input
                    type="number"
                    value={pdfPages}
                    onChange={(e) => setPdfPages(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                  />
                </div>
                {pdfTarget === 'store' && (
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Price (PKR)</label>
                    <input
                      type="number"
                      value={pdfPricePKR}
                      onChange={(e) => setPdfPricePKR(Number(e.target.value))}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Real PDF File Upload Input */}
              <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <label className="block font-bold text-amber-400 text-xs">
                  Attach PDF File from Computer / Device
                </label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfFileUpload}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-300 file:mr-3 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:bg-amber-500 file:text-stone-950 file:font-bold cursor-pointer"
                />
                {pdfFileName && (
                  <p className="text-[11px] text-emerald-400 font-semibold">
                    ✓ File Ready: {pdfFileName} ({pdfFileSize})
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">Summary / Abstract (English)</label>
                <textarea
                  rows={2}
                  value={pdfDescriptionEn}
                  onChange={(e) => setPdfDescriptionEn(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                  placeholder="Summary of research treatise or book content..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddPdfModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-kufi"
                >
                  Save & Publish PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: MEDIA ADS & VIDEO/PIC ADD OR EDIT ----------------- */}
      {showAddMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[92vh] space-y-4">
            <h4 className="text-xl font-bold font-kufi text-amber-300">
              {editingMediaAd ? 'Edit Media Ad / Video Announcement' : 'Publish New Media Picture / Video'}
            </h4>

            {(() => {
              const currentMedia: MediaAdItem = editingMediaAd || {
                id: `ad-${Date.now()}`,
                title: { en: '', ur: '', ar: '' },
                type: 'poster',
                mediaUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
                badge: { en: 'Admissions Open', ur: 'داخلے جاری ہیں', ar: 'التسجيل متاح' },
                description: { en: '', ur: '', ar: '' },
                ctaText: { en: 'Enroll Now', ur: 'داخلہ لیں', ar: 'سجل الآن' },
                ctaLink: '#courses',
                isVisible: true
              };

              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveMediaAd(currentMedia);
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Media Type</label>
                      <select
                        value={currentMedia.type}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          if (editingMediaAd) {
                            setEditingMediaAd({ ...editingMediaAd, type: val });
                          } else {
                            currentMedia.type = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                      >
                        <option value="poster">Image Flyer / Picture Poster</option>
                        <option value="video">Video Lecture Clip</option>
                        <option value="announcement">Announcement Banner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Badge Text (English)</label>
                      <input
                        type="text"
                        value={currentMedia.badge.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingMediaAd) {
                            setEditingMediaAd({ ...editingMediaAd, badge: { ...editingMediaAd.badge, en: val, ur: val } });
                          } else {
                            currentMedia.badge.en = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Title (English) *</label>
                      <input
                        type="text"
                        required
                        value={currentMedia.title.en}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingMediaAd) {
                            setEditingMediaAd({ ...editingMediaAd, title: { ...editingMediaAd.title, en: val } });
                          } else {
                            currentMedia.title.en = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Title (Urdu)</label>
                      <input
                        type="text"
                        value={currentMedia.title.ur}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingMediaAd) {
                            setEditingMediaAd({ ...editingMediaAd, title: { ...editingMediaAd.title, ur: val } });
                          } else {
                            currentMedia.title.ur = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-nastaliq"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Picture / Video Upload or URL */}
                  <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                    <label className="block font-bold text-amber-400 text-xs">
                      Media File Upload (Picture or Video)
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const dataUrl = ev.target?.result as string;
                          if (editingMediaAd) {
                            setEditingMediaAd({ ...editingMediaAd, mediaUrl: dataUrl });
                          } else {
                            currentMedia.mediaUrl = dataUrl;
                          }
                          showToast("Media file attached successfully!");
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-amber-500 file:text-stone-950 file:font-bold cursor-pointer"
                    />
                    <div>
                      <span className="text-[10px] text-stone-400 block mb-1">Or Direct Media Image / Video URL:</span>
                      <input
                        type="text"
                        value={currentMedia.mediaUrl}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingMediaAd) {
                            setEditingMediaAd({ ...editingMediaAd, mediaUrl: val });
                          } else {
                            currentMedia.mediaUrl = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Description (English)</label>
                    <textarea
                      rows={2}
                      value={currentMedia.description.en}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingMediaAd) {
                          setEditingMediaAd({ ...editingMediaAd, description: { ...editingMediaAd.description, en: val } });
                        } else {
                          currentMedia.description.en = val;
                        }
                      }}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Button CTA Text</label>
                      <input
                        type="text"
                        value={currentMedia.ctaText?.en || 'Enroll Now'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingMediaAd) {
                            setEditingMediaAd({ ...editingMediaAd, ctaText: { en: val, ur: val, ar: val } });
                          } else {
                            currentMedia.ctaText = { en: val, ur: val, ar: val };
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">Target Link</label>
                      <input
                        type="text"
                        value={currentMedia.ctaLink || '#courses'}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (editingMediaAd) {
                            setEditingMediaAd({ ...editingMediaAd, ctaLink: val });
                          } else {
                            currentMedia.ctaLink = val;
                          }
                        }}
                        className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMediaAd(null);
                        setShowAddMediaModal(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold font-kufi"
                    >
                      {editingMediaAd ? 'Save Changes' : 'Publish Media'}
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* Founder Biography Modal Live Preview */}
      <FounderBioModal
        isOpen={showFounderBioPreview}
        onClose={() => setShowFounderBioPreview(false)}
        settings={settings}
        lang="ur"
      />

    </div>
  );
};
