"use client";
import { adminFetch } from "@/lib/admin-fetch";
import { useState, useEffect } from "react";
import Icon from "@/components/icons";

const LOCALES = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "tr", flag: "🇹🇷", name: "Türkçe" },
];

interface Props {
  postId: string;
  baseTitle: string;
  baseExcerpt: string;
  baseBody: string;
}

export default function NewsPostTranslationsPanel({ postId, baseTitle, baseExcerpt, baseBody }: Props) {
  const [activeLocale, setActiveLocale] = useState("en");
  const [form, setForm] = useState({ title: "", excerpt: "", body: "" });
  const [loading, setLoading] = useState(false);
  const [loadingLocale, setLoadingLocale] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [hasTranslation, setHasTranslation] = useState(false);

  async function loadTranslation(locale: string) {
    setLoadingLocale(true);
    const res = await adminFetch(`/api/admin/news/translations?postId=${postId}&locale=${locale}`);
    const d = await res.json();
    if (d.translation) {
      setForm({ title: d.translation.title, excerpt: d.translation.excerpt, body: d.translation.body });
      setHasTranslation(true);
    } else {
      setForm({ title: baseTitle, excerpt: baseExcerpt, body: baseBody });
      setHasTranslation(false);
    }
    setLoadingLocale(false); // Always reset loading
  }

  useEffect(() => { loadTranslation(activeLocale); }, [activeLocale, postId]);

  async function save() {
    if (!form.title.trim()) return;
    setLoading(true); setStatus(null);
    const res = await adminFetch("/api/admin/news/translations", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, locale: activeLocale, ...form }),
    });
    const d = await res.json();
    if (d.translation) { setStatus({ ok: true, msg: "Translation saved!" }); setHasTranslation(true); setIsDirty(false); }
    else setStatus({ ok: false, msg: d.error || "Error" });
    setLoading(false);
  }

  async function deleteTranslation() {
    if (!confirm("Delete this translation?")) return;
    await adminFetch("/api/admin/news/translations", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, locale: activeLocale }),
    });
    setForm({ title: baseTitle, excerpt: baseExcerpt, body: baseBody });
    setHasTranslation(false);
    setStatus({ ok: true, msg: "Deleted. Falls back to Arabic." });
  }

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) { if (isDirty) { e.preventDefault(); e.returnValue = ""; } }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const inp = "w-full rounded-xl border border-line bg-dashbg py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div className="bg-white rounded-xl2 border border-line p-6">
      <h2 className="font-display font-bold text-ink mb-1 flex items-center gap-2">
        <Icon name="globe" size={18} className="text-brand" /> Content Translations
      </h2>
      <p className="text-muted text-xs mb-5">Translate this article for each language.</p>

      <div className="flex gap-2 mb-5">
        {LOCALES.map(l => (
          <button key={l.code} onClick={() => setActiveLocale(l.code)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold border transition ${activeLocale === l.code ? "bg-brand text-white border-brand" : "border-line text-muted hover:border-brand hover:text-brand"}`}>
            <span>{l.flag}</span>{l.name}
          </button>
        ))}
      </div>

      <div className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1 mb-4 ${hasTranslation ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
        <Icon name={hasTranslation ? "check" : "help-circle"} size={12} />
        {hasTranslation ? "Translated" : "No translation — showing Arabic to visitors"}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted font-semibold uppercase tracking-wider mb-1.5">Title *</label>
          <input value={form.title} onChange={e => { setIsDirty(true); setForm(f => ({ ...f, title: e.target.value })); }} className={inp} />
        </div>
        <div>
          <label className="block text-xs text-muted font-semibold uppercase tracking-wider mb-1.5">Excerpt</label>
          <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3} className={`${inp} resize-none`} />
        </div>
        <div>
          <label className="block text-xs text-muted font-semibold uppercase tracking-wider mb-1.5">Body (HTML supported)</label>
          <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={8} className={`${inp} resize-y font-mono text-xs`} />
        </div>
      </div>

      {status && (
        <div className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-sm font-semibold border ${status.ok ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"}`}>
          <Icon name={status.ok ? "check" : "x"} size={14} />{status.msg}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button onClick={save} disabled={loading || !form.title.trim()}
          className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-5 py-2.5 text-sm transition disabled:opacity-50">
          <Icon name="check" size={14} />{loading ? "Saving..." : "Save Translation"}
        </button>
        {hasTranslation && (
          <button onClick={deleteTranslation}
            className="flex items-center gap-2 border border-danger/30 text-danger hover:bg-danger/5 font-semibold rounded-xl px-4 py-2.5 text-sm transition">
            <Icon name="trash" size={14} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
