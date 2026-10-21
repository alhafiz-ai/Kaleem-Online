import React, { useState } from 'react';
import { StoreItem, Language, SiteSettings, ThemeMode } from '../types';
import { UI_TEXT } from '../utils/translations';
import { StoreCheckoutModal } from './StoreCheckoutModal';
import { 
  ShoppingBag, 
  CheckSquare, 
  Square, 
  FileText, 
  Video, 
  Headphones, 
  Users, 
  Sparkles, 
  Receipt, 
  RotateCcw,
  Check,
  Eye,
  X
} from 'lucide-react';

interface DigitalStoreSectionProps {
  storeItems: StoreItem[];
  lang: Language;
  settings: SiteSettings;
  theme?: ThemeMode;
}

export const DigitalStoreSection: React.FC<DigitalStoreSectionProps> = ({
  storeItems,
  lang,
  settings,
  theme = 'dark'
}) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(['full-academy-package']);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [detailsModalItem, setDetailsModalItem] = useState<StoreItem | null>(null);

  const t = UI_TEXT.store;
  const isDark = theme === 'dark';
  const visibleItems = storeItems.filter(i => i.isVisible);

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItemIds(visibleItems.map(i => i.id));
  };

  const clearAll = () => {
    setSelectedItemIds([]);
  };

  const selectedObjects = visibleItems.filter(i => selectedItemIds.includes(i.id));
  const totalPKR = selectedObjects.reduce((acc, curr) => acc + curr.pricePKR, 0);
  const totalUSD = selectedObjects.reduce((acc, curr) => acc + curr.priceUSD, 0);

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'video': return <Video className="w-5 h-5 text-emerald-500" />;
      case 'pdf': return <FileText className="w-5 h-5 text-amber-500" />;
      case 'audio': return <Headphones className="w-5 h-5 text-teal-500" />;
      case 'session': return <Users className="w-5 h-5 text-rose-500" />;
      default: return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section 
      id="store" 
      className={`py-14 sm:py-20 relative border-b transition-colors duration-200 ${
        isDark 
          ? 'bg-stone-950 text-stone-100 border-stone-800' 
          : 'bg-[#faf7f2] text-stone-900 border-amber-600/20'
      }`}
    >
      
      {/* Background Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
            isDark 
              ? 'bg-amber-500/15 border-amber-400/30 text-amber-300' 
              : 'bg-amber-100 border-amber-300 text-amber-950'
          }`}>
            <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
            <span>Itemized Digital Learning Resources</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-kufi leading-snug ${
            isDark ? 'text-amber-300' : 'text-emerald-950'
          }`}>
            {t.sectionTitle[lang]}
          </h2>
          <p className={`mt-2 sm:mt-3 text-xs sm:text-base leading-[1.8] ${
            isDark ? 'text-stone-300' : 'text-stone-600'
          }`}>
            {t.sectionSubtitle[lang]}
          </p>
        </div>

        {/* Dynamic Calculation & Checkout Summary Card (Crisp & High Contrast in both modes) */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-2 border-amber-400/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 mb-6 sm:mb-8 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 text-white">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] sm:text-xs">
                {t.itemCount[lang]}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] sm:text-xs">
                {selectedItemIds.length} of {visibleItems.length} selected
              </span>
            </div>
            <div className="flex items-baseline gap-2 justify-center md:justify-start">
              <span className="text-xs sm:text-sm text-stone-200">{t.selectedTotal[lang]}</span>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-300 font-mono">
                PKR {totalPKR.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs text-amber-100/80">
                (~${totalUSD} USD)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto">
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              <button
                onClick={selectAll}
                className="px-3 py-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-amber-400/30 transition-colors touch-target flex items-center justify-center cursor-pointer"
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 text-xs font-medium border border-amber-400/30 transition-colors flex items-center justify-center gap-1 touch-target cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t.clearSelection[lang]}</span>
              </button>
            </div>
            <button
              disabled={selectedItemIds.length === 0}
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 shadow-xl shadow-amber-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 touch-target cursor-pointer shrink-0"
            >
              <Receipt className="w-4 h-4 text-stone-950 shrink-0" />
              <span>{t.buyNowBtn[lang]}</span>
            </button>
          </div>
        </div>

        {/* Itemized Checkbox Cards Grid - Responsive Adaptive Grid (1 col on mobile, 2 cols on tablet, 3 cols on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {visibleItems.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`relative cursor-pointer rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border-2 transition-all duration-300 flex flex-col h-full justify-between hover:-translate-y-1 w-full ${
                  isSelected
                    ? isDark
                      ? 'bg-gradient-to-b from-emerald-950/70 via-stone-900 to-stone-900 border-amber-400 shadow-xl shadow-amber-500/10'
                      : 'bg-emerald-50/70 border-emerald-700 shadow-lg text-stone-900 ring-2 ring-emerald-600/30'
                    : isDark
                      ? 'bg-stone-900/80 border-stone-800 hover:border-amber-400/60'
                      : 'bg-white border-amber-200/90 hover:border-amber-400 shadow-sm text-stone-900'
                }`}
              >
                <div className="flex-1 flex flex-col">
                  {/* Top Bar: Icon, Category Badge & Checkbox */}
                  <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border shrink-0 ${
                      isDark ? 'bg-stone-800 border-stone-700' : 'bg-amber-50 border-amber-200'
                    }`}>
                      {getItemIcon(item.category)}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className={`text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full border truncate ${
                        isDark 
                          ? 'bg-stone-800 text-amber-300 border-stone-700' 
                          : 'bg-amber-100 text-amber-950 border-amber-200'
                      }`}>
                        {item.formatBadge}
                      </span>
                      <div className="p-0.5 text-amber-500 shrink-0">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                        ) : (
                          <Square className={`w-5 h-5 ${isDark ? 'text-stone-500' : 'text-stone-400'}`} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title in Ultra-Clear Arabic/Urdu Readable Font */}
                  <h3 className={`text-sm sm:text-base lg:text-lg font-bold font-clear-title mb-1.5 leading-snug line-clamp-2 min-h-[2.35rem] sm:min-h-[2.75rem] transition-colors ${
                    isSelected 
                      ? isDark ? 'text-amber-300' : 'text-emerald-900'
                      : isDark ? 'text-stone-100' : 'text-stone-900'
                  }`}>
                    {item.title[lang] || item.title.en}
                  </h3>

                  {/* Concise 2-line Description */}
                  <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
                    isDark ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {item.description[lang] || item.description.en}
                  </p>

                  {/* Basic Details Pill with Quick View Details Button (pinned cleanly before footer) */}
                  <div className={`mt-auto flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-xl border mb-3 ${
                    isDark 
                      ? 'bg-stone-950/60 border-stone-800' 
                      : 'bg-stone-50 border-stone-200'
                  }`}>
                    <span className={`text-[10px] sm:text-[11px] font-medium truncate ${
                      isDark ? 'text-emerald-400' : 'text-emerald-800'
                    }`}>
                      {item.includes.length} {lang === 'ur' ? 'اہم اسباق و کتب' : lang === 'ar' ? 'مواد تعليمي' : 'Curated items'}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailsModalItem(item);
                      }}
                      className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors cursor-pointer shrink-0 ${
                        isDark 
                          ? 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700' 
                          : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-xs'
                      }`}
                      title="View Details"
                    >
                      <Eye className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{lang === 'ur' ? 'تفصیلات دیکھیں' : lang === 'ar' ? 'عرض المحتوى' : 'Details'}</span>
                    </button>
                  </div>
                </div>

                {/* Price Display & Selection state (Strictly aligned across all sibling cards) */}
                <div className={`mt-auto pt-3 border-t flex items-center justify-between gap-2 ${
                  isDark ? 'border-stone-800' : 'border-stone-200'
                }`}>
                  <div className="flex items-baseline gap-1 min-w-0">
                    <span className={`text-base sm:text-lg font-extrabold font-mono truncate ${
                      isDark ? 'text-amber-400' : 'text-emerald-900'
                    }`}>
                      PKR {item.pricePKR.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0">
                      (~${item.priceUSD})
                    </span>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold shadow'
                      : isDark ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {isSelected ? '✓ Selected' : '+ Select'}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Quick Item Details Modal */}
      {detailsModalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setDetailsModalItem(null)}
        >
          <div 
            className={`relative w-full max-w-lg rounded-3xl border-2 p-5 sm:p-7 shadow-2xl overflow-hidden transition-all ${
              isDark 
                ? 'bg-stone-900 border-amber-500/50 text-stone-100' 
                : 'bg-white border-amber-300 text-stone-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                  isDark ? 'bg-stone-800 border-stone-700' : 'bg-amber-50 border-amber-200'
                }`}>
                  {getItemIcon(detailsModalItem.category)}
                </div>
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-stone-950">
                    {detailsModalItem.formatBadge}
                  </span>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {lang === 'ur' ? 'ڈیجیٹل تعلیمی پیکج' : lang === 'ar' ? 'حزمة تعليمية رقمية' : 'Digital Learning Pack'}
                  </p>
                </div>
              </div>

              {/* Prominent High-Visibility Cancel / Close Button */}
              <button
                onClick={() => setDetailsModalItem(null)}
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition-all shadow-sm cursor-pointer active:scale-95 shrink-0 ${
                  isDark 
                    ? 'bg-stone-800 hover:bg-rose-950/70 border-stone-700 hover:border-rose-500/50 text-stone-200 hover:text-rose-200' 
                    : 'bg-stone-100 hover:bg-rose-50 border-stone-300 hover:border-rose-300 text-stone-700 hover:text-rose-700'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                <span className="text-xs font-semibold">
                  {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
                </span>
              </button>
            </div>

            <div className="py-4 space-y-4">
              <h3 className={`text-lg sm:text-xl font-bold font-clear-title leading-snug ${
                isDark ? 'text-amber-300' : 'text-emerald-950'
              }`}>
                {detailsModalItem.title[lang] || detailsModalItem.title.en}
              </h3>

              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-stone-300' : 'text-stone-600'
              }`}>
                {detailsModalItem.description[lang] || detailsModalItem.description.en}
              </p>

              <div>
                <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                  {lang === 'ur' ? 'پیکج میں شامل فائلز و مواد:' : lang === 'ar' ? 'المحتويات المشمولة في الحزمة:' : 'Included Resources:'}
                </p>
                <div className="space-y-1.5">
                  {detailsModalItem.includes.map((inc, i) => (
                    <div key={i} className={`p-2 rounded-xl border flex items-center gap-2 text-xs ${
                      isDark ? 'bg-stone-950 border-stone-800 text-stone-200' : 'bg-emerald-50/50 border-emerald-100 text-stone-800'
                    }`}>
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] block text-stone-400">
                  {lang === 'ur' ? 'قیمت:' : lang === 'ar' ? 'السعر:' : 'Price:'}
                </span>
                <span className={`text-xl font-bold font-mono ${isDark ? 'text-amber-400' : 'text-emerald-900'}`}>
                  PKR {detailsModalItem.pricePKR.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailsModalItem(null)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border ${
                    isDark ? 'bg-stone-800 text-stone-300 border-stone-700' : 'bg-stone-100 text-stone-700 border-stone-300'
                  }`}
                >
                  {lang === 'ur' ? 'بند کریں' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    toggleItem(detailsModalItem.id);
                    setDetailsModalItem(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedItemIds.includes(detailsModalItem.id)
                      ? 'bg-rose-700 hover:bg-rose-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md'
                  }`}
                >
                  {selectedItemIds.includes(detailsModalItem.id) 
                    ? (lang === 'ur' ? 'انتخاب ختم کریں' : 'Remove') 
                    : (lang === 'ur' ? '+ خرید کے لیے منتخب کریں' : '+ Select for Checkout')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <StoreCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        selectedItems={selectedObjects}
        lang={lang}
        settings={settings}
        onOrderSuccess={() => setSelectedItemIds([])}
      />
    </section>
  );
};
