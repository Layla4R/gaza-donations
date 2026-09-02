import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = getSupabase();
  const { data: post } = await supabase.from("NewsPost").select("*").eq("id", params.id).maybeSingle();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const body = await req.json();
  const data: any = {};
  
  // السماح بالحقول الجديدة في التحديث
  const allowedKeys = [
    "title", "slug", "excerpt", "body", "body2", 
    "coverImage", "secondaryImage", "gallery", "videoUrl", 
    "isPublished", "publishedAt"
  ];

  for (const k of allowedKeys) {
    if (body[k] !== undefined) data[k] = body[k];
  }

  if (data.slug !== undefined) {
    const cleanSlug = String(data.slug).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-_]/g, "");
    if (!cleanSlug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    data.slug = cleanSlug;
  }
  
  const supabase = getSupabase();
  if (data.slug) {
    const { data: existing } = await supabase.from("NewsPost").select("id").eq("slug", data.slug).maybeSingle();
    if (existing && existing.id !== params.id) {
      return NextResponse.json({ error: "A post with this slug already exists" }, { status: 400 });
    }
  }

  const { data: post, error } = await supabase.from("NewsPost").update(data).eq("id", params.id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = getSupabase();
  const { error } = await supabase.from("NewsPost").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}