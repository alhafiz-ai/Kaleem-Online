import React, { useState } from 'react';
import { LiveClassLink, Language } from '../types';
import { UI_TEXT } from '../utils/translations';
import { X, Video, Lock, Copy, Check, ExternalLink, Calendar, Clock, ShieldCheck } from 'lucide-react';

interface LiveClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveClass: LiveClassLink;
  lang: Language;
}

export const LiveClassModal: React.FC<LiveClassModalProps> = ({
  isOpen,
  onClose,
  liveClass,
  lang
}) => {
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;
  const t = UI_TEXT.liveClassBanner;

  const copyText = (txt: string, isPass: boolean) => {
    navigator.clipboard.writeText(txt);
    if (isPass) {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-200">
        
        {/* Pinned Modal Header with Prominent Cancel Button */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-stone-800 bg-stone-900/95 backdrop-blur flex items-center justify-between gap-3 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold font-kufi text-amber-300 truncate">
                {t.title[lang]}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">
                {liveClass.scheduleText[lang] || liveClass.scheduleText.en}
              </p>
            </div>
          </div>

          {/* Dedicated High-Visibility Close Button */}
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-stone-800 hover:bg-rose-950/80 hover:border-rose-500/50 text-stone-300 hover:text-rose-200 border border-stone-700 transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span className="text-xs font-semibold">
              {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
            </span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

        {/* Schedule & Restriction Notice */}
        <div className="bg-emerald-950/50 border border-emerald-800/40 p-4 rounded-2xl mb-6 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <Clock className="w-4 h-4" />
            <span>Class Schedule:</span>
          </div>
          <p className="text-stone-200 font-medium">
            {liveClass.scheduleText[lang] || liveClass.scheduleText.en}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {liveClass.accessRestriction === 'enrolled_only' 
                ? "Restricted to registered students. Link refreshes daily."
                : "Open broadcast session for all students."}
            </span>
          </div>
        </div>

        {/* Meeting ID & Passcode Boxes */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">{t.idLabel[lang]}</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-amber-400">{liveClass.meetingId}</span>
              <button
                onClick={() => copyText(liveClass.meetingId, false)}
                className="text-stone-400 hover:text-amber-300 p-1"
                title="Copy Meeting ID"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">{t.passcodeLabel[lang]}</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-amber-400">{liveClass.passcode}</span>
              <button
                onClick={() => copyText(liveClass.passcode, true)}
                className="text-stone-400 hover:text-amber-300 p-1"
                title="Copy Passcode"
              >
                {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Big Join Button */}
        <div className="space-y-3">
          <a
            href={liveClass.meetingUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-xl shadow-emerald-950 flex items-center justify-center gap-2 text-base transition-all"
          >
            <Video className="w-5 h-5 fill-white text-white" />
            <span>Launch Live Zoom Room ↗</span>
          </a>

          <div className="flex justify-center pt-1">
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer border border-stone-700 transition-colors"
            >
              {lang === 'ur' ? 'بند کریں' : lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
        </div>

      </div>
    </div>
  );
};
