import { getSupabaseOrNull } from "@/lib/supabase";
import { loadTranslations } from "@/lib/i18n";
import CampaignCard from "@/components/blocks/CampaignCard";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const dict = await loadTranslations(locale);
  const title = dict["campaigns.page_title"] || (locale === "ar" ? "الحملات النشطة" : locale === "fr" ? "Campagnes Actives" : locale === "tr" ? "Aktif Kampanyalar" : "Active Campaigns");
  const description = dict["campaigns.page_desc"] || (locale === "ar" ? "ادعم حملاتنا الإنسانية وساعد الأسر المحتاجة حول العالم" : "Support our humanitarian campaigns and help families in need around the world");
  return { title, description, openGraph: { title, description } };
}

export default async function CampaignsPage({ params: { locale } }: { params: { locale: string } }) {
  const supabase = getSupabaseOrNull();
  const [campaignsRes, dict] = await Promise.all([
    supabase ? supabase.from("Campaign").select("*").eq("isActive", true).order("isFeatured", { ascending: false }) : Promise.resolve({ data: [] }),
    loadTranslations(locale),
  ]);
  const campaigns = campaignsRes?.data || [];

  // Load translations for all campaigns if non-Arabic
  let translatedCampaigns = campaigns;
  if (locale !== "ar" && supabase && campaigns.length > 0) {
    const ids = campaigns.map((c: any) => c.id);
    const { data: translations } = await supabase
      .from("CampaignTranslation")
      .select("campaignId, title, summary")
      .eq("locale", locale)
      .in("campaignId", ids);

    if (translations && translations.length > 0) {
      const transMap: Record<string, any> = {};
      for (const t of translations) transMap[t.campaignId] = t;
      translatedCampaigns = campaigns.map((c: any) => {
        const t = transMap[c.id];
        return t ? { ...c, title: t.title, summary: t.summary } : c;
      });
    }
  }

  const p = locale === "ar" ? "" : `/${locale}`;

  return (
    <div>
      <header className="relative py-16 sm:py-20 bg-brand-gradient text-center overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full border border-white/10 hidden sm:block" />
        <div className="relative max-w-screen-xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 text-white/70 font-display font-semibold text-xs tracking-[0.3em] uppercase mb-4">
            <span className="inline-block w-6 h-px bg-white/40" />4Relief
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            {dict["campaigns.title"]}
          </h1>
          <p className="mt-4 text-white/75 text-lg">{dict["campaigns.subtitle"]}</p>
        </div>
      </header>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {translatedCampaigns.length === 0
          ? <p className="text-center text-muted py-20">{dict["campaigns.no_campaigns"]}</p>
          : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {translatedCampaigns.map((c: any) => (
                <CampaignCard key={c.id} {...c} locale={locale} dict={dict} />
              ))}
            </div>
        }
      </div>
    </div>
  );
}
