/**
 * This file is part of react-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const utils = require('./utils');

const cacheLoader = path => ({
  loader: 'cache-loader',
  options: { cacheDirectory: utils.fullPath(`./node_modules/.cache/cache-loader/${utils.isProd ? 'prod' : 'dev'}/${path}`) },
});

const threadLoader = {
  loader: 'thread-loader',
  options: {
    // there should be 1 cpu for the fork-ts-checker-webpack-plugin
    workers: require('os').cpus().length - 1,
    poolTimeout: utils.isRun ? Number.POSITIVE_INFINITY : 500,
  },
};

// Generate loaders for standalone style files
const styleLoaders = (options = {}) => {
  const map = {
    scss: 'sass-loader',
    less: {
      loader: 'less-loader',
      options: { lessOptions: { javascriptEnabled: true } },
    },
    styl: 'stylus-loader',
    stylus: 'stylus-loader',
  };

  // 现在默认都提取就好了
  const devLoader = options.extract
    ? {
      loader: MiniCssExtractPlugin.loader,
    }
    : '';

  const cssRules = ['css', 'less', 'sass', 'scss'].map((extension) => {
    const srcPath = utils.fullPath('src/');
    const stylesPath = utils.fullPath('src/styles/');
    const rule = {
      test: new RegExp(`\\.${extension}$`, 'u'),
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: resourcePath =>
                resourcePath.startsWith(srcPath)
                && !resourcePath.startsWith(stylesPath),
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              exportOnlyLocals: options.onlyLocals,
            },
          },
        },
        'postcss-loader',
      ],
    };
    if (options.cache !== false) {
      rule.use.unshift(cacheLoader(`${extension}-loader`));
    }
    if (!options.onlyLocals) {
      rule.use.unshift(devLoader);
    }
    if (map[extension]) {
      rule.use.push(map[extension]);
    }
    return rule;
  });
  return cssRules;
};

const scriptLoaders = (options = {}) => {
  const srcIncludes = [utils.fullPath('src')];
  const jsLoader = {
    include: srcIncludes,
    test: /\.m?jsx?$/u,
    use: [
      'source-map-loader',
      'babel-loader',
      threadLoader,
    ],
  };
  const tsLoader = {
    include: srcIncludes,
    test: /\.tsx?$/u,
    use: [
      'source-map-loader',
      'babel-loader',
      {
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
          // disable type checker - we will use it in fork plugin
          transpileOnly: true,
        },
      },
      threadLoader,
    ],
  };
  // eslint has problems with cache loader
  // https://github.com/webpack-contrib/cache-loader/issues/72
  if (options.cache !== false) {
    jsLoader.use.unshift(cacheLoader('babel-loader'));
    tsLoader.use.unshift(cacheLoader('ts-loader'));
  }
  return [jsLoader, tsLoader];
};

const staticLoaders = () => [
  {
    test: /\.html$/u,
    loader: 'html-loader',
    exclude: /node_modules/u,
  },
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/u,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    },
    generator: {
      filename: 'asset/[contenthash][ext]',
    },
  },
  {
    test: /\.(woff|eot|ttf|svg|gif)$/u,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024,
      },
    },
    generator: {
      filename: 'asset/[contenthash][ext]',
    },
  },
];

exports.styleLoaders = styleLoaders;
exports.scriptLoaders = scriptLoaders;
exports.staticLoaders = staticLoaders;
