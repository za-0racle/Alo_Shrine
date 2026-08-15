import {
  renderHeader,
  renderFooter,
  renderFloatingActions,
  icons,
} from "./components.js";

document
  .querySelector("#site-header")
  ?.replaceChildren(
    document.createRange().createContextualFragment(renderHeader()),
  );
document
  .querySelector("#site-footer")
  ?.replaceChildren(
    document.createRange().createContextualFragment(renderFooter()),
  );
document.body.append(
  document.createRange().createContextualFragment(renderFloatingActions()),
);
document.querySelectorAll("[data-icon]").forEach((element) => {
  element.innerHTML = icons[element.dataset.icon] || icons.code;
});

const root = document.documentElement;
const savedTheme = localStorage.getItem("khaleed-theme");
if (savedTheme) root.dataset.theme = savedTheme;
const themeButton = document.querySelector(".theme-toggle");
const syncTheme = () => {
  const light = root.dataset.theme === "light";
  if (themeButton) {
    themeButton.setAttribute(
      "aria-label",
      `Switch to ${light ? "dark" : "light"} theme`,
    );
    themeButton.querySelector("span").textContent = light ? "☾" : "☀";
  }
};
syncTheme();
themeButton?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("khaleed-theme", root.dataset.theme);
  syncTheme();
});

const menu = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
menu?.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") === "true";
  menu.setAttribute("aria-expanded", String(!open));
  menu.querySelector("span").textContent = open ? "☰" : "×";
  navigation?.classList.toggle("is-open", !open);
});
navigation?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menu?.setAttribute("aria-expanded", "false");
    navigation?.classList.remove("is-open");
  }
});

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.1 },
);
document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  observer.observe(item);
});

const header = document.querySelector(".site-header");
const syncHeader = () =>
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

document.querySelector("#contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Website enquiry: ${data.get("service")}`);
  const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || "Not provided"}\nService: ${data.get("service")}\n\n${data.get("message")}`);
  window.location.href = `mailto:adedokunkhaleed@gmail.com?subject=${subject}&body=${body}`;
  const note = document.querySelector("#form-note");
  if (note)
    note.textContent =
      "Your email app has been opened with the enquiry details.";
});
