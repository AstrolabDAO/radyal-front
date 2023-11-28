import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { existsSync, readFileSync } from "fs";
import * as dotenv from "dotenv";

const envPath = ".env";

export default ({ mode }: any) => {
  process.env = loadEnv(mode, process.cwd(), ""); // <-- #sec-sensitive do not expose to compiled app
  const appEnv = existsSync(envPath)
    ? dotenv.parse(readFileSync(envPath, { encoding: "utf8" }))
    : {}; // <-- .env only
  return defineConfig({
    plugins: [react()],
    define: {
      global: "globalThis",
      __version__: JSON.stringify(process.env.npm_package_version),
      "process.env": appEnv,
    },
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
        // '@lib': path.resolve(__dirname, '../lib'),
        vue: "vue/dist/vue.esm-bundler.js",
      },
    },
  });
};
// https://vitejs.dev/config/
