import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

// GET /api/admin/pages/translations?pageId=xxx&locale=en
export async function GET(req: NextRequest) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const url = new URL(req.url);
  const pageId = url.searchParams.get("pageId");
  const locale = url.searchParams.get("locale");
  if (!pageId || !locale) return NextResponse.json({ error: "Missing pageId or locale" }, { status: 400 });
  const supabase = getSupabase();
  const { data } = await supabase.from("PageTranslation").select("*").eq("pageId", pageId).eq("locale", locale).maybeSingle();
  return NextResponse.json({ translation: data || null });
}

// POST/PATCH — upsert a page translation
export async function POST(req: NextRequest) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { pageId, locale, title, description, sections } = await req.json();
  if (!pageId || !locale || !title) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const supabase = getSupabase();
  const { data, error } = await supabase.from("PageTranslation").upsert(
    { pageId, locale, title, description: description || null, sections: sections || [], updatedAt: new Date().toISOString() },
    { onConflict: "pageId,locale" }
  ).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ translation: data });
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { pageId, locale } = await req.json();
  const supabase = getSupabase();
  await supabase.from("PageTranslation").delete().eq("pageId", pageId).eq("locale", locale);
  return NextResponse.json({ ok: true });
}
