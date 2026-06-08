// J01. Imports: app services used by the UI.
import { oracleActions } from "./admin";
import { authActions } from "./auth";
import { supabase } from "../Lib/supabaseClient.js";

// J02. Core page elements.
const enterBtn = document.querySelector("#enter-btn");
const hero = document.querySelector("#hero");
const content = document.querySelector("#shrine-content");
const storyGrid = document.querySelector("#story-grid");
const storySectionHeading = document.querySelector("#explore .section-heading h2");
const ongoingSeriesList = document.querySelector("#ongoing-series-list");
const appLoading = document.querySelector("#app-loading");
const appLoadingText = document.querySelector("#app-loading-text");

// J03. Auth modal elements.
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

// J04. Navigation and view elements.
const writeButton = document.querySelector("#write .text-button");
const navAuthTrigger = document.querySelector("#nav-auth-trigger");
const navNotifications = document.querySelector("#nav-notifications");
const notificationCount = document.querySelector("#notification-count");
const navDashboard = document.querySelector("#nav-dashboard");
const navAdmin = document.querySelector("#nav-admin-link");
const goHome = document.querySelector("#go-home");
const mobileNavToggle = document.querySelector("#mobile-nav-toggle");
const primaryNav = document.querySelector("#primary-nav");
const publicNavLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(#nav-dashboard):not(#nav-reader-profile):not(#nav-admin-link)');
const visitorNavLinks = document.querySelectorAll(".visitor-nav");
const shrineFilterLinks = document.querySelectorAll("[data-shrine-filter]");
const dashboardView = document.querySelector("#dashboard-view");
const adminView = document.querySelector("#admin-view");
const readerView = document.querySelector("#reader-view");
const scrollView = document.querySelector("#scroll-view");
const writerProfileView = document.querySelector("#writer-profile-view");
const communityView = document.querySelector("#community-view");
const logoutWriterBtn = document.querySelector("#logout-writer");
const exitOracleBtn = document.querySelector("#exit-oracle");
const exitCommunityBtn = document.querySelector("#exit-community");
const navReaderProfile = document.querySelector("#nav-reader-profile");
const exitScrollBtn = document.querySelector("#exit-scroll");
const oracleContentList = document.querySelector("#oracle-content-list");
const stageCount = document.querySelector("#stage-count");
const stageTitle = document.querySelector("#stage-title");
const publicViews = document.querySelectorAll(".public-view");
const writerPostsGrid = document.querySelector("#writer-posts-grid");
const writerPostsLabel = document.querySelector("#writer-posts-label");
const writerVisionsGrid = document.querySelector("#writer-visions-grid");
const sidebarStatWorks = document.querySelector("#sidebar-stat-works");
const sidebarStatVisions = document.querySelector("#sidebar-stat-visions");
const sidebarStatLikes = document.querySelector("#sidebar-stat-likes");
const writerProfileForm = document.querySelector("#writer-profile-form");
const writerSecurityForm = document.querySelector("#writer-security-form");
const profileDisplayName = document.querySelector("#profile-display-name");
const profilePenName = document.querySelector("#profile-pen-name");
const profileNameDisplayMode = document.querySelector("#profile-name-display-mode");
const profileBio = document.querySelector("#profile-bio");
const profilePublicAvatar = document.querySelector("#profile-public-avatar");
const profilePublicBio = document.querySelector("#profile-public-bio");
const profilePublicLevel = document.querySelector("#profile-public-level");
const profileAvatarPicker = document.querySelector("#profile-avatar-picker");
const profileAvatarPickerTrigger = document.querySelector("#profile-avatar-picker-trigger");
const profileAvatarPreview = document.querySelector("#profile-avatar-preview");
const profileNewPassword = document.querySelector("#profile-new-password");
const sidebarAvatarPicker = document.querySelector("#sidebar-avatar-picker");
const sidebarAvatarPreview = document.querySelector("#sidebar-avatar-preview");
const sidebarAvatarButton = document.querySelector("#sidebar-avatar-button");
const sidebarDisplayName = document.querySelector("#sidebar-display-name");
const sidebarRole = document.querySelector("#sidebar-role");
const inkwellSidebar = document.querySelector("#inkwell-sidebar-panel");
const inkwellSidebarToggle = document.querySelector("#inkwell-sidebar-toggle");
const oracleSidebar = document.querySelector("#oracle-sidebar-panel");
const oracleSidebarToggle = document.querySelector("#oracle-sidebar-toggle");
const oracleTabs = document.querySelectorAll(".oracle-menu .oracle-tab");
const oracleLogoutBtn = document.querySelector("#oracle-logout");
const sendResetLinkBtn = document.querySelector("#send-reset-link");
const shrineScreenView = document.querySelector("#shrine-screen-view");
const openScreenBtn = document.querySelector("#open-screen");
const exitScreenBtn = document.querySelector("#exit-screen");
const screenPreviewGrid = document.querySelector("#screen-preview-grid");
const videoGrid = document.querySelector("#video-grid");
const videoModal = document.querySelector("#video-modal");
const videoPlayerContainer = document.querySelector("#video-player-container");
const closeVideoBtn = document.querySelector("#close-video");
const dashboardTabs = document.querySelectorAll(".tab-btn");

const setDashboardTab = (tabName) => {
  dashboardTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  const showingVisuals = tabName === "visual";
  const showingSagas = tabName === "sagas";
  writerPostsGrid?.classList.toggle("hidden", showingVisuals || showingSagas);
  writerPostsLabel?.classList.toggle("hidden", showingVisuals || showingSagas);
  document.querySelector("#visual-visions-section")?.classList.toggle("hidden", !showingVisuals);
  communalSagasSection?.classList.toggle("hidden", !showingSagas);
};

const visualSubmissionArea = document.querySelector("#visual-submission-area");
const submitVisionBtn = document.querySelector("#submit-vision");
const visualTitle = document.querySelector("#visual-title");
const visualUrl = document.querySelector("#visual-url");
const openWisdomModalBtn = document.querySelector("#open-wisdom-modal");
const wisdomForm = document.querySelector("#wisdom-form");
const wisdomText = document.querySelector("#wisdom-text");
const wisdomAuthor = document.querySelector("#wisdom-author");
const submitWisdomBtn = document.querySelector("#submit-wisdom");
const seriesNavigation = document.querySelector("#series-navigation");
const prevChapterBtn = document.querySelector("#prev-chapter");
const nextChapterBtn = document.querySelector("#next-chapter");
const seriesIndex = document.querySelector("#series-index");

// J05. Inkwell editor elements.
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
const communalSaga = document.querySelector("#communal-saga");
const sagaRules = document.querySelector("#saga-rules");
const textColor = document.querySelector("#text-color");
const toolbarButtons = document.querySelectorAll("[data-command]");
const addLinkBtn = document.querySelector("#add-link");
const addImageBtn = document.querySelector("#add-image");
const addCoverBtn = document.querySelector("#add-cover");
const addYoutubeBtn = document.querySelector("#add-youtube");
const collaborativeSagasList = document.querySelector("#collaborative-sagas-list");
const sagaApprovalsSection = document.querySelector("#saga-approvals-section");
const sagaApplicationsList = document.querySelector("#saga-applications-list");
const communalSagasSection = document.querySelector("#communal-sagas-section");
const writerSagasGrid = document.querySelector("#writer-sagas-grid");
const sagaDashboardStartBtn = document.querySelector("#saga-dashboard-start");
const sagaDashboardContributeBtn = document.querySelector("#saga-dashboard-contribute");
const sagaApplicationModal = document.querySelector("#saga-application-modal");
const sagaApplicationForm = document.querySelector("#saga-application-form");
const sagaApplicationTitle = document.querySelector("#saga-application-title");
const sagaApplicationContent = document.querySelector("#saga-application-content");
const sagaApplicationContext = document.querySelector("#saga-application-context");
const submitSagaApplicationBtn = document.querySelector("#submit-saga-application");
const closeSagaApplicationModalBtn = document.querySelector("#close-saga-application-modal");
const cancelSagaApplicationBtn = document.querySelector("#cancel-saga-application");
const sparkModal = document.querySelector("#spark-modal");
const sparkForm = document.querySelector("#spark-form");
const submitSparkBtn = document.querySelector("#submit-spark");
const closeSparkModalBtn = document.querySelector("#close-spark-modal");
const cancelSparkFormBtn = document.querySelector("#cancel-spark-form");
const sagaReviewModal = document.querySelector("#saga-review-modal");
const sagaReviewTitle = document.querySelector("#saga-review-title");
const sagaReviewTitleInput = document.querySelector("#saga-review-title-input");
const sagaReviewMeta = document.querySelector("#saga-review-meta");
const sagaReviewContent = document.querySelector("#saga-review-content");
const closeSagaReviewModalBtn = document.querySelector("#close-saga-review-modal");
const acceptSagaApplicationBtn = document.querySelector("#accept-saga-application");
const releaseSagaApplicationBtn = document.querySelector("#release-saga-application");
const notificationsModal = document.querySelector("#notifications-modal");
const closeNotificationsModalBtn = document.querySelector("#close-notifications-modal");
const notificationsList = document.querySelector("#notifications-list");
const notificationPreferencesForm = document.querySelector("#notification-preferences-form");
const notificationPreferenceInputs = document.querySelectorAll("[data-notification-pref]");
const markNotificationsReadBtn = document.querySelector("#mark-notifications-read");
const saveNotificationPreferencesBtn = document.querySelector("#save-notification-preferences");
const readerLogoutBtn = document.querySelector("#reader-logout");
const readerSettingsBtn = document.querySelector("#reader-settings");
const sagaContributionPanel = document.querySelector("#saga-contribution-panel");
const sagaContributionList = document.querySelector("#saga-contribution-list");
const communalSagaModal = document.querySelector("#communal-saga-modal");
const sidebarCommunalSagaBtn = document.querySelector("#sidebar-communal-saga");
const closeCommunalSagaModalBtn = document.querySelector("#close-communal-saga-modal");
const startCommunalSagaBtn = document.querySelector("#communal-saga-start-btn");
const contributeCommunalSagaBtn = document.querySelector("#communal-saga-contribute-btn");

let isSignUpMode = true;
let currentEditingPostId = null;
let currentEditingPostWasSeries = false;
let currentEditingVisionId = null;
let currentOpenPostId = null;
let currentOpenPostTitle = "";
let currentOpenPost = null;
let currentSagaApplicationSeries = null;
let currentSagaReviewApplication = null;
let writerSagaProfilesById = new Map();
let writerSagaSeriesById = new Map();
let publicOfferingsCache = null;
let activeShrineFilter = "all";
let selectedProfileAvatarDataUrl = "";
const youtubeCreatorCache = new Map();

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

const withStartupTimeout = (promise, label, timeoutMs = 5500) =>
  Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(() => {
        console.warn(`${label} took too long during startup. Continuing without blocking the shrine.`);
        resolve(null);
      }, timeoutMs);
    }),
  ]);

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

const getCleanStoryPath = (post = currentOpenPost) => {
  if (!post?.id) return "/";
  return `/${getCollectionPathForPost(post)}/${post.id}/${slugify(getShareTitle(post))}`;
};

const getCleanStoryUrl = (post = currentOpenPost) => new URL(getCleanStoryPath(post), window.location.origin).toString();

