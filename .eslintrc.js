/* eslint-disable license-header/header */

module.exports = {
  root: true,
  plugins: ["license-header", "@typescript-eslint", "jest", "react", "jsx-a11y"],
  // TODO: 
  // extends: ["@inrupt/eslint-config-react"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
  ],
  parser: "@typescript-eslint/parser",
  rules: {
    "@typescript-eslint/ban-ts-comment": 0,
    "license-header/header": [1, "./resources/license-header.js"],
    "no-use-before-define": [0],
    "@typescript-eslint/no-use-before-define": [1],
    "no-unused-vars": [0]

    // "prettier/prettier": [
    //   "error",
    //   { endOfLine: "auto" },
    // ],
  },
}
