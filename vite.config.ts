import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import * as dotenv from "dotenv";
import postCssConfig from "./postcss.config";
import svgr from "vite-plugin-svgr";
import mdx from "@mdx-js/rollup";
import macrosPlugin from "vite-plugin-babel-macros";

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
    plugins: [
      { enforce: "pre", ...mdx() },
      react(/*{ include: /\.(mdx|js|jsx|ts|tsx)$/ }*/),
      macrosPlugin(),
      svgr(),
      /*{
        name: "markdown-loader",
        transform(code, id) {
          if (id.slice(-3) === ".md") {
            // For .md files, get the raw content
            return `export default ${JSON.stringify(code)};`;
          }
        }
      }*/
    ],
    publicDir: "./static",
    assetsInclude: ["**/*.md"],
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
