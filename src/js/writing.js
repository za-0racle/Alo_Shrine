import { articles } from "../data/articles.js";
import { icons } from "./components.js";
const grid = document.querySelector("#article-grid");
const formatDate = (date) =>
  new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
if (grid)
  grid.innerHTML = articles
    .map((article) => {
      const publication = article.publication
        ? `<span>${article.publication}</span>`
        : "";
      const externalAttributes = article.url?.startsWith("http")
        ? 'target="_blank" rel="noopener noreferrer"'
        : "";
      const thumbnail = article.image
        ? `<a class="article-thumbnail" href="${article.url}" ${externalAttributes} tabindex="-1" aria-hidden="true"><img src="${article.image}" alt="${article.imageAlt || ""}" width="1536" height="1024" loading="lazy"></a>`
        : `<div class="article-icon">${icons.article}</div>`;
      return `<article class="article-card ${article.featured ? "article-featured" : ""} reveal is-visible">${thumbnail}<div class="article-meta"><span>${article.category}</span>${publication}<time datetime="${article.date}">${formatDate(article.date)}</time><span>${article.readTime}</span></div><h2>${article.title}</h2><p>${article.excerpt}</p><a class="text-link" href="${article.url}" ${externalAttributes}>Read article &nearr;</a></article>`;
    })
    .join("");