const getStoryIdFromPath = () => {
  const match = window.location.pathname.match(/^\/(?:stories|poems|essays|comics|ai-stories)\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : "";
};

const getStoryShareUrl = (postId = currentOpenPostId) => {
  if (currentOpenPost?.id === postId) return getCleanStoryUrl(currentOpenPost);
  const url = new URL(window.location.href);
  url.searchParams.set("story", postId);
  url.hash = "reader";
  return url.toString();
};

const getAbsoluteAssetUrl = (path) => new URL(path, window.location.origin).toString();

const toAbsoluteUrl = (value = "") => {
  if (!value) return "";
  try {
    return new URL(value, window.location.origin).toString();
  } catch {
    return "";
  }
};

const getFirstImageFromContent = (content = "") => {
  const template = document.createElement("template");
  template.innerHTML = normalizeStoredContent(content);
  const image = template.content.querySelector("img[src]");
  return image?.src || "";
};

const getReaderFriendlyContent = (content = "") => {
  const template = document.createElement("template");
  template.innerHTML = normalizeStoredContent(content);

  template.content.querySelectorAll(".cover-figure").forEach((node) => node.remove());
  template.content.querySelectorAll("img.cover-image").forEach((image) => {
    const figure = image.closest("figure");
    if (figure) {
      figure.remove();
      return;
    }
    image.remove();
  });

  return template.innerHTML.trim();
};

const getPostCoverImage = (post = currentOpenPost) =>
  toAbsoluteUrl(post?.series?.cover_url) ||
  toAbsoluteUrl(getFirstImageFromContent(post?.content || "")) ||
  getAbsoluteAssetUrl("/alo-logo-trans.png");

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
  const url = getCleanStoryUrl(post);

  document.title = `${title} - Shrine of Tales`;
  upsertMetaTag('meta[name="description"]', { name: "description", content: description });
  upsertMetaTag('meta[property="og:title"]', { property: "og:title", content: title });
  upsertMetaTag('meta[property="og:description"]', { property: "og:description", content: description });
  upsertMetaTag('meta[property="og:image"]', { property: "og:image", content: image });
  upsertMetaTag('meta[property="og:image:secure_url"]', { property: "og:image:secure_url", content: image });
  upsertMetaTag('meta[property="og:image:type"]', { property: "og:image:type", content: "image/png" });
  upsertMetaTag('meta[property="og:url"]', { property: "og:url", content: url });
  upsertMetaTag('meta[property="og:type"]', { property: "og:type", content: "article" });
  upsertMetaTag('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMetaTag('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  upsertMetaTag('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  upsertMetaTag('meta[name="twitter:image"]', { name: "twitter:image", content: image });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
};

const applyBaseShareMetadata = () => {
  const fallbackImage = getAbsoluteAssetUrl("/alo-banner-trans.png");
  const pageUrl = window.location.href;
  upsertMetaTag('meta[property="og:image"]', { property: "og:image", content: fallbackImage });
  upsertMetaTag('meta[property="og:image:secure_url"]', { property: "og:image:secure_url", content: fallbackImage });
  upsertMetaTag('meta[property="og:image:type"]', { property: "og:image:type", content: "image/png" });
  upsertMetaTag('meta[name="twitter:image"]', { name: "twitter:image", content: fallbackImage });
  upsertMetaTag('meta[property="og:url"]', { property: "og:url", content: pageUrl });
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

const levelThemeMap = {
  "novice scribe": { slug: "novice", color: "#9b7d46", glyph: "✧", bg: "#f0e2c2" },
  "ink keeper": { slug: "keeper", color: "#2d7a6f", glyph: "✒", bg: "#d8f1eb" },
  "elder storyteller": { slug: "elder", color: "#6a4bb4", glyph: "✦", bg: "#e7dcff" },
  "oracle voice": { slug: "oracle", color: "#a24b4b", glyph: "◈", bg: "#f7dcdc" },
};

const getLevelTheme = (level = "") => {
  const normalized = String(level).trim().toLowerCase();
  return (
    levelThemeMap[normalized] || {
      slug: "default",
      color: "#8f6b2d",
      glyph: "✦",
      bg: "#f2e7cc",
    }
  );
};

const getLevelAvatarDataUri = (level = "") => {
  const theme = getLevelTheme(level);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect width='120' height='120' rx='24' fill='${theme.bg}'/><text x='60' y='72' text-anchor='middle' font-size='40' fill='${theme.color}' font-family='Georgia,serif'>${theme.glyph}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const getProfileDisplayName = (profile = {}, fallback = "Unknown scribe") => {
  const mode = profile.display_name_mode || "full_name";
  if (mode === "anonymous") return "Anonymous Scribe";
  if (mode === "username") return profile.username || profile.full_name || fallback;
  if (mode === "pen_name") return profile.pen_name || profile.full_name || profile.username || fallback;
  return profile.full_name || profile.username || profile.pen_name || fallback;
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

  let { data: profiles = [], error } = await supabase
    .from("profiles")
    .select("id, full_name, username, pen_name, display_name_mode, bio, avatar_url, writer_level, public_show_avatar, public_show_bio, public_show_level")
    .in("id", authorIds);

  if (
    error &&
    ["username", "bio", "avatar_url", "pen_name", "display_name_mode", "public_show_avatar", "public_show_bio", "public_show_level"].some((column) =>
      isMissingColumnError(error, column),
    )
  ) {
    ({ data: profiles = [], error } = await supabase
      .from("profiles")
      .select("id, full_name, username, writer_level")
      .in("id", authorIds));
  }

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
    authorName: getProfileDisplayName(profilesById.get(post.author_id), "Unknown scribe"),
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

const getRecentOfferings = (offerings) => {
  const recentStandalone = offerings
    .filter((post) => getStoryFormat(post) !== "series")
    .slice(0, 4);
  return recentStandalone;
};

const getOngoingSeriesOfferings = (offerings) => {
  const latestBySeries = new Map();
  offerings
    .filter((post) => getStoryFormat(post) === "series" && post.series_id)
    .forEach((post) => {
      const existing = latestBySeries.get(post.series_id);
      const nextDate = new Date(post.created_at || 0).getTime();
      const prevDate = new Date(existing?.created_at || 0).getTime();
      if (!existing || nextDate > prevDate) {
        latestBySeries.set(post.series_id, post);
      }
    });

  return [...latestBySeries.values()]
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 10);
};

const updateShrineFilterState = (filterName = "all") => {
  activeShrineFilter = filterName;

  shrineFilterLinks.forEach((link) => {
    const isActive = link.dataset.shrineFilter === filterName;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-pressed", String(isActive));
  });

  if (storySectionHeading) {
    storySectionHeading.textContent = shrineFilters[filterName]?.label || "Well of stories";
  }
};

const openWriterProfileFromEvent = (event, writerId) => {
  event?.preventDefault();
  event?.stopPropagation();

  if (!writerId) return;
  showWriterProfile(writerId);
};

// J06. Public offering rendering.
const renderFeaturedStories = async (filterName = activeShrineFilter) => {
  updateShrineFilterState(filterName);
  const allOfferings = await getPublicOfferings();
  const offerings = shrineFilters[filterName]
    ? getFilteredOfferings(allOfferings, filterName)
    : getRecentOfferings(allOfferings);
  storyGrid.innerHTML = "";
  if (ongoingSeriesList) {
    ongoingSeriesList.innerHTML = "";
    const showSeriesColumn = !shrineFilters[filterName];
    ongoingSeriesList.closest(".ongoing-series-column")?.classList.toggle("hidden", !showSeriesColumn);
  }

  if (!offerings.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = shrineFilters[filterName]
      ? "No offerings have been placed in this shrine yet."
      : "No published offerings yet.";
    storyGrid.appendChild(emptyState);
    return;
  }

  if (!shrineFilters[filterName] && ongoingSeriesList) {
    const seriesItems = getOngoingSeriesOfferings(allOfferings);
    if (!seriesItems.length) {
      const emptySeries = document.createElement("p");
      emptySeries.className = "empty-state";
      emptySeries.textContent = "No ongoing series yet.";
      ongoingSeriesList.appendChild(emptySeries);
    } else {
      seriesItems.forEach((seriesPost) => {
        const card = document.createElement("article");
        const title = document.createElement("h4");
        const meta = document.createElement("p");
        const author = document.createElement("p");

        card.className = "series-feature-card";
        card.tabIndex = 0;
        card.role = "button";
        title.textContent = seriesPost.series?.title || getDisplayTitle(seriesPost);
        meta.textContent = seriesPost.series_order
          ? `Latest: Episode ${seriesPost.series_order}`
          : "Latest episode available";
        author.className = "series-feature-author";
        author.textContent = `By ${seriesPost.authorName || "Unknown scribe"}`;

        card.addEventListener("click", () => openStory(seriesPost.id));
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openStory(seriesPost.id);
          }
        });

        card.append(title, meta, author);
        ongoingSeriesList.appendChild(card);
      });
    }
  }

  offerings.forEach((story) => {
    const card = document.createElement("article");
    const coverUrl = getStoryFormat(story) === "series"
      ? story?.series?.cover_url || getFirstImageFromContent(story?.content || "")
      : "";
    const header = document.createElement("div");
    const category = document.createElement("p");
    const title = document.createElement("h3");
    const excerpt = document.createElement("p");
    const meta = document.createElement("div");
    const author = document.createElement("button");
    const readTime = document.createElement("span");

    card.className = "story-card";
    card.tabIndex = 0;
    card.role = "button";
    category.className = "eyebrow";
    meta.className = "story-meta";
    author.className = "author-link";
    author.type = "button";

    category.textContent = getSeriesLabel(story);
    title.textContent = getDisplayTitle(story);
    excerpt.textContent = getStoryExcerpt(story);
    author.textContent = story.authorName || "Unknown scribe";
    author.disabled = !story.author_id;
    readTime.textContent = `${calculateReadingTime(story.content || "")} min read`;
    author.addEventListener("click", (event) => openWriterProfileFromEvent(event, story.author_id));
    author.addEventListener("keydown", (event) => event.stopPropagation());

    card.addEventListener("click", () => openStory(story.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openStory(story.id);
      }
    });

    if (coverUrl) {
      const coverFigure = document.createElement("figure");
      const coverImage = document.createElement("img");
      coverFigure.className = "story-card-cover";
      coverImage.className = "story-card-cover-image";
      coverImage.src = coverUrl;
      coverImage.alt = `${story?.series?.title || getDisplayTitle(story)} cover art`;
      coverImage.loading = "lazy";
      coverFigure.appendChild(coverImage);
      card.appendChild(coverFigure);
    }

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

const waitForNextPaint = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

const closeMobileNav = () => {
  primaryNav?.classList.remove("is-open");
  inkwellSidebar?.classList.remove("is-open");
  oracleSidebar?.classList.remove("is-open");
  document.body.classList.remove("is-panel-open");
  mobileNavToggle?.classList.remove("is-open");
  mobileNavToggle?.setAttribute("aria-expanded", "false");
  mobileNavToggle?.setAttribute("aria-label", "Open navigation");
};

const toggleMobileNav = () => {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const inDashboardView = document.body.classList.contains("is-dashboard-view");
  const inAdminView = document.body.classList.contains("is-admin-view");

  if (isMobile && (inDashboardView || inAdminView)) {
    primaryNav?.classList.remove("is-open");
    const activePanel = inDashboardView ? inkwellSidebar : oracleSidebar;
    const otherPanel = inDashboardView ? oracleSidebar : inkwellSidebar;
    otherPanel?.classList.remove("is-open");
    const isOpen = activePanel?.classList.toggle("is-open");
    document.body.classList.toggle("is-panel-open", Boolean(isOpen));
    mobileNavToggle?.classList.toggle("is-open", Boolean(isOpen));
    mobileNavToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
    mobileNavToggle?.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    return;
  }

  const isOpen = primaryNav?.classList.toggle("is-open");
  mobileNavToggle?.classList.toggle("is-open", Boolean(isOpen));
  mobileNavToggle?.setAttribute("aria-expanded", String(Boolean(isOpen)));
  mobileNavToggle?.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
};

const setPanelState = (panel, toggle, isOpen, openLabel, closeLabel) => {
  if (!panel || !toggle) return;
  panel.classList.toggle("is-open", isOpen);
  if (panel === inkwellSidebar || panel === oracleSidebar) {
    document.body.classList.toggle("is-panel-open", Boolean(isOpen));
  }
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.textContent = isOpen ? closeLabel : openLabel;
};

const syncSidebarPanelsForViewport = () => {
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  setPanelState(inkwellSidebar, inkwellSidebarToggle, !isMobile, "Open Inkwell Menu", "Close Inkwell Menu");
  setPanelState(oracleSidebar, oracleSidebarToggle, !isMobile, "Open Oracle Menu", "Close Oracle Menu");
};

// J07. View routing and page transitions.
const showView = async (viewName, targetSelector = "#home") => {
  document.body.classList.add("is-view-transitioning");
  closeMobileNav();
  await waitForNextPaint();
  if (window.matchMedia("(max-width: 720px)").matches) {
    setPanelState(inkwellSidebar, inkwellSidebarToggle, false, "Open Inkwell Menu", "Close Inkwell Menu");
    setPanelState(oracleSidebar, oracleSidebarToggle, false, "Open Oracle Menu", "Close Oracle Menu");
  }
  const showingDashboard = viewName === "dashboard";
  const showingAdmin = viewName === "admin";
  const showingScreen = viewName === "screen";
  const showingScroll = viewName === "scroll";
  const showingWriterProfile = viewName === "writer-profile";
  const showingCommunity = viewName === "community";

  publicViews.forEach((view) =>
    view.classList.toggle("hidden", showingDashboard || showingAdmin || showingScreen || showingScroll || showingWriterProfile || showingCommunity),
  );
  dashboardView.classList.toggle("hidden", !showingDashboard);
  adminView.classList.toggle("hidden", !showingAdmin);
  document.body.classList.toggle("is-dashboard-view", showingDashboard);
  document.body.classList.toggle("is-admin-view", showingAdmin);
  shrineScreenView?.classList.toggle("hidden", !showingScreen);
  scrollView?.classList.toggle("hidden", !showingScroll);
  writerProfileView?.classList.toggle("hidden", !showingWriterProfile);
  communityView?.classList.toggle("hidden", !showingCommunity);
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
    document.body.classList.remove("is-view-transitioning");
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
    document.body.classList.remove("is-view-transitioning");
    return;
  }

  if (showingScreen) {
    await loadShrineScreen();
    scrollToSection("#shrine-screen-view");
    document.body.classList.remove("is-view-transitioning");
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
    document.body.classList.remove("is-view-transitioning");
    return;
  }

  if (showingWriterProfile) {
    scrollToSection("#writer-profile-view");
    document.body.classList.remove("is-view-transitioning");
    return;
  }

  if (showingCommunity) {
    await loadCommunityCircle();
    scrollToSection("#community-view");
    document.body.classList.remove("is-view-transitioning");
    return;
  }

  scrollToSection(targetSelector);
  document.body.classList.remove("is-view-transitioning");
};

// J08. Auth modal controls.
const openAuthModal = () => {
  authModal.classList.remove("hidden");
};

const closeAuthModal = () => {
  authModal.classList.add("hidden");
};

// J09. Auth mode rendering.
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

// J10. Writer dashboard rendering.
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
    const actions = document.createElement("div");
    const refineButton = document.createElement("button");
    const publishButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    card.className = "offering-card";
    status.className = "offering-category";
    title.className = "offering-title";
    actions.className = "offering-actions";
    refineButton.className = "edit-btn";
    publishButton.className = "edit-btn";
    deleteButton.className = "delete-btn";
    refineButton.type = "button";
    publishButton.type = "button";
    deleteButton.type = "button";

    status.textContent = post.status || "draft";
    title.textContent = getDisplayTitle(post);
    meta.className = "offering-meta";
    meta.textContent = getStoryFormat(post) === "series" ? getSeriesLabel(post) : "One story";
    refineButton.textContent = "Refine Ink";
    publishButton.textContent = "Publish";
    deleteButton.textContent = "Delete";
    publishButton.hidden = post.status === "published" || post.status === "featured";
    refineButton.addEventListener("click", () => openEditor(post));
    publishButton.addEventListener("click", () => updateWriterPostStatus(post.id, "published"));
    deleteButton.addEventListener("click", () => deleteWriterPost(post.id, getDisplayTitle(post)));

    actions.append(refineButton, publishButton, deleteButton);
    card.append(status, title, meta, actions);
    writerPostsGrid.appendChild(card);
  });
};

