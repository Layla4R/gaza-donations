"use client";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/icons";

interface NavItem { slug: string; title: string; }

const LEGAL_SLUGS: Array<{ slug: string; key: string }> = [
  { slug: "privacy",                key: "legal.privacy"               },
  { slug: "terms",                  key: "legal.terms"                 },
  { slug: "refund-policy",          key: "legal.refund_policy"         },
  { slug: "cookie-policy",          key: "legal.cookie_policy"         },
  { slug: "aml-policy",             key: "legal.aml_policy"            },
  { slug: "complaints",             key: "legal.complaints"            },
  { slug: "financial-transparency", key: "legal.financial_transparency"},
  { slug: "how-we-use-donations",   key: "legal.how_we_use_donations"  },
];

const SOCIAL_ICONS: Record<string, { icon: string; label: string }> = {
  facebookUrl:  { icon: "facebook",  label: "Facebook"  },
  twitterUrl:   { icon: "twitter",   label: "Twitter"   },
  instagramUrl: { icon: "instagram", label: "Instagram" },
  youtubeUrl:   { icon: "youtube",   label: "YouTube"   },
  linkedinUrl:  { icon: "linkedin",  label: "LinkedIn"  },
  tiktokUrl:    { icon: "tiktok",    label: "TikTok"    },
};

