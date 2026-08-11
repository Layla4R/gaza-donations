"use client";
import { adminFetch } from "@/lib/admin-fetch";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/icons";
import ImageUpload from "@/components/admin/ImageUpload";

interface PostFormProps {
  initial?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    body?: string;
    coverImage?: string;
    isPublished?: boolean;
    publishedAt?: string;
  };
}

export default function PostForm({ initial = {} }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!initial.id;
  const [form, setForm] = useState({
    title: initial.title || "",
    slug: initial.slug || "",
    excerpt: initial.excerpt || "",
    body: initial.body || "",
    coverImage: initial.coverImage || "",
    isPublished: initial.isPublished ?? false,
    publishedAt: initial.publishedAt ? new Date(initial.publishedAt).toISOString().slice(0,16) : new Date().toISOString().slice(0,16),
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const saveRef = useRef<() => void>();

  const set = useCallback((k: string, v: any) => {
    setIsDirty(true);
    if (k === "title" && !isEdit) {
      const rawSlug = v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const slug = rawSlug || `post-${Date.now()}`;
      setForm(f => ({ ...f, title: v, slug }));
    } else {
      setForm(f => ({ ...f, [k]: v }));
    }
  }, [isEdit]);

  useEffect(() => { saveRef.current = save; });

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) { if (isDirty) { e.preventDefault(); e.returnValue = ""; } }
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); saveRef.current?.(); }
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("beforeunload", onBeforeUnload); window.removeEventListener("keydown", onKey); };
  }, [isDirty]);

  async function save() {
    if (!form.title || !form.slug || !form.excerpt || !form.body) {
      setError("Title, slug, excerpt and body are required"); return;
    }
    setStatus("saving"); setError("");
    try {
      const res = await adminFetch(
        isEdit ? `/api/admin/posts/${initial.id}` : "/api/admin/posts",
        {
          method: isEdit ? "PATCH" : "POST",
          body: JSON.stringify(form),
        }
      );
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to save");
      setStatus("saved");
      setIsDirty(false);
      setTimeout(() => router.push("/admin/posts"), 1500);
    } catch (e: any) {
      setError(e.message);
      setStatus("error");
    }
  }

  const inp = "w-full rounded-xl border border-line bg-white py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30";

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-ink">
          {isEdit ? "Edit Post" : "New Post"}
        </h1>
        <button onClick={() => router.push("/admin/posts")} className="text-muted hover:text-ink text-sm font-semibold flex items-center gap-1.5 border border-line rounded-xl px-4 py-2 bg-white transition">
          <Icon name="arrow-left" size={16} /> Back
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-line p-6 sm:p-8 space-y-6 shadow-sm w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-muted font-bold uppercase tracking-wider mb-2">Title *</label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inp} placeholder="Post title" />
          </div>
          <div>
            <label className="block text-xs text-muted font-bold uppercase tracking-wider mb-2">Slug *</label>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inp} placeholder="post-url-slug" />
          </div>
        </div>

        <ImageUpload value={form.coverImage} onChange={v => set("coverImage", v)} label="Cover Image" />

        <div>
          <label className="block text-xs text-muted font-bold uppercase tracking-wider mb-2">
            Excerpt * <span className="text-muted font-normal normal-case">(shown in listing)</span>
          </label>
          <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={`${inp} h-24 resize-none`} placeholder="Short summary..." />
        </div>

        <div>
          <label className="block text-xs text-muted font-bold uppercase tracking-wider mb-2">
            Body * <span className="text-muted font-normal normal-case">(supports basic HTML)</span>
          </label>
          <textarea value={form.body} onChange={(e) => set("body", e.target.value)} className={`${inp} h-72 resize-y font-mono text-xs`} placeholder="Full article content..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-line">
          <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border border-line hover:border-brand/40">
            <input type="checkbox" checked={form.isPublished} onChange={e => set("isPublished", e.target.checked)} className="w-5 h-5 accent-brand" />
            <div>
              <span className="text-sm font-bold text-ink">Published</span>
              <p className="text-xs text-muted">Visible to all visitors on site</p>
            </div>
          </label>
          <div>
            <label className="block text-xs text-muted font-bold uppercase tracking-wider mb-2">
              {form.isPublished ? "Published Date & Time" : "Schedule Date & Time (optional)"}
            </label>
            <input type="datetime-local" value={form.publishedAt || ""}
              onChange={e => set("publishedAt", e.target.value)}
              className={inp} />
          </div>
        </div>

        {error && <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 font-semibold">{error}</p>}

        <div className="pt-2">
          <button onClick={save} disabled={status === "saving"} className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl px-8 py-3 text-sm transition disabled:opacity-60 shadow-sm">
            <Icon name={status === "saved" ? "check" : "file-text"} size={16} />
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Save Post"}
          </button>
        </div>
      </div>
    </div>
  );
}