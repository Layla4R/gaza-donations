-- Run before deploying the rate-limited routes.
BEGIN;
CREATE TABLE IF NOT EXISTS public.request_rate_limits (
  bucket text PRIMARY KEY,
  hits integer NOT NULL,
  expires_at timestamptz NOT NULL
);
ALTER TABLE public.request_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.request_rate_limits FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.consume_request_limit(p_bucket text, p_limit integer, p_window_seconds integer)
RETURNS TABLE(allowed boolean, retry_after integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE current_time timestamptz := clock_timestamp(); row_data public.request_rate_limits%ROWTYPE;
BEGIN
  IF p_limit < 1 OR p_window_seconds < 1 OR length(p_bucket) > 200 THEN
    RAISE EXCEPTION 'Invalid rate limit';
  END IF;
  DELETE FROM public.request_rate_limits WHERE expires_at < current_time;
  INSERT INTO public.request_rate_limits AS existing(bucket,hits,expires_at)
  VALUES(p_bucket,1,current_time + make_interval(secs => p_window_seconds))
  ON CONFLICT(bucket) DO UPDATE SET
    hits = CASE WHEN existing.expires_at <= current_time THEN 1 ELSE LEAST(existing.hits + 1,p_limit + 1) END,
    expires_at = CASE WHEN existing.expires_at <= current_time THEN current_time + make_interval(secs => p_window_seconds) ELSE existing.expires_at END
  RETURNING * INTO row_data;
  RETURN QUERY SELECT row_data.hits <= p_limit, GREATEST(1,ceil(extract(epoch FROM row_data.expires_at-current_time))::integer);
END;
$$;
REVOKE ALL ON FUNCTION public.consume_request_limit(text,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_request_limit(text,integer,integer) TO service_role;
COMMIT;
