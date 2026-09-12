const LOCAL_IMAGE_PREFIX = "/images/";
const SUPABASE_PUBLIC_STORAGE_PREFIX = "/storage/v1/object/public/menu/";

/** Accept only committed images or objects in this project's public menu bucket. */
export function isAllowedMenuImageUrl(value: string): boolean {
  if (value.startsWith(LOCAL_IMAGE_PREFIX) && !value.includes("..")) return true;

  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!configuredUrl) return false;

  try {
    const candidate = new URL(value);
    const configured = new URL(configuredUrl);
    return candidate.protocol === "https:"
      && candidate.origin === configured.origin
      && candidate.pathname.startsWith(SUPABASE_PUBLIC_STORAGE_PREFIX);
  } catch {
    return false;
  }
}
