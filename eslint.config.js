import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  { ignores: ["coverage/"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      eqeqeq: "error",
      "no-param-reassign": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      "prefer-template": "error",
    },
  },
  {
    files: ["**/*.test.js"],
    ...vitest.configs.recommended,
  },
  {
    files: ["*.config.js"],
    languageOptions: { globals: globals.node },
  },
  prettier,
];
