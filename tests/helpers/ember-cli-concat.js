var broccoli = require('broccoli');
var defaultOptions = require('../fixtures/default-options');
var emberCliConcat = require('../..'); // index.js
var paths = require('../fixtures/paths');

/**
Test-friendly helpers that wrapp the addon's index.js
file's Ember addon methods like included and postprocessTree.
This allows us to call the methods from tests easily.

This also keeps track of some options and properties (e.g.
builder), which are used from test to test and are used
in beforeEach and afterEach test hooks.
*/

module.exports = {
  builder: null,
  module: emberCliConcat,

  /**
  Builds the assets to the dist file using emberCliConcat
  options set (like the developer would do in the Brocfile).

  @method buildWithOptions
  */

  buildWithOptions: function(options, environment) {
    this.resetDefaultOptions();
    this.setOptions(options, environment);

    this.builder = new broccoli.Builder(this.concatTree());

    return this.builder.build();
  },

  /**
  Takes the assets built in the dist directory (the dist tree)
  and passes it to the addon's postprocessTree hook as if
  it was called as part fo the Broccoli build process.

  @method concatTree
  */

  concatTree: function() {
    return emberCliConcat.postprocessTree('all', 'dist');
  },

  /**
  Returns the asset tags returned by the addon's contentFor
  hook for a given {{content-for}} tag. The assets are
  returned as a single string for easy assertions of file
  paths being present.

  @method getAssetTagsAsString
  */

  getAssetTagsAsString: function(ext) {
    var contentForType = emberCliConcat[ext].contentFor;

    return emberCliConcat.contentFor(contentForType).join();
  },

  /**
  Returns the outputh path a concatenated file is expected
  to be placed at.

  @method getOutputPath
  */

  getOutputPath: function(ext, fileName) {
    fileName = fileName || emberCliConcat.outputFileName;

    return '/' + emberCliConcat.outputDir + '/' + fileName + '.' + ext;
  },

  /**
  Ensures the addon's options are reset to their original state.
  This is useful to run after each test of before a new Broccoli
  build takes place.

  @method resetDefaultOptions
  */

  resetDefaultOptions: function() {
    this.setOptions(defaultOptions);
  },

  /**
  Accepts an options object and environment to set in the
  addon's index.js file as if the included hook was being
  called as part of the Broccoli build process.

  @method setOptions
  */

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
}
