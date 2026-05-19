// Imports: app services used by the UI.
import { oracleActions } from "./admin";
import { authActions } from "./auth";
import { supabase } from "../Lib/supabaseClient.js";

// Core page elements.
const enterBtn = document.querySelector("#enter-btn");
const hero = document.querySelector("#hero");
const content = document.querySelector("#shrine-content");
const storyGrid = document.querySelector("#story-grid");
const storySectionHeading = document.querySelector("#explore .section-heading h2");
const appLoading = document.querySelector("#app-loading");
const appLoadingText = document.querySelector("#app-loading-text");

// Auth modal elements.
const authModal = document.querySelector("#auth-modal");
const authForm = document.querySelector("#auth-form");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const authFullName = document.querySelector("#auth-fullname");
const nameField = document.querySelector("#name-field");
const accountTypeField = document.querySelector("#account-type-field");
const closeAuthBtn = document.querySelector("#close-auth");
const authSubmit = document.querySelector("#auth-submit");
const authTitle = document.querySelector(".auth-title");
const authSubtitle = document.querySelector(".auth-subtitle");
const authToggle = document.querySelector(".auth-toggle");

// Navigation and view elements.
const writeButton = document.querySelector("#write .text-button");
const navAuthTrigger = document.querySelector("#nav-auth-trigger");
const navDashboard = document.querySelector("#nav-dashboard");
const navAdmin = document.querySelector("#nav-admin-link");
const goHome = document.querySelector("#go-home");
const publicNavLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(#nav-dashboard):not(#nav-reader-profile):not(#nav-admin-link)');
const visitorNavLinks = document.querySelectorAll(".visitor-nav");
const shrineFilterLinks = document.querySelectorAll("[data-shrine-filter]");
const dashboardView = document.querySelector("#dashboard-view");
const adminView = document.querySelector("#admin-view");
const readerView = document.querySelector("#reader-view");
const scrollView = document.querySelector("#scroll-view");
const logoutWriterBtn = document.querySelector("#logout-writer");
const exitOracleBtn = document.querySelector("#exit-oracle");
const navReaderProfile = document.querySelector("#nav-reader-profile");
const exitScrollBtn = document.querySelector("#exit-scroll");
const oracleContentList = document.querySelector("#oracle-content-list");
const stageCount = document.querySelector("#stage-count");
const publicViews = document.querySelectorAll(".public-view");
const writerPostsGrid = document.querySelector("#writer-posts-grid");
const writerPostsLabel = document.querySelector("#writer-posts-label");
const writerVisionsGrid = document.querySelector("#writer-visions-grid");
const shrineScreenView = document.querySelector("#shrine-screen-view");
const openScreenBtn = document.querySelector("#open-screen");
const exitScreenBtn = document.querySelector("#exit-screen");
const screenPreviewGrid = document.querySelector("#screen-preview-grid");
const videoGrid = document.querySelector("#video-grid");
const videoModal = document.querySelector("#video-modal");
const videoPlayerContainer = document.querySelector("#video-player-container");
const closeVideoBtn = document.querySelector("#close-video");
const dashboardTabs = document.querySelectorAll(".tab-btn");
const visualSubmissionArea = document.querySelector("#visual-submission-area");
const submitVisionBtn = document.querySelector("#submit-vision");
const visualTitle = document.querySelector("#visual-title");
const visualUrl = document.querySelector("#visual-url");

// Inkwell editor elements.
const editorView = document.querySelector("#editor-view");
const createBtn = document.querySelector("#create-offering");
const closeEditorBtn = document.querySelector("#close-editor");
const saveDraftBtn = document.querySelector("#save-draft");
const publishBtn = document.querySelector("#publish-offering");
const postType = document.querySelector("#post-type");
const postTitle = document.querySelector("#post-title");
const postContent = document.querySelector("#post-content");
const storyFormatInputs = document.querySelectorAll('input[name="story-format"]');
const seriesFields = document.querySelector("#series-fields");
const seriesTitle = document.querySelector("#series-title");
const episodeTitle = document.querySelector("#episode-title");
const episodeNumber = document.querySelector("#episode-number");
const releaseCadence = document.querySelector("#release-cadence");
const textColor = document.querySelector("#text-color");
const toolbarButtons = document.querySelectorAll("[data-command]");
const addLinkBtn = document.querySelector("#add-link");
const addImageBtn = document.querySelector("#add-image");
const addCoverBtn = document.querySelector("#add-cover");
const addYoutubeBtn = document.querySelector("#add-youtube");

let isSignUpMode = true;
let currentEditingPostId = null;
let currentEditingPostWasSeries = false;
let currentEditingVisionId = null;
let currentOpenPostId = null;
let currentOpenPostTitle = "";
let currentOpenPost = null;
let publicOfferingsCache = null;
let activeShrineFilter = "all";

const shrineFilters = {
  stories: {
    label: "Stories at the shrine",
    types: ["story", "series", "folklore", "narrative"],
  },
  poems: {
    label: "Poems at the shrine",
    types: ["poem", "poetry"],
  },
  essays: {
    label: "Essays at the shrine",
    types: ["essay"],
  },
  comics: {
    label: "Comics at the shrine",
    types: ["comic"],
  },
  "ai-stories": {
    label: "AI stories at the shrine",
    types: ["ai-story", "audio-story"],
  },
};

const setAppLoading = (isLoading, message = "Opening the shrine...") => {
  if (!appLoading) return;
  if (appLoadingText) appLoadingText.textContent = message;
  appLoading.classList.toggle("hidden", !isLoading);
};

const setAuthSubmitting = (isSubmitting, message = "àlọ́") => {
  authSubmit.disabled = isSubmitting;
  authSubmit.classList.toggle("is-loading", isSubmitting);
  authSubmit.textContent = isSubmitting ? message : isSignUpMode ? "Begin Journey" : "Step Inside";
};

const getStoryFormat = (post = null) =>
  post?.series_id || post?.series ? "series" : post?.story_format || "standalone";

const getActiveStoryFormat = () =>
  document.querySelector('input[name="story-format"]:checked')?.value || "standalone";

const setActiveStoryFormat = (format) => {
  storyFormatInputs.forEach((input) => {
    input.checked = input.value === format;
  });
  seriesFields.classList.toggle("hidden", format !== "series");
  postTitle.classList.toggle("hidden", format === "series");
  postTitle.required = format !== "series";
};

const getSeriesLabel = (post) => {
  if (getStoryFormat(post) !== "series") return post.type || "story";

  const number = post.series_order ? `Episode ${post.series_order}` : "Episode";
  return `${post.series?.title || "Untitled series"} - ${number}`;
};

const getDisplayTitle = (post) => post.title || "Untitled offering";

const getStoryShareUrl = (postId = currentOpenPostId) => {
  const url = new URL(window.location.href);
  url.searchParams.set("story", postId);
  url.hash = "reader";
  return url.toString();
};

const getAbsoluteAssetUrl = (path) => new URL(path, window.location.origin).toString();

const getFirstImageFromContent = (content = "") => {
  const template = document.createElement("template");
  template.innerHTML = normalizeStoredContent(content);
  const image = template.content.querySelector("img[src]");
  return image?.src || "";
};

const getPostCoverImage = (post = currentOpenPost) =>
  post?.series?.cover_url || getFirstImageFromContent(post?.content || "") || getAbsoluteAssetUrl("/alo-banner.png");

const getShareTitle = (post = currentOpenPost) => {
  if (!post) return currentOpenPostTitle || "A story from alo";
  if (getStoryFormat(post) === "series") return post.series?.title || getDisplayTitle(post);
  return getDisplayTitle(post);
};

const getShareMessage = (post = currentOpenPost) => {
  if (!post) return `Read "${currentOpenPostTitle || "this story"}" on alo.`;

  if (getStoryFormat(post) === "series") {
    const seriesName = post.series?.title || getDisplayTitle(post);
    const episode = post.series_order ? `Episode ${post.series_order}` : "A new episode";
    const episodeTitle = post.title ? `, "${post.title}"` : "";
    return `${episode}${episodeTitle} from ${seriesName} is waiting at alo. Step into the series before the next twist finds you.`;
  }

  return `Read "${getDisplayTitle(post)}" on alo, where stories are treated like offerings.`;
};

const upsertMetaTag = (selector, attributes) => {
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    tag.setAttribute(name, value);
  });
};

