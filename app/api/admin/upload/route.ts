import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Validate type
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowed.includes(file.type)) return NextResponse.json({ error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG" }, { status: 400 });

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });

  try {
    const supabase = getSupabase();
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from("media")
      .upload(fileName, bytes, { contentType: file.type, upsert: false });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
    return NextResponse.json({ url: urlData.publicUrl, path: fileName });
  } catch (e: any) {
    if (process.env.NODE_ENV !== "production") console.error("[upload] Error:", e?.message || e);
    // If Supabase storage not configured, return helpful error
    if (e.message?.includes("bucket") || e.message?.includes("not found")) {
      return NextResponse.json({ error: "Storage bucket 'media' not found. Go to Supabase Dashboard → Storage → New Bucket → name it 'media' and make it Public." }, { status: 500 });
    }
    if (e.message?.includes("policy") || e.message?.includes("violates")) {
      return NextResponse.json({ error: "Storage policy error. Go to Supabase Dashboard → Storage → media → Policies and add an INSERT policy." }, { status: 500 });
    }
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
