import { getSupabaseOrNull, getSupabase } from "./supabase";

export interface PageData {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  sections: any[];
}

export interface CampaignLite {
  id: string;
  slug: string;
  title: string;
  summary: string;
  coverImage: string | null;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  isFeatured?: boolean;
  category?: string;
}

/**
 * Get a page for a given slug and locale.
 * Priority: PageTranslation[locale] → Page (base/ar)
 */
export async function getPageBySlug(slug: string, locale = "ar"): Promise<PageData | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data: base } = await supabase
    .from("Page")
    .select("id, slug, title, description, sections")
    .eq("slug", slug)
    .eq("isPublished", true)
    .maybeSingle();

  if (!base) return null;

  // For non-Arabic locales, check for translation
  if (locale !== "ar") {
    const { data: trans } = await supabase
      .from("PageTranslation")
      .select("title, description, sections")
      .eq("pageId", base.id)
      .eq("locale", locale)
      .maybeSingle();

    if (trans) {
      return {
        id: base.id,
        slug: base.slug,
        title: trans.title,
        description: trans.description,
        sections: trans.sections as any[],
      };
    }
  }

  return {
    id: base.id,
    slug: base.slug,
    title: base.title,
    description: base.description,
    sections: base.sections as any[],
  };
}

export async function getCampaignsLite(): Promise<CampaignLite[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  const { data } = await supabase
    .from("Campaign")
    .select("id, slug, title, summary, coverImage, goalAmount, raisedAmount, donorCount, category")
    .eq("isActive", true)
    .order("isFeatured", { ascending: false })
    .limit(6);
  return (data || []) as CampaignLite[];
}
