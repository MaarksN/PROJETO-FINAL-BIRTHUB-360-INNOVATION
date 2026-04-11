// @ts-nocheck
// 
import js from "@eslint/js";
import tseslint from "typescript-eslint";

const sourceGlobs = ["**/*.{ts,tsx}"];
const ignored = [
  "**/.next/**",
  "**/.pytest_cache/**",
  "**/.tools/**",
  "**/artifacts/**",
  "**/audit/**",
  "**/dist/**",
  "**/coverage/**",
  "**/logs/**",
  "**/node_modules/**",
  "**/test-results/**",
  "**/*.cjs",
  "**/*.mjs",
  "**/*.js",
  "**/*.d.ts"
];

export default tseslint.config(
  {
    ignores: ignored
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: sourceGlobs,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false
        }
      ],
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/require-await": "warn",
      "max-lines": ["warn", { "max": 500, "skipBlankLines": true, "skipComments": true }],
      "complexity": ["warn", 20],
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["@birthub/db", "@birthub/db/*"],
              "message": "Importing from @birthub/db is prohibited without formal exception."
            }
          ]
        }
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "max-lines": ["error", 500],
      "complexity": ["error", 20]
    }
  }
);
