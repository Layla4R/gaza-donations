-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS "PageTranslation" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "pageId"      TEXT NOT NULL,
  "locale"      TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "description" TEXT,
  "sections"    JSONB NOT NULL DEFAULT '[]',
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "PageTranslation_pkey" PRIMARY KEY ("id"),
  UNIQUE ("pageId", "locale"),
  CONSTRAINT "PageTranslation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "PageTranslation_pageId_idx" ON "PageTranslation"("pageId");

-- Campaign content translations
CREATE TABLE IF NOT EXISTS "CampaignTranslation" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "campaignId"  TEXT NOT NULL,
  "locale"      TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "summary"     TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "CampaignTranslation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CampaignTranslation_unique" UNIQUE ("campaignId", "locale"),
  CONSTRAINT "CampaignTranslation_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE
);

-- News post content translations
CREATE TABLE IF NOT EXISTS "NewsPostTranslation" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "postId"      TEXT NOT NULL,
  "locale"      TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "excerpt"     TEXT NOT NULL,
  "body"        TEXT NOT NULL,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "NewsPostTranslation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "NewsPostTranslation_unique" UNIQUE ("postId", "locale"),
  CONSTRAINT "NewsPostTranslation_fkey" FOREIGN KEY ("postId") REFERENCES "NewsPost"("id") ON DELETE CASCADE
);
