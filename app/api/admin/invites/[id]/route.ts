import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try { await requireAdmin(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const supabase = getSupabase();
  await supabase.from("AdminInvite").delete().eq("id", params.id);
  return NextResponse.json({ ok: true });
}