const updateShareMetadata = (post = currentOpenPost) => {
  if (!post) return;

  const title = getShareTitle(post);
  const description = getShareMessage(post);
  const image = getPostCoverImage(post);
  const url = getStoryShareUrl(post.id);

  document.title = `${title} - Shrine of Tales`;
  upsertMetaTag('meta[name="description"]', { name: "description", content: description });
  upsertMetaTag('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMetaTag('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMetaTag('meta[property="og:image"]', { property: "og:image", content: image });
  upsertMetaTag('meta[property="og:url"]', { property: "og:url", content: url });
  upsertMetaTag('meta[property="og:type"]', { property: "og:type", content: "article" });
  upsertMetaTag('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMetaTag('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMetaTag('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  upsertMetaTag('meta[name="twitter:image"]', { name: "twitter:image", content: image });
};

const isMissingColumnError = (error, columnName) =>
  Boolean(error?.message?.toLowerCase().includes(columnName.toLowerCase()));

const isAdminUser = (user) => {
  const role = user?.profile?.role || user?.user_metadata?.role || user?.app_metadata?.role;

  return Boolean(user?.profile?.is_admin || user?.user_metadata?.is_admin || user?.app_metadata?.is_admin || ["admin", "oracle"].includes(role));
};

const getUserRole = (user) => {
  const role = user?.profile?.role || user?.user_metadata?.role || user?.user_metadata?.account_type || "";
  if (["admin", "oracle", "writer"].includes(role)) return "writer";
  if (role === "reader") return "reader";
  return user?.profile?.writer_level && user.profile.writer_level !== "The Listener" ? "writer" : "reader";
};

const isWriterUser = (user) => getUserRole(user) === "writer";

const getVoiceLabel = (profile = {}) => {
  if ((profile.role || "").toLowerCase() === "reader") return "The Listener";
  return profile.writer_level || "The Listener";
};

const allowedRichTags = new Set([
  "A",
  "B",
  "BLOCKQUOTE",
  "BR",
  "DIV",
  "EM",
  "FIGURE",
  "FIGCAPTION",
  "H2",
  "H3",
  "I",
  "IFRAME",
  "IMG",
  "LI",
  "OL",
  "P",
  "SPAN",
  "STRONG",
  "U",
  "UL",
]);

const unsafeRichTags = new Set(["SCRIPT", "STYLE", "TEMPLATE"]);

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const plainTextToRichHtml = (value) =>
  value
    .split(/\n{2,}/)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");

const isSafeUrl = (value) => {
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const isSafeMediaUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const isSafeImageUrl = (value) => {
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:", "data:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const sanitizeRichContent = (html) => {
  const template = document.createElement("template");
  template.innerHTML = html;

  const cleanNode = (node) => {
    if (node.nodeType === Node.COMMENT_NODE) {
      node.remove();
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    if (unsafeRichTags.has(node.tagName)) {
      node.remove();
      return;
    }

    if (!allowedRichTags.has(node.tagName)) {
      const children = [...node.childNodes];
      node.replaceWith(...children);
      children.forEach(cleanNode);
      return;
    }

    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;
      const keep =
        (name === "href" && node.tagName === "A" && isSafeUrl(value)) ||
        (name === "src" && node.tagName === "IMG" && isSafeImageUrl(value)) ||
        (name === "src" && node.tagName === "IFRAME" && /^https:\/\/www\.youtube\.com\/embed\//.test(value)) ||
        (name === "alt" && node.tagName === "IMG") ||
        (name === "class" && ["FIGURE", "IMG"].includes(node.tagName)) ||
        (name === "style" && /^(color|text-align):\s*[^;]+;?$/.test(value)) ||
        (["allow", "allowfullscreen", "loading", "referrerpolicy", "title"].includes(name) &&
          node.tagName === "IFRAME");

      if (!keep) node.removeAttribute(attribute.name);
    });

    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }

    [...node.childNodes].forEach(cleanNode);
  };

  [...template.content.childNodes].forEach(cleanNode);
  return template.innerHTML.trim();
};

const normalizeStoredContent = (value = "") => {
  const content = value.trim();
  if (!content) return "";
  return content.includes("<") ? sanitizeRichContent(content) : plainTextToRichHtml(content);
};

const getYoutubeEmbedUrl = (value) => {
  try {
    const url = new URL(value);
    let videoId = "";

    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else if (url.hostname.includes("youtube.com")) {
      videoId = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop() || "";
    }

    const cleanId = videoId.replace(/[^a-zA-Z0-9_-]/g, "");
    return cleanId ? `https://www.youtube.com/embed/${cleanId}` : "";
  } catch {
    return "";
  }
};

const runEditorCommand = (command, value = null) => {
  postContent.focus();
  document.execCommand("styleWithCSS", false, true);
  document.execCommand(command, false, value);
};

const insertRichHtml = (html) => {
  runEditorCommand("insertHTML", html);
};

const pickImageFile = () =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener(
      "change",
      () => {
        const file = input.files?.[0] || null;
        resolve(file);
      },
      { once: true },
    );
    input.click();
  });

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });

