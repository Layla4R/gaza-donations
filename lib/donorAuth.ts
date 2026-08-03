/**
 * Donor authentication — separate from admin auth.
 * Uses bcrypt passwords stored in the User table (role=DONOR).
 * Sessions stored in DonorSession table as secure tokens.
 */

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getSupabase } from "./supabase";
import crypto from "crypto";
import { sendMail, loadDonorEmailTemplate } from "./mailer";

const SESSION_COOKIE = "donor_session";
const SESSION_EXPIRY_DAYS = 30;
const SALT_ROUNDS = 12;

function generateToken() {
  return crypto.randomBytes(48).toString("hex");
}

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
  const verifyToken = generateToken();
  const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  const { data: user, error } = await supabase
    .from("User")
    .insert({
      name: opts.name.trim(),
      email: opts.email.toLowerCase(),
      passwordHash,
      role: "DONOR",
      country: opts.country || null,
      verifyToken,
      verifyExpiry: verifyExpiry.toISOString(),
      emailVerified: false,
    })
    .select("id, name, email")
    .single();

  if (error) throw new Error(error.message);

  // Send verification email — use DB template if available
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const verifyUrl = `${siteUrl}/verify-email?token=${verifyToken}`;
  const registerVars = { donorName: opts.name, email: opts.email, verifyUrl, siteUrl };
  loadDonorEmailTemplate("donor_register", registerVars).then(tpl => {
    if (tpl) {
      sendMail({ to: opts.email, subject: tpl.subject, html: tpl.html }).catch(() => {});
    } else {
      sendMail({
        to: opts.email,
        subject: "Welcome to 4Relief — Verify your email",
        html: `<div style="font-family:Cairo,Arial,sans-serif;padding:32px;background:#F8FAFF;max-width:600px;margin:0 auto;"><div style="background:linear-gradient(135deg,#003C87,#0069D2);padding:28px;border-radius:12px;text-align:center;margin-bottom:24px;"><h1 style="color:#fff;margin:0;font-size:20px;">4Relief Humanitarian Foundation</h1></div><h2 style="color:#0069D2;">Welcome ${opts.name}!</h2><p style="color:#5C6880;line-height:1.7;">Your account has been created. Please verify your email address:</p><div style="text-align:center;margin:32px 0;"><a href="${verifyUrl}" style="display:inline-block;background:linear-gradient(135deg,#F00F5A,#FF4D88);color:#fff;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;">Verify Email Address</a></div><p style="color:#aaa;font-size:12px;text-align:center;">Link expires in 24 hours. If you didn't create this account, ignore this email.</p></div>`,
      }).catch(() => {});
    }
  }).catch(() => {});

  return { id: user.id, name: user.name, email: user.email };
}

// ── Verify Email ──────────────────────────────────────────────

export async function verifyEmail(token: string) {
  const supabase = getSupabase();
  const { data: user } = await supabase
    .from("User")
    .select("id, verifyExpiry")
    .eq("verifyToken", token)
    .maybeSingle();

  if (!user) throw new Error("INVALID_TOKEN");
  if (new Date(user.verifyExpiry) < new Date()) throw new Error("TOKEN_EXPIRED");

  await supabase
    .from("User")
    .update({ emailVerified: true, verifyToken: null, verifyExpiry: null })
    .eq("id", user.id);

  return true;
}

// ── Login ─────────────────────────────────────────────────────

export async function loginDonor(email: string, password: string) {
  const supabase = getSupabase();
  const { data: user } = await supabase
    .from("User")
    .select("id, name, email, passwordHash, role, emailVerified")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user || !user.passwordHash) throw new Error("INVALID_CREDENTIALS");
  // Staff/admin must use the admin login page
  if (["ADMIN", "EDITOR", "VIEWER"].includes(user.role)) throw new Error("USE_ADMIN_LOGIN");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("INVALID_CREDENTIALS");

  // Create session
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  // Clean up expired sessions for this user (best-effort)
  try { await supabase.from("DonorSession").delete().eq("userId", user.id).lt("expiresAt", new Date().toISOString()); } catch {}
  await supabase.from("DonorSession").insert({ userId: user.id, token, expiresAt: expiresAt.toISOString() });
  await supabase.from("User").update({ lastLoginAt: new Date().toISOString() }).eq("id", user.id);

  // Set cookie
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified };
}

// ── Get Current Donor ─────────────────────────────────────────

export async function getCurrentDonor() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const supabase = getSupabase();
    const { data: session } = await supabase
      .from("DonorSession")
      .select("userId, expiresAt")
      .eq("token", token)
      .maybeSingle();

    if (!session || new Date(session.expiresAt) < new Date()) return null;

    const { data: user } = await supabase
      .from("User")
      .select("id, name, email, emailVerified, country, totalDonated, donationCount, createdAt, avatarUrl")
      .eq("id", session.userId)
      .maybeSingle();

    return user || null;
  } catch {
    return null;
  }
}

// ── Logout ────────────────────────────────────────────────────

export async function logoutDonor() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const supabase = getSupabase();
    await supabase.from("DonorSession").delete().eq("token", token);
  }
  cookies().delete(SESSION_COOKIE);
}

// ── Password Reset ────────────────────────────────────────────

export async function requestPasswordReset(email: string) {
  const supabase = getSupabase();
  const { data: user, error: userError } = await supabase
    .from("User")
    .select("id, name")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (userError) { if (process.env.NODE_ENV !== "production") console.error("[donorAuth] requestPasswordReset DB error:", userError.message); return; }
  if (!user) return; // Silent — don't reveal if email exists

  const token = generateToken();
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await supabase.from("User").update({
    resetToken: token,
    resetExpiry: expiry.toISOString(),
  }).eq("id", user.id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const resetUrl = `${siteUrl}/reset-password?token=${token}`;

  const resetVars = { donorName: user.name || email, email, resetUrl, expiryHours: "24", siteUrl };
  const resetTpl = await loadDonorEmailTemplate("password_reset", resetVars);
  if (resetTpl) { await sendMail({ to: email, subject: resetTpl.subject, html: resetTpl.html }); return; }

  await sendMail({
    to: email,
    subject: "Reset your password — 4Relief",
    html: `<div dir="rtl" style="font-family:Cairo,Tahoma,sans-serif;padding:32px;background:#F8FAFF;">
      <h2 style="color:#0069D2;">إعادة تعيين كلمة المرور</h2>
      <p>مرحباً ${user.name}! اضغط الرابط أدناه لإعادة تعيين كلمة مرورك:</p>
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#003C87,#0069D2);color:#fff;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;margin:16px 0;">إعادة تعيين كلمة المرور</a>
      <p style="color:#999;font-size:12px;">الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب هذا، تجاهل الرسالة.</p>
    </div>`,
  }).catch(() => {});
}

export async function resetPassword(token: string, newPassword: string) {
  const supabase = getSupabase();
  const { data: user } = await supabase
    .from("User")
    .select("id, resetExpiry")
    .eq("resetToken", token)
    .maybeSingle();

  if (!user) throw new Error("INVALID_TOKEN");
  if (new Date(user.resetExpiry) < new Date()) throw new Error("TOKEN_EXPIRED");

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await supabase.from("User").update({
    passwordHash,
    resetToken: null,
    resetExpiry: null,
  }).eq("id", user.id);

  // Invalidate all sessions
  await supabase.from("DonorSession").delete().eq("userId", user.id);
}
