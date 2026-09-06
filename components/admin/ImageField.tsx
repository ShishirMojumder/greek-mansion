"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ImageField({ name, initial }: { name: string; initial?: string | null }) {
  const [url, setUrl] = useState(initial ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
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
          <img src={url} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-[#1E2A78]/15 object-cover" />
        ) : (
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-dashed border-[#1E2A78]/20 text-[10px] text-[#111936]/35">
            none
          </span>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex cursor-pointer items-center rounded-full border border-[#1E2A78]/20 px-3 py-2 text-sm font-semibold text-[#1E2A78] hover:bg-white">
            {busy ? "Uploading…" : url ? "Replace" : "Upload image"}
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={onPick}
              disabled={busy}
              className="hidden"
            />
          </label>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="rounded-full px-3 py-2 text-sm font-semibold text-[#C0392B] transition hover:bg-[#C0392B]/10">
              Remove
            </button>
          )}
        </div>
      </div>
      {err && <p className="text-sm text-[#C0392B]">{err}</p>}
    </div>
  );
}
