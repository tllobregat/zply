import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-nested-ternary": "error",
      "@typescript-eslint/no-inferrable-types": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/explicit-member-accessibility": "error"
    }
  },
  {
    files: ["app/**/page.tsx"],
    rules: {
      "no-restricted-imports": "off"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".gemini/**",
    "out/**",
    "build/**",
    "public/**",
    "next-env.d.ts",
    "postcss.config.mjs",
    "eslint.config.mjs",
  ]),
]);

export default eslintConfig;
