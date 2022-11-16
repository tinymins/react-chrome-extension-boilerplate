/**
 * This file is part of react-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const chalk = require('chalk');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const merge = require('webpack-merge').merge;
const WebpackBar = require('webpackbar');

const config = require('./config');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');
const utils = require('./webpack/utils');

// https://webpack.js.org/configuration/stats/
const stats = utils.isProd
  ? {
    colors: true,
    entrypoints: false,
    modules: false,
    children: false,
  }
  : 'minimal';

let skipInstruction = false;

const notHotReload = new Set([
  'background-script',
  'content-script',
  'devtools-loader',
]);

/** @type {webpack.Configuration[]} */
const webpackConfigs = [{
  entry: {
    'background-script': utils.fullPath('src/scripts/background/index.ts'),
    'content-script': utils.fullPath('src/scripts/content/index.ts'),
    'devtools-loader': utils.fullPath('src/app/devtools-loader/index.ts'),
    'options-app': utils.fullPath('src/app/options/index.tsx'),
    'popup-app': utils.fullPath('src/app/popup/index.tsx'),
    'devtools-app': utils.fullPath('src/app/devtools/index.tsx'),
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: 'chunks/[name].[chunkhash:4].js',
    path: config.distPath,
    clean: true,
    publicPath: `${config.publicPath}/`,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.tx', '.json'],
    alias: {
      '@': utils.fullPath('src'),
      'react-dom': '@hot-loader/react-dom',
    },
    fallback: {
      path: require.resolve('path-browserify'),
      util: require.resolve('util/'),
    },
  },
  module: {
    rules: [
      ...loaders.scriptLoaders({ cache: !config.useESLint }),
      ...loaders.styleLoaders({ extract: true }),
      ...loaders.staticLoaders(),
    ],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      // It's recommended to set cache.buildDependencies.config: [__filename] in your webpack configuration to get the latest configuration and all dependencies.
      // https://webpack.js.org/configuration/cache/#cachebuilddependencies
      config: [__filename],
    },
  },
  plugins: [
    // util requires this internally
    new webpack.ProvidePlugin({ process: 'process/browser' }),
    // new CaseSensitivePathsPlugin(),
    new WebpackBar({
      name: utils.isProd ? 'Prod' : 'Dev',
      color: utils.isProd ? '#569fff' : '#0dbc79',
    }),
    /**
     * All files inside webpack's output.path directory will be removed once, but the
     * directory itself will not be. If using webpack 4+'s default configuration,
     * everything under <PROJECT_DIR>/dist/ will be removed.
     * Use cleanOnceBeforeBuildPatterns to override this behavior.
     *
     * During rebuilds, all webpack assets that are not used anymore
     * will be removed automatically.
     *
     * See `Options and Defaults` for information
     */
    new CleanWebpackPlugin({ verbose: false }),
    // new webpack.ProgressPlugin({ percentBy: 'entries' }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
      NODE_ACTION: process.env.NODE_ACTION,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: config.distPath,
          force: true,
          transform(content, contentPath) {
            // generates the manifest file using the package.json information
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              }),
            );
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/scripts/content/content.styles.css',
          to: config.distPath,
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/images/icon-128.png',
          to: config.distPath,
          force: true,
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/images/icon-34.png',
          to: config.distPath,
          force: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: utils.fullPath('src/app/options/index.html'),
      filename: 'options-app.html',
      chunks: ['options-app'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: utils.fullPath('src/app/popup/index.html'),
      filename: 'popup-app.html',
      chunks: ['popup-app'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: utils.fullPath('src/app/devtools-loader/index.html'),
      filename: 'devtools-loader.html',
      chunks: ['devtools-loader'],
      cache: false,
    }),
    new HtmlWebpackPlugin({
      template: utils.fullPath('src/app/devtools/index.html'),
      filename: 'devtools-app.html',
      chunks: ['devtools-app'],
      cache: false,
    }),
    new webpack.ContextReplacementPlugin(
      /@babel\/standalone/u,
      (data) => {
        for (const d of data.dependencies) {
          if (d.critical === 'the request of a dependency is an expression') {
            delete d.critical;
          }
        }
        return data;
      },
    ),
    // Webpack plugin that runs TypeScript type checker on a separate process.
    new ForkTsCheckerWebpackPlugin(),
  ],
}];

