import HomeTrustContent from "@/components/site/HomeTrustContent";
import { COMPANY_RECORD_URL, getHomeTrustContent } from "@/lib/home-trust-content";
import { OFFICIAL_EMAIL } from "@/lib/public-contact";
import type { Metadata } from "next";
import { loadTranslations } from "@/lib/i18n";
import { getHomeData } from "@/lib/services/home.service";
import { headers } from "next/headers";
import ChatWidget from "@/components/site/ChatWidget";
import BlockRenderer from "@/components/blocks/BlockRenderer"; // استيراد BlockRenderer

export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forrelief.org";

interface PageProps {
  params: {
    locale: string;
  };
}

const OPTIMIZED_HOME_TITLES: Record<string, string> = {
  ar: "4Relief | منظمة إغاثة وإنسانية دولية (Humanitarian Foundation)",
  en: "4Relief | International Humanitarian Foundation & Emergency Relief",
  fr: "4Relief | Fondation Humanitaire Internationale & Secours d'Urgence",
  tr: "4Relief | Uluslararası İnsani Yardım Vakfı",
};

function cleanSchemaText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const headerList = await headers();
  const host = headerList.get("host") || "";
  const isDestekol = host.includes("destekol");

  const [dict, data] = await Promise.all([
    loadTranslations(locale),
    getHomeData(locale),
  ]);

  const settings: any = data?.settings || {};

  const siteTitle = isDestekol
    ? "Destekol | Uluslararası İnsani Yardım Vakfı"
    : (OPTIMIZED_HOME_TITLES[locale] || OPTIMIZED_HOME_TITLES.en);

  const description = getHomeTrustContent(locale).intro;

  const currentUrl = `${SITE_URL}/${locale}`;

  return {
    title: { absolute: siteTitle },
    description,

    alternates: {
      canonical: currentUrl,
      languages: Object.fromEntries(["ar", "en", "fr", "tr"].map(language => [language, `${SITE_URL}/${language}`])),
    },

    openGraph: {
      type: "website",
      url: currentUrl,
      siteName: isDestekol ? "Destekol İnsani Yardım Vakfı" : "4Relief Humanitarian Foundation",
      title: siteTitle,
      description,
    },

    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = params;
  const headerList = await headers();
  const host = headerList.get("host") || "";
  const isDestekol = host.includes("destekol");

  const [dict, homeData] = await Promise.all([
    loadTranslations(locale),
    getHomeData(locale),
  ]);

  const data: any = homeData || {};
  const settings: any = data.settings || {};
  const campaigns = data.campaigns || [];
  const posts = data.posts || [];
  const stats = data.stats || { total: 0, families: 0 };
  const pageSections = data.pageSections || [];
  const sections = Array.isArray(pageSections) ? pageSections : [];

  const primaryColor = settings?.primaryColor || "#0069D2";
  const accentColor = settings?.accentColor || "#F00F5A";

  const pageUrl = `${SITE_URL}/${locale}`;

  const description = getHomeTrustContent(locale).intro;

  const publishedDateISO = data.page?.createdAt;
  const updatedDateISO = data.page?.updatedAt;

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: isDestekol ? "Destekol | Uluslararası İnsani Yardım Vakfı" : "4Relief | International Humanitarian Foundation & Emergency Relief",
        description,
        inLanguage: locale,
        ...(publishedDateISO ? { datePublished: publishedDateISO } : {}),
        ...(updatedDateISO ? { dateModified: updatedDateISO } : {}),
        author: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": ["NGO", "Organization"],
        "@id": `${SITE_URL}/#organization`,
        name: isDestekol ? "Destekol İnsani Yardım Vakfı" : "4Relief Humanitarian Foundation",
        alternateName: isDestekol ? ["Destekol", "Destekol NGO"] : ["4Relief", "4Relief NGO", "4Relief International Humanitarian Foundation"],
        url: SITE_URL,
        ...(!isDestekol ? { legalName: "FOR RELIEF LTD", identifier: { "@type": "PropertyValue", propertyID: "Companies House company number", value: "17306194" }, sameAs: [COMPANY_RECORD_URL] } : {}),
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}${isDestekol ? "/brand/destekol_logo.png" : "/brand/logo.png"}`,
        },

        areaServed: [
          "Global",
          "United Arab Emirates",
          "Middle East",
          "Saudi Arabia",
          "Qatar",
          "Kuwait",
          "Germany",
          "France",
          "United Kingdom",
          "United States",
          "Türkiye"
        ],
        knowsAbout: [
          "Humanitarian Relief",
          "Emergency Aid",
          "Financial Governance",
          "Zakat Inquiries",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: OFFICIAL_EMAIL,
          contactType: "customer support",
          availableLanguage: ["Arabic", "English", "French", "Turkish"],
        },
      },
    ],
  };

  const safeJsonLd = (data: unknown) =>
    JSON.stringify(data).replace(/</g, "\\u003c");

  // تمرير السياق المطلوب للـ BlockRenderer
  const context = {
    locale,
    dict,
    primaryColor,
    accentColor,
    campaigns,
    posts,
    stats,
    settings,
    isDestekol,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(homeSchema),
        }}
      />

      {/* استخدام BlockRenderer لتصيير جميع الأقسام ديناميكياً */}
      {sections.map((section: any) => (
        <BlockRenderer key={section.id} section={section} context={context} />
      ))}
      
      {!isDestekol && <HomeTrustContent locale={locale} siteUrl={SITE_URL} />}

      {/* عرض مكون الدردشة بشكل منفصل إذا كان يجب أن يظهر دائماً */}
      <ChatWidget key={locale} locale={locale} />
    </div>
  );
}
