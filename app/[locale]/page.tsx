import { getRequestSite } from "@/lib/request-site";
import HomeTrustContent from "@/components/site/HomeTrustContent";
import DestekolAnswers from "@/components/site/DestekolAnswers";
import { getDestekolAnswers } from "@/lib/destekol-answers";
import { COMPANY_RECORD_URL, getHomeTrustContent } from "@/lib/home-trust-content";
import { officialEmail } from "@/lib/public-contact";
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

const DESTEKOL_IDENTITY: Record<string, string> = {
  ar: "جمعية Destekol الخيرية غير الربحية",
  en: "Destekol Charitable Non-Profit Association",
  fr: "Association caritative Destekol à but non lucratif",
  tr: "Destekol kâr amacı gütmeyen hayır derneği",
};

function cleanSchemaText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;
  const headerList = await headers();
  const host = headerList.get("host") || "";
  const isDestekol = getRequestSite().id === "destekol";
  const siteUrl = isDestekol ? "https://destekol.org" : SITE_URL;
  const identity = DESTEKOL_IDENTITY[locale] || DESTEKOL_IDENTITY.en;

  const [dict, data] = await Promise.all([
    loadTranslations(locale),
    getHomeData(locale),
  ]);

  const settings: any = data?.settings || {};

  const siteTitle = isDestekol
    ? identity
    : (OPTIMIZED_HOME_TITLES[locale] || OPTIMIZED_HOME_TITLES.en);

  const description = isDestekol
    ? getDestekolAnswers(locale).intro
    : getHomeTrustContent(locale).intro;

  const currentUrl = `${siteUrl}/${locale}`;

  return {
    title: { absolute: siteTitle },
    description,

    alternates: {
      canonical: currentUrl,
      languages: { ...Object.fromEntries(["ar", "en", "fr", "tr"].map(language => [language, `${siteUrl}/${language}`])), "x-default": `${siteUrl}/${isDestekol ? "tr" : "en"}` },
    },

    openGraph: {
      type: "website",
      url: currentUrl,
      siteName: isDestekol ? identity : "4Relief Humanitarian Foundation",
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
  const isDestekol = getRequestSite().id === "destekol";
  const siteUrl = isDestekol ? "https://destekol.org" : SITE_URL;
  const identity = DESTEKOL_IDENTITY[locale] || DESTEKOL_IDENTITY.en;

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
  const rawSections = Array.isArray(pageSections) ? pageSections : [];
  const sections = isDestekol
    ? rawSections.filter((section: any) => section.type !== "projects")
    : rawSections.map((section: any) => section.type !== "stats" ? section : {
        ...section,
        props: {
          ...section.props,
          items: (section.props?.items || []).map((item: any) => {
            // The old percentage was demo data. Display the policy's planning
            // target explicitly, rather than suggesting measured expenditure.
            if (!String(item.value).includes("%") || !/field|ميدان|terrain|saha/i.test(String(item.title))) return item;
            const labels: Record<string, string> = {
              ar: "الهدف لتخصيص المساعدات المباشرة",
              en: "Target allocation for direct aid",
              fr: "Objectif d’allocation à l’aide directe",
              tr: "Doğrudan yardım için hedef pay",
            };
            return { ...item, value: "85%", title: labels[locale] || labels.en };
          }),
        },
      });

  const primaryColor = settings?.primaryColor || "#0069D2";
  const accentColor = settings?.accentColor || "#F00F5A";

  const pageUrl = `${siteUrl}/${locale}`;

  const description = isDestekol
    ? getDestekolAnswers(locale).intro
    : getHomeTrustContent(locale).intro;

  const publishedDateISO = data.page?.createdAt;
  const updatedDateISO = data.page?.updatedAt;

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: isDestekol ? identity : "4Relief | International Humanitarian Foundation & Emergency Relief",
        description,
        inLanguage: locale,
        ...(publishedDateISO ? { datePublished: publishedDateISO } : {}),
        ...(updatedDateISO ? { dateModified: updatedDateISO } : {}),
        author: { "@id": `${siteUrl}/#organization` },
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": ["NGO", "Organization"],
        "@id": `${siteUrl}/#organization`,
        name: isDestekol ? identity : "4Relief Humanitarian Foundation",
        alternateName: isDestekol ? ["Destekol", identity] : ["4Relief", "4Relief NGO", "4Relief International Humanitarian Foundation"],
        url: siteUrl,
        ...(!isDestekol ? { legalName: "FOR RELIEF LTD", identifier: { "@type": "PropertyValue", propertyID: "Companies House company number", value: "17306194" }, sameAs: [COMPANY_RECORD_URL] } : {}),
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}${isDestekol ? "/brand/destekol-logo.png" : "/brand/logo.png"}`,
        },

        ...(!isDestekol ? { areaServed: [
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
        ] } : {}),
        knowsAbout: [
          "Humanitarian Relief",
          "Emergency Aid",
          "Financial Governance",
          "Zakat Inquiries",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: officialEmail(isDestekol),
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
    isHomePage: true,
    locale,
    dict,
    primaryColor,
    accentColor,
    campaigns,
    kindnessCampaigns: data.kindnessCampaigns || [],
    posts,
    stats,
    settings,
    isDestekol,
  };

  return (
    <div className="home-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(homeSchema),
        }}
      />

      {/* استخدام BlockRenderer لتصيير جميع الأقسام ديناميكياً */}
      {sections.map((section: any) => (
        <div key={section.id} className={`home-section home-section--${section.type}`}><BlockRenderer section={section} context={context} /></div>
      ))}
      
      {!isDestekol && <div className="home-section"><HomeTrustContent locale={locale} siteUrl={siteUrl} /></div>}
      {isDestekol && <div className="home-section"><DestekolAnswers locale={locale} /></div>}

      {/* عرض مكون الدردشة بشكل منفصل إذا كان يجب أن يظهر دائماً */}
      <ChatWidget key={locale} locale={locale} />
    </div>
  );
}
