/* jshint node: true */
'use strict';

/* Dependencies */

var concat = require('broccoli-concat');
var fileRemover = require('broccoli-file-remover');
var mergeTrees = require('broccoli-merge-trees');

/* Private properties */

var shouldConcatFiles = false;
var testing = false;

/* Helper Functions */

/**
A helper function that looks to see if a variable has a value and, if so, uses the value. Otherwise, it uses the developer-defined fallback.

Example usage:

```
var path = defaultFor(path, 'assets/app.js');
```

@method defaultFor
@param {all} The variable you want to use the value of but need a fallback
@param {all} The default value to use in cases where the value of `variable` is not defined
*/

var defaultFor = function(variable, defaultValue) {
  if (typeof variable !== 'undefined' && variable !== null) {
    return variable;
  } else {
    return defaultValue;
  }
}

/**
Cleans up a path by removing the opening and closing forward slashes. Essentially, this turns an absolute path into a relative path and protects against typos in the developer-defined options.

```
return cleanPath('/assets/app.js') // 'assets/app.js'
```

@method cleanPath
@param {String} The path to clean up
*/

var cleanPath = function(path) {
  return path.replace(/^\//, '').replace(/\/$/, '');
}

/* The Main Event woop woop */

module.exports = {
  name: 'ember-cli-concat', // Don't wear it out

  /**
  Disables concatenation of files no matter what other options are set (e.g. `forceConcatination: true`). Useful for debugging purposes.

  @property enabled
  @type Boolean
  @default true
  */

  enabled: true,

  /* Public properties (AKA the default options) */

  /**
  The string to add to the end of all concatenated files. Usually this is a comment. For example:

  ```
  string: '// Copyright © I Am Devloper 2014'
  ```

  @property footer
  @type String
  @default null
  */

  footer: null,

  /**
  An override the developer can utilize to concatenate regardless of the environment. Useful for debuggin purpuses.

  @property forceConcatenation
  @type Boolean
  @default false
  */

  forceConcatenation: false,

  /**
  The string to add to the start of all concatenated files. Usually this is a comment. For example:

  ```
  string: '// Author: I Am Devloper'
  ```

  @property header
  @type String
  @default null
  */

  header: null,

  /**
  The output directory that the concatenated files will be saved to. Define it as a relative path with no opening or closing slashes. For example:

  `outputDir` is combined with `outputFileName` to determine the full file path for saving concatenated files.

  ```
  outputDir: 'assets'
  // or
  outputDir: 'assets/public'
  ```

  @property outputDir
  @type String
  @default 'assets'
  */

  outputDir: 'assets',

  /**
  The name of the concatenated file that will hold the styles or script for your project. Define it as a string with no file extention. This addon will automatically append the require file extentions. For example:

  ```
  outputFileName: 'app' // Results in app.css and app.js being created
  ```

  The full file path is determine by `outputFileName` and `outputDir`. For example:

  ```
  outputDir: 'assets',
  outputFileName: 'app'
  // Results in assets/app.css and assets/app.js being created
  ```

  @property outputFileName
  @type String
  @default 'app'
  */

  outputFileName: 'app',

  /**
  Whether or not to use self closing HTML tags for the `<style>` and `<link>` tags to be compatible with certain (outdated :p) templating engines.

  For example, if you set `useSelfClosingTags` to `true`:

  ```html
  <link href="assets/app.css">
  <!-- Becomes... -->
  <link href="assets/app.css" />
  ```

  @property useSelfClosingTags
  @type Boolean
  @default false
  */

  useSelfClosingTags: false,

  /**
  Whether or not to wrap the concatenated javascript in an eval statement.

  @property wrapScriptsinFunction
  @type Boolean
  @default true
  */

  wrapScriptsInFunction: true,

  /**
  Append `<link>` and `<script>` tags to the app's HTML file to load only the assets we require.

  The contentFor hook is run once for each `content-for` in our application. `head` and `body`, which are the two we hook onto, are standard to Ember CLI builds and are found in the app's main HTML filem which is `app/index.html` by default.

  @method contentFor
  @param {String} type The type of content-for this is being run for (e.g. head, body, etc)
  */

  contentFor: function(type) {
    var _this = this;
    var app = _this.app;
    var paths = app.options.outputPaths;

    /* Helper function to return string that willbe placed in the DOM */

    var asset = function(assetType, assetPath) {
      var closing;

      if (assetType === 'script') {
        return '<script src="' + assetPath + '"></script>';
      } else {
        closing = _this.useSelfClosingTags ? ' /' : '';

        return '<link rel="stylesheet" href="' + assetPath + '"' + closing + '>';
      }
    }

    /* Helper function to determine which assets to load */

    var addAssets = function(assetType) {
      var ext = assetType === 'script' ? 'js' : 'css';
      var appAssets = [];
      var appPaths, testAssets, vendorAssets;

      if (shouldConcatFiles) {
        return asset(assetType, 'assets/' + _this.outputFileName + '.' + ext);
      } else {
        vendorAssets = asset(assetType, paths.vendor[ext]);
        appPaths = paths.app[ext];

        /* If in test environment, define the required test-support assets */

        testAssets = testing ? asset(assetType, paths.testSupport[ext]) : '';

        /* Allow for multiple stylesheets because the app tree's CSS uses a KVP relationship */

        if (typeof appPaths !== 'string') {
          for (var path in appPaths) {
            appAssets.push(asset(assetType, appPaths[path]));
          }
        } else {
          appAssets = asset(assetType, appPaths);
        }

        return vendorAssets + testAssets + appAssets;
      }
    }

    /* Add scripts and stylesheets to the app's main HTML file */

    if (type === 'head') {
      return addAssets('style');
    } else if (type === 'body') {
      return addAssets('script');
    }
  },

  /**
  Overrides this addon's default options with any specified by the developer and determines whether or not to concatenate files based on the environment.

  The included hook is run once during the build process of the addon.

  @method included
  @param {Object} app The application instance
  */

  included: function(app) {
    var options = defaultFor(app.options.emberCliConcat, {});
    var environment = app.env.toString();
    var inDevelopmentEnvironment = environment === 'development';

    testing = environment === 'test';
    this.environment = environment;
    this.app = app;

    /* Override default options with those defined by the developer */

    for (var option in options) {
      this[option] = options[option];
    }

    if ((!inDevelopmentEnvironment || this.forceConcatenation) && this.enabled) {
      shouldConcatFiles = true;
    }
  },

  /**
  @method postprocessTree
  @param {String} type The Type of tree passed (e.g. js, all, etc)
  @param {Object} tree The Broccoli tree(s) in the project
  */

  postprocessTree: function(type, tree) {

    /* If we're not concatenating anything, just return the original tree */

    if (!shouldConcatFiles) {
      return tree;
    }

    /*
    If we are concatenating files, let's get busy...
    Note: to actually 'save' the concatenated files we have to manually merge the trees after the concat.
    */

    var outputPath = '/' + cleanPath(this.outputDir) + '/' + this.outputFileName;
    var paths = this.app.options.outputPaths;

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

    if (paths.testSupport) {
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

    workingTree = fileRemover(workingTree, {
      files: scriptInputFiles.concat(styleInputFiles)
    });

    return workingTree;
  }
};
