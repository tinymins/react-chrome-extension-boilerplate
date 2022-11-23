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
exports.publicPath = `${(process.env.PUBLIC_PATH || '').replace(/\/+$/u, '')}/`;

/**
 * Dist file location, for WSL users, for example
 * you can set this value to '/mnt/d/dist'
 */
exports.distPath = process.env.DIST_PATH || path.join(__dirname, '..', 'dist');

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

/**
 * Run the build command with an extra argument to
 * View the bundle analyzer report after build finishes:
 * `npm run build:report`
 * Set to `true` or `false` to always turn it on or off
 */
exports.bundleAnalyzerReport = process.env.REPORT === 'Y';

/**
 * Report speed measure after build finishes
 */
exports.speedMeasureReport = process.env.REPORT === 'Y';
