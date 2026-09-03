"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/icons";

interface NavItem {
  slug: string;
  title: string;
}

const LEGAL_SLUGS: Array<{
  slug: string;
  key: string;
  fallbacks: Record<string, string>;
}> = [
  {
    slug: "privacy",
    key: "legal.privacy",
    fallbacks: {
      ar: "سياسة الخصوصية",
      en: "Privacy Policy",
      fr: "Politique de Confidentialité",
      tr: "Gizlilik Politikası",
    },
  },
  {
    slug: "terms",
    key: "legal.terms",
    fallbacks: {
      ar: "الشروط والأحكام",
      en: "Terms & Conditions",
      fr: "Conditions d'Utilisation",
      tr: "Kullanım Koşulları",
    },
  },
  {
    slug: "refund-policy",
    key: "legal.refund_policy",
    fallbacks: {
      ar: "سياسة الاسترداد",
      en: "Refund Policy",
      fr: "Politique de Remboursement",
      tr: "İade Politikası",
    },
  },
  {
    slug: "cookie-policy",
    key: "legal.cookie_policy",
    fallbacks: {
      ar: "سياسة ملفات تعريف الارتباط",
      en: "Cookie Policy",
      fr: "Politique des Cookies",
      tr: "Çerez Politikası",
    },
  },
  {
    slug: "aml-policy",
    key: "legal.aml_policy",
    fallbacks: {
      ar: "مكافحة غسيل الأموال",
      en: "AML Policy",
      fr: "Politique Anti-Blanchiment",
      tr: "Kara Para Aklamayla Mücadele",
    },
  },
  {
    slug: "complaints",
    key: "legal.complaints",
    fallbacks: {
      ar: "سياسة الشكاوى",
      en: "Complaints Policy",
      fr: "Politique de Réclamations",
      tr: "Şikayet Politikası",
    },
  },
  {
    slug: "financial-transparency",
    key: "legal.financial_transparency",
    fallbacks: {
      ar: "الشفافية المالية",
      en: "Financial Transparency",
      fr: "Transparence Financière",
      tr: "Mali Şeffaflık",
    },
  },
  {
    slug: "how-we-use-donations",
    key: "legal.how_we_use_donations",
    fallbacks: {
      ar: "كيف نستخدم التبرعات",
      en: "How We Use Donations",
      fr: "Comment Nous Utilisons les Dons",
      tr: "Bağışları Nasıl Kullanıyoruz",
    },
  },
];

const SOCIAL_ICONS: Record<string, { icon: string; label: string }> = {
  facebookUrl: { icon: "facebook", label: "Facebook" },
  twitterUrl: { icon: "twitter", label: "Twitter" },
  instagramUrl: { icon: "instagram", label: "Instagram" },
  youtubeUrl: { icon: "youtube", label: "YouTube" },
  linkedinUrl: { icon: "linkedin", label: "LinkedIn" },
  tiktokUrl: { icon: "tiktok", label: "TikTok" },
};

