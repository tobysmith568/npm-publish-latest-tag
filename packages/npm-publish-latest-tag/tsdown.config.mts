import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: "esm",
  platform: "node",
  dts: true,
  // package.json already says "type": "module", so there's no need for the unambiguous .mjs
  // extension tsdown defaults to on the node platform.
  fixedExtension: false,
  clean: true
});
