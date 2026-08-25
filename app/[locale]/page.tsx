import type { Metadata } from "next";

import { loadTranslations } from "@/lib/i18n";
import { getHomeData } from "@/lib/services/home.service";

import HeroSection from "@/components/site/HeroSection";
import CampaignsCarousel from "@/components/site/CampaignsCarousel";
import NewsSection from "@/components/site/NewsSection";
import DonateWidget from "@/components/site/DonateWidget";
import FaqSection from "@/components/site/FaqSection";
import AchievementsSection from "@/components/site/AchievementsSection";
import NewsletterSection from "@/components/site/NewsletterSection";
import AboutOverviewSection from "@/components/blocks/AboutOverviewSection";
import ChatWidget from "@/components/site/ChatWidget";

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

  const [dict, data] = await Promise.all([
    loadTranslations(locale),
    getHomeData(locale),
  ]);

  const settings: any = data?.settings || {};

  const siteTitle =
    OPTIMIZED_HOME_TITLES[locale] ||
    OPTIMIZED_HOME_TITLES.en;

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
      siteName: "4Relief Humanitarian Foundation",
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

  const heroImage = settings?.heroImage || null;
  const primaryColor = settings?.primaryColor || "#0069D2";
  const accentColor = settings?.accentColor || "#F00F5A";

  let rawSlides: any[] = [];

  if (settings?.heroSlides) {
    try {
      rawSlides =
        typeof settings.heroSlides === "string"
          ? JSON.parse(settings.heroSlides)
          : settings.heroSlides;
    } catch {
      rawSlides = [];
    }
  }

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

  /*
   * 🌟 Schema.org Graph الموحدة (محققة 100% في فحص Rich Results)
   */
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: "4Relief | International Humanitarian Foundation & Emergency Relief",
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
        name: "4Relief Humanitarian Foundation",
        alternateName: ["4Relief", "4Relief NGO", "4Relief International Humanitarian Foundation"],
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/brand/logo.png`,
        },
        foundingDate: "2024",
        knowsAbout: [
          "Humanitarian Relief",
          "Emergency Aid",
          "Financial Governance",
          "Zakat Inquiries",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: settings?.contactEmail || "info@forrelief.org",
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

  return (
    <>
      {/* 🌟 Unified Enriched Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(homeSchema),
        }}
      />

      {/* Dynamic Sections Rendering Without Structural Collisions */}
      {sections.map((section: any) => {
        const sectionData = section.props || {};

        switch (section.type?.toLowerCase()) {
          case "hero": {
            const sliderSlides = rawSlides.map((slide: any, index: number) => {
              if (index === 0 && section.props) {
                return {
                  ...slide,
                  image: sectionData.backgroundImage || slide.image,
                  title_ar: sectionData.title || slide.title_ar,
                  title_en: sectionData.title || slide.title_en,
                  subtitle_ar: sectionData.subtitle || slide.subtitle_ar,
                  subtitle_en: sectionData.subtitle || slide.subtitle_en,
                };
              }
              return slide;
            });

            return (
              <HeroSection
                key={section.id}
                locale={locale}
                dict={dict}
                heroImage={heroImage}
                heroSlides={sliderSlides}
                accentColor={accentColor}
                primaryColor={primaryColor}
                data={sectionData}
              />
            );
          }

          case "about_overview":
            return (
              <AboutOverviewSection
                key={section.id}
                data={sectionData}
                locale={locale}
              />
            );

          case "campaigns_grid":
            return (
              <CampaignsCarousel
                key={section.id}
                campaigns={campaigns}
                locale={locale}
                dict={dict}
                data={sectionData}
              />
            );

          case "stories":
            return posts.length > 0 ? (
              <NewsSection
                key={section.id}
                posts={posts}
                locale={locale}
                dict={dict}
                data={sectionData}
              />
            ) : null;

          case "donation_buttons":
            return (
              <DonateWidget
                key={section.id}
                locale={locale}
                dict={dict}
                accentColor={accentColor}
                primaryColor={primaryColor}
                data={sectionData}
              />
            );

          case "stats":
            return (
              <AchievementsSection
                key={section.id}
                locale={locale}
                dict={dict}
                totalRaised={stats?.total || 0}
                totalFamilies={stats?.families || 0}
                data={sectionData}
                accentColor={accentColor}
                primaryColor={primaryColor}
              />
            );

          case "faq":
            return (
              <FaqSection
                key={section.id}
                locale={locale}
                dict={dict}
                data={sectionData}
              />
            );

          case "newsletter":
            return (
              <NewsletterSection
                key={section.id}
                locale={locale}
                dict={dict}
                accentColor={accentColor}
                primaryColor={primaryColor}
                data={sectionData}
              />
            );

          case "chat_widget":
            return <ChatWidget key={section.id} locale={locale} />;

          default:
            return null;
        }
      })}
    </>
  );
}