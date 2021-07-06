/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint. 
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "warn",
    // "@typescript-eslint/naming-convention": "error",
    // "@typescript-eslint/no-empty-function": "off",
    // "@typescript-eslint/no-require-imports": "error",
    // "@typescript-eslint/no-unused-expressions": "error",
    // "@typescript-eslint/no-use-before-define": "off",
    // "@typescript-eslint/no-var-requires": "error",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/quotes": [
      "error",
      "double",
      {
        avoidEscape: true,
      },
    ],
    // "@typescript-eslint/no-redeclare": ["error"],
    "@typescript-eslint/type-annotation-spacing": "error",
    // "no-empty": "off",
    // "no-empty-function": "off",
    // "no-redeclare": "off",
    // "no-trailing-spaces": "error",
    // "no-unused-expressions": "error",
    // "no-use-before-define": "off",
    // "no-var": "error",
    quotes: "error",
  },
};