import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "inline",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: false,
    }),
  ],
});
