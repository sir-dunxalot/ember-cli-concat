var assertFileExists = require('../helpers/assert-file-exists');
var tmp = require('tmp-sync');
var path = require('path');
var root = process.cwd();
var tmproot = path.join(root, 'tmp');
var emberCliConcat = require('../..'); // index.js
var broccoli = require('broccoli');
var ember = require('../helpers/ember');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var funnel = require('broccoli-funnel');
var builder, tree;

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

  emberCliConcat.included({
    env: env,
    options: options
  });
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
    tree = concatTree();

    builder = new broccoli.Builder(tree);

    return builder.build().then(function(results) {
      console.log(results);
    });
  });
});
