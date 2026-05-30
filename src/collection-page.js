import { supabase } from "../Lib/supabaseClient.js";

const shrineFilters = {
  stories: {
    label: "Stories Shrine",
    intro: "Stories, folklore, narratives, and unfolding series from the shrine.",
    types: ["story", "series", "folklore", "narrative"],
  },
  poems: {
    label: "Poems Shrine",
    intro: "Poetry offerings and lyrical reflections from the fire circle.",
    types: ["poem", "poetry"],
  },
  essays: {
    label: "Essays Shrine",
    intro: "Essays and meditative long-form offerings.",
    types: ["essay"],
  },
  comics: {
    label: "Comics Shrine",
    intro: "Illustrated stories and comic offerings in sequence.",
    types: ["comic"],
  },
  "ai-stories": {
    label: "AI Stories Shrine",
    intro: "AI tales, narrated stories, and experimental offerings.",
    types: ["ai-story", "audio-story"],
  },
};

const pageRoot = document.querySelector("[data-collection-page]");
const collectionKey = pageRoot?.dataset.collectionPage || "";
const selectedFilter = shrineFilters[collectionKey];
const titleElement = document.querySelector("#collection-title");
const introElement = document.querySelector("#collection-intro");
const grid = document.querySelector("#collection-grid");
const SITE_URL = "https://aloshrine.ink";

const getStoryFormat = (post = null) =>
  post?.series_id || post?.series ? "series" : post?.story_format || "standalone";

const getDisplayTitle = (post) => post.title || "Untitled offering";

const slugify = (value = "") =>
  value
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "offering";

const getStoryExcerpt = (post) => {
  const text = (post.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? `${text.slice(0, 145)}${text.length > 145 ? "..." : ""}` : "This offering awaits your reading.";
};

const getSeriesLabel = (post) => {
  if (getStoryFormat(post) !== "series") return post.type || "story";
  const number = post.series_order ? `Episode ${post.series_order}` : "Episode";
  return `${post.series?.title || "Untitled series"} - ${number}`;
};

const calculateReadingTime = (content = "") => {
  const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = plainText ? plainText.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 220));
};

const getPageUrl = () => new URL(`${collectionKey}.html`, `${SITE_URL}/`).toString();

const getPostPath = (post) => `/${collectionKey}/${post.id}/${slugify(getDisplayTitle(post))}`;

const getPostUrl = (post) => new URL(getPostPath(post), `${SITE_URL}/`).toString();

const upsertStructuredData = (offerings = []) => {
  if (!selectedFilter) return;

  let script = document.querySelector("#collection-structured-data");
  if (!script) {
    script = document.createElement("script");
    script.id = "collection-structured-data";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${getPageUrl()}#webpage`,
    name: `${selectedFilter.label} | àlọ́`,
    url: getPageUrl(),
    description: selectedFilter.intro,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@type": "Brand",
      "@id": `${SITE_URL}/#brand`,
      name: "àlọ́",
      alternateName: "Shrine of Tales",
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: offerings.slice(0, 20).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: getPostUrl(post),
        name: getDisplayTitle(post),
      })),
    },
  });
};

const renderEmptyState = () => {
  grid.innerHTML = `
    <article class="collection-empty">
      <p class="eyebrow">No Offerings Yet</p>
      <h3>The altar is ready.</h3>
      <p>This shrine has no published works yet. Return soon for new offerings.</p>
      <a class="text-button" href="./index.html#home">Return to the main shrine</a>
    </article>
  `;
};

const bootstrap = async () => {
  if (!selectedFilter || !grid || !titleElement || !introElement) return;

  titleElement.textContent = selectedFilter.label;
  introElement.textContent = selectedFilter.intro;

  const { data: posts = [], error } = await supabase
    .from("posts")
    .select("*, series(id, title, cover_url)")
    .in("status", ["published", "featured"])
    .order("created_at", { ascending: false });

  if (error) {
    renderEmptyState();
    return;
  }

  const offerings = posts.filter((post) => {
    const type = (post.type || "").toLowerCase();
    return selectedFilter.types.includes(type) || (collectionKey === "stories" && getStoryFormat(post) === "series");
  });
  upsertStructuredData(offerings);

  if (!offerings.length) {
    renderEmptyState();
    return;
  }

  grid.replaceChildren();
  offerings.forEach((post) => {
    const card = document.createElement("a");
    const title = document.createElement("h3");
    const meta = document.createElement("p");
    const excerpt = document.createElement("p");
    const readTime = document.createElement("span");
    const openLink = getPostPath(post);

    card.className = "story-card";
    card.href = openLink;
    title.textContent = getDisplayTitle(post);
    meta.className = "eyebrow";
    meta.textContent = getSeriesLabel(post);
    excerpt.textContent = getStoryExcerpt(post);
    readTime.className = "collection-meta";
    readTime.textContent = `${calculateReadingTime(post.content || "")} min read`;

    card.append(meta, title, excerpt, readTime);
    grid.appendChild(card);
  });
};

bootstrap();
