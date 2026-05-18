// Imports: app services used by the UI.
import { oracleActions } from "./admin";
import { authActions } from "./auth";
import { supabase } from "../Lib/supabaseClient.js";

// Core page elements.
const enterBtn = document.querySelector("#enter-btn");
const hero = document.querySelector("#hero");
const content = document.querySelector("#shrine-content");
const storyGrid = document.querySelector("#story-grid");

// Auth modal elements.
const authModal = document.querySelector("#auth-modal");
const authForm = document.querySelector("#auth-form");
const authEmail = document.querySelector("#auth-email");
const authPassword = document.querySelector("#auth-password");
const authFullName = document.querySelector("#auth-fullname");
const nameField = document.querySelector("#name-field");
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
const publicNavLinks = document.querySelectorAll('.nav-links a[href^="#"]:not(#nav-dashboard):not(#nav-admin-link)');
const dashboardView = document.querySelector("#dashboard-view");
const adminView = document.querySelector("#admin-view");
const readerView = document.querySelector("#reader-view");
const logoutWriterBtn = document.querySelector("#logout-writer");
const exitOracleBtn = document.querySelector("#exit-oracle");
const oracleContentList = document.querySelector("#oracle-content-list");
const stageCount = document.querySelector("#stage-count");
const publicViews = document.querySelectorAll(".public-view");
const writerPostsGrid = document.querySelector("#writer-posts-grid");

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

// First series broken out from MY YELLOW BUS GIST chapter headings.
const starterSeriesEpisodes = [
  {
    id: "yellow-bus-1",
    type: "story",
    title: "IN THE BEGINNING",
    series_title: "MY YELLOW BUS GIST",
    episode_title: "IN THE BEGINNING",
    episode_number: 1,
    release_cadence: "weekly",
    authorName: "Alo Shrine",
    content:
      "The sun hung lazily in the sky, casting a dusty golden hue over Sango Toll Gate. The air smelled of exhaust fumes, roasted plantain, and impatience. Hawkers weaved through the traffic, their voices merging into an indistinct chorus of desperation and salesmanship. Amidst the commotion, he stood at the edge of the road, gripping his worn-out backpack, waiting for the next available danfo.",
  },
  {
    id: "yellow-bus-2",
    type: "story",
    title: "TENSION IN THE AIR",
    series_title: "MY YELLOW BUS GIST",
    episode_title: "TENSION IN THE AIR",
    episode_number: 2,
    release_cadence: "weekly",
    authorName: "Alo Shrine",
    content:
      "The bus rocked forward, jolting the passengers as the driver swerved through the relentless Lagos traffic. The political argument had reached a fever pitch, voices clashing and overlapping like a chaotic symphony. The man in the faded vintage shirt was still shaking his head, muttering about the outrageous fare, while the bespectacled man had resorted to slapping his newspaper against his palm for emphasis.",
  },
  {
    id: "yellow-bus-3",
    type: "story",
    title: "CHAOSON THE ROAD",
    series_title: "MY YELLOW BUS GIST",
    episode_title: "CHAOSON THE ROAD",
    episode_number: 3,
    release_cadence: "weekly",
    authorName: "Alo Shrine",
    content:
      "Just when the bus seemed to be settling into an uneasy silence again, with everyone nursing their thoughts and warily eyeing their neighbors, another moment of madness arrived. The danfo wobbled slightly as the driver swerved to avoid a keke that had cut into his lane without warning.",
  },
  {
    id: "yellow-bus-4",
    type: "story",
    title: "MONEY IN THE MIX",
    series_title: "MY YELLOW BUS GIST",
    episode_title: "MONEY IN THE MIX",
    episode_number: 4,
    release_cadence: "weekly",
    authorName: "Alo Shrine",
    content:
      "The danfo had barely steadied from its last wave of chaos when the bus jerked to a stop at Ikeja Along. A few passengers sighed in relief, shuffled their way off, and vanished into the crowd outside. With new faces came new energy, and one of the new entrants settled beside Tobi, grinning like someone with a secret.",
  },
];

let isSignUpMode = true;
let currentEditingPostId = null;
let currentEditingPostWasSeries = false;

const getStoryFormat = (post = null) =>
  post?.story_format || (post?.series_title ? "series" : "standalone");

