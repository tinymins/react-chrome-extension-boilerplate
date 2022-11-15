/**
 * This file is part of react-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const path = require('path');

/**
 * Public path for webpack
 */
exports.publicPath = (process.env.PUBLIC_PATH || '').replace(/\/+$/u, '');

/**
 * Dist file location, for WSL users, for example
 * you can set this value to '/mnt/d/dist'
 */
exports.distPath = process.env.DIST_PATH || path.join(__dirname, '..', 'dist');

/**
 * Build environment
 */
exports.nodeEnv = process.env.NODE_ENV || 'development';

/**
 * Local dev server listen port
 */
exports.debugPort = process.env.PORT || 3000;

/**
 * Use ESLint
 */
exports.useESLint = process.env.ESLINT !== 'N';

/**
 * Use StyleLint
 */
exports.useStyleLint = process.env.STYLELINT !== 'N';
