-- Run in Supabase SQL Editor
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroImage" TEXT;

-- After running, upload your hero image to Supabase Storage (bucket: media)
-- Then update:
-- UPDATE "SiteSettings" SET "heroImage" = 'https://YOUR_SUPABASE_URL/storage/v1/object/public/media/hero-bg.jpg' WHERE id = 'default';