if (utils.isProd) {
  webpackConfigs.push({
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 2,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        automaticNameDelimiter: '.',
        cacheGroups: {
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-redux|react-router|redux)[\\/]/u,
            name: 'react.vendor',
            priority: -5,
            reuseExistingChunk: true,
          },
          utils: {
            test: /[\\/]node_modules[\\/](lodash)[\\/]/u,
            name: 'utils.vendor',
            priority: -5,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/u,
            name: 'vendor',
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
      minimizer: [
        new CssMinimizerWebpackPlugin({
          minify: CssMinimizerWebpackPlugin.cssnanoMinify,
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        }),
        new TerserWebpackPlugin({
          parallel: true,
          terserOptions: {
            compress: {
              // collapse_vars: false, // Bug: https://github.com/terser-js/terser/issues/369
              // drop_console: true,
              // pure_funcs: ['console.log'],
            },
            mangle: true, // Note `mangle.properties` is `false` by default.
          },
        }),
      ],
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 3000000,
      maxEntrypointSize: 2000000,
    },
    stats,
  });
} else {
  webpackConfigs.push({
    mode: 'development',
    stats,
    devtool: 'inline-source-map',
  });
}

if (utils.isRun) {
  // create webpack dev server
  webpackConfigs.push({
    plugins: [
      // Friendly-errors-webpack-plugin recognizes certain classes of
      // webpack errors and cleans, aggregates and prioritizes them
      // to provide a better Developer Experience.
      // https://github.com/geowarin/friendly-errors-webpack-plugin#readme
      new FriendlyErrorsWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      static: [
        {
          directory: path.join(config.distPath, 'static'),
          publicPath: `${config.publicPath}/static`,
        },
        {
          directory: config.distPath,
          publicPath: `${config.publicPath}`,
        },
      ],
      client: {
        overlay: {
          warnings: false,
          errors: true,
        },
      },
      historyApiFallback: false,
      https: false,
      hot: false,
      host: '127.0.0.1',
      port: config.debugPort,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {},
      devMiddleware: {
        publicPath: `${config.publicPath}/`,
        stats,
        writeToDisk: true,
      },
      onListening: (server) => {
        const { port } = server.server.address();
        server.compiler.hooks.done.tap('done', () => {
          if (skipInstruction) {
            return;
          }
          setImmediate(() => {
            console.log();
            console.log(chalk.green.bold('Running at ') + chalk.cyan.bold(`http://localhost:${port}`));
            console.log();
            skipInstruction = true;
          });
        });
      },
    },
  });
} else {
  webpackConfigs.push({
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './static',
            to: './static',
            filter: pathname => !pathname.endsWith('/.gitkeep'),
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
  });
}

if (config.useESLint) {
  webpackConfigs.push({
    plugins: [
      plugins.eslintPlugin({
        cache: false,
        failOnError: !utils.isRun,
      }),
    ],
  });
}

if (config.useStyleLint) {
  webpackConfigs.push({
    plugins: [
      plugins.stylelintPlugin({
        failOnError: !utils.isRun,
      }),
    ],
  });
}

if (config.bundleAnalyzerReport && !utils.isRun) {
  webpackConfigs.push({
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      }),
    ],
  });
}

let webpackConfig = merge(webpackConfigs);

if (utils.isRun) {
  for (const entryName of Object.keys(webpackConfig.entry)) {
    if (!notHotReload.has(entryName)) {
      webpackConfig.entry[entryName] = [
        'webpack/hot/dev-server',
        `webpack-dev-server/client?hot=true&hostname=localhost&port=${config.debugPort}`,
        ...Array.isArray(webpackConfig.entry[entryName]) ? webpackConfig.entry[entryName] : [webpackConfig.entry[entryName]],
      ];
    }
  }
}

if (config.speedMeasureReport && !utils.isRun) {
  const smp = new SpeedMeasurePlugin();
  webpackConfig = smp.wrap(webpackConfig);
}

// SpeedMeasurePlugin conflict with MiniCssExtractPlugin.
// https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167#issuecomment-1040022776
webpackConfig.plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash:4].css',
    chunkFilename: 'style/[name].[chunkhash:4].css',
    ignoreOrder: true,
  }),
);

module.exports = webpackConfig;
