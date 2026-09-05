// Shared between the app (URL generation/matching) and scripts/generate_sitemap.mjs
// (must stay identical in both places so sitemap URLs actually resolve).
const DIACRITICS = new RegExp("[̀-ͯ]", "g");

export function slugify(title) {
  return (title || "")
    .toLowerCase()
    .normalize("NFKD").replace(DIACRITICS, "")
    .replace(/['‘’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
