/* jshint node: true */
'use strict';

/* Dependencies */

var concat = require('broccoli-concat');
var fileRemover = require('broccoli-file-remover');
var mergeTrees = require('broccoli-merge-trees');

/* Private properties */

var shouldConcatFiles = false;

/* Helper Functions */

/**
@method defaultFor
*/

var defaultFor = function(variable, defaultValue) {
  if (typeof variable !== 'undefined' && variable !== null) {
    return variable;
  } else {
    return defaultValue;
  }
}

var cleanPath = function(path) {
  return path.replace(/^\//, '').replace(/\/$/, '');
}

module.exports = {
  name: 'ember-cli-concat',

  /* Public properties (AKA the default options) */

  footer: null,
  header: '/* Concatenated using https://github.com/sir-dunxalot/ember-cli-concat */',
  outputDir: 'assets',
  outputFileName: 'app',
  wrapScriptsInFunction: true,

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
        // Reference: http://www.ember-cli.com/#asset-compilation
        assetPath = assetPath['app'];
      }

      return '<' + type + ' src="' + assetPath + '"></' + type + '>';
    }

    var addAssets = function(type) {
      var ext = type === 'script' ? 'js' : 'css';

      if (shouldConcatFiles) {
        return asset(type, 'assets/' + _this.outputFileName + '.' + ext);
      } else {
        // Passes something like: asset('script', 'assets/vendor.js')
        return asset(type, paths.vendor[ext]) + asset(type, paths.app[ext]);
      }
    }

    /* Add scripts and stylesheets to the app's main HTML file */

    if (type === 'head') {
      return addAssets('style');
    } else if (type === 'body') {
      return addAssets('script');
    }
  },

  included: function(app) {
    var options = defaultFor(app.options['ember-cli-concat'], {});

    this.app = app;

    if (app.env.toString() !== 'development') { // CHANGE BACK TO === after dev

    } else {
      shouldConcatFiles = true;
    }

    /* Override default options with those defined by the developer */

    for (var option in options) {
      this[option] = options[option];
    }
  },

  postprocessTree: function(type, tree) {

    /* If we're not concatinating anything, return the original tree */

    if (!shouldConcatFiles) {
      return tree;
    }

    /* If we are concatenating files, let's get busy... */

    var outputPath = '/' + cleanPath(this.outputDir) + '/' + this.outputFileName;
    var paths = this.app.options.outputPaths;

    /* Locate all script files and concatinate into one file */

    var scriptInputFiles = [cleanPath(paths.vendor['js']), cleanPath(paths.app['js'])];
    var concatenatedScripts = concat(tree, {
      allowNone: true,
      inputFiles: scriptInputFiles,
      outputFile: outputPath + '.js',
      footer: this.footer,
      header: this.header,
      wrapInFunction: this.wrapScriptsInFunction
    });

    /* Locate all style files and concatinate into one file */

    var styleInputFiles = [cleanPath(paths.vendor['css'])];
    var appCssPaths = paths.app['css'];

    /* The app CSS uses a KVP relationship so we have to do a little more work than we did for the scripts... */

    for (var path in appCssPaths) {
      styleInputFiles.push(cleanPath(appCssPaths[path]));
    }

    var concatenatedStyles = concat(tree, {
      allowNone: true,
      footer: this.footer,
      header: this.header,
      inputFiles: styleInputFiles,
      outputFile: outputPath + '.css',
      wrapInFunction: false
    });

    /* Combine all the files into the project's tree */

    var workingTree = mergeTrees([tree, concatenatedScripts, concatenatedStyles]);

    /* Remove the unnecessary files */

    workingTree = fileRemover(workingTree, {
      files: scriptInputFiles.concat(styleInputFiles)
    });

    return workingTree;
  }
};