const getActiveStoryFormat = () =>
  document.querySelector('input[name="story-format"]:checked')?.value || "standalone";

const setActiveStoryFormat = (format) => {
  storyFormatInputs.forEach((input) => {
    input.checked = input.value === format;
  });
  seriesFields.classList.toggle("hidden", format !== "series");
};

const getSeriesLabel = (post) => {
  if (getStoryFormat(post) !== "series") return post.type || "story";

  const number = post.episode_number ? `Episode ${post.episode_number}` : "Episode";
  return `${post.series_title || "Untitled series"} - ${number}`;
};

const getDisplayTitle = (post) => post.episode_title || post.title || "Untitled offering";

const isAdminUser = (user) => {
  const role = user?.profile?.role || user?.user_metadata?.role || user?.app_metadata?.role;

  return Boolean(user?.profile?.is_admin || user?.user_metadata?.is_admin || user?.app_metadata?.is_admin || ["admin", "oracle"].includes(role));
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
  const { data: posts = [], error } = await supabase
    .from("posts")
    .select("*")
    .in("status", ["published", "featured"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public offerings:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return starterSeriesEpisodes;
  }

  if (!posts.length) return starterSeriesEpisodes;

  const profilesById = await getAuthorProfiles(posts);
  return posts.map((post) => ({
    ...post,
    authorName: profilesById.get(post.author_id)?.full_name || "Unknown scribe",
  }));
};

// Render published public offerings without the old placeholder cards.
const renderFeaturedStories = async () => {
  const offerings = await getPublicOfferings();
  storyGrid.innerHTML = "";

  if (!offerings.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No published offerings yet.";
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

// Switch between public shrine pages, private dashboard, reader, and admin.
const showView = async (viewName, targetSelector = "#home") => {
  const showingDashboard = viewName === "dashboard";
  const showingAdmin = viewName === "admin";

  publicViews.forEach((view) => view.classList.toggle("hidden", showingDashboard || showingAdmin));
  dashboardView.classList.toggle("hidden", !showingDashboard);
  adminView.classList.toggle("hidden", !showingAdmin);
  readerView?.classList.add("hidden");
  document.body.classList.remove("focus-mode");
  document.body.style.overflow = "auto";

  if (showingDashboard) {
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
  authFullName.required = isSignUpMode;
  authTitle.textContent = isSignUpMode ? "Enter the Circle" : "Welcome Back";
  authSubtitle.textContent = isSignUpMode ? "Become a Keeper of Ink" : "Return to the Shrine";
  authSubmit.textContent = isSignUpMode ? "Begin Journey" : "Step Inside";
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

// Load profile and post data for the logged-in writer.
async function loadWriterDashboard() {
  const user = await authActions.getCurrentUser();

  if (!user) {
    openAuthModal();
    return;
  }

  document.querySelector("#writer-name").textContent =
    user.profile?.full_name || user.user_metadata?.full_name || user.email;
  document.querySelector("#writer-level").textContent = user.profile?.writer_level || "Novice Scribe";

  const { data: posts = [], error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  renderWriterPosts(posts);
  document.querySelector("#stat-works").textContent = posts.length;
  document.querySelector("#stat-likes").textContent = posts.reduce(
    (total, post) => total + (post.likes_count || post.likes || 0),
    0,
  );
}

// Show protected navigation once Supabase confirms a session.
async function initSession() {
  const user = await authActions.getCurrentUser();

  if (!user) return null;

  console.log("Current Role:", user.profile?.role);
  document.querySelectorAll(".auth-only").forEach((el) => el.classList.remove("hidden"));
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
  postType.value = post?.type || "story";
  postTitle.value = post?.title || "";
  setActiveStoryFormat(getStoryFormat(post));
  seriesTitle.value = post?.series_title || "";
  episodeTitle.value = post?.episode_title || "";
  episodeNumber.value = post?.episode_number || "";
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

  resetEditor(post);
  editorView.classList.remove("hidden");
  document.body.style.overflow = "hidden";
};

const closeEditor = () => {
  editorView.classList.add("hidden");
  document.body.style.overflow = "auto";
};

// Save an offering as either a draft or a published post.
const saveOffering = async (status) => {
  const user = await authActions.getCurrentUser();

  if (!user) {
    alert("You must be part of the circle to offer a story.");
    openAuthModal();
    return;
  }

  const title = postTitle.value.trim();
  const contentValue = sanitizeRichContent(postContent.innerHTML);
  const type = postType.value;
  const storyFormat = getActiveStoryFormat();
  const seriesName = seriesTitle.value.trim();
  const episodeName = episodeTitle.value.trim();
  const episodeNo = Number.parseInt(episodeNumber.value, 10);
  const hasBody = postContent.textContent.trim() || postContent.querySelector("img, iframe");

  if (!title || !hasBody) {
    alert("Your offering cannot be empty.");
    return;
  }

  if (storyFormat === "series" && (!seriesName || !episodeName || !episodeNo)) {
    alert("Series episodes need a series title, episode number, and episode title.");
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
  };

  if (storyFormat === "series") {
    Object.assign(payload, {
      story_format: "series",
      series_title: seriesName,
      episode_title: episodeName,
      episode_number: episodeNo,
      release_cadence: releaseCadence.value,
    });
  } else if (currentEditingPostWasSeries) {
    Object.assign(payload, {
      story_format: "standalone",
      series_title: null,
      episode_title: null,
      episode_number: null,
      release_cadence: null,
    });
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
    if (["story_format", "series_title", "episode_title", "episode_number", "release_cadence"].some((field) => error.message?.includes(field))) {
      alert("Series support needs the new Supabase columns. Run the SQL in supabase-series-schema.sql, then try again.");
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

  try {
    if (isSignUpMode) {
      const { session } = await authActions.signUp(email, password, fullName);

      if (!session) {
        alert("The invitation has been sent to your email. Confirm to enter.");
        return;
      }

      closeAuthModal();
      await initSession();
      await showView("dashboard");
      return;
    }

    await authActions.signIn(email, password);
    closeAuthModal();
    const user = await initSession();

    if (isAdminUser(user)) {
      await showView("admin");
    } else {
      await showView("dashboard");
    }
  } catch (error) {
    alert(error.message);
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

publicNavLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showView("home", link.getAttribute("href"));
  });
});

exitOracleBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showView("dashboard");
});

logoutWriterBtn.addEventListener("click", async () => {
  await authActions.signOut();
});

goHome.addEventListener("click", (event) => {
  event.preventDefault();
  showView("home", "#home");
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

addCoverBtn.addEventListener("click", () => {
  const imageUrl = prompt("Paste a cover photo URL");
  if (!imageUrl || !isSafeImageUrl(imageUrl)) return;

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

// Initial page setup.
document.body.style.overflowY = "hidden";
renderFeaturedStories();
renderAuthMode();
initSession();


const getPostWithAuthorProfile = async (postId) => {
  const starterEpisode = starterSeriesEpisodes.find((episode) => episode.id === postId);
  if (starterEpisode) {
    return { post: { ...starterEpisode, profiles: { full_name: starterEpisode.authorName } }, error: null };
  }

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
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

function calculateReadingTime(content = "") {
  const words = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Open a published offering in the full-page reader.
async function openStory(postId) {
  const readerView = document.querySelector("#reader-view");
  if (!readerView) return;

  publicViews.forEach((view) => view.classList.add("hidden"));
  dashboardView.classList.add("hidden");
  adminView.classList.add("hidden");
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

  document.querySelector("#reader-title").textContent = post.title || "Untitled offering";
  document.querySelector("#reader-author").textContent = `By ${post.profiles?.full_name || "Unknown scribe"}`;
  document.querySelector("#reader-category").textContent = getSeriesLabel(post);
  document.querySelector("#reader-body").innerHTML = normalizeStoredContent(content);
  document.querySelector("#reading-time").textContent = `${calculateReadingTime(content)} min read`;
}

window.openStory = openStory;

// Focus Mode Toggle
document.querySelector("#toggle-focus")?.addEventListener("click", () => {
  document.body.classList.toggle("focus-mode");
});

// Exit Reader
document.querySelector("#exit-reader")?.addEventListener("click", () => {
  document.querySelector("#reader-view")?.classList.add("hidden");
  publicViews.forEach((view) => view.classList.remove("hidden"));
  document.body.classList.remove("focus-mode");
  scrollToSection("#home");
});
