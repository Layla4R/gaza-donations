-- ============================================================
-- 4Relief Humanitarian Foundation — Database Schema
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)
-- Matches prisma/schema.prisma exactly.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ------------------------------------------------------------
-- ENUMS
-- ------------------------------------------------------------
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL');
CREATE TYPE "DonationFrequency" AS ENUM ('ONE_TIME', 'MONTHLY');
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'DONOR');

-- ------------------------------------------------------------
-- PAGE
-- ------------------------------------------------------------
CREATE TABLE "Page" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sections" JSONB NOT NULL DEFAULT '[]',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "showInMenu" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
CREATE INDEX "Page_order_idx" ON "Page"("order");

-- ------------------------------------------------------------
-- CAMPAIGN
-- ------------------------------------------------------------
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "coverImage" TEXT,
    "goalAmount" DECIMAL(12,2) NOT NULL,
    "raisedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "donorCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isZakatable" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "defaultAmount" DECIMAL(12,2) NOT NULL DEFAULT 25,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");
CREATE INDEX "Campaign_isActive_idx" ON "Campaign"("isActive");
CREATE INDEX "Campaign_isFeatured_idx" ON "Campaign"("isFeatured");

-- ------------------------------------------------------------
-- CAMPAIGN UPDATE
-- ------------------------------------------------------------
CREATE TABLE "CampaignUpdate" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "CampaignUpdate_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CampaignUpdate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "CampaignUpdate_campaignId_idx" ON "CampaignUpdate"("campaignId");

-- ------------------------------------------------------------
-- USER
-- ------------------------------------------------------------
CREATE TABLE "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'DONOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- ------------------------------------------------------------
-- DONATION
-- ------------------------------------------------------------
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "campaignId" TEXT,
    "userId" TEXT,
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "frequency" "DonationFrequency" NOT NULL DEFAULT 'ONE_TIME',
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "provider" "PaymentProvider" NOT NULL,
    "providerRef" TEXT,
    "receiptNumber" TEXT,
    "message" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Donation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Donation_receiptNumber_key" ON "Donation"("receiptNumber");
CREATE INDEX "Donation_campaignId_idx" ON "Donation"("campaignId");
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
CREATE INDEX "Donation_providerRef_idx" ON "Donation"("providerRef");

-- ------------------------------------------------------------
-- SITE SETTINGS (single row, id = 'default')
-- ------------------------------------------------------------
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT '4Relief Humanitarian Foundation',
    "logoText" TEXT NOT NULL DEFAULT '4Relief',
    "logoImage" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#0069D2',
    "accentColor" TEXT NOT NULL DEFAULT '#F00F5A',
    "contactEmail" TEXT NOT NULL DEFAULT 'info@example.com',
    "contactPhone" TEXT,
    "whatsappNumber" TEXT,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl"    TEXT,
    "linkedinUrl"   TEXT,
    "tiktokUrl"     TEXT,
    "footerTagline"     TEXT,
    "footerDescription" TEXT,
    "copyrightText"     TEXT,
    "heroImage"         TEXT,
    "totalRaisedOverride" DECIMAL(12,2),
    "enableStripe" BOOLEAN NOT NULL DEFAULT true,
    "enablePaypal" BOOLEAN NOT NULL DEFAULT true,
    -- Payment gateway keys (stored encrypted in production)
    "stripeSecretKey"      TEXT,
    "stripePublishableKey" TEXT,
    "stripeWebhookSecret"  TEXT,
    "paypalClientId"       TEXT,
    "paypalClientSecret"   TEXT,
    "paypalMode"           TEXT NOT NULL DEFAULT 'sandbox',
  "defaultCurrency"      TEXT NOT NULL DEFAULT 'usd',
    -- SMTP (MAILBUX or any SMTP server)
    "smtpHost"     TEXT NOT NULL DEFAULT 'my.mailbux.com',
    "smtpPort"     INTEGER NOT NULL DEFAULT 587,
    "smtpUser"     TEXT,
    "smtpPassword" TEXT,
    "smtpFrom"     TEXT,
    "smtpFromName" TEXT NOT NULL DEFAULT '4Relief Humanitarian Foundation',
    "smtpSecure"   BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- ------------------------------------------------------------
-- NEWS POST
-- ------------------------------------------------------------
CREATE TABLE "NewsPost" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "NewsPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NewsPost_slug_key" ON "NewsPost"("slug");

-- ------------------------------------------------------------
-- SUBSCRIBER
-- ------------------------------------------------------------
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Subscriber_email_key" ON "Subscriber"("email");

-- ── Translations table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Translation" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "locale"    TEXT NOT NULL,           -- ar | en | fr | tr
  "namespace" TEXT NOT NULL,           -- nav | hero | campaigns | ...
  "key"       TEXT NOT NULL,           -- donate | title | ...
  "value"     TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Translation_pkey" PRIMARY KEY ("id"),
  UNIQUE ("locale", "namespace", "key")
);
CREATE INDEX IF NOT EXISTS "Translation_locale_ns_idx" ON "Translation"("locale", "namespace");

-- ── Page Translations ──────────────────────────────────────────
-- Each page has one row in Page (base/Arabic), plus optional
-- rows here for each other locale (en, fr, tr).
-- If no translation exists for a locale → fallback to base Page.
CREATE TABLE IF NOT EXISTS "PageTranslation" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "pageId"      TEXT NOT NULL,
  "locale"      TEXT NOT NULL,           -- en | fr | tr
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "sections"    JSONB NOT NULL DEFAULT '[]',
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "PageTranslation_pkey" PRIMARY KEY ("id"),
  UNIQUE ("pageId", "locale"),
  CONSTRAINT "PageTranslation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "PageTranslation_pageId_idx" ON "PageTranslation"("pageId");
-- Add heroImage to SiteSettings
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroImage" TEXT;

-- Contact Messages
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"      TEXT NOT NULL,
  "email"     TEXT NOT NULL,
  "subject"   TEXT,
  "message"   TEXT NOT NULL,
  "isRead"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates
CREATE TABLE IF NOT EXISTS "EmailTemplate" (
  "id"        TEXT PRIMARY KEY,
  "subject"   TEXT NOT NULL,
  "html"      TEXT NOT NULL,
  "blocks"    TEXT,
  "gs"        TEXT,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);
