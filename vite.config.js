// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/micro-encabulator-site/", // <-- use your repo name here, with slashes
});
