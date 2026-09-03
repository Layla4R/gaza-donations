import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const LOCALES = ["ar", "en", "fr", "tr"];
const COOKIE_NAME = "gd_admin_session";
const LOCALE_COOKIE = "NEXT_LOCALE";
const SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || "dev-secret-change-me"
);

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return ["ADMIN", "EDITOR", "VIEWER"].includes(payload.role as string);
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // ── تحديد اللغة الافتراضية حسب الدومين ─────────────────────
  const isDestekol = host.includes("destekol");
  const domainDefaultLocale = isDestekol ? "tr" : "ar";

  // ── 1. Admin route protection ──────────────────────────────
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/accept-invite")
  ) {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
    const token = cookie || bearerToken;
    const valid = token ? await verifyAdminToken(token) : false;

    if (!valid) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ── 2. Skip API, static, _next ──────────────────────────────
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ── 3. i18n — Check if path already has a locale prefix ─────
  const currentPathLocale = LOCALES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  // إذا كان الرابط يحوي بادئة لغة صريحة (مثل /en/water-tankers-project)
  if (currentPathLocale) {
    const response = NextResponse.next();
    // حفظ اللغة الحالية في الكوكي ليتذكرها الـ Middleware في الصفحات القادمة
    response.cookies.set(LOCALE_COOKIE, currentPathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 يوماً
    });
    return response;
  }

  // ── 4. Unprefixed URLs -> Check saved cookie or fallback to domain default ──
  const savedLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const targetLocale =
    savedLocale && LOCALES.includes(savedLocale)
      ? savedLocale
      : domainDefaultLocale;

  const url = req.nextUrl.clone();
  url.pathname = `/${targetLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/|icons/).*)",
  ],
};