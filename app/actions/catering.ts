"use server";

import { z } from "zod";
import { publicClient } from "@/lib/supabase/public";
import { cateringMessage, sendTelegram, telegramConfigured } from "@/lib/notify/telegram";

const trimmed = (max: number) => z.string().trim().min(1).max(max);

const schema = z.object({
  name: trimmed(120),
  email: z.string().trim().email().max(200),
  phone: trimmed(40),
  event_date: trimmed(60),
  guest_count: trimmed(40),
  event_type: trimmed(80),
  message: z.string().trim().max(2000).optional(),
});

export type EnquiryResult =
  | { ok: true }
  | { ok: false; error: string; fields?: Record<string, string> };

/** Receives the public catering form. Stores the enquiry so the restaurant has
 *  a record of every request, whether or not anyone replies by email. */
export async function submitCateringEnquiry(
  _previous: EnquiryResult | null,
  formData: FormData,
): Promise<EnquiryResult> {
  // Honeypot: a real person never fills a field they cannot see. Answer as if
  // it worked, so a bot gets no signal about what tripped it.
  if (String(formData.get("company") ?? "").trim()) return { ok: true };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    event_date: formData.get("event_date"),
    guest_count: formData.get("guest_count"),
    event_type: formData.get("event_type"),
    message: formData.get("message") || undefined,
  });

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fields[key]) fields[key] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fields };
  }

  try {
    // Keep the public form on the anonymous role so the insert-only RLS policy
    // remains the authorization boundary. This path does not need service access.
    const db = publicClient();
    const { error } = await db.from("catering_enquiries").insert({
      ...parsed.data,
      message: parsed.data.message ?? null,
    });
    if (error) {
      console.error("catering enquiry insert failed:", error.message);
      return { ok: false, error: "We could not send that. Please call 416 292 3333 and we will take the details." };
    }

    // The enquiry is safely stored by this point. Telegram is a courtesy ping
    // on top of it, so a failure here is logged and never shown to the guest.
    if (telegramConfigured()) {
      const delivered = await sendTelegram(cateringMessage(parsed.data));
      if (!delivered) console.error("catering enquiry saved but Telegram alert failed");
    }
  } catch (cause) {
    console.error("catering enquiry failed:", cause);
    return { ok: false, error: "We could not send that. Please call 416 292 3333 and we will take the details." };
  }

  return { ok: true };
}