const getAuthorProfiles = async (posts) => {
  const authorIds = [...new Set(posts.map((post) => post.author_id).filter(Boolean))];

  if (!authorIds.length) return new Map();

  const { data: profiles = [], error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", authorIds);

  if (error) {
    console.error("Error fetching public author profiles:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  return new Map(profiles.map((profile) => [profile.id, profile]));
};

const getStoryExcerpt = (post) => {
  const text = (post.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? `${text.slice(0, 150)}${text.length > 150 ? "..." : ""}` : "This offering is waiting for its words.";
};

const getPublicOfferings = async () => {
  if (publicOfferingsCache) return publicOfferingsCache;

  const { data: posts = [], error } = await supabase
    .from("posts")
    .select("*, series(id, title, cover_url)")
    .in("status", ["published", "featured"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public offerings:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    publicOfferingsCache = [];
    return publicOfferingsCache;
  }

  if (!posts.length) {
    publicOfferingsCache = [];
    return publicOfferingsCache;
  }

  const profilesById = await getAuthorProfiles(posts);
  publicOfferingsCache = posts.map((post) => ({
    ...post,
    authorName: profilesById.get(post.author_id)?.full_name || "Unknown scribe",
  }));

  return publicOfferingsCache;
};

const getFilteredOfferings = (offerings, filterName = activeShrineFilter) => {
  const filter = shrineFilters[filterName];
  if (!filter) return offerings;

  return offerings.filter((post) => {
    const type = (post.type || "").toLowerCase();
    return filter.types.includes(type) || (filterName === "stories" && getStoryFormat(post) === "series");
  });
};

const updateShrineFilterState = (filterName = "all") => {
  activeShrineFilter = filterName;

  shrineFilterLinks.forEach((link) => {
    const isActive = link.dataset.shrineFilter === filterName;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-pressed", String(isActive));
  });

  if (storySectionHeading) {
    storySectionHeading.textContent = shrineFilters[filterName]?.label || "New offerings at the shrine";
  }
};

// Render published public offerings without the old placeholder cards.
const renderFeaturedStories = async (filterName = activeShrineFilter) => {
  updateShrineFilterState(filterName);
  const offerings = getFilteredOfferings(await getPublicOfferings(), filterName);
  storyGrid.innerHTML = "";

  if (!offerings.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = shrineFilters[filterName]
      ? "No offerings have been placed in this shrine yet."
      : "No published offerings yet.";
    storyGrid.appendChild(emptyState);
    return;
  }

  offerings.forEach((story) => {
    const card = document.createElement("article");
    const header = document.createElement("div");
    const category = document.createElement("p");
    const title = document.createElement("h3");
    const excerpt = document.createElement("p");
    const meta = document.createElement("div");
    const author = document.createElement("span");
    const readTime = document.createElement("span");

    card.className = "story-card";
    card.tabIndex = 0;
    card.role = "button";
    category.className = "eyebrow";
    meta.className = "story-meta";

    category.textContent = getSeriesLabel(story);
    title.textContent = getDisplayTitle(story);
    excerpt.textContent = getStoryExcerpt(story);
    author.textContent = story.authorName || "Unknown scribe";
    readTime.textContent = `${calculateReadingTime(story.content || "")} min read`;

    card.addEventListener("click", () => openStory(story.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openStory(story.id);
      }
    });

    header.append(category, title);
    meta.append(author, readTime);
    card.append(header, excerpt, meta);
    storyGrid.appendChild(card);
  });
};

const scrollToSection = (selector) => {
  const target = document.querySelector(selector);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Switch between public shrine pages, private dashboard, reader, screen, and admin.
const showView = async (viewName, targetSelector = "#home") => {
  const showingDashboard = viewName === "dashboard";
  const showingAdmin = viewName === "admin";
  const showingScreen = viewName === "screen";
  const showingScroll = viewName === "scroll";

  publicViews.forEach((view) => view.classList.toggle("hidden", showingDashboard || showingAdmin || showingScreen || showingScroll));
  dashboardView.classList.toggle("hidden", !showingDashboard);
  adminView.classList.toggle("hidden", !showingAdmin);
  shrineScreenView?.classList.toggle("hidden", !showingScreen);
  scrollView?.classList.toggle("hidden", !showingScroll);
  readerView?.classList.add("hidden");
  document.body.classList.remove("focus-mode");
  document.body.style.overflow = "auto";

  if (showingDashboard) {
    const user = await authActions.getCurrentUser();

    if (!isWriterUser(user)) {
      await showView("scroll");
      return;
    }

    await loadWriterDashboard();
    scrollToSection("#dashboard-view");
    return;
  }

  if (showingAdmin) {
    const user = await authActions.getCurrentUser();

    if (!isAdminUser(user)) {
      alert("This account does not have Oracle access.");
      await showView("dashboard");
      return;
    }

    await loadOracleSubmissions();
    scrollToSection("#admin-view");
    return;
  }

  if (showingScreen) {
    await loadShrineScreen();
    scrollToSection("#shrine-screen-view");
    return;
  }

  if (showingScroll) {
    const user = await authActions.getCurrentUser();

    if (!user) {
      await showView("home", "#home");
      openAuthModal();
      return;
    }

    await loadTheScroll();
    scrollToSection("#scroll-view");
    return;
  }

  scrollToSection(targetSelector);
};

// Open and close the auth modal.
const openAuthModal = () => {
  authModal.classList.remove("hidden");
};

const closeAuthModal = () => {
  authModal.classList.add("hidden");
};

// Keep auth copy and required fields in sync with the current mode.
const renderAuthMode = () => {
  nameField.classList.toggle("hidden", !isSignUpMode);
  accountTypeField?.classList.toggle("hidden", !isSignUpMode);
  authFullName.required = isSignUpMode;
  authTitle.textContent = isSignUpMode ? "Enter the Circle" : "Welcome Back";
  authSubtitle.textContent = isSignUpMode ? "Choose your place in the circle" : "Return to the Shrine";
  setAuthSubmitting(false);
  authToggle.innerHTML = isSignUpMode
    ? 'Already a member? <span id="toggle-mode">Step Inside</span>'
    : 'New to the shrine? <span id="toggle-mode">Begin Journey</span>';
};

// Render the current writer's posts without injecting database text as HTML.
const renderWriterPosts = (posts) => {
  writerPostsGrid.innerHTML = "";

  if (!posts.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No offerings yet.";
    writerPostsGrid.appendChild(emptyState);
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("article");
    const status = document.createElement("span");
    const title = document.createElement("h3");
    const meta = document.createElement("p");
    const button = document.createElement("button");

    card.className = "offering-card";
    status.className = "offering-category";
    title.className = "offering-title";
    button.className = "edit-btn";
    button.type = "button";

    status.textContent = post.status || "draft";
    title.textContent = getDisplayTitle(post);
    meta.className = "offering-meta";
    meta.textContent = getStoryFormat(post) === "series" ? getSeriesLabel(post) : "One story";
    button.textContent = "Refine Ink";
    button.addEventListener("click", () => openEditor(post));

    card.append(status, title, meta, button);
    writerPostsGrid.appendChild(card);
  });
};

const editVision = (vision) => {
  currentEditingVisionId = vision.id;
  if (visualTitle) visualTitle.value = vision.title || "";
  if (visualUrl) visualUrl.value = vision.url || "";
  if (submitVisionBtn) submitVisionBtn.textContent = "Refine Vision";
  visualSubmissionArea?.scrollIntoView({ behavior: "smooth", block: "start" });
};

const renderWriterVisions = (visions) => {
  if (!writerVisionsGrid) return;

  writerVisionsGrid.innerHTML = "";

  if (!visions.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No visual visions yet.";
    writerVisionsGrid.appendChild(emptyState);
    return;
  }

  visions.forEach((vision) => {
    const card = document.createElement("article");
    const status = document.createElement("span");
    const title = document.createElement("h3");
    const meta = document.createElement("p");
    const button = document.createElement("button");

    card.className = "offering-card vision-card";
    status.className = "offering-category";
    title.className = "offering-title";
    meta.className = "offering-meta";
    button.className = "edit-btn";
    button.type = "button";

    status.textContent = "screen";
    title.textContent = vision.title || "Untitled vision";
    meta.textContent = vision.media_type || "visual vision";
    button.textContent = "Refine Vision";
    button.addEventListener("click", () => editVision(vision));

    card.append(status, title, meta, button);
    writerVisionsGrid.appendChild(card);
  });
};

const getWriterVisions = async (authorId) => {
  const { data: visions = [], error } = await supabase
    .from("media")
    .select("*")
    .or(`author_id.eq.${authorId},author_id.is.null`)
    .order("created_at", { ascending: false });

  if (!error) return visions;

  if (!isMissingColumnError(error, "author_id")) {
    console.error("Error loading writer visions:", error);
    return [];
  }

  const { data: legacyVisions = [], error: legacyError } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (legacyError) {
    console.error("Error loading legacy writer visions:", legacyError);
    return [];
  }

  return legacyVisions;
};

// Load profile and post data for the logged-in writer.
async function loadWriterDashboard() {
  const user = await authActions.getCurrentUser();

  if (!user) {
    openAuthModal();
    return;
  }

  if (!isWriterUser(user)) {
    await showView("scroll");
    return;
  }

  document.querySelector("#writer-name").textContent =
    user.profile?.full_name || user.user_metadata?.full_name || user.email;
  document.querySelector("#writer-level").textContent = user.profile?.writer_level || "Novice Scribe";

  const { data: posts = [], error } = await supabase
    .from("posts")
    .select("*, series(id, title, cover_url)")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  const visions = await getWriterVisions(user.id);

  renderWriterPosts(posts);
  renderWriterVisions(visions);
  document.querySelector("#stat-works").textContent = posts.length;
  document.querySelector("#stat-visions").textContent = visions.length;
  document.querySelector("#stat-likes").textContent = posts.reduce(
    (total, post) => total + (post.likes_count || post.likes || 0),
    0,
  );
}

// Show protected navigation once Supabase confirms a session.
async function initSession() {
  const user = await authActions.getCurrentUser();

  if (!user) {
    document.querySelectorAll(".auth-only").forEach((el) => el.classList.add("hidden"));
    visitorNavLinks.forEach((link) => link.classList.remove("hidden"));
    navDashboard.classList.add("hidden");
    navReaderProfile?.classList.add("hidden");
    navAdmin.classList.add("hidden");
    navAuthTrigger.classList.remove("hidden");
    return null;
  }

  document.querySelectorAll(".auth-only").forEach((el) => el.classList.remove("hidden"));
  visitorNavLinks.forEach((link) => link.classList.add("hidden"));
  navDashboard.classList.toggle("hidden", !isWriterUser(user));
  navReaderProfile?.classList.toggle("hidden", isWriterUser(user));
  navAdmin.classList.toggle("hidden", !isAdminUser(user));
  navAuthTrigger.classList.add("hidden");
  return user;
}

// Load the Oracle dashboard with offerings awaiting admin review.
async function loadOracleSubmissions() {
  const { data: posts, error } = await oracleActions.getPendingSubmissions();

  oracleContentList.innerHTML = "";

  if (error) {
    stageCount.textContent = "The offerings could not be loaded.";
    alert(error.message);
    return;
  }

  stageCount.textContent = posts.length
    ? `${posts.length} stories awaiting your gaze.`
    : "No stories are waiting right now.";

  if (!posts.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "The chamber is quiet.";
    oracleContentList.appendChild(emptyState);
    return;
  }

  posts.forEach((post) => {
    const item = document.createElement("article");
    const itemInfo = document.createElement("div");
    const title = document.createElement("h4");
    const meta = document.createElement("span");
    const actions = document.createElement("div");
    const featureButton = document.createElement("button");
    const removeButton = document.createElement("button");

    item.className = "oracle-item";
    itemInfo.className = "item-info";
    actions.className = "admin-actions";
    featureButton.className = "feature-btn";
    removeButton.className = "reject-btn";

    featureButton.type = "button";
    removeButton.type = "button";
    title.textContent = post.title || "Untitled offering";
    meta.textContent = `By ${post.profiles?.full_name || "Unknown scribe"} - Type: ${post.type || "story"}`;
    featureButton.textContent = "Feature";
    removeButton.textContent = "Remove";

    featureButton.addEventListener("click", () => updateOracleStatus(post.id, "featured"));
    removeButton.addEventListener("click", () => updateOracleStatus(post.id, "archived"));

    itemInfo.append(title, meta);
    actions.append(featureButton, removeButton);
    item.append(itemInfo, actions);
    oracleContentList.appendChild(item);
  });
}

const updateOracleStatus = async (postId, status) => {
  const { error } = await oracleActions.updateStatus(postId, status);

  if (error) {
    alert(error.message);
    return;
  }

  await loadOracleSubmissions();
};

// Reset editor fields before a new offering or fill them for an existing post.
const resetEditor = (post = null) => {
  currentEditingPostId = post?.id || null;
  currentEditingPostWasSeries = getStoryFormat(post) === "series";
  postType.value = post?.type || "";
  setActiveStoryFormat(getStoryFormat(post));
  postTitle.value = getStoryFormat(post) === "series" ? "" : post?.title || "";
  seriesTitle.value = post?.series?.title || "";
  episodeTitle.value = getStoryFormat(post) === "series" ? post?.title || "" : "";
  episodeNumber.value = post?.series_order || "";
  releaseCadence.value = post?.release_cadence || "weekly";
  postContent.innerHTML = normalizeStoredContent(post?.content || "");
};

// Open and close the full-screen inkwell editor.
const openEditor = async (post = null) => {
  const user = await initSession();

  if (!user) {
    openAuthModal();
    return;
  }

  if (!isWriterUser(user)) {
    await showView("scroll");
    return;
  }

  resetEditor(post);
  editorView.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const closeEditor = () => {
  editorView.classList.add("hidden");
  document.body.style.overflow = "auto";
};

const getOrCreateSeries = async ({ authorId, title }) => {
  const { data: existingSeries, error: lookupError } = await supabase
    .from("series")
    .select("id, title")
    .eq("author_id", authorId)
    .ilike("title", title)
    .limit(1);

  if (lookupError) return { series: null, error: lookupError };
  if (existingSeries?.[0]) return { series: existingSeries[0], error: null };

  const { data: createdSeries, error: createError } = await supabase
    .from("series")
    .insert([{ author_id: authorId, title }])
    .select("id, title")
    .single();

  return { series: createdSeries, error: createError };
};

// Save an offering as either a draft or a published post.
const saveOffering = async (status) => {
  const user = await authActions.getCurrentUser();

  if (!user) {
    alert("You must be part of the circle to offer a story.");
    openAuthModal();
    return;
  }

  if (!isWriterUser(user)) {
    alert("Listeners can read, bookmark, and leave echoes. Become a Scribe from your Scroll to offer stories.");
    await showView("scroll");
    return;
  }

  const contentValue = sanitizeRichContent(postContent.innerHTML);
  const type = postType.value.toLowerCase().trim();
  const storyFormat = getActiveStoryFormat();
  const seriesName = seriesTitle.value.trim();
  const episodeName = episodeTitle.value.trim();
  const episodeNo = Number.parseInt(episodeNumber.value, 10);
  const title = storyFormat === "series" ? episodeName || `${seriesName} Episode ${episodeNo || ""}`.trim() : postTitle.value.trim();
  const hasBody = postContent.textContent.trim() || postContent.querySelector("img, iframe");

  if (!type) {
    alert("Please choose a category for your offering.");
    return;
  }

  if (!title || !hasBody) {
    alert("Your offering cannot be empty.");
    return;
  }

  if (storyFormat === "series" && (!seriesName || !episodeNo)) {
    alert("Series episodes need a series title and episode number.");
    return;
  }

  const actionButton = status === "published" ? publishBtn : saveDraftBtn;
  const originalLabel = actionButton.textContent;

  actionButton.textContent = status === "published" ? "Offering..." : "Saving...";
  actionButton.disabled = true;
  publishBtn.disabled = true;
  saveDraftBtn.disabled = true;

  const payload = {
    author_id: user.id,
    title,
    content: contentValue,
    type,
    status,
    series_id: null,
    series_order: 0,
  };

  if (storyFormat === "series") {
    const { series, error: seriesError } = await getOrCreateSeries({
      authorId: user.id,
      title: seriesName,
    });

    if (seriesError || !series) {
      publishBtn.disabled = false;
      saveDraftBtn.disabled = false;
      actionButton.textContent = originalLabel;
      alert("The series could not be prepared: " + (seriesError?.message || "Unknown error"));
      return;
    }

    Object.assign(payload, {
      series_id: series.id,
      series_order: episodeNo,
    });
  }

  if (status === "published") {
    console.log("Attempting to offer this payload to the shrine:", payload);
  }

  const { error } = currentEditingPostId
    ? await supabase
        .from("posts")
        .update(payload)
        .eq("id", currentEditingPostId)
        .eq("author_id", user.id)
    : await supabase.from("posts").insert([payload]);

  publishBtn.disabled = false;
  saveDraftBtn.disabled = false;
  actionButton.textContent = originalLabel;

  if (error) {
    if (["series_id", "series_order", "series"].some((field) => error.message?.includes(field))) {
      alert("Series support needs the new Supabase schema. Run your series table SQL, then try again.");
      return;
    }

    alert("The shrine could not accept your ink: " + error.message);
    return;
  }

  const savedMessage = currentEditingPostId
    ? "Your offering has been updated."
    : status === "published"
      ? "Your story is now being remembered."
      : "Draft saved to your inkwell.";

  alert(savedMessage);
  publicOfferingsCache = null;
  closeEditor();
  await showView("dashboard");
};

// Hero entrance animation.
enterBtn.addEventListener("click", () => {
  hero.classList.add("lifted");

  setTimeout(() => {
    content.classList.remove("hidden");
    content.classList.add("visible");
    document.body.style.overflowY = "auto";
  }, 600);
});

// Auth modal event listeners.
navAuthTrigger.addEventListener("click", openAuthModal);
closeAuthBtn.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});

authToggle.addEventListener("click", () => {
  isSignUpMode = !isSignUpMode;
  renderAuthMode();
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = authEmail.value.trim();
  const password = authPassword.value;
  const fullName = authFullName.value.trim();
  const accountType = document.querySelector('input[name="account-type"]:checked')?.value || "reader";

  setAuthSubmitting(true);
  setAppLoading(true, isSignUpMode && accountType === "reader" ? "Preparing your scroll..." : isSignUpMode ? "Preparing your inkwell..." : "Opening your circle...");

  try {
    if (isSignUpMode) {
      const { session } = await authActions.signUp(email, password, fullName, accountType);

      if (!session) {
        setAuthSubmitting(false);
        setAppLoading(false);
        alert("The invitation has been sent to your email. Confirm to enter.");
        return;
      }

      closeAuthModal();
      const user = await initSession();
      await showView(isWriterUser(user) ? "dashboard" : "scroll");
      return;
    }

    await authActions.signIn(email, password);
    closeAuthModal();
    const user = await initSession();

    if (isAdminUser(user)) {
      await showView("admin");
    } else if (isWriterUser(user)) {
      await showView("dashboard");
    } else {
      await showView("scroll");
    }
  } catch (error) {
    alert(error.message);
  } finally {
    setAuthSubmitting(false);
    setAppLoading(false);
  }
});

// Dashboard and home navigation.
navDashboard.addEventListener("click", (event) => {
  event.preventDefault();
  showView("dashboard");
});

navAdmin.addEventListener("click", (event) => {
  event.preventDefault();
  showView("admin");
});

navReaderProfile?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("scroll");
});

publicNavLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const filterName = link.getAttribute("href")?.replace("#", "");

    if (shrineFilters[filterName]) {
      renderFeaturedStories(filterName).then(() => showView("home", "#explore"));
      return;
    }

    showView("home", link.getAttribute("href"));
  });
});

