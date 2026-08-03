"use client";

import { useState } from "react";
import Icon from "@/components/icons";

interface Props {
  defaultAmount: string;
  defaultFrequency: string;
  campaignId?: string;
  locale?: string;
  dict?: Record<string, string>;
}

export default function DonateForm({ defaultAmount, defaultFrequency, campaignId, locale = "ar", dict = {} }: Props) {
  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  const [amount, setAmount] = useState(defaultAmount || "10");
  const [frequency, setFrequency] = useState(defaultFrequency || "one_time");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState<"stripe" | "paypal" | null>(null);
  const [error, setError] = useState("");

  async function pay(provider: "stripe" | "paypal") {
    setError("");
    if (!amount || parseFloat(amount) <= 0) {
      setError(t("donate.invalid_amount", "يرجى إدخال مبلغ صحيح", "Please enter a valid amount", "Montant invalide", "Geçerli tutar girin"));
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError(t("donate.name_required", "يرجى إدخال الاسم والبريد الإلكتروني", "Name and email required", "Nom et email requis", "Ad ve e-posta gerekli"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("donate.invalid_email", "بريد إلكتروني غير صحيح", "Invalid email address", "Email invalide", "Geçersiz e-posta"));
      return;
    }
    setLoading(provider);
    try {
      const res = await fetch(`/api/donations/${provider === "stripe" ? "checkout" : "paypal"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          frequency,
          donorName: name,
          donorEmail: email,
          message,
          isAnonymous: anonymous,
          campaignId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("common.error", "حدث خطأ", "An error occurred", "Une erreur s'est produite", "Bir hata oluştu"));
      if (data.url) window.location.href = data.url;
      else throw new Error(t("donate.no_url", "لم يتم استرجاع رابط الدفع", "Payment URL not received", "URL de paiement non reçue", "Ödeme URL'si alınamadı"));
    } catch (e: any) {
      setError(e.message || t("common.error", "حدث خطأ غير متوقع", "Unexpected error", "Erreur inattendue", "Beklenmeyen hata"));
    } finally {
      setLoading(null);
    }
  }

  const inp = "w-full rounded-xl border border-line bg-cream py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand/40 text-sm";

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="max-w-xl mx-auto bg-white rounded-xl2 shadow-xl border border-line p-6 sm:p-8 space-y-5">
      <div>
        <label className="block text-sm text-muted mb-1.5">{t("donate.amount", "المبلغ (USD)", "Amount (USD)", "Montant (USD)", "Tutar (USD)")}</label>
        <input
          type="number" min={1} value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inp + " text-lg"}
        />
      </div>

      <div className="flex gap-3">
        <button onClick={() => setFrequency("one_time")}
          className={`flex-1 rounded-xl py-2.5 font-semibold border transition ${frequency === "one_time" ? "bg-brand text-white border-brand" : "bg-cream border-line"}`}>
          {t("donate.one_time", "مرة واحدة", "One-time", "Unique", "Tek Seferlik")}
        </button>
        <button onClick={() => setFrequency("monthly")}
          className={`flex-1 rounded-xl py-2.5 font-semibold border transition ${frequency === "monthly" ? "bg-brand text-white border-brand" : "bg-cream border-line"}`}>
          {t("donate.monthly", "شهرياً متكرر", "Monthly", "Mensuel", "Aylık")}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-muted mb-1.5">{t("auth.name", "الاسم الكامل", "Full Name", "Nom Complet", "Ad Soyad")}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inp} />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1.5">{t("auth.email", "البريد الإلكتروني", "Email", "Email", "E-posta")}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} />
        </div>
      </div>

      <div>
        <label className="block text-sm text-muted mb-1.5">{t("donate.message", "رسالة (اختياري)", "Message (optional)", "Message (optionnel)", "Mesaj (isteğe bağlı)")}</label>
        <textarea
          value={message} onChange={(e) => setMessage(e.target.value)}
          rows={2} maxLength={500}
          className={inp + " resize-none"}
        />
        <p className="text-xs text-muted mt-1">{message.length}/500</p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="w-4 h-4 accent-brand" />
        <span className="text-sm text-muted">{t("donate.anonymous", "تبرع بشكل مجهول", "Donate anonymously", "Don anonyme", "Anonim bağış")}</span>
      </label>

      {error && (
        <p className="flex items-center gap-2 text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg p-3">
          <Icon name="x" size={16} className="shrink-0" />
          {error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3 pt-2">
        <button onClick={() => pay("stripe")} disabled={loading !== null}
          className="bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3.5 transition disabled:opacity-60 flex items-center justify-center gap-2">
          <Icon name="wallet" size={16} />
          {loading === "stripe" ? "..." : t("donate.pay_card", "الدفع بالبطاقة", "Pay with Card", "Payer par Carte", "Kart ile Öde")}
        </button>
        <button onClick={() => pay("paypal")} disabled={loading !== null}
          className="bg-[#FFC439] hover:bg-[#f0b72f] text-[#003087] font-bold rounded-xl py-3.5 transition disabled:opacity-60 flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#003087"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
          {loading === "paypal" ? "..." : "PayPal"}
        </button>
      </div>

      <p className="text-xs text-center text-muted flex items-center justify-center gap-1.5">
        <Icon name="shield-check" size={12} />
        {t("donate.secure", "جميع المعاملات مشفرة وآمنة", "All transactions are secure and encrypted", "Toutes les transactions sont sécurisées", "Tüm işlemler güvenli ve şifreli")}
      </p>
    </div>
  );
}
