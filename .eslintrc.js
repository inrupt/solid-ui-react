module.exports = {
  root: true,
  plugins: ["license-header"],
  extends: ["@inrupt/eslint-config-react"],
  rules: {
    "@typescript-eslint/ban-ts-comment": 0,
    "license-header/header": [1, "./resources/license-header.js"],
    "no-use-before-define": [0],
    "@typescript-eslint/no-use-before-define": [1],

    "prettier/prettier": [
      "error",
      { endOfLine: "auto" },
    ],
  },
}
