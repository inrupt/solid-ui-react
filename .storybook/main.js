module.exports = {
  stories: [
    '../stories/**/*.stories.tsx'
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/preset-typescript'
  ],
  webpackFinal: async config => {
    return config;
  },
};
