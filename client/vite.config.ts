import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/worng-pdf/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "sync-dist-public",
      closeBundle() {
        try {
          const src = path.resolve(__dirname, "dist");
          const dest = path.resolve(__dirname, "../dist/public");
          fs.mkdirSync(dest, { recursive: true });
          fs.cpSync(src, dest, { recursive: true });
        } catch (_) {}
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
