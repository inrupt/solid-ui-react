module.exports = {
  root: true,
  extends: [
    "@inrupt/eslint-config-react",
    "@inrupt/eslint-config-lib",
    "plugin:storybook/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".tsx"],
      },
    ],
    "import/no-unresolved": "off",
    "no-shadow": "warn",
    "react/require-default-props": "warn",
    "react/default-props-match-prop-types": "warn",
    noImplicitAny: "off",
  },
};
