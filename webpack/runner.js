/**
 * This file is part of react-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

const process = require('process');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

/**
 * Check params
 */
const ACTION_LIST = ['run', 'build'];
const ENV_LIST = ['development', 'production'];

const argv = yargs(hideBin(process.argv)).argv;

const nodeAction = argv.action;
const nodeEnv = argv.env || { run: 'development', build: 'production' }[nodeAction];
const report = argv.report;
const useESLint = argv.eslint !== false;
const useStyleLint = argv.stylelint !== false;
const traceDeprecation = argv.traceDeprecation;
const traceWarnings = argv.traceWarnings;

if (!ACTION_LIST.includes(nodeAction)) {
  console.error(`Invalid NODE_ACTION: ${nodeAction}, NODE_ACTION should be in ${ACTION_LIST.join(', ')}.`);
  throw new Error('Invalid NODE_ACTION');
}
if (!ENV_LIST.includes(nodeEnv)) {
  console.error(`Invalid NODE_ENV: ${nodeEnv}, NODE_ENV should be in ${ENV_LIST.join(', ')}.`);
  throw new Error('Invalid NODE_ENV');
}

/**
 * Set environments
 */
process.env.NODE_ACTION = nodeAction;
process.env.NODE_ENV = nodeEnv;
process.env.REPORT = report ? 'Y' : 'N';
process.env.ESLINT = useESLint ? 'Y' : 'N';
process.env.STYLELINT = useStyleLint ? 'Y' : 'N';
process.traceDeprecation = traceDeprecation;
process.traceWarnings = traceWarnings;

/**
 * Require must after set environments
 */
const chalk = require('chalk');
const ts = require('typescript');
const Webpack = require('webpack');

const { rm } = require('./utils');

/**
 * Load config
 */
const webpackConfig = require('../webpack.config');

if (!webpackConfig) {
  console.error('Load webpack config from webpack.config.js failed!');
  throw new Error('Load webpack config failed!');
}

/**
 * Start runner
 */

console.log(chalk.cyan.bold(`TypeScript Version: ${ts.version}`));

if (nodeAction === 'run') {
  const WebpackDevServer = require('webpack-dev-server');
  const compiler = Webpack(webpackConfig);
  const devServerOptions = webpackConfig.devServer;
  const server = new WebpackDevServer(devServerOptions, compiler);
  const runServer = async () => {
    await server.start();
  };
  runServer();
} else {
  console.log('');
  console.log('$ rm -rf dist');
  rm(webpackConfig.output.path)
    .catch((error) => {
      console.log(chalk.red.bold('error: rm dist failed!'));
      throw error;
    })
    .then((res) => {
      const compiler = Webpack(webpackConfig);
      compiler.run((err, stats) => {
        if (module.hot) {
          module.hot.accept();
        }
        compiler.close((closeErr) => {
          if (err) {
            console.log('Webpack compiler encountered a fatal error.', err);
            throw err;
          }
          if (closeErr) {
            console.log('Webpack compiler encountered a fatal error on close.', closeErr);
            throw err;
          }
          console.log(stats.toString(webpackConfig.stats));
        });
      });
      return res;
    })
    .catch((error) => { throw error; });
}
