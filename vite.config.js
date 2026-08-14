import { defineConfig } from "vite";
import { resolve } from "node:path";

const pages = [
  "index",
  "about",
  "experience",
  "skills",
  "projects",
  "oracle-tek",
  "education",
  "data-analytics",
  "writing",
  "contact",
  "404",
];

export default defineConfig({
  build: {
    target: "es2018",
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(__dirname, `${page}.html`)]),
      ),
    },
  },
});
