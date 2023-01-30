module.exports = {
  core: {
    builder: "webpack5",
  },
  framework: '@storybook/react',
  staticDirs: ["../public"],
  stories: ["../stories/**/*.stories.@(tsx|mdx)"],
  addons: [
    {
      name: '@storybook/addon-essentials',
      // https://github.com/storybookjs/storybook/issues/17996#issuecomment-1134810729
      options: {
        'actions': false,
      }
    },
    {
      name: "@storybook/addon-storysource",
      options: {
        sourceLoaderOptions: {
          injectStoryParameters: false,
        },
      },
    },
  ],
    features: {
    previewMdx2: true,
  },
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
