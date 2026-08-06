"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Icon from "@/components/icons";

interface Slide {
  image: string;
  title_ar: string; title_en: string; title_fr: string; title_tr: string;
  subtitle_ar: string; subtitle_en: string; subtitle_fr: string; subtitle_tr: string;
}

interface Props {
  locale: string;
  dict: Record<string, string>;
  heroImage?: string | null;
  heroSlides?: Slide[] | null;
  accentColor?: string | null;
  primaryColor?: string | null;
  data?: any;
}

const QUICK_AMOUNTS = [10, 25, 50, 100, 250];

const DEFAULT_SLIDES: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80",
    title_ar: "معاً نصنع الأمل", title_en: "Together We Create Hope",
    title_fr: "Ensemble Nous Créons l'Espoir", title_tr: "Birlikte Umut Yaratıyoruz",
    subtitle_ar: "منصة تبرعات شفافة وآمنة لدعم الأسر المحتاجة حول العالم.",
    subtitle_en: "A transparent and secure platform supporting families in need worldwide.",
    subtitle_fr: "Une plateforme de dons transparente pour soutenir les familles dans le besoin.",
    subtitle_tr: "Dünya genelinde ihtiyaç sahibi aileleri destekleyen şeffaf bağış platformu.",
  },
  {
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1920&q=80",
    title_ar: "يدٌ تمتد لكل محتاج", title_en: "A Hand for Every Person in Need",
    title_fr: "Une Main Tendue à Chaque Personne dans le Besoin", title_tr: "İhtiyaç Sahibi Herkes İçin Bir El",
    subtitle_ar: "تبرعك يصل مباشرة للمستحقين دون وسيط بشفافية كاملة.",
    subtitle_en: "Your donation reaches beneficiaries directly with full transparency.",
    subtitle_fr: "Votre don parvient directement aux bénéficiaires avec une transparence totale.",
    subtitle_tr: "Bağışınız, tam şeffaflıkla doğrudan yararlanıcılara ulaşır.",
  },
  {
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80",
    title_ar: "كل درهم يغير حياة", title_en: "Every Dollar Changes a Life",
    title_fr: "Chaque Euro Change une Vie", title_tr: "Her Dolar Bir Hayat Değiştirir",
    subtitle_ar: "من الغذاء والمأوى إلى التعليم والرعاية الصحية — معك نصنع الفرق.",
    subtitle_en: "From food and shelter to education and healthcare — together we make a difference.",
    subtitle_fr: "De la nourriture à l'éducation — ensemble nous faisons la différence.",
    subtitle_tr: "Gıdadan eğitime kadar — birlikte fark yaratıyoruz.",
  },
];

