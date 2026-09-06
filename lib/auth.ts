import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export type AdminSession = {
  user: { id: string; email: string | null };
  supabase: Awaited<ReturnType<typeof createClient>>;
};

/** Use at the top of every protected admin page/layout and every admin Server Action.
 *  Redirects to the login screen unless the caller is a signed-in user listed in `admins`. */
export async function requireAdmin(): Promise<AdminSession> {
  if (!supabaseConfigured()) redirect("/"); // admin disabled until Supabase env is set

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/gm-admin/login");

  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/gm-admin/login?error=denied");

  return { user: { id: user.id, email: user.email ?? null }, supabase };
}
