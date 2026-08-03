import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error("[AUTH] CRITICAL: SUPABASE_JWT_SECRET is not set!");
}
const SECRET = new TextEncoder().encode(JWT_SECRET || "dev-secret-change-me");

const COOKIE_NAME = "gd_admin_session";

export async function createAdminSession(email: string, role = "ADMIN"): Promise<string> {
  const token = await new SignJWT({ email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  const isProd = process.env.NODE_ENV === "production";
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return token;
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export async function getAdminSession(req?: { headers: { get: (k: string) => string | null } }) {
  let token = cookies().get(COOKIE_NAME)?.value;

  if (!token && req) {
    const auth = req.headers.get("authorization") || req.headers.get("Authorization");
    if (auth?.startsWith("Bearer ")) token = auth.slice(7);
  }

  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export async function requireAdmin(req?: { headers: { get: (k: string) => string | null } }) {
  const session = await getAdminSession(req);
  // Allow ADMIN role OR any authenticated session (staff with EDITOR/VIEWER checked separately via permissions)
  if (!session || (session.role !== "ADMIN" && session.role !== "EDITOR" && session.role !== "VIEWER")) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export async function requireSuperAdmin(req?: { headers: { get: (k: string) => string | null } }) {
  const session = await getAdminSession(req);
  if (!session || session.role !== "ADMIN") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
