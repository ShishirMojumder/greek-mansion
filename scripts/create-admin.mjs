// Grant admin access to an existing Supabase auth user.
//   1. Create the user first: Supabase dashboard → Authentication → Users → Add user
//   2. npm run admin:create -- you@example.com
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.

import { loadEnv, requireEnv } from "./_env.mjs";

const email = process.argv.slice(2).find((a) => a.includes("@"));
if (!email) {
  console.error("Usage: npm run admin:create -- you@example.com");
  process.exit(1);
}

loadEnv();
requireEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const { createClient } = await import("@supabase/supabase-js");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

let user = null;
for (let page = 1; page <= 20 && !user; page++) {
  const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (data.users.length < 200) break;
}

if (!user) {
  console.error(`No auth user found for ${email}.`);
  console.error("Create them in the Supabase dashboard (Authentication → Users → Add user), then re-run.");
  process.exit(1);
}

const { error } = await db.from("admins").upsert({ user_id: user.id, email: user.email }, { onConflict: "user_id" });
if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`✓ ${email} is now an admin.`);
