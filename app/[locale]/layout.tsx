import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import SocialSidebar from "@/components/site/SocialSidebar";
import { getSupabaseOrNull } from "@/lib/supabase";
import { LOCALES, loadTranslations, type Locale } from "@/lib/i18n";
import CookieBanner from "@/components/site/CookieBanner";

export const revalidate = 0;

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

// 🌟 توليد وسم Canonical الديناميكي لجميع الصفحات المترجمة
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    metadataBase: new URL("https://forrelief.org"),
    alternates: {
      canonical: `https://forrelief.org/${params.locale}`,
      languages: {
        "ar": "https://forrelief.org/ar",
        "en": "https://forrelief.org/en",
        "fr": "https://forrelief.org/fr",
        "tr": "https://forrelief.org/tr",
      },
    },
  };
}

const SLUG_TO_NAV_LABEL: Record<string, Record<string, string>> = {
  "about":                  { ar:"من نحن",      en:"About Us",    fr:"À Propos",      tr:"Hakkımızda"   },
  "about-us":               { ar:"من نحن",      en:"About Us",    fr:"À Propos",      tr:"Hakkımızda"   },
  "contact":                { ar:"اتصل بنا",    en:"Contact",     fr:"Contact",       tr:"İletişim"     },
  "transparency":           { ar:"الشفافية",    en:"Transparency", fr:"Transparence",  tr:"Şeffaflık"    },
  "financial-transparency": { ar:"الشفافية",    en:"Transparency", fr:"Transparence",  tr:"Şeffaflık"    },
  "how-we-work":            { ar:"كيف نعمل",   en:"How We Work",  fr:"Comment ça marche", tr:"Nasıl Çalışırız" },
};

async function getSiteData(locale: string) {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { pages: [], settings: null, dict: {} };

  const [pagesRes, settings, dict] = await Promise.all([
    supabase.from("Page").select("id,slug,title").eq("isPublished",true).eq("showInMenu",true).order("order",{ascending:true}).then(r => r.data || []),
    supabase.from("SiteSettings").select("*").eq("id","default").maybeSingle().then(r => r.data),
    loadTranslations(locale),
  ]);

  let pages = pagesRes.map((page: any) => {
    const labels = SLUG_TO_NAV_LABEL[page.slug];
    if (labels && locale !== "ar") return { ...page, title: labels[locale] || labels.en };
    if (labels && locale === "ar") return { ...page, title: labels.ar };
    return page;
  });

  if (locale !== "ar" && pagesRes.length > 0) {
    try {
      const ids = pagesRes.map((p: any) => p.id);
      const { data: ptrans } = await supabase
        .from("PageTranslation").select("pageId, title").eq("locale", locale).in("pageId", ids);
      if (ptrans?.length) {
        const tm: Record<string, string> = {};
        for (const t of ptrans) tm[t.pageId] = t.title;
        pages = pages.map((p: any) => tm[p.id] ? { ...p, title: tm[p.id] } : p);
      }
    } catch {}
  }

  return { pages, settings, dict };
}

export default async function LocaleLayout({
  children, 
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!LOCALES.includes(locale as Locale)) notFound();
  const { pages, settings, dict } = await getSiteData(locale);

  const pixelId = settings?.facebookPixelId;
  const gaId = settings?.gaMeasurementId;

  const sameAsLinks = [
    settings?.facebookUrl,
    settings?.twitterUrl,
    settings?.instagramUrl,
    settings?.youtubeUrl,
    settings?.linkedinUrl,
    settings?.tiktokUrl,
  ].filter(Boolean);

  // 🌟 الكائنات منفصلة تماماً بدون @graph لتناسب أدوات الفحص المباشر
  const ngoSchema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "4Relief Humanitarian Foundation",
    "alternateName": "4Relief",
    "url": "https://forrelief.org",
    "logo": settings?.logoUrl || "https://forrelief.org/logo.png",
    "description": "An independent humanitarian donation platform dedicated to full transparency and direct relief campaigns.",
    "sameAs": sameAsLinks
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://forrelief.org",
    "name": "4Relief",
    "inLanguage": locale
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* حقن الـ Schema التأسيسية كأكواد مستقلة */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ngoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Meta Pixel Script */}
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

      {/* GA4 Script */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
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
        position={(settings?.socialPosition as "left"|"right") || "right"}
      />
    </div>
  );
}