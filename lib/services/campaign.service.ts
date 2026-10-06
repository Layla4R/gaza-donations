import { localizePublicContent } from "@/lib/public-content-localization";
// lib/services/campaign.service.ts
import { getSupabaseOrNull } from "@/lib/supabase";
import { cache } from "react";
export async function getActiveCampaigns(locale: string) {
    const supabase = getSupabaseOrNull();
    if (!supabase)
        return localizePublicContent([], locale);
    const { data: campaigns } = await supabase
        .from("Campaign")
        .select("id, slug, title, summary, coverImage, goalAmount, raisedAmount, donorCount, category, isFeatured")
        .eq("isActive", true)
        .order("isFeatured", { ascending: false });
    if (!campaigns || campaigns.length === 0)
        return localizePublicContent([], locale);
    if (locale === "ar")
        return localizePublicContent(campaigns, locale);
    const ids = campaigns.map((c) => c.id);
    const { data: translations } = await supabase
        .from("CampaignTranslation")
        .select("campaignId, title, summary")
        .eq("locale", locale)
        .in("campaignId", ids);
    if (translations && translations.length > 0) {
        const transMap = new Map(translations.map((t) => [t.campaignId, t]));
        return localizePublicContent(campaigns.map((c) => {
            const t = transMap.get(c.id);
            return t ? { ...c, title: t.title, summary: t.summary } : c;
        }), locale);
    }
    return localizePublicContent(campaigns, locale);
}
export const getCampaignDetails = cache(async (slug: string, locale: string) => {
    const supabase = getSupabaseOrNull();
    if (!supabase)
        return localizePublicContent(null, locale);
    const { data: campaign } = await supabase
        .from("Campaign")
        .select("*")
        .eq("slug", slug)
        .eq("isActive", true)
        .maybeSingle();
    if (!campaign)
        return localizePublicContent(null, locale);
    let displayTitle = campaign.title;
    let displaySummary = campaign.summary;
    let displayDescription = campaign.description;
    let displayAuthorName = campaign.authorName;
    let displayAuthorRole = campaign.authorRole;
    if (locale !== "ar") {
        const { data: trans } = await supabase
            .from("CampaignTranslation")
            .select("title, summary, description, authorName, authorRole")
            .eq("campaignId", campaign.id)
            .eq("locale", locale)
            .maybeSingle();
        if (trans) {
            if (trans.title)
                displayTitle = trans.title;
            if (trans.summary)
                displaySummary = trans.summary;
            if (trans.description)
                displayDescription = trans.description;
            if (trans.authorName)
                displayAuthorName = trans.authorName;
            if (trans.authorRole)
                displayAuthorRole = trans.authorRole;
        }
    }
    const { data: updates } = await supabase
        .from("CampaignUpdate")
        .select("*")
        .eq("campaignId", campaign.id)
        .order("createdAt", { ascending: false });
    return localizePublicContent({
        ...campaign,
        displayTitle,
        displaySummary,
        displayDescription,
        displayAuthorName,
        displayAuthorRole,
        updates: updates || [],
    }, locale);
});
