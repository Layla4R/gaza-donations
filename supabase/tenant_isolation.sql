-- Run once, in a maintenance window, BEFORE deploying the tenant-aware code.
-- Preserves public (4Relief). Creates an independent Destekol namespace in the SAME database.
-- No users, invites, sessions, donations, subscribers or messages are copied.
-- Existing CMS content/settings are copied verbatim to preserve the public presentation.
BEGIN;
SET LOCAL search_path = pg_catalog;
CREATE SCHEMA destekol;
REVOKE ALL ON SCHEMA destekol FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA destekol TO service_role;

DO $migration$
DECLARE
  names text[] := ARRAY['Page','PageTranslation','Campaign','CampaignTranslation','CampaignUpdate',
    'NewsPost','NewsPostTranslation','Translation','SiteSettings','EmailTemplate','User','AdminInvite',
    'Donation','DonorSession','Subscriber','ContactMessage','request_rate_limits'];
  content_names text[] := ARRAY['Page','PageTranslation','Campaign','CampaignTranslation','CampaignUpdate',
    'NewsPost','NewsPostTranslation','Translation','SiteSettings','EmailTemplate'];
  tbl text;
  source_oid oid;
  row_record record;
  definition text;
BEGIN
  FOREACH tbl IN ARRAY names LOOP
    source_oid := to_regclass(format('public.%I',tbl));
    IF source_oid IS NULL THEN CONTINUE; END IF;
    -- Do not silently drop or reuse custom triggers that might write into public.
    IF EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid=source_oid AND NOT tgisinternal) THEN
      RAISE EXCEPTION 'Review custom triggers on public.% before tenant migration', tbl;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_attrdef WHERE adrelid=source_oid AND pg_get_expr(adbin,adrelid) LIKE '%nextval(%') THEN
      RAISE EXCEPTION 'Review sequence defaults on public.% before tenant migration', tbl;
    END IF;
    EXECUTE format('LOCK TABLE public.%I IN SHARE MODE',tbl);
    EXECUTE format('CREATE TABLE destekol.%I (LIKE public.%I INCLUDING ALL)',tbl,tbl);
    EXECUTE format('ALTER TABLE destekol.%I ENABLE ROW LEVEL SECURITY',tbl);
    EXECUTE format('REVOKE ALL ON destekol.%I FROM PUBLIC, anon, authenticated',tbl);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON destekol.%I TO service_role',tbl);
  END LOOP;

  -- LIKE does not copy foreign keys. Recreate them against this site's tables.
  FOREACH tbl IN ARRAY names LOOP
    source_oid := to_regclass(format('public.%I',tbl));
    IF source_oid IS NULL THEN CONTINUE; END IF;
    FOR row_record IN SELECT c.conname, c.confrelid, pg_get_constraintdef(c.oid) AS def
      FROM pg_constraint c WHERE c.conrelid=source_oid AND c.contype='f' LOOP
      IF NOT EXISTS (SELECT 1 FROM pg_class t JOIN pg_namespace n ON n.oid=t.relnamespace
        WHERE t.oid=row_record.confrelid AND n.nspname='public' AND t.relname=ANY(names)) THEN
        RAISE EXCEPTION 'Unexpected foreign key %.%; review before migration',tbl,row_record.conname;
      END IF;
      definition := replace(replace(row_record.def,'public.','destekol.'),'"public".','"destekol".');
      EXECUTE format('ALTER TABLE destekol.%I ADD CONSTRAINT %I %s',tbl,row_record.conname,definition);
    END LOOP;
  END LOOP;

  -- Copy only content; preserve IDs so existing sections, links and translations still match.
  -- Delay FK checks by ordering parents first (the allowlist above is already parent-first).
  FOREACH tbl IN ARRAY content_names LOOP
    IF to_regclass(format('public.%I',tbl)) IS NOT NULL THEN
      EXECUTE format('INSERT INTO destekol.%I SELECT * FROM public.%I',tbl,tbl);
    END IF;
  END LOOP;

  -- These are the only RPCs used by the application. Bind unqualified table names to Destekol.
  FOR row_record IN SELECT p.oid,p.proname,pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p JOIN pg_namespace n ON p.pronamespace=n.oid
    WHERE n.nspname='public' AND p.proname IN ('get_dashboard_stats','increment_campaign_stats','consume_request_limit') LOOP
    definition := replace(replace(pg_get_functiondef(row_record.oid),'public.','destekol.'),'"public".','"destekol".');
    EXECUTE definition;
    EXECUTE format('ALTER FUNCTION destekol.%I(%s) SET search_path TO destekol, pg_catalog',row_record.proname,row_record.args);
    EXECUTE format('REVOKE ALL ON FUNCTION destekol.%I(%s) FROM PUBLIC, anon, authenticated',row_record.proname,row_record.args);
    EXECUTE format('GRANT EXECUTE ON FUNCTION destekol.%I(%s) TO service_role',row_record.proname,row_record.args);
  END LOOP;
END;
$migration$;

ALTER DEFAULT PRIVILEGES IN SCHEMA destekol REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA destekol REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
-- Supabase API settings: add destekol to Exposed schemas (keep public).
-- Never add anon/authenticated grants or copy RLS policies from public to the new schema.
