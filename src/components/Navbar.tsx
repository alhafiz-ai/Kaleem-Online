import React, { useState } from 'react';
import { Language, SiteSettings, NoticeBanner, ThemeMode } from '../types';
import { UI_TEXT } from '../utils/translations';
import { openExternalSafe } from '../utils/printHelper';
import { 
  Globe, 
  Menu, 
  X, 
  ShieldCheck, 
  Video, 
  GraduationCap, 
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Lock,
  BookOpen,
  ShoppingBag,
  FileText,
  Radio,
  Compass,
  CreditCard,
  UserCheck,
  MessageCircle,
  Home,
  Bell,
  Award,
  MessageSquareQuote
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  settings: SiteSettings;
  notice: NoticeBanner;
  onOpenLiveClass: () => void;
  onOpenCertVerify: () => void;
  onOpenAdmin: () => void;
  onOpenEnrollment?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  theme,
  onToggleTheme,
  settings,
  notice,
  onOpenLiveClass,
  onOpenCertVerify,
  onOpenAdmin,
  onOpenEnrollment
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  const t = UI_TEXT.nav;
  const isRtl = lang === 'ur' || lang === 'ar';
  const isDark = theme === 'dark';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const allNavLinks = [
    ...(settings.activeSections.founder !== false ? [{ id: 'founder', label: t.founder[lang], icon: <UserCheck className="w-4 h-4 text-amber-500" /> }] : []),
    ...(settings.activeSections.courses !== false ? [{ id: 'courses', label: t.courses[lang], icon: <BookOpen className="w-4 h-4 text-emerald-500" /> }] : []),
    ...(settings.activeSections.testimonials !== false ? [{ id: 'testimonials', label: t.testimonials[lang], icon: <MessageSquareQuote className="w-4 h-4 text-amber-400" /> }] : []),
    { 
      id: 'student-portal', 
      label: lang === 'ur' ? 'داخلہ اسٹیٹس و سند' : lang === 'ar' ? 'بوابة القيد والشهادة' : 'Student Portal & Sanad', 
      icon: <GraduationCap className="w-4 h-4 text-amber-400" /> 
    },
    ...(settings.activeSections.store !== false ? [{ id: 'store', label: t.store[lang], icon: <ShoppingBag className="w-4 h-4 text-amber-500" /> }] : []),
    ...(settings.activeSections.publications !== false ? [{ id: 'publications', label: t.publications[lang], icon: <FileText className="w-4 h-4 text-teal-500" /> }] : []),
    ...(settings.activeSections.mediaAds !== false ? [{ id: 'media-ads', label: t.mediaAds[lang], icon: <Radio className="w-4 h-4 text-rose-500" /> }] : []),
    ...(settings.activeSections.scholarApps !== false ? [{ id: 'scholar-apps', label: t.scholarApps[lang], icon: <Compass className="w-4 h-4 text-cyan-500" /> }] : []),
    ...(settings.activeSections.payments !== false ? [{ id: 'payments', label: t.payments[lang], icon: <CreditCard className="w-4 h-4 text-green-500" /> }] : []),
  ];
  const navLinks = allNavLinks;

  const handleWhatsAppClick = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const greeting = lang === 'ur'
      ? `السلام علیکم ورحمۃ اللہ، میں کلیم آن لائن اکیڈمی سے متعلق معلومات حاصل کرنا چاہتا ہوں۔`
      : lang === 'ar'
      ? `السلام عليكم ورحمة الله، أود الاستفسار عن برامج أكاديمية كليم العالمية.`
      : `Assalamu Alaikum, I would like to inquire about Kaleem Online Academy courses.`;
    openExternalSafe(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(greeting)}`);
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-[100] w-full transition-colors duration-200 border-b shadow-md ${
          isDark 
            ? 'border-amber-600/30 text-stone-100 shadow-stone-950/60' 
            : 'border-amber-500/25 text-stone-900 shadow-stone-200/80'
        } backdrop-blur-md`}
        style={{
          backgroundColor: settings.navbarBg || (isDark ? '#1c1917f0' : '#fffffffa')
        }}
      >
        
        {/* Charming, Dazzling & Attractive Top Ilan (Announcement) Bar */}
        {notice.enabled && !noticeDismissed && (
          <div 
            className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-amber-950 text-amber-100 py-2 px-3 sm:px-6 border-b-2 border-amber-400/40 shadow-inner overflow-hidden"
          >
            {/* Shimmer animation bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent animate-pulse pointer-events-none" />

            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 relative z-10">
              
              <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden flex-1 text-xs">
                
                {/* Glowing Badge with Bell */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 shrink-0 shadow-md border border-amber-300">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block" />
                  <Bell className="w-3.5 h-3.5 text-stone-950 animate-bounce" />
                  <span className="font-kufi">
                    {notice.badge[lang] || notice.badge.en || 'اعلاناتِ اکیڈمی'}
                  </span>
                </div>

                {/* Announcement Text with graceful Islamic font */}
                <p className="truncate font-semibold text-amber-100 text-xs sm:text-[13px] tracking-wide font-sans">
                  {notice.text[lang] || notice.text.en}
                </p>

                {/* Call-to-action button */}
                {notice.linkText && (
                  <a 
                    href={notice.linkUrl || "#courses"} 
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow transition-all transform hover:scale-105 shrink-0"
                  >
                    <span>{notice.linkText[lang] || notice.linkText.en}</span>
                    <span className="text-stone-950">&rarr;</span>
                  </a>
                )}
              </div>

              {/* Dismiss Button */}
              <button 
                onClick={() => setNoticeDismissed(true)} 
                className="text-amber-300/80 hover:text-white p-1 rounded-lg hover:bg-stone-800/60 transition-colors shrink-0 cursor-pointer"
                title="Dismiss notice / اعلان بند کریں"
                aria-label="Dismiss notice"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Navigation Bar Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-18 gap-2">
            
            {/* Left Side: Logo & Academy Title */}
            <div 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer min-w-0" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div 
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-lg border-2 border-amber-400/80 relative overflow-hidden shrink-0 bg-gradient-to-br from-emerald-900 to-emerald-950 group"
                style={{ backgroundColor: settings.primaryColor }}
                title={settings.siteTitle[lang] || 'Kaleem Online Academy'}
              >
                <div className="absolute inset-0 bg-amber-400/10 group-hover:bg-amber-400/20 transition-all" />
                <BookOpen className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-amber-300 drop-shadow" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className={`font-bold text-xs xs:text-sm sm:text-base lg:text-lg tracking-normal leading-tight font-academy-brand truncate ${
                  isDark ? 'text-amber-300' : 'text-emerald-950'
                }`}>
                  {settings.siteTitle[lang] || settings.siteTitle.en}
                </span>
                <span className={`text-[10px] sm:text-xs tracking-wide font-normal flex items-center gap-1 truncate ${
                  isDark ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  <ShieldCheck className="w-3 h-3 text-amber-500 inline shrink-0" />
                  <span className="truncate">{settings.founderName[lang] || settings.founderName.en}</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links - Visible on standard laptop/computer screens (lg:flex) */}
            <nav className="hidden lg:flex items-center gap-1 shrink-0">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => scrollToSection(link.id)} 
                  className={`px-2.5 py-1.5 rounded-lg text-xs lg:text-[13px] font-semibold transition-all ${
                    isDark 
                      ? 'text-stone-200 hover:text-amber-300 hover:bg-stone-800/80' 
                      : 'text-stone-700 hover:text-emerald-900 hover:bg-amber-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Dark / Light Mode Toggle Button (Prominent on BOTH Mobile and Desktop!) */}
              <button
                onClick={onToggleTheme}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all flex items-center justify-center shadow-sm active:scale-95 ${
                  isDark 
                    ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700' 
                    : 'bg-amber-100/80 hover:bg-amber-200 text-emerald-950 border-amber-300'
                }`}
                title={isDark ? "Switch to Light Mode / لائٹ موڈ" : "Switch to Dark Mode / ڈارک موڈ"}
                aria-label="Toggle Dark/Light Mode"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-900" />
                )}
              </button>

              {/* Language Selector Dropdown (Desktop & Tablet) */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-colors shadow-sm ${
                    isDark 
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-bold">
                    {lang === 'ur' ? 'اردو' : lang === 'ar' ? 'العربية' : 'EN'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {langMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-2xl border py-2 z-50 animate-in fade-in zoom-in-95 ${
                    isDark ? 'bg-stone-900 border-amber-600/40 text-stone-200' : 'bg-white border-amber-600/30 text-stone-800'
                  }`}>
                    <div className="px-3 py-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider border-b border-stone-700/40">
                      Select Language
                    </div>
                    <button
                      onClick={() => { onLanguageChange('ur'); setLangMenuOpen(false); }}
                      className={`w-full text-right px-4 py-2.5 text-sm flex items-center justify-between hover:bg-emerald-950/20 transition-colors ${lang === 'ur' ? 'text-amber-500 font-bold bg-amber-500/10' : ''}`}
                    >
                      <span className="font-bold">اردو (Urdu)</span>
                      <span className="text-xs text-stone-400">🇵🇰</span>
                    </button>
                    <button
                      onClick={() => { onLanguageChange('ar'); setLangMenuOpen(false); }}
                      className={`w-full text-right px-4 py-2.5 text-sm flex items-center justify-between hover:bg-emerald-950/20 transition-colors ${lang === 'ar' ? 'text-amber-500 font-bold bg-amber-500/10' : ''}`}
                    >
                      <span className="font-bold font-cairo">العربية (Arabic)</span>
                      <span className="text-xs text-stone-400">🇸🇦</span>
                    </button>
                    <button
                      onClick={() => { onLanguageChange('en'); setLangMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-emerald-950/20 transition-colors ${lang === 'en' ? 'text-amber-500 font-bold bg-amber-500/10' : ''}`}
                    >
                      <span>English</span>
                      <span className="text-xs text-stone-400">🇬🇧</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Mobile Language Switcher Button (Direct 1-tap cycle for mobile) */}
              <button
                onClick={() => {
                  const nextLang: Language = lang === 'ur' ? 'ar' : lang === 'ar' ? 'en' : 'ur';
                  onLanguageChange(nextLang);
                }}
                className={`sm:hidden px-2 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm ${
                  isDark 
                    ? 'bg-stone-800 text-amber-300 border-stone-700' 
                    : 'bg-stone-100 text-stone-800 border-stone-300'
                }`}
                title="Change Language"
              >
                <Globe className="w-3 h-3 text-amber-500" />
                <span>{lang === 'ur' ? 'اردو' : lang === 'ar' ? 'العربية' : 'EN'}</span>
              </button>

              {/* Verify Sanad Button (Desktop & Tablet) */}
              <button
                onClick={onOpenCertVerify}
                className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-amber-500/40'
                    : 'bg-amber-50 hover:bg-amber-100 text-emerald-950 border-amber-300'
                }`}
                title="Verify Student Sanad / Certificate"
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.verifySanad[lang]}</span>
              </button>

              {/* Live Class Button (Desktop & Tablet) */}
              <button
                onClick={onOpenLiveClass}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-emerald-700/90 hover:bg-emerald-600 text-emerald-100 border border-emerald-500/50 transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.liveClassBadge[lang]}</span>
              </button>

              {/* Admin Switcher Button (Desktop & Tablet) */}
              <button
                onClick={onOpenAdmin}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 border border-amber-300 shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                title="Open Admin Control Panel"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.adminPortal[lang]}</span>
              </button>

              {/* Mobile Hamburger Button - HIGH VISIBILITY WITH TEXT LABEL */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden px-2.5 py-1.5 sm:py-2 rounded-xl border transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
                  isDark 
                    ? 'bg-emerald-900/90 hover:bg-emerald-800 text-amber-300 border-amber-500/40' 
                    : 'bg-emerald-800 hover:bg-emerald-700 text-amber-200 border-emerald-900'
                }`}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <>
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                    <span className="text-xs font-bold font-kufi">بند کریں</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                    <span className="text-xs font-bold font-kufi">
                      {lang === 'ur' ? 'مینیو' : lang === 'ar' ? 'القائمة' : 'Menu'}
                    </span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Navigation (Guaranteed Full Width, High Contrast, Touch Friendly) */}
        {mobileMenuOpen && (
          <div 
            className={`lg:hidden border-t px-4 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-2 shadow-2xl max-h-[85vh] overflow-y-auto ${
              isDark 
                ? 'bg-stone-900 border-stone-800 text-stone-100' 
                : 'bg-white border-amber-200 text-stone-900'
            }`}
          >
            
            {/* Quick Actions Bar inside Mobile Drawer */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenLiveClass(); }}
                className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <Video className="w-4 h-4 text-emerald-200" />
                <span>{t.liveClassBadge[lang]}</span>
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{t.adminPortal[lang]}</span>
              </button>
            </div>

            {/* Theme & Language Controls inside Drawer */}
            <div className={`p-3.5 rounded-2xl border space-y-3.5 ${
              isDark ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              {/* Theme Switcher Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  {lang === 'ur' ? 'ڈسپلے موڈ (تھیم):' : lang === 'ar' ? 'المظهر (الوضع):' : 'Display Theme:'}
                </span>
                <button
                  onClick={onToggleTheme}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                    isDark
                      ? 'bg-stone-800 text-amber-300 border-stone-700'
                      : 'bg-amber-100 text-emerald-950 border-amber-300'
                  }`}
                >
                  {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-emerald-900" />}
                  <span>{isDark ? 'Light Theme ☀️' : 'Dark Theme 🌙'}</span>
                </button>
              </div>

              {/* Language Switcher Buttons */}
              <div>
                <span className="text-[11px] font-bold text-amber-500 block mb-1.5 uppercase">
                  {t.switchLang[lang]}:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => { onLanguageChange('ur'); setMobileMenuOpen(false); }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                      lang === 'ur'
                        ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                        : isDark ? 'bg-stone-800 text-stone-300' : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    اردو (Urdu)
                  </button>
                  <button
                    onClick={() => { onLanguageChange('ar'); setMobileMenuOpen(false); }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold font-cairo transition-all text-center ${
                      lang === 'ar'
                        ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                        : isDark ? 'bg-stone-800 text-stone-300' : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => { onLanguageChange('en'); setMobileMenuOpen(false); }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                      lang === 'en'
                        ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                        : isDark ? 'bg-stone-800 text-stone-300' : 'bg-white text-stone-700 border border-stone-200'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Links - Direction Aware */}
            <div className="space-y-1 pt-1">
              {navLinks.map(link => (
                <button 
                  key={link.id}
                  onClick={() => scrollToSection(link.id)} 
                  className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3.5 py-3 rounded-xl hover:bg-amber-500/10 text-sm font-semibold transition-colors flex items-center justify-between border ${
                    isDark 
                      ? 'border-stone-800/80 text-stone-200 hover:text-amber-300' 
                      : 'border-stone-100 text-stone-800 hover:text-emerald-950 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  {isRtl ? <ArrowLeft className="w-4 h-4 text-stone-400" /> : <ArrowRight className="w-4 h-4 text-stone-400" />}
                </button>
              ))}
            </div>

            {/* Certificate Verification Action in Drawer */}
            <div className="pt-2 border-t border-stone-700/30">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenCertVerify(); }}
                className={`w-full py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border shadow-sm ${
                  isDark ? 'bg-stone-800 text-amber-300 border-stone-700' : 'bg-stone-100 text-stone-800 border-stone-200'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>
                  {lang === 'ur' ? 'آن لائن تعلیمی سند کی تصدیق' : lang === 'ar' ? 'التحقق من الشهادات الرسمية' : 'Verify Official Student Certificate'}
                </span>
              </button>
            </div>

          </div>
        )}
      </header>

      {/* Mobile Sticky Bottom App Bar (Instant 1-tap navigation for mobile users) */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.15)] px-2 py-1.5 transition-colors duration-200 ${
          isDark 
            ? 'bg-stone-950/95 border-amber-600/30 text-stone-300' 
            : 'bg-white/95 border-amber-500/30 text-stone-700'
        }`}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Home */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isDark ? 'hover:text-amber-300 active:bg-stone-900' : 'hover:text-emerald-900 active:bg-stone-100'
            }`}
          >
            <Home className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-bold mt-0.5">
              {lang === 'ur' ? 'اول' : lang === 'ar' ? 'الرئيسية' : 'Home'}
            </span>
          </button>

          {/* Courses */}
          <button
            onClick={() => scrollToSection('courses')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isDark ? 'hover:text-amber-300 active:bg-stone-900' : 'hover:text-emerald-900 active:bg-stone-100'
            }`}
          >
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <span className="text-[10px] font-bold mt-0.5">
              {lang === 'ur' ? 'کورسز' : lang === 'ar' ? 'الدورات' : 'Courses'}
            </span>
          </button>

          {/* Digital Store */}
          <button
            onClick={() => scrollToSection('store')}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isDark ? 'hover:text-amber-300 active:bg-stone-900' : 'hover:text-emerald-900 active:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <span className="text-[10px] font-bold mt-0.5">
              {lang === 'ur' ? 'اسٹور' : lang === 'ar' ? 'المتجر' : 'Store'}
            </span>
          </button>

          {/* 1-on-1 Enroll Button */}
          <button
            onClick={() => {
              if (onOpenEnrollment) {
                onOpenEnrollment();
              } else {
                scrollToSection('courses');
              }
            }}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-md active:scale-95"
          >
            <UserCheck className="w-5 h-5 text-amber-300" />
            <span className="text-[10px] font-bold mt-0.5 text-amber-200">
              {lang === 'ur' ? 'داخلہ' : lang === 'ar' ? 'التسجيل' : 'Enroll'}
            </span>
          </button>

          {/* WhatsApp Direct */}
          <button
            onClick={handleWhatsAppClick}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isDark ? 'hover:text-green-400 active:bg-stone-900' : 'hover:text-green-700 active:bg-stone-100'
            }`}
          >
            <MessageCircle className="w-5 h-5 text-green-500" />
            <span className="text-[10px] font-bold mt-0.5">
              {lang === 'ur' ? 'رابطہ' : lang === 'ar' ? 'واتساب' : 'WhatsApp'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
