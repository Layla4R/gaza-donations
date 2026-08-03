-- ══════════════════════════════════════════════
-- STEP 1: Run this first — creates the table
-- ══════════════════════════════════════════════
DROP TABLE IF EXISTS "Translation" CASCADE;

CREATE TABLE "Translation" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "locale"    TEXT NOT NULL,
  "key"       TEXT NOT NULL,
  "value"     TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Translation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Translation_locale_key_unique" UNIQUE ("locale", "key")
);

CREATE INDEX "Translation_locale_idx" ON "Translation"("locale");
