-- Add SMTP configuration fields to SiteSettings
ALTER TABLE "SiteSettings"
  ADD COLUMN IF NOT EXISTS "smtpHost"     TEXT NOT NULL DEFAULT 'my.mailbux.com',
  ADD COLUMN IF NOT EXISTS "smtpPort"     INTEGER NOT NULL DEFAULT 587,
  ADD COLUMN IF NOT EXISTS "smtpUser"     TEXT,
  ADD COLUMN IF NOT EXISTS "smtpPassword" TEXT,
  ADD COLUMN IF NOT EXISTS "smtpFrom"     TEXT,
  ADD COLUMN IF NOT EXISTS "smtpFromName" TEXT NOT NULL DEFAULT '4Relief Humanitarian Foundation',
  ADD COLUMN IF NOT EXISTS "smtpSecure"   BOOLEAN NOT NULL DEFAULT false;
-- smtpSecure = false  →  STARTTLS on port 587  (MAILBUX default)
-- smtpSecure = true   →  SSL on port 465

-- Add Stripe and PayPal key fields to SiteSettings
ALTER TABLE "SiteSettings"
  ADD COLUMN IF NOT EXISTS "stripeSecretKey"      TEXT,
  ADD COLUMN IF NOT EXISTS "stripePublishableKey" TEXT,
  ADD COLUMN IF NOT EXISTS "stripeWebhookSecret"  TEXT,
  ADD COLUMN IF NOT EXISTS "paypalClientId"       TEXT,
  ADD COLUMN IF NOT EXISTS "paypalClientSecret"   TEXT,
  ADD COLUMN IF NOT EXISTS "paypalMode"           TEXT NOT NULL DEFAULT 'sandbox';

-- ── Admin Invites & Permissions System ──────────────────────
CREATE TABLE IF NOT EXISTS "AdminInvite" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "email"       TEXT NOT NULL,
  "name"        TEXT NOT NULL,
  "token"       TEXT NOT NULL,
  "permissions" JSONB NOT NULL DEFAULT '[]',
  "invitedBy"   TEXT NOT NULL,
  "expiresAt"   TIMESTAMP(3) NOT NULL,
  "acceptedAt"  TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "AdminInvite_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "AdminInvite_token_key" ON "AdminInvite"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "AdminInvite_email_key" ON "AdminInvite"("email");

-- Add permissions column to User (for granular access control)
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "permissions" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "invitedBy"   TEXT,
  ADD COLUMN IF NOT EXISTS "isStaff"     BOOLEAN NOT NULL DEFAULT false;
