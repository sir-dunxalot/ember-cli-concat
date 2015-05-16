var broccoli = require('broccoli');
var defaultOptions = require('../fixtures/default-options');
var emberCliConcat = require('../..'); // index.js
var paths = require('../fixtures/paths');

module.exports = {
  builder: null,
  currentOptions: null,

  setOptions: function(options, environment) {
    options = options || {};
    environment = environment || 'development';

    options.outputPaths = paths.outputPaths;
    this.currentOptions = options;

    emberCliConcat.included({
      env: environment,
      options: options
    });
  },

  concatTree: function() {
    return emberCliConcat.postprocessTree('all', 'dist');
  },

  buildWithOptions: function(concatOptions, environment) {
    this.resetDefaultOptions();

    this.setOptions({
      emberCliConcat: concatOptions
    }, environment);

    this.builder = new broccoli.Builder(this.concatTree());

    return this.builder.build();
  },

  getOutputPath: function(ext, fileName) {
    fileName = fileName || defaultOptions.outputFileName;

    return '/' + defaultOptions.outputDir + '/' + fileName + '.' + ext;
  },

  resetDefaultOptions: function() {
    this.setOptions({
      emberCliConcat: defaultOptions
    });
  }
}
