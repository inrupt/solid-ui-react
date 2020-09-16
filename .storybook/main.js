module.exports = {
  stories: [
    '../stories/**/*.stories.tsx'
  ],
  addons: [
    '@storybook/addon-essentials',
  ],
  webpackFinal: async config => {
    return config;
  },
};
