// One-time: create a confirmed Supabase auth user AND mark them admin.
// Uses the service_role key (intentional creation — not public signup).
//   npm run admin:bootstrap -- you@example.com [password]
// If no password is given, a strong one is generated and printed once.

import { randomBytes } from "node:crypto";
import { loadEnv, requireEnv } from "./_env.mjs";

const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const email = args.find((a) => a.includes("@"));
let password = args.find((a) => !a.includes("@"));
if (!email) {
  console.error("Usage: npm run admin:bootstrap -- you@example.com [password]");
  process.exit(1);
}
if (!password) {
  password = randomBytes(12).toString("base64").replace(/[+/=]/g, "").slice(0, 16) + "A1!";
}

loadEnv();
requireEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);

const { createClient } = await import("@supabase/supabase-js");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// find or create the auth user
let user = null;
for (let page = 1; page <= 20 && !user; page++) {
  const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
  if (error) { console.error(error.message); process.exit(1); }
  user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (data.users.length < 200) break;
}

let created = false;
if (!user) {
  const { data, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
  if (error) { console.error("createUser:", error.message); process.exit(1); }
  user = data.user;
  created = true;
} else {
  const { error } = await db.auth.admin.updateUserById(user.id, { password, email_confirm: true });
  if (error) { console.error("updateUser:", error.message); process.exit(1); }
}

const { error: ae } = await db.from("admins").upsert({ user_id: user.id, email: user.email }, { onConflict: "user_id" });
if (ae) { console.error("admins:", ae.message); process.exit(1); }

console.log(`\n✓ ${email} ${created ? "created" : "updated"} and set as admin.`);
console.log(`  password: ${password}`);
console.log(`  Sign in at /gm-admin/login and change it (or reset via the Supabase dashboard).\n`);
