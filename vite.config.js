// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite Configuration
 *
 * Base URL Configuration:
 * - Development: base = "/" for local asset loading
 * - Production: base = "/micro-encabulator-site/" for GitHub Pages deployment
 *
 * Asset Handling:
 * - assetsInclude: ensures .gltf files are properly processed as assets
 * - sourcemap: enabled for debugging
 * - assetsDir: configures output directory for processed assets
 */
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/micro-encabulator-site/" : "/",
  assetsInclude: ["**/*.gltf"],
  build: {
    sourcemap: true,
    assetsDir: "assets",
  },
}));