export default function SiteFooter({
  navItems = [],
  settings = {},
  locale = "ar",
  dict = {},
}: {
  navItems?: NavItem[];
  settings?: any;
  locale?: string;
  dict?: Record<string, string>;
}) {
  const [isDestekol, setIsDestekol] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname.includes("destekol")
    ) {
      setIsDestekol(true);
    }
  }, []);

  const p = locale === "ar" ? "" : `/${locale}`;
  const loc: "ar" | "en" | "fr" | "tr" = ["ar", "en", "fr", "tr"].includes(locale)
    ? (locale as any)
    : "ar";

  const d = (key: string, fallbacks: Record<string, string> = {}) =>
    (dict && dict[key]) || fallbacks[loc] || fallbacks["en"] || "";

  const socialLinks = Object.entries(SOCIAL_ICONS)
    .filter(([key]) => settings?.[key])
    .map(([key, meta]) => ({ url: settings[key] as string, ...meta }));

  const logoSrc = isDestekol
    ? "/brand/destekol_logo.png"
    : settings?.logoImage || "/brand/logo-horizontal-transparent.png";

  const logoText = isDestekol ? "Destekol" : settings?.logoText || "4Relief";

  const siteName = isDestekol ? "Destekol" : settings?.siteName || "4Relief";

  const defaultEmail = isDestekol
    ? "info@destekol.org"
    : "info@forrelief.org";

  const safeNavItems = Array.isArray(navItems) ? navItems : [];

  return (
    <footer
      className="relative bg-sidebar-gradient text-white mt-auto overflow-hidden"
      role="contentinfo"
    >
      <div
        className="h-1"
        style={{
          background: settings?.accentColor
            ? `linear-gradient(to right, ${settings.accentColor}, ${settings.accentColor}cc)`
            : "linear-gradient(135deg, #F00F5A, #FF4D88)",
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <Link href={`${p}/`} aria-label={`${logoText} Home`}>
            <Image
              src={logoSrc}
              alt={logoText}
              width={175}
              height={70}
              className="h-11 w-auto object-contain mb-4"
            />
          </Link>
          {settings?.footerTagline && (
            <p className="text-white/80 text-sm font-semibold mb-2">
              {settings.footerTagline}
            </p>
          )}
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            {settings?.footerDescription ||
              d("footer.description", {
                ar: "مؤسسة إنسانية عالمية، تعمل بشفافية تامة لإيصال تبرعاتكم عبر منصتها الرقمية وشراكاتها الميدانية.",
                en: "An independent humanitarian donation platform operating with full transparency.",
                fr: "Une plateforme de dons humanitaires indépendante fonctionnant en toute transparence.",
                tr: "Tam şeffaflıkla faaliyet gösteren bağımsız bir insani yardım bağış platformu.",
              }) ||
              `${siteName} Humanitarian Foundation`}
          </p>

          {socialLinks.length > 0 && (
            <nav
              aria-label="Social media channels"
              className="flex gap-2 flex-wrap mb-6"
            >
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${s.label} page`}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition"
                >
                  <Icon
                    name={s.icon as any}
                    size={15}
                    className="text-white/80"
                  />
                </a>
              ))}
            </nav>
          )}

          <Link
            href={`${p}/donate`}
            className="inline-flex items-center gap-2 hover:opacity-90 text-white font-bold rounded-xl px-5 py-2.5 text-sm transition shadow-md"
            style={{
              background: settings?.accentColor
                ? `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}cc)`
                : "linear-gradient(135deg, #F00F5A, #FF4D88)",
            }}
          >
            <Icon name="heart" size={16} />
            {d("nav.donate", {
              ar: "تبرع الآن",
              en: "Donate Now",
              fr: "Faire un Don",
              tr: "Bağış Yap",
            })}
          </Link>
        </div>

        {/* Quick Links Column */}
        <nav aria-label="Quick links">
          <h2 className="font-bold text-white/80 mb-5 text-sm tracking-[0.2em] uppercase">
            {d("footer.quick_links", {
              ar: "روابط سريعة",
              en: "Quick Links",
              fr: "Liens Rapides",
              tr: "Hızlı Bağlantılar",
            })}
          </h2>
          <ul className="space-y-2.5 text-sm text-white/80">
            <li>
              <Link
                href={`${p}/why-4relief`}
                className="flex items-center gap-2 hover:text-white transition group font-semibold text-emerald-300"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:bg-white transition"
                  aria-hidden="true"
                />
                {d("footer.why_4relief", {
                  ar: `لماذا ${siteName}؟ (مقارنة)`,
                  en: `Why ${siteName}? (Comparison)`,
                  fr: `Pourquoi ${siteName} ?`,
                  tr: `Neden ${siteName}?`,
                })}
              </Link>
            </li>
            
            {/* تمت إضافة رابط الشراكات المؤسسية هنا */}
            <li>
              <Link
                href={`${p}/institutional-partnerships`}
                className="flex items-center gap-2 hover:text-white transition group font-semibold text-amber-300"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-white transition"
                  aria-hidden="true"
                />
                {d("footer.institutional_partnerships", {
                  ar: "الشراكات المؤسسية",
                  en: "Institutional Partnerships",
                  fr: "Partenariats Institutionnels",
                  tr: "Kurumsal Ortaklıklar",
                })}
              </Link>
            </li>

            {safeNavItems.map((item) => {
              const navKey = `nav.${item.slug}`;
              const translatedTitle =
                (dict && dict[navKey]) ||
                (item.slug === "home"
                  ? d("nav.home", {
                      ar: "الرئيسية",
                      en: "Home",
                      fr: "Accueil",
                      tr: "Ana Sayfa",
                    })
                  : item.slug === "about" || item.slug === "about-us"
                  ? d("nav.about", {
                      ar: "من نحن",
                      en: "About Us",
                      fr: "À Propos",
                      tr: "Hakkımızda",
                    })
                  : item.slug === "our-work" || item.slug === "sectors"
                  ? d("nav.our_work", {
                      ar: "مجالات عملنا",
                      en: "Our Work",
                      fr: "Nos Domaines",
                      tr: "Faaliyetlerimiz",
                    })
                  : item.slug === "projects"
                  ? d("nav.projects", {
                      ar: "المشاريع الإنسانية",
                      en: "Projects",
                      fr: "Projets",
                      tr: "Projelerimiz",
                    })
                  : item.slug === "transparency" ||
                    item.slug === "financial-transparency"
                  ? d("nav.transparency", {
                      ar: "الشفافية",
                      en: "Transparency",
                      fr: "Transparence",
                      tr: "Şeffaflık",
                    })
                  : item.slug === "contact"
                  ? d("nav.contact", {
                      ar: "اتصل بنا",
                      en: "Contact",
                      fr: "Contact",
                      tr: "İletişim",
                    })
                  : item.title);

              return (
                <li key={item.slug}>
                  <Link
                    href={item.slug === "home" ? `${p}/` : `${p}/${item.slug}`}
                    className="flex items-center gap-2 hover:text-white transition group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition"
                      aria-hidden="true"
                    />
                    {translatedTitle}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={`${p}/campaigns`}
                className="flex items-center gap-2 hover:text-white transition group"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition"
                  aria-hidden="true"
                />
                {d("nav.campaigns", {
                  ar: "الحملات الإغاثية",
                  en: "Campaigns",
                  fr: "Campagnes",
                  tr: "Kampanyalar",
                })}
              </Link>
            </li>
            <li>
              <Link
                href={`${p}/news`}
                className="flex items-center gap-2 hover:text-white transition group"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition"
                  aria-hidden="true"
                />
                {d("nav.news", {
                  ar: "الأخبار والميدان",
                  en: "News",
                  fr: "Actualités",
                  tr: "Haberler",
                })}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Legal Policies Column */}
        <nav aria-label="Legal & Transparency policies">
          <h2 className="font-bold text-white/80 mb-5 text-sm tracking-[0.2em] uppercase">
            {d("footer.legal", {
              ar: "السياسات والشفافية",
              en: "Legal Policies",
              fr: "Politiques Légales",
              tr: "Yasal Politikalar",
            })}
          </h2>
          <ul className="space-y-2.5 text-sm text-white/80">
            {LEGAL_SLUGS.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`${p}/${item.slug}`}
                  className="flex items-center gap-2 hover:text-white transition group"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition"
                    aria-hidden="true"
                  />
                  {d(item.key, item.fallbacks)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact Column */}
        <div>
          <h2 className="font-bold text-white/80 mb-5 text-sm tracking-[0.2em] uppercase">
            {d("footer.contact_us", {
              ar: "تواصل معنا",
              en: "Contact Us",
              fr: "Nous Contacter",
              tr: "Bize Ulaşın",
            })}
          </h2>
          <address className="not-italic">
            <ul className="space-y-3 text-sm text-white/80">
              {settings?.contactEmail && (
                <li>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    aria-label={`Send email to ${settings.contactEmail}`}
                    className="flex items-center gap-2 hover:text-white transition"
                  >
                    <Icon
                      name="mail"
                      size={15}
                      className="text-white/80 shrink-0"
                    />
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings?.contactPhone && (
                <li>
                  <a
                    href={`tel:${settings.contactPhone}`}
                    aria-label={`Call ${settings.contactPhone}`}
                    className="flex items-center gap-2 hover:text-white transition"
                  >
                    <Icon
                      name="phone"
                      size={15}
                      className="text-white/80 shrink-0"
                    />
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings?.whatsappNumber && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact us on WhatsApp"
                    className="flex items-center gap-2 hover:text-white transition"
                  >
                    <Icon
                      name="message-circle"
                      size={15}
                      className="text-white/80 shrink-0"
                    />
                    WhatsApp
                  </a>
                </li>
              )}
              {!settings?.contactEmail && !settings?.contactPhone && (
                <li className="flex items-center gap-2">
                  <Icon
                    name="mail"
                    size={15}
                    className="text-white/80 shrink-0"
                  />
                  {defaultEmail}
                </li>
              )}
            </ul>
          </address>
        </div>
      </div>

      {/* Registered Entity & Verification Bar */}
      <div className="border-t border-white/10 py-4 px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/70">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-white/90">
            {d("footer.verified_on", {
              ar: "جهة مسجلة وموثقة:",
              en: "Verified Entity:",
              fr: "Entité Vérifiée:",
              tr: "Doğrulanmış Kurum:",
            })}
          </span>
          <a
            href="https://find-and-update.company-information.service.gov.uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white transition font-medium underline underline-offset-4"
          >
            🏛 GOV.UK Official Register
          </a>
        </div>

        <span>
          {settings?.copyrightText ||
            `© ${new Date().getFullYear()} ${siteName} — ${d("footer.rights", {
              ar: "جميع الحقوق محفوظة",
              en: "All Rights Reserved",
              fr: "Tous Droits Réservés",
              tr: "Tüm Hakları Saklıdır",
            })}`}
        </span>
      </div>
    </footer>
  );
}