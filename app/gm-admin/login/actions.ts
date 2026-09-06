"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

const schema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
  password: z.string().min(1, "Enter your password."),
});

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!supabaseConfigured()) return { error: "The admin area is not configured yet." };

  const parsed = schema.safeParse({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return { error: "Incorrect email or password." };
  }

  // Only users listed in `admins` may enter.
  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized for admin access." };
  }

  redirect("/gm-admin");
}
