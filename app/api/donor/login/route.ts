import { NextRequest, NextResponse } from "next/server";
import { loginDonor } from "@/lib/donorAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "البريد وكلمة المرور مطلوبان" }, { status: 400 });

    const { user, token } = await loginDonor(email, password);
    const res = NextResponse.json({ ok: true, user });

    res.cookies.set("donor_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    res.cookies.set("donor_name", encodeURIComponent(user.name), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (e: any) {
    const msgs: Record<string, string> = {
      INVALID_CREDENTIALS: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      USE_ADMIN_LOGIN: "استخدم صفحة تسجيل دخول الأدمن",
      EMAIL_NOT_VERIFIED: "يرجى تفعيل حسابك من خلال الرابط المرسل إلى بريدك الإلكتروني أولاً",
    };
    return NextResponse.json({ error: msgs[e.message] || e.message }, { status: 401 });
  }
}