shrineFilterLinks.forEach((link) => {
  link.setAttribute("role", "button");
  link.addEventListener("click", (event) => {
    event.preventDefault();
    renderFeaturedStories(link.dataset.shrineFilter).then(() => showView("home", "#explore"));
  });
});

exitOracleBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showView("dashboard");
});

exitScrollBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("home", "#home");
});

logoutWriterBtn.addEventListener("click", async () => {
  setAppLoading(true, "Closing your inkwell...");

  try {
    await authActions.signOut();
    await initSession();
    await showView("home", "#home");
  } catch (error) {
    alert(error.message);
  } finally {
    setAppLoading(false);
  }
});

goHome.addEventListener("click", (event) => {
  event.preventDefault();
  showView("home", "#home");
});

openScreenBtn?.addEventListener("click", () => {
  showView("screen");
});

exitScreenBtn?.addEventListener("click", () => {
  showView("home", "#screen");
});

// Editor controls.
writeButton.addEventListener("click", openEditor);
createBtn.addEventListener("click", openEditor);
closeEditorBtn.addEventListener("click", closeEditor);
saveDraftBtn.addEventListener("click", () => saveOffering("draft"));
publishBtn.addEventListener("click", () => saveOffering("published"));
storyFormatInputs.forEach((input) => {
  input.addEventListener("change", () => setActiveStoryFormat(getActiveStoryFormat()));
});
postType.addEventListener("change", () => {
  if (postType.value === "series") {
    setActiveStoryFormat("series");
  }
});
toolbarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    runEditorCommand(button.dataset.command, button.dataset.value || null);
  });
});

