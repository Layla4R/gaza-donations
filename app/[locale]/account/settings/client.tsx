"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/icons";

export default function SettingsClient({ locale, dict: D }: { locale: string; dict: Record<string, string> }) {
  const router = useRouter();
  const p = locale === "ar" ? "" : `/${locale}`;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:"", country:"", curPw:"", newPw:"", confirm:"" });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/donor/me").then(r => r.json()).then(d => {
      if (!d.user) { router.push(`${p}/login`); return; }
      setForm(f => ({ ...f, name: d.user.name || "", country: d.user.country || "" }));
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (form.newPw && form.newPw !== form.confirm) { setStatus({ ok:false, msg: D["auth.password_mismatch"] || "Mismatch" }); return; }
    setSaving(true); setStatus(null);
    const res = await fetch("/api/donor/profile", { method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name:form.name, country:form.country, currentPassword:form.curPw||undefined, newPassword:form.newPw||undefined }) });
    const d = await res.json();
    setStatus(d.ok ? { ok:true, msg: D["account.saved"] || "Saved!" } : { ok:false, msg: d.error || "Error" });
    if (d.ok) setForm(f => ({ ...f, curPw:"", newPw:"", confirm:"" }));
    setSaving(false);
  }

  const inp = "w-full rounded-xl border border-line bg-cream py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30";
  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-muted">{D["common.loading"]}</div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`${p}/account`} className="text-muted hover:text-ink"><Icon name="arrow-left" size={20} /></Link>
        <h1 className="font-display text-2xl font-extrabold text-ink">{D["account.settings"]}</h1>
      </div>
      <form onSubmit={save} className="space-y-6">
        <div className="bg-white rounded-xl2 border border-line p-6 space-y-4">
          <div><label className="block text-sm text-muted mb-1.5">{D["auth.name"]}</label><input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} className={inp} /></div>
          <div><label className="block text-sm text-muted mb-1.5">{D["auth.country"]}</label><input value={form.country} onChange={e => setForm(f=>({...f,country:e.target.value}))} className={inp} /></div>
        </div>
        <div className="bg-white rounded-xl2 border border-line p-6 space-y-4">
          <h2 className="text-xs text-muted font-bold uppercase tracking-wider">{D["account.current_password"]}</h2>
          <div><label className="block text-sm text-muted mb-1.5">{D["account.current_password"]}</label><input type="password" value={form.curPw} onChange={e => setForm(f=>({...f,curPw:e.target.value}))} className={inp} /></div>
          <div><label className="block text-sm text-muted mb-1.5">{D["account.new_password"]}</label><input type="password" value={form.newPw} onChange={e => setForm(f=>({...f,newPw:e.target.value}))} className={inp} /></div>
          <div><label className="block text-sm text-muted mb-1.5">{D["account.confirm_password"]}</label><input type="password" value={form.confirm} onChange={e => setForm(f=>({...f,confirm:e.target.value}))} className={inp} /></div>
        </div>
        {status && <div className={`flex items-center gap-2 rounded-xl p-3.5 text-sm font-semibold border ${status.ok ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"}`}><Icon name={status.ok?"check":"x"} size={15}/>{status.msg}</div>}
        <button type="submit" disabled={saving} className="w-full bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3.5 transition disabled:opacity-60 flex items-center justify-center gap-2">
          <Icon name="shield-check" size={16} />{saving ? D["account.saving"] : D["account.save"]}
        </button>
      </form>
    </div>
  );
}
