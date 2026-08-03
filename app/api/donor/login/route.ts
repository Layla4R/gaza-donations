import { NextRequest, NextResponse } from "next/server";
import { loginDonor } from "@/lib/donorAuth";

// Rate limit: 10 attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
function checkLoginLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkLoginLimit(ip)) {
    return NextResponse.json({ error: "Too many login attempts. Please wait 15 minutes." }, { status: 429 });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    const user = await loginDonor(email, password);
    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    const msgs: Record<string, string> = {
      INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      USE_ADMIN_LOGIN: "استخدم صفحة تسجيل دخول الأدمن",
    };
    return NextResponse.json({ error: msgs[e.message] || e.message }, { status: 401 });
  }
}
