import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import CampaignForm from "@/components/admin/CampaignForm";

export default async function NewCampaignPage() {
  try { await requireAdmin(); } catch { redirect("/admin/login"); }
  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-extrabold text-ink mb-6">New Campaign</h1>
      <CampaignForm />
    </div>
  );
}
