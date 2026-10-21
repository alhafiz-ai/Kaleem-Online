import React from 'react';
import { Language, ThemeMode } from '../types';
import { SCHOLAR_APPS } from '../data/initialData';
import { UI_TEXT } from '../utils/translations';
import { Compass, ExternalLink, BookmarkCheck, Search, Database } from 'lucide-react';

interface ScholarAppsSectionProps {
  lang: Language;
  theme?: ThemeMode;
}

export const ScholarAppsSection: React.FC<ScholarAppsSectionProps> = ({ 
  lang,
  theme = 'dark'
}) => {
  const t = UI_TEXT.scholarApps;
  const isDark = theme === 'dark';

  return (
    <section 
      id="scholar-apps" 
      className={`py-14 sm:py-20 relative border-b transition-colors duration-200 ${
        isDark 
          ? 'bg-stone-900/80 text-stone-100 border-stone-800' 
          : 'bg-[#fbf9f4] text-stone-900 border-amber-600/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
            isDark 
              ? 'bg-emerald-950 border-emerald-700/40 text-emerald-300' 
              : 'bg-emerald-100 border-emerald-300 text-emerald-950'
          }`}>
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Digital Islamic Research Directory</span>
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

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SCHOLAR_APPS.map((app) => (
            <div
              key={app.id}
              className={`rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                isDark 
                  ? 'bg-stone-850/90 border-stone-700/80 hover:border-amber-400/80 text-stone-100' 
                  : 'bg-white border-amber-200/90 hover:border-amber-400 text-stone-900 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-amiri text-2xl font-bold ${isDark ? 'text-amber-300' : 'text-emerald-900'}`}>
                    {app.arabicName}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    isDark 
                      ? 'bg-stone-800 text-emerald-300 border-stone-700' 
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}>
                    {app.badge}
                  </span>
                </div>

                <h3 className={`text-base font-bold font-clear-title mb-2 ${
                  isDark ? 'text-stone-100' : 'text-emerald-950'
                }`}>
                  {app.name[lang] || app.name.en}
                </h3>

                <p className={`text-xs leading-relaxed mb-4 ${
                  isDark ? 'text-stone-300' : 'text-stone-600'
                }`}>
                  {app.description[lang] || app.description.en}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {app.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className={`text-[10px] px-2 py-0.5 rounded border ${
                        isDark 
                          ? 'bg-stone-900 text-stone-400 border-stone-800' 
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={app.url}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
                  isDark
                    ? 'bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border-stone-700 hover:border-amber-400'
                    : 'bg-emerald-900 hover:bg-emerald-800 text-amber-300 border-emerald-950'
                }`}
              >
                <span>{t.openToolBtn[lang]}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
