import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const buildId = Date.now().toString();
const serviceWorkerFileName = `sw-${buildId}.js`;
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      filename: serviceWorkerFileName,
      injectRegister: "inline",
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        globIgnores: ["**/index.html", "**/*.apk"],
        navigateFallback: null,
        skipWaiting: true,
        // API navigation requests must reach Nginx instead of receiving the
        // PWA app shell from Workbox's navigation fallback.
        navigateFallbackDenylist: [
          /^\/api\//,
          /^\/oauth\/redirect\/catch/,
          /^\/open\//,
        ],
      },
      manifest: {
        name: "Food detector",
        short_name: "Food detector",
        description: "Personal Food detector",
        theme_color: "#0d1431",
        background_color: "#0d1431",
        display: "standalone",
        icons: [
          {
            src: "/icon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
  },
});
