const { composePlugins, withNx } = require('@nx/webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Add TsconfigPathsPlugin to handle path aliases
  if (config.resolve.plugins) {
    config.resolve.plugins.push(
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.app.json'),
      }),
    );
  } else {
    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.app.json'),
      }),
    ];
  }

  // Add path aliases
  config.resolve.alias = {
    ...config.resolve.alias,
    '@lib/shared': path.resolve(__dirname, '../../libs/shared/src'),
    '@app/shared': path.resolve(__dirname, '../../libs/shared/src'),
  };

  return config;
});
