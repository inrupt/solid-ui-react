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
    "no-shadow": ["warn", { allow: ["fetch"] }],
    "react/require-default-props": "warn",
    "react/default-props-match-prop-types": "warn",
    "react/function-component-definition": "off",
    noImplicitAny: "off",
    // FIXME: re-enable the following
    "react/no-unstable-nested-components": "off",
    "react/jsx-no-bind": "off",
    "react/jsx-no-constructed-context-values": "off"
  },
};
