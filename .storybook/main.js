module.exports = {
  stories: [
    '../stories/**/*.stories.(tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
  ],
  webpackFinal: async config => {
    return config;
  },
};
