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
  setOptions({
    emberCliConcat: concatOptions
  }, environment);

  builder = new broccoli.Builder(concatTree());

  return builder.build();
}

function getOutputPath(ext) {
  return '/' + emberCliConcat.outputDir + '/' + emberCliConcat.outputFileName + '.' + ext;
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
    });
  });
});
