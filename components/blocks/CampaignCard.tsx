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
      added:          locale === "fr" ? "Ajouté ✓"         : locale === "tr" ? "Eklendi ✓"   : locale === "en" ? "Added ✓"           : "أُضيف ✓",
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
    };
    return dict[`campaigns.${k}`] || FALLBACKS[k] || k;
  };

  const pct = Math.min(100, Math.round((raisedAmount / (goalAmount || 1)) * 100));
  const cat = categoryMeta(category);
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

  // 🌟 إزالة الشفافية /30 واستبدالها بـ ring-brand صافي لتجنب كسر المتغيرات
  const inp = "w-full border border-line rounded-xl py-2 px-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand bg-white";

  return (
    <div className="group bg-white rounded-xl2 overflow-hidden border border-line shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 flex flex-col">
      <Link href={`${prefix}/campaigns/${slug}`} className="relative h-44 w-full bg-beige overflow-hidden block shrink-0">
        {coverImage && !imgError ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand opacity-30">
            <Icon name="hand-heart" size={48} />
          </div>
        )}
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur text-brand text-xs font-semibold rounded-full px-3 py-1.5 shadow-sm">
          <Icon name={cat.icon} size={14} />{cat.label}
        </span>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <Link href={`${prefix}/campaigns/${slug}`}>
          <h3 className="font-display font-bold text-base text-ink mb-1 line-clamp-1 hover:text-brand transition">{title}</h3>
          <p className="text-sm text-muted mb-3 line-clamp-2">{summary}</p>
        </Link>

        {/* 🌟 شريط التقدم: يستخدم bg-brand */}
        <div className="w-full bg-line rounded-full h-2 mb-1.5 overflow-hidden">
          <div className="bg-brand h-2 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs mb-4">
          <span className="font-bold text-brand text-sm">{formatCurrency(raisedAmount, "USD")}</span>
          <span className="text-muted">{pct}% {t("of_goal")} {formatCurrency(goalAmount, "USD")}</span>
        </div>

        <div className="border border-line rounded-xl bg-cream mt-auto overflow-hidden">
          {step === "widget" ? (
            <div className="p-3 space-y-2.5">
              <div className="flex rounded-lg overflow-hidden border border-line text-xs font-bold">
                <button onClick={() => setFrequency("one_time")} className={`flex-1 py-2 transition ${frequency === "one_time" ? "bg-brand text-white" : "bg-white text-muted hover:bg-beige"}`}>{t("one_time")}</button>
                <button onClick={() => setFrequency("monthly")} className={`flex-1 py-2 transition ${frequency === "monthly" ? "bg-brand text-white" : "bg-white text-muted hover:bg-beige"}`}>{t("monthly")}</button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {QUICK_AMOUNTS.map(a => (
                  <button key={a} onClick={() => { setAmount(a); setCustom(""); }} className={`py-1.5 rounded-lg text-xs font-bold border transition ${finalAmount === a && !custom ? "bg-brand border-brand text-white" : "border-line bg-white text-ink hover:border-brand hover:text-brand"}`}>${a}</button>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => { const v = Math.max(1, finalAmount - 5); setAmount(v); setCustom(String(v)); }} className="w-9 h-9 rounded-lg border border-line bg-white text-ink hover:border-brand flex items-center justify-center text-xl font-light">−</button>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-semibold">$</span>
                  <input
                    type="number" min={1}
                    value={custom !== "" ? custom : String(finalAmount)}
                    onChange={e => setCustom(e.target.value)}
                    onBlur={() => { if (custom === "" || Number(custom) < 1) setCustom(""); }}
                    className="w-full border border-line rounded-lg py-2 pl-8 pr-3 text-sm text-center focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand bg-white"
                  />
                </div>
                <button onClick={() => { const v = finalAmount + 5; setAmount(v); setCustom(String(v)); }} className="w-9 h-9 rounded-lg border border-line bg-white text-ink hover:border-brand flex items-center justify-center text-xl font-light">+</button>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddToCart} className={`flex items-center gap-1.5 border rounded-xl px-3 py-2.5 text-xs font-bold transition shrink-0 ${added ? "border-success text-success bg-success/5" : "border-brand text-brand hover:bg-brand hover:text-white"}`}>
                  <Icon name={added ? "check" : "layers"} size={14} />{added ? (cartUpdated ? (locale === "ar" ? "تم التحديث ✓" : "Updated ✓") : t("added")) : t("add_to_cart")}
                </button>
                {/* 🌟 زر التبرع السريع: تم توحيده إلى bg-accent */}
                <button onClick={() => { setStep("details"); setName(""); setEmail(""); setError(""); }} disabled={!finalAmount || finalAmount <= 0} className="flex-1 bg-accent hover:opacity-90 text-white font-bold rounded-xl py-2.5 text-sm transition disabled:opacity-50 flex items-center justify-center gap-1.5">
                  <Icon name="heart" size={15} />{t("donate_now")}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-brand">{frequency === "monthly" ? t("monthly") : t("one_time")} — ${finalAmount}</span>
                <button onClick={() => { setStep("widget"); setError(""); }} className="text-xs text-muted hover:text-ink underline">{t("edit")}</button>
              </div>
              <input type="text" placeholder={t("full_name")} value={name} onChange={e => setName(e.target.value)} className={inp} />
              <input type="email" placeholder={t("email")} value={email} onChange={e => setEmail(e.target.value)} className={inp} />
              {error && <p className="text-xs text-danger flex items-center gap-1"><Icon name="x" size={11} />{error}</p>}
              
              {/* 🌟 زر الدفع (Stripe): تم توحيده إلى bg-brand */}
              <button onClick={() => pay("stripe")} disabled={!!loading} className="w-full bg-brand hover:opacity-90 text-white font-bold rounded-xl py-2.5 text-sm transition disabled:opacity-60 flex items-center justify-center gap-1.5">
                <Icon name="wallet" size={15} />
                {loading === "stripe" ? "..." : t("pay_card")}
              </button>
              
              {/* ملاحظة: زر PayPal تُرك بألوانه الرسمية (أصفر/أزرق) لأنها هوية بصرية ثابتة للشركة ولا يُفضل تغييرها */}
              <button onClick={() => pay("paypal")} disabled={!!loading} className="w-full bg-[#FFC439] hover:bg-[#f0b429] text-[#003087] font-bold rounded-xl py-2.5 text-sm transition disabled:opacity-60 flex items-center justify-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#003087"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                {loading === "paypal" ? "..." : "PayPal"}
              </button>
              <p className="text-xs text-muted text-center"><Icon name="shield-check" size={11} className="inline ml-1" />{t("secure_payment")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}