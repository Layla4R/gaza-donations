import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/lib/donorAuth";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    await verifyEmail(token);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
