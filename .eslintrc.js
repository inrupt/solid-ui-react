module.exports = {
  root: true,
  plugins: ["license-header"],
  extends: ["@inrupt/eslint-config-react"],
  rules: {
    "@typescript-eslint/ban-ts-comment": 0,
    "license-header/header": [1, "./resources/license-header.js"],
  },
}
