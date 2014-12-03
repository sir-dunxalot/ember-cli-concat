/* jshint node: true */
'use strict';

var concat = require('broccoli-concat');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-cli-concat',
  outputDir: 'assets',
  outputFileName: 'app',
  shouldConcatFiles: false,

  /**
  Append `<style>` and `<script>` tags to the app's html file (index.html by default) to load only the script we require.

  @method contentFor
  @param String type
  */

  contentFor: function(type) {
    var _this = this;
    var app = _this.app;
    var paths = app.options.outputPaths;

    var asset = function(type, assetPath) {
      if (typeof assetPath !== 'string') {
        /** @ref http://www.ember-cli.com/#asset-compilation */
        assetPath = assetPath['app'];
      }

      return '<' + type + ' src="' + assetPath + '"></' + type + '>';
    }

    var addAssets = function(type) {
      var ext = type === 'script' ? 'js' : 'css';

      if (_this.shouldConcatFiles) {
        return asset(type, 'assets/' + _this.outputFileName + '.' + ext);
      } else {
        /* Passes something like: asset('script', 'assets/vendor.js') */
        return asset(type, paths.vendor[ext]) + asset(type, paths.app[ext]);
      }
    }

    if (type === 'head') {
      /* Stylesheets */
      return addAssets('style');
    } else if (type === 'body') {
      /* Scripts */
      return addAssets('script');
    }
  },

  included: function(app) {
    this.app = app;

    if (app.env.toString() !== 'development') { // CHANGE BACK TO === after dev

    } else {
      this.shouldConcatFiles = true;
    }
  },

  postprocessTree: function(type, tree) {
    var paths = this.app.options.outputPaths;

    var concatenatedScripts = concat(tree, {
      allowNone: true,
      inputFiles: [paths.vendor.js, paths.app.js],
      outputFile: this.outputDir + '/' + this.outputFileName + '.js';
      // header: '/* Concatenated using https://github.com/sir-dunxalot/ember-cli-concat */',
      wrapInFunction: false,
    });

    var workingTree = mergeTrees([tree, concatenatedScripts]);

    return workingTree;
  }

  // treeFor: function() {
  //   console.log(arguments);
  // },
};
