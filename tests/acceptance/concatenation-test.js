var assertFileExists = require('../helpers/assert-file-exists');
var broccoli = require('broccoli');
var emberCliConcat = require('../..'); // index.js
var root = process.cwd();
var builder, currentOptions;

// var setHtmlTags = emberCliConcat.contentFor // function(contentForType)
// var setOptions = emberCliConcat.included; // function(app)
// var concatTree = emberCliConcat.postprocessTree; // function(type, tree)


function setOptions(options, env) {
  options = options || {};
  env = env || 'development';

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

function concatTree() {
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
    setOptions({
      emberCliConcat: {
        js: {
          concat: true,
          preserveOriginal: false
        },
        css: {
          concat: true,
          preserveOriginal: false
        }
      }
    });

    builder = new broccoli.Builder(concatTree());

    return builder.build().then(function(results) {
      var directory = results.directory;
      var outputPaths = currentOptions.outputPaths;

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


  // it('compiles the correct files with default options', function() {
  //   setOptions({
  //     emberCliConcat: {
  //       js: {
  //         concat: true,
  //         preserveOriginal: false
  //       },
  //       css: {
  //         concat: true,
  //         preserveOriginal: false
  //       }
  //     }
  //   });

  //   console.log(emberCliConcat)

  //   builder = new broccoli.Builder(concatTree());

  //   return builder.build().then(function(results) {
  //     var directory = results.directory;

  //     // console.log(fs.readdirSync(directory + '/assets'));

  //     assertFileExists(directory, '/assets/app.css');
  //   });
  // });