textColor.addEventListener("input", () => {
  runEditorCommand("foreColor", textColor.value);
});

addLinkBtn.addEventListener("click", () => {
  const url = prompt("Paste the link URL");
  if (!url || !isSafeUrl(url)) return;

  const selectedText = window.getSelection().toString();
  if (selectedText) {
    runEditorCommand("createLink", url);
    return;
  }

  insertRichHtml(`<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`);
});

addImageBtn.addEventListener("click", () => {
  const imageUrl = prompt("Paste an image URL");
  if (!imageUrl || !isSafeImageUrl(imageUrl)) return;

  insertRichHtml(`<figure><img src="${escapeHtml(imageUrl)}" alt=""></figure><p><br></p>`);
});

addCoverBtn.addEventListener("click", async () => {
  const imageFile = await pickImageFile();
  if (!imageFile) return;

  if (!imageFile.type.startsWith("image/")) {
    alert("Please choose an image file.");
    return;
  }

  let imageUrl = "";
  try {
    imageUrl = await readFileAsDataUrl(imageFile);
  } catch {
    alert("That cover image could not be opened.");
    return;
  }

  if (!isSafeImageUrl(imageUrl)) return;

  postContent.insertAdjacentHTML(
    "afterbegin",
    `<figure class="cover-figure"><img class="cover-image" src="${escapeHtml(imageUrl)}" alt=""></figure>`,
  );
  postContent.focus();
});

