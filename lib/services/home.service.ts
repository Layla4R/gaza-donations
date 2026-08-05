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
supabase.from("SiteSettings").select("accentColor, primaryColor, siteName, footerDescription").eq("id", "default").maybeSingle(),    supabase.from("Campaign").select("id, slug, title, summary, coverImage, goalAmount, raisedAmount, donorCount, category, isFeatured").eq("isActive", true).order("isFeatured", { ascending: false }).limit(12),
    supabase.from("NewsPost").select("id, title, excerpt, coverImage, slug, publishedAt").eq("isPublished", true).order("publishedAt", { ascending: false }).limit(3),
    supabase.rpc("get_dashboard_stats"),
  ]);

  return {
    page,
    pageSections: page?.sections || [],
    settings: settingsRes.data,
    campaigns: campaignsRes.data || [],
    posts: postsRes.data || [],
    stats: statsRes.data || { total: 0, families: 0 },
  };
}