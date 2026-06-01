import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SITE_URL = "https://aloshrine.ink";
const DIST_DIR = "dist";
const DIST_INDEX_PATH = join(DIST_DIR, "index.html");
const SITEMAP_PATH = "public/sitemap.xml";
const DEFAULT_IMAGE = `${SITE_URL}/alo-banner-trans.png`;
const postPathPattern = /^\/(?:stories|poems|essays|comics|ai-stories)\/[^/]+\/[^/]+$/;

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

const getDisplayTitle = (post = {}) => {
  if (post.series_id || post.series) return post.series?.title || post.title || "Story from alo";
  return post.title || "Story from alo";
};

const getCollectionPathForPost = (post = {}) => {
  const type = (post.type || "").toLowerCase();
  if (["poem", "poetry"].includes(type)) return "poems";
  if (type === "essay") return "essays";
  if (type === "comic") return "comics";
  if (["ai-story", "audio-story"].includes(type)) return "ai-stories";
  return "stories";
};

const getPostPath = (post) => `/${getCollectionPathForPost(post)}/${post.id}/${slugify(getDisplayTitle(post))}`;

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getDescription = (post = {}) => {
  const text = stripHtml(post.content || "");
  if (text) return `${text.slice(0, 155)}${text.length > 155 ? "..." : ""}`;
  return `Read "${getDisplayTitle(post)}" on alo, where stories are treated like offerings.`;
};

const getFirstImageFromContent = (content = "") => {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
};

const toAbsoluteUrl = (value = "") => {
  if (!value) return "";
  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return "";
  }
};

const getImage = (post = {}) => toAbsoluteUrl(post.series?.cover_url) || toAbsoluteUrl(getFirstImageFromContent(post.content || "")) || DEFAULT_IMAGE;

const escapeHtml = (value = "") =>
  value
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const replaceTag = (html, selector, replacement) => {
  const patterns = {
    title: /<title>[\s\S]*?<\/title>/,
    description: /<meta name="description" content="[^"]*"\s*\/?>/,
    canonical: /<link rel="canonical" href="[^"]*"\s*\/?>/,
    ogTitle: /<meta property="og:title" content="[^"]*"\s*\/?>/,
    ogDescription: /<meta property="og:description" content="[^"]*"\s*\/?>/,
    ogImage: /<meta property="og:image" content="[^"]*"\s*\/?>/,
    ogSecureImage: /<meta property="og:image:secure_url" content="[^"]*"\s*\/?>/,
    ogUrl: /<meta property="og:url" content="[^"]*"\s*\/?>/,
    ogType: /<meta property="og:type" content="[^"]*"\s*\/?>/,
    twitterTitle: /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    twitterDescription: /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    twitterImage: /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
  };

  return html.replace(patterns[selector], replacement);
};

const getPublishedPosts = async () => {
  loadLocalEnv();

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return [];

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
    const { data = [], error } = await supabase
      .from("posts")
      .select("id, title, type, content, created_at, series_id, series_order, series(id, title, cover_url)")
      .in("status", ["published", "featured"])
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.warn(`Skipping rich post page metadata: ${error.message}`);
    return [];
  }
};

const getSitemapPostPaths = () => {
  if (!existsSync(SITEMAP_PATH)) return [];

  const xml = readFileSync(SITEMAP_PATH, "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  return locs
    .map((url) => {
      try {
        return new URL(url).pathname;
      } catch {
        return "";
      }
    })
    .filter((path) => postPathPattern.test(path));
};

const buildPageHtml = (template, page) => {
  const title = escapeHtml(`${page.title} - Shrine of Tales`);
  const description = escapeHtml(page.description);
  const image = escapeHtml(page.image);
  const url = escapeHtml(page.url);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    image: page.image,
    url: page.url,
    mainEntityOfPage: page.url,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "alo",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/alo-logo-trans.png`,
      },
    },
  };

  let html = template;
  html = replaceTag(html, "title", `<title>${title}</title>`);
  html = replaceTag(html, "description", `<meta name="description" content="${description}">`);
  html = replaceTag(html, "canonical", `<link rel="canonical" href="${url}">`);
  html = replaceTag(html, "ogTitle", `<meta property="og:title" content="${escapeHtml(page.title)}">`);
  html = replaceTag(html, "ogDescription", `<meta property="og:description" content="${description}">`);
  html = replaceTag(html, "ogImage", `<meta property="og:image" content="${image}">`);
  html = replaceTag(html, "ogSecureImage", `<meta property="og:image:secure_url" content="${image}">`);
  html = replaceTag(html, "ogUrl", `<meta property="og:url" content="${url}">`);
  html = replaceTag(html, "ogType", `<meta property="og:type" content="article">`);
  html = replaceTag(html, "twitterTitle", `<meta name="twitter:title" content="${escapeHtml(page.title)}">`);
  html = replaceTag(html, "twitterDescription", `<meta name="twitter:description" content="${description}">`);
  html = replaceTag(html, "twitterImage", `<meta name="twitter:image" content="${image}">`);

  return html.replace("</head>", `    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>\n</head>`);
};

if (!existsSync(DIST_INDEX_PATH)) {
  console.warn("Skipping post page generation: dist/index.html was not found.");
  process.exit(0);
}

const template = readFileSync(DIST_INDEX_PATH, "utf8");
const posts = await getPublishedPosts();
const pagesByPath = new Map();

posts.forEach((post) => {
  const path = getPostPath(post);
  pagesByPath.set(path, {
    path,
    title: getDisplayTitle(post),
    description: getDescription(post),
    image: getImage(post),
    url: new URL(path, SITE_URL).toString(),
  });
});

getSitemapPostPaths().forEach((path) => {
  if (pagesByPath.has(path)) return;
  const slug = path.split("/").pop() || "story";
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  pagesByPath.set(path, {
    path,
    title,
    description: `Read "${title}" on alo, where stories are treated like offerings.`,
    image: DEFAULT_IMAGE,
    url: new URL(path, SITE_URL).toString(),
  });
});

pagesByPath.forEach((page) => {
  const outputPath = join(DIST_DIR, ...page.path.slice(1).split("/"), "index.html");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, buildPageHtml(template, page));
});

console.log(`Wrote ${pagesByPath.size} post HTML pages to ${DIST_DIR}.`);
