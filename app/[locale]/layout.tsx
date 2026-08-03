import { notFound } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import SocialSidebar from "@/components/site/SocialSidebar";
import { getSupabaseOrNull } from "@/lib/supabase";
import { LOCALES, LOCALE_DIR, loadTranslations, type Locale } from "@/lib/i18n";

export const revalidate = 0;

export function generateStaticParams() {
  return LOCALES.map(locale => ({ locale }));
}

const SLUG_TO_NAV_LABEL: Record<string, Record<string, string>> = {
  "about":                  { ar:"من نحن",      en:"About Us",    fr:"À Propos",      tr:"Hakkımızda"   },
  "about-us":               { ar:"من نحن",      en:"About Us",    fr:"À Propos",      tr:"Hakkımızda"   },
  "contact":                { ar:"اتصل بنا",    en:"Contact",     fr:"Contact",        tr:"İletişim"     },
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

  // Translate nav items
  let pages = pagesRes.map((page: any) => {
    const labels = SLUG_TO_NAV_LABEL[page.slug];
    if (labels && locale !== "ar") return { ...page, title: labels[locale] || labels.en };
    if (labels && locale === "ar") return { ...page, title: labels.ar };
    return page;
  });

  // Try PageTranslation table
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
  children, params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!LOCALES.includes(locale as Locale)) notFound();
  const { pages, settings, dict } = await getSiteData(locale);
  const dir = LOCALE_DIR[locale as Locale] || "rtl";

  return (
    <div dir={dir} lang={locale} className="flex flex-col min-h-screen">
      {/* Header is fixed/transparent — always rendered */}
      <SiteHeader navItems={pages} settings={settings} locale={locale} dict={dict} transparent={true} />
      {/* pt-0 because header is fixed and hero handles top spacing */}
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
