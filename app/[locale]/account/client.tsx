"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/icons";

interface Donor { id: string; name: string; email: string; emailVerified: boolean; country?: string; totalDonated: number; donationCount: number; createdAt: string; }

export default function AccountClient({ locale, dict: D }: { locale: string; dict: Record<string, string> }) {
  const router = useRouter();
  const p = locale === "ar" ? "" : `/${locale}`;
  const [donor, setDonor] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const dateLocale = locale === "ar" ? "ar-EG" : locale === "tr" ? "tr-TR" : locale === "fr" ? "fr-FR" : "en-GB";

  useEffect(() => {
    fetch("/api/donor/me").then(r => r.json()).then(d => {
      if (!d.user) { router.push(`${p}/login`); return; }
      setDonor(d.user); setLoading(false);
    });
  }, []);

  async function logout() { await fetch("/api/donor/logout", { method:"POST" }); router.push(`${p}/login`); router.refresh(); }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-muted">{D["common.loading"]}</div>;
  if (!donor) return null;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div><h1 className="font-display text-3xl font-extrabold text-ink">{D["account.welcome"]}, {donor.name}</h1><p className="text-muted">{donor.email}</p></div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-muted hover:text-danger border border-line hover:border-danger rounded-xl px-4 py-2.5 transition">
          <Icon name="log-out" size={16} />{D["account.logout"]}
        </button>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: D["account.total_donated"], value: `$${Number(donor.totalDonated).toFixed(2)}`, icon: "wallet" as const },
          { label: D["account.donations_count"], value: String(donor.donationCount), icon: "heart" as const },
          { label: D["account.member_since"], value: new Date(donor.createdAt).toLocaleDateString(dateLocale, { year:"numeric", month:"long" }), icon: "shield-check" as const },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl2 border border-line p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0"><Icon name={s.icon} size={18} /></div>
            <div><div className="font-display font-extrabold text-xl text-brand">{s.value}</div><div className="text-xs text-muted mt-0.5">{s.label}</div></div>
          </div>
        ))}
      </div>
      {!donor.emailVerified && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Icon name="help-circle" size={18} className="text-warning shrink-0 mt-0.5" />
          <p className="font-semibold text-warning text-sm">{D["account.verify_warning"]}</p>
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href={`${p}/account/donations`} className="bg-white rounded-xl2 border border-line p-6 hover:border-brand hover:shadow-lg transition group">
          <Icon name="heart" size={24} className="text-brand mb-3" />
          <h3 className="font-display font-bold text-ink group-hover:text-brand transition">{D["account.my_donations"]}</h3>
        </Link>
        <Link href={`${p}/campaigns`} className="bg-white rounded-xl2 border border-line p-6 hover:border-accent hover:shadow-lg transition group">
          <Icon name="target" size={24} className="text-accent mb-3" />
          <h3 className="font-display font-bold text-ink group-hover:text-accent transition">{D["account.browse_campaigns"]}</h3>
        </Link>
        <Link href={`${p}/account/settings`} className="bg-white rounded-xl2 border border-line p-6 hover:border-brand hover:shadow-lg transition group">
          <Icon name="settings" size={24} className="text-brand mb-3" />
          <h3 className="font-display font-bold text-ink group-hover:text-brand transition">{D["account.settings"]}</h3>
        </Link>
      </div>
    </div>
  );
}
