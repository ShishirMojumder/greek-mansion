import { readdir } from "node:fs/promises";
import path from "node:path";

export type LibraryImage = { url: string; label: string; folder: string };

/** Folders under /public that hold dish photography, in the order we prefer them. */
const FOLDERS = [
  { dir: "real-food", label: "Real photos" },
  { dir: "menu", label: "Menu art" },
  { dir: "features", label: "Features" },
];

const EXT = /\.(jpe?g|png|webp|avif)$/i;

/** "greekmansion-chickenwrap-native.jpg" -> "chicken wrap" */
function toLabel(file: string) {
  return file
    .replace(EXT, "")
    .replace(/^greekmansion[-_]?/i, "")
    .replace(/[-_]?native$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

let cache: LibraryImage[] | null = null;

/** Every dish photo already committed under /public/images. */
export async function getImageLibrary(): Promise<LibraryImage[]> {
  if (cache) return cache;
  const root = path.join(process.cwd(), "public", "images");
  const out: LibraryImage[] = [];

  for (const { dir, label } of FOLDERS) {
    let files: string[] = [];
    try {
      files = await readdir(path.join(root, dir));
    } catch {
      continue; // folder is optional
    }
    for (const file of files.filter((f) => EXT.test(f)).sort()) {
      out.push({ url: `/images/${dir}/${file}`, label: toLabel(file), folder: label });
    }
  }
  cache = out;
  return out;
}

const STOP = new Set(["the", "and", "with", "a", "of", "on", "in", "greek", "mansion", "native", "2"]);

const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));

/** Overlap score between a dish name and an image's filename. 0 = no match.
 *  How many words of the dish name are covered dominates, so "Gyro Wrap" picks
 *  "gyrowrap.jpg" over a generic "wrap-01.jpg" that only matches one word. */
export function matchScore(itemName: string, image: LibraryImage): number {
  const a = tokens(itemName);
  const b = tokens(image.label);
  if (!a.length || !b.length) return 0;

  let matched = 0;
  let exact = 0;
  const used = new Set<string>();

  for (const t of a) {
    if (b.includes(t)) {
      matched++;
      exact++;
      used.add(t);
    } else {
      // Handles both "gyros"/"gyro" and run-together filenames like "gyrowrap".
      const hit = b.find((u) => u.includes(t) || t.includes(u));
      if (hit) {
        matched++;
        used.add(hit);
      }
    }
  }
  if (!matched) return 0;

  const extra = b.filter((u) => !used.has(u) && !a.some((t) => u.includes(t) || t.includes(u))).length;
  return matched * 10 + exact * 0.5 - extra * 3;
}

/** Best library photos for a dish, strongest first. */
export function suggestImages(itemName: string, library: LibraryImage[], limit = 4): LibraryImage[] {
  return library
    .map((image) => ({ image, score: matchScore(itemName, image) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.image);
}
