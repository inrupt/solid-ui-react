module.exports = {
  stories: [
    '../stories/**/*.stories.tsx'
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-knobs/',
    '@storybook/addon-links',
    '@storybook/addon-docs',
    '@storybook/addon-storysource',
  ],
  webpackFinal: async config => {
    return config;
  },
};
