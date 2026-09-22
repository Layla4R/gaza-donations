-- Run in Supabase SQL Editor before deploying these changes.
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS "body3" TEXT;
ALTER TABLE "PageTranslation"
  ADD COLUMN IF NOT EXISTS "body" TEXT,
  ADD COLUMN IF NOT EXISTS "body2" TEXT,
  ADD COLUMN IF NOT EXISTS "body3" TEXT,
  ADD COLUMN IF NOT EXISTS "coverImage" TEXT,
  ADD COLUMN IF NOT EXISTS "secondaryImage" TEXT,
  ADD COLUMN IF NOT EXISTS "gallery" JSONB,
  ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
