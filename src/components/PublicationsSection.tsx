import React, { useState } from 'react';
import { PublicationItem, Language, ThemeMode } from '../types';
import { storage } from '../utils/storage';
import { UI_TEXT } from '../utils/translations';
import { BookMarked, Download, Eye, FileText, X, Check, Share2, Sparkles, FileDown } from 'lucide-react';

interface PublicationsSectionProps {
  lang: Language;
  theme?: ThemeMode;
  publications?: PublicationItem[];
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ 
  lang,
  theme = 'dark',
  publications
}) => {
  const [activePub, setActivePub] = useState<PublicationItem | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const t = UI_TEXT.publications;
  const isDark = theme === 'dark';

  const pubList = publications || storage.getPublications();
  const visiblePubs = pubList.filter(p => p.isVisible !== false);

  const handleDownload = (pub: PublicationItem) => {
    // If the publication has an uploaded file data URL (Base64), download that real file!
    if (pub.fileData) {
      const link = document.createElement("a");
      link.href = pub.fileData;
      link.download = pub.downloadFilename || `${pub.title.en}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadToast(`Downloaded: ${pub.downloadFilename || pub.title.en}`);
      setTimeout(() => setDownloadToast(null), 3000);
      return;
    }

    // Default simulated instant download of research paper treatise
    const element = document.createElement("a");
    const file = new Blob([
      `AL-DANISH ONLINE ISLAMIC & ARABIC ACADEMY\nResearch Treatise / رسالة علمية وبحث شرعي\nTitle: ${pub.title[lang] || pub.title.en}\nAuthor: ${pub.author[lang] || pub.author.en}\nCategory: ${pub.category[lang] || pub.category.en}\nPages: ${pub.pages}\n\nSummary / خلاصۂ تحقیق:\n${pub.summary[lang] || pub.summary.en}\n\nArabic Excerpt / النص الأصلي:\n${pub.fullExcerpt}\n\nDirector: Mufti Danish Kaleem\nOfficial Website: https://aldanish-academy.edu`
    ], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = pub.downloadFilename.replace('.pdf', '.txt');
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloadToast(`Downloaded: ${pub.downloadFilename}`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <section 
      id="publications" 
      className={`py-14 sm:py-20 relative border-b transition-colors duration-200 ${
        isDark 
          ? 'bg-stone-900 text-stone-100 border-stone-800' 
          : 'bg-[#f5f2eb] text-stone-900 border-amber-600/20'
      }`}
    >
      
      {/* Toast */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-white" />
          <span>{downloadToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
            isDark 
              ? 'bg-emerald-950 border-emerald-700/40 text-emerald-300' 
              : 'bg-emerald-100 border-emerald-300 text-emerald-950'
          }`}>
            <BookMarked className="w-3.5 h-3.5 text-amber-500" />
            <span>Open Access Scholarly Library</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-kufi ${
            isDark ? 'text-amber-300' : 'text-emerald-950'
          }`}>
            {t.sectionTitle[lang]}
          </h2>
          <p className={`mt-3 text-xs sm:text-base ${
            isDark ? 'text-stone-300' : 'text-stone-600'
          }`}>
            {t.sectionSubtitle[lang]}
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visiblePubs.map((pub) => (
            <div
              key={pub.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-xl ${
                isDark 
                  ? 'bg-stone-850/80 border-stone-700/80 hover:border-amber-400/80 text-stone-100' 
                  : 'bg-white border-amber-200/90 hover:border-amber-400 text-stone-900 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    isDark 
                      ? 'bg-stone-800 text-amber-400 border-stone-700' 
                      : 'bg-amber-100 text-amber-950 border-amber-200'
                  }`}>
                    {pub.category[lang] || pub.category.en}
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {pub.pages} {t.pagesLabel[lang]}
                    {pub.fileSize && <span className="text-[10px] text-amber-500 ml-1">({pub.fileSize})</span>}
                  </span>
                </div>

                <h3 className={`text-base sm:text-lg font-bold font-clear-title mb-1.5 leading-snug ${
                  isDark ? 'text-stone-100' : 'text-emerald-950'
                }`}>
                  {pub.title[lang] || pub.title.en}
                </h3>

                <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-amber-400/90' : 'text-emerald-700'}`}>
                  {pub.author[lang] || pub.author.en}
                </p>

                <p className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                  isDark ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  {pub.summary[lang] || pub.summary.en}
                </p>
              </div>

              <div className={`pt-4 border-t flex items-center gap-2 ${
                isDark ? 'border-stone-800' : 'border-stone-100'
              }`}>
                <button
                  onClick={() => setActivePub(pub)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isDark 
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-200' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.readOnline[lang]}</span>
                </button>
                <button
                  onClick={() => handleDownload(pub)}
                  className="p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold border border-emerald-600/40 transition-colors cursor-pointer flex items-center gap-1"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span className="text-[11px] font-bold">PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Reader Modal */}
      {activePub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
          <div className={`relative w-full max-w-2xl border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-stone-900 text-stone-200' : 'bg-white text-stone-900'
          }`}>
            {/* Pinned Modal Header */}
            <div className={`shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b flex items-center justify-between gap-3 z-20 ${
              isDark ? 'bg-stone-900/95 border-stone-800' : 'bg-stone-50/95 border-stone-200'
            }`}>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">
                  {activePub.category[lang] || activePub.category.en}
                </span>
                <h3 className={`text-base sm:text-lg font-bold font-clear-title truncate ${isDark ? 'text-amber-300' : 'text-emerald-950'}`}>
                  {activePub.title[lang] || activePub.title.en}
                </h3>
              </div>

              {/* Dedicated High-Visibility Close Button */}
              <button
                onClick={() => setActivePub(null)}
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

            <div className="space-y-4 text-sm leading-relaxed">
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-stone-950 border-stone-800' : 'bg-amber-50/70 border-amber-200'
              }`}>
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                  Executive Summary / خلاصۂ تحقیق
                </h4>
                <p className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                  {activePub.summary[lang] || activePub.summary.en}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
                  Arabic Excerpt / النص الأصلي المختار
                </h4>
                <div 
                  className={`p-4 rounded-2xl border font-amiri text-lg leading-loose text-right ${
                    isDark ? 'bg-stone-800/60 border-stone-700/80 text-amber-200' : 'bg-stone-50 border-stone-200 text-emerald-950'
                  }`}
                  dir="rtl"
                >
                  {activePub.fullExcerpt}
                </div>
              </div>
            </div>

            </div>

            <div className={`shrink-0 px-4 sm:px-6 py-3 border-t flex justify-between items-center ${
              isDark ? 'border-stone-800 bg-stone-950/80' : 'border-stone-200 bg-stone-50'
            }`}>
              <button
                onClick={() => setActivePub(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                  isDark ? 'bg-stone-800 text-stone-300 border-stone-700' : 'bg-stone-200 text-stone-700 border-stone-300'
                }`}
              >
                {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => handleDownload(activePub)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'تحقیقی مقالہ ڈاؤنلوڈ کریں' : lang === 'ar' ? 'تحميل البحث' : 'Download Paper'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
