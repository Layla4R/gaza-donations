-- Run this in Supabase SQL Editor
-- Clears sections from legal pages so the code-based content shows correctly

UPDATE "Page" SET "sections" = '[]'::jsonb
WHERE "slug" IN ('privacy', 'terms', 'refund-policy', 'cookie-policy', 'aml-policy', 'complaints');
