-- Run this in Supabase SQL Editor to clear duplicate blocks from homepage
-- The homepage will then use the clean code-built version

UPDATE "Page" SET sections = '[]' WHERE slug = 'home';
