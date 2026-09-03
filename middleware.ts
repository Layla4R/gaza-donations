import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const LOCALES = ["ar", "en", "fr", "tr"];
const COOKIE_NAME = "gd_admin_session";
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
  const defaultLocale = isDestekol ? "tr" : "ar";

  // ── 1. Admin route protection ──────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/accept-invite")) {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
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
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  // ── 4. Unprefixed URLs -> Rewrite internally to domain default locale ──
  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/|icons/).*)",
  ],
};