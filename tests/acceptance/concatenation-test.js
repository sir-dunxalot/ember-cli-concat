var assertFileExists = require('../helpers/assert-file-exists');
var broccoli = require('broccoli');
var emberCliConcat = require('../..'); // index.js
var root = process.cwd();
var builder, currentOptions;

function setOptions(options, environment) {
  options = options || {};
  environment = environment || 'development';

  /* Default from https://github.com/ember-cli/ember-cli/blob/master/lib/broccoli/ember-app.js */

  options.outputPaths = {
    app: {
      html: 'index.html',
      css: {
        'app': '/assets/dummy.css'
      },
      js: '/assets/dummy.js'
    },
    vendor: {
      css: '/assets/vendor.css',
      js: '/assets/vendor.js'
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

function buildWithOptions(options, environment) {
  setOptions(options, environment);

  builder = new broccoli.Builder(concatTree());

  return builder.build();
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
      var outputPaths = currentOptions.outputPaths;

      /* Check each file in the default output paths exists */

      for (var treeName in outputPaths) {
        var assets = outputPaths[treeName];

        ['css', 'js'].forEach(function(extension) {
         var paths = assets[extension];

         if (typeof paths === 'string') {
           assertFileExists(directory, paths);
         } else {
           for (var type in paths) {
             assertFileExists(directory, paths[type]);
           }
         }
        });
      }

    });
  });
});
