import { createClient, SupabaseClient } from "@supabase/supabase-js";

// The official Netlify <-> Supabase integration exposes these env vars
// automatically (Project configuration -> Integrations -> Supabase):
//
//   SUPABASE_DATABASE_URL    -> the project's API URL (https://xxx.supabase.co)
//   SUPABASE_ANON_KEY        -> public anon key
//   SUPABASE_SERVICE_ROLE_KEY-> server-only key, bypasses Row Level Security
//   SUPABASE_JWT_SECRET      -> used to sign/verify our own admin session JWTs
//
// This client uses the service role key because all access in this app goes
// through server-side API routes / server components (never exposed to the
// browser), and the admin dashboard needs full read/write access regardless
// of RLS policies.

const supabaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Make sure SUPABASE_DATABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set (provided automatically by the Netlify <-> Supabase integration)."
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

// Like getSupabase(), but returns null instead of throwing if Supabase isn't
// configured yet — used in places (e.g. the root layout) that should degrade
// gracefully before the integration / env vars are set up.
export function getSupabaseOrNull(): SupabaseClient | null {
  try {
    return getSupabase();
  } catch {
    return null;
  }
}
