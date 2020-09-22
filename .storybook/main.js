module.exports = {
  stories: [
    '../stories/**/*.stories.@(tsx|modx)',
  ],
  addons: [
    '@storybook/addon-essentials',
  ],
  webpackFinal: async config => {
    return config;
  },
};