addYoutubeBtn.addEventListener("click", () => {
  const youtubeUrl = prompt("Paste a YouTube link");
  const embedUrl = youtubeUrl ? getYoutubeEmbedUrl(youtubeUrl) : "";
  if (!embedUrl) return;

  insertRichHtml(`
    <figure class="embed-figure">
      <iframe src="${embedUrl}" title="YouTube video" loading="lazy" allowfullscreen></iframe>
    </figure>
    <p><br></p>
  `);
});

const getPostWithAuthorProfile = async (postId) => {
  const { data: post, error } = await supabase
    .from("posts")
    .select("*, series(id, title, cover_url)")
    .eq("id", postId)
    .maybeSingle();

  if (error || !post) {
    return { post: null, error };
  }

  if (!post.author_id) {
    return { post: { ...post, profiles: null }, error: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("id", post.author_id)
    .maybeSingle();

  if (profileError) {
    console.error("Error fetching reader author profile:", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    });
  }

  return { post: { ...post, profiles: profile || null }, error: null };
};

const updateBookmarkButton = async (postId = currentOpenPostId) => {
  const button = document.querySelector("#add-bookmark");
  if (!button || !postId) return;

  const user = await authActions.getCurrentUser();

  if (!user) {
    button.classList.remove("is-saved");
    button.setAttribute("aria-pressed", "false");
    button.title = "Bookmark";
    return;
  }

  const { data, error } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error checking bookmark:", error);
    return;
  }

  const isSaved = Boolean(data);
  button.classList.toggle("is-saved", isSaved);
  button.setAttribute("aria-pressed", String(isSaved));
  button.title = isSaved ? "Remove bookmark" : "Bookmark";
};

const toggleBookmark = async () => {
  const postId = currentOpenPostId;
  const user = await authActions.getCurrentUser();

  if (!user) {
    openAuthModal();
    return;
  }

  if (!postId) return;

  const { data: existing, error: lookupError } = await supabase
    .from("likes")
    .select("post_id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    alert("The bookmark could not be checked: " + lookupError.message);
    return;
  }

  const request = existing
    ? supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", postId)
    : supabase.from("likes").insert([{ user_id: user.id, post_id: postId }]);

  const { error } = await request;

  if (error) {
    alert("The bookmark could not be saved: " + error.message);
    return;
  }

  await updateBookmarkButton(postId);
};

