import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getSupabase } from "./supabase";

const SESSION_COOKIE = "donor_session";
const SALT_ROUNDS = 12;
const SECRET = new TextEncoder().encode(
  process.env.SUPABASE_JWT_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fallback-secret-key-32-chars-long"
);

// ── Register ──────────────────────────────────────────────────
export async function registerDonor(opts: {
  name: string;
  email: string;
  password: string;
  country?: string;
}) {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("User")
    .select("id")
    .eq("email", opts.email.toLowerCase())
    .maybeSingle();

  if (existing) throw new Error("EMAIL_EXISTS");

  const passwordHash = await bcrypt.hash(opts.password, SALT_ROUNDS);

  const { data: user, error } = await supabase
    .from("User")
    .insert({
      name: opts.name.trim(),
      email: opts.email.toLowerCase(),
      passwordHash,
      role: "DONOR",
      country: opts.country || null,
      emailVerified: true, // تفعيل الحساب فوراً
    })
    .select("id, name, email")
    .single();

  if (error) throw new Error(error.message);

  return { id: user.id, name: user.name, email: user.email };
}

// ── Login ─────────────────────────────────────────────────────
export async function loginDonor(email: string, password: string) {
  const supabase = getSupabase();

  const { data: user, error } = await supabase
    .from("User")
    .select("id, name, email, passwordHash, role")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!user || !user.passwordHash) throw new Error("INVALID_CREDENTIALS");
  if (["ADMIN", "EDITOR", "VIEWER"].includes(user.role)) throw new Error("USE_ADMIN_LOGIN");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  // إنشاء توكن JWT آمن لـ 30 يوم
  const token = await new SignJWT({ userId: user.id, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SECRET);

  try {
    await supabase.from("User").update({ lastLoginAt: new Date().toISOString() }).eq("id", user.id);
  } catch {}

  return { user: { id: user.id, name: user.name, email: user.email }, token };
}

// ── Get Current Donor ─────────────────────────────────────────
export async function getCurrentDonor() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    if (!payload.userId) return null;

    const supabase = getSupabase();
    const { data: user } = await supabase
      .from("User")
      .select("id, name, email, emailVerified, country, totalDonated, donationCount, createdAt")
      .eq("id", payload.userId as string)
      .maybeSingle();

    return user || null;
  } catch {
    return null;
  }
}

// ── Logout ────────────────────────────────────────────────────
export async function logoutDonor() {
  cookies().delete(SESSION_COOKIE);
}