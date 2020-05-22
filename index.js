'use strict';

/* Dependencies */

var concatAndMap = require('broccoli-concat');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var { join: joinPaths } = require('path');

/* Helper Functions */

/**
A helper function that looks to see if a variable has a value and, if so, uses the value. Otherwise, it uses the developer-defined fallback.
Example usage:
```
var path = defaultFor(path, 'assets/app.js');
```

 * @method defaultFor
 * @param variable {all} The variable you want to use the value of but need a fallback
 * @param defaultValue {all} The default value to use in cases where the value of `variable` is not defined
 * @returns {all}
 */
var defaultFor = function(variable, defaultValue) {
  if (typeof variable !== 'undefined' && variable !== null) {
    return variable;
  } else {
    return defaultValue;
  }
};

/* The main event woop woop */

module.exports = {
  name: require('./package').name,

  js: {
    concat: false,
    contentFor: 'concat-js',
    footer: null,
    header: null,
    preserveOriginal: true,
    useAsync: false
  },

  css: {
    concat: false,
    contentFor: 'concat-css',
    footer: null,
    header: null,
    preserveOriginal: true
  },

  /**
   Allows to specify tree types which would be used for
   concatenation. Defaults to empty array which would
   concatenate all recieved by addon postprocessTree hook.
   To concatenate only the whole app after all its assets
   have already been processed by the Ember build pipeline
   set this property to ['all']

   @property treeTypes
   @type Array
   @default ['all']
   */

  treeTypes: ['all'],

  /**
  Disables concatenation of files. Useful for debugging purposes.

  @property enabled
  @type Boolean
  @default true
  */

  enabled: true,

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

  wrapScriptsInFunction: false, // TODO - Deprecate

  /**
  Optional override for environment rootURL

  @property rootURL
  @type String|null
  @default null
  */

  rootURL: null,

  _rootEnvURL: null,

  _outputPaths: null,

  /**
  Cleans up a path by removing the opening and closing forward slashes. Essentially, this turns an absolute path into a relative path and protects against typos in the developer-defined options.
  ```
  return cleanPath('/assets/app.js') // 'assets/app.js'
  ```

  @method cleanPath
  @param path {String} The path to clean up
  */

  cleanPath: function(path) {
    return path.replace(/^\//, '').replace(/\/$/, '');
  },

  /**
  Append `<link>` and `<script>` tags to the app's HTML file to load only the assets we require.
  The contentFor hook is run once for each `content-for` in our application. `head` and `body`, which are the two we hook onto, are standard to Ember CLI builds and are found in the app's main HTML filem which is `app/index.html` by default.

  @method contentFor
  @param {String} contentForType The type of content-for this is being run for (e.g. head, body, etc)
  @param {Object} config Containing application configuration
  */

  contentFor: function(contentForType, config) {
    this._rootEnvURL = config && config.rootURL || this._rootEnvURL;
    if (this.enabled) {
      var ext, concat;
      if (contentForType === this.js.contentFor) {
        ext = 'js';
        concat = this.js.concat;
      } else if (contentForType === this.css.contentFor) {
        ext = 'css';
        concat = this.css.concat;
      } else {
        return undefined;
      }
      return concat ? [this.outputAppPath(ext)] : [this.vendorPath(ext), this.appPath(ext)];
    }
  },

  outputAppPath: function(ext) {
    return this.getAssetTag(ext, "/" + this.outputDir + "/" + this.outputFileName + "." + ext);
  },

  appPath: function(ext, relPath) {
    var path;
    if (ext === 'css') {
      path = this._outputPaths['app'][ext]['app'];
    } else {
      path = this._outputPaths['app'][ext];
    }
    if (relPath) {
      return this.cleanPath(path);
    } else {
      return this.getAssetTag(ext, path);
    }

  },

  vendorPath: function(ext, relPath) {
    var path = this._outputPaths['vendor'][ext];
    if (relPath) {
      return this.cleanPath(path);
    } else {
      return this.getAssetTag(ext, path);
    }

  },

  getAssetTag: function(ext, path) {
    var closing;

    var rootURL = this.rootURL || this._rootEnvURL;
    if (rootURL && rootURL !== '/') {
      path = joinPaths('/', rootURL, path);
    }

    if (ext === 'js') {
      if (this.js.useAsync) {
        return '<script async src="' + path + '"></script>\n';
      }
      return '<script src="' + path + '"></script>\n';
    } else {
      closing = this.useSelfClosingTags ? ' /' : '';

      return '<link rel="stylesheet" href="' + path + '"' + closing + '>\n';
    }
  },

  config(env, ENV) {
    this.rootURL = this.rootURL || ENV.rootURL;
  },

  /**
  Overrides this addon's default options with any specified by the developer and determines whether or not to concatenate files based on the environment. Please note, there is a fallback check for detecting test environments in the contentFor hook.
  The included hook is run once during the build process of the addon.

  @method included
  @param {Object} app The application instance
  */

  included: function(app) {
    var options = defaultFor(app.options.emberCliConcat, {});

    this._outputPaths = app.options.outputPaths;

    // Overwrite default options

    for (var option in options) {
      var objectOrOption = options[option];

      if (typeof objectOrOption === 'object') {
        for (var typeOption in objectOrOption) {
          this[option][typeOption] = objectOrOption[typeOption];
        }
      } else {
        this[option] = options[option];
      }
    }
  },

  /**
  @method postprocessTree
  @param {String} type The Type of tree passed (e.g. js, all, etc)
  @param {Object} tree The Broccoli tree(s) in the project
  */

  postprocessTree: function(type, tree) {
    if ((this.treeTypes.indexOf(type) !== -1 ||
      this.treeTypes.length === 0) &&
      this.enabled
    ) {
      var outputPath = '/' + this.cleanPath(this.outputDir) + '/' + this.outputFileName;
      var cssOptions = this.css;
      var jsOptions = this.js;

      var concatenatedScripts, concatenatedStyles, removeFromTree, scriptInputPaths, styleInputPaths, trees, workingTree;

      removeFromTree = function(inputFiles) {
        tree = new Funnel(tree, {
          exclude: inputFiles
        });
      };

      /* Locate all script files and concatenate into one file */

      if (jsOptions.concat) {
        scriptInputPaths = [this.appPath('js', true)];
        var headerFiles = [this.vendorPath('js', true)];

        concatenatedScripts = concatAndMap(tree, {
          allowNone: true,
          inputFiles: scriptInputPaths,
          outputFile: outputPath + '.js',
          headerFiles: headerFiles,
          footer: jsOptions.footer,
          header: jsOptions.header,
          wrapInFunction: this.wrapScriptsInFunction
        });

        if (!jsOptions.preserveOriginal) {
          removeFromTree(scriptInputPaths.concat(headerFiles));
        }
      }

      /* Locate all style files and concatenate into one file */

      if (cssOptions.concat) {
        styleInputPaths = [this.appPath('css', true)];
        var cssHeaderFiles = [this.vendorPath('css', true)];

        concatenatedStyles = concatAndMap(tree, {
          allowNone: true,
          footer: cssOptions.footer,
          header: cssOptions.header,
          inputFiles: styleInputPaths,
          outputFile: outputPath + '.css',
          headerFiles: cssHeaderFiles,
          wrapInFunction: false
        });

        if (!cssOptions.preserveOriginal) {
          removeFromTree(styleInputPaths.concat(cssHeaderFiles));
        }
      }

      /* Combine all the files into the project's tree */

      trees = [tree, concatenatedScripts, concatenatedStyles];

      /* Remove empty values and add the remaining to the
       working tree */

      workingTree = mergeTrees(trees.filter(function(e) { return e; }), {
        overwrite: true
      });

      /* Remove the unnecessary script and style files */

      return workingTree;
    } else {
      return tree;
    }
  }
};
