// Server-only: reads TELEGRAM_BOT_TOKEN. Never import from a Client Component.
/** Telegram limits a message to 4096 characters. */
const MAX_LENGTH = 4000;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Chat ids to notify. Comma-separated, so the owner and a manager can both
 *  be on the list without a code change. */
const chatIds = () =>
  (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

export const telegramConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN) && chatIds().length > 0;

/**
 * Push a message to the restaurant's Telegram.
 *
 * Never throws: a notification is a courtesy on top of a record that is
 * already saved, so a Telegram outage must not turn into a failed enquiry.
 * Returns whether every recipient got it, for logging.
 */
export async function sendTelegram(html: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const recipients = chatIds();
  if (!token || recipients.length === 0) return false;

  const text = html.length > MAX_LENGTH ? `${html.slice(0, MAX_LENGTH)}…` : html;

  const results = await Promise.all(
    recipients.map(async (chat_id) => {
      try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id,
            text,
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
          // Never let a hanging request hold up the visitor's form response.
          signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) {
          console.error(`telegram send failed (${chat_id}):`, response.status, await response.text());
          return false;
        }
        return true;
      } catch (cause) {
        console.error(`telegram send failed (${chat_id}):`, cause);
        return false;
      }
    }),
  );

  return results.every(Boolean);
}

/** The alert the restaurant sees when a catering request comes in. */
export function cateringMessage(enquiry: {
  name: string;
  email: string;
  phone: string;
  event_date: string;
  guest_count: string;
  event_type: string;
  message?: string | null;
}) {
  const time = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://greekmansion.ca";
  const e = escapeHtml;

  const lines = [
    "🍽️ <b>New catering request</b>",
    "",
    `<b>${e(enquiry.name)}</b>`,
    `📞 ${e(enquiry.phone)}`,
    `✉️ ${e(enquiry.email)}`,
    "",
    `📅 Event: ${e(enquiry.event_date)}`,
    `👥 ${e(enquiry.guest_count)} guests · ${e(enquiry.event_type)}`,
  ];

  if (enquiry.message?.trim()) lines.push("", `💬 ${e(enquiry.message.trim())}`);

  lines.push("", `<i>Received ${e(time)}</i>`, `<a href="${site}/gm-admin/enquiries">Open in admin</a>`);

  return lines.join("\n");
}
