// Generates public/sitemap.xml from the LIVE Supabase reflections table
// (not the static import snapshot), so it stays accurate as reflections are
// added/edited/removed via /admin. Re-run this after any such change.
//
// Usage: node scripts/generate_sitemap.mjs

import { writeFileSync } from "fs";
import { slugify } from "../src/lib/slugify.js";

const SITE = "https://utsavmishra.com";
const SUPABASE_URL = "https://cityejgjchmaqmxsjsnk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BKXjj_E8e1xPUns3zTjm6g_CthbqCKV";

const res = await fetch(`${SUPABASE_URL}/rest/v1/reflections?select=title,display_order&order=display_order.asc`, {
  headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
});
if (!res.ok) {
  console.error("Failed to fetch reflections:", res.status, await res.text());
  process.exit(1);
}
const reflections = await res.json();

const today = new Date().toISOString().slice(0, 10);

const staticUrls = [
  { loc: `${SITE}/`, priority: "1.0" },
  { loc: `${SITE}/reflections`, priority: "0.8" },
];

const reflectionUrls = reflections.map((r) => ({
  loc: `${SITE}/reflections/${slugify(r.title)}`,
  priority: "0.6",
}));

const urls = [...staticUrls, ...reflectionUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);
