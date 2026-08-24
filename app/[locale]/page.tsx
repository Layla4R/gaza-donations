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

const SITE_URL = "https://forrelief.org";

interface PageProps {
  params: {
    locale: string;
  };
}

const DEFAULT_DESCRIPTIONS: Record<
  string,
  string
> = {
  ar: "مؤسسة إنسانية مستقلة نبني جسور العطاء ونحوّل التعاطف الإنساني إلى أثر مستدام من خلال حملات ومشاريع شفافة.",
  en: "An independent humanitarian foundation connecting donors with transparent relief campaigns and sustainable humanitarian projects.",
  fr: "Une fondation humanitaire indépendante qui relie les donateurs à des campagnes de secours transparentes et à des projets durables.",
  tr: "Bağışçıları şeffaf yardım kampanyaları ve sürdürülebilir insani projelerle buluşturan bağımsız bir insani yardım kuruluşu.",
};

function cleanSchemaText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = params;

  const [
    dict,
    data,
  ] = await Promise.all([
    loadTranslations(locale),
    getHomeData(locale),
  ]);

  const settings: any =
    data?.settings || {};

  const siteName =
    settings?.siteName ||
    "4Relief Humanitarian Foundation";

  const description =
    cleanSchemaText(
      settings?.footerDescription
    ) ||
    dict["footer.description"] ||
    DEFAULT_DESCRIPTIONS[locale] ||
    DEFAULT_DESCRIPTIONS.en;

  const currentUrl =
    `${SITE_URL}/${locale}`;

  return {
    title: siteName,
    description,

    alternates: {
      canonical: currentUrl,
    },

    openGraph: {
      type: "website",
      url: currentUrl,
      siteName: "4Relief",
      title: siteName,
      description,
    },

    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
    },
  };
}

export default async function HomePage({
  params,
}: PageProps) {
  const { locale } = params;

  const [
    dict,
    homeData,
  ] = await Promise.all([
    loadTranslations(locale),
    getHomeData(locale),
  ]);

  const data: any =
    homeData || {};

  const settings: any =
    data.settings || {};

  const campaigns =
    data.campaigns || [];

  const posts =
    data.posts || [];

  const stats =
    data.stats || {
      total: 0,
      families: 0,
    };

  const pageSections =
    data.pageSections || [];

  const sections = Array.isArray(
    pageSections
  )
    ? pageSections
    : [];

  const heroImage =
    settings?.heroImage || null;

  const primaryColor =
    settings?.primaryColor ||
    "#0069D2";

  const accentColor =
    settings?.accentColor ||
    "#F00F5A";

  let rawSlides: any[] = [];

  if (settings?.heroSlides) {
    try {
      rawSlides =
        typeof settings.heroSlides ===
        "string"
          ? JSON.parse(
              settings.heroSlides
            )
          : settings.heroSlides;
    } catch {
      rawSlides = [];
    }
  }

  const faqSection = sections.find(
    (section: any) =>
      section.type
        ?.toLowerCase() === "faq"
  );

  const rawFaqItems =
    faqSection?.props?.items ||
    faqSection?.props?.faqs ||
    [];

  const faqItems = Array.isArray(
    rawFaqItems
  )
    ? rawFaqItems
        .map((item: any) => ({
          question: cleanSchemaText(
            item.question ||
            item.q
          ),

          answer: cleanSchemaText(
            item.answer ||
            item.a
          ),
        }))
        .filter(
          (item) =>
            item.question &&
            item.answer
        )
    : [];

  const pageUrl =
    `${SITE_URL}/${locale}`;

  const description =
    cleanSchemaText(
      settings?.footerDescription
    ) ||
    dict["footer.description"] ||
    DEFAULT_DESCRIPTIONS[locale] ||
    DEFAULT_DESCRIPTIONS.en;

  /*
   * الصفحة الرئيسية فقط.
   * Organization و WebSite موجودان في Root Layout.
   */

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",

    "@id": `${pageUrl}/#webpage`,

    url: pageUrl,

    name:
      settings?.siteName ||
      "4Relief Humanitarian Foundation",

    description,

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
  };

  const faqSchema =
    faqItems.length > 0
      ? {
          "@context":
            "https://schema.org",

          "@type":
            "FAQPage",

          "@id":
            `${pageUrl}/#faq`,

          mainEntity:
            faqItems.map(
              (item) => ({
                "@type":
                  "Question",

                name:
                  item.question,

                acceptedAnswer: {
                  "@type":
                    "Answer",

                  text:
                    item.answer,
                },
              })
            ),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            homeSchema
          ).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                faqSchema
              ).replace(
                /</g,
                "\\u003c"
              ),
          }}
        />
      )}

      {sections.map(
        (section: any) => {
          const sectionData =
            section.props || {};

          switch (
            section.type?.toLowerCase()
          ) {
            case "hero": {
              const sliderSlides =
                rawSlides.map(
                  (
                    slide: any,
                    index: number
                  ) => {
                    if (
                      index === 0 &&
                      section.props
                    ) {
                      return {
                        ...slide,

                        image:
                          sectionData.backgroundImage ||
                          slide.image,

                        title_ar:
                          sectionData.title ||
                          slide.title_ar,

                        title_en:
                          sectionData.title ||
                          slide.title_en,

                        subtitle_ar:
                          sectionData.subtitle ||
                          slide.subtitle_ar,

                        subtitle_en:
                          sectionData.subtitle ||
                          slide.subtitle_en,
                      };
                    }

                    return slide;
                  }
                );

              return (
                <HeroSection
                  key={section.id}
                  locale={locale}
                  dict={dict}
                  heroImage={heroImage}
                  heroSlides={
                    sliderSlides
                  }
                  accentColor={
                    accentColor
                  }
                  primaryColor={
                    primaryColor
                  }
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
                  accentColor={
                    accentColor
                  }
                  primaryColor={
                    primaryColor
                  }
                  data={sectionData}
                />
              );

            case "stats":
              return (
                <AchievementsSection
                  key={section.id}
                  locale={locale}
                  dict={dict}
                  totalRaised={
                    stats?.total || 0
                  }
                  totalFamilies={
                    stats?.families || 0
                  }
                  data={sectionData}
                  accentColor={
                    accentColor
                  }
                  primaryColor={
                    primaryColor
                  }
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
                  accentColor={
                    accentColor
                  }
                  primaryColor={
                    primaryColor
                  }
                  data={sectionData}
                />
              );

            case "chat_widget":
              return (
                <ChatWidget
                  key={section.id}
                  locale={locale}
                />
              );

            default:
              return null;
          }
        }
      )}
    </>
  );
}