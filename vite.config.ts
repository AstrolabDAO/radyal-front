import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import * as dotenv from "dotenv";
import postCssConfig from "./postcss.config";
import svgr from "vite-plugin-svgr";
import Markdown from 'vite-plugin-md';


// import { PALETTE } from "./tailwind.config";

const envPath = ".env";

export default ({ mode }) => {
  process.env = loadEnv(mode, process.cwd(), ""); // <-- #sec-sensitive do not expose to compiled app
  const appEnv = existsSync(envPath)
    ? dotenv.parse(readFileSync(envPath, { encoding: "utf8" }))
    : {}; // <-- .env only

  return defineConfig({
    css: {
      postcss: {
        plugins: postCssConfig.plugins,
      },
    },
    plugins: [react(), svgr(), Markdown()],
    publicDir: "./static",
    define: {
      global: "globalThis",
      __version__: JSON.stringify(process.env.npm_package_version),
      "process.env": appEnv,
      // COLORS_PALETTE: PALETTE,
    },
    resolve: {
      alias: [
        { find: "@/static", replacement: resolve(__dirname, "./static") },
        { find: "~", replacement: resolve(__dirname, "./src") },
        { find: "@", replacement: resolve(__dirname, "./src") },
      ],
    },
  });
};
