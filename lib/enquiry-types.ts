// Client-safe: shared shape for the catering enquiry form and the admin screen.

export const ENQUIRY_STATUS = ["new", "contacted", "booked", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUS)[number];

export const ENQUIRY_STATUS_LABEL: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  closed: "Closed",
};

export type CateringEnquiry = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  guest_count: string;
  event_type: string;
  message: string | null;
  status: EnquiryStatus;
  handled_at: string | null;
  handled_by: string | null;
};

/** The restaurant is in Scarborough, so "today" means today in Toronto — not
 *  in the server's timezone or the admin's browser. */
export const RESTAURANT_TZ = "America/Toronto";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: RESTAURANT_TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "2026-09-11" for an instant, in restaurant time. */
export const restaurantDay = (iso: string | Date) =>
  dayFormatter.format(typeof iso === "string" ? new Date(iso) : iso);

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: RESTAURANT_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
