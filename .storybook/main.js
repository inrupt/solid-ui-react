module.exports = {
  stories: [
    '../stories/**/*.stories.tsx'
  ],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs/register',
    '@storybook/preset-typescript',
    '@storybook/addon-storysource',
  ],
  webpackFinal: async config => {
    return config;
  },
};
