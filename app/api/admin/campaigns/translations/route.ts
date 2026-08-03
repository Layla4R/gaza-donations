import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const url = new URL(req.url);
  const campaignId = url.searchParams.get("campaignId");
  const locale = url.searchParams.get("locale");
  if (!campaignId || !locale) return NextResponse.json({ error: "Missing params" }, { status: 400 });
  const supabase = getSupabase();
  const { data } = await supabase.from("CampaignTranslation").select("*").eq("campaignId", campaignId).eq("locale", locale).maybeSingle();
  return NextResponse.json({ translation: data || null });
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { campaignId, locale, title, summary, description } = await req.json();
  if (!campaignId || !locale || !title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const supabase = getSupabase();
  const { data, error } = await supabase.from("CampaignTranslation").upsert(
    { campaignId, locale, title, summary: summary || "", description: description || "", updatedAt: new Date().toISOString() },
    { onConflict: "campaignId,locale" }
  ).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ translation: data });
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { campaignId, locale } = await req.json();
  const supabase = getSupabase();
  await supabase.from("CampaignTranslation").delete().eq("campaignId", campaignId).eq("locale", locale);
  return NextResponse.json({ ok: true });
}
