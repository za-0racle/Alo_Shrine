import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        stories: resolve(__dirname, "stories.html"),
        poems: resolve(__dirname, "poems.html"),
        essays: resolve(__dirname, "essays.html"),
        comics: resolve(__dirname, "comics.html"),
        aiStories: resolve(__dirname, "ai-stories.html"),
      },
    },
  },
});
