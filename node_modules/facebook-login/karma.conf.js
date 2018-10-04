var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    frameworks: ['chai-as-promised', 'chai', 'mocha', 'sinon'],
    browsers: ['PhantomJS'],
    phantomjsLauncher: {
      exitOnResourceError: true
    },
    files: [
      'spec/specs.js'
    ],
    preprocessors: {
      'src/**/*.js': ['webpack'],
      'spec/**/*.js': ['webpack']
    },
    reporters: ['dots'],
    logLevel: config.LOG_INFO,
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    singleRun: true
  });
};