export default function HeroSection({ locale, dict, heroImage, heroSlides, accentColor, primaryColor, data }: Props) {
  const accent = accentColor || "#F00F5A";
  const primary = primaryColor || "#0069D2";
  const p = locale === "ar" ? "" : `/${locale}`;
  
  const adminSlides = data?.items || data?.slides || [];
  const slides = adminSlides.length > 0 
    ? adminSlides.map((slide: any) => ({
        image: slide.image || slide.backgroundImage || slide.photo || "",
        title_ar: slide.title || slide.headline || slide.title_ar,
        title_en: slide.title_en || slide.title || slide.headline,
        title_fr: slide.title_fr || slide.title || slide.headline,
        title_tr: slide.title_tr || slide.title || slide.headline,
        subtitle_ar: slide.subtitle || slide.subheading || slide.description || slide.subtitle_ar,
        subtitle_en: slide.subtitle_en || slide.subtitle || slide.subheading,
        subtitle_fr: slide.subtitle_fr || slide.subtitle || slide.subheading,
        subtitle_tr: slide.subtitle_tr || slide.subtitle || slide.subheading,
      }))
    : (heroSlides && heroSlides.length > 0 ? heroSlides : DEFAULT_SLIDES);

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const [amount, setAmount] = useState(25);
  const [custom, setCustom] = useState("");
  const [freq, setFreq] = useState<"ONE_TIME" | "MONTHLY">("ONE_TIME");
  const [loading, setLoading] = useState<"stripe" | "paypal" | false>(false);
  const [showDetails, setShowDetails] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [payError, setPayError] = useState("");
  const [cartAdded, setCartAdded] = useState(false);

  const final = custom ? Math.max(1, Number(custom)) : amount;

  const t = (key: string, ar: string, en: string, fr: string, tr: string) =>
    dict[key] || (locale === "ar" ? ar : locale === "fr" ? fr : locale === "tr" ? tr : en);

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 400);
  }, [animating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    if (slides.length <= 1 || hovered) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length, hovered]);

  const slide = slides[current] || slides[0];
  const locKey = locale === "ar" ? "ar" : locale === "fr" ? "fr" : locale === "tr" ? "tr" : "en";

  async function pay(provider: "stripe" | "paypal") {
    if (!name.trim() || !email.trim()) {
      setPayError(t("donate.name", "الاسم والبريد مطلوبان", "Name and email required", "Nom et email requis", "Ad ve e-posta gerekli"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setPayError(t("cart.invalid_email", "بريد إلكتروني غير صحيح", "Invalid email address", "Email invalide", "Geçersiz e-posta"));
      return;
    }
    setLoading(provider); setPayError("");
    try {
      const res = await fetch(provider === "stripe" ? "/api/donations/checkout" : "/api/donations/paypal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: final, frequency: freq, donorName: name, donorEmail: email }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else setPayError(d.error || "Error");
    } catch { setPayError(t("common.error", "حدث خطأ", "An error occurred", "Une erreur s'est produite", "Bir hata oluştu")); }
    finally { setLoading(false); }
  }

  return (
    <section onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="relative flex flex-col justify-between overflow-hidden bg-slate-900 -mt-20 pt-20" style={{ minHeight: "90vh" }}>
      {/* ── Slider Background ── */}
      {slides.map((sl: any, i: number) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current && !animating ? 1 : 0, zIndex: 0 }}>
          <img
            src={sl.image}
            alt=""
            aria-hidden
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
        </div>
      ))}

      {/* Decorative Blur Effect */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none z-[1]" />

      {/* ── Main Hero Content ── */}
      <div className="relative z-10 flex-1 flex items-center py-16">
        <div className="max-w-screen-xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
              <span className="text-white/90 font-medium text-xs tracking-wider uppercase">
                {t("hero.eyebrow", "مؤسسة 4Relief الإنسانية", "4Relief Humanitarian Foundation", "Fondation Humanitaire 4Relief", "4Relief İnsani Yardım Vakfı")}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-extrabold leading-[1.1] text-white mb-6 tracking-tight drop-shadow-md"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}>
              {(slide as any)[`title_${locKey}`] || slide.title_ar}
            </h1>

            {/* Subtitle */}
            <p className="text-white/85 font-normal leading-relaxed mb-8 max-w-xl" style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)" }}>
              {(slide as any)[`subtitle_${locKey}`] || slide.subtitle_ar}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link href={`${p}/donate`}
                className="inline-flex items-center gap-2.5 font-bold rounded-2xl px-8 py-3.5 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                style={{ background: accent, color: "white", fontSize: "0.95rem" }}>
                <Icon name="heart" size={18} />
                {t("hero.cta_donate", "تبرع الآن", "Donate Now", "Faire un Don", "Bağış Yap")}
              </Link>
              <Link href={`${p}/campaigns`}
                className="inline-flex items-center gap-2 font-semibold rounded-2xl px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all hover:scale-[1.02]"
                style={{ fontSize: "0.95rem" }}>
                {t("hero.cta_campaigns", "تصفح الحملات", "Browse Campaigns", "Voir les Campagnes", "Kampanyaları İncele")}
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10">
              {[
                { icon: "shield-check" as const, ar: "دفع 100% آمن",         en: "100% Secure",      fr: "100% Sécurisé",   tr: "100% Güvenli" },
                { icon: "hand-heart"   as const, ar: "أثر مباشر وشفاف",      en: "Direct Impact",    fr: "Impact Direct",   tr: "Doğrudan Etki" },
                { icon: "globe"        as const, ar: "دعم موثوق حول العالم", en: "Verified Global",  fr: "Mondial Vérifié", tr: "Küresel Destek" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/75 text-xs font-medium">
                  <Icon name={item.icon} size={15} className="text-white/90" />
                  {t(`hero.trust${i}`, item.ar, item.en, item.fr, item.tr)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Slider Dots Controls ── */}
      {slides.length > 1 && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-2">
          {slides.map((_: any, i: number) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`}
              className={`transition-all rounded-full ${i === current ? "h-6 w-2 bg-white" : "h-2 w-2 bg-white/40 hover:bg-white/70"}`} />
          ))}
        </div>
      )}

      {/* ── Quick Donate Glass Bar (Primary Colored) ── */}
      <div 
        className="relative z-20 w-full backdrop-blur-xl border-t border-white/15 shadow-2xl transition-colors"
        style={{ backgroundColor: primary }}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Label */}
            <div className="shrink-0 hidden lg:block">
              <div className="text-white font-bold text-sm">{t("donate.title", "تبرع السريع", "Quick Donate", "Don Rapide", "Hızlı Bağış")}</div>
              <div className="text-white/60 text-xs">{t("donate.secure", "معاملات مشفرة وآمنة", "100% Secure & Encrypted", "Sécurisé & Chiffré", "Güvenli ve Şifreli")}</div>
            </div>

            {/* Frequency Toggle */}
            <div className="flex bg-white/15 p-1 rounded-xl border border-white/15 shrink-0">
              {(["ONE_TIME", "MONTHLY"] as const).map(f => (
                <button key={f} onClick={() => setFreq(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    freq === f ? "bg-white shadow-sm" : "text-white/80 hover:text-white"
                  }`}
                  style={{ color: freq === f ? primary : undefined }}>
                  {f === "ONE_TIME"
                    ? t("donate.one_time", "مرة واحدة", "One-time", "Unique", "Tek")
                    : t("donate.monthly", "شهري", "Monthly", "Mensuel", "Aylık")}
                </button>
              ))}
            </div>

            {/* Quick Amounts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {QUICK_AMOUNTS.map(a => (
                <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    final === a && !custom
                      ? "bg-white shadow-md"
                      : "bg-white/15 text-white hover:bg-white/25 border border-white/15"
                  }`}
                  style={{ color: final === a && !custom ? primary : undefined }}>
                  ${a}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="relative shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-xs font-bold">$</span>
              <input
                type="number" min={1} value={custom}
                onChange={e => setCustom(e.target.value)}
                placeholder={t("donate.custom", "مبلغ آخر", "Other", "Autre", "Diğer")}
                className="w-24 rounded-xl py-1.5 pl-6 pr-3 text-xs text-white bg-white/15 border border-white/20 focus:outline-none focus:border-white/50 transition placeholder-white/50"
              />
            </div>

            {/* Donate CTA Button */}
            <button
              onClick={() => { setShowDetails(v => !v); setPayError(""); }}
              disabled={!final || final <= 0}
              className="flex items-center gap-2 font-bold rounded-xl px-6 py-2 text-xs text-white transition-all hover:opacity-90 disabled:opacity-50 shrink-0 ms-auto shadow-md"
              style={{ background: accent }}>
              <Icon name="heart" size={14} />
              {t("donate.title", "تبرع بـ", "Donate", "Faire un Don", "Bağış")} ${final}
              {freq === "MONTHLY" && <span className="opacity-75 text-[10px]">/{t("donate.monthly", "شهر", "mo", "mois", "ay")}</span>}
            </button>
          </div>

          {/* Details Panel */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-white/15 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-end">
                <div className="flex-1 min-w-48">
                  <label className="block text-white/80 text-xs font-medium mb-1">
                    {t("donate.name", "الاسم الكامل", "Full Name", "Nom Complet", "Ad Soyad")}
                  </label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder={t("donate.name", "الاسم الكامل", "Full Name", "Nom Complet", "Ad Soyad")}
                    className="w-full rounded-xl py-2 px-3 text-xs text-white bg-white/15 border border-white/20 focus:outline-none focus:border-white/50" />
                </div>
                <div className="flex-1 min-w-48">
                  <label className="block text-white/80 text-xs font-medium mb-1">
                    {t("donate.email", "البريد الإلكتروني", "Email", "Email", "E-posta")}
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl py-2 px-3 text-xs text-white bg-white/15 border border-white/20 focus:outline-none focus:border-white/50" />
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  <button onClick={() => pay("stripe")} disabled={!!loading}
                    className="flex items-center gap-1.5 font-bold rounded-xl px-4 py-2 text-xs bg-white transition hover:bg-slate-100 disabled:opacity-60 shadow-sm"
                    style={{ color: primary }}>
                    {loading === "stripe" ? "..." : <><Icon name="wallet" size={14} /> {t("donate.pay_card", "بطاقة", "Card", "Carte", "Kart")}</>}
                  </button>
                  <button onClick={() => pay("paypal")} disabled={!!loading}
                    className="flex items-center gap-1.5 font-bold rounded-xl px-4 py-2 text-xs bg-[#FFC439] text-[#003087] transition hover:bg-[#ffcd54] disabled:opacity-60">
                    {loading === "paypal" ? "..." : "PayPal"}
                  </button>
                  <button
                    onClick={() => {
                      if (!final || final <= 0) return;
                      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
                      const exists = cart.findIndex((i: any) => i.slug === "__general__") >= 0;
                      if (!exists) cart.push({ slug: "__general__", title: t("donate.title", "تبرع عام", "General Donation", "Don Général", "Genel Bağış"), amount: final, frequency: freq === "ONE_TIME" ? "one_time" : "monthly", campaignId: null });
                      sessionStorage.setItem("cart", JSON.stringify(cart));
                      window.dispatchEvent(new Event("storage"));
                      setCartAdded(true);
                      setTimeout(() => setCartAdded(false), 2000);
                    }}
                    className="flex items-center gap-1.5 font-bold rounded-xl px-4 py-2 text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 transition">
                    <Icon name="layers" size={14} /> {t("add_to_cart", "السلة", "Cart", "Panier", "Sepet")}
                  </button>
                </div>
              </div>
              {payError && <p className="text-red-200 text-xs mt-2 font-medium">{payError}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}