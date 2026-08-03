-- ============================================================
-- Donor Accounts Migration
-- Run AFTER schema.sql
-- ============================================================

-- Add email verification + reset token fields to User
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "emailVerified"   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "verifyToken"     TEXT,
  ADD COLUMN IF NOT EXISTS "verifyExpiry"    TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "resetToken"      TEXT,
  ADD COLUMN IF NOT EXISTS "resetExpiry"     TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "avatarUrl"       TEXT,
  ADD COLUMN IF NOT EXISTS "phone"           TEXT,
  ADD COLUMN IF NOT EXISTS "country"         TEXT,
  ADD COLUMN IF NOT EXISTS "totalDonated"    DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "donationCount"   INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "lastLoginAt"     TIMESTAMP(3);

-- Add donor session tokens table
CREATE TABLE IF NOT EXISTS "DonorSession" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId"    TEXT NOT NULL,
  "token"     TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT now(),
  CONSTRAINT "DonorSession_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "DonorSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "DonorSession_token_key" ON "DonorSession"("token");
CREATE INDEX IF NOT EXISTS "DonorSession_userId_idx" ON "DonorSession"("userId");
