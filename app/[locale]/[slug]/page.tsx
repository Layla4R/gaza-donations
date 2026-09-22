import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import Icon from "@/components/icons";

import BlockRenderer from "@/components/blocks/BlockRenderer";
import LegalPageContent from "@/components/site/LegalPageContent";
import ProjectArticleLayout from "@/components/site/ProjectArticleLayout";

import { getCampaignsLite } from "@/lib/pageData";
import { LOCALES, loadTranslations } from "@/lib/i18n";
import { PageSection } from "@/lib/blocks";
import { getSupabaseOrNull } from "@/lib/supabase";

export const revalidate = 0;

interface PageProps {
  params: { slug: string; locale: string };
}

// دالة مساعدة لجلب معلومات الدومين
async function getDomainContext() {
  const headerList = await headers();
  const host = headerList.get("host") || "";
  const isDestekol = host.includes("destekol");
  
  const siteUrl = isDestekol 
    ? "https://destekol.org" 
    : (process.env.NEXT_PUBLIC_SITE_URL || "https://forrelief.org");

  const brandName = isDestekol ? "Destekol" : "4Relief";
  const fullName = isDestekol ? "Destekol İnsani Yardım Vakfı" : "4Relief Humanitarian Foundation";

  return { isDestekol, siteUrl, brandName, fullName };
}

const LEGAL_SLUGS = [
  "privacy",
  "terms",
  "refund-policy",
  "cookie-policy",
  "aml-policy",
  "complaints",
  "license",
  "financial-transparency",
  "how-we-use-donations",
];

const LEGAL_TITLES: Record<string, Record<string, string>> = {
  privacy: {
    ar: "سياسة الخصوصية",
    en: "Privacy Policy",
    fr: "Politique de Confidentialité",
    tr: "Gizlilik Politikası",
  },
  terms: {
    ar: "الشروط والأحكام",
    en: "Terms & Conditions",
    fr: "Conditions d'Utilisation",
    tr: "Kullanım Koşulları",
  },
  "refund-policy": {
    ar: "سياسة الاسترداد",
    en: "Refund Policy",
    fr: "Politique de Remboursement",
    tr: "İade Politikası",
  },
  "cookie-policy": {
    ar: "سياسة ملفات تعريف الارتباط",
    en: "Cookie Policy",
    fr: "Politique des Cookies",
    tr: "Çerez Politikası",
  },
  "aml-policy": {
    ar: "سياسة مكافحة غسيل الأموال",
    en: "Anti-Money Laundering Policy",
    fr: "Politique Anti-Blanchiment",
    tr: "Kara Para Aklamayla Mücadele",
  },
  complaints: {
    ar: "الشكاوى",
    en: "Complaints Policy",
    fr: "Politique de Réclamations",
    tr: "Şikayet Politikası",
  },
  "financial-transparency": {
    ar: "الشفافية المالية",
    en: "Financial Transparency",
    fr: "Transparence Financière",
    tr: "Mali Şeffاflık",
  },
  "how-we-use-donations": {
    ar: "كيف نستخدم التبرعات",
    en: "How We Use Donations",
    fr: "Comment Nous Utilisons les Dons",
    tr: "Bağışları Nasıl Kullanıyoruz",
  },
};

