"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/icons";
import { useRouter } from "next/navigation";

export default function LoginClient({ locale, dict: D }: { locale: string; dict: Record<string, string> }) {
  const router = useRouter();
  const p = locale === "ar" ? "" : `/${locale}`;
  const [tab, setTab] = useState<"login"|"register">("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", country:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch("/api/donor/login", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ email: form.email, password: form.password }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      router.push(`${p}/account`); router.refresh();
    } catch(e: any) { setError(e.message); } finally { setLoading(false); }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError(D["auth.password_mismatch"] || "Mismatch"); return; }
    if (form.password.length < 8) { setError(D["auth.password_short"] || "Too short"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/donor/register", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name:form.name, email:form.email, password:form.password, country:form.country }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setSuccess(D["auth.register_success"] || "Done!");
    } catch(e: any) { setError(e.message); } finally { setLoading(false); }
  }

  const inp = "w-full rounded-xl border border-line bg-cream py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-section-gradient px-6 py-16 overflow-hidden">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-line p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <Link href={`${p}/`}><Image src="/brand/logo-horizontal-transparent.png" alt="4Relief" width={180} height={72} className="h-11 w-auto object-contain mx-auto mb-5" /></Link>
          <h1 className="font-display text-2xl font-extrabold text-ink">{tab === "login" ? D["auth.login"] : D["auth.register"]}</h1>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-line mb-6 text-sm font-bold">
          <button onClick={() => { setTab("login"); setError(""); setSuccess(""); }} className={`flex-1 py-2.5 transition ${tab==="login" ? "bg-brand text-white" : "bg-white text-muted hover:bg-beige"}`}>{D["auth.sign_in"]}</button>
          <button onClick={() => { setTab("register"); setError(""); setSuccess(""); }} className={`flex-1 py-2.5 transition ${tab==="register" ? "bg-brand text-white" : "bg-white text-muted hover:bg-beige"}`}>{D["auth.create_account"]}</button>
        </div>
        {success ? (
          <div className="bg-success/10 border border-success/20 rounded-xl p-4 text-center"><Icon name="shield-check" size={28} className="text-success mx-auto mb-2" /><p className="text-success font-semibold text-sm">{success}</p></div>
        ) : (
          <form onSubmit={tab==="login" ? handleLogin : handleRegister} className="space-y-4">
            {tab==="register" && <>
              <div><label className="block text-sm text-muted mb-1.5">{D["auth.name"]} *</label><input required value={form.name} onChange={e => set("name", e.target.value)} className={inp} /></div>
              <div><label className="block text-sm text-muted mb-1.5">{D["auth.country"]}</label><input value={form.country} onChange={e => set("country", e.target.value)} className={inp} /></div>
            </>}
            <div><label className="block text-sm text-muted mb-1.5">{D["auth.email"]} *</label><input required type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inp} /></div>
            <div><label className="block text-sm text-muted mb-1.5">{D["auth.password"]} *</label><input required type="password" value={form.password} onChange={e => set("password", e.target.value)} className={inp} /></div>
            {tab==="register" && <div><label className="block text-sm text-muted mb-1.5">{D["auth.confirm_password"]} *</label><input required type="password" value={form.confirm} onChange={e => set("confirm", e.target.value)} className={inp} /></div>}
            {tab==="login" && <div className="text-left"><Link href={`${p}/forgot-password`} className="text-xs text-brand hover:underline">{D["auth.forgot_password"]}</Link></div>}
            {error && <p className="flex items-center gap-2 text-danger text-sm bg-danger/10 border border-danger/20 rounded-xl p-3"><Icon name="x" size={14} />{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white font-bold rounded-xl py-3.5 transition disabled:opacity-60">
              {loading ? "..." : tab==="login" ? D["auth.sign_in"] : D["auth.create_account"]}
            </button>
          </form>
        )}
        <p className="text-center text-xs text-muted mt-5"><Link href="/admin/login" className="text-brand hover:underline">{D["auth.admin_login"]}</Link></p>
      </div>
    </div>
  );
}
