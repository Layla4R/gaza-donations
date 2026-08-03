import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const url = new URL((req as any).url || "http://localhost");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const PAGE_SIZE = 50;
  const from = (page - 1) * PAGE_SIZE;
  const status = url.searchParams.get("status") || ""; // "published" | "draft" | ""
  const q = url.searchParams.get("q")?.trim() || "";
  const supabase = getSupabase();
  let query = supabase.from("NewsPost").select("*", { count: "exact" }).order("createdAt", { ascending: false });
  if (status === "published") query = query.eq("isPublished", true);
  if (status === "draft") query = query.eq("isPublished", false);
  if (q) query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
  query = query.range(from, from + PAGE_SIZE - 1);
  const { data: posts, count } = await query;
  return NextResponse.json({ posts: posts || [], count: count || 0, page, pageSize: PAGE_SIZE });
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const body = await req.json();
  const { title, slug, excerpt, body: content, coverImage, isPublished, publishedAt: rawPublishedAt } = body;
  // Only set publishedAt if actually published
  const publishedAt = isPublished ? (rawPublishedAt || new Date().toISOString()) : null;
  if (!title || !slug || !excerpt || !content) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  const supabase = getSupabase();
  const { data: existing } = await supabase.from("NewsPost").select("id").eq("slug", slug).maybeSingle();
  if (existing) return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 });

  const effectivePublishedAt = publishedAt ? new Date(publishedAt).toISOString() : (isPublished ? new Date().toISOString() : null);
  const { data: post, error } = await supabase.from("NewsPost").insert({ title, slug, excerpt, body: content, coverImage: coverImage || null, isPublished: !!isPublished, publishedAt: effectivePublishedAt }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post });
}
