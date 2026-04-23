import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the service role key.
 * NEVER import this file in client components — it reads server-only env vars.
 *
 * Configured to write to the marketing_private schema only.
 * To migrate to a different Supabase project, update SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY in the environment — no code changes required.
 */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
    );
  }

  return createClient(url, key, {
    db: { schema: "marketing_private" },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
