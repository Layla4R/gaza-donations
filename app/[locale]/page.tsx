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

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  ar: "مؤسسة إنسانية مستقلة نبني جسور العطاء ونحوّل التعاطف الإنساني إلى أثر مستدام من خلال حملات ومشاريع شفافة بنسبة مصاريف إدارية 5%.",
  en: "An independent humanitarian foundation connecting donors with transparent relief campaigns and sustainable humanitarian projects with a 5% admin fee cap.",
  fr: "Une fondation humanitaire indépendante qui relie les donateurs à des campagnes de secours transparentes et à des projets durables.",
  tr: "Bağışçıları şeffaf yardım kampanyaları ve sürdürülebilir insani projelerle buluşturan bağımsız bir insani yardım kuruluşu.",
};

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

  const description =
    cleanSchemaText(settings?.footerDescription) ||
    dict["footer.description"] ||
    DEFAULT_DESCRIPTIONS[locale] ||
    DEFAULT_DESCRIPTIONS.en;

  const currentUrl = `${SITE_URL}/${locale}`;

  return {
    title: siteTitle,
    description,

    alternates: {
      canonical: currentUrl,
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

  const faqSection = sections.find(
    (section: any) => section.type?.toLowerCase() === "faq"
  );

  const rawFaqItems = faqSection?.props?.items || faqSection?.props?.faqs || [];

  const faqItems = Array.isArray(rawFaqItems)
    ? rawFaqItems
        .map((item: any) => ({
          question: cleanSchemaText(item.question || item.q),
          answer: cleanSchemaText(item.answer || item.a),
        }))
        .filter((item) => item.question && item.answer)
    : [];

  const pageUrl = `${SITE_URL}/${locale}`;

  const description =
    cleanSchemaText(settings?.footerDescription) ||
    dict["footer.description"] ||
    DEFAULT_DESCRIPTIONS[locale] ||
    DEFAULT_DESCRIPTIONS.en;

  const publishedDateISO = "2024-01-01T00:00:00.000Z";
  const updatedDateISO = new Date().toISOString();

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
        datePublished: publishedDateISO,
        dateModified: updatedDateISO,
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
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}${isDestekol ? "/brand/desekol_logo.png" : "/brand/logo.png"}`,
        },
        foundingDate: "2026",
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
          email: settings?.contactEmail || (isDestekol ? "info@destekol.org" : "info@forrelief.org"),
          contactType: "customer support",
          availableLanguage: ["Arabic", "English", "French", "Turkish"],
        },
      },
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}/#faq`,
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ]
        : []),
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
    <main suppressHydrationWarning>
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
      
      {/* عرض مكون الدردشة بشكل منفصل إذا كان يجب أن يظهر دائماً */}
      <ChatWidget locale={locale} />
    </main>
  );
}