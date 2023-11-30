import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync } from 'fs';
import * as dotenv from 'dotenv';


// https://vitejs.dev/config/

export default ({ mode }: any) => {
  process.env = loadEnv(mode, process.cwd(), ''); // <-- #sec-sensitive do not expose to compiled app
  const appEnv = existsSync(".env.local") ? dotenv.parse(readFileSync(".env.local", { encoding: 'utf8' })) : {}; // <-- .env only

  return defineConfig({
    plugins: [react()],
    define: {
      global: 'globalThis',
      version: JSON.stringify(process.env.npm_package_version),
      'process.env': appEnv,
    },
  });
};
