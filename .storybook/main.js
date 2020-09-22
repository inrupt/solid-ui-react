module.exports = {
  stories: [
    '../stories/**/*.stories.@(tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-storysource'
  ],
  webpackFinal: async config => {
    return config;
  },
};
