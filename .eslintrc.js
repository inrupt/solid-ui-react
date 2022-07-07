require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "@inrupt/eslint-config-react",
    "@inrupt/eslint-config-lib",
    "plugin:storybook/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  settings: {
    // This is overridden currently by eslint-config-react:
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
      },
    },
  },
  env: {
    "jest/globals": false,
  },
  rules: {
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".tsx"],
      },
    ],
    "react/require-default-props": "warn",
    "react/default-props-match-prop-types": "warn",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: [
          "function-declaration",
          "function-expression",
          "arrow-function",
        ],
      },
    ],
    "no-shadow": [
      "error",
      {
        allow: ["fetch", "name"],
      },
    ],
  },
  overrides: [
    {
      files: ["src/**/*.test.tsx"],
      rules: {
        "react/jsx-no-constructed-context-values": "off",
      },
    },
    // These rules need to be disabled for storybook files:
    {
      files: ["stories/**/*"],
      rules: {
        "import/no-unresolved": "off",
        "react/no-unstable-nested-components": "off",
        "react/function-component-definition": "off",
        "no-shadow": "off",
        "no-console": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
