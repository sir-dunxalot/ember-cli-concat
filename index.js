/* jshint node: true */
'use strict';

/* Dependencies */

var concat = require('broccoli-sourcemap-concat');
var fileRemover = require('broccoli-file-remover');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

var defaultFor = function(variable, defaultValue) {
  if (typeof variable !== 'undefined' && variable !== null) {
    return variable;
  } else {
    return defaultValue;
  }
}

module.exports = {
  name: 'ember-cli-concat',

  enabled: true,
  scriptsContentFor: 'body-footer',
  stylesContentFor: 'head-footer',
  outputDir: 'assets',
  outputFileName: 'app',
  useSelfClosingTags: false,
  wrapScriptsInFunction: true,

  _environment: null,
  _outputPaths: null,
  _shouldConcatFiles: false,
  _inTesting: false,

 /**
  Whether or not to original files regardless of concatenation.

  @property preserveOriginals
  @type Boolean
  @default true
  */

  preserveOriginals: false,

  cleanPath: function(path) {
    return path.replace(/^\//, '').replace(/\/$/, '');
  },

  getAssetTag: function(ext, path) {
    var closing;

    if (ext === 'js') {
      return '<script src="' + path + '"></script>\n';
    } else {
      closing = this.useSelfClosingTags ? ' /' : '';

      return '<link rel="stylesheet" href="' + path + '"' + closing + '>\n';
    }
  },

  contentFor: function(contentForType) {
    var outputPaths = this._outputPaths;
    var concatPath = this.outputDir + '/' + this.outputFileName;
    var ext, tags;

    if (contentForType === 'test-head') {
      this._inTesting = true;
    } else if (contentForType === this.scriptsContentFor) {
      ext = 'js';

      if (this._shouldConcatFiles) {
        tags = getAssetTag(ext, concatPath + '.' + ext);
      } else {
        tags = this.filterPaths(ext);
      }

      return tags;
    } else if (contentForType === this.stylesContentFor) {
      ext = 'css';

      if (this._shouldConcatFiles) {
        tags = getAssetTag(ext, concatPath + '.' + ext);
      } else {
        tags = this.filterPaths(ext);
      }

      return tags;
    } else {
      return;
    }
  },

  filterPaths: function(ext) {
    var tags = [];
    var outputPaths = this._outputPaths;

    /* Insert at the second place in array so test support
    is before vendor */

    var addTag = function(path) {
      if (path.indexOf('test-support') > -1 && !this._inTesting) {
        return;
      } else if (path.indexOf('test-loader') === -1) {
        tags.splice(1, 0, this.getAssetTag(ext, path));
      }
    }.bind(this);

    for (var treeName in outputPaths) {
      var assets = outputPaths[treeName];
      var paths = assets[ext];
      var path;

      if (typeof paths === 'string') {
        addTag(paths);
      } else {
        for (var type in paths) {
          addTag(paths[type]);
        }
      }
    }

    return tags;
  },

  included: function(app) {
    var environment = app.env.toString();
    var options = defaultFor(app.options.emberCliConcat, {});
    var development = environment === 'development';

    this._environment = environment;
    this._outputPaths = app.options.outputPaths;

    for (var option in options) {
      this[option] = options[option];
    }

    if ((!development || this.forceConcatenation) && this.enabled) {
      this._shouldConcatFiles = true;
    }
  },

  /**
  @method postprocessTree
  @param {String} type The Type of tree passed (e.g. js, all, etc)
  @param {Object} tree The Broccoli tree(s) in the project
  */

  postprocessTree: function(type, tree) {
    var cleanPath = this.cleanPath;

    /* If we're not concatenating anything, just return the original tree */

    if (!this._shouldConcatFiles) {
      return tree;
    }

    /*
    If we are concatenating files, let's get busy...
    Note: to actually 'save' the concatenated files we have to manually merge the trees after the concat.
    */

    var outputPath = '/' + cleanPath(this.outputDir) + '/' + this.outputFileName;
    var paths = this._outputPaths;

    /* Locate all script files and concatenate into one file. */

    var scriptInputFiles = [
      cleanPath(paths.vendor['js'])
    ];

    if (testing) {
      scriptInputFiles.push(cleanPath(paths.testSupport['js']));
    }

    scriptInputFiles.push(cleanPath(paths.app['js']));

    var concatenatedScripts = concat(tree, {
      allowNone: true,
      inputFiles: scriptInputFiles,
      outputFile: outputPath + '.js',
      footer: this.footer,
      header: this.header,
      wrapInFunction: this.wrapScriptsInFunction
    });

    /* Locate all style files and concatenate into one file */

    var styleInputFiles = [
      cleanPath(paths.vendor['css'])
    ];

    if (testing) {
      styleInputFiles.push(cleanPath(paths.testSupport['css']));
    }

    var appCssPaths = paths.app['css'];

    /* The app tree's CSS uses a KVP relationship so we have to do a little more work than we did for the scripts... */

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
    if (!this.preserveOriginals) {
      workingTree = fileRemover(workingTree, {
        files: scriptInputFiles.concat(styleInputFiles)
      });
    }

    return workingTree;
  }
};
