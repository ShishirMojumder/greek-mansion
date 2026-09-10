"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { ENQUIRY_STATUS, type EnquiryStatus } from "@/lib/enquiry-types";

/** Move a catering enquiry along the follow-up track. */
export async function setEnquiryStatus(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as EnquiryStatus;
  if (!id || !ENQUIRY_STATUS.includes(status)) return;

  await supabase
    .from("catering_enquiries")
    .update({
      status,
      // "new" means nobody has picked it up, so clear the handler too.
      handled_at: status === "new" ? null : new Date().toISOString(),
      handled_by: status === "new" ? null : user.email,
    })
    .eq("id", id);

  revalidatePath("/gm-admin/enquiries");
}

export async function deleteEnquiry(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabase.from("catering_enquiries").delete().eq("id", id);
  revalidatePath("/gm-admin/enquiries");
}