const updateShareLinks = () => {
  if (!currentOpenPostId) return;

  const shareUrl = getStoryShareUrl(currentOpenPostId);
  const title = getShareTitle();
  const message = getShareMessage();
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${title} - ${message}`);

  document.querySelector("#share-whatsapp")?.setAttribute("href", `https://wa.me/?text=${encodedText}%20${encodedUrl}`);
  document.querySelector("#share-threads")?.setAttribute("href", `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`);
  document.querySelector("#share-facebook")?.setAttribute("href", `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
  document.querySelector("#share-x")?.setAttribute("href", `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`);
};

const copyStoryLink = async () => {
  if (!currentOpenPostId) return;

  const shareUrl = getStoryShareUrl(currentOpenPostId);

  try {
    await navigator.clipboard.writeText(shareUrl);
    alert("Story link copied.");
  } catch {
    prompt("Copy this story link", shareUrl);
  }
};

const shareCurrentStory = async () => {
  if (!currentOpenPostId) return;

  const shareUrl = getStoryShareUrl(currentOpenPostId);
  const title = getShareTitle();
  const text = getShareMessage();

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: shareUrl,
      });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  await copyStoryLink();
};

function calculateReadingTime(content = "") {
  const words = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Open a published offering in the full-page reader.
async function openStory(postId) {
  const readerView = document.querySelector("#reader-view");
  if (!readerView) return;

  currentOpenPostId = postId;
  publicViews.forEach((view) => view.classList.add("hidden"));
  dashboardView.classList.add("hidden");
  adminView.classList.add("hidden");
  shrineScreenView?.classList.add("hidden");
  scrollView?.classList.add("hidden");
  readerView.classList.remove("hidden");
  window.scrollTo(0, 0);

  const { post, error } = await getPostWithAuthorProfile(postId);

  if (error || !post) {
    alert(error?.message || "This story could not be opened.");
    readerView.classList.add("hidden");
    publicViews.forEach((view) => view.classList.remove("hidden"));
    return;
  }

  const content = post.content || "";
  currentOpenPost = post;
  currentOpenPostTitle = getDisplayTitle(post);

  document.querySelector("#reader-title").textContent = currentOpenPostTitle;
  document.querySelector("#reader-author").textContent = `By ${post.profiles?.full_name || "Unknown scribe"}`;
  document.querySelector("#reader-category").textContent = getSeriesLabel(post);
  document.querySelector("#reader-body").innerHTML = normalizeStoredContent(content);
  document.querySelector("#reading-time").textContent = `${calculateReadingTime(content)} min read`;
  updateShareMetadata(post);
  updateShareLinks();
  await updateBookmarkButton(postId);
  await refreshEchoComposer();
  await loadEchoes(postId);
}

window.openStory = openStory;

// Focus Mode Toggle
document.querySelector("#toggle-focus")?.addEventListener("click", () => {
  document.body.classList.toggle("focus-mode");
});

document.querySelector("#add-bookmark")?.addEventListener("click", toggleBookmark);
document.querySelector("#share-native")?.addEventListener("click", shareCurrentStory);
document.querySelector("#copy-story-link")?.addEventListener("click", copyStoryLink);

// Exit Reader
document.querySelector("#exit-reader")?.addEventListener("click", () => {
  document.querySelector("#reader-view")?.classList.add("hidden");
  publicViews.forEach((view) => view.classList.remove("hidden"));
  document.body.classList.remove("focus-mode");
  scrollToSection("#home");
});

const getYoutubeID = (url) => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) return parsedUrl.pathname.slice(1) || null;
    if (parsedUrl.hostname.includes("youtube.com")) return parsedUrl.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
};

const getMediaType = (url) => {
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "youtube";
    if (hostname.includes("tiktok.com")) return "tiktok";
    if (hostname.includes("instagram.com")) return "instagram";
  } catch {
    return "";
  }

  return "cinematic_still";
};

// Screen videos play in-app for YouTube and link out for social platforms.
const closeVideoModal = () => {
  videoModal?.classList.add("hidden");
  if (videoPlayerContainer) videoPlayerContainer.innerHTML = "";
};

const openVideoModal = (url, type) => {
  if (!url || !isSafeMediaUrl(url)) return;

  if (type !== "youtube") {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  const id = getYoutubeID(url);
  if (!id || !videoPlayerContainer || !videoModal) return;

  videoPlayerContainer.innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${escapeHtml(id)}?autoplay=1"
      title="Shrine Screen video"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
  videoModal.classList.remove("hidden");
};

// Build cards with DOM APIs so media titles and URLs never become raw HTML.
const renderMediaCard = (item) => {
  const card = document.createElement("article");
  const thumbnail = document.createElement("div");
  const info = document.createElement("div");
  const title = document.createElement("h3");
  const meta = document.createElement("span");
  const videoId = item.media_type === "youtube" ? getYoutubeID(item.url) : "";
  const thumbUrl = item.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");

  card.className = "video-card";
  card.tabIndex = 0;
  card.role = "button";
  thumbnail.className = "video-thumbnail";
  info.className = "video-info";
  title.className = "video-title";
  meta.className = "meta-label";

  if (thumbUrl && isSafeImageUrl(thumbUrl)) {
    thumbnail.style.backgroundImage = `url("${thumbUrl}")`;
  }

  title.textContent = item.title || "Untitled vision";
  meta.textContent = item.media_type || "vision";

  const open = () => openVideoModal(item.url, item.media_type);
  card.addEventListener("click", open);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  info.append(title, meta);
  card.append(thumbnail, info);
  return card;
};

const screenPreviewPlaceholders = [
  {
    title: "AI tales in motion",
    media_type: "ai-story",
  },
  {
    title: "Narrated poems and visions",
    media_type: "audio-story",
  },
  {
    title: "Motion comics from the circle",
    media_type: "comic",
  },
];

const renderScreenPreviewCard = (item, index) => {
  const card = document.createElement("article");
  const thumb = document.createElement("div");
  const title = document.createElement("h3");
  const meta = document.createElement("span");
  const videoId = item.media_type === "youtube" ? getYoutubeID(item.url) : "";
  const thumbUrl = item.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");

  card.className = `screen-preview-card preview-tone-${index + 1}`;
  thumb.className = "screen-preview-thumb";
  title.textContent = item.title || "Untitled vision";
  meta.textContent = item.media_type || "vision";

  if (thumbUrl && isSafeImageUrl(thumbUrl)) {
    thumb.style.backgroundImage = `url("${thumbUrl}")`;
  }

  if (item.url) {
    card.tabIndex = 0;
    card.role = "button";
    const open = () => openVideoModal(item.url, item.media_type);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  }

  card.append(thumb, title, meta);
  return card;
};

async function renderScreenPreviews() {
  if (!screenPreviewGrid) return;

  screenPreviewGrid.innerHTML = "";

  const { data: mediaItems = [], error } = await supabase
    .from("media")
    .select("title, url, media_type, thumbnail_url, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  const previews = error || !mediaItems.length ? screenPreviewPlaceholders : mediaItems;
  previews.forEach((item, index) => screenPreviewGrid.appendChild(renderScreenPreviewCard(item, index)));
}

// Load cinematic offerings from Supabase when the Shrine Screen opens.
async function loadShrineScreen() {
  if (!videoGrid) return;

  videoGrid.innerHTML = "";

  const { data: mediaItems = [], error } = await supabase
    .from("media")
    .select("title, url, media_type, thumbnail_url, created_at")
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "The Screen could not be loaded.";
    videoGrid.appendChild(emptyState);
    console.error("Error loading Shrine Screen:", error);
    return;
  }

  if (!mediaItems.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No visions have been offered yet.";
    videoGrid.appendChild(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  mediaItems.forEach((item) => fragment.appendChild(renderMediaCard(item)));
  videoGrid.appendChild(fragment);
}

dashboardTabs.forEach((button) => {
  button.addEventListener("click", () => {
    dashboardTabs.forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");

    const showingVisuals = button.dataset.tab === "visual";
    writerPostsGrid.classList.toggle("hidden", showingVisuals);
    writerPostsLabel?.classList.toggle("hidden", showingVisuals);
    visualSubmissionArea?.classList.toggle("hidden", !showingVisuals);
  });
});

submitVisionBtn?.addEventListener("click", async () => {
  const title = visualTitle?.value.trim() || "";
  const url = visualUrl?.value.trim() || "";
  const user = await authActions.getCurrentUser();

  if (!user) {
    openAuthModal();
    return;
  }

  if (!isWriterUser(user)) {
    alert("Visual offerings belong in the Scribe's inkwell. You can become a Scribe from your Scroll.");
    await showView("scroll");
    return;
  }

  if (!title || !url) {
    alert("Every vision needs a title and a source.");
    return;
  }

  if (!isSafeMediaUrl(url)) {
    alert("Please paste a valid YouTube, TikTok, or Instagram link.");
    return;
  }

  submitVisionBtn.textContent = "Offering...";
  submitVisionBtn.disabled = true;

  const payload = {
    title,
    url,
    media_type: getMediaType(url),
    author_id: user.id,
  };

  const request = currentEditingVisionId
    ? supabase
        .from("media")
        .update(payload)
        .eq("id", currentEditingVisionId)
    : supabase.from("media").insert([payload]);

  let { error } = await request;

  if (error && isMissingColumnError(error, "author_id")) {
    const { author_id: _authorId, ...legacyPayload } = payload;
    const fallbackRequest = currentEditingVisionId
      ? supabase.from("media").update(legacyPayload).eq("id", currentEditingVisionId)
      : supabase.from("media").insert([legacyPayload]);

    ({ error } = await fallbackRequest);
  }

  submitVisionBtn.textContent = currentEditingVisionId ? "Refine Vision" : "Offer to Screen";
  submitVisionBtn.disabled = false;

  if (error) {
    alert("The Screen rejected the vision: " + error.message);
    return;
  }

  alert(currentEditingVisionId ? "Your vision has been refined." : "Your vision has been accepted into the Screen.");
  currentEditingVisionId = null;
  visualTitle.value = "";
  visualUrl.value = "";
  submitVisionBtn.textContent = "Offer to Screen";
  await loadWriterDashboard();
  await loadShrineScreen();
  await renderScreenPreviews();
});

closeVideoBtn?.addEventListener("click", closeVideoModal);
videoModal?.addEventListener("click", (event) => {
  if (event.target === videoModal) closeVideoModal();
});

// Initial page setup.
document.body.style.overflowY = "hidden";
const bootstrapApp = async () => {
  setAppLoading(true, "Opening the shrine...");
  renderAuthMode();

  const initialStoryId = new URLSearchParams(window.location.search).get("story");

  try {
    await Promise.all([renderFeaturedStories(), renderScreenPreviews(), initSession()]);

    if (initialStoryId) {
      hero?.classList.add("lifted");
      content?.classList.remove("hidden");
      content?.classList.add("visible");
      document.body.style.overflowY = "auto";
      await openStory(initialStoryId);
    }
  } finally {
    setAppLoading(false);
  }
};

bootstrapApp();


const renderEchoEmptyState = (message) => {
  const list = document.querySelector("#echoes-list");
  if (!list) return;

  const emptyState = document.createElement("p");
  emptyState.className = "meta-label echo-empty-state";
  emptyState.textContent = message;
  list.replaceChildren(emptyState);
};

async function loadEchoes(postId) {
  const list = document.querySelector("#echoes-list");
  if (!list || !postId) return;

  const { data: echoes = [], error } = await supabase
    .from("comments")
    .select("*, profiles(full_name, role, writer_level)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading echoes:", error);
    renderEchoEmptyState("Echoes could not be loaded right now.");
    return;
  }

  if (!echoes.length) {
    renderEchoEmptyState("The circle is silent. Be the first to speak.");
    return;
  }

  list.replaceChildren();

  echoes.forEach((echo) => {
    const item = document.createElement("div");
    const meta = document.createElement("div");
    const author = document.createElement("span");
    const badge = document.createElement("span");
    const content = document.createElement("p");
    const date = document.createElement("div");

    item.className = "echo-item";
    meta.className = "echo-meta";
    author.className = "echo-author";
    badge.className = "echo-badge";
    content.className = "echo-content";
    date.className = "echo-date";

    author.textContent = echo.profiles?.full_name || "A voice in the circle";
    badge.textContent = getVoiceLabel(echo.profiles);
    content.textContent = echo.content || "";
    date.textContent = echo.created_at ? new Date(echo.created_at).toLocaleDateString() : "";

    meta.append(author, badge);
    item.append(meta, content, date);
    list.appendChild(item);
  });
}

const refreshEchoComposer = async () => {
  const inputArea = document.querySelector("#echo-input-area");
  const loginPrompt = document.querySelector("#echo-login-prompt");
  if (!inputArea || !loginPrompt) return;

  const user = await authActions.getCurrentUser();
  inputArea.classList.toggle("hidden", !user);
  loginPrompt.classList.toggle("hidden", Boolean(user));
};

document.querySelector("#submit-echo")?.addEventListener("click", async () => {
  const textarea = document.querySelector("#new-echo-content");
  const content = textarea?.value.trim() || "";
  const user = await authActions.getCurrentUser();

  if (!user) {
    openAuthModal();
    return;
  }

  if (!currentOpenPostId || !content) return;

  const { error } = await supabase.from("comments").insert([
    {
      post_id: currentOpenPostId,
      user_id: user.id,
      content,
    },
  ]);

  if (error) {
    alert("Your echo could not be added: " + error.message);
    return;
  }

  textarea.value = "";
  await loadEchoes(currentOpenPostId);
});

document.querySelector("#open-auth-from-comments")?.addEventListener("click", openAuthModal);
document.querySelector("#toggle-comments")?.addEventListener("click", () => {
  document.querySelector("#echoes-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

// 2. Load the Scroll Content
async function loadTheScroll() {
  const userObject = await authActions.getCurrentUser();
  if (!userObject) return;

  const username = document.querySelector("#scroll-username");
  const bookmarkCount = document.querySelector("#count-bookmarks");
  const echoCount = document.querySelector("#count-echoes");
  const grid = document.querySelector("#bookmarks-grid");

  if (username) {
    username.textContent = userObject.profile?.full_name || userObject.user_metadata?.full_name || userObject.email || "The Listener";
  }

  const { data: bookmarks = [], error: bookmarkError } = await supabase
    .from("likes")
    .select(`
      post_id,
      posts (*)
    `)
    .eq("user_id", userObject.id);

  if (!bookmarkError && grid) {
    if (bookmarkCount) bookmarkCount.textContent = bookmarks.length;
    grid.replaceChildren();

    if (!bookmarks.length) {
      const emptyState = document.createElement("p");
      emptyState.className = "empty-state";
      emptyState.textContent = "No stories have been saved yet.";
      grid.appendChild(emptyState);
    }

    bookmarks.forEach((bookmark) => {
      const post = bookmark.posts;
      if (!post) return;

      const card = document.createElement("article");
      const title = document.createElement("h3");
      const meta = document.createElement("p");

      card.className = "offering-card";
      card.tabIndex = 0;
      card.role = "button";
      title.className = "offering-title";
      meta.className = "offering-meta";
      title.textContent = getDisplayTitle(post);
      meta.textContent = post.type || "story";

      card.addEventListener("click", () => openStory(post.id));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openStory(post.id);
        }
      });

      card.append(title, meta);
      grid.appendChild(card);
    });
  }

  const { count, error: commentError } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userObject.id);

  if (!commentError && echoCount) {
    echoCount.textContent = count || 0;
  }
}

// 3. The Ascension Ritual Logic
document.querySelector("#begin-ascension")?.addEventListener("click", async () => {
    const userObject = await authActions.getCurrentUser();
    if (!userObject) {
        openAuthModal();
        return;
    }
    
    const ready = confirm("By taking this ink, you move from the circle of listeners to the circle of storytellers. Are you ready?");
    
    if (ready) {
        const { error } = await supabase
            .from('profiles')
            .update({ 
                role: "writer",
                writer_level: 'Novice Scribe'
            })
            .eq('id', userObject.id);

        if (!error) {
            alert("The shrine accepts your voice. You are now a Novice Scribe.");
            await authActions.refreshCurrentUser();
            await initSession();
            await showView("dashboard");
        } else {
            alert("The transformation failed: " + error.message);
        }
    }
});
