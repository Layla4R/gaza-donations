import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";
import { loadTranslations } from "@/lib/i18n";
import { getCampaignDetails } from "@/lib/services/campaign.service";
import CampaignCard from "@/components/blocks/CampaignCard";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  const campaign = await getCampaignDetails(params.slug, params.locale);
  if (!campaign) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${siteUrl}/${params.locale}/campaigns/${campaign.slug}`;
  const image = campaign.coverImage || `${siteUrl}/brand/og-image.png`;

  return {
    title: campaign.displayTitle,
    description: campaign.displaySummary,
    alternates: {
      canonical: url,
      languages: {
        "ar": `${siteUrl}/ar/campaigns/${campaign.slug}`,
        "en": `${siteUrl}/en/campaigns/${campaign.slug}`,
        "fr": `${siteUrl}/fr/campaigns/${campaign.slug}`,
        "tr": `${siteUrl}/tr/campaigns/${campaign.slug}`,
      },
    },
    openGraph: {
      title: campaign.displayTitle,
      description: campaign.displaySummary,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: campaign.displayTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.displayTitle,
      description: campaign.displaySummary,
      images: [image],
    },
  };
}

export default async function CampaignDetailPage({ params }: { params: { slug: string; locale: string } }) {
  const { slug, locale } = params;

  const [campaign, dict] = await Promise.all([
    getCampaignDetails(slug, locale),
    loadTranslations(locale),
  ]);

  if (!campaign) notFound();

  const pct = Math.min(100, Math.round((Number(campaign.raisedAmount) / (Number(campaign.goalAmount) || 1)) * 100));

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      {/* Cover Image */}
      {campaign.coverImage && (
        <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden bg-cream mb-8 shadow-xl">
          <Image src={campaign.coverImage} alt={campaign.displayTitle} fill className="object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Content) */}
        <div className="md:col-span-2">
          <h1 className="font-display text-3xl font-extrabold text-ink mb-4">
            {campaign.displayTitle}
          </h1>
          
          <div className="w-full bg-line rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-brand h-3 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          
          <div className="flex justify-between text-sm mb-6">
            <span className="font-bold text-brand text-lg">
              {formatCurrency(Number(campaign.raisedAmount), "USD")}
            </span>
            <span className="text-muted">
              {pct}% {dict["campaigns.of_goal"]} {formatCurrency(Number(campaign.goalAmount), "USD")}
            </span>
          </div>
          
          <p className="text-ink/80 leading-loose whitespace-pre-line mb-8">
            {campaign.displayDescription}
          </p>

          {/* Updates Section */}
          {campaign.updates && campaign.updates.length > 0 && (
            <div className="space-y-4 mt-8">
              <h2 className="font-display font-bold text-ink text-xl">
                {dict["campaigns.updates"] || "التحديثات"}
              </h2>
              {campaign.updates.map((u: any) => (
                <div key={u.id} className="border border-line rounded-xl p-4 bg-cream/50">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-ink">{u.title}</h3>
                    <span className="text-xs text-muted">{new Date(u.createdAt).toLocaleDateString(locale)}</span>
                  </div>
                  <p className="text-muted text-sm">{u.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Donation Widget / Card) */}
        <div className="md:sticky md:top-28 md:self-start">
          <CampaignCard
            id={campaign.id}
            slug={campaign.slug}
            title={campaign.displayTitle}
            summary={campaign.displaySummary}
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