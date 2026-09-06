import { createClient } from "@supabase/supabase-js";

/** Full-access client. SERVER ONLY (route handlers / cron / scripts). Bypasses RLS.
 *  Never import this from a Client Component. */
export function serviceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } });
}
