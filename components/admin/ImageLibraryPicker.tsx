"use client";

import { useMemo, useState } from "react";
import type { LibraryImage } from "@/lib/admin/image-library";

/** Searchable grid of the photos already shipped in /public/images.
 *  `onPick` receives the chosen path; the caller decides what to do with it. */
export function ImageLibraryPicker({
  library,
  onPick,
  onClose,
  selected,
}: {
  library: LibraryImage[];
  onPick: (url: string) => void;
  onClose: () => void;
  selected?: string;
}) {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const hits = term ? library.filter((i) => i.label.includes(term)) : library;
    const byFolder = new Map<string, LibraryImage[]>();
    for (const image of hits) {
      const list = byFolder.get(image.folder) ?? [];
      list.push(image);
      byFolder.set(image.folder, list);
    }
    return [...byFolder.entries()];
  }, [library, q]);

  const total = groups.reduce((n, [, list]) => n + list.length, 0);

  return (
    <div className="rounded-xl border border-navy/15 bg-marble/60 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search photos — gyro, souvlaki, salad…"
          className="min-w-[190px] flex-1 rounded-full border border-navy/20 bg-white px-4 py-2 text-sm outline-none focus:border-gold"
        />
        <span className="text-xs text-ink/45">{total} photos</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-navy/20 px-3 py-2 text-sm font-semibold text-navy hover:bg-white"
        >
          Close
        </button>
      </div>

      {total === 0 ? (
        <p className="py-6 text-center text-sm text-ink/45">No photos match “{q}”.</p>
      ) : (
        <div className="mt-3 max-h-[340px] overflow-y-auto pr-1">
          {groups.map(([folder, list]) => (
            <div key={folder} className="mb-3 last:mb-0">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-ink/40">{folder}</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {list.map((image) => {
                  const active = selected === image.url;
                  return (
                    <button
                      key={image.url}
                      type="button"
                      onClick={() => onPick(image.url)}
                      title={image.label}
                      className={`group overflow-hidden rounded-lg border bg-white text-left transition ${
                        active ? "border-gold ring-2 ring-gold/40" : "border-navy/12 hover:border-gold"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.url} alt="" loading="lazy" className="h-16 w-full object-cover" />
                      <span className="block truncate px-1.5 py-1 text-[10px] capitalize text-ink/55">
                        {image.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
