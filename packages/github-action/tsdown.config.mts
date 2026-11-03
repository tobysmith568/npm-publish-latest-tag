import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { action: "src/index.ts" },
  // A GitHub Action runs a single file with no node_modules next to it, so everything is
  // bundled in. The runtime is CommonJS-compatible Node, hence cjs rather than the esm used
  // by the library.
  format: "cjs",
  platform: "node",
  target: "node24",
  dts: false,
  minify: true,
  fixedExtension: true,
  deps: { alwaysBundle: [/.*/], onlyBundle: false },
  clean: true
});
