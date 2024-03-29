import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    chunkSizeWarningLimit:1500
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host:'0.0.0.0',
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
  plugins: [vue()],
  // 解決 await loadAsyncRoutes() 無法在方法前面加上await問題
  // build:{
  //   target:['edge90','chrome90','firefox90','safari15']
  // }
});
