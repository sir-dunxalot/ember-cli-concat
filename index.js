/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-concat',
  fileName: 'app',
  shouldConcatFiles: false,

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
        return asset(type, 'assets/' + _this.fileName + '.' + ext);
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

    if (app.env.toString() === 'development') {

    } else {
      this.shouldConcatFiles = true;
    }
  },

  postprocessTree: function(type, tree) {
    console.log('------------------------------------');
    console.log(type);
    console.log(tree);

    return tree;
  }

  // treeFor: function() {
  //   console.log(arguments);
  // },
};
