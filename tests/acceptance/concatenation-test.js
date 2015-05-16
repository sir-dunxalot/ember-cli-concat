var broccoli = require('broccoli');
var emberCliConcat = require('../..'); // index.js
var root = process.cwd();
var builder, currentOptions;

var assertFileExists = require('../helpers/assert-file-exists');
var assertFileDoesNotExist = require('../helpers/assert-file-does-not-exist');

var appCssPath = '/assets/dummy.css';
var appJsPath = '/assets/dummy.js';
var vendorCssPath = '/assets/vendor.css';
var vendorJsPath = '/assets/vendor.js';

var cssPaths = [appCssPath, vendorCssPath];
var jsPaths = [appJsPath, vendorJsPath];

var assetPaths = [appCssPath, appJsPath, vendorCssPath, vendorJsPath];

var defaultOptions = {
  js: {
    concat: false,
    contentFor: 'concat-js',
    footer: null,
    header: null,
    preserveOriginal: true
  },

  css: {
    concat: false,
    contentFor: 'concat-css',
    footer: null,
    header: null,
    preserveOriginal: true
  },

  enabled: true,
  outputDir: 'assets',
  outputFileName: 'app',
  useSelfClosingTags: false,
  wrapScriptsInFunction: false
};

function setOptions(options, environment) {
  options = options || {};
  environment = environment || 'development';

  /* Default from https://github.com/ember-cli/ember-cli/blob/master/lib/broccoli/ember-app.js */

  options.outputPaths = {
    app: {
      html: 'index.html',
      css: {
        'app': appCssPath
      },
      js: appJsPath
    },
    vendor: {
      css: vendorCssPath,
      js: vendorJsPath
    },
    testSupport: {
      css: '/assets/test-support.css',
      js: {
        testSupport: '/assets/test-support.js',
        testLoader: '/assets/test-loader.js'
      }
    }
  };

  currentOptions = options;

  emberCliConcat.included({
    env: environment,
    options: options
  });
}

function concatTree() {
  return emberCliConcat.postprocessTree('all', 'dist');
}

function buildWithOptions(concatOptions, environment) {
  resetDefaultOptions();


  setOptions({
    emberCliConcat: concatOptions
  }, environment);

  builder = new broccoli.Builder(concatTree());

  return builder.build();
}

function getOutputPath(ext, fileName) {
  fileName = fileName || defaultOptions.outputFileName;

  return '/' + defaultOptions.outputDir + '/' + fileName + '.' + ext;
}

function resetDefaultOptions() {
  setOptions({
    emberCliConcat: defaultOptions
  });
}

describe('Acceptance - Concatenation', function() {
  this.timeout(10000);

  beforeEach(function() {
    process.chdir(root);
  });

  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('compiles the correct files with default options', function() {
    return buildWithOptions().then(function(results) {
      var directory = results.directory;

      /* Check each file in the default output paths exists */

      assetPaths.forEach(function(path) {
        assertFileExists(directory, path);
      });

      /* Check original map files exist */

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));
    });
  });

  it('concats JavaScript', function() {
    return buildWithOptions({
      js: {
        concat: true
      }
    }).then(function(results) {
      var directory = results.directory;

      /* We're not overwriting so the originals should
      all still exist */

      assetPaths.forEach(function(path) {
        assertFileExists(directory, path);
      });

      /* But so should the new app.js file */

      assertFileExists(directory, getOutputPath('js'));

      /* Check previous map files exist with new map file */

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));
      assertFileExists(directory, getOutputPath('map'));

    });
  });

  it('concats JavaScript and removes originals', function() {
    return buildWithOptions({
      js: {
        concat: true,
        preserveOriginal: false
      }
    }).then(function(results) {
      var directory = results.directory;

      /* The CSS files should still exist */

      cssPaths.forEach(function(path) {
        assertFileExists(directory, path);
      });

      /* But the new app.js file should be the
      only js file */

      jsPaths.forEach(function(path) {
        assertFileDoesNotExist(directory, path);
      });

      assertFileExists(directory, getOutputPath('js'));
      assertFileExists(directory, getOutputPath('map'));
    });
  });

  it('concats CSS', function() {
    return buildWithOptions({
      css: {
        concat: true
      }
    }).then(function(results) {
      var directory = results.directory;

      /* We're not overwriting so the originals should
      all still exist */

      assetPaths.forEach(function(path) {
        assertFileExists(directory, path);
      });

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));

      /* But so should the new app.css file */

      assertFileExists(directory, getOutputPath('css'));
      assertFileDoesNotExist(directory, getOutputPath('map'));
    });
  });

  it('concats CSS and removes originals', function() {
    return buildWithOptions({
      css: {
        concat: true,
        preserveOriginal: false
      }
    }).then(function(results) {
      var directory = results.directory;

      /* The JS files should still exist */

      jsPaths.forEach(function(path) {
        assertFileExists(directory, path);
      });

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));

      /* But the new app.css file should be the
      only CSS file */

      cssPaths.forEach(function(path) {
        assertFileDoesNotExist(directory, path);
      });

      assertFileExists(directory, getOutputPath('css'));
      assertFileDoesNotExist(directory, getOutputPath('map'));
    });
  });

  it('concats JS and CSS', function() {
    return buildWithOptions({
      js: {
        concat: true
      },
      css: {
        concat: true
      }
    }).then(function(results) {
      var directory = results.directory;

      /* The original files should still exist */

      assetPaths.forEach(function(path) {
        assertFileExists(directory, path);
      });

      /* But so should new app.js and app.css files */

      assertFileExists(directory, getOutputPath('js'));
      assertFileExists(directory, getOutputPath('css'));

      assertFileExists(directory, getOutputPath('map', 'dummy'));
      assertFileExists(directory, getOutputPath('map', 'vendor'));
      assertFileExists(directory, getOutputPath('map'));
    });
  });

  it('concats JS and CSS and removes originals', function() {
    return buildWithOptions({
      js: {
        concat: true,
        preserveOriginal: false
      },
      css: {
        concat: true,
        preserveOriginal: false
      }
    }).then(function(results) {
      var directory = results.directory;

      /* The original files should still exist */

      assetPaths.forEach(function(path) {
        assertFileDoesNotExist(directory, path);
      });

      /* But so should new app.js and app.css files */

      assertFileExists(directory, getOutputPath('js'));
      assertFileExists(directory, getOutputPath('css'));
      assertFileExists(directory, getOutputPath('map'));
    });
  });
});
