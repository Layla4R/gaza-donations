"use client";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import Link from "next/link";
import Image from "next/image";

import Icon from "@/components/icons";

interface Slide {
  image: string;

  title_ar: string;
  title_en: string;
  title_fr: string;
  title_tr: string;

  subtitle_ar: string;
  subtitle_en: string;
  subtitle_fr: string;
  subtitle_tr: string;
}

interface Props {
  locale: string;
  dict: Record<string, string>;

  heroImage?: string | null;
  heroSlides?: Slide[] | null;

  accentColor?: string | null;
  primaryColor?: string | null;

  data?: any;
  isDestekol?: boolean;
}

const QUICK_AMOUNTS = [10, 25, 50, 100, 250];

const DEFAULT_SLIDES: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80",

    title_ar: "معاً نصنع الأمل",
    title_en: "Together We Create Hope",
    title_fr: "Ensemble Nous Créons l'Espoir",
    title_tr: "Birlikte Umut Yaratıyoruz",

    subtitle_ar:
      "منصة تبرعات شفافة وآمنة لدعم الأسر المحتاجة حول العالم.",
    subtitle_en:
      "A transparent and secure platform supporting families in need worldwide.",
    subtitle_fr:
      "Une plateforme de dons transparente pour soutenir les familles dans le besoin.",
    subtitle_tr:
      "Dünya genelinde ihtiyaç sahibi aileleri destekleyen şeffaf bağış platformu.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1920&q=80",

    title_ar: "يدٌ تمتد لكل محتاج",
    title_en: "A Hand for Every Person in Need",
    title_fr:
      "Une Main Tendue à Chaque Personne dans le Besoin",
    title_tr:
      "İhtiyaç Sahibi Herkes İçin Bir El",

    subtitle_ar:
      "تبرعك يصل مباشرة للمستحقين دون وسيط بشفافية كاملة.",
    subtitle_en:
      "Your donation reaches beneficiaries directly with full transparency.",
    subtitle_fr:
      "Votre don parvient directement aux bénéficiaires avec une transparence totale.",
    subtitle_tr:
      "Bağışınız, tam şeffaflıkla doğrudan yararlanıcılara ulaşır.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80",

    title_ar: "كل دولار يغير حياة",
    title_en: "Every Dollar Changes a Life",
    title_fr: "Chaque Euro Change une Vie",
    title_tr: "Her Dolar Bir Hayat Değiştirir",

    subtitle_ar:
      "من الغذاء والمأوى إلى التعليم والرعاية الصحية — معك نصنع الفرق.",
    subtitle_en:
      "From food and shelter to education and healthcare — together we make a difference.",
    subtitle_fr:
      "De la nourriture à l'éducation — ensemble nous faisons la différence.",
    subtitle_tr:
      "Gıdadan eğitime kadar — birlikte fark yaratıyoruz.",
  },
];

