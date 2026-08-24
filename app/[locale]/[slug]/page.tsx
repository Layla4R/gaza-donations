import { notFound } from "next/navigation";
import type { Metadata } from "next";

import BlockRenderer from "@/components/blocks/BlockRenderer";
import LegalPageContent from "@/components/site/LegalPageContent";

import {
  getPageBySlug,
  getCampaignsLite,
} from "@/lib/pageData";

import {
  LOCALES,
  loadTranslations,
} from "@/lib/i18n";

import { PageSection } from "@/lib/blocks";
import { getSupabaseOrNull } from "@/lib/supabase";

export const revalidate = 300;

const SITE_URL = "https://forrelief.org";

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

const LEGAL_TITLES: Record<
  string,
  Record<string, string>
> = {
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
    tr: "Mali Şeffaflık",
  },

  "how-we-use-donations": {
    ar: "كيف نستخدم التبرعات",
    en: "How We Use Donations",
    fr: "Comment Nous Utilisons les Dons",
    tr: "Bağışları Nasıl Kullanıyoruz",
  },
};

const LEGAL_SUBTITLES: Record<
  string,
  Record<string, string>
> = {
  privacy: {
    ar: "حماية بياناتك وخصوصيتك أولوية بالنسبة لنا.",
    en: "Protecting your personal data and privacy is our priority.",
    fr: "La protection de vos données personnelles et de votre vie privée est notre priorité.",
    tr: "Kişisel verilerinizi ve gizliliğinizi korumak önceliğimizdir.",
  },

  terms: {
    ar: "الشروط والأحكام المنظمة لاستخدام منصة 4Relief.",
    en: "The terms and conditions governing the use of the 4Relief platform.",
    fr: "Les conditions générales régissant l'utilisation de la plateforme 4Relief.",
    tr: "4Relief platformunun kullanımını düzenleyen hüküm ve koşullar.",
  },
};

const COMMON_PAGE_TITLES: Record<
  string,
  Record<string, string>
> = {
  about: {
    ar: "من نحن",
    en: "About Us",
    fr: "À Propos",
    tr: "Hakkımızda",
  },

  transparency: {
    ar: "الشفافية",
    en: "Transparency",
    fr: "Transparence",
    tr: "Şeffaflık",
  },

  contact: {
    ar: "اتصل بنا",
    en: "Contact Us",
    fr: "Contactez-nous",
    tr: "İletişim",
  },
};

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSchemaType(slug: string) {
  if (
    slug === "about" ||
    slug === "about-us"
  ) {
    return "AboutPage";
  }

  if (slug === "contact") {
    return "ContactPage";
  }

  return "WebPage";
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
    locale: string;
  };
}): Promise<Metadata> {
  const {
    slug,
    locale,
  } = params;

  const page = await getPageBySlug(
    slug,
    locale
  );

  if (!page) {
    return {};
  }

  const isLegalPage =
    LEGAL_SLUGS.includes(slug);

  const title = isLegalPage
    ? LEGAL_TITLES[slug]?.[locale] ||
      LEGAL_TITLES[slug]?.en ||
      page.title
    : page.title;

  const description =
    cleanText(page.description) ||
    title;

  const currentUrl =
    `${SITE_URL}/${locale}/${slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: currentUrl,

      languages: Object.fromEntries(
        LOCALES.map((currentLocale) => [
          currentLocale,
          `${SITE_URL}/${currentLocale}/${slug}`,
        ])
      ),
    },

    openGraph: {
      type: "website",
      url: currentUrl,
      siteName: "4Relief",
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
  params: {
    slug: string;
    locale: string;
  };
}) {
  const {
    slug,
    locale,
  } = params;

  const supabase =
    getSupabaseOrNull();

  const [
    appearanceResult,
    page,
    campaigns,
    dict,
  ] = await Promise.all([
    supabase
      ? supabase
          .from("SiteSettings")
          .select(
            "primaryColor, accentColor"
          )
          .eq("id", "default")
          .maybeSingle()
      : Promise.resolve({
          data: null,
        }),

    getPageBySlug(
      slug,
      locale
    ),

    getCampaignsLite(locale),

    loadTranslations(locale),
  ]);

  if (!page) {
    notFound();
  }

  const appearance =
    appearanceResult.data;

  const primaryColor =
    appearance?.primaryColor ||
    "#0069D2";

  const accentColor =
    appearance?.accentColor ||
    "#F00F5A";

  const sections =
    (page.sections as unknown as PageSection[]) ||
    [];

  const isLegalPage =
    LEGAL_SLUGS.includes(slug);

  const hasCustomSections =
    !isLegalPage &&
    sections.length > 0;

  const displayTitle =
    isLegalPage
      ? LEGAL_TITLES[slug]?.[locale] ||
        LEGAL_TITLES[slug]?.en ||
        page.title
      : dict[`nav.${slug}`] ||
        COMMON_PAGE_TITLES[slug]?.[locale] ||
        page.title;

  const displaySubtitle =
    isLegalPage
      ? LEGAL_SUBTITLES[slug]?.[locale] ||
        LEGAL_SUBTITLES[slug]?.en ||
        cleanText(page.description) ||
        null
      : cleanText(page.description) ||
        null;

  const pageUrl =
    `${SITE_URL}/${locale}/${slug}`;

  const schemaType =
    getSchemaType(slug);

  const dynamicPageSchema = {
    "@context": "https://schema.org",

    "@type": schemaType,

    "@id":
      `${pageUrl}/#webpage`,

    url: pageUrl,

    name: displayTitle,

    description:
      displaySubtitle ||
      displayTitle,

    inLanguage: locale,

    isPartOf: {
      "@id":
        `${SITE_URL}/#website`,
    },

    about: {
      "@id":
        `${SITE_URL}/#organization`,
    },

    publisher: {
      "@id":
        `${SITE_URL}/#organization`,
    },

    breadcrumb: {
      "@id":
        `${pageUrl}/#breadcrumb`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    "@id":
      `${pageUrl}/#breadcrumb`,

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "4Relief",
        item:
          `${SITE_URL}/${locale}`,
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
    <article className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            dynamicPageSchema
          ).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema
          ).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <header
        className="relative overflow-hidden py-12 text-center transition-colors sm:py-20"
        style={{
          backgroundColor:
            primaryColor,
        }}
      >
        <div className="absolute -bottom-20 -left-20 hidden h-80 w-80 rounded-full border border-white/10 sm:block" />

        <div className="relative mx-auto max-w-screen-xl px-6">
          <span className="mb-4 inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            <span className="inline-block h-px w-6 bg-white/40" />
            4Relief Humanitarian Foundation
          </span>

          <h1 className="font-display text-2xl font-extrabold text-white sm:text-4xl md:text-5xl">
            {displayTitle}
          </h1>

          {displaySubtitle && (
            <p className="mx-auto mt-4 max-w-2xl rounded-xl border border-white/15 bg-white/10 p-4 text-lg font-medium leading-relaxed text-white/90 backdrop-blur-sm">
              {displaySubtitle}
            </p>
          )}
        </div>
      </header>

      <div className="bg-white">
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
          <LegalPageContent
            slug={slug}
            locale={locale}
          />
        ) : null}
      </div>
    </article>
  );
}