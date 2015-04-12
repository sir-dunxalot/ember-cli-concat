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

  scriptsContentFor: 'body',
  stylesContentFor: 'head-footer',
  outputDir: 'assets',
  outputFileName: 'app',
  useSelfClosingTags: false,

  _outputPaths: null,
  _shouldConcatFiles: false,

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

    if (contentForType === this.scriptsContentFor) {
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
      if (path.indexOf('test-loader') === -1) {
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
    this._outputPaths = app.options.outputPaths;
  }
};
