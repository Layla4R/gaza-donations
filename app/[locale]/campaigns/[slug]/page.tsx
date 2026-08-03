import { notFound } from "next/navigation";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/format";
import { loadTranslations } from "@/lib/i18n";
import CampaignCard from "@/components/blocks/CampaignCard";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const supabase = getSupabase();
  const { data: c } = await supabase
    .from("Campaign")
    .select("title, summary, coverImage, raisedAmount, goalAmount, slug")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!c) return {};

  // Try translated content
  let title = c.title;
  let description = c.summary;
  if (params.locale !== "ar") {
    const { data: trans } = await supabase
      .from("CampaignTranslation")
      .select("title, summary")
      .eq("campaignId", params.slug)
      .eq("locale", params.locale)
      .maybeSingle();
    if (trans?.title) title = trans.title;
    if (trans?.summary) description = trans.summary;
  }

  const url = `${siteUrl}/${params.locale}/campaigns/${c.slug}`;
  const image = c.coverImage || `${siteUrl}/brand/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "ar": `${siteUrl}/ar/campaigns/${c.slug}`,
        "en": `${siteUrl}/en/campaigns/${c.slug}`,
        "fr": `${siteUrl}/fr/campaigns/${c.slug}`,
        "tr": `${siteUrl}/tr/campaigns/${c.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CampaignDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;
  const supabase = getSupabase();

  const [{ data: campaign }, dict] = await Promise.all([
    supabase.from("Campaign").select("*").eq("slug", slug).eq("isActive", true).maybeSingle(),
    loadTranslations(locale),
  ]);

  if (!campaign) notFound();

  // Load translation if non-Arabic
  let displayTitle = campaign.title;
  let displaySummary = campaign.summary;
  let displayDescription = campaign.description;

  if (locale !== "ar") {
    const { data: trans } = await supabase
      .from("CampaignTranslation")
      .select("title, summary, description")
      .eq("campaignId", campaign.id)
      .eq("locale", locale)
      .maybeSingle();
    if (trans) {
      displayTitle = trans.title;
      displaySummary = trans.summary;
      displayDescription = trans.description;
    }
  }

  const { data: updates } = await supabase
    .from("CampaignUpdate").select("*").eq("campaignId", campaign.id).order("createdAt", { ascending: false });

  const pct = Math.min(100, Math.round((Number(campaign.raisedAmount) / (Number(campaign.goalAmount) || 1)) * 100));
  const p = locale === "ar" ? "" : `/${locale}`;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      {campaign.coverImage && (
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-beige mb-8 shadow-xl">
          <Image src={campaign.coverImage} alt={displayTitle} fill className="object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="font-display text-3xl font-extrabold text-ink mb-4">{displayTitle}</h1>
          <div className="w-full bg-line rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-brand h-3 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-sm mb-6">
            <span className="font-bold text-brand text-lg">{formatCurrency(Number(campaign.raisedAmount), "USD")}</span>
            <span className="text-muted">{pct}% {dict["campaigns.of_goal"]} {formatCurrency(Number(campaign.goalAmount), "USD")}</span>
          </div>
          <p className="text-ink/80 leading-loose whitespace-pre-line mb-8">{displayDescription}</p>

          {updates && updates.length > 0 && (
            <div className="space-y-4 mt-8">
              <h2 className="font-display font-bold text-ink text-xl">Updates</h2>
              {updates.map((u: any) => (
                <div key={u.id} className="border border-line rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-ink">{u.title}</h3>
                    <span className="text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-muted text-sm">{u.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          <CampaignCard
            id={campaign.id}
            slug={campaign.slug}
            title={displayTitle}
            summary={displaySummary}
            coverImage={campaign.coverImage}
            goalAmount={Number(campaign.goalAmount)}
            raisedAmount={Number(campaign.raisedAmount)}
            donorCount={campaign.donorCount}
            category={campaign.category}
            locale={locale}
            dict={dict}
          />
        </div>
      </div>
    </div>
  );
}
