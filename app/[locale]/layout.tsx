import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next";
import { headers } from "next/headers";

import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import SocialSidebar from "@/components/site/SocialSidebar";
import CookieBanner from "@/components/site/CookieBanner";

import { getSupabaseOrNull } from "@/lib/supabase";
import {
  LOCALES,
  loadTranslations,
  type Locale,
} from "@/lib/i18n";

export const revalidate = 300;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}

const LOCALE_METADATA: Record<
  string,
  {
    title: (brand: string) => string;
    description: string;
    ogLocale: string;
  }
> = {
  ar: {
    title: (brand) => `${brand} | منظمة إغاثة وإنسانية دولية (Humanitarian Foundation)`,
    description:
      "نبني جسور العطاء ونحوّل التعاطف الإنساني إلى أثر مستدام من خلال حملات ومشاريع إنسانية شفافة.",
    ogLocale: "ar_AR",
  },

  en: {
    title: (brand) => `${brand} | International Humanitarian Foundation & Emergency Relief`,
    description:
      "Connects donors with transparent humanitarian campaigns and sustainable relief projects worldwide.",
    ogLocale: "en_US",
  },

  fr: {
    title: (brand) => `${brand} | Fondation Humanitaire Internationale & Secours d'Urgence`,
    description:
      "Relie les donateurs à des campagnes humanitaires transparentes et à des projets durables.",
    ogLocale: "fr_FR",
  },

  tr: {
    title: (brand) => `${brand} | Uluslararası İnsani Yardım Vakfı`,
    description:
      "Bağışçıları şeffaf insani yardım kampanyaları ve sürdürülebilir projelerle buluşturur.",
    ogLocale: "tr_TR",
  },
};

async function getDomainInfo() {
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

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const { siteUrl, brandName, fullName } = await getDomainInfo();

  const localeData =
    LOCALE_METADATA[locale] ||
    LOCALE_METADATA.en;

  const currentUrl = `${siteUrl}/${locale}`;
  const titleText = localeData.title(brandName);

  return {
    title: {
      default: titleText,
      template: `%s | ${fullName}`,
    },

    description: localeData.description,

    alternates: {
      canonical: currentUrl,

      languages: {
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
        fr: `${siteUrl}/fr`,
        tr: `${siteUrl}/tr`,
        "x-default": `${siteUrl}/en`,
      },
    },

    openGraph: {
      type: "website",
      url: currentUrl,
      siteName: fullName,
      title: titleText,
      description: localeData.description,
      locale: localeData.ogLocale,
    },

    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: localeData.description,
    },
  };
}

const SLUG_TO_NAV_LABEL: Record<
  string,
  Record<string, string>
> = {
  about: { ar: "من نحن", en: "About Us", fr: "À Propos", tr: "Hakkımızda" },
  "about-us": { ar: "من نحن", en: "About Us", fr: "À Propos", tr: "Hakkımızda" },
  contact: { ar: "اتصل بنا", en: "Contact", fr: "Contact", tr: "İletişim" },
  transparency: { ar: "الشفافية", en: "Transparency", fr: "Transparence", tr: "Şeffaflık" },
  "financial-transparency": { ar: "الشفافية", en: "Transparency", fr: "Transparence", tr: "Şeffاflık" },
  "how-we-work": { ar: "كيف نعمل", en: "How We Work", fr: "Comment ça marche", tr: "Nasıl Çalışırız" },
};

async function getSiteData(locale: string) {
  const supabase = getSupabaseOrNull();

  if (!supabase) {
    return {
      pages: [],
      settings: null,
      dict: {},
    };
  }

  const [pagesRes, settings, dict] = await Promise.all([
    supabase
      .from("Page")
      .select("id,slug,title")
      .eq("isPublished", true)
      .eq("showInMenu", true)
      .order("order", { ascending: true })
      .then((result) => result.data || []),

    supabase
      .from("SiteSettings")
      .select("*")
      .eq("id", "default")
      .maybeSingle()
      .then((result) => result.data),

    loadTranslations(locale),
  ]);

  let pages = pagesRes.map((page: any) => {
    const labels = SLUG_TO_NAV_LABEL[page.slug];
    if (!labels) return page;

    return {
      ...page,
      title: labels[locale] || labels.en || page.title,
    };
  });

  if (locale !== "ar" && pagesRes.length > 0) {
    try {
      const ids = pagesRes.map((page: any) => page.id);
      const { data: translations } = await supabase
        .from("PageTranslation")
        .select("pageId,title")
        .eq("locale", locale)
        .in("pageId", ids);

      if (translations?.length) {
        const translationMap: Record<string, string> = {};
        for (const translation of translations) {
          translationMap[translation.pageId] = translation.title;
        }

        pages = pages.map((page: any) => ({
          ...page,
          title: translationMap[page.id] || page.title,
        }));
      }
    } catch {
      // Use original titles
    }
  }

  return { pages, settings, dict };
}

function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function buildSiteSchemas(
  locale: string, 
  settings: any, 
  localeData: { description: string }, 
  siteUrl: string, 
  fullName: string, 
  brandName: string,
  isDestekol: boolean
) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["NGO", "Organization"],
    "@id": `${siteUrl}/#organization`,
    name: fullName,
    alternateName: isDestekol ? ["Destekol", "Destekol NGO"] : ["4Relief", "4Relief NGO", "4Relief International Humanitarian Foundation"],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}${isDestekol ? "/brand/desekol_logo.jpeg" : "/brand/logo.png"}`,
    },
    description: localeData.description,
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
    sameAs: [
      settings?.facebookUrl,
      settings?.twitterUrl,
      settings?.instagramUrl,
      settings?.linkedinUrl,
      settings?.youtubeUrl,
      "https://find-and-update.company-information.service.gov.uk/",
    ].filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: fullName,
    inLanguage: locale,
    publisher: { "@id": `${siteUrl}/#organization` },
  };

  return { organizationSchema, websiteSchema };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const { isDestekol, siteUrl, brandName, fullName } = await getDomainInfo();
  const { pages, settings, dict } = await getSiteData(locale);
  const localeData = LOCALE_METADATA[locale] || LOCALE_METADATA.en;
  
  const { organizationSchema, websiteSchema } = buildSiteSchemas(
    locale, 
    settings, 
    localeData, 
    siteUrl, 
    fullName, 
    brandName, 
    isDestekol
  );

  const pixelId = settings?.facebookPixelId;
  const gaId = settings?.gaMeasurementId;

  return (
    <div className="flex min-h-screen flex-col">
      {pixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('consent', 'revoke');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteSchema) }} />

      <SiteHeader navItems={pages} settings={settings} locale={locale} dict={dict} transparent={true} />
      <CookieBanner locale={locale} />

      <main className="flex-1 pt-20">{children}</main>

      <SiteFooter navItems={pages} settings={settings} locale={locale} dict={dict} />
      <WhatsAppButton phone={settings?.whatsappNumber} />

      <SocialSidebar
        whatsapp={settings?.whatsappNumber}
        facebook={settings?.facebookUrl}
        twitter={settings?.twitterUrl}
        instagram={settings?.instagramUrl}
        tiktok={settings?.tiktokUrl}
        youtube={settings?.youtubeUrl}
        linkedin={settings?.linkedinUrl}
        position={(settings?.socialPosition as "left" | "right") || "right"}
      />
    </div>
  );
}