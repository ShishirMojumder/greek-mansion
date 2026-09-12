import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { serviceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

/** Nightly: clear "sold out today" items whose reset time has passed.
 *  Triggered by Vercel Cron (see vercel.json) ~04:10 America/Toronto. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  // Fail closed. A missing deployment secret must never turn this privileged
  // service-role endpoint into a public write API.
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const db = serviceClient();
    const { data, error } = await db
      .from("menu_items")
      .update({ availability: "available", sold_out_until: null })
      .eq("availability", "sold_out_today")
      .lt("sold_out_until", new Date().toISOString())
      .select("id");
    if (error) {
      console.error("sold-out reset failed", error);
      return NextResponse.json({ error: "reset_failed" }, { status: 500 });
    }
    revalidateTag("menu");
    return NextResponse.json({ ok: true, cleared: data?.length ?? 0 });
  } catch (error) {
    console.error("sold-out reset failed", error);
    return NextResponse.json({ error: "reset_failed" }, { status: 500 });
  }
}
