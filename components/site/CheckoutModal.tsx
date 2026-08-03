"use client";
import { useState, useEffect } from "react";
import Icon from "@/components/icons";

interface Props {
  amount: number;
  frequency: "ONE_TIME" | "MONTHLY";
  campaignId?: string;
  campaignTitle?: string;
  locale: string;
  dict: Record<string, string>;
  onClose: () => void;
}

export default function CheckoutModal({ amount: initialAmount, frequency: initialFreq, campaignId, campaignTitle, locale, dict, onClose }: Props) {
  const [amount, setAmount] = useState(initialAmount);
  const [freq, setFreq] = useState(initialFreq);
  const [step, setStep] = useState<"amount" | "details">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"stripe" | "paypal" | null>(null);
  const [error, setError] = useState("");
  const [custom, setCustom] = useState(![10,25,50,100,250].includes(initialAmount) ? String(initialAmount) : "");

  const final = custom ? Math.max(1, Number(custom) || 1) : Math.max(1, amount);

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function pay(provider: "stripe" | "paypal") {
    if (!name.trim() || !email.trim()) { setError(t("donate.name_required","الاسم والبريد مطلوبان","Name and email required","Nom et email requis","Ad ve e-posta gerekli")); return; }
    setLoading(provider); setError("");
    try {
      const endpoint = provider === "stripe" ? "/api/donations/checkout" : "/api/donations/paypal";
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: final, frequency: freq, donorName: name, donorEmail: email, campaignId }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else setError(d.error || t("common.error","حدث خطأ","An error occurred","Une erreur s'est produite","Bir hata oluştu"));
    } catch { setError(t("common.error","حدث خطأ","An error occurred","Une erreur s'est produite","Bir hata oluştu")); }
    finally { setLoading(null); }
  }

  const AMOUNTS = [10, 25, 50, 100, 250];
  const inp = "w-full bg-white/10 border border-white/25 focus:border-white/60 rounded-xl py-3 px-4 text-white placeholder-white/40 text-sm focus:outline-none transition";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div dir={locale === "ar" ? "rtl" : "ltr"} className="relative w-full max-w-md bg-gradient-to-br from-[#003C87] to-[#0069D2] rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-white font-display font-extrabold text-xl">
              {t("donate.title","تبرع الآن","Donate Now","Faire un Don","Bağış Yap")}
            </h2>
            {campaignTitle && (
              <p className="text-white/55 text-xs mt-0.5">{campaignTitle}</p>
            )}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="px-6 pb-7 space-y-4">
          {step === "amount" ? (
            <>
              {/* Frequency */}
              <div className="flex bg-white/10 rounded-2xl p-1">
                {(["ONE_TIME","MONTHLY"] as const).map(f => (
                  <button key={f} onClick={() => setFreq(f)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${freq === f ? "bg-white text-brand shadow-sm" : "text-white/70 hover:text-white"}`}>
                    {f === "ONE_TIME"
                      ? t("donate.one_time","مرة واحدة","One-time","Unique","Tek Seferlik")
                      : t("donate.monthly","شهري","Monthly","Mensuel","Aylık")}
                  </button>
                ))}
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-5 gap-2">
                {AMOUNTS.map(a => (
                  <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                    className={`py-2.5 rounded-xl text-sm font-bold transition ${final === a && !custom ? "bg-white text-brand shadow-md" : "bg-white/10 text-white hover:bg-white/20"}`}>
                    ${a}
                  </button>
                ))}
              </div>

              {/* Custom */}
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-bold text-sm">$</span>
                <input type="number" min={1} value={custom} onChange={e => setCustom(e.target.value)}
                  placeholder={t("donate.custom","مبلغ آخر...","Custom amount...","Autre montant...","Özel miktar...")}
                  className={inp + " pr-10"} />
              </div>

              {/* Next */}
              <button onClick={() => setStep("details")} disabled={!final || final <= 0}
                className="w-full bg-gradient-to-r from-[#F00F5A] to-[#FF4D88] hover:opacity-90 disabled:opacity-50 text-white font-bold rounded-2xl py-4 text-base shadow-lg transition flex items-center justify-center gap-2">
                <Icon name="heart" size={18} />
                {t("donate.title","تبرع بـ","Donate","Faire un Don","Bağış Yap")} ${final}
                {freq === "MONTHLY" && <span className="text-white/65 text-sm font-normal">/{t("donate.monthly","شهر","mo","mois","ay")}</span>}
              </button>

              <p className="text-white/35 text-xs text-center flex items-center justify-center gap-1">
                <Icon name="shield-check" size={11} />
                {t("donate.secure","دفع آمن ومشفر","Secure encrypted payment","Paiement sécurisé","Güvenli ödeme")}
              </p>
            </>
          ) : (
            <>
              {/* Summary */}
              <div className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
                <span className="text-white text-sm font-bold">${final} {freq === "MONTHLY" && <span className="text-white/50 font-normal text-xs">/{t("donate.monthly","شهر","mo","mois","ay")}</span>}</span>
                <button onClick={() => { setStep("amount"); setError(""); }} className="text-white/50 hover:text-white text-xs underline">
                  {t("campaigns.edit","تعديل","Change","Modifier","Değiştir")}
                </button>
              </div>

              <input value={name} onChange={e => setName(e.target.value)}
                placeholder={t("donate.name","الاسم الكامل","Full Name","Nom Complet","Ad Soyad")}
                className={inp} />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={t("donate.email","البريد الإلكتروني","Email Address","Adresse Email","E-posta")}
                className={inp} />

              {error && <p className="text-red-300 text-xs">{error}</p>}

              <button onClick={() => pay("stripe")} disabled={!!loading}
                className="w-full bg-white text-brand font-bold rounded-2xl py-3.5 hover:bg-white/90 disabled:opacity-60 transition flex items-center justify-center gap-2 text-sm">
                <Icon name="wallet" size={16} />
                {loading === "stripe"
                  ? t("common.loading","جاري التحميل...","Processing...","Traitement...","İşleniyor...")
                  : `${t("donate.pay_card","الدفع بالبطاقة","Pay with Card","Payer par Carte","Kart ile Öde")} — $${final}`}
              </button>

              <button onClick={() => pay("paypal")} disabled={!!loading}
                className="w-full bg-[#003087] hover:bg-[#002574] text-white font-bold rounded-2xl py-3.5 disabled:opacity-60 transition flex items-center justify-center gap-2 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                {loading === "paypal" ? "..." : `PayPal — $${final}`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
