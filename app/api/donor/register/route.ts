import { NextRequest, NextResponse } from "next/server";
import { registerDonor } from "@/lib/donorAuth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, country } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json({ error: "Password must contain at least one letter and one number" }, { status: 400 });
    }
    const user = await registerDonor({ name, email, password, country });
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    if (e.message === "EMAIL_EXISTS") return NextResponse.json({ error: "هذا البريد الإلكتروني مسجل مسبقاً" }, { status: 400 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
