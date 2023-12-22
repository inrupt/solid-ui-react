module.exports = {
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },

  staticDirs: ["../public"],
  stories: ["../stories/**/*.stories.@(tsx|mdx)"],

  addons: [{
    name: '@storybook/addon-essentials',
    // https://github.com/storybookjs/storybook/issues/17996#issuecomment-1134810729
    options: {
      'actions': false,
    }
  }, {
    name: "@storybook/addon-storysource",
    options: {
      sourceLoaderOptions: {
        injectStoryParameters: false,
      },
    },
  }, "@storybook/addon-mdx-gfm"],

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

  docs: {
    autodocs: true
  }
};
