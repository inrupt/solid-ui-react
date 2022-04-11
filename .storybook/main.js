module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../stories/**/*.stories.@(tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-storysource",
      options: {
        sourceLoaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
    /* @storybook/addon-docs is part of @storybook/addon-essentials, but
     * this is required to fix an issue with code not showing for any
     * stories without parameters */
    {
      name: "@storybook/addon-docs",
      options: {
        sourceLoaderOptions: null,
      },
    },
  ],
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
  webpackFinal: async (config) => {
    return config;
  },
};
