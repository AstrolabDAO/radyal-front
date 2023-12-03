import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
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
      alias: [{ find: "~", replacement: resolve(__dirname, "./src") }]
    },
  });
};
