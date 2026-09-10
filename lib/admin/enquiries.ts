import { requireAdmin } from "@/lib/auth";
import { restaurantDay, type CateringEnquiry, type EnquiryStatus } from "@/lib/enquiry-types";

export * from "@/lib/enquiry-types";

export type EnquiryBoard = {
  today: CateringEnquiry[];
  earlier: CateringEnquiry[];
  newCount: number;
  todayCount: number;
};

/** Catering requests, split into today's (restaurant time) and everything else. */
export async function getEnquiryBoard(status?: EnquiryStatus): Promise<EnquiryBoard> {
  const { supabase } = await requireAdmin();
  let query = supabase.from("catering_enquiries").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return { today: [], earlier: [], newCount: 0, todayCount: 0 };

  const rows = (data ?? []) as CateringEnquiry[];
  // Compare formatted day strings rather than doing offset maths, so the split
  // stays correct across daylight saving.
  const todayKey = restaurantDay(new Date());
  const today = rows.filter((r) => restaurantDay(r.created_at) === todayKey);

  return {
    today,
    earlier: rows.filter((r) => restaurantDay(r.created_at) !== todayKey),
    newCount: rows.filter((r) => r.status === "new").length,
    todayCount: today.length,
  };
}
