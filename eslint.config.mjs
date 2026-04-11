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
      "@typescript-eslint/explicit-member-accessibility": "error",
      "no-restricted-imports": ["error", {
        "patterns": [
          {
            "group": ["@/components/command-menu/*"],
            "message": "Please use the barrel file (index.ts) at the component folder root instead of importing the file directly."
          },
          {
            "group": [
              "@/components/ui/layout/*",
              "!@/components/ui/layout/sidebar"
            ],
            "message": "Please use the barrel file at '@/components/ui/layout' instead of importing the file directly. For sidebar components, use '@/components/ui/layout/sidebar'."
          },
          {
            "group": ["@/components/ui/layout/sidebar/*"],
            "message": "Please use the barrel file at '@/components/ui/layout/sidebar' instead of importing the file directly."
          }
        ]
      }]
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
