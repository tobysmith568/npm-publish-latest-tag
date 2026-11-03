import recommended from "@tobysmith568/eslint-config";
import node from "@tobysmith568/eslint-config/node";
import prettier from "@tobysmith568/eslint-config/prettier";
import test from "@tobysmith568/eslint-config/test";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/coverage/**"]
  },
  recommended,
  node,
  { files: ["**/*.spec.ts"], extends: [test] },
  prettier
]);