const updateWriterPostStatus = async (postId, status) => {
  const user = await authActions.getCurrentUser();
  if (!user || !postId) return;

  const { error } = await supabase
    .from("posts")
    .update({ status })
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) {
    alert("This offering could not be updated: " + error.message);
    return;
  }

  publicOfferingsCache = null;
  await loadWriterDashboard();
  await renderFeaturedStories();
};

const deleteWriterPost = async (postId, title) => {
  const user = await authActions.getCurrentUser();
  if (!user || !postId) return;

  const confirmed = confirm(`Delete "${title}"? This cannot be undone.`);
  if (!confirmed) return;

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) {
    alert("This offering could not be deleted: " + error.message);
    return;
  }

  publicOfferingsCache = null;
  await loadWriterDashboard();
  await renderFeaturedStories();
};

const updateWriterProfile = async (user, payload) => {
  let nextPayload = { ...payload };

  while (Object.keys(nextPayload).length) {
    const { error } = await supabase
      .from("profiles")
      .update(nextPayload)
      .eq("id", user.id);

    if (!error) return null;

    const missingColumn = Object.keys(nextPayload).find((column) => isMissingColumnError(error, column));
    if (!missingColumn) return error;
    delete nextPayload[missingColumn];
  }

  return null;
};

const saveWriterProfile = async (event) => {
  event.preventDefault();

  const user = await authActions.getCurrentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  const displayName = profileDisplayName?.value.trim() || "";
  const penName = profilePenName?.value.trim() || "";
  const displayNameMode = profileNameDisplayMode?.value || "full_name";
  const bio = profileBio?.value.trim() || "";
  const avatarUrl = selectedProfileAvatarDataUrl || user.profile?.avatar_url || "";

  if (!displayName) {
    alert("Your public shrine needs an ink name.");
    return;
  }

  if (avatarUrl && !isSafeImageUrl(avatarUrl)) {
    alert("Please use a valid image URL for your display picture.");
    return;
  }

  const error = await updateWriterProfile(user, {
    full_name: displayName,
    pen_name: penName,
    display_name_mode: displayNameMode,
    bio,
    avatar_url: avatarUrl,
    public_show_avatar: Boolean(profilePublicAvatar?.checked ?? true),
    public_show_bio: Boolean(profilePublicBio?.checked ?? true),
    public_show_level: Boolean(profilePublicLevel?.checked ?? true),
  });

  if (error) {
    alert("Your public shrine could not be saved: " + error.message);
    return;
  }

  publicOfferingsCache = null;
  await authActions.refreshCurrentUser();
  await loadWriterDashboard();
  await renderFeaturedStories();
  alert("Your public shrine has been updated.");
  const shrineModal = document.querySelector("#my-shrine-modal");
  closeModal(shrineModal);
};

const changeWriterPassword = async (event) => {
  event.preventDefault();

  const password = profileNewPassword?.value || "";
  if (password.length < 6) {
    alert("Please use at least 6 characters for your new password.");
    return;
  }

  try {
    await authActions.updatePassword(password);
    profileNewPassword.value = "";
    alert("Your password has been changed.");
    const settingsModal = document.querySelector("#settings-modal");
    closeModal(settingsModal);
  } catch (error) {
    alert("Your password could not be changed: " + error.message);
  }
};

const sendPasswordResetLink = async () => {
  const user = await authActions.getCurrentUser();
  const email = user?.email || authEmail?.value.trim();

  if (!email) {
    alert("No email address is available for this account.");
    return;
  }

  try {
    await authActions.sendPasswordReset(email);
    alert("A password reset link has been sent to your email.");
  } catch (error) {
    alert("The reset link could not be sent: " + error.message);
  }
};

const editVision = (vision) => {
  currentEditingVisionId = vision.id;
  if (visualTitle) visualTitle.value = vision.title || "";
  if (visualUrl) visualUrl.value = vision.url || "";
  if (submitVisionBtn) submitVisionBtn.textContent = "Refine Vision";
  const visionModal = document.querySelector("#add-vision-modal");
  openModal(visionModal);
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

const renderWriterSagaApplications = async (applications = []) => {
  if (!sagaApprovalsSection || !sagaApplicationsList) return;

  sagaApplicationsList.replaceChildren();

  if (!applications.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No chapters are waiting for your witness.";
    sagaApplicationsList.appendChild(emptyState);
    return;
  }

  const profilesById = await getProfileNamesById(applications.map((application) => application.applicant_id));
  const seriesById = await getSeriesById(applications.map((application) => application.series_id));
  writerSagaProfilesById = profilesById;
  writerSagaSeriesById = seriesById;

  applications.forEach((application) => {
    const item = document.createElement("article");
    const info = document.createElement("div");
    const title = document.createElement("h4");
    const meta = document.createElement("p");
    const excerpt = document.createElement("p");
    const actions = document.createElement("div");
    const witnessButton = document.createElement("button");
    const applicantName = getProfileDisplayName(profilesById.get(application.applicant_id), "A Scribe");
    const sagaTitle = seriesById.get(application.series_id)?.title || "a communal saga";

    item.className = "saga-application-item";
    info.className = "item-info";
    actions.className = "admin-actions";
    title.textContent = application.title || "Untitled chapter";
    meta.className = "meta-label";
    meta.textContent = `${applicantName} offers this to ${sagaTitle}`;
    excerpt.textContent = (application.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 220);
    witnessButton.className = "feature-btn";
    witnessButton.type = "button";
    witnessButton.textContent = "Witness Chapter";

    witnessButton.addEventListener("click", () => openSagaReviewModal(application));

    info.append(title, meta, excerpt);
    actions.append(witnessButton);
    item.append(info, actions);
    sagaApplicationsList.appendChild(item);
  });
};

const renderWriterCommunalSagas = (series = []) => {
  if (!writerSagasGrid) return;

  writerSagasGrid.replaceChildren();

  if (!series.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No communal sagas have been opened yet.";
    writerSagasGrid.appendChild(emptyState);
    return;
  }

  series.forEach((saga) => {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const rules = document.createElement("p");
    const meta = document.createElement("p");
    const action = document.createElement("button");

    card.className = "writer-saga-card";
    title.textContent = saga.title || "Untitled communal saga";
    rules.textContent = saga.saga_rules || saga.description || "No laws have been set for this world yet.";
    meta.className = "meta-label";
    meta.textContent = "Open to the circle";
    action.className = "text-btn";
    action.type = "button";
    action.textContent = "Add Chapter";
    action.addEventListener("click", () => {
      openEditor({
        type: "series",
        series: saga,
        series_id: saga.id,
        series_order: "",
        title: "",
        content: "",
      });
    });

    card.append(meta, title, rules, action);
    const completeButton = document.createElement("button");
    completeButton.className = "text-btn";
    completeButton.type = "button";
    completeButton.textContent = "Done with Saga";
    completeButton.addEventListener("click", () => completeSaga(saga));
    card.appendChild(completeButton);
    writerSagasGrid.appendChild(card);
  });
};

const loadWriterCommunalSagas = async (writerId) => {
  if (!writerId) return [];

  const { data: sagas = [], error } = await supabase
    .from("series")
    .select("id, title, description, saga_rules, author_id, is_communal, created_at")
    .eq("author_id", writerId)
    .eq("is_communal", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading writer communal sagas:", error);
    return [];
  }

  return sagas;
};

const completeSaga = async (saga) => {
  const category = prompt("Which collection should hold this completed saga? story, poem, essay, comic, folklore, or ai-story", "story")?.trim().toLowerCase();
  const allowed = ["story", "poem", "essay", "comic", "folklore", "ai-story", "audio-story", "narrative"];

  if (!category) return;
  if (!allowed.includes(category)) {
    alert("Please choose one of the shrine collections.");
    return;
  }

  const { error: postsError } = await supabase
    .from("posts")
    .update({ type: category, status: "published" })
    .eq("series_id", saga.id);

  if (postsError) {
    alert("This saga could not be placed in the collection: " + postsError.message);
    return;
  }

  let completionPayload = { is_communal: false, final_category: category, completed_at: new Date().toISOString() };
  let { error: seriesError } = await supabase
    .from("series")
    .update(completionPayload)
    .eq("id", saga.id);

  while (seriesError) {
    const missingColumn = Object.keys(completionPayload).find((column) => isMissingColumnError(seriesError, column));
    if (!missingColumn) break;
    const { [missingColumn]: _removed, ...nextPayload } = completionPayload;
    completionPayload = nextPayload;
    ({ error: seriesError } = await supabase.from("series").update(completionPayload).eq("id", saga.id));
  }

  if (seriesError) {
    alert("The saga was published, but could not be marked complete: " + seriesError.message);
    return;
  }

  publicOfferingsCache = null;
  await loadWriterDashboard();
  await renderFeaturedStories();
};

const loadWriterSagaApplications = async (writerId) => {
  if (!writerId) return [];

  const { data: applications = [], error } = await supabase
    .from("saga_applications")
    .select("*")
    .eq("lead_scribe_id", writerId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    if (!["saga_applications"].some((table) => error.message?.toLowerCase().includes(table))) {
      console.error("Error loading saga applications:", error);
    }
    return [];
  }

  return applications;
};

const defaultNotificationPreferences = {
  notify_stories: true,
  notify_poems: true,
  notify_sagas: true,
  notify_sparks: true,
};

const renderNotificationPreferences = (preferences = defaultNotificationPreferences) => {
  notificationPreferenceInputs.forEach((input) => {
    input.checked = preferences[input.dataset.notificationPref] !== false;
  });
};

const loadNotificationPreferences = async (userId) => {
  if (!userId) return defaultNotificationPreferences;

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("notify_stories, notify_poems, notify_sagas, notify_sparks")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Notification preferences are not available yet:", error);
    return defaultNotificationPreferences;
  }

  return { ...defaultNotificationPreferences, ...(data || {}) };
};

const saveNotificationPreferences = async (event) => {
  event.preventDefault();
  const user = await authActions.getCurrentUser();

  if (!user) {
    openAuthModal();
    return;
  }

  const payload = { user_id: user.id };
  notificationPreferenceInputs.forEach((input) => {
    payload[input.dataset.notificationPref] = input.checked;
  });

  if (saveNotificationPreferencesBtn) {
    saveNotificationPreferencesBtn.disabled = true;
    saveNotificationPreferencesBtn.textContent = "Saving...";
  }

  const { error } = await supabase
    .from("notification_preferences")
    .upsert([payload], { onConflict: "user_id" });

  if (saveNotificationPreferencesBtn) {
    saveNotificationPreferencesBtn.disabled = false;
    saveNotificationPreferencesBtn.textContent = "Save Notices";
  }

  if (error) {
    alert("Your notice preferences could not be saved: " + error.message);
    return;
  }

  alert("Your shrine notices have been updated.");
};

