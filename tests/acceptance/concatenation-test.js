var assertFileExists = require('../helpers/assert-file-exists');
var broccoli = require('broccoli');
var emberCliConcat = require('../..'); // index.js
var root = process.cwd();
var builder, currentOptions;

// var setHtmlTags = emberCliConcat.contentFor // function(contentForType)
// var setOptions = emberCliConcat.included; // function(app)
// var concatTree = emberCliConcat.postprocessTree; // function(type, tree)


function setOptions(env, options) {
  env = env || 'development';
  options = options || {};

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

  currentOptions = {
    env: env,
    options: options
  };

  emberCliConcat.included(currentOptions);
}

function concatTree(type, tree) {
  return emberCliConcat.postprocessTree('all', 'dist');
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
    setOptions();

    builder = new broccoli.Builder(concatTree());

    return builder.build().then(function(results) {
      var directory = results.directory;

      assertFileExists(directory, '/assets/dummy.css');
    });
  });
});
