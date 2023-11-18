import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      // '@lib': path.resolve(__dirname, '../lib'),
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
});
