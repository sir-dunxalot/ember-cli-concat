var broccoli = require('broccoli');
var defaultOptions = require('../fixtures/default-options');
var emberCliConcat = require('../..'); // index.js
var paths = require('../fixtures/paths');

module.exports = {
  builder: null,
  module: emberCliConcat,

  setOptions: function(options, environment) {
    options = options || {};
    environment = environment || 'development';

    emberCliConcat.included({
      env: environment,
      options: {
        emberCliConcat: options,
        outputPaths: paths.outputPaths
      }
    });
  },

  concatTree: function() {
    return emberCliConcat.postprocessTree('all', 'dist');
  },

  buildWithOptions: function(options, environment) {
    this.resetDefaultOptions();
    this.setOptions(options, environment);

    this.builder = new broccoli.Builder(this.concatTree());

    return this.builder.build();
  },

  getAssetTagsAsString: function(ext) {
    var contentForType = defaultOptions[ext].contentFor;

    return emberCliConcat.contentFor(contentForType).join();
  },

  getOutputPath: function(ext, fileName) {
    fileName = fileName || defaultOptions.outputFileName;

    return '/' + defaultOptions.outputDir + '/' + fileName + '.' + ext;
  },

  resetDefaultOptions: function() {
    this.setOptions(defaultOptions);
  }
}
