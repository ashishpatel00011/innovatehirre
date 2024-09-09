import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // Make sure the build output is in the "dist" folder
  },
  base: "/", // Set base path correctly for Vercel deployment
  preview: {
    port: 8080, // Port for Vite preview
  },
});
