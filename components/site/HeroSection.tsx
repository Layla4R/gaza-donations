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
  data?: any; // <--- تمت الإضافة
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

export default function HeroSection({ locale, dict, heroImage, heroSlides, accentColor, primaryColor }: Props) {
  const accent = accentColor || "#F00F5A";
  const primary = primaryColor || "#0069D2";
  const p = locale === "ar" ? "" : `/${locale}`;
  const slides = (heroSlides && heroSlides.length > 0) ? heroSlides : DEFAULT_SLIDES;
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
  // Auto-advance every 6 seconds — pause on hover
  useEffect(() => {
    if (slides.length <= 1 || hovered) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length, hovered]);

  const slide = slides[current];
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
    <section onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="relative flex flex-col overflow-hidden -mt-20" style={{ minHeight: "100vh" }}>
      {/* ── Slider Background ── */}
      {slides.map((sl, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current && !animating ? 1 : 0, zIndex: 0 }}>
          <img
            src={sl.image}
            alt=""
            aria-hidden
            className="w-full h-full object-cover object-center"
            loading={i === 0 ? "eager" : "lazy"}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
        </div>
      ))}

      {/* Ambient blobs */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none z-[1]" />
      <div className="absolute bottom-1/3 -left-32 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none z-[1]" />

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-screen-xl mx-auto px-6 w-full py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-block w-10 h-px bg-white/40" />
              <span className="text-white/65 font-semibold text-xs tracking-[0.4em] uppercase">
                {t("hero.eyebrow", "مؤسسة 4Relief الإنسانية", "4Relief Humanitarian Foundation", "Fondation Humanitaire 4Relief", "4Relief İnsani Yardım Vakfı")}
              </span>
            </div>

            <h1 className="font-display font-extrabold leading-[1.05] text-white mb-5 drop-shadow-lg"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}>
              {(slide as any)[`title_${locKey}`] || slide.title_ar}
            </h1>

            <p className="text-white leading-relaxed mb-9 max-w-lg" style={{ fontSize: "clamp(1rem, 1.8vw, 1.2rem)" }}>
              {(slide as any)[`subtitle_${locKey}`] || slide.subtitle_ar}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href={`${p}/donate`}
                className="inline-flex items-center gap-2.5 font-bold rounded-2xl px-8 py-4 shadow-xl transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, color: "white", fontSize: "1rem", boxShadow: `0 8px 24px ${accent}55` }}>
                <Icon name="heart" size={20} />
                {t("hero.cta_donate", "تبرع الآن", "Donate Now", "Faire un Don", "Bağış Yap")}
              </Link>
              <Link href={`${p}/campaigns`}
                className="inline-flex items-center gap-2 font-bold rounded-2xl px-8 py-4 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                style={{ border: "2px solid rgba(255,255,255,0.45)", color: "white", fontSize: "1rem" }}>
                {t("hero.cta_campaigns", "تصفح الحملات", "Browse Campaigns", "Voir les Campagnes", "Kampanyaları İncele")}
                <span className="opacity-60">←</span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {[
                { icon: "shield-check" as const, ar: "دفع 100% آمن",         en: "100% Secure",     fr: "100% Sécurisé",  tr: "100% Güvenli" },
                { icon: "hand-heart"   as const, ar: "أثر مباشر وشفاف",      en: "Direct Impact",   fr: "Impact Direct",  tr: "Doğrudan Etki" },
                { icon: "globe"        as const, ar: "دعم موثوق حول العالم", en: "Verified Global", fr: "Mondial Vérifié", tr: "Küresel Destek" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: 600 }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <Icon name={item.icon} size={14} className="text-white/75" />
                  </div>
                  {t(`hero.trust${i}`, item.ar, item.en, item.fr, item.tr)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Slider Controls ── */}
      {slides.length > 1 && (
        <>
          {/* Prev/Next arrows */}
          <button onClick={prev} aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition">
            <span className="text-xl leading-none">›</span>
          </button>
          <button onClick={next} aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition">
            <span className="text-xl leading-none">‹</span>
          </button>

          {/* Dots */}
          <div className="absolute bottom-[160px] left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} aria-current={i === current ? "true" : undefined}
                className={`transition-all rounded-full ${i === current ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/65"}`} />
            ))}
          </div>
        </>
      )}

      {/* ── Quick Donate Bar ── */}
      <div className="relative z-10 w-full" style={{ background: "rgba(0,57,135,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
        <div className="max-w-screen-xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-4">

            <div className="shrink-0 hidden lg:block">
              <div className="text-white font-bold text-sm">{t("donate.title", "تبرع الآن", "Donate Now", "Faire un Don", "Bağış Yap")}</div>
              <div className="text-white/45 text-xs mt-0.5">{t("donate.secure", "جميع المعاملات مشفرة وآمنة", "Secure & Encrypted", "Sécurisé & Chiffré", "Güvenli ve Şifreli")}</div>
            </div>

            <div className="w-px h-10 bg-white/15 hidden lg:block shrink-0" />

            {/* Frequency */}
            <div className="flex rounded-xl overflow-hidden shrink-0" style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              {(["ONE_TIME", "MONTHLY"] as const).map(f => (
                <button key={f} onClick={() => setFreq(f)}
                  className="px-4 py-2 text-xs font-bold transition"
                  style={{
                    background: freq === f ? "rgba(255,255,255,0.9)" : "transparent",
                    color: freq === f ? "#0057C2" : "rgba(255,255,255,0.65)",
                  }}>
                  {f === "ONE_TIME"
                    ? t("donate.one_time", "مرة واحدة", "One-time", "Unique", "Tek")
                    : t("donate.monthly", "شهري", "Monthly", "Mensuel", "Aylık")}
                </button>
              ))}
            </div>

            {/* Amounts */}
            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible scrollbar-none">
              {QUICK_AMOUNTS.map(a => (
                <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                  className="px-4 py-2 rounded-xl text-sm font-bold transition hover:-translate-y-0.5"
                  style={{
                    background: final === a && !custom ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.12)",
                    color: final === a && !custom ? "#0057C2" : "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>
                  ${a}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="relative shrink-0">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-sm font-bold pointer-events-none">$</span>
              <input
                type="number" min={1} value={custom}
                onChange={e => setCustom(e.target.value)}
                placeholder={t("donate.custom", "مبلغ آخر", "Other", "Autre", "Diğer")}
                className="w-28 rounded-xl py-2 pr-7 pl-3 text-sm text-white font-semibold placeholder-white/35 focus:outline-none transition"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}
              />
            </div>

            {/* Donate button */}
            <button
              onClick={() => { setShowDetails(v => !v); setPayError(""); }}
              disabled={!final || final <= 0}
              className="flex items-center gap-2 font-bold rounded-xl px-6 py-2.5 text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 shrink-0 ms-auto"
              style={{ background: `linear-gradient(135deg,${accent},${accent}cc)`, color: "white", boxShadow: `0 4px 16px ${accent}55` }}>
              <Icon name="heart" size={16} />
              {t("donate.title", "تبرع بـ", "Donate", "Faire un Don", "Bağış")} ${final}
              {freq === "MONTHLY" && <span className="opacity-65 font-normal text-xs">/{t("donate.monthly", "شهر", "mo", "mois", "ay")}</span>}
            </button>
          </div>

          {/* Details panel */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-white/15">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-end">
                <div className="flex-1 min-w-48">
                  <label className="block text-white/60 text-xs font-semibold mb-1.5">
                    {t("donate.name", "الاسم الكامل", "Full Name", "Nom Complet", "Ad Soyad")}
                  </label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder={t("donate.name", "الاسم الكامل", "Full Name", "Nom Complet", "Ad Soyad")}
                    className="w-full rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }} />
                </div>
                <div className="flex-1 min-w-48">
                  <label className="block text-white/60 text-xs font-semibold mb-1.5">
                    {t("donate.email", "البريد الإلكتروني", "Email", "Email", "E-posta")}
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full rounded-xl py-2.5 px-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }} />
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  <button onClick={() => pay("stripe")} disabled={!!loading}
                    className="flex items-center gap-2 font-bold rounded-xl px-5 py-2.5 text-sm transition disabled:opacity-60"
                    style={{ background: "rgba(255,255,255,0.95)", color: "#0057C2" }}>
                    {loading === "stripe" ? "..." : <><Icon name="wallet" size={15} /> {t("donate.pay_card", "بطاقة", "Card", "Carte", "Kart")}</>}
                  </button>
                  <button onClick={() => pay("paypal")} disabled={!!loading}
                    className="flex items-center gap-2 font-bold rounded-xl px-5 py-2.5 text-sm transition disabled:opacity-60"
                    style={{ background: "#FFC439", color: "#003087" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#003087"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                    {loading === "paypal" ? "..." : "PayPal"}
                  </button>
                  {/* Fix 37: Add to cart from Hero */}
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
                    className="flex items-center gap-2 font-bold rounded-xl px-4 py-2.5 text-sm transition"
                    style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
                    <Icon name="layers" size={14} /> {t("add_to_cart", "السلة", "Cart", "Panier", "Sepet")}
                  </button>
                </div>
              </div>
              {payError && <p className="text-red-300 text-xs mt-2 font-semibold">{payError}</p>}
            </div>
          )}
        </div>
      </div>

      {/* ── Achievements Strip ── */}
      <div className="relative z-10 w-full bg-white border-t border-line">
        <div className="max-w-screen-xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-line">
            {[
              { value: "12,500+", icon: "heart"        as const, ar: "أسرة مستفيدة",          en: "Families Helped",         fr: "Familles Aidées",       tr: "Yardım Edilen Aile",   color: "#F00F5A" },
              { value: "$2.8M+", icon: "hand-heart"    as const, ar: "إجمالي التبرعات",        en: "Total Donations",         fr: "Total des Dons",        tr: "Toplam Bağış",         color: "#0069D2" },
              { value: "18",     icon: "globe"         as const, ar: "دولة نصل إليها",          en: "Countries Reached",       fr: "Pays Touchés",          tr: "Ulaşılan Ülke",        color: "#7C3AED" },
              { value: "98%",   icon: "shield-check"  as const, ar: "للمستفيدين مباشرة",       en: "Goes to Beneficiaries",   fr: "Aux Bénéficiaires",     tr: "Yararlanıcılara",      color: "#059669" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 sm:px-6 first:sm:ps-0 last:sm:pe-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${item.color}18` }}>
                  <Icon name={item.icon} size={18} style={{ color: item.color } as any} />
                </div>
                <div>
                  <div className="font-display font-extrabold text-lg text-ink leading-tight" style={{ color: item.color }}>{item.value}</div>
                  <div className="text-xs text-muted font-semibold leading-tight">
                    {locale === "ar" ? item.ar : locale === "fr" ? item.fr : locale === "tr" ? item.tr : item.en}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
