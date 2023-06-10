import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: path.resolve(__dirname, "src"),
      },
    ],
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: "index.html",
    },
    outDir: ".stormkit/public",
  },
  define: {
    "process.env.MAILER_FROM_ADDR": JSON.stringify(
      process.env.MAILER_FROM_ADDR
    ),
  },
  plugins: [react()],
});