const renderNotifications = (notifications = []) => {
  if (!notificationsList) return;

  notificationsList.replaceChildren();

  if (!notifications.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No notices have reached your shrine yet.";
    notificationsList.appendChild(emptyState);
    return;
  }

  notifications.forEach((notice) => {
    const item = document.createElement("article");
    const title = document.createElement("h4");
    const body = document.createElement("p");
    const date = document.createElement("span");

    item.className = "notification-item";
    item.classList.toggle("is-unread", !notice.is_read);
    title.textContent = notice.title || "A signal from the shrine";
    body.textContent = notice.body || "";
    date.className = "meta-label";
    date.textContent = notice.created_at ? new Date(notice.created_at).toLocaleString() : "";

    item.append(title, body, date);
    notificationsList.appendChild(item);
  });
};

const loadNotifications = async (userId) => {
  if (!userId) return [];

  const { data: notifications = [], error } = await supabase
    .from("shrine_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Notifications are not available yet:", error);
    return [];
  }

  return notifications;
};

async function refreshNotificationCount(userId = "") {
  const targetUserId = userId || (await authActions.getCurrentUser())?.id;
  if (!targetUserId || !notificationCount) return;

  const { count, error } = await supabase
    .from("shrine_notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", targetUserId)
    .eq("is_read", false);

  if (error || count === null) {
    notificationCount.classList.add("hidden");
    return;
  }

  const unread = count || 0;
  notificationCount.textContent = String(unread);
  notificationCount.classList.toggle("hidden", unread === 0);
}

const openNotificationsModal = async () => {
  const user = await authActions.getCurrentUser();

  if (!user) {
    openAuthModal();
    return;
  }

  notificationsModal?.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  renderNotifications(await loadNotifications(user.id));
  await refreshNotificationCount(user.id);
};

const closeNotificationsModal = () => {
  notificationsModal?.classList.add("hidden");
  document.body.style.overflow = "";
};

const markNotificationsRead = async () => {
  const user = await authActions.getCurrentUser();
  if (!user) return;

  const { error } = await supabase
    .from("shrine_notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    alert("The notices could not be marked read: " + error.message);
    return;
  }

  renderNotifications(await loadNotifications(user.id));
  await refreshNotificationCount(user.id);
};

// J11. Writer dashboard data loading.
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

  const writerName = getProfileDisplayName(user.profile, user.user_metadata?.full_name || user.email);
  const writerLevel = user.profile?.writer_level || "Novice Scribe";
  const theme = getLevelTheme(writerLevel);
  document.querySelector("#writer-name").textContent = writerName;
  document.querySelector("#writer-level").textContent = writerLevel;
  document.querySelector("#writer-level").dataset.level = theme.slug;
  if (sidebarDisplayName) sidebarDisplayName.textContent = writerName;
  if (sidebarRole) {
    sidebarRole.textContent = writerLevel;
    sidebarRole.dataset.level = theme.slug;
  }
  if (sidebarAvatarPreview) sidebarAvatarPreview.src = user.profile?.avatar_url || getLevelAvatarDataUri(writerLevel);
  if (profileDisplayName) profileDisplayName.value = user.profile?.full_name || writerName;
  if (profilePenName) profilePenName.value = user.profile?.pen_name || "";
  if (profileNameDisplayMode) profileNameDisplayMode.value = user.profile?.display_name_mode || "full_name";
  if (profileBio) profileBio.value = user.profile?.bio || "";
  if (profileAvatarPreview) profileAvatarPreview.src = user.profile?.avatar_url || getLevelAvatarDataUri(writerLevel);
  if (profilePublicAvatar) profilePublicAvatar.checked = user.profile?.public_show_avatar !== false;
  if (profilePublicBio) profilePublicBio.checked = user.profile?.public_show_bio !== false;
  if (profilePublicLevel) profilePublicLevel.checked = user.profile?.public_show_level !== false;
  selectedProfileAvatarDataUrl = "";

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
  const sagaApplications = await loadWriterSagaApplications(user.id);
  const communalSagas = await loadWriterCommunalSagas(user.id);

  renderWriterPosts(posts);
  renderWriterVisions(visions);
  renderWriterCommunalSagas(communalSagas);
  await renderWriterSagaApplications(sagaApplications);
  document.querySelector("#stat-works").textContent = posts.length;
  document.querySelector("#stat-visions").textContent = visions.length;
  document.querySelector("#stat-likes").textContent = posts.reduce(
    (total, post) => total + (post.likes_count || post.likes || 0),
    0,
  );
  // Update sidebar stats
  if (sidebarStatWorks) sidebarStatWorks.textContent = posts.length;
  if (sidebarStatVisions) sidebarStatVisions.textContent = visions.length;
  if (sidebarStatLikes) {
    sidebarStatLikes.textContent = posts.reduce((total, post) => total + (post.likes_count || post.likes || 0), 0);
  }
}

// J12. Session-aware navigation.
async function initSession() {
  await authActions.enforceSessionPolicy();
  const user = await authActions.getCurrentUser();

  if (!user) {
    document.querySelectorAll(".auth-only").forEach((el) => el.classList.add("hidden"));
    visitorNavLinks.forEach((link) => link.classList.remove("hidden"));
    navDashboard.classList.add("hidden");
    navReaderProfile?.classList.add("hidden");
    navAdmin.classList.add("hidden");
    navAuthTrigger.classList.remove("hidden");
    navNotifications?.classList.add("hidden");
    notificationCount?.classList.add("hidden");
    return null;
  }

  document.querySelectorAll(".auth-only").forEach((el) => el.classList.remove("hidden"));
  visitorNavLinks.forEach((link) => link.classList.add("hidden"));
  navDashboard.classList.toggle("hidden", !isWriterUser(user));
  navReaderProfile?.classList.toggle("hidden", isWriterUser(user));
  navAdmin.classList.toggle("hidden", !isAdminUser(user));
  navAuthTrigger.classList.add("hidden");
  await refreshNotificationCount(user.id);
  return user;
}

// J13. Oracle dashboard loading.
async function loadOracleSubmissions() {
  const { data: posts, error } = await oracleActions.getPendingSubmissions();
  if (stageTitle) stageTitle.textContent = "Pending Offerings";

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

async function loadOracleFeatured() {
  const { data: posts = [], error } = await oracleActions.getFeaturedWorks();
  oracleContentList.innerHTML = "";
  if (stageTitle) stageTitle.textContent = "Featured Stills";

  if (error) {
    stageCount.textContent = "Featured works could not be loaded.";
    alert(error.message);
    return;
  }

  stageCount.textContent = posts.length
    ? `${posts.length} featured offering${posts.length === 1 ? "" : "s"} in the shrine.`
    : "No featured offerings yet.";

  if (!posts.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No featured offerings yet.";
    oracleContentList.appendChild(emptyState);
    return;
  }

  posts.forEach((post) => {
    const item = document.createElement("article");
    const itemInfo = document.createElement("div");
    const title = document.createElement("h4");
    const meta = document.createElement("span");
    const actions = document.createElement("div");
    const unfeatureButton = document.createElement("button");

    item.className = "oracle-item";
    itemInfo.className = "item-info";
    actions.className = "admin-actions";
    unfeatureButton.className = "feature-btn";
    unfeatureButton.type = "button";
    unfeatureButton.textContent = "Remove Feature";
    title.textContent = post.title || "Untitled offering";
    meta.textContent = `By ${post.profiles?.full_name || "Unknown scribe"} - Type: ${post.type || "story"}`;

    unfeatureButton.addEventListener("click", async () => {
      const { error: updateError } = await oracleActions.toggleFeatured(post.id, false);
      if (updateError) {
        alert(updateError.message);
        return;
      }
      await loadOracleFeatured();
    });

    itemInfo.append(title, meta);
    actions.append(unfeatureButton);
    item.append(itemInfo, actions);
    oracleContentList.appendChild(item);
  });
}

async function loadOracleRegistry() {
  const { data: profiles = [], error } = await oracleActions.getRegistryProfiles();
  oracleContentList.innerHTML = "";
  if (stageTitle) stageTitle.textContent = "The Registry";

  if (error) {
    stageCount.textContent = "Registry could not be loaded.";
    alert(error.message);
    return;
  }

  const writers = profiles.filter((profile) => (profile.role || "").toLowerCase() === "writer");
  const readers = profiles.filter((profile) => (profile.role || "").toLowerCase() !== "writer");
  stageCount.textContent = `${profiles.length} registered members - ${writers.length} writer${writers.length === 1 ? "" : "s"}, ${readers.length} reader${readers.length === 1 ? "" : "s"}.`;

  if (!profiles.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No registered members found yet.";
    oracleContentList.appendChild(emptyState);
    return;
  }

  profiles.forEach((profile) => {
    const item = document.createElement("article");
    const itemInfo = document.createElement("div");
    const name = document.createElement("h4");
    const meta = document.createElement("span");

    const role = (profile.role || "reader").toLowerCase() === "writer" ? "Writer" : "Reader";
    const level = profile.writer_level || (role === "Writer" ? "Novice Scribe" : "The Listener");
    const handle = profile.username ? `@${profile.username}` : profile.id?.slice(0, 8) || "unknown";

    item.className = "oracle-item";
    itemInfo.className = "item-info";
    name.textContent = profile.full_name || handle;
    meta.textContent = `${role} - ${level} - ${handle}`;

    itemInfo.append(name, meta);
    item.append(itemInfo);
    oracleContentList.appendChild(item);
  });
}

const createOracleSpark = async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const durationHours = Math.max(1, Number(formData.get("duration_hours") || 48));
  const startsAt = new Date().toISOString();
  const endsAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();

  if (submitSparkBtn) {
    submitSparkBtn.disabled = true;
    submitSparkBtn.textContent = "Lighting...";
  }

  const { error } = await supabase.from("sparks").insert([
    {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      starts_at: startsAt,
      ends_at: endsAt,
    },
  ]);

  if (error) {
    alert("The Spark could not be lit: " + error.message);
    if (submitSparkBtn) {
      submitSparkBtn.disabled = false;
      submitSparkBtn.textContent = "Light the Fire";
    }
    return;
  }

  form.reset();
  if (submitSparkBtn) {
    submitSparkBtn.disabled = false;
    submitSparkBtn.textContent = "Light the Fire";
  }
  closeSparkModal();
  await loadOracleSparks();
};

async function loadOracleSparks() {
  oracleContentList.innerHTML = "";
  if (stageTitle) stageTitle.textContent = "Midnight Fires";

  const actionBar = document.createElement("div");
  const lightButton = document.createElement("button");
  actionBar.className = "oracle-action-bar";
  lightButton.className = "cta-gold";
  lightButton.type = "button";
  lightButton.textContent = "Light a Spark";
  lightButton.addEventListener("click", openSparkModal);
  actionBar.appendChild(lightButton);
  oracleContentList.appendChild(actionBar);

  const { data: sparks = [], error } = await supabase
    .from("sparks")
    .select("*")
    .order("starts_at", { ascending: false })
    .limit(12);

  if (error) {
    if (stageCount) stageCount.textContent = "Midnight Fires need the community rituals schema.";
    console.error("Error loading oracle sparks:", error);
    return;
  }

  if (stageCount) stageCount.textContent = `${sparks.length} spark${sparks.length === 1 ? "" : "s"} remembered.`;

  sparks.forEach((spark) => {
    const item = document.createElement("article");
    const info = document.createElement("div");
    const title = document.createElement("h4");
    const meta = document.createElement("span");

    item.className = "oracle-item";
    info.className = "item-info";
    title.textContent = spark.title || "Untitled Spark";
    const active = new Date(spark.starts_at).getTime() <= Date.now() && new Date(spark.ends_at).getTime() >= Date.now();
    meta.textContent = active
      ? formatSparkCountdown(spark.ends_at)
      : spark.ends_at && new Date(spark.ends_at).getTime() < Date.now()
        ? "Resting in The Ashes"
        : "Waiting to be lit";

    info.append(title, meta);
    item.appendChild(info);
    oracleContentList.appendChild(item);
  });
}

