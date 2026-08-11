import { getSupabaseOrNull } from "@/lib/supabase";
import { getPageBySlug } from "@/lib/pageData";

export async function getHomeData(locale: string) {
  const supabase = getSupabaseOrNull();
  if (!supabase) {
    return {
      page: null,
      settings: null,
      campaigns: [],
      posts: [],
      stats: { total: 0, families: 0 },
      pageSections: [],
    };
  }

  const [page, settingsRes, campaignsRes, postsRes, statsRes] = await Promise.all([
    getPageBySlug("home", locale),
    supabase.from("SiteSettings").select("accentColor, primaryColor, siteName, footerDescription").eq("id", "default").maybeSingle(),
    supabase.from("Campaign").select("id, slug, title, summary, coverImage, goalAmount, raisedAmount, donorCount, category, isFeatured").eq("isActive", true).order("isFeatured", { ascending: false }).limit(12),
    supabase.from("NewsPost").select("id, title, excerpt, coverImage, slug, publishedAt").eq("isPublished", true).order("publishedAt", { ascending: false }).limit(3),
    supabase.rpc("get_dashboard_stats"),
  ]);

  let campaigns = campaignsRes.data || [];

  // 🌟 دمج الترجمات للحملات إذا كانت اللغة غير العربية
  if (locale !== "ar" && campaigns.length > 0) {
    const campaignIds = campaigns.map((c: any) => c.id);
    const { data: translations } = await supabase
      .from("CampaignTranslation")
      .select("campaignId, title, summary, description")
      .in("campaignId", campaignIds)
      .eq("locale", locale);

    if (translations && translations.length > 0) {
      const transMap = new Map(translations.map((t: any) => [t.campaignId, t]));
      campaigns = campaigns.map((campaign: any) => {
        const trans: any = transMap.get(campaign.id);
        if (!trans) return campaign;
        return {
          ...campaign,
          title: trans.title || campaign.title,
          summary: trans.summary || campaign.summary,
        };
      });
    }
  }

  return {
    page,
    pageSections: page?.sections || [],
    settings: settingsRes.data,
    campaigns,
    posts: postsRes.data || [],
    stats: statsRes.data || { total: 0, families: 0 },
  };
}