export default function SiteFooter({ navItems, settings, locale, dict }: {
  navItems: NavItem[]; settings: any; locale: string; dict: Record<string, string>;
}) {
  const p = locale === "ar" ? "" : `/${locale}`;
  const loc: "ar" | "en" | "fr" | "tr" = (["ar","en","fr","tr"].includes(locale) ? locale : "ar") as any;
  const d = (key: string, fallbacks: Record<string, string> = {}) =>
    dict[key] || fallbacks[loc] || fallbacks["en"] || "";

  const socialLinks = Object.entries(SOCIAL_ICONS)
    .filter(([key]) => settings?.[key])
    .map(([key, meta]) => ({ url: settings[key] as string, ...meta }));

  const logoSrc = settings?.logoImage || "/brand/logo-horizontal-transparent.png";

  return (
    <footer className="relative bg-sidebar-gradient text-white mt-auto overflow-hidden">
      <div className="h-1" style={{ background: settings?.accentColor
        ? `linear-gradient(to right, ${settings.accentColor}, ${settings.accentColor}cc)`
        : "linear-gradient(135deg, #F00F5A, #FF4D88)"
      }} />
      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 py-10 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <Image src={logoSrc} alt={settings?.logoText || "4Relief"} width={175} height={70}
            className="h-11 w-auto object-contain mb-4" />
          {settings?.footerTagline && (
            <p className="text-white/80 text-sm font-semibold mb-2">{settings.footerTagline}</p>
          )}
          <p className="text-white/80 text-sm leading-relaxed mb-6">
            {settings?.footerDescription
              || d("footer.description", {
                  ar: "منصة تبرعات إنسانية مستقلة بشفافية كاملة مع شركاء محليين موثوقين.",
                  en: "An independent humanitarian donation platform with full transparency.",
                  fr: "Une plateforme de dons humanitaires indépendante avec transparence totale.",
                  tr: "Güvenilir ortaklarla tam şeffaflıkla bağımsız insani yardım platformu.",
                })
              || "4Relief Humanitarian Foundation"}
          </p>

          {/* Social icons */}
          {socialLinks.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6" aria-label="Social links">
              {socialLinks.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                  aria-label={`Visit our ${s.label} page`}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition">
                  <Icon name={s.icon as any} size={15} className="text-white/80" />
                </a>
              ))}
            </div>
          )}

          <Link href={`${p}/donate`}
            className="inline-flex items-center gap-2 hover:opacity-90 text-white font-bold rounded-xl px-5 py-2.5 text-sm transition"
            style={{ background: settings?.accentColor
              ? `linear-gradient(135deg, ${settings.accentColor}, ${settings.accentColor}cc)`
              : "linear-gradient(135deg, #F00F5A, #FF4D88)"
            }}>
            <Icon name="heart" size={16} />
            {d("nav.donate", { ar: "تبرع الآن", en: "Donate Now", fr: "Faire un Don", tr: "Bağış Yap" })}
          </Link>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="font-bold text-white/80 mb-5 text-sm tracking-[0.2em] uppercase">
            {d("footer.quick_links", { ar: "روابط سريعة", en: "Quick Links", fr: "Liens Rapides", tr: "Hızlı Bağlantılar" })}
          </h2>
          <ul className="space-y-2.5 text-sm text-white/80">
            {navItems.map(item => {
              const navKey = `nav.${item.slug}`;
              const translatedTitle = dict[navKey] || (
                item.slug === "home" ? d("nav.home", { ar: "الرئيسية", en: "Home", fr: "Accueil", tr: "Ana Sayfa" }) :
                item.slug === "about" || item.slug === "about-us" ? d("nav.about", { ar: "من نحن", en: "About Us", fr: "À Propos", tr: "Hakkımızda" }) :
                item.slug === "transparency" ? d("nav.transparency", { ar: "الشفافية", en: "Transparency", fr: "Transparence", tr: "Şeffaflık" }) :
                item.slug === "contact" ? d("nav.contact", { ar: "اتصل بنا", en: "Contact", fr: "Contact", tr: "İletişim" }) :
                item.title
              );

              return (
                <li key={item.slug}>
                  <Link href={item.slug === "home" ? `${p}/` : `${p}/${item.slug}`}
                    className="flex items-center gap-2 hover:text-white transition group">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition" aria-hidden="true" />
                    {translatedTitle}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link href={`${p}/campaigns`} className="flex items-center gap-2 hover:text-white transition group">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition" aria-hidden="true" />
                {d("nav.campaigns", { ar: "الحملات", en: "Campaigns", fr: "Campagnes", tr: "Kampanyalar" })}
              </Link>
            </li>
            <li>
              <Link href={`${p}/news`} className="flex items-center gap-2 hover:text-white transition group">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition" aria-hidden="true" />
                {d("nav.news", { ar: "الأخبار", en: "News", fr: "Actualités", tr: "Haberler" })}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h2 className="font-bold text-white/80 mb-5 text-sm tracking-[0.2em] uppercase">
            {d("footer.legal", { ar: "السياسات القانونية", en: "Legal Policies", fr: "Politiques Légales", tr: "Yasal Politikalar" })}
          </h2>
          <ul className="space-y-2.5 text-sm text-white/80">
            {LEGAL_SLUGS.map(item => (
              <li key={item.slug}>
                <Link href={`${p}/${item.slug}`} className="flex items-center gap-2 hover:text-white transition group">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-white transition" aria-hidden="true" />
                  {d(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-bold text-white/80 mb-5 text-sm tracking-[0.2em] uppercase">
            {d("footer.contact_us", { ar: "تواصل معنا", en: "Contact Us", fr: "Nous Contacter", tr: "Bize Ulaşın" })}
          </h2>
          <ul className="space-y-3 text-sm text-white/80">
            {settings?.contactEmail && (
              <li>
                <a href={`mailto:${settings.contactEmail}`}
                  aria-label={`Send email to ${settings.contactEmail}`}
                  className="flex items-center gap-2 hover:text-white transition">
                  <Icon name="mail" size={15} className="text-white/80 shrink-0" />
                  {settings.contactEmail}
                </a>
              </li>
            )}
            {settings?.contactPhone && (
              <li>
                <a href={`tel:${settings.contactPhone}`}
                  aria-label={`Call ${settings.contactPhone}`}
                  className="flex items-center gap-2 hover:text-white transition">
                  <Icon name="phone" size={15} className="text-white/80 shrink-0" />
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {settings?.whatsappNumber && (
              <li>
                <a href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank" rel="noopener noreferrer"
                  aria-label="Contact us on WhatsApp"
                  className="flex items-center gap-2 hover:text-white transition">
                  <Icon name="message-circle" size={15} className="text-white/80 shrink-0" />
                  WhatsApp
                </a>
              </li>
            )}
            {!settings?.contactEmail && !settings?.contactPhone && (
              <li className="flex items-center gap-2">
                <Icon name="mail" size={15} className="text-white/80 shrink-0" />
                info@forrelief.org
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/80">
        <span>
          {settings?.copyrightText || `© ${new Date().getFullYear()} ${settings?.siteName || "4Relief"} — ${d("footer.rights", { ar: "جميع الحقوق محفوظة", en: "All Rights Reserved", fr: "Tous Droits Réservés", tr: "Tüm Hakları Saklıdır" })}`}
        </span>
      </div>
    </footer>
  );
}