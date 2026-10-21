import React, { useState } from 'react';
import { PaymentGateways, Language, SiteSettings, ThemeMode } from '../types';
import { UI_TEXT } from '../utils/translations';
import { 
  CreditCard, 
  Copy, 
  Check, 
  Phone, 
  Globe, 
  Building2, 
  Smartphone, 
  Send, 
  ShieldCheck,
  QrCode,
  X,
  ExternalLink
} from 'lucide-react';

interface PaymentsSectionProps {
  payments: PaymentGateways;
  lang: Language;
  settings: SiteSettings;
  theme?: ThemeMode;
}

export const PaymentsSection: React.FC<PaymentsSectionProps> = ({ 
  payments, 
  lang, 
  settings,
  theme = 'dark'
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [qrModalAccount, setQrModalAccount] = useState<{ title: string, number: string, service: string } | null>(null);
  const t = UI_TEXT.payments;
  const isDark = theme === 'dark';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <section 
      id="payments" 
      className={`py-14 sm:py-20 relative border-b transition-colors duration-200 ${
        isDark 
          ? 'bg-stone-950 text-stone-100 border-stone-800' 
          : 'bg-[#f8f5ef] text-stone-900 border-amber-600/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border ${
            isDark 
              ? 'bg-amber-500/15 border-amber-400/30 text-amber-300' 
              : 'bg-amber-100 border-amber-300 text-amber-950'
          }`}>
            <CreditCard className="w-3.5 h-3.5 text-amber-500" />
            <span>Secure Tuition & Checkout Accounts</span>
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

        {/* Two Columns: Local (PK) & Overseas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Local Accounts Column */}
          <div className={`rounded-3xl p-6 sm:p-8 space-y-6 border shadow-lg ${
            isDark 
              ? 'bg-stone-900 border-stone-800 text-stone-100' 
              : 'bg-white border-amber-200/90 text-stone-900'
          }`}>
            <div className={`flex items-center gap-3 border-b pb-4 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow">
                PK
              </div>
              <div>
                <h3 className={`text-xl font-bold font-kufi ${isDark ? 'text-stone-100' : 'text-emerald-950'}`}>
                  {t.localTitle[lang]}
                </h3>
                <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  Instant mobile wallet transfer (EasyPaisa, JazzCash, SadaPay & Banks)
                </p>
              </div>
            </div>

            {/* EasyPaisa Box */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">EasyPaisa Account</span>
                <button
                  onClick={() => setQrModalAccount({ title: payments.easypaisa.accountTitle, number: payments.easypaisa.accountNumber, service: 'EasyPaisa' })}
                  className="text-xs text-amber-500 hover:underline flex items-center gap-1 touch-target cursor-pointer font-semibold"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Show QR</span>
                </button>
              </div>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border ${
                isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <div>
                  <span className={`text-[11px] block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    Account Title: <strong className={isDark ? 'text-stone-200' : 'text-stone-900'}>{payments.easypaisa.accountTitle}</strong>
                  </span>
                  <span className={`font-mono text-base font-bold ${isDark ? 'text-amber-300' : 'text-emerald-900'}`}>
                    {payments.easypaisa.accountNumber}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(payments.easypaisa.accountNumber, 'easypaisa')}
                  className={`self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors touch-target cursor-pointer ${
                    isDark 
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                  }`}
                >
                  {copiedKey === 'easypaisa' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{copiedKey === 'easypaisa' ? 'Copied!' : t.copyBtn[lang]}</span>
                </button>
              </div>
              <p className={`text-[11px] italic ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {payments.easypaisa.instructions[lang] || payments.easypaisa.instructions.en}
              </p>
            </div>

            {/* JazzCash Box */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">JazzCash Account</span>
                <button
                  onClick={() => setQrModalAccount({ title: payments.jazzcash.accountTitle, number: payments.jazzcash.accountNumber, service: 'JazzCash' })}
                  className="text-xs text-amber-500 hover:underline flex items-center gap-1 touch-target cursor-pointer font-semibold"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Show QR</span>
                </button>
              </div>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border ${
                isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <div>
                  <span className={`text-[11px] block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    Account Title: <strong className={isDark ? 'text-stone-200' : 'text-stone-900'}>{payments.jazzcash.accountTitle}</strong>
                  </span>
                  <span className={`font-mono text-base font-bold ${isDark ? 'text-amber-300' : 'text-emerald-900'}`}>
                    {payments.jazzcash.accountNumber}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(payments.jazzcash.accountNumber, 'jazzcash')}
                  className={`self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors touch-target cursor-pointer ${
                    isDark 
                      ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                  }`}
                >
                  {copiedKey === 'jazzcash' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{copiedKey === 'jazzcash' ? 'Copied!' : t.copyBtn[lang]}</span>
                </button>
              </div>
              <p className={`text-[11px] italic ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                {payments.jazzcash.instructions[lang] || payments.jazzcash.instructions.en}
              </p>
            </div>

            {/* SadaPay / Nayapay */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">SadaPay (IBAN Transfer)</span>
              <div className={`p-2.5 rounded-xl border space-y-1 ${
                isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>
                    Title: <strong>{payments.sadapay.accountTitle}</strong>
                  </span>
                  <button
                    onClick={() => copyToClipboard(payments.sadapay.iban, 'sadapay')}
                    className="text-amber-500 hover:underline text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy IBAN</span>
                  </button>
                </div>
                <p className={`font-mono text-xs break-all font-bold ${isDark ? 'text-amber-300' : 'text-emerald-900'}`}>
                  {payments.sadapay.iban}
                </p>
              </div>
            </div>

            {/* Islamic Bank Account */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span className={`font-bold text-sm ${isDark ? 'text-amber-300' : 'text-emerald-950'}`}>
                  {payments.bank.bankName}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
              }`}>
                <p className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                  Title: <strong>{payments.bank.accountTitle}</strong>
                </p>
                <div className="flex justify-between items-center">
                  <p className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                    Account: <span className={`font-mono font-bold ${isDark ? 'text-amber-400' : 'text-emerald-900'}`}>{payments.bank.accountNumber}</span>
                  </p>
                  <button
                    onClick={() => copyToClipboard(payments.bank.iban, 'bank')}
                    className="text-amber-500 hover:underline text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedKey === 'bank' ? 'Copied IBAN!' : 'Copy IBAN'}</span>
                  </button>
                </div>
                <p className={`font-mono text-[11px] break-all ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  IBAN: {payments.bank.iban}
                </p>
              </div>
            </div>
          </div>

          {/* Overseas & International Portal Column */}
          <div className={`rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between border shadow-lg ${
            isDark 
              ? 'bg-stone-900 border-stone-800 text-stone-100' 
              : 'bg-white border-amber-200/90 text-stone-900'
          }`}>
            <div className="space-y-6">
              <div className={`flex items-center gap-3 border-b pb-4 ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold font-kufi ${isDark ? 'text-stone-100' : 'text-emerald-950'}`}>
                    {t.overseasTitle[lang]}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    International wires, debit/credit cards, Wise & PayPal
                  </p>
                </div>
              </div>

              {/* Wise Transfer */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Wise (TransferWise)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold">
                    Lowest Conversion Fees
                  </span>
                </div>
                <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                  isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                }`}>
                  <div>
                    <span className={`text-[11px] block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>Recipient Email:</span>
                    <span className={`font-mono text-sm font-bold ${isDark ? 'text-amber-300' : 'text-emerald-900'}`}>
                      {payments.overseas.wiseEmail}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(payments.overseas.wiseEmail, 'wise')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' 
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    }`}
                  >
                    {copiedKey === 'wise' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{copiedKey === 'wise' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* PayPal */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">PayPal Account</span>
                <div className={`flex items-center justify-between p-2.5 rounded-xl border ${
                  isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                }`}>
                  <div>
                    <span className={`text-[11px] block ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>PayPal Email:</span>
                    <span className={`font-mono text-sm font-bold ${isDark ? 'text-amber-300' : 'text-emerald-900'}`}>
                      {payments.overseas.paypalEmail}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(payments.overseas.paypalEmail, 'paypal')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
                      isDark 
                        ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700' 
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    }`}
                  >
                    {copiedKey === 'paypal' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{copiedKey === 'paypal' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* PayPal.me Quick Link if available */}
              {payments.overseas.paypalMeLink && (
                <div className="pt-1">
                  <a
                    href={payments.overseas.paypalMeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Instant PayPal.Me Checkout</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* International SWIFT & Wire */}
              {(payments.overseas.bankSwift || payments.overseas.internationalIban) && (
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <span className="font-bold text-amber-500 text-sm">International Bank Wire (SWIFT / IBAN)</span>
                  <div className={`p-2.5 rounded-xl border text-xs space-y-1.5 ${
                    isDark ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'
                  }`}>
                    {payments.overseas.bankSwift && (
                      <div className="flex justify-between items-center">
                        <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>SWIFT / BIC:</span>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-amber-400">{payments.overseas.bankSwift}</code>
                          <button
                            onClick={() => copyToClipboard(payments.overseas.bankSwift!, 'swift')}
                            className="text-amber-500 hover:underline text-[10px]"
                          >
                            {copiedKey === 'swift' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}
                    {payments.overseas.internationalIban && (
                      <div className="pt-1 border-t border-stone-800 flex justify-between items-center">
                        <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>Int'l IBAN:</span>
                        <button
                          onClick={() => copyToClipboard(payments.overseas.internationalIban!, 'intl_iban')}
                          className="text-amber-500 hover:underline text-[10px]"
                        >
                          {copiedKey === 'intl_iban' ? 'Copied IBAN!' : 'Copy IBAN'}
                        </button>
                      </div>
                    )}
                    {payments.overseas.internationalIban && (
                      <p className={`font-mono text-[10px] break-all ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                        {payments.overseas.internationalIban}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* International Debit/Credit Card Portal Link */}
              {payments.overseas.cardPortalUrl && (
                <div className="pt-1">
                  <a
                    href={payments.overseas.cardPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-stone-950" />
                    <span>Pay with Visa / MasterCard (Overseas)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Western Union / Remitly */}
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${
                isDark ? 'bg-stone-950/80 border-stone-800' : 'bg-stone-50 border-stone-200'
              }`}>
                <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">Western Union / Remitly / MoneyGram</span>
                <p className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                  Recipient Name: <strong>{payments.overseas.westernUnionName}</strong>
                </p>
                <p className={`text-[11px] italic ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                  {payments.overseas.instructions[lang] || payments.overseas.instructions.en}
                </p>
              </div>
            </div>

            {/* Submit Proof to WhatsApp */}
            <div className={`pt-4 border-t ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=Assalamu%20Alaikum%20Mufti%20Danish%20Kaleem%20Sahib,%20I%20have%20transferred%20the%20fee%20amount.%20Here%20is%20my%20transaction%20receipt.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl font-bold bg-emerald-700 hover:bg-emerald-600 text-white shadow-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>{t.submitProofBtn[lang]}</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* QR Code Modal */}
      {qrModalAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
          <div className={`border-2 border-amber-500/50 rounded-3xl p-6 max-w-sm w-full text-center relative ${
            isDark ? 'bg-stone-900 text-stone-200' : 'bg-white text-stone-900'
          }`}>
            <button
              onClick={() => setQrModalAccount(null)}
              type="button"
              className={`absolute top-4 right-4 p-2 rounded-xl border transition-all cursor-pointer active:scale-95 z-10 ${
                isDark 
                  ? 'bg-stone-800 hover:bg-rose-950/70 border-stone-700 text-stone-300 hover:text-rose-200' 
                  : 'bg-stone-100 hover:bg-rose-50 border-stone-300 text-stone-700 hover:text-rose-700'
              }`}
              aria-label="Close"
            >
              <X className="w-5 h-5 text-amber-500" />
            </button>
            <h4 className={`text-lg font-bold font-kufi mb-1 ${isDark ? 'text-amber-300' : 'text-emerald-950'}`}>
              {qrModalAccount.service} QR Code
            </h4>
            <p className={`text-xs mb-4 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              Scan with your {qrModalAccount.service} mobile app
            </p>

            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center border-4 border-amber-400">
              <div className="w-full h-full bg-stone-950 flex flex-col items-center justify-center p-2 rounded-lg text-amber-400">
                <QrCode className="w-24 h-24" />
                <span className="font-mono text-[10px] text-white mt-1">{qrModalAccount.number}</span>
              </div>
            </div>

            <div className={`mt-4 pt-3 border-t text-xs ${isDark ? 'border-stone-800' : 'border-stone-200'}`}>
              <p className={isDark ? 'text-stone-300' : 'text-stone-700'}>
                Account Title: <strong>{qrModalAccount.title}</strong>
              </p>
              <p className="font-mono text-amber-500 font-bold mt-1 text-sm">{qrModalAccount.number}</p>
            </div>

            <div className="mt-4 pt-2">
              <button
                onClick={() => setQrModalAccount(null)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isDark ? 'bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700' : 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200'
                }`}
              >
                {lang === 'ur' ? 'مکمل / بند کریں' : lang === 'ar' ? 'تم / إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
