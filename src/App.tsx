import React, { useState, useEffect } from 'react';
import { Language, SiteSettings, NoticeBanner, Course, StoreItem, LiveClassLink, PaymentGateways, MediaAdItem, PublicationItem, ThemeMode, TestimonialItem } from './types';
import { storage } from './utils/storage';
import { Navbar } from './components/Navbar';
import { LanguageModal } from './components/LanguageModal';
import { Hero } from './components/Hero';
import { CoursesSection } from './components/CoursesSection';
import { EnrollmentModal } from './components/EnrollmentModal';
import { DigitalStoreSection } from './components/DigitalStoreSection';
import { PublicationsSection } from './components/PublicationsSection';
import { MediaAdsSection } from './components/MediaAdsSection';
import { ScholarAppsSection } from './components/ScholarAppsSection';
import { PaymentsSection } from './components/PaymentsSection';
import { LiveClassModal } from './components/LiveClassModal';
import { CertificateVerifyModal } from './components/CertificateVerifyModal';
import { PoliciesModal } from './components/PoliciesModal';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPanel } from './components/AdminPanel';
import { StudentPortalSection } from './components/StudentPortalSection';
import { TestimonialsSection } from './components/TestimonialsSection';

export default function App() {
  // Check if initial hash or path wants admin (safe for subpaths/repo names)
  const isInitialAdmin = typeof window !== 'undefined' && (
    window.location.hash === '#admin' ||
    window.location.pathname.endsWith('/admin') ||
    window.location.pathname.endsWith('/admin/') ||
    window.location.pathname.endsWith('/admin.html')
  );

  const [viewMode, setViewMode] = useState<'site' | 'admin'>(isInitialAdmin ? 'admin' : 'site');
  
  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState<ThemeMode>(() => storage.getTheme());

  // Stored state
  const [settings, setSettings] = useState<SiteSettings>(storage.getSettings());
  const [notice, setNotice] = useState<NoticeBanner>(storage.getNotice());
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [storeItems, setStoreItems] = useState<StoreItem[]>(storage.getStoreItems());
  const [liveClass, setLiveClass] = useState<LiveClassLink>(storage.getLiveClass());
  const [payments, setPayments] = useState<PaymentGateways>(storage.getPayments());
  const [mediaAds, setMediaAds] = useState<MediaAdItem[]>(storage.getMediaAds());
  const [publications, setPublications] = useState<PublicationItem[]>(storage.getPublications());
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(storage.getTestimonials());

  // Language state: 'ur' (Urdu default for authentic experience), 'en', or 'ar'
  const [lang, setLang] = useState<Language>(
    (storage.getSavedLanguage() as Language) || 'ur'
  );

  // Initial site visit language switcher popup
  const [showLangModal, setShowLangModal] = useState(false);

  // Modals state
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<string | undefined>();
  const [liveClassModalOpen, setLiveClassModalOpen] = useState(false);
  const [certVerifyModalOpen, setCertVerifyModalOpen] = useState(false);
  const [certVerifyInitialQuery, setCertVerifyInitialQuery] = useState<string | undefined>();
  const [policiesModalOpen, setPoliciesModalOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<'refund' | 'privacy' | 'payment' | 'terms'>('refund');

  // Sync state when storage changes (from Admin Panel or other tab)
  const refreshFromStorage = () => {
    setSettings(storage.getSettings());
    setNotice(storage.getNotice());
    setCourses(storage.getCourses());
    setStoreItems(storage.getStoreItems());
    setLiveClass(storage.getLiveClass());
    setPayments(storage.getPayments());
    setMediaAds(storage.getMediaAds());
    setPublications(storage.getPublications());
    setTestimonials(storage.getTestimonials());
  };

  useEffect(() => {
    // Show initial language popup on first visit if not shown yet
    if (!storage.hasShownLangModal()) {
      setShowLangModal(true);
      storage.setLangModalShown();
    }

    // Hash listener for #admin
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      } else if (window.location.hash === '#site' || window.location.hash === '') {
        setViewMode('site');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('storage', refreshFromStorage);
    window.addEventListener('aldanish_storage_update', refreshFromStorage);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('storage', refreshFromStorage);
      window.removeEventListener('aldanish_storage_update', refreshFromStorage);
    };
  }, []);

  // Update HTML document direction and language attribute
  useEffect(() => {
    const isRtl = lang === 'ur' || lang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Synchronize Dark / Light mode class on document and body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    storage.saveTheme(theme);
  }, [theme]);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    storage.saveLanguage(newLang);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenEnrollment = (courseTitle?: string) => {
    setSelectedCourseForEnroll(courseTitle);
    setEnrollmentOpen(true);
  };

  const handleOpenPolicy = (tab: 'refund' | 'privacy' | 'payment' | 'terms') => {
    setPolicyTab(tab);
    setPoliciesModalOpen(true);
  };

  // If viewing Admin Control Panel
  if (viewMode === 'admin') {
    return (
      <AdminPanel 
        onBackToSite={() => {
          setViewMode('site');
          window.location.hash = '';
        }} 
      />
    );
  }

  // Main Academy Website
  const isDark = theme === 'dark';
  const effectivePageBg = isDark
    ? (settings.pageBg || '#0c0a09')
    : (settings.pageBg && settings.pageBg !== '#0c0a09' ? settings.pageBg : '#faf8f5');
  const effectiveCardBg = isDark
    ? (settings.cardBg || '#1c1917')
    : (settings.cardBg && settings.cardBg !== '#1c1917' ? settings.cardBg : '#ffffff');
  const effectiveCardBorder = isDark
    ? (settings.cardBorder || '#d97706')
    : (settings.cardBorder && settings.cardBorder !== '#d97706' ? settings.cardBorder : '#e5e7eb');

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 pb-16 md:pb-0 ${
        isDark
          ? 'text-stone-100 selection:bg-amber-600 selection:text-stone-950'
          : 'text-stone-900 selection:bg-emerald-700 selection:text-amber-100'
      }`}
      style={{
        backgroundColor: effectivePageBg,
        ['--primary-color' as any]: settings.primaryColor,
        ['--accent-color' as any]: settings.accentColor,
        ['--theme-navbar-bg' as any]: settings.navbarBg || (isDark ? '#1c1917' : '#ffffff'),
        ['--theme-page-bg' as any]: effectivePageBg,
        ['--theme-card-bg' as any]: effectiveCardBg,
        ['--theme-card-border' as any]: effectiveCardBorder,
      }}
    >
      {/* Header & Navigation */}
      <Navbar
        lang={lang}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        settings={settings}
        notice={notice}
        onOpenLiveClass={() => setLiveClassModalOpen(true)}
        onOpenCertVerify={() => {
          setCertVerifyInitialQuery(undefined);
          setCertVerifyModalOpen(true);
        }}
        onOpenAdmin={() => {
          setViewMode('admin');
          window.location.hash = '#admin';
        }}
        onOpenEnrollment={() => handleOpenEnrollment()}
      />

      {/* Hero Section */}
      {settings.activeSections.hero && (
        <Hero
          lang={lang}
          settings={settings}
          theme={theme}
          onOpenEnrollment={handleOpenEnrollment}
        />
      )}

      {/* Courses & 1-on-1 Enrollment Section */}
      {settings.activeSections.courses && (
        <CoursesSection
          courses={courses}
          lang={lang}
          settings={settings}
          theme={theme}
          onOpenEnrollment={handleOpenEnrollment}
        />
      )}

      {/* Student Testimonials Carousel Section */}
      {settings.activeSections.testimonials !== false && (
        <TestimonialsSection
          testimonials={testimonials}
          lang={lang}
          theme={theme}
          settings={settings}
          onVerifySanad={(certNo) => {
            setCertVerifyInitialQuery(certNo);
            setCertVerifyModalOpen(true);
          }}
          onOpenEnrollment={handleOpenEnrollment}
        />
      )}

      {/* Student Admission & Sanad Portal Section */}
      <StudentPortalSection
        lang={lang}
        theme={theme}
        settings={settings}
        onOpenSanadModal={(enrollmentOrCertNo) => {
          setCertVerifyInitialQuery(enrollmentOrCertNo);
          setCertVerifyModalOpen(true);
        }}
        onOpenEnrollment={handleOpenEnrollment}
      />

      {/* Interactive Digital Store Portal */}
      {settings.activeSections.store && (
        <DigitalStoreSection
          storeItems={storeItems}
          lang={lang}
          settings={settings}
          theme={theme}
        />
      )}

      {/* Publications & Articles */}
      {settings.activeSections.publications && (
        <PublicationsSection 
          lang={lang} 
          theme={theme}
          publications={publications}
        />
      )}

      {/* Dynamic Ads & Media Gallery */}
      {settings.activeSections.mediaAds && (
        <MediaAdsSection 
          mediaAds={mediaAds} 
          lang={lang} 
          theme={theme}
        />
      )}

      {/* Scholar Apps Directory */}
      {settings.activeSections.scholarApps && (
        <ScholarAppsSection 
          lang={lang} 
          theme={theme}
        />
      )}

      {/* Payments & Tuition Section */}
      {settings.activeSections.payments && (
        <PaymentsSection
          payments={payments}
          lang={lang}
          settings={settings}
          theme={theme}
        />
      )}

      {/* Footer */}
      <Footer
        lang={lang}
        settings={settings}
        theme={theme}
        onOpenPolicy={handleOpenPolicy}
        onOpenAdmin={() => {
          setViewMode('admin');
          window.location.hash = '#admin';
        }}
      />

      {/* Floating Direct WhatsApp Button */}
      <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />

      {/* Initial Visit Language Switcher Popup */}
      <LanguageModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
        currentLang={lang}
        onSelectLanguage={handleLanguageChange}
      />

      {/* 1-on-1 Class Enrollment Registration Modal */}
      <EnrollmentModal
        isOpen={enrollmentOpen}
        onClose={() => setEnrollmentOpen(false)}
        selectedCourseTitle={selectedCourseForEnroll}
        courses={courses}
        settings={settings}
        lang={lang}
      />

      {/* Daily Live Zoom Room Modal */}
      <LiveClassModal
        isOpen={liveClassModalOpen}
        onClose={() => setLiveClassModalOpen(false)}
        liveClass={liveClass}
        lang={lang}
      />

      {/* Official Certificate Verification Modal */}
      <CertificateVerifyModal
        isOpen={certVerifyModalOpen}
        onClose={() => {
          setCertVerifyModalOpen(false);
          setCertVerifyInitialQuery(undefined);
        }}
        lang={lang}
        initialQuery={certVerifyInitialQuery}
        settings={settings}
      />

      {/* Legal & Academy Policies Modal */}
      <PoliciesModal
        isOpen={policiesModalOpen}
        onClose={() => setPoliciesModalOpen(false)}
        initialTab={policyTab}
        lang={lang}
        policies={settings.policies}
      />
    </div>
  );
}
