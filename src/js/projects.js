import { projects } from "../data/projects.js";
import { placeholderVisual, tags } from "./components.js";

const grid = document.querySelector("#project-grid");
const filters = document.querySelector("#project-filters");
const categories = ["All", "Web Development", "Data & Analytics", "Robotics", "IoT", "Education", "Creative Technology", "Business Solutions"];

function render(category = "All") {
  const filtered = category === "All" ? projects : projects.filter((project) => project.category === category);
  const limit = Number(grid?.dataset.limit || 0);
  const visible = limit ? filtered.slice(0, limit) : filtered;
  if (!grid) return;
  grid.innerHTML = visible.map((project) => { const index = projects.indexOf(project); const visual = project.image ? `<div class="project-image"><img src="${project.image}" alt="${project.imageAlt || `${project.title} project preview`}" width="1440" height="900" loading="lazy"></div>` : placeholderVisual(project.title, index); const liveLink = project.liveUrl ? `<a class="project-live-link" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Visit live website <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>` : ""; return `<article class="project-card reveal is-visible">${visual}<div class="project-body"><div class="project-meta"><span>${project.category}</span><span>${project.status}</span></div><h3>${project.title}</h3><p>${project.description}</p>${tags(project.technologies)}<div class="project-actions">${liveLink}<button class="text-link project-details" type="button" aria-expanded="false">View details <span>↗</span></button></div><div class="project-more" hidden><p>More project documentation and verified links will be added when available.</p></div></div></article>`; }).join("");
  grid.querySelectorAll(".project-details").forEach((button) => button.addEventListener("click", () => { const details = button.closest(".project-body")?.querySelector(".project-more"); if (!details) return; const open = button.getAttribute("aria-expanded") === "true"; button.setAttribute("aria-expanded", String(!open)); details.hidden = open; button.firstChild.textContent = open ? "View details " : "Hide details "; }));
}

if (filters) { filters.innerHTML = categories.map((category, i) => `<button type="button" class="filter-button ${i === 0 ? "active" : ""}" data-category="${category}">${category}</button>`).join(""); filters.addEventListener("click", (event) => { const button = event.target.closest("button"); if (!button) return; filters.querySelectorAll("button").forEach((item) => item.classList.remove("active")); button.classList.add("active"); render(button.dataset.category); }); }
render();
