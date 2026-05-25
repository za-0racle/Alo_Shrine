import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env");
const outputDir = path.join(rootDir, "public", "share");

const readEnvFile = async () => {
  try {
    const content = await (await import("node:fs/promises")).readFile(envPath, "utf8");
    return content
      .split(/\r?\n/)
      .filter(Boolean)
      .filter((line) => !line.trim().startsWith("#"))
      .reduce((acc, line) => {
        const eqIndex = line.indexOf("=");
        if (eqIndex <= 0) return acc;
        const key = line.slice(0, eqIndex).trim();
        const value = line.slice(eqIndex + 1).trim();
        acc[key] = value;
        return acc;
      }, {});
  } catch {
    return {};
  }
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const stripHtml = (value = "") => String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getFirstImageFromContent = (content = "") => {
  const match = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match?.[1] || "";
};

const makeAbsoluteUrl = (value, siteUrl) => {
  if (!value) return "";
  try {
    return new URL(value).toString();
  } catch {
    if (!siteUrl) return value;
    try {
      return new URL(value, siteUrl).toString();
    } catch {
      return value;
    }
  }
};

const buildSharePage = ({ siteUrl, title, description, image, storyId }) => {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image);
  const safeCanonical = escapeHtml(new URL(`/share/${storyId}.html`, siteUrl).toString());
  const targetUrl = escapeHtml(new URL(`/?story=${storyId}#reader`, siteUrl).toString());

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle} | alo</title>
  <meta name="description" content="${safeDescription}">
  <link rel="canonical" href="${safeCanonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:image:secure_url" content="${safeImage}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:url" content="${safeCanonical}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${safeImage}">
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <script>window.location.replace(${JSON.stringify(new URL(`/?story=${storyId}#reader`, siteUrl).toString())});</script>
</head>
<body>
  <p>Opening story...</p>
</body>
</html>
`;
};

const clearOutputDir = async () => {
  await mkdir(outputDir, { recursive: true });
  const entries = await readdir(outputDir, { withFileTypes: true });
  await Promise.all(
    entries.map((entry) =>
      rm(path.join(outputDir, entry.name), { recursive: true, force: true }),
    ),
  );
};

const main = async () => {
  const env = await readEnvFile();
  const supabaseUrl = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
  const siteUrl =
    process.env.VITE_SITE_URL ||
    process.env.SITE_URL ||
    env.VITE_SITE_URL ||
    env.SITE_URL ||
    "https://example.com";

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Skipping share page generation: missing Supabase environment variables.");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  const { data: posts = [], error } = await supabase
    .from("posts")
    .select("id, title, content, status, type, series_id, series_order, series(id, title, cover_url)")
    .in("status", ["published", "featured"]);

  if (error) {
    console.warn(`Skipping share page generation: ${error.message}`);
    return;
  }

  await clearOutputDir();

  const defaultImage = makeAbsoluteUrl("/alo-logo.png", siteUrl);

  await Promise.all(
    posts.map(async (post) => {
      const storyId = String(post.id || "").trim();
      if (!storyId) return;

      const title = post.series?.title || post.title || "A story from alo";
      const textExcerpt = stripHtml(post.content || "");
      const description = textExcerpt
        ? `${textExcerpt.slice(0, 180)}${textExcerpt.length > 180 ? "..." : ""}`
        : "Read this story on alo, where stories are treated like offerings.";

      const cover = post.series?.cover_url || getFirstImageFromContent(post.content || "");
      const image = makeAbsoluteUrl(cover, siteUrl) || defaultImage;
      const html = buildSharePage({ siteUrl, title, description, image, storyId });
      const outPath = path.join(outputDir, `${storyId}.html`);
      await writeFile(outPath, html, "utf8");
    }),
  );

  console.log(`Generated ${posts.length} share page(s) in public/share.`);
};

main().catch((error) => {
  console.error("Share page generation failed:", error);
  process.exitCode = 1;
});