const TRUST_TRANSLATIONS: Record<string, Record<string, string>> = {
  verifiedTitle: {
    ar: "معلومات الاعتماد والترخيص والشفافية الرسمية",
    en: "Verified NGO Credentials & Transparency",
    tr: "Doğrulanmış STK & Şeffaflık Bilgileri",
    fr: "Accréditation ONG & Transparence",
  },
  verifiedSubtitle: {
    ar: "منظمة إنسانية مسجلة ومستقلة | تدقيق مالي وشفافية 100%",
    en: "Registered Independent NGO | 100% Financial Governance",
    tr: "Kayıtlı Bağımsız STK | %100 Mali Şeffaflık ve Denetim",
    fr: "ONG Indépendante Enregistrée | Gouvernance Financière 100%",
  },
  foundedLabel: {
    ar: "سنة التأسيس",
    en: "Founded",
    tr: "Kuruluş Yılı",
    fr: "Fondée en",
  },
  legalLabel: {
    ar: "الصفة القانونية",
    en: "Legal Entity",
    tr: "Yasal Statü",
    fr: "Statut Juridique",
  },
  legalValue: {
    ar: "منظمة غير ربحية (NGO)",
    en: "Registered NGO",
    tr: "Kayıtlı STK / Vakıf",
    fr: "ONG Non Lucrative",
  },
  transparencyLabel: {
    ar: "الشفافية المالية",
    en: "Financial Transparency",
    tr: "Mali Şeffافية",
    fr: "Transparence Financière",
  },
  transparencyValue: {
    ar: "100% تقارير موثقة",
    en: "100% Audited",
    tr: "%100 Denetlenmiş",
    fr: "100% Audité",
  },
  coverageLabel: {
    ar: "النطاق الميداني",
    en: "Coverage",
    tr: "Saha Kapsamı",
    fr: "Couverture Terrain",
  },
  coverageValue: {
    ar: "12+ دولة ومتأثر",
    en: "12+ Regions",
    tr: "12+ Bölge ve Ülke",
    fr: "12+ Régions",
  },
};

function getLegalSubtitle(slug: string, locale: string, brandName: string): string | null {
  const subtitles: Record<string, Record<string, string>> = {
    privacy: {
      ar: "حماية بياناتك وخصوصيتك أولوية بالنسبة لنا.",
      en: "Protecting your personal data and privacy is our priority.",
      fr: "La protection de vos données personnelles et de votre vie privée est notre priorité.",
      tr: "Kişisel verilerinizi ve gizliliğinizi korumak önceliğimizdir.",
    },
    terms: {
      ar: `الشروط والأحكام المنظمة لاستخدام منصة ${brandName}.`,
      en: `The terms and conditions governing the use of the ${brandName} platform.`,
      fr: `Les conditions générales régissant l'utilisation de la plateforme ${brandName}.`,
      tr: `${brandName} platformunun kullanımını düzenleyen hüküm ve koşullar.`,
    },
  };

  return subtitles[slug]?.[locale] || subtitles[slug]?.en || null;
}

function getCommonPageTitle(slug: string, locale: string, fullName: string, brandName: string): string | null {
  const titles: Record<string, Record<string, string>> = {
    about: {
      ar: `من نحن | ${fullName}`,
      en: `About Us | ${fullName}`,
      fr: `À Propos | ${fullName}`,
      tr: `Hakkımızda | ${fullName}`,
    },
    "about-us": {
      ar: `من نحن | ${fullName}`,
      en: `About Us | ${fullName}`,
      fr: `À Propos | ${fullName}`,
      tr: `Hakkımızda | ${fullName}`,
    },
    "our-work": {
      ar: `مجالات عملنا | ${brandName}`,
      en: `Our Sectors & Work | ${brandName}`,
      fr: `Nos Domaines d'Action | ${brandName}`,
      tr: `Faaliyet Alanlarımız | ${brandName}`,
    },
    sectors: {
      ar: `مجالات عملنا | ${brandName}`,
      en: `Our Sectors | ${brandName}`,
      fr: `Nos Secteurs | ${brandName}`,
      tr: `Faaliyet Alanlarımız | ${brandName}`,
    },
    projects: {
      ar: `مشاريعنا | ${brandName}`,
      en: `Our Projects | ${brandName}`,
      fr: `Nos Projets | ${brandName}`,
      tr: `Projelerimiz | ${brandName}`,
    },
    gaza: {
      ar: `استجابة غزة | ${brandName}`,
      en: `Gaza Relief & Response | ${brandName}`,
      fr: `Urgence Gazah | ${brandName}`,
      tr: `Gazze İnsani Yardım | ${brandName}`,
    },
    partnerships: {
      ar: `الشراكات المؤسسية | ${fullName}`,
      en: `Corporate Partnerships | ${fullName}`,
      fr: `Partenariats Corporate | ${fullName}`,
      tr: `Kurumsal Ortaklıklar | ${fullName}`,
    },
    transparency: {
      ar: `الشفافية والتقارير المالية | ${brandName}`,
      en: `Financial Transparency | ${fullName}`,
      fr: `Transparence Financière | ${fullName}`,
      tr: `Mali Şeffافية | ${brandName}`,
    },
    contact: {
      ar: `اتصل بنا | ${fullName}`,
      en: `Contact Us | ${fullName}`,
      fr: `Contactez-nous | ${fullName}`,
      tr: `İletişim | ${brandName}`,
    },
  };

  return titles[slug]?.[locale] || null;
}

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseGalleryImages(galleryData: any): string[] {
  if (!galleryData) return [];
  if (Array.isArray(galleryData)) {
    return galleryData.filter((item) => typeof item === "string" && item.trim() !== "");
  }
  if (typeof galleryData === "string") {
    try {
      const parsed = JSON.parse(galleryData);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === "string" && item.trim() !== "");
      }
    } catch {
      if (galleryData.startsWith("http")) return [galleryData];
    }
  }
  return [];
}

