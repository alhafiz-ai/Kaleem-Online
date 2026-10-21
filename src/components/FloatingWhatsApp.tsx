import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const defaultMsg = encodeURIComponent(
    "Assalamu Alaikum Mufti Danish Kaleem Sahib,\n\nI would like to inquire about 1-on-1 Islamic & Arabic classes at Al-Danish Academy."
  );

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center group">
      <a
        href={`https://wa.me/${cleanNumber}?text=${defaultMsg}`}
        target="_blank"
        rel="noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-950 transition-all duration-300 transform group-hover:scale-110 active:scale-95"
        aria-label="Direct WhatsApp Support"
      >
        {/* Subtle pulsing ping ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
        
        {/* Phone icon */}
        <MessageCircle className="w-7 h-7 fill-white text-white relative z-10" />
      </a>

      {/* Tooltip on hover */}
      <div className="ml-3 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="bg-stone-900 text-stone-100 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl border border-emerald-500/40 whitespace-nowrap">
          Chat with Mufti Danish Kaleem
        </span>
      </div>
    </div>
  );
};
