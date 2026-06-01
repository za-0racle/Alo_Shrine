import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const SITE_URL = "https://aloshrine.ink";
const SITEMAP_PATH = "public/sitemap.xml";
const today = new Date().toISOString().slice(0, 10);
const postPathPattern = /^\/(?:stories|poems|essays|comics|ai-stories)\/[^/]+\/[^/]+$/;

const staticPages = [
  { path: "/", priority: "1.0" },
  { path: "/stories.html", priority: "0.8" },
  { path: "/poems.html", priority: "0.8" },
  { path: "/essays.html", priority: "0.8" },
  { path: "/comics.html", priority: "0.8" },
  { path: "/ai-stories.html", priority: "0.8" },
];

const loadLocalEnv = () => {
  if (!existsSync(".env")) return;

  const lines = readFileSync(".env", "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) return;

    const [, key, rawValue = ""] = match;
    if (process.env[key]) return;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  });
};

const slugify = (value = "") =>
  value
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "offering";

const getCollectionPathForPost = (post = {}) => {
  const type = (post.type || "").toLowerCase();
  if (["poem", "poetry"].includes(type)) return "poems";
  if (type === "essay") return "essays";
  if (type === "comic") return "comics";
  if (["ai-story", "audio-story"].includes(type)) return "ai-stories";
  return "stories";
};

const getPostPath = (post) => `/${getCollectionPathForPost(post)}/${post.id}/${slugify(post.title || "offering")}`;

const formatUrl = ({ path, lastmod = today, priority = "0.7", changefreq = "weekly" }) => `  <url>
    <loc>${new URL(path, SITE_URL).toString()}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const getExistingDynamicUrls = () => {
  if (!existsSync(SITEMAP_PATH)) return [];

  const xml = readFileSync(SITEMAP_PATH, "utf8");
  return [...xml.matchAll(/<url>[\s\S]*?<\/url>/g)]
    .map((match) => {
      const block = match[0];
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
      const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || today;
      const priority = block.match(/<priority>([^<]+)<\/priority>/)?.[1] || "0.7";
      const changefreq = block.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1] || "weekly";
      if (!loc) return null;

      try {
        const path = new URL(loc).pathname;
        return postPathPattern.test(path) ? { path, lastmod, priority, changefreq } : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
};

const getPublishedPosts = async () => {
  loadLocalEnv();

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Skipping dynamic sitemap entries: missing Supabase env variables.");
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
    const { data = [], error } = await supabase
      .from("posts")
      .select("id, title, type, created_at")
      .in("status", ["published", "featured"])
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`Skipping dynamic sitemap entries: ${error.message}`);
    return [];
  }
};

const posts = await getPublishedPosts();
const dynamicUrls = posts.length
  ? posts.map((post) =>
      formatUrl({
        path: getPostPath(post),
        lastmod: (post.created_at || today).slice(0, 10),
        priority: "0.7",
      }),
    )
  : getExistingDynamicUrls().map((url) => formatUrl(url));
const urls = [
  ...staticPages.map((page) => formatUrl({ ...page, lastmod: today })),
  ...dynamicUrls,
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

writeFileSync(SITEMAP_PATH, sitemap);
console.log(`Wrote ${urls.length} URLs to ${SITEMAP_PATH}.`);
