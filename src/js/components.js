import { profile } from "../data/profile.js";
import { socialLinks } from "../data/social-links.js";

const nav = [
  ["Home", "/"],
  ["About", "/about.html"],
  ["Projects", "/projects.html"],
  ["Oracle TEK", "/oracle-tek.html"],
  ["Writing", "/writing.html"],
];
const svg = (paths) =>
  `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
export const icons = {
  code: svg(
    '<path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  ),
  chart: svg(
    '<path d="M4 19V9m6 10V5m6 14v-7m4 7H2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  ),
  education: svg(
    '<path d="m3 9 9-5 9 5-9 5-9-5Zm3 2v5c3 2.7 9 2.7 12 0v-5" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  ),
  article: svg(
    '<path d="M6 3h9l4 4v14H6V3Zm9 0v5h4M9 12h7M9 16h7" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  ),
  whatsapp: svg(
    '<path fill="currentColor" d="M12 2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.5l5-1.3A9.8 9.8 0 1 0 12 2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.7Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2 0-.4-.1-.6.2l-.8 1c-.1.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.4-3-.2-.3 0-.5.1-.6l.5-.5.3-.5c.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.2.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.2-.3-.2-.7-.4Z"/>',
  ),
  substack: svg(
    '<path fill="currentColor" d="M4 4h16v2H4V4Zm0 4h16v2H4V8Zm0 4h16v2H4v-2Zm1 4h14v2l-7 4-7-4v-2Z"/>',
  ),
};
const technologyLogos = {
  html: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  css: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  javascript: "/javascript.png",
  python:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  mysql:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  sql: "/sql.jfif",
  "power bi": "/power bi.jfif",
  rstudio:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rstudio/rstudio-original.svg",
  arduino:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/arduino/arduino-original.svg",
};

export const techIcon = (name) => {
  const key = name.toLowerCase();
  const match = Object.entries(technologyLogos).find(([token]) =>
    key.includes(token),
  );
  if (match)
    return `<span class="tech-logo" aria-hidden="true"><img src="${match[1]}" alt="" loading="lazy"></span>`;
  return `<span class="tech-logo generic-logo" aria-hidden="true">${name.slice(0, 2).toUpperCase()}</span>`;
};

export function renderHeader() {
  const path = window.location.pathname;
  return `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="container nav-shell">
        <a class="brand" href="/" aria-label="Khaleed O. Adedokun home">
          <span class="brand-mark"><img src="/images/brand/oracle-tek-mark.png" alt="" width="38" height="38"></span>
          <span><strong>${profile.name}</strong><small>${profile.identity}</small></span>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
          <span aria-hidden="true">&#9776;</span><span class="sr-only">Open menu</span>
        </button>
        <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
          ${nav.map(([label, href]) => `<a href="${href}" ${path === href || (href === "/" && path.endsWith("index.html")) ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
          <a class="button button-small" href="/contact.html">Let's Talk</a>
        </nav>
        <button class="theme-toggle" type="button" aria-label="Switch to light theme" title="Change theme">
          <span aria-hidden="true">&#9728;</span>
        </button>
      </div>
    </header>`;
}
export function renderFooter() {
  const socialIcons = {
    LinkedIn:
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg",
    X: "https://cdn.simpleicons.org/x/ffffff",
    WhatsApp: "https://cdn.simpleicons.org/whatsapp/25D366",
    Substack: "https://cdn.simpleicons.org/substack/FF6719",
  };
  const footerSocials = ["X", "Substack", "LinkedIn", "WhatsApp"];
  const socials = socialLinks
    .filter((item) => footerSocials.includes(item.label))
    .sort(
      (first, second) =>
        footerSocials.indexOf(first.label) -
        footerSocials.indexOf(second.label),
    )
    .map((item) => {
      const content = `<img src="${socialIcons[item.label]}" alt="" width="22" height="22" loading="lazy"><span class="sr-only">${item.label}</span>`;
      return item.url
        ? `<a class="footer-social" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="${item.label}">${content}</a>`
        : "";
    })
    .join("");

  return `<footer class="site-footer"><div class="container footer-grid"><div><a class="brand footer-brand" href="/"><span class="brand-mark"><img src="/images/brand/oracle-tek-mark.png" alt="" width="38" height="38"></span><span><strong>${profile.name}</strong><small>${profile.identity}</small></span></a><p>Computer engineering, data insight and practical technology education.</p></div><div><h2>Explore</h2><div class="footer-links"><a href="/about.html">About</a><a href="/projects.html">Projects</a><a href="/writing.html">Writing</a></div></div><div><h2>Business</h2><p>Oracle TEK Global Solutions</p><a class="text-link" href="/oracle-tek.html">Explore services &rarr;</a></div><div><h2>Connect</h2><div class="footer-socials">${socials}</div><a class="text-link" href="/writing.html">Read my writing &rarr;</a></div></div><div class="container footer-bottom"><span>&copy; 2026 ${profile.name}. All rights reserved.</span><span>${profile.message}</span></div></footer>`;
}
export function renderFloatingActions() {
  const whatsapp = socialLinks.find((item) => item.label === "WhatsApp")?.url;
  return `<aside class="floating-actions" aria-label="Quick contact"><a class="floating-action whatsapp" href="${whatsapp || "/contact.html"}" ${whatsapp ? 'target="_blank" rel="noopener noreferrer"' : ""} aria-label="${whatsapp ? "Chat on WhatsApp" : "Contact me to chat on WhatsApp"}">${icons.whatsapp}</a></aside>`;
}
export const sectionHeading = (eyebrow, title, text = "") =>
  `<div class="section-heading reveal"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ""}</div>`;
export const tags = (items) =>
  `<div class="tags">${items.map((item) => `<span>${item}</span>`).join("")}</div>`;
export const projectGraphic = (label, index = 0) =>
  `<div class="project-visual visual-${index % 4}" role="img" aria-label="Graphic for ${label}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${label}</strong><i aria-hidden="true"></i></div>`;