async function loadOracleSagaApplications() {
  oracleContentList.innerHTML = "";
  if (stageTitle) stageTitle.textContent = "Communal Sagas";

  const { data: applications = [], error } = await supabase
    .from("saga_applications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    if (stageCount) stageCount.textContent = "Communal Sagas need the community rituals schema.";
    console.error("Error loading oracle saga applications:", error);
    return;
  }

  const profilesById = await getProfileNamesById([
    ...applications.map((application) => application.applicant_id),
    ...applications.map((application) => application.lead_scribe_id),
  ]);
  const seriesById = await getSeriesById(applications.map((application) => application.series_id));

  if (stageCount) {
    stageCount.textContent = applications.length
      ? `${applications.length} chapter${applications.length === 1 ? "" : "s"} awaiting a Lead Scribe.`
      : "No communal chapters are waiting.";
  }

  if (!applications.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No communal chapters are waiting.";
    oracleContentList.appendChild(emptyState);
    return;
  }

  applications.forEach((application) => {
    const item = document.createElement("article");
    const info = document.createElement("div");
    const title = document.createElement("h4");
    const meta = document.createElement("span");
    const applicantName = getProfileDisplayName(profilesById.get(application.applicant_id), "A Scribe");
    const leadName = getProfileDisplayName(profilesById.get(application.lead_scribe_id), "A Lead Scribe");
    const sagaTitle = seriesById.get(application.series_id)?.title || "a communal saga";

    item.className = "oracle-item";
    info.className = "item-info";
    title.textContent = application.title || "Untitled chapter";
    meta.textContent = `${applicantName} offered this to ${sagaTitle}; ${leadName} must approve it.`;

    info.append(title, meta);
    item.appendChild(info);
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

// J14. Editor state preparation.
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
  if (communalSaga) communalSaga.checked = Boolean(post?.series?.is_communal);
  if (sagaRules) sagaRules.value = post?.series?.saga_rules || "";
  postContent.innerHTML = normalizeStoredContent(post?.content || "");
};

// J15. Editor view controls.
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

// J16. Offering save and publish flow.
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

    const communalError = await updateSeriesCommunalState(series.id, Boolean(communalSaga?.checked), sagaRules?.value.trim() || "", user.id);
    if (communalError) {
      publishBtn.disabled = false;
      saveDraftBtn.disabled = false;
      actionButton.textContent = originalLabel;
      alert("The communal saga state could not be saved: " + communalError.message);
      return;
    }
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

const handleSidebarAvatarChange = (event) => {
  const file = event.target?.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  const previewUrl = URL.createObjectURL(file);
  sidebarAvatarPreview?.setAttribute("src", previewUrl);
};

const handleProfileAvatarChange = async (event) => {
  const file = event.target?.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  try {
    const dataUrl = await readFileAsDataUrl(file);
    if (typeof dataUrl !== "string") return;
    selectedProfileAvatarDataUrl = dataUrl;
    profileAvatarPreview?.setAttribute("src", dataUrl);
  } catch {
    alert("The selected image could not be loaded.");
  }
};

sidebarAvatarButton?.addEventListener("click", () => {
  sidebarAvatarPicker?.click();
});

sidebarAvatarPicker?.addEventListener("change", handleSidebarAvatarChange);
profileAvatarPickerTrigger?.addEventListener("click", () => {
  profileAvatarPicker?.click();
});
profileAvatarPicker?.addEventListener("change", handleProfileAvatarChange);

// J17. Hero entrance animation.
enterBtn?.addEventListener("click", () => {
  if (!hero || !content) return;
  hero.classList.add("lifted");
  loadQuoteOfTheDay();
  let revealed = false;
  const revealShrine = () => {
    if (revealed) return;
    revealed = true;
    content.classList.remove("hidden");
    content.classList.add("visible");
    document.body.style.overflowY = "auto";
  };

  hero.addEventListener("transitionend", revealShrine, { once: true });
  setTimeout(revealShrine, 700);
});

// J18. Auth modal event listeners.
navAuthTrigger?.addEventListener("click", openAuthModal);
navNotifications?.addEventListener("click", openNotificationsModal);
closeAuthBtn?.addEventListener("click", closeAuthModal);
authModal?.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});

authToggle?.addEventListener("click", () => {
  isSignUpMode = !isSignUpMode;
  renderAuthMode();
});

authForm?.addEventListener("submit", async (event) => {
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
      await loadQuoteOfTheDay();
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
    await loadQuoteOfTheDay();
  } catch (error) {
    alert(error.message);
  } finally {
    setAuthSubmitting(false);
    setAppLoading(false);
  }
});

// J19. Dashboard and home navigation.
navDashboard?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("dashboard");
});

navAdmin?.addEventListener("click", (event) => {
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

    if (link.getAttribute("href") === "#community-view") {
      showView("community");
      return;
    }

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

exitOracleBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("dashboard");
});

exitScrollBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("home", "#home");
});

exitCommunityBtn?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("home", "#home");
});

