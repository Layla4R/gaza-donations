-- Add missing campaign fields
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "isZakatable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "country" TEXT;
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "defaultAmount" DECIMAL(12,2) NOT NULL DEFAULT 25;

-- Contact Messages table
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "subject"   TEXT,
  "message"   TEXT NOT NULL,
  "isRead"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT;

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "tiktokUrl" TEXT;

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "defaultCurrency" TEXT NOT NULL DEFAULT 'usd';

ALTER TABLE "Donation" ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3);

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "footerTagline" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "footerDescription" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "copyrightText" TEXT;

CREATE TABLE IF NOT EXISTS "EmailTemplate" (
  "id"        TEXT PRIMARY KEY,
  "subject"   TEXT NOT NULL,
  "html"      TEXT NOT NULL,
  "blocks"    TEXT,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "EmailTemplate" ADD COLUMN IF NOT EXISTS "gs" TEXT;
