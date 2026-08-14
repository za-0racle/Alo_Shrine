import { profile } from "../data/profile.js";
import { socialLinks } from "../data/social-links.js";

const nav = [
  ["Home", "/"], ["About", "/about.html"], ["Experience", "/experience.html"], ["Skills", "/skills.html"],
  ["Projects", "/projects.html"], ["Oracle TEK", "/oracle-tek.html"], ["Education", "/education.html"], ["Data", "/data-analytics.html"], ["Contact", "/contact.html"],
];

export const icon = (name) => ({ arrow: "↗", sun: "☀", menu: "☰", close: "×" }[name] || "◇");

export function renderHeader() {
  const path = window.location.pathname;
  return `<a class="skip-link" href="#main-content">Skip to content</a><header class="site-header"><div class="container nav-shell">
    <a class="brand" href="/" aria-label="Khaleed Adedokun home"><span class="brand-mark"><img src="/images/brand/oracle-tek-mark.png" alt="" width="38" height="38"></span><span><strong>Khaleed Adedokun</strong><small>Oracle du Kakanfo</small></span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav"><span aria-hidden="true">☰</span><span class="sr-only">Open menu</span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">${nav.map(([label, href]) => `<a href="${href}" ${path === href || (href === "/" && path.endsWith("index.html")) ? 'aria-current="page"' : ""}>${label}</a>`).join("")}<a class="button button-small" href="/contact.html">Work With Me</a></nav>
    <button class="theme-toggle" type="button" aria-label="Switch to light theme" title="Change theme"><span aria-hidden="true">☀</span></button>
  </div></header>`;
}

export function renderFooter() {
  const activeSocials = socialLinks.filter((item) => item.url);
  return `<footer class="site-footer"><div class="container footer-grid"><div><a class="brand footer-brand" href="/"><span class="brand-mark"><img src="/images/brand/oracle-tek-mark.png" alt="" width="38" height="38"></span><span><strong>${profile.name}</strong><small>${profile.identity}</small></span></a><p>A technology professional building digital solutions, working with data and teaching technology.</p></div><div><h2>Explore</h2><div class="footer-links"><a href="/about.html">About</a><a href="/projects.html">Projects</a><a href="/education.html">Education</a><a href="/data-analytics.html">Data</a></div></div><div><h2>Business</h2><p>Oracle TEK Global Solutions</p><a class="text-link" href="/oracle-tek.html">Explore services →</a></div><div><h2>Connect</h2>${activeSocials.length ? activeSocials.map((item) => `<a href="${item.url}">${item.label}</a>`).join("") : '<p class="muted">Social links coming soon.</p>'}<a class="text-link" href="/contact.html">Contact Khaleed →</a></div></div><div class="container footer-bottom"><span>© 2026 Khaleed Adedokun. All rights reserved.</span><span>Build. Teach. Solve.</span></div></footer>`;
}

export const sectionHeading = (eyebrow, title, text = "") => `<div class="section-heading reveal"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
export const tags = (items) => `<div class="tags">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;
export const placeholderVisual = (label, index = 0) => `<div class="project-visual visual-${index % 4}" role="img" aria-label="Placeholder for ${label} project image"><span>${String(index + 1).padStart(2, "0")}</span><strong>${label}</strong><i aria-hidden="true"></i></div>`;
