import { formatCurrency } from "@/lib/format";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import CampaignForm from "@/components/admin/CampaignForm";
import CampaignUpdatesPanel from "@/components/admin/CampaignUpdatesPanel";
import CampaignTranslationsPanel from "@/components/admin/CampaignTranslationsPanel";
import Link from "next/link";
import Icon from "@/components/icons";

export const revalidate = 0;

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }
  const supabase = getSupabase();
  const [{ data: campaign }, { data: updates }, { data: topDonations }] = await Promise.all([
    supabase.from("Campaign").select("*").eq("id", params.id).maybeSingle(),
    supabase.from("CampaignUpdate").select("*").eq("campaignId", params.id).order("createdAt", { ascending: false }),
    supabase.from("Donation").select("id, donorName, donorEmail, amount, currency, isAnonymous, createdAt, status")
      .eq("campaignId", params.id).eq("status", "COMPLETED")
      .order("amount", { ascending: false }).limit(10),
  ]);
  if (!campaign) notFound();

  return (
    <div className="p-6 sm:p-8 max-w-3xl space-y-8">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href="/admin/campaigns" className="text-muted hover:text-ink"><Icon name="arrow-left" size={18} /></Link>
        <h1 className="font-display text-2xl font-extrabold text-ink flex-1">Edit Campaign</h1>
        <a href={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/campaigns/${campaign.slug}`} target="_blank"
          className="flex items-center gap-1.5 text-xs border border-line text-muted rounded-lg px-3 py-2 hover:border-brand hover:text-brand transition">
          <Icon name="globe" size={13} /> View Live
        </a>
      </div>
      <CampaignForm initial={{
        id: campaign.id, title: campaign.title, slug: campaign.slug,
        summary: campaign.summary, description: campaign.description,
        coverImage: campaign.coverImage, goalAmount: campaign.goalAmount,
        defaultAmount: campaign.defaultAmount, category: campaign.category,
        country: campaign.country, isActive: campaign.isActive,
        isFeatured: campaign.isFeatured, isZakatable: campaign.isZakatable,
      }} />
      {/* Content Translations */}
      <CampaignTranslationsPanel
        campaignId={campaign.id}
        baseTitle={campaign.title}
        baseSummary={campaign.summary}
        baseDescription={campaign.description}
      />
      <CampaignUpdatesPanel campaignId={params.id} updates={updates || []} donorCount={campaign.donorCount || 0} />

      {/* Top Donors */}
      {topDonations && topDonations.length > 0 && (
        <div className="bg-white rounded-xl2 border border-line overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-line">
            <h2 className="font-display font-bold text-ink">Top Donors</h2>
            <Link href={`/admin/donations?campaign=${campaign.id}`} className="text-brand text-sm hover:underline">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-dashbg text-muted text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left py-3 px-4">Donor</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {topDonations.map((d: any) => (
                <tr key={d.id} className="hover:bg-dashbg/50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{d.isAnonymous ? "Anonymous" : d.donorName}</div>
                    {!d.isAnonymous && <div className="text-xs text-muted">{d.donorEmail}</div>}
                  </td>
                  <td className="py-3 px-4 font-bold text-brand">{formatCurrency(Number(d.amount), (d.currency || "usd").toUpperCase())}</td>
                  <td className="py-3 px-4 text-muted text-xs">{new Date(d.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
