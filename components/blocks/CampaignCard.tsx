"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import Icon from "@/components/icons";
import { categoryMeta } from "@/lib/categories";

interface Props {
  id?: string; slug: string; title: string; summary: string; coverImage?: string | null;
  goalAmount: number; raisedAmount: number; donorCount: number;
  category?: string; locale?: string; dict?: Record<string, string>;
}

const QUICK_AMOUNTS = [5, 10, 25, 50];

export default function CampaignCard({ id, slug, title, summary, coverImage, goalAmount, raisedAmount, donorCount, category, locale = "ar", dict = {} }: Props) {
  const t = (k: string) => {
    const FALLBACKS: Record<string, string> = {
      donate_now:     locale === "fr" ? "Faire un Don"     : locale === "tr" ? "Bağış Yap"    : locale === "en" ? "Donate Now"        : "تبرع الآن",
      add_to_cart:    locale === "fr" ? "Ajouter au Panier": locale === "tr" ? "Sepete Ekle"  : locale === "en" ? "Add to Cart"       : "أضف إلى السلة",
      added:          locale === "fr" ? "Ajouté ✓"         : locale === "tr" ? "Eklendi ✓"   : locale === "en" ? "Added ✓"            : "أُضيف ✓",
      monthly:        locale === "fr" ? "Mensuel"          : locale === "tr" ? "Aylık"        : locale === "en" ? "Monthly"           : "شهري",
      one_time:       locale === "fr" ? "Unique"           : locale === "tr" ? "Tek Seferlik" : locale === "en" ? "One-time"          : "مرة واحدة",
      of_goal:        locale === "fr" ? "de l'objectif"    : locale === "tr" ? "hedefin"      : locale === "en" ? "of goal"           : "من الهدف",
      full_name:      locale === "fr" ? "Nom Complet"      : locale === "tr" ? "Ad Soyad"     : locale === "en" ? "Full Name"         : "الاسم الكامل",
      email:          locale === "fr" ? "Email"            : locale === "tr" ? "E-posta"      : locale === "en" ? "Email"             : "البريد الإلكتروني",
      pay_card:       locale === "fr" ? "Payer par Carte"  : locale === "tr" ? "Kart ile Öde" : locale === "en" ? "Pay with Card"     : "الدفع بالبطاقة",
      secure_payment: locale === "fr" ? "Paiement sécurisé": locale === "tr" ? "Güvenli ödeme": locale === "en" ? "Secure payment"    : "دفع آمن ومشفر",
      edit:           locale === "fr" ? "Modifier"         : locale === "tr" ? "Değiştir"     : locale === "en" ? "Change"            : "تعديل",
      invalid_email:  locale === "fr" ? "Email invalide"   : locale === "tr" ? "Geçersiz e-posta": locale === "en" ? "Invalid email" : "بريد إلكتروني غير صحيح",
      name_required:  locale === "fr" ? "Nom et email requis": locale === "tr" ? "Ad ve e-posta gerekli": locale === "en" ? "Name and email required": "الاسم والبريد مطلوبان",
      donors:         locale === "fr" ? "donateurs"        : locale === "tr" ? "bağışçı"      : locale === "en" ? "donors"            : "متبرع",
    };
    return dict[`campaigns.${k}`] || FALLBACKS[k] || k;
  };

  const pct = Math.min(100, Math.round((raisedAmount / (goalAmount || 1)) * 100));
  const cat = categoryMeta(category, locale);
  const prefix = locale === "ar" ? "" : `/${locale}`;

  const [amount, setAmount] = useState(10);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [step, setStep] = useState<"widget" | "details">("widget");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"stripe" | "paypal" | false>(false);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const parsedCustom = custom !== "" ? Number(custom) : NaN;
  const finalAmount = (!isNaN(parsedCustom) && parsedCustom > 0) ? parsedCustom : amount;

  async function pay(provider: "stripe" | "paypal") {
    if (!name.trim() || !email.trim()) { setError(t("name_required")); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(t("invalid_email")); return; }
    setError(""); setLoading(provider);
    try {
      const endpoint = provider === "stripe" ? "/api/donations/checkout" : "/api/donations/paypal";
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          frequency: frequency.toUpperCase(),
          donorName: name,
          donorEmail: email,
          campaignId: id || null,
        }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else setError(d.error || "Error");
    } catch { setError("Connection error"); }
    finally { setLoading(false); }
  }

  const [cartUpdated, setCartUpdated] = useState(false);

  function handleAddToCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    const existing = cart.findIndex((i: any) => i.slug === slug);
    const cartItem = { slug, title, amount: finalAmount, frequency, campaignId: id || null };
    const isUpdate = existing >= 0;
    if (isUpdate) cart[existing] = cartItem;
    else cart.push(cartItem);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
    setCartUpdated(isUpdate);
    setTimeout(() => { setAdded(false); setCartUpdated(false); }, 2000);
    window.dispatchEvent(new Event("storage"));
  }

  const inp = "w-full border border-slate-200 rounded-xl py-2 px-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand bg-white";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Cover Image Header — 🌟 نسبة ثابتة لمنع CLS */}
      <Link href={`${prefix}/campaigns/${slug}`} className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden block shrink-0" aria-label={title}>
        {coverImage && !imgError ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand/30">
            <Icon name="hand-heart" size={48} />
          </div>
        )}
        
        {/* Category Tag */}
        <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1.5 bg-slate-900/75 backdrop-blur-md text-white text-[11px] font-medium rounded-full px-3 py-1 shadow-sm">
          <Icon name={cat.icon} size={12} />{cat.label}
        </span>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`${prefix}/campaigns/${slug}`}>
            <h3 className="font-display font-bold text-base text-slate-900 mb-2 line-clamp-1 group-hover:text-brand transition-colors">{title}</h3>
            <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{summary}</p>
          </Link>

          {/* Progress Section */}
          <div className="space-y-1.5 mb-5">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-brand h-2 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(raisedAmount, "USD")}</span>
                <span className="text-slate-500 text-[11px] ms-1">{t("of_goal")} {formatCurrency(goalAmount, "USD")}</span>
              </div>
              <span className="font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-md text-[11px]">{pct}%</span>
            </div>
          </div>
        </div>

        {/* Quick Action Widget */}
        <div className="border border-slate-100 rounded-xl bg-slate-50/70 p-3 mt-auto">
          {step === "widget" ? (
            <div className="space-y-2.5">
              {/* Frequency Selection */}
              <div className="flex bg-white rounded-lg p-0.5 border border-slate-200 text-xs font-semibold">
                <button onClick={() => setFrequency("one_time")} aria-label="One time donation" className={`flex-1 py-1.5 rounded-md transition-all ${frequency === "one_time" ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>{t("one_time")}</button>
                <button onClick={() => setFrequency("monthly")} aria-label="Monthly donation" className={`flex-1 py-1.5 rounded-md transition-all ${frequency === "monthly" ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>{t("monthly")}</button>
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-4 gap-1.5">
                {QUICK_AMOUNTS.map(a => (
                  <button key={a} onClick={() => { setAmount(a); setCustom(""); }} aria-label={`Select $${a}`} className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${finalAmount === a && !custom ? "bg-brand border-brand text-white shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand"}`}>${a}</button>
                ))}
              </div>

              {/* Custom Input Counter */}
              <div className="flex items-center gap-1.5">
                <button onClick={() => { const v = Math.max(1, finalAmount - 5); setAmount(v); setCustom(String(v)); }} aria-label="Decrease amount" className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-brand flex items-center justify-center text-base font-medium transition-colors">−</button>
                <div className="flex-1 relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-semibold">$</span>
                  <input
                    type="number" min={1}
                    aria-label="Custom Amount"
                    value={custom !== "" ? custom : String(finalAmount)}
                    onChange={e => setCustom(e.target.value)}
                    onBlur={() => { if (custom === "" || Number(custom) < 1) setCustom(""); }}
                    className="w-full border border-slate-200 rounded-lg py-1.5 pl-6 pr-2 text-xs text-center focus:outline-none focus:border-brand bg-white font-semibold"
                  />
                </div>
                <button onClick={() => { const v = finalAmount + 5; setAmount(v); setCustom(String(v)); }} aria-label="Increase amount" className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 hover:border-brand flex items-center justify-center text-base font-medium transition-colors">+</button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-0.5">
                <button onClick={handleAddToCart} aria-label="Add campaign to cart" className={`flex items-center justify-center gap-1 border rounded-xl px-3 py-2 text-xs font-bold transition-all shrink-0 ${added ? "border-emerald-500 text-emerald-600 bg-emerald-50" : "border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand"}`}>
                  <Icon name={added ? "check" : "layers"} size={14} />
                  <span>{added ? (cartUpdated ? "✓" : t("added")) : t("add_to_cart")}</span>
                </button>
                <button onClick={() => { setStep("details"); setName(""); setEmail(""); setError(""); }} disabled={!finalAmount || finalAmount <= 0} aria-label="Proceed to donate" className="flex-1 bg-accent hover:opacity-90 active:scale-98 text-white font-bold rounded-xl py-2 text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm">
                  <Icon name="heart" size={14} />{t("donate_now")}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand">{frequency === "monthly" ? t("monthly") : t("one_time")} — ${finalAmount}</span>
                <button onClick={() => { setStep("widget"); setError(""); }} className="text-[11px] text-slate-500 hover:text-slate-800 underline">{t("edit")}</button>
              </div>
              <input type="text" placeholder={t("full_name")} aria-label="Full Name" value={name} onChange={e => setName(e.target.value)} className={inp} />
              <input type="email" placeholder={t("email")} aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} className={inp} />
              {error && <p className="text-[11px] text-red-500 flex items-center gap-1"><Icon name="x" size={11} />{error}</p>}
              
              <button onClick={() => pay("stripe")} disabled={!!loading} aria-label="Pay with Card" className="w-full bg-brand hover:opacity-90 text-white font-bold rounded-xl py-2 text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-1.5 shadow-sm">
                <Icon name="wallet" size={14} />
                {loading === "stripe" ? "..." : t("pay_card")}
              </button>
              
              <button onClick={() => pay("paypal")} disabled={!!loading} aria-label="Pay with PayPal" className="w-full bg-[#FFC439] hover:bg-[#f0b429] text-[#003087] font-bold rounded-xl py-2 text-xs transition-all disabled:opacity-60 flex items-center justify-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#003087" aria-hidden="true"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                {loading === "paypal" ? "..." : "PayPal"}
              </button>
              <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1 pt-0.5"><Icon name="shield-check" size={10} />{t("secure_payment")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}