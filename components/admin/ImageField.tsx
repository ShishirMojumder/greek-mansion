"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ImageLibraryPicker } from "./ImageLibraryPicker";
import type { LibraryImage } from "@/lib/admin/image-library";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function ImageField({
  name,
  initial,
  library = [],
}: {
  name: string;
  initial?: string | null;
  library?: LibraryImage[];
}) {
  const [url, setUrl] = useState(initial ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [picking, setPicking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = IMAGE_EXTENSIONS[file.type];
    if (!ext || file.size > MAX_IMAGE_BYTES) {
      setErr("Choose a JPG, PNG, WebP or AVIF image under 5 MB.");
      e.target.value = "";
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const supabase = createClient();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("menu").upload(path, file, { contentType: file.type });
      if (error) throw error;
      setUrl(supabase.storage.from("menu").getPublicUrl(path).data.publicUrl);
    } catch {
      setErr("Upload failed. Use a JPG, PNG or WebP under 5 MB.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="Current menu item" className="h-16 w-16 shrink-0 rounded-lg border border-navy/15 object-cover" />
        ) : (
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-dashed border-navy/20 text-[10px] text-ink/35">
            none
          </span>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center rounded-full border border-navy/20 px-3 py-2 text-sm font-semibold text-navy hover:bg-white focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold">
            {busy ? "Uploading…" : url ? "Replace" : "Upload image"}
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={onPick}
              disabled={busy}
              className="sr-only"
            />
          </label>
          {library.length > 0 && (
            <button
              type="button"
              onClick={() => setPicking((v) => !v)}
              className="rounded-full border border-navy/20 px-3 py-2 text-sm font-semibold text-navy hover:bg-white"
            >
              {picking ? "Hide library" : `Choose from library (${library.length})`}
            </button>
          )}
          {url && (
            <button type="button" onClick={() => setUrl("")} className="rounded-full px-3 py-2 text-sm font-semibold text-[#C0392B] transition hover:bg-[#C0392B]/10">
              Remove
            </button>
          )}
        </div>
      </div>
      {picking && (
        <ImageLibraryPicker
          library={library}
          selected={url}
          onPick={(picked) => {
            setUrl(picked);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
      {err && <p role="alert" className="text-sm text-[#C0392B]">{err}</p>}
    </div>
  );
}