export default function HeroSection({
  locale,
  dict,
  heroImage,
  heroSlides,
  accentColor,
  primaryColor,
  data,
  isDestekol: isDestekolProp,
}: Props) {
  const [isDestekol, setIsDestekol] = useState(false);

  useEffect(() => {
    if (typeof isDestekolProp === "boolean") {
      setIsDestekol(isDestekolProp);
    } else if (typeof window !== "undefined" && window.location.hostname.includes("destekol")) {
      setIsDestekol(true);
    }
  }, [isDestekolProp]);

  const accent = accentColor || "#F00F5A";
  const primary = primaryColor || "#0069D2";

  const prefix =
    locale === "ar" ? "" : `/${locale}`;

  /*
   * Admin slides
   */
  const adminSlides = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.slides)
      ? data.slides
      : [];

  const slides: Slide[] =
    adminSlides.length > 0
      ? adminSlides
          .map((slide: any) => ({
            image:
              slide?.image ||
              slide?.backgroundImage ||
              slide?.photo ||
              heroImage ||
              "",

            title_ar:
              slide?.title_ar ||
              slide?.title ||
              slide?.headline ||
              "",

            title_en:
              slide?.title_en ||
              slide?.title ||
              slide?.headline ||
              "",

            title_fr:
              slide?.title_fr ||
              slide?.title ||
              slide?.headline ||
              "",

            title_tr:
              slide?.title_tr ||
              slide?.title ||
              slide?.headline ||
              "",

            subtitle_ar:
              slide?.subtitle_ar ||
              slide?.subtitle ||
              slide?.subheading ||
              slide?.description ||
              "",

            subtitle_en:
              slide?.subtitle_en ||
              slide?.subtitle ||
              slide?.subheading ||
              slide?.description ||
              "",

            subtitle_fr:
              slide?.subtitle_fr ||
              slide?.subtitle ||
              slide?.subheading ||
              slide?.description ||
              "",

            subtitle_tr:
              slide?.subtitle_tr ||
              slide?.subtitle ||
              slide?.subheading ||
              slide?.description ||
              "",
          }))
          .filter((slide: Slide) => slide.image)
      : heroSlides && heroSlides.length > 0
        ? heroSlides
        : heroImage
          ? [
              {
                ...DEFAULT_SLIDES[0],
                image: heroImage,
              },
            ]
          : DEFAULT_SLIDES;

  const [current, setCurrent] =
    useState(0);

  const [animating, setAnimating] =
    useState(false);

  const [hovered, setHovered] =
    useState(false);

  const [amount, setAmount] =
    useState(25);

  const [custom, setCustom] =
    useState("");

  const [freq, setFreq] =
    useState<"ONE_TIME" | "MONTHLY">(
      "ONE_TIME"
    );

  const [loading, setLoading] =
    useState<"stripe" | "paypal" | false>(
      false
    );

  const [showDetails, setShowDetails] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [payError, setPayError] =
    useState("");

  const [cartAdded, setCartAdded] =
    useState(false);

  const final =
    custom !== ""
      ? Math.max(1, Number(custom) || 1)
      : amount;

  const t = (
    key: string,
    ar: string,
    en: string,
    fr: string,
    tr: string
  ) => {
    return (
      dict[key] ||
      (locale === "ar"
        ? ar
        : locale === "fr"
          ? fr
          : locale === "tr"
            ? tr
            : en)
    );
  };

  /*
   * Reset current slide if data changes.
   */
  useEffect(() => {
    setCurrent((value) =>
      Math.min(value, Math.max(0, slides.length - 1))
    );
  }, [slides.length]);

  const goTo = useCallback(
    (index: number) => {
      if (
        animating ||
        slides.length <= 1 ||
        index === current
      ) {
        return;
      }

      const safeIndex =
        Math.max(
          0,
          Math.min(index, slides.length - 1)
        );

      setAnimating(true);

      setTimeout(() => {
        setCurrent(safeIndex);
        setAnimating(false);
      }, 400);
    },
    [animating, current, slides.length]
  );

  const next = useCallback(() => {
    if (slides.length <= 1) return;

    goTo(
      (current + 1) %
        slides.length
    );
  }, [
    current,
    slides.length,
    goTo,
  ]);

  useEffect(() => {
    if (
      slides.length <= 1 ||
      hovered ||
      showDetails
    ) {
      return;
    }

    const timer =
      window.setInterval(next, 6000);

    return () =>
      window.clearInterval(timer);
  }, [
    next,
    slides.length,
    hovered,
    showDetails,
  ]);

  const slide =
    slides[current] || slides[0];

  const locKey =
    locale === "ar"
      ? "ar"
      : locale === "fr"
        ? "fr"
        : locale === "tr"
          ? "tr"
          : "en";

  async function pay(
    provider: "stripe" | "paypal"
  ) {
    if (!name.trim() || !email.trim()) {
      setPayError(
        t(
          "donate.name",
          "الاسم والبريد مطلوبان",
          "Name and email required",
          "Nom et email requis",
          "Ad ve e-posta gerekli"
        )
      );
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      setPayError(
        t(
          "cart.invalid_email",
          "بريد إلكتروني غير صحيح",
          "Invalid email address",
          "Email invalide",
          "Geçersiz e-posta"
        )
      );
      return;
    }

    setLoading(provider);
    setPayError("");

    try {
      const endpoint =
        provider === "stripe"
          ? "/api/donations/checkout"
          : "/api/donations/paypal";

      const res = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            amount: final,
            frequency: freq,
            donorName: name.trim(),
            donorEmail: email.trim(),
          }),
        }
      );

      const d = await res.json();

      if (d?.url) {
        window.location.href =
          d.url;
        return;
      }

      setPayError(
        d?.error ||
          t(
            "common.error",
            "حدث خطأ",
            "An error occurred",
            "Une erreur s'est produite",
            "Bir hata oluştu"
          )
      );
    } catch {
      setPayError(
        t(
          "common.error",
          "حدث خطأ",
          "An error occurred",
          "Une erreur s'est produite",
          "Bir hata oluştu"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    if (!final || final <= 0) return;

    try {
      const cart = JSON.parse(
        sessionStorage.getItem("cart") ||
          "[]"
      );

      const existingIndex =
        cart.findIndex(
          (item: any) =>
            item.slug === "__general__"
        );

      const item = {
        slug: "__general__",
        title: t(
          "donate.title",
          "تبرع عام",
          "General Donation",
          "Don Général",
          "Genel Bağış"
        ),
        amount: final,
        frequency:
          freq === "ONE_TIME"
            ? "one_time"
            : "monthly",
        campaignId: null,
      };

      if (existingIndex >= 0) {
        cart[existingIndex] = item;
      } else {
        cart.push(item);
      }

      sessionStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new Event("storage")
      );

      setCartAdded(true);

      window.setTimeout(
        () => setCartAdded(false),
        2000
      );
    } catch {
      setPayError(
        t(
          "common.error",
          "حدث خطأ",
          "An error occurred",
          "Une erreur s'est produite",
          "Bir hata oluştu"
        )
      );
    }
  }

  if (!slide) {
    return null;
  }

  return (
    <section
      onMouseEnter={() =>
        setHovered(true)
      }
      onMouseLeave={() =>
        setHovered(false)
      }
      className="relative flex min-h-[85vh] flex-col justify-between overflow-hidden bg-slate-900 -mt-20 pt-20 lg:min-h-[90vh]"
    >
      {/* Background Slides */}

      {slides.map(
        (sl, index) => (
          <div
            key={`${sl.image}-${index}`}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity:
                index === current &&
                !animating
                  ? 1
                  : 0,
              zIndex: 0,
            }}
          >
            <Image
              src={sl.image}
              alt={
                sl[
                  `title_${locKey}` as keyof Slide
                ] ||
                sl.title_ar ||
                "Hero"
              }
              fill
              priority={index === 0}
              sizes="100vw"
              quality={75}
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
          </div>
        )
      )}

      {/* Decorative Effect */}

      <div className="pointer-events-none absolute top-1/4 -right-20 z-[1] h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      {/* Main Content */}

      <div className="relative z-10 flex flex-1 items-center py-12 lg:py-16">
        <div className="mx-auto w-full max-w-screen-xl px-6">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-md">
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{
                  backgroundColor: accent,
                }}
              />

              <span className="text-xs font-medium uppercase tracking-wider text-white/90">
                {t(
                  "hero.eyebrow",
                  isDestekol ? "مؤسسة Destekol الإنسانية" : "مؤسسة 4Relief الإنسانية",
                  isDestekol ? "Destekol Humanitarian Foundation" : "4Relief Humanitarian Foundation",
                  isDestekol ? "Fondation Humanitaire Destekol" : "Fondation Humanitaire 4Relief",
                  isDestekol ? "Destekol İnsani Yardım Vakfı" : "4Relief İnsani Yardım Vakfı"
                )}
              </span>
            </div>

            <h1
              className="mb-6 font-display font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-md"
              style={{
                fontSize:
                  "clamp(2.2rem, 5vw, 4.2rem)",
              }}
            >
              {slide[
                `title_${locKey}` as keyof Slide
              ] || slide.title_ar}
            </h1>

            <p
              className="mb-8 max-w-xl font-normal leading-relaxed text-white/85"
              style={{
                fontSize:
                  "clamp(0.95rem, 1.4vw, 1.1rem)",
              }}
            >
              {slide[
                `subtitle_${locKey}` as keyof Slide
              ] || slide.subtitle_ar}
            </p>

            <div className="mb-10 flex flex-wrap items-center gap-4">
              <Link
                href={`${prefix}/donate`}
                className="inline-flex items-center gap-2.5 rounded-2xl px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                style={{
                  background: accent,
                }}
              >
                <Icon
                  name="heart"
                  size={18}
                />

                {t(
                  "hero.cta_donate",
                  "تبرع الآن",
                  "Donate Now",
                  "Faire un Don",
                  "Bağış Yap"
                )}
              </Link>

              <Link
                href={`${prefix}/projects`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-white/20"
              >
                {t(
                   "hero.cta_projects",
                   "استعرض مشاريعنا",
                   "Browse Our Projects",
                   "Découvrez Nos Projets",
                   "Projelerimizi İnceleyin")}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-2">
              {[
                {
                  icon: "shield-check" as const,
                  ar: "دفع 100% آمن",
                  en: "100% Secure",
                  fr: "100% Sécurisé",
                  tr: "100% Güvenli",
                },
                {
                  icon: "hand-heart" as const,
                  ar: "أثر مباشر وشفاف",
                  en: "Direct Impact",
                  fr: "Impact Direct",
                  tr: "Doğrudan Etki",
                },
                {
                  icon: "globe" as const,
                  ar: "دعم موثوق حول العالم",
                  en: "Verified Global",
                  fr: "Mondial Vérifié",
                  tr: "Küresel Destek",
                },
              ].map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs font-medium text-white/75"
                  >
                    <Icon
                      name={item.icon}
                      size={15}
                      className="text-white/90"
                    />

                    {t(
                      `hero.trust${index}`,
                      item.ar,
                      item.en,
                      item.fr,
                      item.tr
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}

      {slides.length > 1 && (
        <div className="absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 md:flex">
          {slides.map(
            (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  goTo(index)
                }
                aria-label={`Go to slide ${index + 1}`}
                aria-current={
                  index === current
                    ? "true"
                    : undefined
                }
                className={`rounded-full transition-all ${
                  index === current
                    ? "h-6 w-2 bg-white"
                    : "h-2 w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            )
          )}
        </div>
      )}

      {/* Quick Donation */}

      <div
        className="relative z-20 w-full border-t border-white/15 shadow-2xl backdrop-blur-xl"
        style={{
          backgroundColor: primary,
        }}
      >
        <div className="mx-auto max-w-screen-xl px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="hidden shrink-0 lg:block">
              <div className="text-sm font-bold text-white">
                {t(
                  "donate.title",
                  "التبرع السريع",
                  "Quick Donate",
                  "Don Rapide",
                  "Hızlı Bağış"
                )}
              </div>

              <div className="text-xs text-white/80">
                {t(
                  "donate.secure",
                  "معاملات مشفرة وآمنة",
                  "100% Secure & Encrypted",
                  "Sécurisé & Chiffré",
                  "Güvenli ve Şifreli"
                )}
              </div>
            </div>

            {/* Frequency */}

            <div className="flex shrink-0 rounded-xl border border-white/15 bg-white/15 p-1">
              {(
                [
                  "ONE_TIME",
                  "MONTHLY",
                ] as const
              ).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFreq(value)
                  }
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                    freq === value
                      ? "bg-white shadow-sm"
                      : "text-white/80 hover:text-white"
                  }`}
                  style={{
                    color:
                      freq === value
                        ? primary
                        : undefined,
                  }}
                >
                  {value ===
                  "ONE_TIME"
                    ? t(
                        "donate.one_time",
                        "مرة واحدة",
                        "One-time",
                        "Unique",
                        "Tek"
                      )
                    : t(
                        "donate.monthly",
                        "شهري",
                        "Monthly",
                        "Mensuel",
                        "Aylık"
                      )}
                </button>
              ))}
            </div>

            {/* Amounts */}

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {QUICK_AMOUNTS.map(
                (value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setAmount(value);
                      setCustom("");
                    }}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      final === value &&
                      !custom
                        ? "bg-white shadow-md"
                        : "border border-white/15 bg-white/15 text-white hover:bg-white/25"
                    }`}
                    style={{
                      color:
                        final === value &&
                        !custom
                          ? primary
                          : undefined,
                    }}
                  >
                    ${value}
                  </button>
                )
              )}
            </div>

            {/* Custom */}

            <div className="relative shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/80">
                $
              </span>

              <input
                type="number"
                min={1}
                value={custom}
                onChange={(e) =>
                  setCustom(
                    e.target.value
                  )
                }
                aria-label="Custom Donation Amount"
                placeholder={t(
                  "donate.custom",
                  "مبلغ آخر",
                  "Other",
                  "Autre",
                  "Diğer"
                )}
                className="w-24 rounded-xl border border-white/20 bg-white/15 py-1.5 pl-6 pr-3 text-xs text-white placeholder-white/50 transition focus:border-white/50 focus:outline-none"
              />
            </div>

            {/* CTA */}

            <button
              type="button"
              onClick={() => {
                setShowDetails(
                  (value) => !value
                );
                setPayError("");
              }}
              disabled={
                !final || final <= 0
              }
              className="ms-auto flex shrink-0 items-center gap-2 rounded-xl px-6 py-2 text-xs font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50"
              style={{
                background: accent,
              }}
            >
              <Icon
                name="heart"
                size={14}
              />

              {t(
                "donate.title",
                "تبرع بـ",
                "Donate",
                "Faire un Don",
                "Bağış"
              )}{" "}
              ${final}

              {freq ===
                "MONTHLY" && (
                <span className="text-[10px] opacity-75">
                  /
                  {t(
                    "donate.monthly",
                    "شهر",
                    "mo",
                    "mois",
                    "ay"
                  )}
                </span>
              )}
            </button>
          </div>

          {/* Details */}

          {showDetails && (
            <div className="mt-4 animate-fadeIn border-t border-white/15 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                <div className="min-w-48 flex-1">
                  <label
                    htmlFor="donor-full-name"
                    className="mb-1 block text-xs font-medium text-white/80"
                  >
                    {t(
                      "donate.name",
                      "الاسم الكامل",
                      "Full Name",
                      "Nom Complet",
                      "Ad Soyad"
                    )}
                  </label>

                  <input
                    id="donor-full-name"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-xs text-white focus:border-white/50 focus:outline-none"
                  />
                </div>

                <div className="min-w-48 flex-1">
                  <label
                    htmlFor="donor-email"
                    className="mb-1 block text-xs font-medium text-white/80"
                  >
                    {t(
                      "donate.email",
                      "البريد الإلكتروني",
                      "Email",
                      "Email",
                      "E-posta"
                    )}
                  </label>

                  <input
                    id="donor-email"
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="email@example.com"
                    className="w-full rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-xs text-white focus:border-white/50 focus:outline-none"
                  />
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      pay("stripe")
                    }
                    disabled={!!loading}
                    className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 text-xs font-bold shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
                    style={{
                      color: primary,
                    }}
                  >
                    {loading ===
                    "stripe" ? (
                      "..."
                    ) : (
                      <>
                        <Icon
                          name="wallet"
                          size={14}
                        />

                        {t(
                          "donate.pay_card",
                          "بطاقة",
                          "Card",
                          "Carte",
                          "Kart"
                        )}
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      pay("paypal")
                    }
                    disabled={!!loading}
                    className="flex items-center gap-1.5 rounded-xl bg-[#FFC439] px-4 py-2 text-xs font-bold text-[#003087] transition hover:bg-[#ffcd54] disabled:opacity-60"
                  >
                    {loading ===
                    "paypal"
                      ? "..."
                      : "PayPal"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleAddToCart
                    }
                    className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition ${
                      cartAdded
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                        : "border-white/20 bg-white/15 text-white hover:bg-white/25"
                    }`}
                  >
                    <Icon
                      name={
                        cartAdded
                          ? "check"
                          : "layers"
                      }
                      size={14}
                    />

                    {cartAdded
                      ? t(
                          "added",
                          "أُضيف ✓",
                          "Added ✓",
                          "Ajouté ✓",
                          "Eklendi ✓"
                        )
                      : t(
                          "add_to_cart",
                          "السلة",
                          "Cart",
                          "Panier",
                          "Sepet"
                        )}
                  </button>
                </div>
              </div>

              {payError && (
                <p className="mt-2 text-xs font-medium text-red-200">
                  {payError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}