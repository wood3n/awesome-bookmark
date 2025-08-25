import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";

export default defineConfig({
  plugins: [pluginReact(), pluginSvgr()],
  html: {
    template: "./src/index.html"
  },
  output: {
    filename: {
      js: "[name].[contenthash:8].js",
      css: "[name].[contenthash:8].css",
      svg: "[name].[contenthash:8].svg",
      font: "[name].[contenthash:8][ext]",
      image: "[name].[contenthash:8][ext]",
      media: "[name].[contenthash:8][ext]"
    },
    copy: process.env.NODE_ENV === "development" ? [{ from: "./public", to: "" }] : [],
    sourceMap: {
      js: "inline-source-map"
    }
  },
  dev: {
    hmr: true,
    writeToDisk: true,
    progressBar: false
  },
  server: {
    port: 3456,
    open: false,
    publicDir: {
      watch: true
    }
  }
});