function getSchemaType(slug: string) {
  if (slug === "about" || slug === "about-us") return "AboutPage";
  if (slug === "contact") return "ContactPage";
  if (slug === "our-work" || slug === "sectors" || slug === "projects") return "CollectionPage";
  return "WebPage";
}

// 🌟 دالة جلب البيانات مع استخراج الحقول الجديدة من قاعدة البيانات مباشرة
async function getFullPageData(slug: string, locale: string) {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data: page } = await supabase
    .from("Page")
    .select("*")
    .eq("slug", slug)
    .eq("isPublished", true)
    .maybeSingle();

  if (!page) return null;

  let title = page.title;
  let description = page.description || "";
  let body = page.body || page.content || "";
  let body2 = page.body2 || "";
  let body3 = page.body3 || "";
  let coverImage = page.coverImage || page.image || null;
  let secondaryImage = page.secondaryImage || null;
  let gallery = parseGalleryImages(page.gallery);
  let videoUrl = page.videoUrl || null;
  let sections = page.sections || [];

  if (locale !== "ar") {
    const { data: translation } = await supabase
      .from("PageTranslation")
      .select("*")
      .eq("pageId", page.id)
      .eq("locale", locale)
      .maybeSingle();

    if (translation) {
      if (translation.title) title = translation.title;
      if (translation.description != null) description = translation.description;
      if (translation.body || translation.content) body = translation.body || translation.content;
      if (translation.body != null) body = translation.body;
      if (translation.body2 != null) body2 = translation.body2;
      if (translation.body3 != null) body3 = translation.body3;
      if (translation.coverImage != null) coverImage = translation.coverImage;
      if (translation.secondaryImage != null) secondaryImage = translation.secondaryImage;
      if (translation.gallery != null) gallery = parseGalleryImages(translation.gallery);
      if (translation.videoUrl != null) videoUrl = translation.videoUrl;
      if (translation.sections) sections = translation.sections;
    }
  }

  return {
    ...page,
    title,
    description,
    body,
    body2,
    body3,
    coverImage,
    secondaryImage,
    gallery,
    videoUrl,
    sections,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const { slug, locale } = params;
  const { siteUrl, brandName, fullName } = await getDomainContext();
  const page = await getFullPageData(slug, locale);

  if (!page) return {};

  const isLegalPage = LEGAL_SLUGS.includes(slug);
  const commonTitle = getCommonPageTitle(slug, locale, fullName, brandName);

  const baseTitle = isLegalPage
    ? LEGAL_TITLES[slug]?.[locale] || LEGAL_TITLES[slug]?.en || page.title
    : commonTitle || page.title;

  const title = baseTitle.includes(brandName)
    ? baseTitle
    : `${baseTitle} | ${fullName}`;

  const description = cleanText(page.description) || title;
  const currentUrl = `${siteUrl}/${locale}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: currentUrl,
      languages: Object.fromEntries(
        LOCALES.map((currentLocale) => [
          currentLocale,
          `${siteUrl}/${currentLocale}/${slug}`,
        ]),
      ),
    },
    openGraph: {
      type: "website",
      url: currentUrl,
      siteName: fullName,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const { slug, locale } = params;
  const { isDestekol, siteUrl, brandName, fullName } = await getDomainContext();
  const supabase = getSupabaseOrNull();

  const [appearanceResult, page, campaigns, dict] = await Promise.all([
    supabase
      ? supabase
          .from("SiteSettings")
          .select(
            "primaryColor, accentColor, facebookUrl, twitterUrl, instagramUrl, linkedinUrl, youtubeUrl",
          )
          .eq("id", "default")
          .maybeSingle()
      : Promise.resolve({ data: null }),

    getFullPageData(slug, locale),
    getCampaignsLite(locale),
    loadTranslations(locale),
  ]);

  if (!page) {
    notFound();
  }

  const isAr = locale === "ar";
  const isLegalPage = LEGAL_SLUGS.includes(slug);

  // 🌟 التوجيه المباشر للتصميم الصحفي إذا احتوت الصفحة على نصوص أو ميديا المشروع
  const hasProjectArticleContent =
    !isLegalPage &&
    Boolean(
      page.body || page.body2 || page.body3 || page.coverImage || page.videoUrl || page.secondaryImage || (Array.isArray(page.gallery) && page.gallery.length > 0)
    );

  if (hasProjectArticleContent) {
    const p = isAr ? "" : `/${locale}`;
    return (
      <ProjectArticleLayout
        data={{
          title: page.title,
          excerpt: page.description || "",
          body: page.body || "",
          body2: page.body2 || "",
          body3: page.body3 || "",
          coverImage: page.coverImage || null,
          secondaryImage: page.secondaryImage || null,
          gallery: page.gallery || [],
          videoUrl: page.videoUrl || null,
          publishedAtISO: page.createdAt || new Date().toISOString(),
          updatedAtISO: page.updatedAt || new Date().toISOString(),
          authorName: isAr ? "فريق المتابعة والتوثيق الميداني" : "Field Monitoring Team",
          trustBadge: isAr ? "مشروع إغاثي موثق ميدانياً | شفافية 100%" : "Verified Field Project | 100% Audited",
        }}
        context={{
          locale,
          dict,
          isAr,
          brandName: fullName,
          backLink: `${p}/projects`,
          backText: dict["projects.back"] || (isAr ? "العودة إلى المشاريع" : "Back to Projects"),
          categoryLabel: isAr ? "مشروع إغاثي ميداني" : "Relief Project",
          donateUrl: `${p}/donate`,
        }}
      />
    );
  }

  // ⬇️ جميع الكود القديم للصفحات العادية والأنظمة بدون حذف ⬇️
  const appearance = appearanceResult.data;
  const primaryColor = appearance?.primaryColor || "#0069D2";
  const accentColor = appearance?.accentColor || "#F00F5A";

  const rawSections = (page.sections as unknown as PageSection[]) || [];
  const sections = rawSections.map((sec, idx) => ({
    ...sec,
    id: sec.id || `section-${idx}`,
  }));

  const isTrustPage =
    slug === "about" ||
    slug === "about-us" ||
    slug === "our-work" ||
    slug === "sectors" ||
    slug === "transparency" ||
    slug === "financial-transparency";

  const hasCustomSections = !isLegalPage && sections.length > 0;

  const commonTitle = getCommonPageTitle(slug, locale, fullName, brandName);

  const displayTitle = isLegalPage
    ? LEGAL_TITLES[slug]?.[locale] || LEGAL_TITLES[slug]?.en || page.title
    : dict[`nav.${slug}`] || commonTitle || page.title;

  const displaySubtitle = isLegalPage
    ? getLegalSubtitle(slug, locale, brandName) ||
      cleanText(page.description) ||
      null
    : cleanText(page.description) || null;

  const pageUrl = `${siteUrl}/${locale}/${slug}`;
  const schemaType = getSchemaType(slug);

  const tTrust = (key: string) =>
    TRUST_TRANSLATIONS[key]?.[locale] || TRUST_TRANSLATIONS[key]?.en || "";

  const dynamicPageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": schemaType,
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `${displayTitle} | ${fullName}`,
        description: displaySubtitle || displayTitle,
        inLanguage: locale,
        datePublished: (page as any).createdAt || "2026-01-01T00:00:00Z",
        dateModified: (page as any).updatedAt || new Date().toISOString(),
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        publisher: { "@id": `${siteUrl}/#organization` },
        breadcrumb: { "@id": `${pageUrl}/#breadcrumb` },
      },
      ...(isTrustPage
        ? [
            {
              "@type": ["NGO", "Organization"],
              "@id": `${siteUrl}/#organization`,
              name: fullName,
              alternateName: isDestekol
                ? ["Destekol", "Destekol NGO"]
                : [
                    "4Relief",
                    "4Relief NGO",
                    "4Relief International Humanitarian Foundation",
                  ],
              url: siteUrl,
              logo: `${siteUrl}${isDestekol ? "/brand/desekol_logo.png" : "/brand/logo.png"}`,
              foundingDate: "2026",
              knowsAbout: [
                "Humanitarian Aid",
                "Emergency Relief",
                "Financial Transparency",
                "Sustainable Development",
                "WASH Projects",
                "Zakat",
              ],
              sameAs: [
                appearance?.facebookUrl,
                appearance?.twitterUrl,
                appearance?.instagramUrl,
                appearance?.linkedinUrl,
                appearance?.youtubeUrl,
                "https://find-and-update.company-information.service.gov.uk/",
              ].filter(Boolean),
            },
          ]
        : []),
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict["nav.home"] || (isAr ? "الرئيسية" : "Home"),
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: displayTitle,
        item: pageUrl,
      },
    ],
  };

  return (
    <article className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dynamicPageSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <header
        className="relative overflow-hidden py-12 text-center transition-colors sm:py-20"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute -bottom-20 -left-20 hidden h-80 w-80 rounded-full border border-white/10 sm:block" />

        <div className="relative mx-auto max-w-screen-xl px-6">
          <span
            className="mb-4 inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/70"
            suppressHydrationWarning
          >
            <span className="inline-block h-px w-6 bg-white/40" />
            {isAr
              ? `مؤسسة ${brandName} الإنسانية`
              : `${brandName} Humanitarian Foundation`}
          </span>

          <h1 className="font-display text-2xl font-extrabold text-white sm:text-4xl md:text-5xl">
            {displayTitle}
          </h1>

          {displaySubtitle && (
            <p className="mx-auto mt-4 max-w-2xl rounded-xl border border-white/15 bg-white/10 p-4 text-sm sm:text-lg font-medium leading-relaxed text-white/90 backdrop-blur-sm">
              {displaySubtitle}
            </p>
          )}
        </div>
      </header>

      {isTrustPage && (
        <section className="mx-auto max-w-screen-xl px-6 pt-8">
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm">
            <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
              <Icon name="shield-check" size={18} />
            </div>
            <div className="flex-1">
              <span className="font-bold text-slate-900">
                {tTrust("verifiedTitle")}
              </span>
              <p className="text-slate-500 text-xs">
                {tTrust("verifiedSubtitle")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium">
            <div>
              <span className="block text-slate-700 text-s font-medium">
                {tTrust("foundedLabel")}
              </span>
              <strong className="text-slate-900">2026</strong>
            </div>
            <div>
              <span className="block text-slate-700 text-s font-medium">
                {tTrust("legalLabel")}
              </span>
              <strong className="text-slate-900">
                {tTrust("legalValue")}
              </strong>
            </div>
            <div>
              <span className="block text-slate-700 text-s font-medium">
                {tTrust("transparencyLabel")}
              </span>
              <strong className="text-brand">
                {tTrust("transparencyValue")}
              </strong>
            </div>
            <div>
              <span className="block text-slate-700 text-s font-medium">
                {tTrust("coverageLabel")}
              </span>
              <strong className="text-slate-900">
                {tTrust("coverageValue")}
              </strong>
            </div>
          </div>
        </section>
      )}

      <div className="bg-white py-6">
        {hasCustomSections ? (
          sections.map((section) => (
            <BlockRenderer
              key={section.id}
              section={section}
              context={{
                campaigns,
                whiteBackground: true,
                locale,
                dict,
                primaryColor,
                accentColor,
              }}
            />
          ))
        ) : isLegalPage ? (
          <LegalPageContent slug={slug} locale={locale} />
        ) : (page as any).content ? (
          <div className="mx-auto max-w-screen-xl px-6 py-8 whitespace-pre-line text-slate-700 leading-relaxed text-base sm:text-lg">
            {(page as any).content}
          </div>
        ) : null}
      </div>
    </article>
  );
}