logoutWriterBtn?.addEventListener("click", async () => {
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

// Modal management functions
const modals = {
  shrine: document.querySelector("#my-shrine-modal"),
  settings: document.querySelector("#settings-modal"),
  vision: document.querySelector("#add-vision-modal"),
  wisdom: document.querySelector("#add-wisdom-modal"),
  notifications: document.querySelector("#notifications-modal"),
  communalSaga: document.querySelector("#communal-saga-modal"),
};

const openModal = (modal) => {
  if (!modal) return;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const closeModal = (modal) => {
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "";
};

// Close modals on background click
Object.values(modals).forEach((modal) => {
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});

// Close buttons for modals
document.querySelector("#close-shrine-modal")?.addEventListener("click", () => closeModal(modals.shrine));
document.querySelector("#close-shrine-form")?.addEventListener("click", () => closeModal(modals.shrine));
document.querySelector("#close-settings-modal")?.addEventListener("click", () => closeModal(modals.settings));
document.querySelector("#close-settings-form")?.addEventListener("click", () => closeModal(modals.settings));
closeNotificationsModalBtn?.addEventListener("click", closeNotificationsModal);
notificationPreferencesForm?.addEventListener("submit", saveNotificationPreferences);
markNotificationsReadBtn?.addEventListener("click", markNotificationsRead);
document.querySelector("#close-vision-modal")?.addEventListener("click", () => closeModal(modals.vision));
document.querySelector("#close-vision-form")?.addEventListener("click", () => closeModal(modals.vision));
document.querySelector("#close-wisdom-modal")?.addEventListener("click", () => closeModal(modals.wisdom));
document.querySelector("#close-wisdom-form")?.addEventListener("click", () => closeModal(modals.wisdom));

// Sidebar event listeners
const sidebarLogoutBtn = document.querySelector("#sidebar-logout");
const sidebarCreateBtn = document.querySelector("#sidebar-create-offering");
const sidebarAddVisionBtn = document.querySelector("#sidebar-add-vision");
const sidebarLinks = document.querySelectorAll(".sidebar-link[data-section]");
const sidebarRouteLinks = document.querySelectorAll(".sidebar-link[data-go-view]");
const oracleRouteLinks = document.querySelectorAll(".oracle-hub-nav [data-go-view]");

sidebarLogoutBtn?.addEventListener("click", async () => {
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

sidebarCreateBtn?.addEventListener("click", openEditor);
sidebarAddVisionBtn?.addEventListener("click", () => openModal(modals.vision));

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const section = link.dataset.section;
    sidebarLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    
    // Open modals based on section
    if (section === "profile") {
      openModal(modals.shrine);
    } else if (section === "settings") {
      authActions.getCurrentUser().then((user) => {
        if (user) loadNotificationPreferences(user.id).then(renderNotificationPreferences);
      });
      openModal(modals.settings);
    }
  });
});

const handleSideRoute = async (link) => {
  const viewName = link.dataset.goView || "home";
  const target = link.dataset.goTarget || "#home";
  await showView(viewName, target);
};

sidebarRouteLinks.forEach((link) => {
  link.addEventListener("click", async () => {
    await handleSideRoute(link);
  });
});

oracleRouteLinks.forEach((link) => {
  link.addEventListener("click", async () => {
    await handleSideRoute(link);
  });
});

oracleTabs.forEach((tab) => {
  tab.addEventListener("click", async () => {
    oracleTabs.forEach((button) => button.classList.remove("active"));
    tab.classList.add("active");

    const view = tab.dataset.tab;
    if (view === "registry") {
      await loadOracleRegistry();
      return;
    }

    if (view === "featured") {
      await loadOracleFeatured();
      return;
    }

    if (view === "sparks") {
      await loadOracleSparks();
      return;
    }

    if (view === "sagas") {
      await loadOracleSagaApplications();
      return;
    }

    if (stageTitle) stageTitle.textContent = "Pending Offerings";
    await loadOracleSubmissions();
  });
});

oracleLogoutBtn?.addEventListener("click", async () => {
  setAppLoading(true, "Closing the chamber...");
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

openWisdomModalBtn?.addEventListener("click", () => openModal(modals.wisdom));

wisdomForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const quoteText = wisdomText?.value.trim();
  const quoteAuthor = wisdomAuthor?.value.trim();
  if (!quoteText || !quoteAuthor) {
    alert("Please provide both quote text and author.");
    return;
  }

  if (submitWisdomBtn) {
    submitWisdomBtn.disabled = true;
    submitWisdomBtn.textContent = "Offering...";
  }

  try {
    const { error } = await supabase.from("quotes").insert([
      {
        text: quoteText,
        author: quoteAuthor,
      },
    ]);

    if (error) {
      throw error;
    }

    closeModal(modals.wisdom);
    wisdomForm.reset();
    await loadQuoteOfTheDay();
    alert("Wisdom added to the shrine.");
  } catch (error) {
    alert("The wisdom could not be added: " + error.message);
  } finally {
    if (submitWisdomBtn) {
      submitWisdomBtn.disabled = false;
      submitWisdomBtn.textContent = "Offer Wisdom";
    }
  }
});

goHome?.addEventListener("click", (event) => {
  event.preventDefault();
  showView("home", "#home");
});

mobileNavToggle?.addEventListener("click", toggleMobileNav);
inkwellSidebarToggle?.addEventListener("click", () => {
  const nextState = !inkwellSidebar?.classList.contains("is-open");
  setPanelState(inkwellSidebar, inkwellSidebarToggle, nextState, "Open Inkwell Menu", "Close Inkwell Menu");
});
oracleSidebarToggle?.addEventListener("click", () => {
  const nextState = !oracleSidebar?.classList.contains("is-open");
  setPanelState(oracleSidebar, oracleSidebarToggle, nextState, "Open Oracle Menu", "Close Oracle Menu");
});
window.addEventListener("resize", syncSidebarPanelsForViewport);
document.addEventListener("click", (event) => {
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  if (!isMobile || !document.body.classList.contains("is-panel-open")) return;

  const target = event.target;
  if (
    target instanceof Element &&
    !target.closest("#inkwell-sidebar-panel, #oracle-sidebar-panel, #mobile-nav-toggle, #inkwell-sidebar-toggle, #oracle-sidebar-toggle")
  ) {
    closeMobileNav();
  }
});

openScreenBtn?.addEventListener("click", () => {
  showView("screen");
});

exitScreenBtn?.addEventListener("click", () => {
  showView("home", "#screen");
});

// J20. Editor controls.
writeButton?.addEventListener("click", openEditor);
createBtn?.addEventListener("click", openEditor);
closeEditorBtn?.addEventListener("click", closeEditor);
saveDraftBtn?.addEventListener("click", () => saveOffering("draft"));
publishBtn?.addEventListener("click", () => saveOffering("published"));
writerProfileForm?.addEventListener("submit", saveWriterProfile);
writerSecurityForm?.addEventListener("submit", changeWriterPassword);
sendResetLinkBtn?.addEventListener("click", sendPasswordResetLink);
storyFormatInputs.forEach((input) => {
  input.addEventListener("change", () => setActiveStoryFormat(getActiveStoryFormat()));
});
postType?.addEventListener("change", () => {
  if (postType.value === "series") {
    setActiveStoryFormat("series");
  }
});
toolbarButtons.forEach((button) => {
  button.addEventListener("click", () => {
    runEditorCommand(button.dataset.command, button.dataset.value || null);
  });
});

textColor?.addEventListener("input", () => {
  runEditorCommand("foreColor", textColor.value);
});

addLinkBtn?.addEventListener("click", () => {
  const url = prompt("Paste the link URL");
  if (!url || !isSafeUrl(url)) return;

  const selectedText = window.getSelection().toString();
  if (selectedText) {
    runEditorCommand("createLink", url);
    return;
  }

  insertRichHtml(`<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`);
});

addImageBtn?.addEventListener("click", () => {
  const imageUrl = prompt("Paste an image URL");
  if (!imageUrl || !isSafeImageUrl(imageUrl)) return;

  insertRichHtml(`<figure><img src="${escapeHtml(imageUrl)}" alt=""></figure><p><br></p>`);
});

addCoverBtn?.addEventListener("click", async () => {
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

addYoutubeBtn?.addEventListener("click", () => {
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

  let { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, username, pen_name, display_name_mode, bio, avatar_url, writer_level, public_show_avatar, public_show_bio, public_show_level")
    .eq("id", post.author_id)
    .maybeSingle();

  if (
    profileError &&
    ["username", "bio", "avatar_url", "pen_name", "display_name_mode", "public_show_avatar", "public_show_bio", "public_show_level"].some((column) =>
      isMissingColumnError(profileError, column),
    )
  ) {
    ({ data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, username, writer_level")
      .eq("id", post.author_id)
      .maybeSingle());
  }

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

const updateSeriesNavigation = async (post) => {
  if (!seriesNavigation || !prevChapterBtn || !nextChapterBtn || !seriesIndex) return;

  if (!post?.series_id) {
    seriesNavigation.classList.add("hidden");
    prevChapterBtn.onclick = null;
    nextChapterBtn.onclick = null;
    return;
  }

  const { data: episodes = [], error } = await supabase
    .from("posts")
    .select("id, series_order")
    .eq("series_id", post.series_id)
    .in("status", ["published", "featured"])
    .order("series_order", { ascending: true });

  if (error || !episodes.length) {
    console.error("Error loading series navigation:", error);
    seriesNavigation.classList.add("hidden");
    return;
  }

  const currentIndex = episodes.findIndex((episode) => episode.id === post.id);

  if (currentIndex === -1) {
    seriesNavigation.classList.add("hidden");
    return;
  }

  const previousEpisode = episodes[currentIndex - 1];
  const nextEpisode = episodes[currentIndex + 1];

  prevChapterBtn.classList.toggle("hidden", !previousEpisode);
  nextChapterBtn.classList.toggle("hidden", !nextEpisode);
  prevChapterBtn.onclick = previousEpisode ? () => openStory(previousEpisode.id) : null;
  nextChapterBtn.onclick = nextEpisode ? () => openStory(nextEpisode.id) : null;
  seriesIndex.textContent = `Part ${currentIndex + 1} of ${episodes.length}`;
  seriesNavigation.classList.remove("hidden");
};

// J21. Reader story loading and series navigation.
async function openStory(postId, options = {}) {
  const { updateUrl = true } = options;
  const readerView = document.querySelector("#reader-view");
  if (!readerView) return;

  currentOpenPostId = postId;
  publicViews.forEach((view) => view.classList.add("hidden"));
  dashboardView.classList.add("hidden");
  adminView.classList.add("hidden");
  shrineScreenView?.classList.add("hidden");
  scrollView?.classList.add("hidden");
  writerProfileView?.classList.add("hidden");
  communityView?.classList.add("hidden");
  document.querySelector("#reader-title").textContent = "Opening story...";
  document.querySelector("#reader-author").textContent = "";
  document.querySelector("#reader-category").textContent = "";
  document.querySelector("#reader-body").innerHTML = "";
  document.querySelector("#reading-time").textContent = "";
  seriesNavigation?.classList.add("hidden");
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
  if (updateUrl) window.history.pushState({ storyId: post.id }, "", getCleanStoryPath(post));

  document.querySelector("#reader-title").textContent = currentOpenPostTitle;
  const readerAuthor = document.querySelector("#reader-author");
  readerAuthor.textContent = `By ${getProfileDisplayName(post.profiles, "Unknown scribe")}`;
  readerAuthor.classList.toggle("author-link", Boolean(post.author_id));
  readerAuthor.tabIndex = post.author_id ? 0 : -1;
  readerAuthor.setAttribute("role", post.author_id ? "button" : "text");
  readerAuthor.onclick = post.author_id ? (event) => openWriterProfileFromEvent(event, post.author_id) : null;
  readerAuthor.onkeydown = post.author_id
    ? (event) => {
        if (event.key === "Enter" || event.key === " ") {
          openWriterProfileFromEvent(event, post.author_id);
        }
      }
    : null;
  document.querySelector("#reader-category").textContent = getSeriesLabel(post);
  document.querySelector("#reader-body").innerHTML = getReaderFriendlyContent(content);
  document.querySelector("#reading-time").textContent = `${calculateReadingTime(content)} min read`;
  await updateSeriesNavigation(post);
  updateShareMetadata(post);
  updateShareLinks();
  await updateBookmarkButton(postId);
  await refreshEchoComposer();
  await loadEchoes(postId);
}

window.openStory = openStory;

window.addEventListener("popstate", async () => {
  const storyId = getStoryIdFromPath() || new URLSearchParams(window.location.search).get("story");
  if (storyId) {
    await openStory(storyId, { updateUrl: false });
    return;
  }

  document.querySelector("#reader-view")?.classList.add("hidden");
  publicViews.forEach((view) => view.classList.remove("hidden"));
  communityView?.classList.add("hidden");
  document.body.classList.remove("focus-mode");
  currentOpenPostId = null;
  currentOpenPost = null;
});

readerLogoutBtn?.addEventListener("click", async () => {
  setAppLoading(true, "Closing your scroll...");

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

readerSettingsBtn?.addEventListener("click", async () => {
  const user = await authActions.getCurrentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  renderNotificationPreferences(await loadNotificationPreferences(user.id));
  openModal(modals.settings);
});

// J22. Focus mode toggle.
document.querySelector("#toggle-focus")?.addEventListener("click", () => {
  document.body.classList.toggle("focus-mode");
});

document.querySelector("#add-bookmark")?.addEventListener("click", toggleBookmark);
document.querySelector(".libation-btn")?.addEventListener("click", () => {
  pourLibation(currentOpenPost?.author_id);
});

// J23. Reader exit controls.
document.querySelector("#exit-reader")?.addEventListener("click", () => {
  document.querySelector("#reader-view")?.classList.add("hidden");
  publicViews.forEach((view) => view.classList.remove("hidden"));
  communityView?.classList.add("hidden");
  document.body.classList.remove("focus-mode");
  currentOpenPostId = null;
  currentOpenPost = null;
  window.history.pushState({}, "", "/");
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

const updateSeriesCommunalState = async (seriesId, isCommunal, rules = "", leadScribeId = "") => {
  if (!seriesId) return null;

  let payload = { is_communal: isCommunal, saga_rules: rules };
  let { error } = await supabase
    .from("series")
    .update(payload)
    .eq("id", seriesId);

  while (error) {
    const missingColumn = Object.keys(payload).find((column) => isMissingColumnError(error, column));
    if (!missingColumn) return error;
    const { [missingColumn]: _removed, ...nextPayload } = payload;
    payload = nextPayload;
    ({ error } = await supabase.from("series").update(payload).eq("id", seriesId));
  }

  if (isCommunal && leadScribeId) {
    const { error: collaboratorError } = await supabase.from("saga_collaborators").upsert(
      [{ series_id: seriesId, scribe_id: leadScribeId, role: "lead" }],
      { onConflict: "series_id,scribe_id" },
    );

    if (collaboratorError) console.error("Lead Scribe could not be recorded as a saga collaborator:", collaboratorError);
  }

  return null;
};

const getYoutubeCreatorName = async (url) => {
  if (!url) return "";
  if (youtubeCreatorCache.has(url)) return youtubeCreatorCache.get(url) || "";

  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Creator lookup failed");
    const data = await response.json();
    const creatorName = data?.author_name?.trim() || "";
    youtubeCreatorCache.set(url, creatorName);
    return creatorName;
  } catch {
    youtubeCreatorCache.set(url, "");
    return "";
  }
};

const getMediaShareMessage = (item) => {
  const creator = item?.creator_name ? ` by ${item.creator_name}` : "";
  return `Watch "${item?.title || "this vision"}"${creator} on alo's Shrine Screen.`;
};

const shareMediaItem = async (item) => {
  if (!item?.url || !navigator.share) return;
  const message = getMediaShareMessage(item);
  await navigator.share({
    title: item?.title || "Shrine Screen vision",
    text: message,
    url: item.url,
  });
};

const buildMediaShareActions = (item) => {
  const wrap = document.createElement("div");
  const whatsapp = document.createElement("a");
  const threads = document.createElement("a");
  const x = document.createElement("a");
  const message = getMediaShareMessage(item);
  const encodedText = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(item.url || "");

  wrap.className = "media-share-actions";
  whatsapp.className = "share-btn share-icon-btn";
  whatsapp.href = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener noreferrer";
  whatsapp.textContent = "W";
  whatsapp.setAttribute("aria-label", "Share on WhatsApp");
  whatsapp.title = "WhatsApp";

  threads.className = "share-btn share-icon-btn";
  threads.href = `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`;
  threads.target = "_blank";
  threads.rel = "noopener noreferrer";
  threads.textContent = "@";
  threads.setAttribute("aria-label", "Share on Threads");
  threads.title = "Threads";

  x.className = "share-btn share-icon-btn";
  x.href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  x.target = "_blank";
  x.rel = "noopener noreferrer";
  x.textContent = "X";
  x.setAttribute("aria-label", "Share on X");
  x.title = "X";

  wrap.append(whatsapp, threads, x);
  return wrap;
};

const hydrateMediaCreator = async (item) => {
  if (!item) return item;
  if (item.media_type !== "youtube") return item;
  if (item.creator_name) return item;
  const creator = await getYoutubeCreatorName(item.url);
  return { ...item, creator_name: creator };
};

// J24. Shrine Screen playback helpers.
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

// J25. Shrine Screen card rendering.
const renderMediaCard = (item) => {
  const card = document.createElement("article");
  const thumbnail = document.createElement("div");
  const info = document.createElement("div");
  const title = document.createElement("h3");
  const meta = document.createElement("span");
  const shareActions = buildMediaShareActions(item);
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
  meta.textContent = item.creator_name
    ? `${item.media_type || "vision"} - by ${item.creator_name}`
    : item.media_type || "vision";
  const open = () => openVideoModal(item.url, item.media_type);
  card.addEventListener("click", open);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  info.append(title, meta);
  card.append(thumbnail, info, shareActions);
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
  const shareActions = item.url ? buildMediaShareActions(item) : null;
  const videoId = item.media_type === "youtube" ? getYoutubeID(item.url) : "";
  const thumbUrl = item.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "");

  card.className = `screen-preview-card preview-tone-${index + 1}`;
  thumb.className = "screen-preview-thumb";
  title.textContent = item.title || "Untitled vision";
  meta.textContent = item.creator_name
    ? `${item.media_type || "vision"} - ${item.creator_name}`
    : item.media_type || "vision";

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
  if (shareActions) card.appendChild(shareActions);
  return card;
};

async function renderScreenPreviews() {
  if (!screenPreviewGrid) return;

  screenPreviewGrid.innerHTML = "";

  const { data: mediaItems = [], error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const previews = error || !mediaItems.length ? screenPreviewPlaceholders : await Promise.all(mediaItems.map(hydrateMediaCreator));
  previews.forEach((item, index) => screenPreviewGrid.appendChild(renderScreenPreviewCard(item, index)));
}

// J26. Shrine Screen data loading.
async function loadShrineScreen() {
  if (!videoGrid) return;

  videoGrid.innerHTML = "";

  const { data: mediaItems = [], error } = await supabase
    .from("media")
    .select("*")
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
  const enrichedItems = await Promise.all(mediaItems.map(hydrateMediaCreator));
  enrichedItems.forEach((item) => fragment.appendChild(renderMediaCard(item)));
  videoGrid.appendChild(fragment);
}

dashboardTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setDashboardTab(button.dataset.tab);
  });
});

sagaDashboardStartBtn?.addEventListener("click", openCommunalSagaEditor);
sagaDashboardContributeBtn?.addEventListener("click", loadSagaContributionChoices);
sidebarCommunalSagaBtn?.addEventListener("click", () => {
  setDashboardTab("sagas");
  sagaContributionPanel?.classList.add("hidden");
  openModal(modals.communalSaga);
});
closeCommunalSagaModalBtn?.addEventListener("click", () => closeModal(modals.communalSaga));
startCommunalSagaBtn?.addEventListener("click", async () => {
  closeModal(modals.communalSaga);
  await openCommunalSagaEditor();
});
contributeCommunalSagaBtn?.addEventListener("click", async () => {
  closeModal(modals.communalSaga);
  await loadSagaContributionChoices();
});

modals.communalSaga?.addEventListener("click", (event) => {
  if (event.target === modals.communalSaga) closeModal(modals.communalSaga);
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
  const creatorName = getMediaType(url) === "youtube" ? await getYoutubeCreatorName(url) : "";

  const payload = {
    title,
    url,
    media_type: getMediaType(url),
    author_id: user.id,
    creator_name: creatorName,
  };

  const request = currentEditingVisionId
    ? supabase
        .from("media")
        .update(payload)
        .eq("id", currentEditingVisionId)
    : supabase.from("media").insert([payload]);

  let { error } = await request;

  if (error && (isMissingColumnError(error, "author_id") || isMissingColumnError(error, "creator_name"))) {
    const { author_id: _authorId, creator_name: _creatorName, ...legacyPayload } = payload;
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
  const visionModal = document.querySelector("#add-vision-modal");
  closeModal(visionModal);
  await loadWriterDashboard();
  await loadShrineScreen();
  await renderScreenPreviews();
});

closeVideoBtn?.addEventListener("click", closeVideoModal);
videoModal?.addEventListener("click", (event) => {
  if (event.target === videoModal) closeVideoModal();
});

const setContentFadeLoading = (element, isLoading) => {
  element?.classList.toggle("is-loading", isLoading);
};

const formatSparkCountdown = (endsAt) => {
  const remainingMs = new Date(endsAt).getTime() - Date.now();
  const remainingHours = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60)));
  return `The fire fades in ${remainingHours} hour${remainingHours === 1 ? "" : "s"}.`;
};

const getEventName = (event = {}) =>
  event.profiles?.full_name || event.profile_name || event.name || event.actor_name || event.userName || "Someone";

const getWitnessingText = (event = {}) => {
  const name = getEventName(event);
  const eventType = event.event_type || event.type;
  const poeticMessage = (event.poetic_message || "").trim();

  if (poeticMessage) {
    const sentence = poeticMessage.endsWith(".") ? poeticMessage : `${poeticMessage}.`;
    return `${name} ${sentence}`;
  }

  if (eventType === "new_story" || eventType === "new_ink") return `${name} has offered new ink to the shrine.`;
  if (eventType === "ascension") return `${name} has ascended to the rank of Scribe.`;
  if (eventType === "new_vision") return `${name} has shared a cinematic vision.`;
  if (eventType === "libation") return `${name} has poured a libation.`;
  return `${name} has moved quietly through the shrine.`;
};

const getSparkEchoAuthor = (echo = {}) =>
  echo.profiles?.full_name || echo.profile_name || echo.name || echo.author_name || "A voice by the fire";

const loadSparkEchoes = async (sparkId) => {
  const list = document.querySelector("#spark-echoes");
  if (!list || !sparkId) return;

  setContentFadeLoading(list, true);
  list.replaceChildren();

  let { data: echoes = [], error } = await supabase
    .from("echoes")
    .select("*, profiles(full_name)")
    .eq("spark_id", sparkId)
    .order("created_at", { ascending: true });

  if (error) {
    ({ data: echoes = [], error } = await supabase
      .from("echoes")
      .select("*")
      .eq("spark_id", sparkId)
      .order("created_at", { ascending: true }));
  }

  if (error) {
    ({ data: echoes = [], error } = await supabase
      .from("spark_echoes")
      .select("*, profiles(full_name)")
      .eq("spark_id", sparkId)
      .order("created_at", { ascending: true }));
  }

  setContentFadeLoading(list, false);

  if (error) {
    console.error("Error loading spark echoes:", error);
    list.textContent = "The echoes around this fire could not be heard.";
    return;
  }

  if (!echoes.length) {
    list.textContent = "No echoes have gathered around this spark yet.";
    return;
  }

  const fragment = document.createDocumentFragment();
  echoes.forEach((echo) => {
    const item = document.createElement("article");
    const content = document.createElement("p");
    const author = document.createElement("span");

    item.className = "spark-echo";
    content.textContent = echo.content || echo.message || "";
    author.textContent = getSparkEchoAuthor(echo);
    item.append(content, author);
    fragment.appendChild(item);
  });
  list.replaceChildren(fragment);
};

export async function loadMidnightFire() {
  const firePit = document.querySelector("#active-spark");
  if (!firePit) return null;

  const now = new Date().toISOString();
  setContentFadeLoading(firePit, true);

  const { data: activeSpark, error } = await supabase
    .from("sparks")
    .select("*")
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  setContentFadeLoading(firePit, false);

  if (error) {
    console.error("Error loading Midnight Fire:", error);
    firePit.innerHTML = `
      <div class="fire-pit-inner">
        <h2 class="font-display">The fire is difficult to read tonight.</h2>
        <p>Return when the smoke has cleared.</p>
      </div>
    `;
    return null;
  }

  if (!activeSpark) {
    firePit.innerHTML = `
      <div class="fire-pit-inner">
        <h2 class="font-display">The fire is currently quiet.</h2>
        <p>Revisit when the moon is high.</p>
      </div>
    `;
    document.querySelector("#spark-echoes")?.replaceChildren();
    return null;
  }

  firePit.innerHTML = `
    <div class="fire-pit-inner">
      <h2 class="font-display">${escapeHtml(activeSpark.title || "Untitled spark")}</h2>
      <p>${escapeHtml(activeSpark.description || activeSpark.prompt || "")}</p>
      <span class="fire-countdown">${escapeHtml(formatSparkCountdown(activeSpark.ends_at))}</span>
    </div>
  `;

  await loadSparkEchoes(activeSpark.id);
  return activeSpark;
}

export async function loadWitnessingFeed() {
  const feed = document.querySelector("#witnessing-feed");
  if (!feed) return;

  setContentFadeLoading(feed, true);
  let { data: events = [], error } = await supabase
    .from("witness_events")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    ({ data: events = [], error } = await supabase
      .from("witness_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10));
  }

  if (!error && events.length && events.some((event) => event.user_id && !event.profiles)) {
    const profilesById = await getProfileNamesById(events.map((event) => event.user_id));
    events = events.map((event) => ({
      ...event,
      userName: getProfileDisplayName(profilesById.get(event.user_id), "Someone"),
    }));
  }

  setContentFadeLoading(feed, false);
  feed.replaceChildren();

  if (error) {
    console.error("Error loading witnessing feed:", error);
    const emptyState = document.createElement("p");
    emptyState.className = "witness-event";
    emptyState.textContent = "The witnessing is quiet tonight.";
    feed.appendChild(emptyState);
    return;
  }

  if (!events.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "witness-event";
    emptyState.textContent = "No footsteps have crossed the circle yet.";
    feed.appendChild(emptyState);
    return;
  }

  events.forEach((event) => {
    const item = document.createElement("p");
    item.className = "witness-event";
    item.textContent = getWitnessingText(event);
    feed.appendChild(item);
  });
}

const loadAshesGallery = async () => {
  const gallery = document.querySelector("#ashes-gallery");
  if (!gallery) return;

  const now = new Date().toISOString();
  setContentFadeLoading(gallery, true);
  const { data: ashes = [], error } = await supabase
    .from("sparks")
    .select("*")
    .lt("ends_at", now)
    .order("ends_at", { ascending: false })
    .limit(6);

  setContentFadeLoading(gallery, false);
  gallery.replaceChildren();

  if (error) {
    console.error("Error loading Ashes:", error);
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "The ashes could not be gathered.";
    gallery.appendChild(emptyState);
    return;
  }

  if (!ashes.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No fires have cooled into ash yet.";
    gallery.appendChild(emptyState);
    return;
  }

  ashes.forEach((spark) => {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const ended = document.createElement("p");

    card.className = "ash-card";
    title.textContent = spark.title || "Untitled spark";
    description.textContent = spark.description || spark.prompt || "A finished circle of thought.";
    ended.className = "meta-label";
    ended.textContent = spark.ends_at ? new Date(spark.ends_at).toLocaleDateString() : "Archived";

    card.append(title, description, ended);
    gallery.appendChild(card);
  });
};

const getProfileNamesById = async (ids = []) => {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (!uniqueIds.length) return new Map();

  const { data: profiles = [], error } = await supabase
    .from("profiles")
    .select("id, full_name, pen_name, display_name_mode, username, writer_level")
    .in("id", uniqueIds);

  if (error) {
    console.error("Error loading profile names:", error);
    return new Map();
  }

  return new Map(profiles.map((profile) => [profile.id, profile]));
};

const getSeriesById = async (ids = []) => {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (!uniqueIds.length) return new Map();

  const { data: series = [], error } = await supabase
    .from("series")
    .select("id, title, author_id, is_communal, saga_rules")
    .in("id", uniqueIds);

  if (error) {
    console.error("Error loading saga series:", error);
    return new Map();
  }

  return new Map(series.map((item) => [item.id, item]));
};

const loadCollaborativeSagas = async () => {
  if (!collaborativeSagasList) return;

  setContentFadeLoading(collaborativeSagasList, true);
  const { data: sagas = [], error } = await supabase
    .from("series")
    .select("id, title, description, saga_rules, author_id, created_at")
    .eq("is_communal", true)
    .order("created_at", { ascending: false })
    .limit(8);

  setContentFadeLoading(collaborativeSagasList, false);
  collaborativeSagasList.replaceChildren();

  if (error) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = isMissingColumnError(error, "is_communal")
      ? "Communal Sagas need the community rituals schema before they can open."
      : "The communal sagas could not be gathered.";
    collaborativeSagasList.appendChild(emptyState);
    console.error("Error loading collaborative sagas:", error);
    return;
  }

  if (!sagas.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No saga has opened itself to the circle yet.";
    collaborativeSagasList.appendChild(emptyState);
    return;
  }

  const profilesById = await getProfileNamesById(sagas.map((saga) => saga.author_id));

  sagas.forEach((saga) => {
    const card = document.createElement("article");
    const title = document.createElement("h3");
    const meta = document.createElement("p");
    const description = document.createElement("p");
    const action = document.createElement("button");
    const leadName = getProfileDisplayName(profilesById.get(saga.author_id), "A Lead Scribe");

    card.className = "saga-card";
    title.textContent = saga.title || "Untitled communal saga";
    meta.className = "meta-label";
    meta.textContent = `Lead Scribe: ${leadName}`;
    description.textContent = saga.saga_rules || saga.description || "This saga is open for another voice to carry the next chapter.";
    action.className = "text-btn";
    action.type = "button";
    action.textContent = "Offer Next Chapter";
    action.addEventListener("click", () => openSagaApplication(saga, leadName));

    card.append(title, meta, description, action);
    collaborativeSagasList.appendChild(card);
  });
};

const loadCommunityCircle = async () => {
  await Promise.allSettled([loadMidnightFire(), loadWitnessingFeed(), loadAshesGallery(), loadCollaborativeSagas()]);
};

const runGoldGlow = () => {
  document.body.classList.remove("libation-accepted");
  void document.body.offsetWidth;
  document.body.classList.add("libation-accepted");
  window.setTimeout(() => document.body.classList.remove("libation-accepted"), 1700);
};

const saveLibationEvent = async ({ authorId, giverId, postId, message }) => {
  let payload = {
    from_user_id: giverId,
    to_user_id: authorId,
    post_id: postId,
    message,
    token_count: 1,
  };

  let { error } = await supabase.from("libations").insert([payload]);

  while (error) {
    const missingColumn = Object.keys(payload).find((column) => isMissingColumnError(error, column));
    if (!missingColumn) break;
    const { [missingColumn]: _removed, ...nextPayload } = payload;
    payload = nextPayload;
    ({ error } = await supabase.from("libations").insert([payload]));
  }

  return error;
};

export async function pourLibation(authorId) {
  if (!authorId) {
    alert("This offering has no named scribe to receive the libation.");
    return;
  }

  const user = await authActions.getCurrentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  const message = prompt("Leave a few words with the libation, if you wish.")?.trim() || "";

  const eventError = await saveLibationEvent({
    authorId,
    giverId: user?.id || null,
    postId: currentOpenPostId,
    message,
  });

  if (eventError) {
    alert("The libation could not be poured: " + eventError.message);
    return;
  }

  runGoldGlow();
}

const closeSagaApplicationModal = () => {
  sagaApplicationModal?.classList.add("hidden");
  sagaApplicationForm?.reset();
  currentSagaApplicationSeries = null;
  document.body.style.overflow = "";
};

const openSparkModal = () => {
  sparkModal?.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const openCommunalSagaEditor = async () => {
  await openEditor();
  postType.value = "series";
  setActiveStoryFormat("series");
  if (communalSaga) communalSaga.checked = true;
  if (episodeNumber && !episodeNumber.value) episodeNumber.value = "1";
  seriesTitle?.focus();
};

const loadSagaContributionChoices = async () => {
  setDashboardTab("sagas");
  const user = await authActions.getCurrentUser();
  if (!sagaContributionList || !user) return;

  sagaContributionPanel?.classList.remove("hidden");
  sagaContributionList.replaceChildren();

  const { data: sagas = [], error } = await supabase
    .from("series")
    .select("id, title, description, saga_rules, author_id, created_at")
    .eq("is_communal", true)
    .neq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "The ongoing sagas could not be gathered.";
    sagaContributionList.appendChild(emptyState);
    return;
  }

  if (!sagas.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No communal sagas are open for contribution right now.";
    sagaContributionList.appendChild(emptyState);
    return;
  }

  const profilesById = await getProfileNamesById(sagas.map((saga) => saga.author_id));
  sagas.forEach((saga) => {
    const button = document.createElement("button");
    const leadName = getProfileDisplayName(profilesById.get(saga.author_id), "A Lead Scribe");
    button.className = "saga-choice-card";
    button.type = "button";
    button.innerHTML = `
      <span class="eyebrow">Lead Scribe: ${escapeHtml(leadName)}</span>
      <strong>${escapeHtml(saga.title || "Untitled communal saga")}</strong>
      <small>${escapeHtml(saga.saga_rules || saga.description || "This world is waiting for another voice.")}</small>
    `;
    button.addEventListener("click", () => {
      sagaContributionPanel?.classList.add("hidden");
      openSagaApplication(saga, leadName);
    });
    sagaContributionList.appendChild(button);
  });
};

const closeSparkModal = () => {
  sparkModal?.classList.add("hidden");
  sparkForm?.reset();
  if (submitSparkBtn) {
    submitSparkBtn.disabled = false;
    submitSparkBtn.textContent = "Light the Fire";
  }
  document.body.style.overflow = "";
};

const closeSagaReviewModal = () => {
  sagaReviewModal?.classList.add("hidden");
  currentSagaReviewApplication = null;
if (sagaReviewTitle) sagaReviewTitle.textContent = "Witness Chapter";
  if (sagaReviewTitleInput) sagaReviewTitleInput.value = "";
  if (sagaReviewMeta) sagaReviewMeta.textContent = "";
  if (sagaReviewContent) sagaReviewContent.value = "";
  document.body.style.overflow = "";
};

const openSagaReviewModal = (application) => {
  if (!application || !sagaReviewModal) return;

  const applicantName = getProfileDisplayName(writerSagaProfilesById.get(application.applicant_id), "A Scribe");
  const sagaTitle = writerSagaSeriesById.get(application.series_id)?.title || "a communal saga";
  currentSagaReviewApplication = application;

  if (sagaReviewTitle) sagaReviewTitle.textContent = application.title || "Untitled chapter";
  if (sagaReviewTitleInput) sagaReviewTitleInput.value = application.title || "";
  if (sagaReviewMeta) sagaReviewMeta.textContent = `${applicantName} offers this to ${sagaTitle}.`;
  if (sagaReviewContent) sagaReviewContent.value = (application.content || "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<[^>]*>/g, "").trim();

  sagaReviewModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const openSagaApplication = async (saga, leadName = "the Lead Scribe") => {
  const user = await authActions.getCurrentUser();

  if (!user) {
    openAuthModal();
    return;
  }

  if (!isWriterUser(user)) {
    alert("Only Scribes can offer the next chapter of a communal saga.");
    await showView("scroll");
    return;
  }

  if (user.id === saga.author_id) {
    alert("You are already the Lead Scribe of this saga. Invite the circle to carry the next turn.");
    return;
  }

  currentSagaApplicationSeries = saga;
  if (sagaApplicationContext) {
    sagaApplicationContext.textContent = `Offer a chapter for "${saga.title || "this saga"}". ${leadName} will witness it before it joins the saga.`;
  }
  sagaApplicationModal?.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const submitSagaApplication = async (event) => {
  event.preventDefault();

  const user = await authActions.getCurrentUser();
  const saga = currentSagaApplicationSeries;
  const title = sagaApplicationTitle?.value.trim() || "";
  const content = sagaApplicationContent?.value.trim() || "";

  if (!user || !saga) {
    closeSagaApplicationModal();
    return;
  }

  if (!title || !content) {
    alert("The Lead Scribe needs both a title and chapter text to witness.");
    return;
  }

  if (submitSagaApplicationBtn) {
    submitSagaApplicationBtn.disabled = true;
    submitSagaApplicationBtn.textContent = "Offering...";
  }

  const payload = {
    series_id: saga.id,
    lead_scribe_id: saga.author_id,
    applicant_id: user.id,
    title,
    content: plainTextToRichHtml(content),
    status: "pending",
  };

  const { error } = await supabase.from("saga_applications").insert([payload]);

  if (submitSagaApplicationBtn) {
    submitSagaApplicationBtn.disabled = false;
    submitSagaApplicationBtn.textContent = "Offer Chapter";
  }

  if (error) {
    alert("This chapter could not be offered: " + error.message);
    return;
  }

  closeSagaApplicationModal();
  alert("Your chapter has been placed before the Lead Scribe.");
};

const getNextSeriesOrder = async (seriesId) => {
  const { data: latest = [], error } = await supabase
    .from("posts")
    .select("series_order")
    .eq("series_id", seriesId)
    .order("series_order", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Error finding next series order:", error);
    return 1;
  }

  return Number(latest?.[0]?.series_order || 0) + 1;
};

const approveSagaApplication = async (application) => {
  const user = await authActions.getCurrentUser();
  if (!user || user.id !== application.lead_scribe_id) return;

  const reviewedTitle = sagaReviewTitleInput?.value.trim() || application.title;
  const reviewedContent = sagaReviewContent?.value.trim()
    ? plainTextToRichHtml(sagaReviewContent.value.trim())
    : application.content;
  const nextOrder = await getNextSeriesOrder(application.series_id);
  const { error: postError } = await supabase.from("posts").insert([
    {
      author_id: application.applicant_id,
      title: reviewedTitle,
      content: reviewedContent,
      type: "series",
      status: "published",
      series_id: application.series_id,
      series_order: nextOrder,
    },
  ]);

  if (postError) {
    alert("The chapter could not join the saga: " + postError.message);
    return;
  }

  const { error: updateError } = await supabase
    .from("saga_applications")
    .update({ status: "approved", title: reviewedTitle, content: reviewedContent, reviewed_at: new Date().toISOString() })
    .eq("id", application.id);

  if (updateError) {
    alert("The chapter was published, but the application could not be marked approved: " + updateError.message);
    return;
  }

  const { error: collaboratorError } = await supabase.from("saga_collaborators").upsert(
    [{ series_id: application.series_id, scribe_id: application.applicant_id, role: "contributor" }],
    { onConflict: "series_id,scribe_id" },
  );

  if (collaboratorError) console.error("Contributor could not be recorded for this saga:", collaboratorError);

  publicOfferingsCache = null;
  closeSagaReviewModal();
  await loadWriterDashboard();
  await renderFeaturedStories();
};

const rejectSagaApplication = async (application) => {
  const user = await authActions.getCurrentUser();
  if (!user || user.id !== application.lead_scribe_id) return;

  const { error } = await supabase
    .from("saga_applications")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", application.id);

  if (error) {
    alert("The chapter could not be released: " + error.message);
    return;
  }

  closeSagaReviewModal();
  await loadWriterDashboard();
};

sagaApplicationForm?.addEventListener("submit", submitSagaApplication);
closeSagaApplicationModalBtn?.addEventListener("click", closeSagaApplicationModal);
cancelSagaApplicationBtn?.addEventListener("click", closeSagaApplicationModal);
sagaApplicationModal?.addEventListener("click", (event) => {
  if (event.target === sagaApplicationModal) closeSagaApplicationModal();
});
sparkForm?.addEventListener("submit", createOracleSpark);
closeSparkModalBtn?.addEventListener("click", closeSparkModal);
cancelSparkFormBtn?.addEventListener("click", closeSparkModal);
sparkModal?.addEventListener("click", (event) => {
  if (event.target === sparkModal) closeSparkModal();
});
closeSagaReviewModalBtn?.addEventListener("click", closeSagaReviewModal);
sagaReviewModal?.addEventListener("click", (event) => {
  if (event.target === sagaReviewModal) closeSagaReviewModal();
});
acceptSagaApplicationBtn?.addEventListener("click", () => {
  if (currentSagaReviewApplication) approveSagaApplication(currentSagaReviewApplication);
});
releaseSagaApplicationBtn?.addEventListener("click", () => {
  if (currentSagaReviewApplication) rejectSagaApplication(currentSagaReviewApplication);
});

// J27. Initial page setup.
document.body.style.overflowY = "hidden";
const bootstrapApp = async () => {
  setAppLoading(true, "Opening the shrine...");
  try {
    applyBaseShareMetadata();
    renderAuthMode();
    syncSidebarPanelsForViewport();

    await Promise.allSettled([
      withStartupTimeout(authActions.initializeSessionGuard(), "Session guard"),
      withStartupTimeout(authActions.enforceSessionPolicy(), "Session policy"),
    ]);

    const params = new URLSearchParams(window.location.search);
    const initialStoryId = getStoryIdFromPath() || params.get("story");
    const categoryFromUrl = params.get("category");
    const normalizedCategory = categoryFromUrl && shrineFilters[categoryFromUrl] ? categoryFromUrl : null;
    const startsInCommunity = window.location.hash === "#community-view";

    await Promise.allSettled([
      withStartupTimeout(renderFeaturedStories(normalizedCategory || "all"), "Featured offerings"),
      withStartupTimeout(renderScreenPreviews(), "Shrine Screen previews"),
      withStartupTimeout(initSession(), "Session restore"),
    ]);

    if (initialStoryId) {
      hero?.classList.add("lifted");
      content?.classList.remove("hidden");
      content?.classList.add("visible");
      document.body.style.overflowY = "auto";
      await withStartupTimeout(openStory(initialStoryId, { updateUrl: !getStoryIdFromPath() }), "Initial story");
    } else if (normalizedCategory || startsInCommunity) {
      hero?.classList.add("lifted");
      content?.classList.remove("hidden");
      content?.classList.add("visible");
      document.body.style.overflowY = "auto";
      await withStartupTimeout(startsInCommunity ? showView("community") : showView("home", "#explore"), "Initial view");
    }
  } catch (error) {
    console.error("Error during app startup:", error);
    window.__aloStartupFallback?.(error);
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

// J28. Listener Scroll data loading.
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

// J29. Reader-to-writer ascension flow.
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


// J30. Writer public profile view.
async function showWriterProfile(writerId) {
    await showView("writer-profile");

    let { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", writerId)
        .maybeSingle();

    if (profileError || !profile) {
        alert(profileError?.message || "This writer profile could not be opened.");
        await showView("home", "#community");
        return;
    }

    const avatar = document.querySelector("#scribe-avatar");
    const level = profile.writer_level || getVoiceLabel(profile);
    const theme = getLevelTheme(level);
    const showBio = profile.public_show_bio !== false;
    const showLevel = profile.public_show_level !== false;
    const showAvatar = profile.public_show_avatar !== false;

    document.querySelector("#scribe-name").textContent = getProfileDisplayName(profile, "A quiet scribe");
    document.querySelector("#scribe-bio").textContent = showBio ? profile.bio || "A quiet scribe in the circle." : "This scribe keeps their story private.";
    document.querySelector("#scribe-level").textContent = showLevel ? level : "Circle Member";
    document.querySelector("#scribe-level").dataset.level = theme.slug;

    if (avatar) {
        const customAvatar = showAvatar && profile.avatar_url && isSafeImageUrl(profile.avatar_url);
        avatar.textContent = customAvatar ? "" : theme.glyph;
        avatar.style.color = theme.color;
        avatar.style.backgroundColor = theme.bg;
        avatar.style.backgroundImage = customAvatar ? `url("${profile.avatar_url}")` : "";
    }

    const { data: posts = [], error: postError } = await supabase
        .from("posts")
    .select("*, series(id, title, cover_url)")
        .eq("author_id", writerId)
        .in("status", ["published", "featured"])
        .order("created_at", { ascending: false });

    if (postError) {
        alert("This writer's offerings could not be loaded: " + postError.message);
        return;
    }

    const grid = document.querySelector("#scribe-offerings-grid");
    grid.innerHTML = "";
    document.querySelector("#scribe-works-count").textContent = posts.length;

    if (!posts.length) {
        const emptyState = document.createElement("p");
        emptyState.className = "empty-state";
        emptyState.textContent = "This scribe has no public offerings yet.";
        grid.appendChild(emptyState);
        return;
    }

    posts.forEach((post) => {
        const card = document.createElement("article");
        const title = document.createElement("h3");
        const meta = document.createElement("p");
        const excerpt = document.createElement("p");

        card.className = "story-card";
        card.tabIndex = 0;
        card.role = "button";
        title.textContent = getDisplayTitle(post);
        meta.className = "eyebrow";
        meta.textContent = getSeriesLabel(post);
        excerpt.textContent = getStoryExcerpt(post);

        card.addEventListener("click", () => openStory(post.id));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openStory(post.id);
            }
        });

        card.append(meta, title, excerpt);
        grid.appendChild(card);
    });
}

window.showWriterProfile = showWriterProfile;

async function loadQuoteOfTheDay() {
    const quoteElement = document.querySelector('#daily-quote-text');
    const authorElement = document.querySelector('#daily-quote-author');
    if (!quoteElement || !authorElement) return;

    // 1. Fetch all quotes from the shrine
    const { data: quotes, error } = await supabase
        .from('quotes')
        .select('text, author');

    if (error || !quotes.length) return;

    // 2. Random pick so each refresh/entry can show a different wisdom.
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const todayQuote = quotes[randomIndex];

    // 3. Apply to UI with a soft fade
    quoteElement.style.opacity = 0;
    setTimeout(() => {
        quoteElement.textContent = `"${todayQuote.text}"`;
        authorElement.textContent = `— ${todayQuote.author}`;
        quoteElement.style.opacity = 1;
    }, 500);
}

// Call this when the Homepage loads
loadQuoteOfTheDay();
