module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["../tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    quotes: ["error", "double"],
    indent: ["off", 2],
    "operator-linebreak": [
      1,
      "after",
      {
        overrides: {
          "?": "ignore",
          ":": "ignore",
        },
      },
    ],
    "quote-props": [
      "error",
      "as-needed",
      { numbers: true, unnecessary: false },
    ],
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "max-len": ["error", { code: 120 }],
    "no-unused-vars": "off",
    "no-inner-declarations": "off",
    "@typescript-eslint/no-unused-vars": ["off"],
    "@typescript-eslint/no-explicit-any": "off",
    "prefer-promise-reject-errors": "off",
    "require-jsdoc": 0,
    "new-cap": 0,
    "@typescript-eslint/ban-ts-comment": "off",
    "object-curly-spacing": "off",
  },
};
