import React, { useState } from 'react';
import { MediaAdItem, Language, ThemeMode } from '../types';
import { UI_TEXT } from '../utils/translations';
import { Image, Video, Bell, Sparkles, ExternalLink, Play, X } from 'lucide-react';

interface MediaAdsSectionProps {
  mediaAds: MediaAdItem[];
  lang: Language;
  theme?: ThemeMode;
}

export const MediaAdsSection: React.FC<MediaAdsSectionProps> = ({ 
  mediaAds, 
  lang,
  theme = 'dark'
}) => {
  const [activeMedia, setActiveMedia] = useState<MediaAdItem | null>(null);
  const t = UI_TEXT.nav.mediaAds;
  const isDark = theme === 'dark';

  const visibleAds = mediaAds.filter(a => a.isVisible);
  if (visibleAds.length === 0) return null;

  return (
    <section 
      id="media-ads" 
      className={`py-14 sm:py-20 relative border-b transition-colors duration-200 ${
        isDark 
          ? 'bg-stone-950 text-stone-100 border-stone-800' 
          : 'bg-[#faf7f0] text-stone-900 border-amber-600/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
            isDark 
              ? 'bg-amber-500/15 border-amber-400/30 text-amber-300' 
              : 'bg-amber-100 border-amber-300 text-amber-950'
          }`}>
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Official Academy Broadcasts</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-kufi ${
            isDark ? 'text-amber-300' : 'text-emerald-950'
          }`}>
            {t[lang]}
          </h2>
          <p className={`mt-3 text-xs sm:text-base ${
            isDark ? 'text-stone-300' : 'text-stone-600'
          }`}>
            Latest announcements, admission flyers, and video highlights from Mufti Danish Kaleem
          </p>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleAds.map((ad) => (
            <div
              key={ad.id}
              className={`group rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between border ${
                isDark 
                  ? 'bg-stone-900 border-stone-800 hover:border-amber-500/60' 
                  : 'bg-white border-amber-200/90 hover:border-amber-400'
              }`}
            >
              {/* Media Graphic Frame */}
              <div className="relative aspect-video w-full overflow-hidden bg-stone-950">
                <img
                  src={ad.mediaUrl}
                  alt={ad.title[lang] || ad.title.en}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 shadow-md">
                    {ad.badge[lang] || ad.badge.en}
                  </span>
                </div>

                {/* Play Button for Video */}
                {ad.type === 'video' && (
                  <button
                    onClick={() => setActiveMedia(ad)}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                    aria-label="Play media"
                  >
                    <Play className="w-6 h-6 fill-stone-950 ml-1" />
                  </button>
                )}
              </div>

              {/* Text Body */}
              <div className="p-6">
                <h3 className={`text-lg sm:text-xl font-bold font-clear-title mb-2 ${
                  isDark ? 'text-stone-100' : 'text-emerald-950'
                }`}>
                  {ad.title[lang] || ad.title.en}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-4 ${
                  isDark ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  {ad.description[lang] || ad.description.en}
                </p>

                {ad.ctaLink && (
                  <a
                    href={ad.ctaLink}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-400 hover:underline"
                  >
                    <span>Learn More / رجسٹر کریں</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center pt-24 sm:pt-28 md:pt-32 pb-6 px-3 sm:px-5 bg-stone-950/90 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-stone-900 border-2 border-amber-500/60 rounded-3xl overflow-hidden shadow-2xl my-auto sm:my-0 max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-8.5rem)] flex flex-col">
            {/* Prominent High-Visibility Cancel / Close Button */}
            <button
              onClick={() => setActiveMedia(null)}
              type="button"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950/90 hover:bg-rose-950/90 border border-stone-700 hover:border-rose-500/50 text-stone-200 hover:text-rose-200 shadow-xl cursor-pointer active:scale-95 transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span className="text-xs font-semibold">
                {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
              </span>
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={activeMedia.mediaUrl.replace('watch?v=', 'embed/')}
                title={activeMedia.title[lang] || activeMedia.title.en}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between gap-3">
              <h4 className="font-bold text-amber-300 font-clear-title text-base truncate">
                {activeMedia.title[lang] || activeMedia.title.en}
              </h4>
              <button
                onClick={() => setActiveMedia(null)}
                type="button"
                className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold shrink-0 cursor-pointer border border-stone-700 transition-colors"
              >
                {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
